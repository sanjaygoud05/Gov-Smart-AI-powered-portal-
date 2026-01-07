
import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Search, HelpCircle, MessageCircle } from 'lucide-react';

interface FAQItemProps {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}

const FAQItem: React.FC<FAQItemProps> = ({ question, answer, isOpen, onToggle }) => (
  <div className="border border-gray-100 rounded-2xl mb-4 overflow-hidden bg-white shadow-sm transition-all hover:shadow-md">
    <button 
      onClick={onToggle}
      className="w-full flex justify-between items-center p-6 text-left focus:outline-none"
    >
      <span className={`font-bold text-lg ${isOpen ? 'text-orange-600' : 'text-navy'}`}>{question}</span>
      {isOpen ? <ChevronUp size={20} className="text-orange-600" /> : <ChevronDown size={20} className="text-gray-400" />}
    </button>
    {isOpen && (
      <div className="px-6 pb-6 text-gray-600 leading-relaxed border-t border-gray-50 pt-4 animate-in fade-in slide-in-from-top-2 duration-300">
        {answer}
      </div>
    )}
  </div>
);

const FAQs: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [searchQuery, setSearchQuery] = useState('');

  const faqs = [
    {
      category: 'General',
      items: [
        { question: 'What is Gov-Smart?', answer: 'Gov-Smart is an AI-powered portal designed to help Indian citizens discover and apply for government welfare schemes. We match your personal profile with hundreds of Central and State government programs.' },
        { question: 'Is this an official government website?', answer: 'No, Gov-Smart is a private initiative aimed at simplifying the discovery of government schemes. However, all information is sourced from official portals, and we always redirect you to official .gov.in websites for applications.' },
        { question: 'Is this service free to use?', answer: 'Yes, Gov-Smart is 100% free for all citizens. We do not charge any fees for searching or discovering schemes.' }
      ]
    },
    {
      category: 'Eligibility & Search',
      items: [
        { question: 'How does the AI matching work?', answer: 'Our AI analyzes your demographic details like age, location, occupation, and income and compares them against the eligibility criteria defined by various government ministries. This ensures highly personalized recommendations.' },
        { question: 'Can I find state-specific schemes?', answer: 'Yes! We cover schemes from all Indian States and Union Territories, in addition to Central Government schemes.' },
        { question: 'What documents do I need to search?', answer: 'You don’t need any documents just to search. However, having your Aadhaar, bank details, and income certificate details handy will help you fill the eligibility form more accurately.' }
      ]
    },
    {
      category: 'Privacy & Security',
      items: [
        { question: 'Is my personal data safe?', answer: 'Absolutely. We do not store sensitive personal information like Aadhaar numbers or bank accounts during the discovery phase. Any information you provide for eligibility check is processed securely.' },
        { question: 'Do I need to create an account?', answer: 'While you can browse schemes without an account, creating one allows you to save schemes, track your eligibility over time, and get notified about new programs.' }
      ]
    }
  ];

  const filteredFaqs = faqs.map(cat => ({
    ...cat,
    items: cat.items.filter(item => 
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(cat => cat.items.length > 0);

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <section className="bg-navy py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-1.5 rounded-full text-white text-xs font-bold mb-6 border border-white/20">
            <HelpCircle size={14} className="text-orange-400" />
            Support Center
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-8">Frequently Asked Questions</h1>
          
          <div className="max-w-2xl mx-auto relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-400 transition-colors" size={20} />
            <input 
              type="text" 
              placeholder="Search for questions (e.g., 'Aadhaar', 'Eligibility')..."
              className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-transparent focus:border-orange-400 focus:outline-none bg-white text-navy font-medium shadow-xl"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((cat, catIdx) => (
              <div key={catIdx} className="mb-12">
                <h2 className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] mb-6 ml-1">{cat.category}</h2>
                <div className="space-y-4">
                  {cat.items.map((item, itemIdx) => {
                    const globalIdx = catIdx * 100 + itemIdx;
                    return (
                      <FAQItem 
                        key={globalIdx}
                        question={item.question}
                        answer={item.answer}
                        isOpen={openIndex === globalIdx}
                        onToggle={() => setOpenIndex(openIndex === globalIdx ? null : globalIdx)}
                      />
                    );
                  })}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-20">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search size={32} className="text-gray-300" />
              </div>
              <h3 className="text-xl font-bold text-navy mb-2">No results found</h3>
              <p className="text-gray-500">Try adjusting your search terms or browsing categories below.</p>
              <button 
                onClick={() => setSearchQuery('')}
                className="mt-6 text-orange-600 font-bold hover:underline"
              >
                Clear Search
              </button>
            </div>
          )}

          {/* Contact Support Card */}
          <div className="mt-20 bg-orange-primary rounded-3xl p-10 text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-32 h-32 bg-white/10 blur-[40px] -translate-x-1/2 -translate-y-1/2"></div>
            <div className="relative z-10 text-center md:text-left">
              <h3 className="text-2xl font-extrabold mb-2">Still have questions?</h3>
              <p className="text-orange-50/80 font-medium">Our support team is here to help you 24/7.</p>
            </div>
            <button className="relative z-10 bg-white text-orange-600 px-8 py-4 rounded-2xl font-extrabold shadow-lg hover:bg-orange-50 transition-all flex items-center gap-2">
              <MessageCircle size={20} /> Contact Support
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FAQs;
