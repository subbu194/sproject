import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import apiClient from '../../api/client';
import AchievementCard from '../../components/AchievementCard';

interface Achievement {
  _id: string;
  icon?: string;
  title: string;
  description: string;
  year: string;
}

export default function AchievementsPreview() {
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
    <section id="achievements" className="scroll-mt-24 bg-[var(--warm-white)] py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--gold)]">
              Achievements
            </div>
            <h2 className="mt-2 font-['Playfair_Display'] text-3xl font-bold tracking-tight text-[var(--brown)] sm:text-4xl">
              Milestones & Recognition
            </h2>
          </div>
          <NavLink
            to="/page/achievements"
            className="text-sm font-semibold text-[var(--gold)] transition hover:text-[var(--gold-light)]"
          >
            View All →
          </NavLink>
        </div>

        {loading ? (
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="skeleton h-36 w-full rounded-2xl" />
            ))}
          </div>
        ) : achievements.length > 0 ? (
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {achievements.slice(0, 4).map((a) => (
              <AchievementCard key={a._id} icon={a.icon} title={a.title} description={a.description} year={a.year} />
            ))}
          </div>
        ) : (
          <div className="mt-8 rounded-2xl border border-[var(--brown)]/8 bg-[var(--card-bg)] p-10 text-center text-sm text-[var(--muted)]">
            No achievements listed yet.
          </div>
        )}
      </div>
    </section>
  );
}
