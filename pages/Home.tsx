
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ChevronRight, Zap, Clock, ArrowRight, Sparkles } from 'lucide-react';
import { CATEGORIES, MOCK_SCHEMES } from '../constants';
import { fetchAllSchemes } from '../services/schemeService';
import { Scheme } from '../types';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [schemes, setSchemes] = useState<Scheme[]>(MOCK_SCHEMES);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    const initializeData = async () => {
      const data = await fetchAllSchemes();
      if (data && data.length > 0) {
        setSchemes(data);
      }
      setIsInitialLoad(false);
    };

    initializeData();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/find-schemes?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <section className="bg-navy relative overflow-hidden py-24 sm:py-32">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-orange-500 rounded-full blur-[100px] translate-x-1/2 translate-y-1/2"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-1.5 rounded-full text-white text-xs font-bold mb-8 border border-white/20">
            <Sparkles size={14} className="text-orange-400" />
            AI-Powered Government Schemes Discovery
          </div>
          <h1 className="text-4xl sm:text-6xl font-extrabold text-white mb-6 tracking-tight">
            Find Government Schemes <br />
            <span className="text-orange-400">You Are Eligible For</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-10 leading-relaxed">
            Our AI analyzes your profile to instantly match you with 500+ Central and State Government welfare schemes. Get personalized recommendations in seconds.
          </p>

          <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-12 relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="text-gray-400 group-focus-within:text-orange-400 transition-colors" size={24} />
            </div>
            <input 
              type="text" 
              placeholder="e.g., 'Farmer Subsidy' or 'Health Insurance'..."
              className="w-full pl-12 pr-32 py-5 rounded-xl border-2 border-transparent focus:border-orange-400 focus:outline-none bg-white text-navy font-medium text-lg shadow-2xl transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button 
              type="submit"
              className="absolute right-2 top-2 bottom-2 px-6 bg-orange-primary hover:bg-orange-600 text-white font-bold rounded-lg transition-colors flex items-center gap-2"
            >
              Search
            </button>
          </form>

          <div className="flex flex-wrap justify-center gap-4">
            <button 
              onClick={() => navigate('/find-schemes')}
              className="px-8 py-4 bg-orange-primary hover:bg-orange-600 text-white font-bold rounded-xl shadow-lg transition-all transform hover:scale-105"
            >
              Start Eligibility Check
            </button>
            <button 
              onClick={() => navigate('/how-it-works')}
              className="px-8 py-4 bg-white/10 hover:bg-orange-primary hover:text-white backdrop-blur-sm text-white font-bold rounded-xl border border-white/30 transition-all"
            >
              How It Works
            </button>
          </div>
        </div>
      </section>

      <section className="bg-white py-12 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                <div className="text-center">
                    <div className="text-3xl font-bold text-navy mb-1">500+</div>
                    <div className="text-xs text-gray-500 uppercase tracking-widest font-bold">Welfare Schemes</div>
                </div>
                <div className="text-center border-l border-gray-100">
                    <div className="text-3xl font-bold text-navy mb-1">28+</div>
                    <div className="text-xs text-gray-500 uppercase tracking-widest font-bold">States Covered</div>
                </div>
                <div className="text-center border-l border-gray-100">
                    <div className="text-3xl font-bold text-navy mb-1">AI</div>
                    <div className="text-xs text-gray-500 uppercase tracking-widest font-bold">Smart Matching</div>
                </div>
                <div className="text-center border-l border-gray-100">
                    <div className="text-3xl font-bold text-navy mb-1">100%</div>
                    <div className="text-xs text-gray-500 uppercase tracking-widest font-bold">Free to Use</div>
                </div>
            </div>
        </div>
      </section>

      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-navy mb-4">Browse Schemes by Category</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Explore welfare programs designed for every section of society.</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {CATEGORIES.map((cat, idx) => (
              <div 
                key={idx} 
                className="bg-white p-8 rounded-2xl shadow-sm border border-transparent hover:border-orange-200 hover:shadow-xl transition-all cursor-pointer group flex flex-col items-center text-center"
                onClick={() => navigate(`/find-schemes?category=${cat.label}`)}
              >
                <div className={`p-4 rounded-full ${cat.color} mb-6 group-hover:scale-110 transition-transform`}>
                  {cat.icon}
                </div>
                <h3 className="font-bold text-navy text-lg mb-2">{cat.label}</h3>
                <p className="text-sm text-gray-500 line-clamp-2">Welfare programs for {cat.label.toLowerCase()} development...</p>
                <div className="mt-4 flex items-center text-orange-500 text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                    Explore Schemes <ChevronRight size={16} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-white">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-end mb-12">
                <div>
                    <h2 className="text-3xl font-extrabold text-navy mb-4">Popular Schemes</h2>
                    <p className="text-gray-600">Most relevant programs for citizens across India right now.</p>
                </div>
                <button 
                  onClick={() => navigate('/find-schemes')}
                  className="text-navy font-bold flex items-center gap-1 border-b-2 border-orange-400 hover:border-orange-600 hover:text-orange-600 transition-all"
                >
                    View All Schemes <ChevronRight size={18} />
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {schemes.slice(0, 3).map((scheme) => (
                    <div 
                      key={scheme.id} 
                      className="bg-gray-50 rounded-2xl p-8 border border-gray-100 hover:border-orange-400 hover:bg-white hover:shadow-2xl transition-all duration-300 group flex flex-col h-full transform hover:-translate-y-1"
                    >
                        <div className="flex items-center gap-2 mb-4">
                            <span className="px-3 py-1 bg-green-100 text-green-700 text-[10px] uppercase font-bold rounded-full">{scheme.category}</span>
                            <span className={`px-3 py-1 text-[10px] uppercase font-black rounded-full ${scheme.level === 'Central' ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600'}`}>
                              {scheme.level}
                            </span>
                        </div>
                        <h3 className="text-xl font-bold text-navy mb-4 group-hover:text-orange-600 transition-colors duration-300">{scheme.title}</h3>
                        <p className="text-gray-600 text-sm mb-8 flex-grow leading-relaxed">{scheme.description}</p>
                        <div className="flex items-center gap-2 text-xs text-gray-400 mb-6">
                            <Clock size={14} />
                            Updated: {scheme.updatedAt}
                        </div>
                        <button 
                          onClick={() => navigate(`/scheme/${scheme.id}`)}
                          className="w-full py-4 bg-white border-2 border-gray-100 text-navy font-extrabold rounded-2xl flex items-center justify-center gap-2 transition-all duration-200 ease-linear hover:bg-[#ea580c] hover:text-white hover:border-[#ea580c] hover:-translate-y-[1px] hover:shadow-[0_10px_15px_-3px_rgba(249,115,22,0.2)] active:scale-[0.98] group/btn"
                        >
                            View Details 
                            <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform duration-200" />
                        </button>
                    </div>
                ))}
            </div>
         </div>
      </section>
    </div>
  );
};

export default Home;
