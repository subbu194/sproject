import { useEffect, useState } from 'react';
import apiClient from '../api/client';
import SectionPageShell from '../components/SectionPageShell';
import PressRow from '../components/PressRow';

interface PressItem {
  _id: string;
  outlet: string;
  title: string;
  year: string;
  url?: string;
  images?: string[];
}

export default function Press() {
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
    <SectionPageShell
      kicker="Press & Media"
      title="In the News"
      subtitle="Coverage, interviews, and media mentions."
    >
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="skeleton h-16 w-full rounded-2xl" />
          ))}
        </div>
      ) : press.length > 0 ? (
        <div className="space-y-3">
          {press.map((p) => (
            <PressRow key={p._id} outlet={p.outlet} title={p.title} year={p.year} link={p.url} images={p.images} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-[var(--brown)]/8 bg-[var(--card-bg)] p-10 text-center text-sm text-[var(--muted)]">
          No press mentions yet.
        </div>
      )}
    </SectionPageShell>
  );
}
