import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import apiClient from '../../api/client';
import AchievementCard from '../../components/AchievementCard';
import { DEMO_ACHIEVEMENTS, ACHIEVEMENT_IMAGES } from '../../constants/placeholders';

interface Achievement {
  _id: string;
  icon?: string;
  title: string;
  description: string;
  year: string;
  images?: string[];
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

  const items = achievements.length > 0
    ? achievements.slice(0, 4).map((a, i) => ({
        ...a,
        images: a.images && a.images.length > 0 ? a.images : [ACHIEVEMENT_IMAGES[i % ACHIEVEMENT_IMAGES.length]],
      }))
    : DEMO_ACHIEVEMENTS;

  return (
    <section id="achievements" className="scroll-mt-24 bg-[var(--cream)] py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.28em] text-[var(--gold)]">
              <span className="inline-block h-px w-6 bg-[var(--gold)]" />
              Achievements
            </div>
            <h2 className="mt-3 font-['Playfair_Display'] text-3xl font-bold tracking-tight text-[var(--brown)] sm:text-4xl">
              Milestones & Recognition
            </h2>
          </div>
          <NavLink
            to="/page/achievements"
            className="group inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--gold)] transition hover:text-[var(--gold-light)]"
          >
            View All
            <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
          </NavLink>
        </div>

        {loading ? (
          <div className="mt-8 space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="skeleton h-28 w-full rounded-2xl" />
            ))}
          </div>
        ) : (
          <div className="mt-8 space-y-4">
            {items.map((a) => (
              <AchievementCard
                key={a._id}
                icon={a.icon}
                title={a.title}
                description={a.description}
                year={a.year}
                images={a.images}
                readMoreLink="/page/achievements"
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
