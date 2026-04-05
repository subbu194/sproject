import { useEffect, useState } from 'react';
import { useParams, NavLink } from 'react-router-dom';
import apiClient from '../api/client';
import SectionPageShell from '../components/SectionPageShell';
import OptimizedImage from '../components/OptimizedImage';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

interface LogItem {
  _id: string;
  date: string;
  title: string;
  body: string;
  tags?: string[];
  images?: string[];
  imageBlurUrls?: string[];
}

function formatBody(text: string): React.ReactNode[] {
  const elements: React.ReactNode[] = [];
  const lines = text.split('\n');
  let key = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    if (!line) {
      continue;
    }

    const h1Match = line.match(/^#\s+(.+)$/);
    const h2Match = line.match(/^##\s+(.+)$/);
    const h3Match = line.match(/^###\s+(.+)$/);

    if (h1Match) {
      elements.push(
        <h4 key={key++} className="mt-6 mb-3 text-xl font-bold text-[var(--brown)] first:mt-0">
          {h1Match[1]}
        </h4>
      );
    } else if (h2Match) {
      elements.push(
        <h5 key={key++} className="mt-5 mb-2 text-lg font-bold text-[var(--brown)] first:mt-0">
          {h2Match[1]}
        </h5>
      );
    } else if (h3Match) {
      elements.push(
        <h6 key={key++} className="mt-4 mb-2 text-base font-bold text-[var(--brown-light)] first:mt-0">
          {h3Match[1]}
        </h6>
      );
    } else if (line.startsWith('- ') || line.startsWith('* ')) {
      elements.push(
        <li key={key++} className="ml-5 text-base leading-relaxed text-[var(--muted)] list-disc">
          {line.slice(2)}
        </li>
      );
    } else if (/^\d+\.\s/.test(line)) {
      const content = line.replace(/^\d+\.\s/, '');
      elements.push(
        <li key={key++} className="ml-5 text-base leading-relaxed text-[var(--muted)] list-decimal">
          {content}
        </li>
      );
    } else {
      const formattedLine = line
        .replace(/\s+/g, ' ')
        .replace(/\s*,\s*/g, ', ')
        .replace(/\s*\.\s*/g, '. ')
        .replace(/\s*:\s*/g, ': ')
        .replace(/\s*;\s*/g, '; ')
        .replace(/\s*\?\s*/g, '? ')
        .replace(/\s*!\s*/g, '! ')
        .replace(/\s+$/, '');

      elements.push(
        <p key={key++} className="mt-3 text-base leading-relaxed text-[var(--muted)] first:mt-0">
          {formattedLine}
        </p>
      );
    }
  }

  return elements;
}

const detailImg =
  'w-full h-auto max-h-[280px] sm:max-h-[320px] lg:max-h-[380px]';

function ImageCarousel({
  images,
  imageBlurUrls,
}: {
  images: string[];
  imageBlurUrls?: string[];
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const goNext = () => setCurrentIndex((prev) => (prev + 1) % images.length);
  const goPrev = () => setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  const goToSlide = (index: number) => setCurrentIndex(index);

  const openLightbox = () => setLightboxOpen(true);
  const closeLightbox = () => setLightboxOpen(false);

  // Auto-scroll every 4 seconds when not paused
  useEffect(() => {
    if (images.length <= 1 || isPaused) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [images.length, isPaused]);

  if (images.length === 0) return null;

  // Single image - compact display
  if (images.length === 1) {
    return (
      <div 
        className="relative group cursor-pointer"
        onClick={openLightbox}
      >
        <div className="relative overflow-hidden rounded-xl sm:rounded-2xl bg-gradient-to-b from-[var(--warm-white)] to-[var(--cream)]/50">
          <OptimizedImage
            src={images[0]}
            blurSrc={imageBlurUrls?.[0]}
            alt="Log entry image"
            fit="contain"
            loading="eager"
            fetchPriority="high"
            imgClassName={`${detailImg} transition-transform duration-500 group-hover:scale-[1.02]`}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
        <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm text-[var(--brown)] text-xs font-medium px-3 py-1.5 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300">
          🔍 View full size
        </div>
        {lightboxOpen && (
          <Lightbox
            images={images}
            imageBlurUrls={imageBlurUrls}
            currentIndex={0}
            onClose={closeLightbox}
            onNext={goNext}
            onPrev={goPrev}
          />
        )}
      </div>
    );
  }

  // Multiple images - compact carousel
  return (
    <div 
      className="relative"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Main carousel container */}
      <div className="relative overflow-hidden rounded-xl sm:rounded-2xl bg-gradient-to-b from-[var(--warm-white)] to-[var(--cream)]/50 shadow-lg">
        {/* Image container */}
        <div 
          className="relative w-full cursor-pointer group"
          onClick={openLightbox}
        >
          <OptimizedImage
            key={currentIndex}
            src={images[currentIndex]}
            blurSrc={imageBlurUrls?.[currentIndex]}
            alt={`Image ${currentIndex + 1} of ${images.length}`}
            fit="contain"
            loading="eager"
            fetchPriority="high"
            imgClassName={`${detailImg} transition-all duration-500 ease-out`}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        {/* Navigation arrows - responsive sizing */}
        <button 
          onClick={(e) => { e.stopPropagation(); goPrev(); }}
          className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/95 backdrop-blur-sm p-2 sm:p-3 text-[var(--brown)] shadow-xl hover:bg-white hover:scale-110 active:scale-95 transition-all duration-200 z-10"
        >
          <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
        </button>
        <button 
          onClick={(e) => { e.stopPropagation(); goNext(); }}
          className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/95 backdrop-blur-sm p-2 sm:p-3 text-[var(--brown)] shadow-xl hover:bg-white hover:scale-110 active:scale-95 transition-all duration-200 z-10"
        >
          <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
        </button>

        {/* Top info bar */}
        <div className="absolute top-0 left-0 right-0 flex items-center justify-between p-3 sm:p-4 bg-gradient-to-b from-black/40 to-transparent">
          <div className="flex items-center gap-2">
            {!isPaused && (
              <div className="bg-[var(--gold)] text-white text-xs font-medium px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg">
                <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                Auto
              </div>
            )}
          </div>
          <div className="bg-white/95 backdrop-blur-sm text-[var(--brown)] text-sm font-bold px-4 py-1.5 rounded-full shadow-lg">
            {currentIndex + 1} / {images.length}
          </div>
        </div>

        {/* Bottom hint */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-sm text-[var(--brown)] text-xs sm:text-sm font-medium px-4 py-2 rounded-full shadow-lg opacity-70 hover:opacity-100 transition-opacity">
          Click image to view full size
        </div>
      </div>

      {/* Progress dots - responsive */}
      <div className="flex justify-center gap-1.5 sm:gap-2 mt-4 sm:mt-6 px-4">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-2 sm:h-2.5 rounded-full transition-all duration-300 ${
              index === currentIndex 
                ? 'w-6 sm:w-8 bg-[var(--gold)] shadow-md' 
                : 'w-2 sm:w-2.5 bg-[var(--brown)]/25 hover:bg-[var(--brown)]/50'
            }`}
          />
        ))}
      </div>

      {/* Thumbnail strip - responsive */}
      <div className="mt-4 sm:mt-6 px-2 sm:px-0">
        <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-thin scrollbar-thumb-[var(--brown)]/20 scrollbar-track-transparent">
          {images.map((img, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`flex-shrink-0 snap-start rounded-lg sm:rounded-xl overflow-hidden transition-all duration-300 ${
                index === currentIndex 
                  ? 'w-24 h-18 sm:w-28 sm:h-20 lg:w-32 lg:h-24 ring-2 ring-[var(--gold)] ring-offset-2 shadow-lg scale-105' 
                  : 'w-20 h-14 sm:w-24 sm:h-16 lg:w-28 lg:h-20 opacity-50 hover:opacity-90 hover:scale-102'
              }`}
            >
              <OptimizedImage
                src={img}
                blurSrc={imageBlurUrls?.[index]}
                alt={`Thumbnail ${index + 1}`}
                fit="cover"
                loading="lazy"
                imgClassName="h-full w-full"
              />
            </button>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <Lightbox
          images={images}
          imageBlurUrls={imageBlurUrls}
          currentIndex={currentIndex}
          onClose={closeLightbox}
          onNext={goNext}
          onPrev={goPrev}
        />
      )}
    </div>
  );
}

function Lightbox({
  images,
  imageBlurUrls,
  currentIndex,
  onClose,
  onNext,
  onPrev,
}: {
  images: string[];
  imageBlurUrls?: string[];
  currentIndex: number;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}) {
  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4"
      onClick={onClose}
    >
      <button 
        className="absolute top-4 right-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20 transition-colors z-10"
        onClick={onClose}
      >
        <X className="h-6 w-6" />
      </button>
      
      {images.length > 1 && (
        <>
          <button 
            className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white hover:bg-white/20 transition-colors z-10"
            onClick={(e) => { e.stopPropagation(); onPrev(); }}
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button 
            className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white hover:bg-white/20 transition-colors z-10"
            onClick={(e) => { e.stopPropagation(); onNext(); }}
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </>
      )}
      
      <div onClick={(e) => e.stopPropagation()} className="max-h-[90vh] max-w-[90vw]">
        <OptimizedImage
          key={`lb-${currentIndex}`}
          src={images[currentIndex]}
          blurSrc={imageBlurUrls?.[currentIndex]}
          alt=""
          fit="contain"
          loading="eager"
          fetchPriority="high"
          imgClassName="max-h-[90vh] max-w-[90vw] rounded-lg"
        />
      </div>
      
      {images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {images.map((_, index) => (
            <div
              key={index}
              className={`h-2 w-2 rounded-full transition-colors ${
                index === currentIndex ? 'bg-white' : 'bg-white/40'
              }`}
            />
          ))}
        </div>
      )}
      
      <div className="absolute bottom-4 right-4 text-white/70 text-sm font-medium">
        {currentIndex + 1} / {images.length}
      </div>
    </div>
  );
}

export default function LogDetail() {
  const { id } = useParams<{ id: string }>();
  const [log, setLog] = useState<LogItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!id) {
      setError(true);
      setLoading(false);
      return;
    }

    apiClient
      .get(`/log/${id}`)
      .then((res) => {
        const data = res.data?.data || res.data;
        setLog(data);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <SectionPageShell kicker="Daily Log" title="Loading..." subtitle="">
        <div className="skeleton h-64 w-full rounded-2xl" />
      </SectionPageShell>
    );
  }

  if (error || !log) {
    return (
      <SectionPageShell kicker="Daily Log" title="Not Found" subtitle="This log entry could not be found.">
        <NavLink 
          to="/page/daily-log" 
          className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--gold)] hover:text-[var(--gold-light)] transition-colors"
        >
          ← Back to Daily Log
        </NavLink>
      </SectionPageShell>
    );
  }

  const formattedDate = new Date(log.date).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <SectionPageShell kicker="Daily Log" title={log.title} subtitle={formattedDate}>
      <div className="w-full">
        {/* Back navigation */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
          <NavLink 
            to="/page/daily-log" 
            className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--gold)] hover:text-[var(--gold-light)] transition-colors"
          >
            ← Back to Daily Log
          </NavLink>
        </div>

        {/* Image Carousel - Compact */}
        {log.images && log.images.length > 0 && (
          <div className="w-full mb-8 sm:mb-10">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
              <ImageCarousel images={log.images} imageBlurUrls={log.imageBlurUrls} />
            </div>
          </div>
        )}

        {/* Content Section - Full Width */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Full Body Text */}
          <article className="bg-white rounded-2xl border border-[var(--brown)]/8 p-5 sm:p-8 lg:p-10 shadow-sm">
            <div className="prose prose-lg max-w-none text-left">
              {formatBody(log.body)}
            </div>
          </article>

          {/* Tags */}
          {log.tags && log.tags.length > 0 && (
            <div className="mt-8 sm:mt-10 pt-6 border-t border-[var(--brown)]/10">
              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--muted)] mb-4">
                Tags
              </div>
              <div className="flex flex-wrap gap-2 sm:gap-3">
                {log.tags.map((tag) => (
                  <NavLink
                    key={tag}
                    to={`/page/daily-log?tag=${encodeURIComponent(tag)}`}
                    className="rounded-full bg-[var(--cream)] px-4 sm:px-5 py-2 text-sm font-medium text-[var(--brown-light)] transition-all duration-200 hover:bg-[var(--gold)]/15 hover:text-[var(--gold)] hover:shadow-md"
                  >
                    {tag}
                  </NavLink>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </SectionPageShell>
  );
}
