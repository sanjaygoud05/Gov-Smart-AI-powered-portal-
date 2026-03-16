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
    faqs: [{ question: 'How often are payments?', answer: '100 days per household per year.' }]
  },
  {
    id: "national-overseas-scholarship-pwd",
    title: "National Overseas Scholarship For Students With Disabilities",
    description: "A scholarship scheme by the Ministry of Social Justice & Empowerment for regular, full-time students with disabilities to obtain higher education viz., Master's degree, or Ph.D. courses from foreign universities, in one of the specified fields of study.",
    category: "Education",
    level: "Central",
    departmentName: "Department of Empowerment of Persons with Disabilities",
    ministry: "Ministry of Social Justice and Empowerment",
    updatedAt: "17 Mar 2025",
    startDate: "2014-01-01",
    expiryDate: "2030-12-31",
    objectives: [
      "To provide financial assistance to students with disabilities for pursuing higher education abroad.",
      "To empower persons with disabilities through international exposure and advanced education."
    ],
    benefits: [
      "Annual Maintenance Allowance: $15,400 (USA/others) or 9,900 GBP (UK).",
      "Contingency Allowance: $1,500 (USA/others) or 1,100 GBP (UK).",
      "Equipment Allowance: ₹1,500.",
      "Actual Tuition Fees, Visa Fees, Medical Insurance, and Air Passage (Economy class)."
    ],
    eligibility: [
      "The applicant must be a student with a disability (40% or more).",
      "Admitted into or received an unconditional offer for Masters/Ph.D. abroad.",
      "Applicant must be 35 years or younger.",
      "Total Family Income must not exceed ₹6 lakh per annum."
    ],
    documents: [
      "Aadhaar Card",
      "Disability Certificate",
      "Income Certificate",
      "Admission Letter from foreign university",
      "Passport"
    ],
    howToApply: [
      "1. Register on the NOS portal via socialjustice.gov.in.",
      "2. Fill out the application form with academic and personal details.",
      "3. Upload required documents including admission proof.",
      "4. Submit the application for verification by the Ministry."
    ],
    applicationUrl: "https://nosmsje.gov.in/",
    faqs: [
      {
        question: "Is there an age limit?",
        answer: "Yes, the applicant must be 35 years or younger as on April 1st of the application year."
      }
    ]
  },
  {
    id: "skilled-youth-startup-sikkim",
    title: "Skilled Youth Startup Scheme (Sikkim)",
    description: "Assists educated unemployed youth in Sikkim in setting up enterprises through loans with back-ended financial subsidy assistance.",
    category: "Business",
    level: "State",
    departmentName: "Department of Commerce and Industries",
    ministry: "Govt of Sikkim",
    updatedAt: "17 Mar 2025",
    startDate: "2020-01-01",
    expiryDate: "2028-12-31",
    objectives: [
      "To encourage entrepreneurship among the youth of Sikkim.",
      "To provide financial support for starting small and medium enterprises."
    ],
    benefits: [
      "Financial support through bank loans with a back-ended subsidy of 35% or 50%.",
      "Maximum project cost up to ₹20 lakhs.",
      "Mandatory Entrepreneur Development Training provided.",
      "Preference for Persons with Disabilities (PwDs)."
    ],
    eligibility: [
      "Must be an unemployed youth of Sikkim.",
      "Must have a valid Sikkim Subject Certificate/Certificate of Identification.",
      "Minimum educational qualification: Class 5 pass.",
      "Age: 18 to 40 years."
    ],
    documents: [
      "Sikkim Subject Certificate / COI",
      "Unemployment Certificate",
      "Project Report",
      "Educational Certificates"
    ],
    howToApply: [
      "1. Approach the District Industries Center (DIC) in your district.",
      "2. Submit the project proposal and application form.",
      "3. Attend the interview/screening committee meeting.",
      "4. After approval, the bank will sanction the loan with subsidy support."
    ],
    applicationUrl: "https://sikkim.gov.in/",
    faqs: [
      {
        question: "What is the maximum project cost?",
        answer: "The scheme supports projects up to ₹20 lakhs."
      }
    ]
  },
  {
    id: "rmewf-medical-ex-servicemen",
    title: "RMEWF - Financial Assistance For Medical Treatment",
    description: "Provides financial assistance to non-pensioner Ex-Servicemen/widows of ranks up to Havildar/equivalent to meet routine medical expenses.",
    category: "Health",
    level: "Central",
    departmentName: "Kendriya Sainik Board",
    ministry: "Ministry of Defence",
    updatedAt: "17 Mar 2025",
    startDate: "2011-04-01",
    expiryDate: "2035-12-31",
    objectives: [
      "To provide health security to non-pensioner ex-servicemen.",
      "To alleviate medical expense burden for retired soldiers in lower ranks."
    ],
    benefits: [
      "Financial assistance up to a maximum of ₹30,000 per year."
    ],
    eligibility: [
      "Applicant must be a non-pensioner ESM (Ex-Servicemen) or his widow.",
      "Rank: Havildar/equivalent and below.",
      "Must be recommended by respective Zila Sainik Board (ZSB).",
      "Expenditure must be incurred at recognized government hospitals."
    ],
    documents: [
      "Discharge Book",
      "Identity Card issued by ZSB",
      "Medical Bills and Discharge Summary",
      "Non-pensioner certificate"
    ],
    howToApply: [
      "1. Download the application form from ksb.gov.in.",
      "2. Submit the completed form to your respective Zila Sainik Board.",
      "3. The KSB will process the claim and transfer the amount via DBT."
    ],
    applicationUrl: "https://ksb.gov.in/",
    faqs: [
      {
        question: "Is it available for officers?",
        answer: "No, this specific assistance is for ranks up to Havildar and equivalent."
      }
    ]
  },
  {
    id: "post-matric-scholarship-pwd",
    title: "Post Matric Scholarship For Students With Disabilities",
    description: "Scholarship for students with disabilities pursuing post-matric qualifications (Class 11 to Master's degree) from recognized universities/colleges.",
    category: "Education",
    level: "Central",
    departmentName: "Department of Empowerment of Persons with Disabilities",
    ministry: "Ministry of Social Justice and Empowerment",
    updatedAt: "17 Mar 2025",
    startDate: "2018-01-01",
    expiryDate: "2030-12-31",
    objectives: [
      "To support students with disabilities in their post-matric education.",
      "To reduce the financial barrier for higher studies for persons with disabilities."
    ],
    benefits: [
      "Maintenance Allowance: Up to ₹1,600 (Hostellers) or ₹750 (Day Scholars) per month.",
      "Disability Allowances: Up to ₹4,000 per annum.",
      "Reimbursement of compulsory non-refundable fees.",
      "Book Allowance: ₹1,500 per annum."
    ],
    eligibility: [
      "Student with a disability (40% or more).",
      "Pursuing a post-matric qualification (Class 11 to Master's degree).",
      "Family income ≤ ₹2.5 Lakh per annum.",
      "Admitted to a recognized institution."
    ],
    documents: [
      "Disability Certificate",
      "Income Certificate",
      "Previous Class Marksheet",
      "Fee Receipt"
    ],
    howToApply: [
      "1. Apply through the National Scholarship Portal (scholarships.gov.in).",
      "2. Select the Department of Empowerment of Persons with Disabilities.",
      "3. Register and fill in the application form.",
      "4. Submit for institute and state level verification."
    ],
    applicationUrl: "https://scholarships.gov.in/",
    faqs: [
      {
        question: "What is the income limit?",
        answer: "Annual family income should be less than or equal to ₹2.5 Lakh."
      }
    ]
  },
  {
    id: "skill-loan-scheme",
    title: "Skill Loan Scheme",
    description: "Institutional credit for individuals pursuing skill development courses aligned with National Occupations Standards.",
    category: "Finance",
    level: "Central",
    departmentName: "National Skill Development Corporation (NSDC)",
    ministry: "Ministry of Skill Development and Entrepreneurship",
    updatedAt: "17 Mar 2025",
    startDate: "2015-07-15",
    expiryDate: "2030-12-31",
    objectives: [
      "To provide affordable credit for skill development.",
      "To support the Skill India mission by enabling youth to take up training."
    ],
    benefits: [
      "Loan amount: ₹5,000 to ₹1,50,000.",
      "Interest Rate: Base rate (MCLR) + 1.5%.",
      "Repayment period: Up to 7 years.",
      "No collateral or third-party guarantee required."
    ],
    eligibility: [
      "Admission in a course run by ITIs, Polytechnics, or recognized schools/colleges.",
      "Training partners affiliated with NSDC, Sector Skill Councils, or State Skill Missions."
    ],
    documents: [
      "Aadhaar Card",
      "Admission Proof",
      "Fee structure for the skill course",
      "KYC documents for the bank"
    ],
    howToApply: [
      "1. Identify a course in an NSDC-affiliated training center.",
      "2. Approach any public sector bank or select private banks.",
      "3. Submit the admission proof and application for the Skill Loan.",
      "4. The bank will verify and disburse the loan to the training provider."
    ],
    applicationUrl: "https://www.nsdcindia.org/",
    faqs: [
      {
        question: "Is collateral needed?",
        answer: "No, loans under this scheme do not require collateral or third-party guarantees."
      }
    ]
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
              <p className="text-green-600 text-xs mt-1">15 schemes have been uploaded to your Firestore database.</p>
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
              Seed 15 Mock Schemes to Firestore
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
