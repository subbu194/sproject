import { useEffect, useState } from 'react';
import { useParams, NavLink } from 'react-router-dom';
import apiClient from '../api/client';
import SectionPageShell from '../components/SectionPageShell';
import OptimizedImage from '../components/OptimizedImage';
import { ChevronLeft, ChevronRight, X, Tag } from 'lucide-react';

interface Thought {
  _id: string;
  topic: string;
  title: string;
  summary: string;
  images?: string[];
  imageBlurUrls?: string[];
  createdAt?: string;
}

/* ── Image Carousel (reused pattern from LogDetail) ── */
function ImageCarousel({
  images,
  imageBlurUrls,
}: {
  images: string[];
  imageBlurUrls?: string[];
}) {
  const [current, setCurrent] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const [paused, setPaused] = useState(false);

  const next = () => setCurrent((p) => (p + 1) % images.length);
  const prev = () => setCurrent((p) => (p - 1 + images.length) % images.length);

  useEffect(() => {
    if (images.length <= 1 || paused) return;
    const t = setInterval(next, 4000);
    return () => clearInterval(t);
  }, [images.length, paused]);

  if (images.length === 0) return null;

  if (images.length === 1) {
    return (
      <div className="relative group cursor-pointer" onClick={() => setLightbox(true)}>
        <div className="relative overflow-hidden rounded-2xl" style={{ backgroundColor: 'var(--warm-white)' }}>
          <OptimizedImage
            src={images[0]}
            blurSrc={imageBlurUrls?.[0]}
            alt="Thought image"
            fit="contain"
            loading="eager"
            fetchPriority="high"
            imgClassName="w-full h-auto max-h-[380px] transition-transform duration-500 group-hover:scale-[1.02]"
          />
        </div>
        <div className="absolute bottom-3 right-3 rounded-full bg-white/90 px-3 py-1.5 text-xs font-medium text-[var(--brown)] shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
          🔍 View full size
        </div>
        {lightbox && (
          <Lightbox images={images} imageBlurUrls={imageBlurUrls} current={current} onClose={() => setLightbox(false)} onNext={next} onPrev={prev} />
        )}
      </div>
    );
  }

  return (
    <div className="relative" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <div className="relative overflow-hidden rounded-2xl shadow-lg" style={{ backgroundColor: 'var(--warm-white)' }}>
        <div className="relative cursor-pointer group" onClick={() => setLightbox(true)}>
          <OptimizedImage
            key={current}
            src={images[current]}
            blurSrc={imageBlurUrls?.[current]}
            alt={`Image ${current + 1} of ${images.length}`}
            fit="contain"
            loading="eager"
            fetchPriority="high"
            imgClassName="w-full h-auto max-h-[380px] transition-all duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/10 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>

        {/* Arrows */}
        <button onClick={(e) => { e.stopPropagation(); prev(); }}
          className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/95 p-2.5 shadow-xl hover:bg-white hover:scale-110 active:scale-95 transition-all z-10"
          style={{ color: 'var(--brown)' }}>
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button onClick={(e) => { e.stopPropagation(); next(); }}
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/95 p-2.5 shadow-xl hover:bg-white hover:scale-110 active:scale-95 transition-all z-10"
          style={{ color: 'var(--brown)' }}>
          <ChevronRight className="h-5 w-5" />
        </button>

        {/* Counter */}
        <div className="absolute top-3 right-3 rounded-full bg-white/95 px-3 py-1 text-sm font-bold shadow" style={{ color: 'var(--brown)' }}>
          {current + 1} / {images.length}
        </div>
      </div>

      {/* Dots */}
      <div className="mt-4 flex justify-center gap-2">
        {images.map((_, i) => (
          <button key={i} onClick={() => setCurrent(i)}
            className="h-2 rounded-full transition-all duration-300"
            style={{
              width: i === current ? '2rem' : '0.5rem',
              backgroundColor: i === current ? 'var(--gold)' : 'rgba(44,26,14,0.2)',
            }}
          />
        ))}
      </div>

      {/* Thumbnails */}
      <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
        {images.map((img, i) => (
          <button key={i} onClick={() => setCurrent(i)}
            className="flex-shrink-0 overflow-hidden rounded-xl transition-all duration-300"
            style={{
              width: i === current ? '7rem' : '5.5rem',
              height: i === current ? '5rem' : '4rem',
              outline: i === current ? '2px solid var(--gold)' : 'none',
              outlineOffset: '2px',
              opacity: i === current ? 1 : 0.5,
            }}>
            <OptimizedImage src={img} blurSrc={imageBlurUrls?.[i]} alt={`Thumb ${i + 1}`} fit="cover" loading="lazy" imgClassName="h-full w-full" />
          </button>
        ))}
      </div>

      {lightbox && (
        <Lightbox images={images} imageBlurUrls={imageBlurUrls} current={current} onClose={() => setLightbox(false)} onNext={next} onPrev={prev} />
      )}
    </div>
  );
}

