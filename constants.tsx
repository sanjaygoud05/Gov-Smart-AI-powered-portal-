
import React from 'react';
import { 
  Sprout, 
  GraduationCap, 
  HeartPulse, 
  Briefcase, 
  Baby, 
  Store,
  Home,
  Wallet
} from 'lucide-react';
import { Scheme, SchemeCategory } from './types';

export const INDIAN_STATES_UTS = [
  "Andaman and Nicobar Islands", "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", 
  "Chandigarh", "Chhattisgarh", "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Goa", 
  "Gujarat", "Haryana", "Himachal Pradesh", "Jammu and Kashmir", "Jharkhand", "Karnataka", 
  "Kerala", "Ladakh", "Lakshadweep", "Madhya Pradesh", "Maharashtra", "Manipur", 
  "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Puducherry", "Punjab", "Rajasthan", 
  "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"
];

export const OCCUPATIONS = [
  "Farmer",
  "Student",
  "Self-employed / Small Business",
  "Salaried Employee (Private)",
  "Government Employee",
  "Unemployed",
  "Retired / Senior Citizen",
  "Homemaker",
  "Daily Wage Laborer",
  "Artisan / Handicraft Worker",
  "Other"
];

export const CATEGORIES: { label: SchemeCategory; icon: React.ReactNode; color: string }[] = [
  { label: 'Agriculture', icon: <Sprout size={24} />, color: 'bg-green-100 text-green-700' },
  { label: 'Education', icon: <GraduationCap size={24} />, color: 'bg-blue-100 text-blue-700' },
  { label: 'Health', icon: <HeartPulse size={24} />, color: 'bg-red-100 text-red-700' },
  { label: 'Employment', icon: <Briefcase size={24} />, color: 'bg-purple-100 text-purple-700' },
  { label: 'Women & Child', icon: <Baby size={24} />, color: 'bg-pink-100 text-pink-700' },
  { label: 'Business', icon: <Store size={24} />, color: 'bg-indigo-100 text-indigo-700' },
  { label: 'Housing', icon: <Home size={24} />, color: 'bg-orange-100 text-orange-700' },
  { label: 'Finance', icon: <Wallet size={24} />, color: 'bg-teal-100 text-teal-700' },
];

