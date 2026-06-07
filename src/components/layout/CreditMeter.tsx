"use client";

interface CreditMeterProps {
  used: number;
  total: number;
}

export default function CreditMeter({ used, total }: CreditMeterProps) {
  const remaining = total - used;
  const percentage = (used / total) * 100;
  const isLow = percentage > 80;

  return (
    <div
      className="bg-[var(--bg-secondary)] rounded-xl p-3.5 border border-[var(--border)]"
      id="credit-meter"
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-[var(--text-secondary)]">
          Credits
        </span>
        <span
          className={`text-xs font-bold ${
            isLow ? "text-[var(--warning)]" : "text-[var(--text-primary)]"
          }`}
        >
          {remaining} left
        </span>
      </div>

      {/* Progress Bar */}
      <div className="h-2 bg-[var(--bg-elevated)] rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500 ease-out"
          style={{
            width: `${percentage}%`,
            background: isLow
              ? "var(--warning)"
              : "var(--gradient-primary)",
          }}
        />
      </div>

      <p className="text-[10px] text-[var(--text-tertiary)] mt-1.5">
        {used} of {total} credits used
      </p>

      {isLow && (
        <button className="w-full mt-2 text-xs font-semibold text-[var(--accent-cyan)] hover:underline">
          Upgrade for more →
        </button>
      )}
    </div>
  );
}