function Lightbox({ images, imageBlurUrls, current, onClose, onNext, onPrev }: {
  images: string[]; imageBlurUrls?: string[]; current: number;
  onClose: () => void; onNext: () => void; onPrev: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4" onClick={onClose}>
      <button className="absolute top-4 right-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20 transition-colors z-10" onClick={onClose}>
        <X className="h-6 w-6" />
      </button>
      {images.length > 1 && (
        <>
          <button className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white hover:bg-white/20 transition-colors z-10"
            onClick={(e) => { e.stopPropagation(); onPrev(); }}>
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white hover:bg-white/20 transition-colors z-10"
            onClick={(e) => { e.stopPropagation(); onNext(); }}>
            <ChevronRight className="h-6 w-6" />
          </button>
        </>
      )}
      <div onClick={(e) => e.stopPropagation()} className="max-h-[90vh] max-w-[90vw]">
        <OptimizedImage key={`lb-${current}`} src={images[current]} blurSrc={imageBlurUrls?.[current]} alt="" fit="contain" loading="eager" fetchPriority="high" imgClassName="max-h-[90vh] max-w-[90vw] rounded-lg" />
      </div>
      {images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {images.map((_, i) => (
            <div key={i} className={`h-2 w-2 rounded-full transition-colors ${i === current ? 'bg-white' : 'bg-white/40'}`} />
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Main Page ── */
export default function ThoughtDetail() {
  const { id } = useParams<{ id: string }>();
  const [thought, setThought] = useState<Thought | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!id) { setError(true); setLoading(false); return; }
    apiClient
      .get(`/thoughts/${id}`)
      .then((res) => setThought(res.data?.data || res.data))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <SectionPageShell kicker="Thoughts" title="Loading…" subtitle="">
        <div className="skeleton h-64 w-full rounded-2xl" />
      </SectionPageShell>
    );
  }

  if (error || !thought) {
    return (
      <SectionPageShell kicker="Thoughts" title="Not Found" subtitle="This thought could not be found.">
        <NavLink to="/page/thoughts" className="inline-flex items-center gap-2 text-sm font-semibold transition-colors" style={{ color: 'var(--gold)' }}>
          ← Back to Thoughts
        </NavLink>
      </SectionPageShell>
    );
  }

  const formattedDate = thought.createdAt
    ? new Date(thought.createdAt).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
    : thought.topic;

  return (
    <SectionPageShell kicker="Thoughts" title={thought.title} subtitle={formattedDate}>
      <div className="w-full space-y-8">
        {/* Back */}
        <NavLink to="/page/thoughts" className="inline-flex items-center gap-2 text-sm font-semibold transition-colors" style={{ color: 'var(--gold)' }}>
          ← Back to Thoughts
        </NavLink>

        {/* Topic badge */}
        <span
          className="inline-flex items-center gap-1.5 rounded-2xl px-4 py-1.5 text-[11px] font-black uppercase tracking-[0.2em]"
          style={{ backgroundColor: 'rgba(200,150,42,0.1)', color: 'var(--gold)', border: '1px solid rgba(200,150,42,0.25)' }}
        >
          <Tag className="h-3 w-3" />
          {thought.topic}
        </span>

        {/* Images */}
        {thought.images && thought.images.length > 0 && (
          <div className="max-w-3xl">
            <ImageCarousel images={thought.images} imageBlurUrls={thought.imageBlurUrls} />
          </div>
        )}

        {/* Summary */}
        <article
          className="rounded-3xl p-8 shadow-sm"
          style={{ backgroundColor: 'white', border: '1px solid rgba(44,26,14,0.08)' }}
        >
          <div className="prose prose-lg max-w-none">
            {thought.summary.split('\n').filter(Boolean).map((para, i) => (
              <p key={i} className="mt-4 text-base leading-relaxed first:mt-0" style={{ color: 'var(--muted)' }}>
                {para}
              </p>
            ))}
          </div>
        </article>
      </div>
    </SectionPageShell>
  );
}
