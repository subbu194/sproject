import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import apiClient from '../../api/client';
import PressRow from '../../components/PressRow';
import { DEMO_PRESS, PRESS_IMAGES } from '../../constants/placeholders';

interface PressItem {
  _id: string;
  outlet: string;
  title: string;
  year: string;
  link?: string;
  url?: string;
  images?: string[];
}

export default function PressPreview() {
  const [press, setPress] = useState<PressItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient
      .get('/press')
      .then((res) => {
        const data = res.data?.data || res.data || [];
        setPress(Array.isArray(data) ? data : []);
      })
      .catch(() => setPress([]))
      .finally(() => setLoading(false));
  }, []);

  const items: PressItem[] = press.length > 0
    ? press.slice(0, 5).map((p, i) => ({
        ...p,
        link: p.link || p.url,
        images: p.images && p.images.length > 0 ? p.images : [PRESS_IMAGES[i % PRESS_IMAGES.length]],
      }))
    : DEMO_PRESS;

  return (
    <section id="press" className="scroll-mt-24 bg-[var(--warm-white)] py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.28em] text-[var(--gold)]">
              <span className="inline-block h-px w-6 bg-[var(--gold)]" />
              Press & Media
            </div>
            <h2 className="mt-3 font-['Playfair_Display'] text-3xl font-bold tracking-tight text-[var(--brown)] sm:text-4xl">
              In the News
            </h2>
          </div>
          <NavLink
            to="/page/press"
            className="group inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--gold)] transition hover:text-[var(--gold-light)]"
          >
            View All
            <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
          </NavLink>
        </div>

        {loading ? (
          <div className="mt-8 space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="skeleton h-16 w-full rounded-2xl" />
            ))}
          </div>
        ) : (
          <div className="mt-8 space-y-3">
            {items.map((p) => (
              <PressRow
                key={p._id}
                outlet={p.outlet}
                title={p.title}
                year={p.year}
                link={p.link}
                images={p.images}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
