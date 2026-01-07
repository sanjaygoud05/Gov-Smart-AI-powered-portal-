
import React, { useState, useEffect } from 'react';
import { User, MapPin, Calendar, Tag, Save, ChevronLeft, Sparkles, Loader2, Briefcase, Wallet } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { INDIAN_STATES_UTS, OCCUPATIONS } from '../constants';

const Settings: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [user, setUser] = useState<any>(null);

  const [profile, setProfile] = useState({
    first_name: '',
    last_name: '',
    street_address: '',
    city: '',
    state: '',
    age: '',
    occupation: '',
    income: '',
    category: 'General'
  });

  useEffect(() => {
    const checkAuth = async () => {
      const savedUser = localStorage.getItem('gov_smart_user');
      if (!savedUser) {
        navigate('/auth');
        return;
      }
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
      
      try {
        const docRef = doc(db, "profiles", parsedUser.id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setProfile({ ...profile, ...docSnap.data() });
        } else {
          // Initialize default if doesn't exist
          setProfile(prev => ({
            ...prev,
            first_name: parsedUser.username || '',
          }));
        }
      } catch (err) {
        console.error("Error fetching profile from Firestore:", err);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const docRef = doc(db, "profiles", user.id);
      await setDoc(docRef, profile, { merge: true });
      setMessage({ type: 'success', text: 'Profile updated in cloud successfully!' });
    } catch (err: any) {
      console.error("Save error:", err);
      setMessage({ type: 'error', text: 'Failed to update cloud profile' });
    } finally {
      setSaving(false);
    }
  };

  const labelClass = "text-[14px] font-bold text-[#1e293b]";
  const commonInputClass = "w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/5 focus:outline-none bg-white text-[15px] text-[#1e293b] font-medium placeholder:text-gray-400 transition-all";

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-10 h-10 text-orange-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f9fafb] pb-24 px-4">
      <div className="max-w-4xl mx-auto pt-12">
        <div className="flex items-center justify-between mb-10">
          <Link to="/" className="inline-flex items-center gap-2 text-[15px] font-bold text-gray-400 hover:text-[#1e293b] transition-all">
            <ChevronLeft size={20} /> Back to Home
          </Link>
          <div className="flex items-center gap-2 text-orange-500 font-bold bg-orange-50 px-4 py-2 rounded-full border border-orange-100">
            <Sparkles size={18} /> Cloud Profile Settings
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="px-8 py-10 bg-[#1e293b] text-white">
            <h1 className="text-3xl font-extrabold mb-2">My Information</h1>
            <p className="text-gray-400">Your details are stored securely in our cloud database for smart matching.</p>
          </div>

          <form onSubmit={handleSave} className="p-8 md:p-12">
            {message && (
              <div className={`mb-8 p-4 rounded-2xl font-medium text-sm animate-in fade-in slide-in-from-top-2 ${
                message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'
              }`}>
                {message.text}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <h2 className="text-xs font-black text-gray-400 uppercase tracking-widest pb-2 border-b">Personal Information</h2>
                
                <div className="space-y-2">
                  <label className={labelClass}>First Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input 
                      type="text" name="first_name" placeholder="John"
                      value={profile.first_name} onChange={handleChange} className={commonInputClass}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className={labelClass}>Last Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input 
                      type="text" name="last_name" placeholder="Doe"
                      value={profile.last_name} onChange={handleChange} className={commonInputClass}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className={labelClass}>Age</label>
                    <div className="relative">
                      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                      <input 
                        type="number" name="age" placeholder="25"
                        value={profile.age} onChange={handleChange} className={commonInputClass}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className={labelClass}>Category</label>
                    <div className="relative">
                      <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                      <select 
                        name="category" value={profile.category} onChange={handleChange}
                        className={`${commonInputClass} appearance-none cursor-pointer`}
                      >
                        <option value="General">General</option>
                        <option value="OBC">OBC</option>
                        <option value="SC">SC</option>
                        <option value="ST">ST</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className={labelClass}>Occupation</label>
                  <div className="relative">
                    <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <select 
                      name="occupation" value={profile.occupation} onChange={handleChange}
                      className={`${commonInputClass} appearance-none cursor-pointer`}
                    >
                      <option value="">Select Occupation</option>
                      {OCCUPATIONS.map(occ => <option key={occ} value={occ}>{occ}</option>)}
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className={labelClass}>Annual Family Income</label>
                  <div className="relative">
                    <Wallet className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <select 
                      name="income" value={profile.income} onChange={handleChange}
                      className={`${commonInputClass} appearance-none cursor-pointer`}
                    >
                      <option value="">Select Income Range</option>
                      <option value="Below 1 Lakh">Below 1 Lakh</option>
                      <option value="1 Lakh - 2.5 Lakh">1 Lakh - 2.5 Lakh</option>
                      <option value="2.5 Lakh - 5 Lakh">2.5 Lakh - 5 Lakh</option>
                      <option value="Above 5 Lakh">Above 5 Lakh</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <h2 className="text-xs font-black text-gray-400 uppercase tracking-widest pb-2 border-b">Address Details</h2>

                <div className="space-y-2">
                  <label className={labelClass}>Street Address</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input 
                      type="text" name="street_address" placeholder="123 Main St"
                      value={profile.street_address} onChange={handleChange} className={commonInputClass}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className={labelClass}>City</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input 
                      type="text" name="city" placeholder="Mumbai"
                      value={profile.city} onChange={handleChange} className={commonInputClass}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className={labelClass}>State / UT</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <select 
                      name="state" value={profile.state} onChange={handleChange}
                      className={`${commonInputClass} appearance-none cursor-pointer`}
                    >
                      <option value="">Select State</option>
                      {INDIAN_STATES_UTS.map(state => (
                        <option key={state} value={state}>{state}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-12 flex justify-end">
              <button 
                type="submit"
                disabled={saving}
                className="px-10 py-4 bg-orange-primary hover:bg-orange-600 text-white font-bold rounded-2xl shadow-xl shadow-orange-500/20 transition-all flex items-center gap-2 disabled:opacity-50"
              >
                {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                {saving ? 'Saving to Cloud...' : 'Update Cloud Profile'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Settings;
