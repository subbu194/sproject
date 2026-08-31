import { useEffect, useState } from 'react';
import apiClient from '../../api/client';
import PressCarousel, { type PressItem } from '../../components/PressCarousel';
import { DEMO_PRESS, PRESS_IMAGES } from '../../constants/placeholders';

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

  // Merge API data with fallback images — same logic as before
  const items: PressItem[] = press.length > 0
    ? press.slice(0, 8).map((p, i) => ({
        ...p,
        link: p.link || p.url,
        images:
          p.images && p.images.length > 0
            ? p.images
            : [PRESS_IMAGES[i % PRESS_IMAGES.length]],
      }))
    : (DEMO_PRESS as PressItem[]);

  if (loading) {
    return (
      <section id="press" className="scroll-mt-24 py-20 lg:py-28 press-carousel-section overflow-hidden">
        <div className="mx-auto max-w-7xl px-6">
          {/* Header skeleton */}
          <div className="mb-12">
            <div className="skeleton h-3 w-24 rounded-full mb-3" />
            <div className="skeleton h-8 w-52 rounded-xl" />
          </div>
          {/* Cards skeleton */}
          <div className="flex items-center justify-center gap-4">
            <div className="skeleton press-slot-side rounded-2xl" style={{ height: 260 }} />
            <div className="skeleton press-slot-center rounded-3xl" style={{ height: 360 }} />
            <div className="skeleton press-slot-side rounded-2xl" style={{ height: 260 }} />
          </div>
        </div>
      </section>
    );
  }

  return <PressCarousel items={items} />;
}
