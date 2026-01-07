
import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Search, Filter, ChevronLeft, ChevronRight, Check, Sparkles, ChevronDown, RefreshCcw, XCircle, ArrowRight } from 'lucide-react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { MOCK_SCHEMES, CATEGORIES, INDIAN_STATES_UTS, OCCUPATIONS } from '../constants';
import { searchSchemesAI, getAIRecommendations } from '../services/geminiService';
import { UserProfile, Scheme } from '../types';

const FindSchemes: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'eligibility' | 'browse'>(
    searchParams.get('tab') === 'browse' || searchParams.get('q') || searchParams.get('category') 
    ? 'browse' 
    : 'eligibility'
  );
  
  // Browsing/Search state
  const [schemes, setSchemes] = useState<Scheme[]>(MOCK_SCHEMES);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [selectedCategories, setSelectedCategories] = useState<string[]>(searchParams.get('category') ? [searchParams.get('category')!] : []);
  const [schemeLevel, setSchemeLevel] = useState<string>('All Levels');
  const [isAiFiltered, setIsAiFiltered] = useState(false);

  // Eligibility Wizard state
  const [step, setStep] = useState(1);
  const [hasFinishedWizard, setHasFinishedWizard] = useState(false);
  const [matchedSchemes, setMatchedSchemes] = useState<Scheme[]>([]);
  const [profile, setProfile] = useState<UserProfile>({
      age: undefined,
      gender: 'Male',
      state: '',
      occupation: '',
      income: '',
      category: 'General' 
  });

  useEffect(() => {
    const fetchCloudProfile = async () => {
      const savedUser = localStorage.getItem('gov_smart_user');
      if (savedUser) {
        const user = JSON.parse(savedUser);
        try {
          const docRef = doc(db, "profiles", user.id);
          const docSnap = await getDoc(docRef);
          
          if (docSnap.exists()) {
            const parsed = docSnap.data();
            setProfile({
              age: parsed.age ? parseInt(parsed.age) : undefined,
              gender: parsed.gender || 'Male',
              state: parsed.state || '',
              occupation: parsed.occupation || '',
              income: parsed.income || '',
              category: parsed.category || 'General'
            });
          }
        } catch (err) {
          console.error("Error fetching cloud profile for wizard:", err);
        }
      }
    };
    fetchCloudProfile();
  }, []);

  const isStepValid = () => {
      switch(step) {
          case 1: return !!(profile.age && profile.gender);
          case 2: return !!profile.state;
          case 3: return !!(profile.occupation && profile.income);
          case 4: return true; 
          default: return false;
      }
  };

  useEffect(() => {
    if (activeTab === 'browse' && !isAiFiltered) {
        const performSearch = async () => {
            if (searchQuery) {
                setLoading(true);
                const results = await searchSchemesAI(searchQuery);
                setSchemes(results);
                setLoading(false);
            } else {
                let filtered = MOCK_SCHEMES;
                if (selectedCategories.length > 0) {
                    filtered = filtered.filter(s => selectedCategories.includes(s.category));
                }
                if (schemeLevel !== 'All Levels') {
                    filtered = filtered.filter(s => s.level === schemeLevel);
                }
                setSchemes(filtered);
            }
        };
        const debounce = setTimeout(performSearch, 300);
        return () => clearTimeout(debounce);
    }
  }, [searchQuery, selectedCategories, schemeLevel, activeTab, isAiFiltered]);

  const toggleCategory = (cat: string) => {
    setSelectedCategories(prev => prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]);
  };

  const handleFinalSubmit = async () => {
      setLoading(true);
      try {
          const recommendations = await getAIRecommendations(profile);
          setMatchedSchemes(recommendations);
          setHasFinishedWizard(true);
      } catch (error) {
          console.error("Failed to get recommendations", error);
      } finally {
          setLoading(false);
          window.scrollTo({ top: 0, behavior: 'smooth' });
      }
  };

  const nextStep = () => {
    if (step === 4) {
        handleFinalSubmit();
    } else if (isStepValid()) {
        setStep(s => s + 1);
    }
  };
  
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  const resetWizard = () => {
      setStep(1);
      setHasFinishedWizard(false);
      setMatchedSchemes([]);
  };

  const commonInputClass = "w-full px-4 py-3 rounded-lg border border-gray-200 bg-[#f4f7f9] text-[#1e293b] font-medium text-[15px] focus:ring-2 focus:ring-orange-primary/20 focus:outline-none transition-all";
  const commonSelectClass = "w-full px-4 py-3 rounded-lg border border-gray-200 bg-[#f4f7f9] text-[#1e293b] font-medium text-[15px] focus:outline-none transition-all appearance-none cursor-pointer";

  const renderEligibilityStep = () => {
    switch(step) {
      case 1:
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="space-y-4">
              <label className="block text-sm font-bold text-navy">How old are you?</label>
              <input 
                type="number" 
                placeholder="Enter your age" 
                className={commonInputClass}
                value={profile.age || ''}
                onChange={(e) => setProfile({...profile, age: parseInt(e.target.value) || undefined})}
              />
            </div>
            <div className="space-y-4">
              <label className="block text-sm font-bold text-navy">Gender</label>
              <div className="grid grid-cols-3 gap-4">
                {['Male', 'Female', 'Other'].map((g) => (
                  <button
                    key={g}
                    onClick={() => setProfile({...profile, gender: g as any})}
                    className={`py-3 rounded-lg border-2 font-bold transition-all ${profile.gender === g ? 'border-orange-primary bg-orange-50 text-orange-600' : 'border-gray-100 bg-white text-gray-400 hover:border-gray-200'}`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="space-y-4">
              <label className="block text-sm font-bold text-navy">Which state do you live in?</label>
              <div className="relative">
                <select 
                  className={commonSelectClass}
                  value={profile.state}
                  onChange={(e) => setProfile({...profile, state: e.target.value})}
                >
                  <option value="">Select State</option>
                  {INDIAN_STATES_UTS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="space-y-4">
              <label className="block text-sm font-bold text-navy">Occupation</label>
              <div className="relative">
                <select 
                  className={commonSelectClass}
                  value={profile.occupation}
                  onChange={(e) => setProfile({...profile, occupation: e.target.value})}
                >
                  <option value="">Select Occupation</option>
                  {OCCUPATIONS.map(occ => <option key={occ} value={occ}>{occ}</option>)}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
              </div>
            </div>
            <div className="space-y-4">
              <label className="block text-sm font-bold text-navy">Annual Family Income</label>
              <div className="relative">
                <select 
                  className={commonSelectClass}
                  value={profile.income}
                  onChange={(e) => setProfile({...profile, income: e.target.value})}
                >
                  <option value="">Select Income Range</option>
                  <option value="Below 1 Lakh">Below 1 Lakh</option>
                  <option value="1 Lakh - 2.5 Lakh">1 Lakh - 2.5 Lakh</option>
                  <option value="2.5 Lakh - 5 Lakh">2.5 Lakh - 5 Lakh</option>
                  <option value="Above 5 Lakh">Above 5 Lakh</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
              </div>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="space-y-4">
              <label className="block text-sm font-bold text-navy">Caste Category</label>
              <div className="grid grid-cols-2 gap-4">
                {['General', 'OBC', 'SC', 'ST'].map((c) => (
                  <button
                    key={c}
                    onClick={() => setProfile({...profile, category: c})}
                    className={`py-3 rounded-lg border-2 font-bold transition-all ${profile.category === c ? 'border-orange-primary bg-orange-50 text-orange-600' : 'border-gray-100 bg-white text-gray-400 hover:border-gray-200'}`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-24">
      {/* Tab Navigation */}
      <div className="bg-white border-b sticky top-20 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex overflow-x-auto no-scrollbar">
            <button 
              onClick={() => { setActiveTab('eligibility'); setIsAiFiltered(false); }}
              className={`py-6 px-8 text-sm font-bold border-b-2 transition-all whitespace-nowrap flex items-center gap-2 ${activeTab === 'eligibility' ? 'border-orange-primary text-navy' : 'border-transparent text-gray-400 hover:text-navy'}`}
            >
              <Sparkles size={18} className={activeTab === 'eligibility' ? 'text-orange-500' : ''} />
              Eligibility Check
            </button>
            <button 
              onClick={() => { setActiveTab('browse'); setIsAiFiltered(false); }}
              className={`py-6 px-8 text-sm font-bold border-b-2 transition-all whitespace-nowrap flex items-center gap-2 ${activeTab === 'browse' && !isAiFiltered ? 'border-orange-primary text-navy' : 'border-transparent text-gray-400 hover:text-navy'}`}
            >
              <Search size={18} />
              Browse All Schemes
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        {activeTab === 'eligibility' ? (
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-[2.5rem] shadow-xl border border-gray-100 overflow-hidden transition-all duration-500">
              {/* Conditional Header */}
              <div className={`p-8 md:p-12 transition-colors duration-500 relative overflow-hidden ${hasFinishedWizard && matchedSchemes.length > 0 ? 'bg-orange-primary' : 'bg-navy'} text-white`}>
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                
                {hasFinishedWizard ? (
                    <div className="animate-in fade-in slide-in-from-bottom-2">
                        <h2 className="text-3xl font-black mb-2">
                            {matchedSchemes.length > 0 ? 'Schemes Found!' : 'No Matches Found'}
                        </h2>
                        <p className="text-white/70 text-sm font-medium">
                            {matchedSchemes.length > 0 
                                ? `Based on your profile, you are eligible for the following ${matchedSchemes.length} programs.` 
                                : "We couldn't find any schemes that perfectly match your current cloud profile details."}
                        </p>
                    </div>
                ) : (
                    <>
                        <h2 className="text-3xl font-black mb-4">Check Your Eligibility</h2>
                        <p className="text-gray-400 text-sm font-medium">Your cloud profile details have been pre-filled for convenience.</p>
                        <div className="mt-8 flex items-center gap-2">
                            {[1, 2, 3, 4].map(s => (
                                <div key={s} className={`h-1.5 flex-1 rounded-full transition-all ${s <= step ? 'bg-orange-500' : 'bg-white/10'}`}></div>
                            ))}
                        </div>
                    </>
                )}
              </div>
              
              <div className="p-8 md:p-12">
                {loading ? (
                    <div className="py-20 flex flex-col items-center justify-center gap-4">
                        <div className="w-12 h-12 border-4 border-gray-100 border-t-orange-primary rounded-full animate-spin"></div>
                        <p className="text-navy font-bold text-sm animate-pulse">Analyzing cloud profile with AI...</p>
                    </div>
                ) : hasFinishedWizard ? (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {matchedSchemes.length > 0 ? (
                            <div className="space-y-6">
                                {matchedSchemes.map(scheme => (
                                    <div 
                                        key={scheme.id}
                                        onClick={() => navigate(`/scheme/${scheme.id}`)}
                                        className="group p-6 bg-gray-50 hover:bg-white rounded-3xl border border-transparent hover:border-orange-200 hover:shadow-xl transition-all flex flex-col md:flex-row md:items-center justify-between gap-6 cursor-pointer"
                                    >
                                        <div className="flex-1 space-y-2">
                                            <div className="flex items-center gap-2">
                                                <span className="px-2.5 py-1 bg-white border border-gray-100 rounded-lg text-[10px] font-black uppercase tracking-wider text-navy">
                                                    {scheme.category}
                                                </span>
                                                <div className="flex items-center gap-1.5 text-[10px] font-black text-green-600 uppercase">
                                                    <Sparkles size={10} fill="currentColor" /> Match: 99%
                                                </div>
                                            </div>
                                            <h3 className="text-lg font-bold text-navy group-hover:text-orange-primary transition-colors">{scheme.title}</h3>
                                            <p className="text-xs text-gray-500 line-clamp-1">{scheme.description}</p>
                                        </div>
                                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-orange-500 shadow-sm group-hover:bg-orange-primary group-hover:text-white transition-all">
                                            <ArrowRight size={18} />
                                        </div>
                                    </div>
                                ))}
                                <button 
                                    onClick={resetWizard}
                                    className="w-full py-4 border-2 border-dashed border-gray-200 text-gray-400 font-bold rounded-2xl hover:border-orange-200 hover:text-orange-500 transition-all flex items-center justify-center gap-2"
                                >
                                    <RefreshCcw size={18} /> Check with Different Info
                                </button>
                            </div>
                        ) : (
                            <div className="text-center py-10">
                                <div className="w-20 h-20 bg-red-50 text-red-400 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <XCircle size={32} />
                                </div>
                                <h3 className="text-xl font-bold text-navy mb-2">No Matching Schemes</h3>
                                <p className="text-gray-500 text-sm max-w-sm mx-auto mb-10 leading-relaxed">
                                    We couldn't find any schemes currently active for your profile combination. Try adjusting your income range or location in settings.
                                </p>
                                <button 
                                    onClick={resetWizard}
                                    className="px-10 py-4 bg-navy text-white font-bold rounded-2xl shadow-xl hover:bg-orange-primary transition-all flex items-center gap-2 mx-auto"
                                >
                                    <RefreshCcw size={18} /> Start Over
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <>
                        {renderEligibilityStep()}
                        <div className="mt-12 flex items-center justify-between">
                            <button 
                                onClick={prevStep}
                                disabled={step === 1}
                                className="flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-navy disabled:opacity-30 transition-all"
                            >
                                <ChevronLeft size={18} /> Previous
                            </button>
                            <button 
                                onClick={nextStep}
                                disabled={!isStepValid()}
                                className="px-10 py-4 bg-navy text-white font-bold rounded-2xl shadow-xl hover:bg-orange-primary transition-all flex items-center gap-2 disabled:opacity-50"
                            >
                                {step === 4 ? 'Find My Schemes' : 'Next Step'}
                                {step !== 4 && <ChevronRight size={18} />}
                            </button>
                        </div>
                    </>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
            {/* Filters Sidebar */}
            <div className="lg:col-span-1 space-y-8">
              <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
                <div className="flex items-center gap-2 text-navy font-black text-sm uppercase tracking-widest mb-8">
                  <Filter size={18} className="text-orange-500" /> Filters
                </div>
                
                <div className="space-y-8">
                  <div className="space-y-4">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">Level</label>
                    <div className="space-y-2">
                      {['All Levels', 'Central', 'State'].map(l => (
                        <button 
                          key={l}
                          onClick={() => setSchemeLevel(l)}
                          className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition-all ${schemeLevel === l ? 'bg-navy text-white shadow-lg' : 'text-gray-500 hover:bg-gray-50'}`}
                        >
                          {l}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">Categories</label>
                    <div className="space-y-2">
                      {CATEGORIES.map(cat => (
                        <button 
                          key={cat.label}
                          onClick={() => toggleCategory(cat.label)}
                          className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-between ${selectedCategories.includes(cat.label) ? 'bg-orange-50 text-orange-600 border-orange-100 border' : 'text-gray-500 hover:bg-gray-50'}`}
                        >
                          {cat.label}
                          {selectedCategories.includes(cat.label) && <Check size={16} />}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Results Area */}
            <div className="lg:col-span-3 space-y-8">
              {/* Search Bar */}
              <div className="relative group">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors" size={20} />
                <input 
                  type="text"
                  placeholder="Search by keyword, benefit, or department..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-16 pr-6 py-5 bg-white border-2 border-transparent focus:border-orange-200 focus:outline-none rounded-[2rem] shadow-sm text-navy font-bold transition-all"
                />
              </div>

              {isAiFiltered && (
                <div className="bg-orange-50 border border-orange-100 p-6 rounded-3xl flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-orange-500 shadow-sm">
                      <Sparkles size={24} />
                    </div>
                    <div>
                      <h4 className="text-navy font-bold">AI Recommended for You</h4>
                      <p className="text-orange-600 text-xs font-medium">Based on your eligibility profile</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => { setIsAiFiltered(false); setSearchQuery(''); }}
                    className="text-orange-600 font-bold text-xs hover:underline"
                  >
                    Clear AI Filter
                  </button>
                </div>
              )}

              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="bg-white rounded-3xl p-8 h-64 animate-pulse border border-gray-100"></div>
                  ))}
                </div>
              ) : schemes.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {schemes.map(scheme => (
                    <div 
                      key={scheme.id}
                      onClick={() => navigate(`/scheme/${scheme.id}`)}
                      className="bg-white p-8 rounded-[2rem] border border-gray-100 hover:border-orange-400 hover:shadow-2xl transition-all cursor-pointer group flex flex-col h-full"
                    >
                      <div className="flex flex-wrap gap-2 mb-6">
                        <span className="px-3 py-1 bg-green-50 text-green-700 text-[10px] font-black uppercase rounded-lg">{scheme.category}</span>
                        <span className="px-3 py-1 bg-blue-50 text-blue-700 text-[10px] font-black uppercase rounded-lg">{scheme.level}</span>
                      </div>
                      <h3 className="text-xl font-bold text-navy mb-4 group-hover:text-orange-600 transition-colors line-clamp-2 leading-tight">{scheme.title}</h3>
                      <p className="text-sm text-gray-500 leading-relaxed line-clamp-3 mb-8 flex-grow">{scheme.description}</p>
                      <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                        <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Updated: {scheme.updatedAt}</div>
                        <div className="text-orange-500">
                          <ChevronRight size={20} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-[3rem] p-24 text-center border border-dashed border-gray-200">
                   <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300">
                    <Search size={32} />
                  </div>
                  <h3 className="text-2xl font-bold text-navy mb-2">No schemes found</h3>
                  <p className="text-gray-500">Try adjusting your filters or search terms.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FindSchemes;
