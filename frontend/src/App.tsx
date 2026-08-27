import { useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AppRouter from './Router';
import SmoothScroller from './components/SmoothScroller';
import CustomCursor from './components/CustomCursor';

export default function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <SmoothScroller>
      <CustomCursor />
      {!isAdminRoute && <Navbar />}
      <main className="min-h-screen">
        <AppRouter />
      </main>
      {!isAdminRoute && <Footer />}
    </SmoothScroller>
  );
}
