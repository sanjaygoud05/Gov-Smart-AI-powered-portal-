
import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-navy text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1">
             <div className="flex items-center gap-2 mb-4">
              <div className="bg-white p-1 rounded-md">
                <span className="text-navy font-bold text-xl">GS</span>
              </div>
              <span className="text-white font-bold text-xl">Gov-Smart</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Empowering citizens to discover and access government welfare schemes. Your one-stop platform for finding schemes you're eligible for.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-6">Quick Links</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><Link to="/find-schemes" className="hover:text-white transition-colors">Find Schemes</Link></li>
              <li><Link to="/how-it-works" className="hover:text-white transition-colors">How It Works</Link></li>
              <li><Link to="/faqs" className="hover:text-white transition-colors">FAQs</Link></li>
              <li><Link to="/auth" className="hover:text-white transition-colors">Sign In</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-6">Legal</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Disclaimer</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Accessibility Statement</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-6">Gov Resources</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><a href="https://india.gov.in" target="_blank" className="hover:text-white transition-colors">India.gov.in</a></li>
              <li><a href="https://myscheme.gov.in" target="_blank" className="hover:text-white transition-colors">MyScheme.gov.in</a></li>
              <li><a href="https://digitalindia.gov.in" target="_blank" className="hover:text-white transition-colors">Digital India</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
          <p>© 2024 Gov-Smart. All rights reserved.</p>
          <div className="flex items-center gap-2">
            <div className="bg-gray-700 h-2 w-2 rounded-full"></div>
            <span>Powered by Artificial Intelligence</span>
          </div>
          <p>Last Updated: January 2024</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
