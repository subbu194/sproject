import HeroSection from '../components/HeroSection';
import StoryPreview from './sections/StoryPreview';
import DailyLogPreview from './sections/DailyLogPreview';
// import ThoughtsPreview from './sections/ThoughtsPreview';
import PressPreview from './sections/PressPreview';
// import AchievementsPreview from './sections/AchievementsPreview';
import ConnectPreview from './sections/ConnectPreview';

export default function Home() {
  return (
    <>
      {/* Hero */}
      <div >
        <HeroSection />
      </div>

      {/* Sections */}
      <div >
        <StoryPreview />
        <DailyLogPreview />
        {/* <ThoughtsPreview /> */}
        <PressPreview />
        {/* <AchievementsPreview /> */}
        <ConnectPreview />
      </div>
    </>
  );
}
