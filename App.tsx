
import React from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import FindSchemes from './pages/FindSchemes';
import SchemeDetails from './pages/SchemeDetails';
import Auth from './pages/Auth';
import HowItWorks from './pages/HowItWorks';
import FAQs from './pages/FAQs';
import Settings from './pages/Settings';
import ChatWidget from './components/ChatWidget';

// Helper to scroll to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const App: React.FC = () => {
  return (
    <Router>
      <ScrollToTop />
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/find-schemes" element={<FindSchemes />} />
            <Route path="/scheme/:id" element={<SchemeDetails />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/faqs" element={<FAQs />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </main>
        <Footer />
        <ChatWidget />
      </div>
    </Router>
  );
};

export default App;
