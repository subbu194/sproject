import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import HeroSection from '../components/HeroSection';
import StoryPreview from './sections/StoryPreview';
import DailyLogPreview from './sections/DailyLogPreview';
import ThoughtsPreview from './sections/ThoughtsPreview';
import PressPreview from './sections/PressPreview';
import AchievementsPreview from './sections/AchievementsPreview';
import ConnectPreview from './sections/ConnectPreview';

export default function Home() {
  const { hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const el = document.getElementById(hash.replace('#', ''));
      if (el) setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [hash]);

  return (
    <>
      {/* Hero */}
      <div className="mx-auto max-w-7xl px-6 py-16 lg:py-24">
        <HeroSection />
      </div>

      {/* Sections */}
      <div className="space-y-0">
        <StoryPreview />
        <DailyLogPreview />
        <ThoughtsPreview />
        <PressPreview />
        <AchievementsPreview />
        <ConnectPreview />
      </div>
    </>
  );
}
