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
            await query(
              "INSERT INTO credit_transactions (workspace_id, user_id, amount, reason) VALUES ($1, $2, 20, 'signup_bonus')",
              [newWorkspaces[0].id, user.id]
            );
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
