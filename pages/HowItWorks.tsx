
import React from 'react';
import { User, Search, CheckCircle2, ChevronRight, Zap, Shield, HelpCircle, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

/**
 * HowItWorks component explains the process of finding and applying for schemes.
 */
const HowItWorks: React.FC = () => {
  const navigate = useNavigate();

  const steps = [
    {
      title: 'Create Your Profile',
      description: 'Fill in your basic details like age, location, income, and occupation. Our AI uses this to find relevant matches.',
      icon: <User size={32} />,
      color: 'bg-blue-500'
    },
    {
      title: 'AI Analysis',
      description: 'Our system analyzes 500+ schemes across Central and State departments to identify programs you are eligible for.',
      icon: <Zap size={32} />,
      color: 'bg-orange-500'
    },
    {
      title: 'Review Requirements',
      description: 'See benefits, eligibility criteria, and mandatory documents for each scheme in simple, easy-to-understand language.',
      icon: <FileText size={32} />,
      color: 'bg-purple-500'
    },
    {
      title: 'Apply Securely',
      description: 'Redirect to the official government portal with all the information you need to complete your application successfully.',
      icon: <CheckCircle2 size={32} />,
      color: 'bg-green-500'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-navy py-24 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6">How Gov-Smart Works</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Discovering government benefits shouldn't be a mystery. Here's how our AI-powered portal simplifies the process for you.
          </p>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {steps.map((step, idx) => (
              <div key={idx} className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 hover:shadow-xl transition-all group">
                <div className={`${step.color} w-16 h-16 rounded-2xl flex items-center justify-center text-white mb-8 shadow-lg transform group-hover:scale-110 transition-transform`}>
                  {step.icon}
                </div>
                <div className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">Step {idx + 1}</div>
                <h3 className="text-xl font-bold text-navy mb-4">{step.title}</h3>
                <p className="text-gray-600 leading-relaxed text-sm">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white border-t border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="flex flex-col items-center text-center">
              <div className="p-4 bg-orange-50 text-orange-600 rounded-full mb-6">
                <Shield size={32} />
              </div>
              <h3 className="text-xl font-bold text-navy mb-4">Secure & Private</h3>
              <p className="text-gray-500 text-sm">We don't store your sensitive documents. Your profile data is used strictly for scheme matching.</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="p-4 bg-blue-50 text-blue-600 rounded-full mb-6">
                <Zap size={32} />
              </div>
              <h3 className="text-xl font-bold text-navy mb-4">Instant Matching</h3>
              <p className="text-gray-500 text-sm">No more manual browsing. Our AI finds schemes across 30+ ministries in milliseconds.</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="p-4 bg-green-50 text-green-600 rounded-full mb-6">
                <HelpCircle size={32} />
              </div>
              <h3 className="text-xl font-bold text-navy mb-4">Guided Support</h3>
              <p className="text-gray-500 text-sm">Detailed instructions and FAQs for every scheme to ensure you never feel lost.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-extrabold text-navy mb-6">Ready to find your benefits?</h2>
          <p className="text-gray-600 mb-10 text-lg">It takes less than 2 minutes to check your eligibility for hundreds of government schemes.</p>
          <button 
            onClick={() => navigate('/find-schemes')}
            className="px-10 py-5 bg-navy text-white font-bold rounded-2xl hover:bg-orange-primary transition-all shadow-xl flex items-center gap-2 mx-auto"
          >
            Start Eligibility Check <ChevronRight size={20} />
          </button>
        </div>
      </section>
    </div>
  );
};

export default HowItWorks;
