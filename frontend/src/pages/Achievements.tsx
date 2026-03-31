import { useEffect, useState } from 'react';
import apiClient from '../api/client';
import SectionPageShell from '../components/SectionPageShell';
import AchievementCard from '../components/AchievementCard';

interface Achievement {
  _id: string;
  icon?: string;
  title: string;
  description: string;
  year: string;
  images?: string[];
}

export default function Achievements() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient
      .get('/achievements')
      .then((res) => {
        const data = res.data?.data || res.data || [];
        setAchievements(Array.isArray(data) ? data : []);
      })
      .catch(() => setAchievements([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <SectionPageShell
      kicker="Achievements"
      title="Milestones & Recognition"
      subtitle="Key achievements and milestones along the way."
    >
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="skeleton h-28 w-full rounded-2xl" />
          ))}
        </div>
      ) : achievements.length > 0 ? (
        <div className="space-y-4">
          {achievements.map((a) => (
            <AchievementCard key={a._id} icon={a.icon} title={a.title} description={a.description} year={a.year} images={a.images} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-[var(--brown)]/8 bg-[var(--card-bg)] p-10 text-center text-sm text-[var(--muted)]">
          No achievements listed yet.
        </div>
      )}
    </SectionPageShell>
  );
}
