import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { query } from '@/lib/db/client'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  // if "next" is in param, use it as the redirect URL
  const next = searchParams.get('next') ?? '/dashboard'

  if (code) {
    const supabase = await createClient()
    const { error, data } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error && data?.user) {
      const user = data.user;
      
      try {
        // 1. Ensure user profile exists
        const { rows: profileRows } = await query(
          "SELECT id FROM user_profiles WHERE id = $1",
          [user.id]
        );
        
        let fullName = user.user_metadata?.full_name || 'Creator';

        if (profileRows.length === 0) {
          await query(
            "INSERT INTO user_profiles (id, email, full_name) VALUES ($1, $2, $3) ON CONFLICT (id) DO NOTHING",
            [user.id, user.email, fullName]
          );
        }

        // 2. Ensure default workspace exists
        const { rows: workspaceRows } = await query(
          "SELECT id FROM workspaces WHERE owner_id = $1 LIMIT 1",
          [user.id]
        );

        if (workspaceRows.length === 0) {
          const { rows: newWorkspaces } = await query(
            "INSERT INTO workspaces (name, owner_id, credits_pool) VALUES ($1, $2, 20) RETURNING id",
            [`${fullName}'s Workspace`, user.id]
          );

          // Give signup bonus
          if (newWorkspaces.length > 0) {
            const workspaceId = newWorkspaces[0].id;
            
            await query(
              "INSERT INTO credit_transactions (workspace_id, user_id, amount, reason) VALUES ($1, $2, 20, 'signup_bonus')",
              [workspaceId, user.id]
            );

            // Handle referral if ref param exists
            const refParam = searchParams.get('ref');
            if (refParam && refParam !== user.id) {
              try {
                // 1. Check if referrer exists
                const { rows: referrerRows } = await query(
                  "SELECT id FROM workspaces WHERE owner_id = $1 LIMIT 1",
                  [refParam]
                );

                if (referrerRows.length > 0) {
                  const referrerWorkspaceId = referrerRows[0].id;

                  // 2. Insert referral record
                  await query(
                    "INSERT INTO referrals (referrer_id, referred_id) VALUES ($1, $2) ON CONFLICT DO NOTHING",
                    [refParam, user.id]
                  );

                  // 3. Give 50 credits to referred user (new user)
                  await query(
                    "UPDATE workspaces SET credits_pool = credits_pool + 50 WHERE id = $1",
                    [workspaceId]
                  );
                  await query(
                    "INSERT INTO credit_transactions (workspace_id, user_id, amount, reason) VALUES ($1, $2, 50, 'bonus')",
                    [workspaceId, user.id]
                  );

                  // 4. Give 50 credits to referrer
                  await query(
                    "UPDATE workspaces SET credits_pool = credits_pool + 50 WHERE id = $1",
                    [referrerWorkspaceId]
                  );
                  await query(
                    "INSERT INTO credit_transactions (workspace_id, user_id, amount, reason) VALUES ($1, $2, 50, 'bonus')",
                    [referrerWorkspaceId, refParam]
                  );
                }
              } catch (refErr) {
                console.error("Referral processing failed:", refErr);
              }
            }
          }
        }
      } catch (dbErr) {
        console.error("Error provisioning user data on login:", dbErr);
        // Continue login anyway
      }

      const forwardedHost = request.headers.get('x-forwarded-host') // original origin before load balancer
      const isLocalEnv = process.env.NODE_ENV === 'development'
      if (isLocalEnv) {
        // we can be sure that there is no load balancer in between, so no need to watch for X-Forwarded-Host
        return NextResponse.redirect(`${origin}${next}`)
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`)
      } else {
        return NextResponse.redirect(`${origin}${next}`)
      }
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/login?error=Invalid+or+expired+magic+link`)
}
