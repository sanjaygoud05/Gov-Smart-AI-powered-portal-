
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Bookmark, ChevronLeft, ChevronRight, Search, Trash2, Clock, Zap } from 'lucide-react';
import { MOCK_SCHEMES } from '../constants';
import { Scheme } from '../types';

const SavedSchemes: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [savedSchemes, setSavedSchemes] = useState<Scheme[]>([]);

  useEffect(() => {
    const fetchSaved = async () => {
      const savedUser = localStorage.getItem('gov_smart_user');
      if (!savedUser) {
        navigate('/auth');
        return;
      }

      const savedIds = JSON.parse(localStorage.getItem('saved_schemes') || '[]');
      const filtered = MOCK_SCHEMES.filter(s => savedIds.includes(s.id));
      setSavedSchemes(filtered);
      setLoading(false);
    };

    fetchSaved();
  }, [navigate]);

  const removeScheme = (id: string) => {
    const current = JSON.parse(localStorage.getItem('saved_schemes') || '[]');
    const updated = current.filter((sid: string) => sid !== id);
    localStorage.setItem('saved_schemes', JSON.stringify(updated));
    setSavedSchemes(prev => prev.filter(s => s.id !== id));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-10 h-10 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f9fafb] pb-24">
      <div className="bg-white border-b sticky top-20 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <Link to="/dashboard" className="inline-flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-navy transition-all">
              <ChevronLeft size={18} /> Back to Dashboard
            </Link>
            <div className="flex items-center gap-2 px-4 py-1.5 bg-blue-50 text-blue-700 rounded-full text-xs font-bold border border-blue-100">
              <Bookmark size={14} /> {savedSchemes.length} Saved Schemes
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="mb-12">
          <h1 className="text-4xl font-extrabold text-navy mb-4 tracking-tight">Saved for Later</h1>
          <p className="text-gray-500 max-w-2xl">Quickly access the schemes you've bookmarked. Review eligibility requirements and start your applications when you're ready.</p>
        </div>

        {savedSchemes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {savedSchemes.map((scheme) => (
              <div 
                key={scheme.id} 
                className="bg-white rounded-3xl border border-gray-100 hover:border-orange-200 hover:shadow-2xl transition-all group overflow-hidden flex flex-col h-full"
              >
                <div className="p-8 flex-grow">
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1 bg-green-50 text-green-700 text-[10px] font-black uppercase rounded-md tracking-widest">{scheme.category}</span>
                      <span className="px-3 py-1 bg-blue-50 text-blue-700 text-[10px] font-black uppercase rounded-md tracking-widest">{scheme.level}</span>
                    </div>
                    <button 
                      onClick={() => removeScheme(scheme.id)}
                      className="text-gray-300 hover:text-red-500 transition-colors p-2 rounded-xl hover:bg-red-50"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                  <h3 className="text-xl font-bold text-navy mb-4 group-hover:text-orange-600 transition-colors line-clamp-2 leading-tight">{scheme.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed line-clamp-3 mb-6">{scheme.description}</p>
                  
                  <div className="flex items-center gap-4 text-xs text-gray-400 font-bold mb-4">
                    <div className="flex items-center gap-1.5">
                      <Clock size={14} /> {scheme.updatedAt}
                    </div>
                    <div className="flex items-center gap-1.5 text-orange-500">
                      <Zap size={14} fill="currentColor" /> AI Score: 98%
                    </div>
                  </div>
                </div>

                <div className="px-8 pb-8 pt-4 border-t border-gray-50 bg-gray-50/50">
                  <button 
                    onClick={() => navigate(`/scheme/${scheme.id}`)}
                    className="w-full py-4 bg-white border-2 border-gray-100 text-navy font-extrabold rounded-2xl flex items-center justify-center gap-2 hover:bg-orange-primary hover:text-white hover:border-orange-primary transition-all active:scale-[0.98]"
                  >
                    View & Apply <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-[3rem] p-24 text-center border border-dashed border-gray-200 shadow-sm">
            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-8 text-gray-200">
              <Bookmark size={48} />
            </div>
            <h3 className="text-3xl font-extrabold text-navy mb-4">No saved schemes yet</h3>
            <p className="text-gray-400 max-w-md mx-auto mb-10 text-lg">Browse the portal and bookmark schemes you're interested in to see them here.</p>
            <Link 
              to="/find-schemes" 
              className="inline-flex items-center gap-2 px-10 py-5 bg-navy text-white hover:bg-orange-primary font-bold rounded-2xl transition-all shadow-xl shadow-navy/10"
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