export const MOCK_SCHEMES: Scheme[] = [
  {
    id: 'pm-kisan',
    title: 'PM-KISAN Samman Nidhi',
    description: 'Direct income support of ₹6,000 per year to small and marginal farmer families across India.',
    category: 'Agriculture',
    level: 'Central',
    ministry: 'Ministry of Agriculture & Farmers Welfare',
    updatedAt: '15 Jan 2024',
    objectives: [
      'Provide income support to all landholding farmer families.',
      'Supplement financial needs for agricultural inputs.',
      'Ensure proper crop health and appropriate yields.',
      'Meet domestic needs related to agriculture.'
    ],
    benefits: [
      '₹6,000 per year in three equal installments of ₹2,000 each.',
      'Direct Bank Transfer (DBT) to beneficiary bank account.',
      'No interest or repayment required.',
      'Coverage for all landholding farmer families.'
    ],
    eligibility: [
      'All landholding farmer families are eligible.',
      'Family should have cultivable land.',
      'Institutional landholders are excluded.',
      'Former and present holders of constitutional posts are excluded.'
    ],
    documents: [
      'Aadhaar Card',
      'Land ownership documents',
      'Bank account details',
      'Mobile number linked with Aadhaar'
    ],
    howToApply: [
      'Visit the official PM-KISAN portal.',
      'Click on "New Farmer Registration".',
      'Enter your Aadhaar number and captcha.',
      'Fill in the required details including land information.',
      'Upload required documents.',
      'Submit the application.',
      'Note down the registration number for tracking.'
    ],
    faqs: [
      { question: 'How can I check my PM-KISAN status?', answer: 'You can check your status on the official portal using your mobile number or Aadhaar.' },
      { question: 'When are the installments credited?', answer: 'Installments are usually credited every four months.' }
    ]
  },
  {
    id: 'mgnrega',
    title: 'MGNREGA Employment Guarantee',
    description: 'Mahatma Gandhi National Rural Employment Guarantee Act provides at least 100 days of guaranteed wage employment in a financial year to every rural household.',
    category: 'Employment',
    level: 'Central',
    ministry: 'Ministry of Rural Development',
    updatedAt: '02 Feb 2024',
    objectives: [
      'Enhance livelihood security in rural areas.',
      'Provide at least 100 days of guaranteed wage employment.',
      'Create durable assets like roads, canals, and ponds.',
      'Promote social inclusion by encouraging women participation.'
    ],
    benefits: [
      'Guaranteed wage employment for 100 days.',
      'Wages paid within 15 days of work completion.',
      'Unemployment allowance if work is not provided within 15 days.',
      'Work provided within 5 km radius of the village.'
    ],
    eligibility: [
      'Adult members of a rural household.',
      'Willing to do unskilled manual work.',
      'Resident of the village where the job card is applied.'
    ],
    documents: [
      'Aadhaar Card',
      'Bank Passbook',
      'Photograph',
      'Address Proof'
    ],
    howToApply: [
      'Visit the local Gram Panchayat office.',
      'Fill the Job Card registration form.',
      'Submit the required identity and address proofs.',
      'Collect your Job Card and apply for work whenever needed.'
    ],
    faqs: [
      { question: 'What is the wage rate?', answer: 'Wage rates vary by state and are updated periodically by the central government.' },
      { question: 'Is there a minimum age?', answer: 'Yes, members must be at least 18 years old.' }
    ]
  },
  {
    id: 'ayushman-bharat',
    title: 'Ayushman Bharat (PM-JAY)',
    description: 'Worlds largest health insurance scheme providing a cover of ₹5 lakh per family per year for secondary and tertiary care hospitalization.',
    category: 'Health',
    level: 'Central',
    ministry: 'Ministry of Health and Family Welfare',
    updatedAt: '20 Jan 2024',
    objectives: [
      'Achieve Universal Health Coverage (UHC).',
      'Reduce out-of-pocket expenditure on health.',
      'Provide access to quality healthcare for vulnerable families.'
    ],
    benefits: [
      'Health cover of ₹5 lakh per family per year.',
      'Cashless and paperless access to services.',
      'Covers up to 3 days of pre-hospitalization and 15 days of post-hospitalization.',
      'Covers pre-existing conditions from day one.'
    ],
    eligibility: [
      'Families listed in the SECC 2011 database.',
      'Low-income households in rural and urban areas.',
      'No cap on family size or age.'
    ],
    documents: [
      'Aadhaar Card',
      'Ration Card',
      'Family Identity Proof',
      'Registered mobile number'
    ],
    howToApply: [
      'Check eligibility on the PM-JAY website.',
      'Visit the nearest Ayushman Bharat empanelled hospital or CSC.',
      'Provide Aadhaar or Ration Card for identification.',
      'Get your Ayushman Card issued.'
    ],
    faqs: [
      { question: 'Can I use this at private hospitals?', answer: 'Yes, if the private hospital is empanelled under the PM-JAY scheme.' }
    ]
  },
  {
    id: 'pm-mudra',
    title: 'PM Mudra Yojana',
    description: 'Providing loans up to ₹10 lakh to non-corporate, non-farm small/micro enterprises.',
    category: 'Business',
    level: 'Central',
    ministry: 'Ministry of Finance',
    updatedAt: '05 Jan 2024',
    objectives: [
      'Promote entrepreneurship among youth.',
      'Provide credit facilities to small business units.',
      'Generate employment opportunities in the non-farm sector.'
    ],
    benefits: [
      'Collateral-free loans.',
      'Three categories: Shishu (up to ₹50,000), Kishore (₹50k-₹5L), and Tarun (₹5L-₹10L).',
      'Competitive interest rates.',
      'Processing fee is nil or very low.'
    ],
    eligibility: [
      'Any Indian citizen with a business plan for non-farm income.',
      'Micro-units like shopkeepers, artisans, fruit vendors, etc.',
      'Existing small businesses looking to expand.'
    ],
    documents: [
      'Identity Proof (Aadhaar/Voter ID)',
      'Address Proof',
      'Business Proof/Registration',
      'Passport size photos'
    ],
    howToApply: [
      'Approach any commercial bank, RRB, or MFI.',
      'Fill the Mudra loan application form.',
      'Submit the business proposal and documents.',
      'Sanction and disbursement by the bank.'
    ],
    faqs: [
      { question: 'Is a guarantor required?', answer: 'No, Mudra loans are collateral-free and do not require a guarantor.' }
    ]
  },
  {
    id: 'pma-yojana',
    title: 'Pradhan Mantri Awas Yojana - Urban',
    description: 'Affordable housing for urban poor with interest subsidy on home loans.',
    category: 'Housing',
    level: 'Central',
    ministry: 'Housing and Urban Affairs',
    updatedAt: '10 Jan 2024',
    objectives: [
      'Housing for All in urban areas.',
      'Interest subsidy for EWS/LIG/MIG groups.',
      'Slum rehabilitation with participation of private developers.',
      'Promotion of affordable housing for weaker sections.'
    ],
    benefits: [
      'Subsidy up to ₹2.67 lakh on home loan interest.',
      'Preference to women and elderly.',
      'Better living standards and security.',
      'Financial inclusion for urban poor.'
    ],
    eligibility: [
      'Applicant must not own a pucca house anywhere in India.',
      'Household income criteria as per EWS/LIG/MIG definitions.',
      'The house must be in the name of the female head of household or joint name.'
    ],
    documents: [
      'Aadhaar Card',
      'Address proof',
      'Income certificate',
      'Property documents'
    ],
    howToApply: [
      'Register on the PMAY-U portal.',
      'Select the benefit component (e.g., Credit Linked Subsidy).',
      'Fill in personal and bank details.',
      'Upload documents.',
      'Submit and save the application ID.'
    ],
    faqs: [
      { question: 'Who is eligible for PMAY subsidy?', answer: 'Individuals belonging to EWS, LIG, or MIG categories without a pucca house.' }
    ]
  },
  {
    id: 'sukanya-samriddhi',
    title: 'Sukanya Samriddhi Yojana',
    description: 'Savings scheme for girl child with attractive interest rates and tax benefits.',
    category: 'Finance',
    level: 'Central',
    ministry: 'Finance',
    updatedAt: '12 Jan 2024',
    objectives: [
      'Ensure a bright future for girl children.',
      'Promote savings for education and marriage.',
      'Provide financial independence to young women.'
    ],
    benefits: [
      'Higher interest rates compared to other savings schemes.',
      'Tax deduction under Section 80C.',
      'Tax-free maturity amount.',
      'Account can be transferred anywhere in India.'
    ],
    eligibility: [
      'Opening by legal guardian in the name of a girl child.',
      'Girl child must be below 10 years of age.',
      'Only one account per girl child.',
      'Maximum two accounts in a family (exceptions for twins/triplets).'
    ],
    documents: [
      'Birth certificate of girl child',
      'Identity proof of guardian',
      'Address proof of guardian',
      'Photographs'
    ],
    howToApply: [
      'Visit any post office or authorized commercial bank.',
      'Fill out the application form.',
      'Submit the required documents and initial deposit.',
      'Receive the passbook for the account.'
    ],
    faqs: [
      { question: 'What is the minimum deposit?', answer: 'Minimum deposit is ₹250 per year.' }
    ]
  },
  {
    id: 'pm-skilling',
    title: 'PM Kaushal Vikas Yojana',
    description: 'Flagship skill development initiative to enable Indian youth to take up industry-relevant skill training.',
    category: 'Education',
    level: 'Central',
    ministry: 'Ministry of Skill Development & Entrepreneurship',
    updatedAt: '18 Jan 2024',
    objectives: [
      'Encourage standardization in the certification process.',
      'Enable youth to take up industry-relevant skill training.',
      'Increase productivity of existing workforce.'
    ],
    benefits: [
      'Free skill training across various sectors.',
      'Certification recognized by industries.',
      'Placement assistance after completion.',
      'Monetary reward upon successful certification.'
    ],
    eligibility: [
      'Any unemployed youth or school/college dropout.',
      'Must have a verifiable identity proof (Aadhaar).',
      'Age between 15-45 years.'
    ],
    documents: [
      'Aadhaar Card',
      'Educational certificates',
      'Bank account details',
      'Recent photographs'
    ],
    howToApply: [
      'Visit the PMKVY official website.',
      'Find a training center near you.',
      'Register for the preferred course.',
      'Complete the training and clear the assessment.'
    ],
    faqs: [
      { question: 'Is there a fee for the training?', answer: 'No, the training is completely free of cost for eligible candidates.' }
    ]
  },
  {
    id: 'beti-bachao',
    title: 'Beti Bachao Beti Padhao',
    description: 'A nationwide campaign to generate awareness and improve the efficiency of welfare services intended for girls.',
    category: 'Women & Child',
    level: 'Central',
    ministry: 'Ministry of Women and Child Development',
    updatedAt: '22 Jan 2024',
    objectives: [
      'Prevent gender-biased sex-selective elimination.',
      'Ensure survival and protection of the girl child.',
      'Ensure education and participation of the girl child.'
    ],
    benefits: [
      'Improved Child Sex Ratio.',
      'Better educational opportunities for girls.',
      'Financial support through linked schemes like Sukanya Samriddhi.',
      'Awareness and social mobilization.'
    ],
    eligibility: [
      'All Indian families with girl children.',
      'Special focus on districts with low child sex ratio.'
    ],
    documents: [
      'Identity proof of parents',
      'Birth certificate of the girl child',
      'Address proof'
    ],
    howToApply: [
      'This is largely a campaign-driven scheme.',
      'Benefits are accessed through linked programs in health and education departments.',
      'Contact local Anganwadi or District Administration for specific support.'
    ],
    faqs: [
      { question: 'Is it a direct cash transfer scheme?', answer: 'It is a multi-sectoral initiative; financial benefits are usually routed through specific schemes like SSY.' }
    ]
  }
];
