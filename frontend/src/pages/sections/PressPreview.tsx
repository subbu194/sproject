import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import apiClient from '../../api/client';
import PressRow from '../../components/PressRow';

interface PressItem {
  _id: string;
  outlet: string;
  title: string;
  year: string;
  link?: string;
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

  return (
    <section id="press" className="scroll-mt-24 bg-[var(--cream)] py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--gold)]">
              Press & Media
            </div>
            <h2 className="mt-2 font-['Playfair_Display'] text-3xl font-bold tracking-tight text-[var(--brown)] sm:text-4xl">
              In the News
            </h2>
          </div>
          <NavLink
            to="/page/press"
            className="text-sm font-semibold text-[var(--gold)] transition hover:text-[var(--gold-light)]"
          >
            View All →
          </NavLink>
        </div>

        {loading ? (
          <div className="mt-8 space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="skeleton h-16 w-full rounded-2xl" />
            ))}
          </div>
        ) : press.length > 0 ? (
          <div className="mt-8 space-y-3">
            {press.slice(0, 5).map((p) => (
              <PressRow key={p._id} outlet={p.outlet} title={p.title} year={p.year} link={p.link} />
            ))}
          </div>
        ) : (
          <div className="mt-8 rounded-2xl border border-[var(--brown)]/8 bg-white p-10 text-center text-sm text-[var(--muted)]">
            No press mentions yet.
          </div>
        )}
      </div>
    </section>
  );
}
