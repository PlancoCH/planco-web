import { useState, useEffect, useMemo } from "react";
import { Cpu, Bell } from "lucide-react";
import PageContainer from "../components/ui/PageContainer";
import StatCard from "../components/ui/StatCard";
import HealthGauge from "../components/ui/HealthGauge";
import DistributionBar from "../components/ui/DistributionBar";
import { useAuth } from "../context/AuthContext";
import { getStats } from "../api/stats";
import type { StatsResponse } from "../types/stats";
import PageTitle from "../components/ui/PageTitle";

const GREETINGS: { sub: string }[] = [
  { sub: "Your greenhouse is thriving." },
  { sub: "Your plants are looking great today." },
  { sub: "Here's how your garden is doing." },
  { sub: "Everything is growing nicely." },
  { sub: "Your indoor jungle is flourishing." },
  { sub: "The garden is at its best." },
];

function getGreeting(firstName: string) {
  const hour = new Date().getHours();
  const timeGreeting =
    hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  const pick = GREETINGS[Math.floor(Math.random() * GREETINGS.length)];
  return {
    heading: `${timeGreeting}, ${firstName || "Gardener"}!`,
    sub: pick.sub,
  };
}

export default function Home() {
  const { user } = useAuth();
  const [stats, setStats] = useState<StatsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const greeting = useMemo(() => {
    const name = user?.name ?? "";
    const firstName = name.split(" ")[0];
    return getGreeting(firstName);
  }, [user?.name]);

  useEffect(() => {
    let cancelled = false;

    getStats()
      .then((data) => {
        if (cancelled) return;
        setStats(data);
        setLoading(false);
      })
      .catch(() => {
        if (cancelled) return;
        setError("Failed to load dashboard data.");
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const onlineDevices = stats?.devices.list.filter((d) => d.online).length ?? 0;

  return (
    <PageContainer>
      <PageTitle title={greeting.heading} subtitle={greeting.sub} />

      {loading && (
        <div className="flex items-center justify-center py-20">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-2 border-forest-DEFAULT border-t-transparent rounded-full animate-spin" />
            <p className="text-forest-500 text-sm">Loading dashboard...</p>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-6 text-center">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {stats && !loading && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="lg:col-span-2 bg-beige-50 rounded-2xl border border-beige-300 p-6 sm:p-8 flex flex-col items-center">
              <p className="text-xs text-forest-400 uppercase tracking-wide mb-2 self-start">
                Average Plant Score
              </p>
              <HealthGauge
                score={stats.health.average_plant_score}
                size={160}
                strokeWidth={12}
              />
            </div>

            <div className="lg:col-span-2 bg-beige-50 rounded-2xl border border-beige-300 p-6 sm:p-8">
              <p className="text-xs text-forest-400 uppercase tracking-wide mb-4">
                Plant Health Distribution
              </p>
              <DistributionBar distribution={stats.health.distribution} />
            </div>

            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <StatCard
                icon={Bell}
                label="Unread Insights"
                value={stats.unread_insights}
                subtitle={
                  stats.unread_insights > 0
                    ? "Needs attention"
                    : "All caught up"
                }
                accent={stats.unread_insights > 0 ? "amber" : "forest"}
              />
              <StatCard
                icon={Cpu}
                label="Devices"
                value={stats.devices.total}
                subtitle={`${onlineDevices} online`}
                accent="forest"
              />
            </div>
          </div>
        </div>
      )}
    </PageContainer>
  );
}
