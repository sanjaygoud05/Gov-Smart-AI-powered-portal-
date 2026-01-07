
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Bookmark, 
  Search, 
  Clock, 
  ChevronRight, 
  Sparkles, 
  FileText, 
  User, 
  AlertCircle,
  LayoutGrid,
  Zap,
  Activity,
  TrendingUp,
  ArrowRight,
  CheckCircle2
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
          <div className="w-10 h-10 border-4 border-gray-100 border-t-orange-primary rounded-full animate-spin"></div>
          <span className="text-[#1e293b] font-bold text-xs uppercase tracking-widest">Loading Your Dashboard...</span>
        </div>
      </div>
    );
  }

  const getMissingFields = () => {
    const fields = [
      { key: 'age', label: 'Age' },
      { key: 'state', label: 'State' },
      { key: 'occupation', label: 'Occupation' },
      { key: 'income', label: 'Annual Income' }
    ];
    return fields.filter(f => !profile?.[f.key] || profile?.[f.key] === '');
  };

  const missingFields = getMissingFields();
  // Ensure profile completion is measured in %
  const completion = Math.round(((4 - missingFields.length) / 4) * 100);

  return (
    <div className="min-h-screen bg-[#f9fafb] pb-24 font-inter">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        
        {/* Header Greeting */}
        <div className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-black text-[#1e293b] mb-2 tracking-tight">
            Welcome back, {profile?.first_name || 'User'}!
          </h1>
          <p className="text-gray-500 font-medium">Your personalized dashboard for government schemes</p>
        </div>

        {/* 4-Stat Cards Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Eligible Schemes', value: '12', icon: <FileText size={20} />, color: 'text-green-600', bg: 'bg-green-50' },
            { label: 'Saved Schemes', value: savedCount, icon: <Bookmark size={20} />, color: 'text-blue-600', bg: 'bg-blue-50' },
            { label: 'Expiring Soon', value: '0', icon: <Clock size={20} />, color: 'text-orange-600', bg: 'bg-orange-50' },
            { 
              label: 'Profile Complete', 
              value: completion === 100 ? 'Completed' : `${completion}%`, 
              icon: completion === 100 ? <CheckCircle2 size={20} /> : <User size={20} />, 
              color: completion === 100 ? 'text-green-600' : 'text-purple-600', 
              bg: completion === 100 ? 'bg-green-50' : 'bg-purple-50' 
            },
          ].map((stat, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-all duration-300">
              <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-xl flex items-center justify-center shrink-0`}>
                {stat.icon}
              </div>
              <div className="flex flex-col">
                <span className={`text-2xl font-black ${stat.color} leading-none mb-1`}>{stat.value}</span>
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">{stat.label}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Profile Completion Horizontal Widget */}
        <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm mb-12">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="flex items-center gap-6 flex-1">
              <div className={`w-12 h-12 ${completion === 100 ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'} rounded-full flex items-center justify-center shrink-0`}>
                {completion === 100 ? <CheckCircle2 size={24} /> : <AlertCircle size={24} />}
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-[#1e293b] mb-1">
                  {completion === 100 ? 'Your profile is fully complete' : 'Complete your profile for better matches'}
                </h3>
                <p className="text-sm text-gray-500 mb-4 font-medium">
                  {completion === 100 ? 'You are receiving highly accurate AI scheme matches.' : 'Fill in your details to discover more schemes you\'re eligible for'}
                </p>
                <div className="relative w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className={`absolute top-0 left-0 h-full ${completion === 100 ? 'bg-green-500' : 'bg-orange-primary'} rounded-full transition-all duration-1000 ease-out shadow-sm`}
                    style={{ width: `${completion}%` }}
                  ></div>
                </div>
              </div>
            </div>
            <button 
              onClick={() => navigate('/settings')}
              className="px-8 py-3.5 bg-gray-50 hover:bg-[#1e293b] hover:text-white text-[#1e293b] font-bold rounded-xl border border-gray-200 hover:border-[#1e293b] transition-all active:scale-[0.98] whitespace-nowrap shadow-sm"
            >
              {completion === 100 ? 'Update Profile' : 'Complete Profile'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Content Area: Schemes For You */}
          <div className="lg:col-span-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-black text-[#1e293b] flex items-center gap-3">
                <Sparkles size={24} className="text-orange-500" /> Schemes For You
              </h2>
              <Link to="/find-schemes" className="text-xs font-black text-gray-400 uppercase tracking-widest hover:text-[#1e293b] flex items-center gap-1 transition-colors">
                View All <ChevronRight size={16} />
              </Link>
            </div>

            <div className="space-y-4">
              {MOCK_SCHEMES.slice(0, 3).map((scheme) => (
                <div 
                  key={scheme.id}
                  onClick={() => navigate(`/scheme/${scheme.id}`)}
                  className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 hover:border-orange-200 hover:shadow-lg transition-all duration-300 cursor-pointer group flex flex-col sm:flex-row sm:items-center justify-between gap-6"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="px-3 py-1 bg-gray-100 text-gray-500 text-[10px] font-black uppercase rounded-lg tracking-wider">
                        {scheme.category}
                      </span>
                      <div className="flex items-center gap-1 text-[10px] font-black text-green-600 uppercase tracking-widest">
                        <TrendingUp size={12} /> 98% Match
                      </div>
                    </div>
                    <h4 className="text-xl font-bold text-[#1e293b] group-hover:text-orange-primary transition-colors mb-2 leading-tight">{scheme.title}</h4>
                    <p className="text-sm text-gray-400 line-clamp-1 font-medium">{scheme.description}</p>
                  </div>
                  <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 group-hover:bg-orange-primary group-hover:text-white transition-all duration-300">
                    <ChevronRight size={20} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar Area: Quick Actions */}
          <div className="lg:col-span-4">
            <div className="mb-8">
              <h2 className="text-2xl font-black text-[#1e293b]">Quick Actions</h2>
            </div>
            
            <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
              <div className="space-y-3">
                {[
                  { label: 'Browse All Schemes', icon: <LayoutGrid size={18} />, path: '/find-schemes' },
                  { label: 'Check Eligibility', icon: <Zap size={18} />, path: '/find-schemes?tab=eligibility' },
                  { label: 'My Saved Items', icon: <Bookmark size={18} />, path: '/saved-schemes' },
                  { label: 'Process Guide', icon: <Clock size={18} />, path: '/how-it-works' },
                  { label: 'Recent Activity', icon: <Activity size={18} />, path: '/dashboard' },
                ].map((action, i) => (
                  <Link 
                    key={i} 
                    to={action.path}
                    className="flex items-center justify-between p-4 rounded-xl bg-gray-50 hover:bg-[#1e293b] hover:text-white transition-all duration-300 group border border-transparent shadow-sm hover:shadow-md"
                  >
                    <div className="flex items-center gap-4">
                      <div className="text-[#1e293b] group-hover:text-orange-400 transition-colors shrink-0">
                        {action.icon}
                      </div>
                      <span className="font-black text-[14px] text-[#1e293b] group-hover:text-white transition-colors">
                        {action.label}
                      </span>
                    </div>
                    <ChevronRight size={18} className="text-gray-400 group-hover:text-white group-hover:translate-x-1 transition-all" />
                  </Link>
                ))}
              </div>
            </div>

            {/* AI Assistant Widget */}
            <div className="mt-8 bg-[#1e293b] rounded-3xl p-8 text-white relative overflow-hidden group shadow-xl">
              <div className="absolute top-0 right-0 w-32 h-32 bg-orange-primary opacity-10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
              <div className="relative z-10 text-center sm:text-left">
                <h3 className="text-xl font-bold mb-3">Need Assistance?</h3>
                <p className="text-sm text-gray-400 mb-8 leading-relaxed font-medium">Our AI expert is here to help you understand requirements and application steps.</p>
                <button 
                  onClick={() => {
                    const launchEvent = new CustomEvent('launch-ai-chat');
                    window.dispatchEvent(launchEvent);
                  }}
                  className="w-full py-4 bg-orange-primary hover:bg-white hover:text-[#1e293b] text-white font-black rounded-xl transition-all duration-300 text-sm shadow-lg shadow-orange-500/20 active:scale-95 flex items-center justify-center gap-2"
                >
                  Chat with Assistant <ArrowRight size={18} />
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;
