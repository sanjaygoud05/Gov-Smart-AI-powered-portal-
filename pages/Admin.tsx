import React, { useState } from 'react';
import { collection, doc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { ShieldAlert, Database, CheckCircle2, Loader2 } from 'lucide-react';

const EXTENDED_SCHEMES = [
  {
    id: 'pm-surya-ghar',
    title: 'PM Surya Ghar: Muft Bijli Yojana (2025)',
    description: 'Providing free electricity up to 300 units per month to 1 crore households through rooftop solar installations with massive subsidies.',
    category: 'Housing',
    level: 'Central',
    departmentName: 'Ministry of New and Renewable Energy',
    ministry: 'Ministry of New and Renewable Energy',
    updatedAt: '15 Jan 2025',
    startDate: '2024-02-15',
    expiryDate: '2027-12-31',
    objectives: ['Provide free electricity up to 300 units.', 'Promote sustainable energy.', 'Reduce utility bills.'],
    benefits: ['Subsidy up to ₹78,000.', 'Free power units.', 'Income from surplus power.'],
    eligibility: ['Indian citizen.', 'Roof ownership.', 'Valid electricity connection.'],
    documents: ['Aadhaar', 'Electricity Bill', 'Bank Passbook'],
    howToApply: [
      '1. Visit pmsuryaghar.gov.in and click "Apply for Rooftop Solar".',
      '2. Register with your Consumer ID and DISCOM name.',
      '3. Submit application for technical feasibility approval.',
      '4. Install the solar plant through an empanelled vendor.',
      '5. Apply for net-metering and inspection to receive subsidy.'
    ],
    applicationUrl: 'https://pmsuryaghar.gov.in/',
    faqs: [{ question: 'What is the maximum subsidy?', answer: 'For a 3kW system, the subsidy is ₹78,000.' }]
  },
  {
    id: 'pm-vidyalaxmi',
    title: 'PM-Vidyalaxmi Education Loan',
    description: 'Collateral-free, guarantor-free loans for students admitted to top-tier higher education institutions in India.',
    category: 'Education',
    level: 'Central',
    departmentName: 'Department of Higher Education',
    ministry: 'Ministry of Education',
    updatedAt: '05 Jan 2025',
    startDate: '2024-11-01',
    expiryDate: '2028-01-01',
    objectives: ['Financial support for higher ed.', 'No student left behind.'],
    benefits: ['Loans up to ₹7.5 Lakh with 75% credit guarantee.', '3% interest subvention.'],
    eligibility: ['Students in top 860 institutions.', 'Merit based admission.', 'Family income < ₹8 Lakh for subvention.'],
    documents: ['Admission Letter', 'Aadhaar', 'Income Certificate'],
    howToApply: [
      '1. Register on the PM-Vidyalaxmi official portal.',
      '2. Fill out the Common Education Loan Application Form (CELAF).',
      '3. Browse and select loan products from various banks.',
      '4. Upload digital copies of required documents.',
      '5. Submit and track application status through the portal.'
    ],
    applicationUrl: 'https://www.vidyalakshmi.co.in/',
    faqs: [{ question: 'Need guarantor?', answer: 'No.' }]
  },
  {
    id: 'ayushman-senior-70',
    title: 'Ayushman Bharat Senior Citizen (70+) Cover',
    description: 'Universal health insurance cover of ₹5 Lakh per year for every senior citizen aged 70 and above, regardless of income.',
    category: 'Health',
    level: 'Central',
    departmentName: 'National Health Authority',
    ministry: 'Ministry of Health and Family Welfare',
    updatedAt: '01 Jan 2025',
    startDate: '2024-10-29',
    expiryDate: '2030-12-31',
    objectives: ['Provide quality healthcare to the elderly.', 'Reduce medical expense burden.'],
    benefits: ['₹5 Lakh annual health cover.', 'Cashless treatment.', 'Covers pre-existing diseases.'],
    eligibility: ['Indian citizen aged 70 or above.', 'Applicable even if covered under other health schemes.'],
    documents: ['Aadhaar Card (Mandatory for DOB)'],
    howToApply: [
      '1. Open the Ayushman App or visit beneficiary.nha.gov.in.',
      '2. Login with your Aadhaar-linked mobile number.',
      '3. Search for your record using the 70+ Senior Citizen category.',
      '4. Perform e-KYC using biometric or OTP.',
      '5. Download your Ayushman 70+ Card instantly.'
    ],
    applicationUrl: 'https://beneficiary.nha.gov.in/',
    faqs: [{ question: 'Is income limit applicable?', answer: 'No, this expansion is universal for all seniors 70+.' }]
  },
  {
    id: 'pm-kisan-2025',
    title: 'PM-KISAN Samman Nidhi',
    description: 'Direct income support of ₹6,000 per year to landholding farmer families in three equal installments.',
    category: 'Agriculture',
    level: 'Central',
    departmentName: 'Department of Agriculture and Farmers Welfare',
    ministry: 'Ministry of Agriculture',
    updatedAt: '01 Jan 2025',
    startDate: '2019-02-24',
    expiryDate: '2027-06-30',
    objectives: ['Supplement farmers financial needs.', 'Direct bank transfer.'],
    benefits: ['₹6,000 per year in 3 installments.', 'KCC linkage support.'],
    eligibility: ['All landholding farmer families.', 'Land record must be in applicant name.'],
    documents: ['Land Records', 'Aadhaar Card', 'Bank Passbook'],
    howToApply: [
      '1. Visit pmkisan.gov.in and select "New Farmer Registration".',
      '2. Enter Aadhaar and mobile number for verification.',
      '3. Fill in landholding and bank details accurately.',
      '4. Upload proof of land ownership.',
      '5. Complete Aadhaar e-KYC to start receiving payments.'
    ],
    applicationUrl: 'https://pmkisan.gov.in/',
    faqs: [{ question: 'How often are payments?', answer: 'Every four months (₹2,000 each).' }]
  },
  {
    id: 'pm-jandhan-yojana',
    title: 'Pradhan Mantri Jan Dhan Yojana (PMJDY)',
    description: 'National Mission for Financial Inclusion to ensure access to financial services, namely, basic savings & deposit accounts, remittance, credit, insurance, pension in an affordable manner.',
    category: 'Finance',
    level: 'Central',
    departmentName: 'Department of Financial Services',
    ministry: 'Ministry of Finance',
    updatedAt: '01 Jan 2025',
    startDate: '2014-08-28',
    expiryDate: '',
    objectives: ['Universal access to banking facilities with at least one basic banking account for every household.'],
    benefits: ['No minimum balance required.', 'Interest on deposit.', 'Accidental insurance cover of Rs. 2 lakh.', 'Overdraft facility up to Rs. 10,000.'],
    eligibility: ['Indian citizen.', 'Age above 10 years.'],
    documents: ['Aadhaar', 'Voter ID', 'Driving License', 'PAN Card', 'Passport'],
    howToApply: [
      '1. Visit the nearest bank branch or Bank Mitra.',
      '2. Submit the self-attested copies of KYC documents.',
      '3. Fill the PMJDY account opening form.',
      '4. Account is opened and Rupay Debit card is issued.'
    ],
    applicationUrl: 'https://pmjdy.gov.in/',
    faqs: [{ question: 'Is zero balance allowed?', answer: 'Yes, no minimum balance is required.' }]
  },
  {
    id: 'digital-india',
    title: 'Digital India Programme',
    description: 'A flagship programme of the Government of India with a vision to transform India into a digitally empowered society and knowledge economy.',
    category: 'Education',
    level: 'Central',
    departmentName: 'Ministry of Electronics and Information Technology (MeitY)',
    ministry: 'Ministry of Electronics and Information Technology',
    updatedAt: '01 Jan 2025',
    startDate: '2015-07-01',
    expiryDate: '',
    objectives: ['Provide high-speed internet to rural areas.', 'Improve digital literacy.'],
    benefits: ['Access to e-Governance services.', 'Digital Lockers for citizens.', 'e-Sign facility.'],
    eligibility: ['All Indian citizens.', 'Institutions seeking digital transformation.'],
    documents: ['Aadhaar (for most services)'],
    howToApply: [
      '1. No specific application for the umbrella program.',
      '2. However, citizens can register for specific services like DigiLocker via digilocker.gov.in.'
    ],
    applicationUrl: 'https://digitalindia.gov.in/',
    faqs: [{ question: 'Is DigiLocker part of this?', answer: 'Yes, it is a key initiative under Digital India.' }]
  },
  {
    id: 'make-in-india',
    title: 'Make in India',
    description: 'An initiative to encourage companies to manufacture their products in India and incentivize with dedicated investments into manufacturing.',
    category: 'Business',
    level: 'Central',
    departmentName: 'Department for Promotion of Industry and Internal Trade (DPIIT)',
    ministry: 'Ministry of Commerce and Industry',
    updatedAt: '01 Jan 2025',
    startDate: '2014-09-25',
    expiryDate: '',
    objectives: ['Boost domestic manufacturing.', 'Increase FDI.', 'Create employment.'],
    benefits: ['Ease of doing business.', 'Subsidies and tax incentives in various sectors.', 'IPR protection.'],
    eligibility: ['Domestic and global manufacturing enterprises.'],
    documents: ['Company Incorporation', 'DPIIT Recognition (for startups)'],
    howToApply: [
      '1. Companies can explore sector-specific policies on the Make in India website.',
      '2. Apply for relevant Production Linked Incentive (PLI) schemes through respective ministry portals.'
    ],
    applicationUrl: 'https://www.makeinindia.com/',
    faqs: [{ question: 'Are startups included?', answer: 'Yes, Startup India works closely with Make in India.' }]
  },
  {
    id: 'pm-jjby',
    title: 'Pradhan Mantri Jeevan Jyoti Bima Yojana (PMJJBY)',
    description: 'A one-year life insurance scheme renewable from year to year offering coverage for death due to any reason.',
    category: 'Finance',
    level: 'Central',
    departmentName: 'Department of Financial Services',
    ministry: 'Ministry of Finance',
    updatedAt: '01 Jan 2025',
    startDate: '2015-05-09',
    expiryDate: '',
    objectives: ['Enhance life insurance penetration in India.', 'Provide financial security to families.'],
    benefits: ['Life cover of Rs. 2 lakhs.', 'Premium of Rs. 436 per annum.'],
    eligibility: ['Age group of 18-50 years.', 'Having a bank account.'],
    documents: ['Aadhaar', 'Bank Passbook'],
    howToApply: [
      '1. Visit the bank where you hold an account.',
      '2. Fill out the PMJJBY consent-cum-declaration form.',
      '3. Ensure sufficient balance for auto-debit.'
    ],
    applicationUrl: 'https://financialservices.gov.in/',
    faqs: [{ question: 'What is the premium?', answer: 'Rs. 436 per year.' }]
  },
  {
    id: 'ujjwala-yojana',
    title: 'Pradhan Mantri Ujjwala Yojana (PMUY)',
    description: 'A scheme to distribute 50 million LPG connections to women of Below Poverty Line (BPL) families.',
    category: 'Women & Child',
    level: 'Central',
    departmentName: 'Ministry of Petroleum and Natural Gas',
    ministry: 'Ministry of Petroleum and Natural Gas',
    updatedAt: '01 Jan 2025',
    startDate: '2016-05-01',
    expiryDate: '',
    objectives: ['Provide clean cooking fuel.', 'Prevent health hazards associated with fossil fuels.'],
    benefits: ['Free LPG connection.', 'Subsidy on cylinder refills.'],
    eligibility: ['Adult woman belonging to a BPL family.', 'No existing LPG connection in the household.'],
    documents: ['BPL Ration Card', 'Aadhaar', 'Bank Account details'],
    howToApply: [
      '1. Fill out the Ujjwala KYC form.',
      '2. Submit it to the nearest LPG distributor.',
      '3. Wait for clearance and connection setup.'
    ],
    applicationUrl: 'https://pmuy.gov.in/',
    faqs: [{ question: 'Who can apply?', answer: 'Women from eligible poor households.' }]
  },
  {
    id: 'mgnrega',
    title: 'Mahatma Gandhi National Rural Employment Guarantee Act (MGNREGA)',
    description: 'An Indian labor law and social security measure that aims to guarantee the right to work.',
    category: 'Employment',
    level: 'Central',
    departmentName: 'Ministry of Rural Development',
    ministry: 'Ministry of Rural Development',
    updatedAt: '01 Jan 2025',
    startDate: '2006-02-02',
    expiryDate: '',
    objectives: ['Enhance livelihood security in rural areas.', 'Provide at least 100 days of wage employment.'],
    benefits: ['Guaranteed 100 days of employment in a financial year.', 'Minimum wage payment.'],
    eligibility: ['Adult members of a rural household willing to do unskilled manual work.'],
    documents: ['Aadhaar', 'Bank/Post Office Account details'],
    howToApply: [
      '1. Register with the local Gram Panchayat.',
      '2. Obtain a Job Card.',
      '3. Submit application for work to Gram Panchayat.'
    ],
    applicationUrl: 'https://nrega.nic.in/',
    faqs: [{ question: 'How many days of work?', answer: '100 days per household per year.' }]
  }
];

export default function Admin() {
  const [isSeeding, setIsSeeding] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const seedDatabase = async () => {
    setIsSeeding(true);
    setStatus('idle');
    try {
      for (const scheme of EXTENDED_SCHEMES) {
        // Upload each scheme individually to the schemes collection
        const docRef = doc(db, 'schemes', scheme.id);
        await setDoc(docRef, scheme);
      }
      setStatus('success');
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Unknown error occurred.');
      setStatus('error');
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 transform transition-all">
        <div className="text-center mb-8">
          <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Database className="text-orange-600 w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-navy">Database Management</h2>
          <p className="text-gray-500 text-sm mt-2">
            Seed your Firestore Database with realistic Indian government schemes.
          </p>
        </div>

        {status === 'success' && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6 flex items-start gap-3">
            <CheckCircle2 className="text-green-500 w-5 h-5 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="text-green-800 font-bold text-sm">Successfully Seeded!</h4>
              <p className="text-green-600 text-xs mt-1">10 schemes have been uploaded to your Firestore database.</p>
            </div>
          </div>
        )}

        {status === 'error' && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 flex items-start gap-3">
            <ShieldAlert className="text-red-500 w-5 h-5 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="text-red-800 font-bold text-sm">Permission Denied</h4>
              <p className="text-red-600 text-xs mt-1 break-words">{errorMsg}</p>
              <div className="mt-3 bg-white/50 p-2 rounded text-xs border border-red-100">
                <strong>Fix:</strong> Go to Firebase Console &gt; Firestore &gt; Rules, and temporarily change rules to:
                <pre className="mt-1 font-mono text-[10px] bg-white p-2 rounded">
{`rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}`}
                </pre>
              </div>
            </div>
          </div>
        )}

        <button
          onClick={seedDatabase}
          disabled={isSeeding}
          className="w-full bg-orange-primary hover:bg-orange-600 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isSeeding ? (
            <>
              <Loader2 className="animate-spin w-5 h-5" />
              Seeding Database...
            </>
          ) : (
            <>
              <Database className="w-5 h-5" />
              Seed 10 Mock Schemes to Firestore
            </>
          )}
        </button>

        <p className="mt-6 text-center text-xs text-gray-400">
          Note: This action writes directly to the connected Firebase project. 
          Make sure your Firestore rules allow write access.
        </p>
      </div>
    </div>
  );
}
