
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Bookmark, ChevronLeft, ChevronRight, Search, Trash2, Clock, Zap, ArrowRight } from 'lucide-react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { fetchSchemeById } from '../services/schemeService';
import { Scheme } from '../types';

const SavedSchemes: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [savedSchemes, setSavedSchemes] = useState<Scheme[]>([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        navigate('/auth');
        return;
      }

      const savedIds = JSON.parse(localStorage.getItem('saved_schemes') || '[]');
      if (savedIds.length > 0) {
        setLoading(true);
        const fetchedSchemes = await Promise.all(
          savedIds.map((id: string) => fetchSchemeById(id))
        );
        // Filter out any null results (if a scheme was deleted from DB but remains in localStorage)
        setSavedSchemes(fetchedSchemes.filter((s): s is Scheme => s !== null));
      } else {
        setSavedSchemes([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [navigate]);

  const removeScheme = (id: string) => {
    const current = JSON.parse(localStorage.getItem('saved_schemes') || '[]');
    const updated = current.filter((sid: string) => sid !== id);
    localStorage.setItem('saved_schemes', JSON.stringify(updated));
    setSavedSchemes(prev => prev.filter(s => s.id !== id));
    window.dispatchEvent(new Event('storage'));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f9fafb]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-gray-100 border-t-orange-primary rounded-full animate-spin"></div>
          <span className="text-navy font-bold text-xs uppercase tracking-widest">Loading Saved Items...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f9fafb] pb-24 font-inter">
      {/* Sticky Sub-Header */}
      <div className="bg-white border-b sticky top-20 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <Link to="/" className="inline-flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-navy transition-all group">
              <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-navy group-hover:text-white transition-all">
                <ChevronLeft size={18} />
              </div>
              <span>Back to Home</span>
            </Link>
            <div className="flex items-center gap-2 px-5 py-2 bg-orange-50 text-orange-600 rounded-full text-xs font-black border border-orange-100 uppercase tracking-widest shadow-sm">
              <Bookmark size={14} fill="currentColor" /> {savedSchemes.length} Schemes Bookmarked
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="mb-12">
          <h1 className="text-4xl sm:text-5xl font-black text-navy mb-4 tracking-tight">Saved for Later</h1>
          <p className="text-gray-500 max-w-2xl text-lg font-medium leading-relaxed">
            Manage and track the government programs you're interested in. Review eligibility details and take action when you're ready to apply.
          </p>
        </div>

        {savedSchemes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {savedSchemes.map((scheme) => (
              <div 
                key={scheme.id} 
                className="bg-white rounded-[2.5rem] border border-gray-100 hover:border-orange-400 hover:shadow-[0_30px_60px_-15px_rgba(249,115,22,0.15)] transition-all duration-500 group overflow-hidden flex flex-col h-full transform hover:-translate-y-2"
              >
                <div className="p-8 flex-grow">
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1 bg-gray-100 text-gray-500 text-[10px] font-black uppercase rounded-lg tracking-widest group-hover:bg-orange-50 group-hover:text-orange-600 transition-colors">
                        {scheme.category}
                      </span>
                      <span className="px-3 py-1 bg-navy/5 text-navy/60 text-[10px] font-black uppercase rounded-lg tracking-widest">
                        {scheme.level}
                      </span>
                    </div>
                    <button 
                      onClick={() => removeScheme(scheme.id)}
                      title="Remove from saved"
                      className="text-gray-300 hover:text-red-500 transition-all p-2.5 rounded-2xl hover:bg-red-50 active:scale-90"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>

                  <h3 className="text-2xl font-bold text-navy mb-4 group-hover:text-orange-primary transition-colors line-clamp-2 leading-tight">
                    {scheme.title}
                  </h3>
                  
                  <p className="text-sm text-gray-400 font-medium leading-relaxed line-clamp-3 mb-8">
                    {scheme.description}
                  </p>
                  
                  <div className="flex items-center gap-5 text-[11px] font-black uppercase tracking-wider text-gray-400 border-t border-gray-50 pt-6">
                    <div className="flex items-center gap-2">
                      <Clock size={14} className="group-hover:text-navy transition-colors" /> 
                      {scheme.updatedAt}
                    </div>
                    <div className="flex items-center gap-2 text-green-600">
                      <Zap size={14} fill="currentColor" className="text-orange-400" /> 
                      98% Match
                    </div>
                  </div>
                </div>

                <div className="px-8 pb-8 pt-2">
                  <button 
                    onClick={() => navigate(`/scheme/${scheme.id}`)}
                    className="
                      w-full py-4 bg-white border-2 border-gray-100 text-navy font-extrabold rounded-2xl 
                      flex items-center justify-center gap-2 transition-all duration-200 ease-linear
                      group-hover:bg-[#ea580c] group-hover:text-white group-hover:border-[#ea580c]
                      group-hover:shadow-[0_10px_15px_-3px_rgba(249,115,22,0.2)] 
                      group-hover:-translate-y-[1px] active:scale-[0.98]
                    "
                  >
                    View Details
                    <ArrowRight size={18} className="transition-transform duration-200 group-hover:translate-x-1" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-[3.5rem] p-16 md:p-32 text-center border-2 border-dashed border-gray-100 shadow-sm animate-fade-in">
            <div className="w-28 h-28 bg-gray-50 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 text-gray-200 group transition-all hover:bg-orange-50 hover:text-orange-200">
              <Bookmark size={56} strokeWidth={1.5} />
            </div>
            <h3 className="text-3xl font-black text-navy mb-4">Your bookmarks list is empty</h3>
            <p className="text-gray-400 max-w-md mx-auto mb-10 text-lg font-medium leading-relaxed">
              Find schemes you are eligible for and save them here to keep track of your benefits.
            </p>
            <Link 
              to="/find-schemes" 
              className="inline-flex items-center gap-3 px-12 py-5 bg-navy text-white hover:bg-orange-primary font-black rounded-[1.5rem] transition-all duration-300 shadow-2xl shadow-navy/20 active:scale-95"
            >
              Start Discovering <Search size={20} />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedSchemes;
