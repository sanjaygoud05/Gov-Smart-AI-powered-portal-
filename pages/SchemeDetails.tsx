
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Share2, Calendar, Building2, CheckCircle2, ExternalLink, Bookmark, BookmarkCheck } from 'lucide-react';
import { auth } from '../lib/firebase';
import { MOCK_SCHEMES } from '../constants';

const SchemeDetails: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const scheme = MOCK_SCHEMES.find(s => s.id === id);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (id) {
      const saved = JSON.parse(localStorage.getItem('saved_schemes') || '[]');
      setIsSaved(saved.includes(id));
    }
  }, [id]);

  if (!scheme) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f9fafb]">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-navy mb-4">Scheme Not Found</h2>
          <button onClick={() => navigate('/find-schemes')} className="text-orange-600 font-bold hover:underline">Go back to schemes</button>
        </div>
      </div>
    );
  }

  const handleApply = () => {
    if (scheme.applicationUrl) {
      window.open(scheme.applicationUrl, '_blank');
    } else {
      window.open('https://india.gov.in', '_blank');
    }
  };

  const toggleSave = () => {
    if (!auth.currentUser) {
      navigate('/auth');
      return;
    }

    const currentSaved = JSON.parse(localStorage.getItem('saved_schemes') || '[]');
    let updated;
    if (isSaved) {
      updated = currentSaved.filter((sid: string) => sid !== id);
    } else {
      updated = [...currentSaved, id];
    }
    localStorage.setItem('saved_schemes', JSON.stringify(updated));
    setIsSaved(!isSaved);
    window.dispatchEvent(new Event('storage'));
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-24">
      {/* Breadcrumbs & Actions */}
      <div className="bg-white border-b sticky top-20 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Link to="/" className="hover:text-orange-primary font-medium">Home</Link>
              <span className="text-gray-300">/</span>
              <Link to="/find-schemes" className="hover:text-orange-primary font-medium">Schemes</Link>
              <span className="text-gray-300">/</span>
              <span className="text-navy font-bold line-clamp-1">{scheme.title}</span>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={toggleSave}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl border font-bold transition-all active:scale-95 ${
                  isSaved 
                  ? 'bg-blue-50 border-blue-200 text-blue-600' 
                  : 'bg-white border-gray-100 text-gray-600 hover:bg-gray-50'
                }`}
              >
                {isSaved ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
                {isSaved ? 'Saved' : 'Save for Later'}
              </button>
              <button className="p-2.5 rounded-xl border border-gray-100 hover:bg-gray-50 text-gray-600 transition-all active:scale-95">
                <Share2 size={18} />
              </button>
              <button 
                onClick={handleApply}
                className="px-6 py-2.5 bg-orange-primary hover:bg-orange-600 text-white font-bold rounded-xl transition-all shadow-lg shadow-orange-500/20 flex items-center gap-2 active:scale-95"
              >
                Apply Now <ExternalLink size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-8 space-y-12">
            {/* Header Card */}
            <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100">
              <div className="flex flex-wrap gap-2 mb-8">
                <span className="px-4 py-1.5 bg-green-100 text-green-700 text-xs font-bold rounded-full">{scheme.category}</span>
                <span className="px-4 py-1.5 bg-blue-100 text-blue-700 text-xs font-bold rounded-full">{scheme.level}</span>
              </div>
              <h1 className="text-4xl font-extrabold text-navy mb-8 leading-tight">{scheme.title}</h1>
              <p className="text-lg text-gray-600 leading-relaxed mb-10">{scheme.description}</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 py-8 border-t border-gray-100">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-2xl bg-gray-50 text-navy">
                    <Building2 size={24} />
                  </div>
                  <div>
                    <div className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Ministry</div>
                    <div className="text-navy font-bold">{scheme.ministry}</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-2xl bg-gray-50 text-navy">
                    <Calendar size={24} />
                  </div>
                  <div>
                    <div className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Expires On</div>
                    <div className="text-navy font-bold">{scheme.expiryDate || 'N/A'}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sections */}
            {[
              { id: 'objectives', title: 'Objectives', data: scheme.objectives },
              { id: 'benefits', title: 'Benefits', data: scheme.benefits, highlight: true },
              { id: 'eligibility', title: 'Eligibility Criteria', data: scheme.eligibility },
              { id: 'documents', title: 'Required Documents', data: scheme.documents, grid: true },
              { id: 'howToApply', title: 'Application Process: Step-by-Step', data: scheme.howToApply, ordered: true, isApplication: true }
            ].map((section) => (
              <div key={section.id} id={section.id} className={`bg-white rounded-3xl p-8 md:p-12 shadow-sm border ${section.isApplication ? 'border-orange-200 ring-4 ring-orange-50/50' : 'border-gray-100'}`}>
                <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-50">
                  <h2 className="text-2xl font-extrabold text-navy">{section.title}</h2>
                  {section.isApplication && (
                    <div className="flex items-center gap-1.5 px-3 py-1 bg-orange-50 text-orange-600 rounded-full text-[10px] font-black uppercase tracking-wider">
                      <CheckCircle2 size={12} /> Official Process
                    </div>
                  )}
                </div>
                {section.grid ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {section.data.map((item, idx) => (
                      <div key={idx} className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex items-center gap-3 hover:bg-gray-100/50 transition-all">
                        <CheckCircle2 size={18} className="text-navy" />
                        <span className="text-navy font-medium text-sm">{item}</span>
                      </div>
                    ))}
                  </div>
                ) : section.ordered ? (
                  <div className="space-y-6">
                    {section.data.map((item, idx) => (
                      <div key={idx} className="flex gap-6">
                        <div className="flex-shrink-0 w-10 h-10 bg-navy rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
                          {idx + 1}
                        </div>
                        <p className="text-gray-600 font-medium leading-relaxed pt-2">{item}</p>
                      </div>
                    ))}
                    {section.isApplication && (
                      <div className="mt-10 p-6 bg-navy rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="space-y-1">
                          <p className="text-white font-bold">Ready to start your application?</p>
                          <p className="text-gray-400 text-xs">You will be redirected to the official government portal.</p>
                        </div>
                        <button 
                          onClick={handleApply}
                          className="w-full md:w-auto px-8 py-4 bg-orange-primary hover:bg-orange-600 text-white font-bold rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 active:scale-95"
                        >
                          Visit Official Portal <ExternalLink size={18} />
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <ul className="space-y-4">
                    {section.data.map((item, idx) => (
                      <li key={idx} className={`flex gap-4 p-4 rounded-2xl transition-all ${section.highlight ? 'bg-green-50/50 border border-green-100' : 'hover:bg-gray-50'}`}>
                        <div className={`mt-1 flex-shrink-0 ${section.highlight ? 'text-green-600' : 'text-green-500'}`}>
                          <CheckCircle2 size={20} />
                        </div>
                        <span className="text-navy font-medium leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>

          {/* Sticky Sidebar */}
          <div className="lg:col-span-4 space-y-8">
            <div className="bg-navy rounded-3xl p-8 shadow-2xl sticky top-40">
                <h3 className="text-2xl font-bold text-white mb-6">Ready to Apply?</h3>
                <p className="text-gray-400 text-sm mb-8 leading-relaxed">Apply for this scheme directly on the official government portal. We've simplified the details for you.</p>
                <div className="space-y-4 mb-8">
                    <button 
                      onClick={handleApply}
                      className="w-full py-5 bg-orange-primary hover:bg-orange-600 text-white font-bold rounded-2xl shadow-xl transition-all flex items-center justify-center gap-2 active:scale-95"
                    >
                        Apply Now <ExternalLink size={20} />
                    </button>
                    <button 
                      onClick={() => navigate('/faqs')}
                      className="w-full py-5 bg-white/10 hover:bg-orange-primary hover:text-white text-white font-bold rounded-2xl border border-white/20 transition-all flex items-center justify-center gap-2 active:scale-95"
                    >
                        Need Help? Contact Us
                    </button>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchemeDetails;
