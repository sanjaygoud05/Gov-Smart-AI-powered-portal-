
import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, User, Menu, X, ChevronRight, LogOut, Settings, ChevronDown, Bookmark, LayoutDashboard } from 'lucide-react';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../lib/firebase';

const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const isActive = (path: string) => location.pathname === path;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setIsProfileOpen(false);
      navigate('/');
    } catch (err) {
      console.error("Error signing out: ", err);
    }
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Find Schemes', path: '/find-schemes' },
    { name: 'How It Works', path: '/how-it-works' },
    { name: 'FAQs', path: '/faqs' },
  ];

  const userDisplayName = user?.displayName || user?.email?.split('@')[0] || 'User';

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center gap-3">
              <div className="bg-navy p-2 rounded-xl shadow-lg shadow-navy/10">
                <span className="text-white font-black text-xl tracking-tighter">GS</span>
              </div>
              <div className="hidden sm:block">
                <span className="text-navy font-bold text-xl block leading-tight">Gov-Smart</span>
                <span className="text-[10px] text-orange-500 font-bold uppercase tracking-wider block">AI-Powered Portal</span>
              </div>
            </Link>
          </div>

          <div className="hidden lg:flex flex-1 justify-center">
            <div className="flex items-center gap-x-10">
              {navLinks.map((link) => (
                <Link 
                  key={link.path}
                  to={link.path} 
                  className={`relative py-2 text-sm font-bold transition-all duration-300 ${
                    isActive(link.path) 
                    ? 'text-navy' 
                    : 'text-gray-400 hover:text-navy'
                  }`}
                >
                  {link.name}
                  {isActive(link.path) && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-orange-primary rounded-full animate-in fade-in zoom-in duration-300"></span>
                  )}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-x-6">
            <div className="hidden md:flex items-center gap-x-6 pr-6 border-r border-gray-100">
              <button className="text-gray-400 hover:text-navy transition-colors" onClick={() => navigate('/find-schemes?tab=browse')}>
                <Search size={20} />
              </button>
            </div>
            
            {user ? (
              <div className="relative" ref={profileRef}>
                <button 
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 p-1 bg-gray-50 rounded-full border border-gray-200 hover:border-orange-200 transition-all hover:bg-white group overflow-hidden"
                >
                  <div className="relative w-9 h-9 bg-navy rounded-full flex items-center justify-center text-white">
                    <User size={18} />
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white shadow-sm"></div>
                  </div>
                  <ChevronDown size={14} className={`text-gray-400 mx-1.5 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="p-5 bg-gray-50/50 border-b border-gray-100">
                      <p className="text-sm font-bold text-navy truncate">{userDisplayName}</p>
                      <p className="text-xs text-gray-400 truncate">{user.email}</p>
                    </div>
                    <div className="p-2">
                      <Link to="/dashboard" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-3 px-4 py-3 text-sm font-semibold text-gray-600 hover:bg-gray-50 hover:text-navy rounded-xl transition-all">
                        <LayoutDashboard size={18} /> My Dashboard
                      </Link>
                      <Link to="/saved-schemes" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-3 px-4 py-3 text-sm font-semibold text-gray-600 hover:bg-gray-50 hover:text-navy rounded-xl transition-all">
                        <Bookmark size={18} /> Saved Schemes
                      </Link>
                      <Link to="/settings" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-3 px-4 py-3 text-sm font-semibold text-gray-600 hover:bg-gray-50 hover:text-navy rounded-xl transition-all">
                        <Settings size={18} /> Profile Settings
                      </Link>
                      <hr className="my-2 border-gray-100" />
                      <button 
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold text-red-500 hover:bg-red-50 rounded-xl transition-all"
                      >
                        <LogOut size={18} /> Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link 
                to="/auth" 
                className="hidden sm:flex items-center gap-2 px-6 py-2.5 bg-navy text-white hover:bg-orange-primary font-bold text-sm rounded-xl transition-all duration-300 shadow-md shadow-navy/10"
              >
                <User size={18} />
                <span>Sign In</span>
              </Link>
            )}

            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 rounded-xl hover:bg-gray-100 text-navy transition-all"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      <div 
        className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out bg-white border-t border-gray-50 ${
          isMenuOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-4 py-6 space-y-4">
          {navLinks.map((link) => (
            <Link 
              key={link.path}
              to={link.path}
              onClick={() => setIsMenuOpen(false)}
              className={`flex items-center justify-between p-4 rounded-2xl font-bold transition-all ${
                isActive(link.path) 
                ? 'bg-orange-50 text-orange-600' 
                : 'text-navy hover:bg-gray-50'
              }`}
            >
              {link.name}
              <ChevronRight size={18} className={isActive(link.path) ? 'opacity-100' : 'opacity-0'} />
            </Link>
          ))}
          {user && (
            <Link 
              to="/dashboard"
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center justify-between p-4 rounded-2xl font-bold text-navy hover:bg-gray-50 transition-all"
            >
              My Dashboard
              <LayoutDashboard size={18} />
            </Link>
          )}
          {user && (
            <Link 
              to="/saved-schemes"
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center justify-between p-4 rounded-2xl font-bold text-navy hover:bg-gray-50 transition-all"
            >
              Saved Schemes
              <Bookmark size={18} />
            </Link>
          )}
          <div className="pt-4 border-t border-gray-50">
            {user ? (
               <button 
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 p-4 bg-red-50 text-red-500 rounded-2xl font-bold hover:bg-red-100 transition-all"
              >
                <LogOut size={18} /> Sign Out
              </button>
            ) : (
              <Link 
                to="/auth"
                onClick={() => setIsMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 p-4 bg-navy text-white rounded-2xl font-bold hover:bg-orange-primary transition-all shadow-xl"
              >
                <User size={18} />
                Sign In to Your Account
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
