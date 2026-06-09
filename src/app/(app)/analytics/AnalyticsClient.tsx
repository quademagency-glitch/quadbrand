"use client";

import { useState, useEffect } from "react";
import { Loader2, TrendingUp, BarChart, PieChart as PieChartIcon } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart as RechartsBarChart,
  Bar,
} from "recharts";

const COLORS = ["#00F0FF", "#FF00FF", "#7000FF", "#FFAA00", "#FF0055"];

export default function AnalyticsClient() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/analytics")
      .then((res) => res.json())
      .then((json) => {
        // Format dates for the chart
        const formattedOverTime = (json.generationsOverTime || []).map((item: any) => ({
          ...item,
          date: new Date(item.date).toLocaleDateString(undefined, { month: "short", day: "numeric" }),
          count: parseInt(item.count, 10),
        }));

        const formattedPerBrand = (json.generationsPerBrand || []).map((item: any) => ({
          name: item.name || "No Brand",
          value: parseInt(item.count, 10),
        }));

        const formattedRatios = (json.topAspectRatios || []).map((item: any) => ({
          ratio: item.ratio,
          count: parseInt(item.count, 10),
        }));

        setData({
          generationsOverTime: formattedOverTime,
          generationsPerBrand: formattedPerBrand,
          topAspectRatios: formattedRatios,
        });
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-[var(--accent-cyan)]" />
      </div>
    );
  }

  if (!data) return <p>Failed to load analytics.</p>;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Chart 1: Generations Over Time */}
      <div className="glass-card p-6 lg:col-span-2">
        <div className="flex items-center gap-3 mb-6">
          <TrendingUp className="w-5 h-5 text-[var(--accent-cyan)]" />
          <h2 className="text-lg font-bold" style={{ fontFamily: "var(--font-outfit), sans-serif" }}>Generations Over Time (Last 30 Days)</h2>
        </div>
        <div className="h-[300px] w-full">
          {data.generationsOverTime.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.generationsOverTime}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--accent-cyan)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="var(--accent-cyan)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="date" stroke="var(--text-tertiary)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--text-tertiary)" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border)", borderRadius: "12px" }}
                  itemStyle={{ color: "var(--text-primary)" }}
                />
                <Area type="monotone" dataKey="count" stroke="var(--accent-cyan)" strokeWidth={3} fillOpacity={1} fill="url(#colorCount)" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-[var(--text-tertiary)]">
              No generation data yet.
            </div>
          )}
        </div>
      </div>

      {/* Chart 2: Per Brand */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-3 mb-6">
          <PieChartIcon className="w-5 h-5 text-[var(--accent-magenta)]" />
          <h2 className="text-lg font-bold" style={{ fontFamily: "var(--font-outfit), sans-serif" }}>Generations by Brand</h2>
        </div>
        <div className="h-[250px] w-full">
          {data.generationsPerBrand.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.generationsPerBrand}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {data.generationsPerBrand.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border)", borderRadius: "12px" }}
                  itemStyle={{ color: "var(--text-primary)" }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-[var(--text-tertiary)]">
              No data.
            </div>
          )}
        </div>
        {/* Legend */}
        <div className="flex flex-wrap gap-4 justify-center mt-4">
          {data.generationsPerBrand.map((entry: any, index: number) => (
            <div key={entry.name} className="flex items-center gap-2 text-sm">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
              <span className="text-[var(--text-secondary)]">{entry.name} ({entry.value})</span>
            </div>
          ))}
        </div>
      </div>

      {/* Chart 3: Top Aspect Ratios */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-3 mb-6">
          <BarChart className="w-5 h-5 text-[var(--accent-purple)]" />
          <h2 className="text-lg font-bold" style={{ fontFamily: "var(--font-outfit), sans-serif" }}>Top Aspect Ratios</h2>
        </div>
        <div className="h-[250px] w-full">
          {data.topAspectRatios.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <RechartsBarChart data={data.topAspectRatios}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="ratio" stroke="var(--text-tertiary)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--text-tertiary)" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border)", borderRadius: "12px" }}
                  cursor={{ fill: "var(--bg-secondary)" }}
                />
                <Bar dataKey="count" fill="var(--accent-purple)" radius={[4, 4, 0, 0]} />
              </RechartsBarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-[var(--text-tertiary)]">
              No data.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
