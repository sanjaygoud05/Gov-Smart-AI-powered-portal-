
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Bookmark, 
  ArrowRight, 
  Zap, 
  CheckCircle2, 
  ChevronRight,
  UserCircle,
  TrendingUp,
  FileText,
  ShieldCheck,
  Bell
} from 'lucide-react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { MOCK_SCHEMES } from '../constants';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [savedCount, setSavedCount] = useState(0);

  useEffect(() => {
    const checkAuth = async () => {
      const savedUser = localStorage.getItem('gov_smart_user');
      if (!savedUser) {
        navigate('/auth');
        return;
      }

      const user = JSON.parse(savedUser);
      
      try {
        const docRef = doc(db, "profiles", user.id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setProfile(docSnap.data());
        } else {
          setProfile({ first_name: user.username || 'User' });
        }
      } catch (err) {
        console.error("Dashboard profile fetch error:", err);
        setProfile({ first_name: user.username || 'User' });
      }
      
      const saved = JSON.parse(localStorage.getItem('saved_schemes') || '[]');
      setSavedCount(saved.length);
      
      setLoading(false);
    };

    checkAuth();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f9fafb]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-navy border-t-orange-primary rounded-full animate-spin"></div>
          <p className="text-navy font-bold text-sm">Synchronizing your dashboard...</p>
        </div>
      </div>
    );
  }

  const stats = [
    { label: 'Smart Matches', value: '42', icon: <Zap size={24} />, color: 'bg-orange-50 text-orange-600', trend: '+12% this month' },
    { label: 'Saved Programs', value: savedCount, icon: <Bookmark size={24} />, color: 'bg-blue-50 text-blue-600', trend: 'Always accessible' },
    { label: 'Active Apps', value: '0', icon: <FileText size={24} />, color: 'bg-green-50 text-green-600', trend: 'Ready to start' },
  ];

  // Simple completion calculation
  const getCompletion = () => {
    if (!profile) return 0;
    const fields = ['first_name', 'last_name', 'age', 'state', 'occupation', 'income', 'category'];
    const filled = fields.filter(f => profile[f] && profile[f] !== '').length;
    return Math.round((filled / fields.length) * 100);
  };

  const completion = getCompletion();

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-24 font-sans">
      <div className="bg-[#1e293b] pt-24 pb-40 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-orange-500/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="flex items-center gap-6">
              <div className="relative group">
                <div className="w-24 h-24 bg-gradient-to-br from-orange-400 to-orange-600 rounded-[2rem] flex items-center justify-center text-white text-4xl font-black shadow-2xl shadow-orange-500/40 transform group-hover:rotate-6 transition-all cursor-default">
                  {profile?.first_name?.[0] || 'U'}
                </div>
                <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-green-500 rounded-full border-4 border-[#1e293b] flex items-center justify-center">
                  <ShieldCheck size={14} className="text-white" />
                </div>
              </div>
              <div className="space-y-1">
                <h1 className="text-4xl font-extrabold text-white tracking-tight">
                  Hi, {profile?.first_name || 'User'}!
                </h1>
                <p className="text-gray-400 font-medium flex items-center gap-2">
                  <TrendingUp size={16} className="text-green-500" />
                  Your cloud profile is <span className="text-white">{completion}% complete</span>
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <Link 
                to="/find-schemes" 
                className="bg-white text-[#1e293b] hover:bg-orange-primary hover:text-white font-black py-4 px-10 rounded-2xl shadow-xl transition-all flex items-center gap-2 active:scale-95"
              >
                Scan for Schemes <ArrowRight size={20} />
              </Link>
              <button className="p-4 bg-white/10 hover:bg-white/20 text-white rounded-2xl border border-white/10 transition-all">
                <Bell size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {stats.map((stat, idx) => (
                <div key={idx} className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm hover:shadow-2xl transition-all group hover:-translate-y-1">
                  <div className={`w-14 h-14 ${stat.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                    {stat.icon}
                  </div>
                  <div className="space-y-1">
                    <div className="text-4xl font-black text-[#1e293b] tracking-tighter">{stat.value}</div>
                    <div className="text-sm font-extrabold text-gray-400 uppercase tracking-widest">{stat.label}</div>
                  </div>
                  <div className="mt-6 pt-4 border-t border-gray-50 flex items-center gap-2 text-[11px] font-bold text-gray-400">
                    <CheckCircle2 size={12} className="text-green-500" /> {stat.trend}
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-[2.5rem] p-10 border border-gray-100 shadow-sm">
              <div className="flex justify-between items-center mb-10">
                <div className="space-y-1">
                  <h2 className="text-2xl font-black text-[#1e293b]">AI Smart Matches</h2>
                  <p className="text-sm text-gray-400 font-medium">Personalized recommendations based on your cloud profile.</p>
                </div>
                <Link to="/find-schemes" className="px-5 py-2 bg-orange-50 text-orange-600 rounded-xl font-bold text-xs hover:bg-orange-primary hover:text-white transition-all">
                  View Full Report
                </Link>
              </div>
              
              <div className="space-y-6">
                {MOCK_SCHEMES.slice(0, 3).map((scheme) => (
                  <div key={scheme.id} className="group p-6 bg-gray-50 hover:bg-white rounded-3xl border border-transparent hover:border-orange-200 hover:shadow-xl transition-all flex flex-col md:flex-row md:items-center gap-6">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-3">
                        <span className="px-3 py-1 bg-white text-[#1e293b] text-[10px] font-black uppercase rounded-lg border border-gray-100 shadow-sm">
                          {scheme.category}
                        </span>
                        <div className="flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-700 text-[10px] font-black uppercase rounded-lg border border-green-100">
                          <Zap size={10} fill="currentColor" /> Match: 98%
                        </div>
                      </div>
                      <h3 className="text-xl font-bold text-[#1e293b] group-hover:text-orange-primary transition-colors">{scheme.title}</h3>
                      <p className="text-sm text-gray-500 line-clamp-1 font-medium">{scheme.description}</p>
                    </div>
                    <Link 
                      to={`/scheme/${scheme.id}`} 
                      className="px-8 py-3.5 bg-white text-[#1e293b] font-black rounded-2xl hover:bg-[#1e293b] hover:text-white border-2 border-gray-100 hover:border-[#1e293b] transition-all text-sm whitespace-nowrap text-center shadow-sm"
                    >
                      Analyze Profile
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-8">
            <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-orange-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
              
              <h3 className="text-xl font-black text-[#1e293b] mb-8 relative z-10">Profile Strength</h3>
              
              <div className="flex justify-center mb-10 relative">
                <svg className="w-40 h-40 transform -rotate-90">
                  <circle cx="80" cy="80" r="70" className="stroke-gray-100" strokeWidth="12" fill="transparent" />
                  <circle 
                    cx="80" cy="80" r="70" 
                    className="stroke-orange-500 transition-all duration-1000" 
                    strokeWidth="12" 
                    fill="transparent" 
                    strokeDasharray={440} 
                    strokeDashoffset={440 - (440 * (completion / 100))} 
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-[#1e293b]">
                  <span className="text-4xl font-black">{completion}%</span>
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Cloud Sync</span>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                {completion < 100 ? (
                  <div className="flex items-center gap-3 p-3 bg-red-50 text-red-600 rounded-2xl text-xs font-bold border border-red-100">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                    Complete details for better AI matching
                  </div>
                ) : (
                  <div className="flex items-center gap-3 p-3 bg-green-50 text-green-600 rounded-2xl text-xs font-bold border border-green-100">
                    <CheckCircle2 size={14} />
                    Profile Fully Optimized
                  </div>
                )}
                <div className="flex items-center gap-3 p-3 bg-gray-50 text-gray-400 rounded-2xl text-xs font-bold border border-gray-100">
                  <CheckCircle2 size={14} className="text-green-500" />
                  Real-time Cloud Sync Active
                </div>
              </div>

              <Link to="/settings" className="block w-full py-4 bg-[#1e293b] hover:bg-orange-primary text-white font-black rounded-2xl text-center transition-all shadow-xl shadow-navy/20">
                Update Information
              </Link>
            </div>

            <div className="bg-gradient-to-br from-orange-primary to-orange-600 rounded-[2.5rem] p-10 text-white shadow-2xl shadow-orange-500/20 relative overflow-hidden group">
              <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-8">
                <UserCircle size={32} />
              </div>
              <h3 className="text-2xl font-black mb-4">Expert AI Assistant</h3>
              <p className="text-orange-50/70 text-sm font-medium mb-10 leading-relaxed">
                Our specialized AI uses your cloud profile to answer complex questions about your eligibility.
              </p>
              <Link to="/faqs" className="block w-full py-4 bg-white text-orange-600 font-black rounded-2xl text-center hover:bg-orange-50 transition-all shadow-lg active:scale-95">
                Start Consultation
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
