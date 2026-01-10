
import React from 'react';
import { 
  Sprout, 
  GraduationCap, 
  HeartPulse, 
  Briefcase, 
  Baby, 
  Store,
  Home,
  Wallet,
  Zap
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

export const CATEGORIES: { label: SchemeCategory | 'Energy'; icon: React.ReactNode; color: string }[] = [
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
  // --- CENTRAL SCHEMES ---
  {
    id: 'pm-surya-ghar',
    title: 'PM Surya Ghar: Muft Bijli Yojana (2025)',
    description: 'Providing free electricity up to 300 units per month to 1 crore households through rooftop solar installations with massive subsidies.',
    category: 'Housing',
    level: 'Central',
    ministry: 'Ministry of New and Renewable Energy',
    updatedAt: '15 Jan 2025',
    objectives: ['Provide free electricity up to 300 units.', 'Promote sustainable energy.', 'Reduce utility bills.'],
    benefits: ['Subsidy up to ₹78,000.', 'Free power units.', 'Income from surplus power.'],
    eligibility: ['Indian citizen.', 'Roof ownership.', 'Valid electricity connection.'],
    documents: ['Aadhaar', 'Electricity Bill', 'Bank Passbook'],
    howToApply: [
      'Go to the National Portal for Rooftop Solar.',
      'Register with your State/Electricity Distribution Company and Consumer Account Number.',
      'Apply for Rooftop Solar and wait for Feasibility Approval from your DISCOM.',
      'Install the solar plant through empanelled vendors after approval.',
      'Apply for net metering and inspection by the DISCOM.',
      'After inspection, the subsidy is disbursed to your bank account.'
    ],
    applicationUrl: 'https://pmsuryaghar.gov.in/',
    faqs: [{ question: 'What is the limit?', answer: '300 units per month.' }]
  },
  {
    id: 'pm-vishwakarma',
    title: 'PM Vishwakarma Scheme',
    description: 'Providing end-to-end support to artisans and craftspeople who work with their hands and tools.',
    category: 'Employment',
    level: 'Central',
    ministry: 'Ministry of MSME',
    updatedAt: '10 Feb 2025',
    objectives: ['Recognition as Vishwakarma.', 'Skill Upgradation.', 'Credit Support.'],
    benefits: ['₹15,000 toolkit incentive.', 'Collateral-free credit up to ₹3 Lakh.', 'ID Card and Certificate.'],
    eligibility: ['Artisan or craftsperson working with tools.', 'Minimum age 18 years.', 'One member per family.'],
    documents: ['Aadhaar Card', 'Mobile Number', 'Bank Details', 'Ration Card'],
    howToApply: [
      'Visit a Common Service Centre (CSC).',
      'Artisans must register using Aadhaar biometric authentication.',
      'Provide details of your craft and bank information.',
      'Undergo basic and advanced training modules.',
      'Apply for the credit support or toolkit incentive after certification.'
    ],
    applicationUrl: 'https://pmvishwakarma.gov.in/',
    faqs: [{ question: 'Is training paid?', answer: 'Yes, a daily stipend of ₹500 is provided during training.' }]
  },
  {
    id: 'ayushman-bharat-70',
    title: 'Ayushman Bharat Senior Citizen (70+) Cover',
    description: 'Health cover of ₹5 Lakh per year for all senior citizens aged 70 years and above, irrespective of income.',
    category: 'Health',
    level: 'Central',
    ministry: 'Ministry of Health and Family Welfare',
    updatedAt: '01 Jan 2025',
    objectives: ['Universal health cover for elderly.', 'Reduce medical expenditure burden.'],
    benefits: ['₹5 Lakh annual health insurance.', 'Cashless treatment.', 'Covers pre-existing diseases.'],
    eligibility: ['Indian citizen aged 70 or above.', 'No income criteria.'],
    documents: ['Aadhaar Card (Mandatory for DOB)'],
    howToApply: [
      'Download the Ayushman App or visit the beneficiary portal.',
      'Login using your Aadhaar-linked mobile number.',
      'Select the 70+ Senior Citizen scheme category.',
      'Complete the e-KYC using biometric or OTP.',
      'Download the 70+ Ayushman Card instantly.'
    ],
    applicationUrl: 'https://beneficiary.nha.gov.in/',
    faqs: [{ question: 'Income limit?', answer: 'There is no income limit for citizens aged 70+.' }]
  },
  {
    id: 'pm-vidyalaxmi',
    title: 'PM-Vidyalaxmi Education Loan',
    description: 'Collateral-free, guarantor-free loans for students admitted to top-tier higher education institutions in India.',
    category: 'Education',
    level: 'Central',
    ministry: 'Ministry of Education',
    updatedAt: '05 Jan 2025',
    objectives: ['Financial support for higher ed.', 'No student left behind.'],
    benefits: ['Loans up to ₹7.5 Lakh with 75% credit guarantee.', '3% interest subvention.'],
    eligibility: ['Students in top 860 institutions.', 'Merit based admission.', 'Family income < ₹8 Lakh for subvention.'],
    documents: ['Admission Letter', 'Aadhaar', 'Income Certificate'],
    howToApply: [
      'Register on the PM-Vidyalaxmi portal.',
      'Fill the Common Education Loan Application Form (CELAF).',
      'Upload the admission letter and fee structure.',
      'Choose your preferred bank and submit the application digitally.',
      'Track your application and receive the loan sanction online.'
    ],
    applicationUrl: 'https://www.vidyalakshmi.co.in/',
    faqs: [{ question: 'Need guarantor?', answer: 'No.' }]
  },
  {
    id: 'pm-svanidhi',
    title: 'PM SVANidhi (Street Vendors Loan)',
    description: 'A special micro-credit facility for street vendors to provide them affordable working capital loans.',
    category: 'Business',
    level: 'Central',
    ministry: 'Ministry of Housing and Urban Affairs',
    updatedAt: '20 Dec 2024',
    objectives: ['Facilitate working capital loans.', 'Reward digital transactions.'],
    benefits: ['Initial loan of ₹10,000.', '₹20,000 and ₹50,000 subsequent loans.', '7% interest subsidy.'],
    eligibility: ['Street vendors in urban areas.', 'Must have Certificate of Vending or ID Card.'],
    documents: ['Aadhaar Card', 'Voter ID', 'Certificate of Vending'],
    howToApply: [
      'Visit the PM SVANidhi portal.',
      'Enter your mobile number and check your name in the vendor list.',
      'Apply for the loan by choosing a nearby lender (Bank/NBFC).',
      'Submit the required identity proof digitally.',
      'Loan is sanctioned and disbursed directly to your bank account.'
    ],
    applicationUrl: 'https://pmsvanidhi.mohua.gov.in/',
    faqs: [{ question: 'Is collateral needed?', answer: 'No, this is a collateral-free loan.' }]
  },
  {
    id: 'atal-pension-yojana',
    title: 'Atal Pension Yojana (APY)',
    description: 'A government-backed pension scheme focused on the unorganized sector to ensure post-retirement income.',
    category: 'Finance',
    level: 'Central',
    ministry: 'Ministry of Finance',
    updatedAt: '15 Jan 2025',
    objectives: ['Social security for workers.', 'Guaranteed monthly pension.'],
    benefits: ['Fixed monthly pension (₹1,000 to ₹5,000).', 'Death benefit to spouse.', 'Return of corpus to nominee.'],
    eligibility: ['Indian citizen.', 'Age between 18 to 40 years.', 'Savings bank account holder.'],
    documents: ['Aadhaar Card', 'Mobile Number', 'Bank Account'],
    howToApply: [
      'Visit your local bank branch where you have a savings account.',
      'Fill out the APY registration form.',
      'Choose your pension amount and contribution frequency (monthly/quarterly).',
      'Provide standing instructions to auto-debit the contribution.',
      'Receive a PRAN card confirming your enrollment.'
    ],
    applicationUrl: 'https://npscra.nsdl.co.in/scheme-details.php',
    faqs: [{ question: 'What is the max age to join?', answer: '40 years is the maximum age to enter the scheme.' }]
  },

  // --- STATE SCHEMES ---
  {
    id: 'ladli-behna',
    title: 'Mukhyamantri Ladli Behna Yojana (MP)',
    description: 'Financial assistance to women in Madhya Pradesh to empower them and improve their health and nutrition.',
    category: 'Women & Child',
    level: 'State',
    ministry: 'Govt of Madhya Pradesh',
    updatedAt: '05 Feb 2025',
    objectives: ['Economic independence of women.', 'Improve health outcomes.'],
    benefits: ['Monthly direct benefit transfer of ₹1,250.', 'Social security for rural women.'],
    eligibility: ['Women residents of MP.', 'Age 21 to 60 years.', 'Annual family income < ₹2.5 Lakh.'],
    documents: ['Samagra ID', 'Aadhaar Card', 'Bank Passbook'],
    howToApply: [
      'Visit your local Gram Panchayat or Ward Office.',
      'Fill out the registration form during the special camps.',
      'Provide your Samagra ID and Aadhaar for biometric verification.',
      'Ensure your bank account is Aadhaar-seeded and DBT-enabled.',
      'The monthly amount will be credited to your account on the 10th of every month.'
    ],
    applicationUrl: 'https://cmladlibehna.mp.gov.in/',
    faqs: [{ question: 'Can unmarried women apply?', answer: 'No, currently applicable to married, widowed, and divorced women.' }]
  },
  {
    id: 'rythu-bandhu',
    title: 'Rythu Bandhu (Investment Support - Telangana)',
    description: 'Telangana government provides investment support for agriculture and horticulture crops by way of a grant.',
    category: 'Agriculture',
    level: 'State',
    ministry: 'Govt of Telangana',
    updatedAt: '12 Jan 2025',
    objectives: ['Relieve farmers from debt trap.', 'Support agricultural investment.'],
    benefits: ['₹10,000 per acre per year.', 'Two installments for Rabi and Kharif seasons.'],
    eligibility: ['Landholding farmers in Telangana.', 'Pattadar Passbook holders.'],
    documents: ['Pattadar Passbook', 'Aadhaar Card', 'Voter ID'],
    howToApply: [
      'Register land details with the Agriculture Extension Officer (AEO).',
      'The land records are verified from the Dharani portal.',
      'Eligible farmers are identified based on the verified records.',
      'The investment amount is directly credited to the farmers bank accounts through DBT.'
    ],
    applicationUrl: 'https://rythubandhu.telangana.gov.in/',
    faqs: [{ question: 'Is tenant farmer eligible?', answer: 'No, only land owners (Pattadars) are currently eligible.' }]
  },
  {
    id: 'kanyashree-prakalpa',
    title: 'Kanyashree Prakalpa (West Bengal)',
    description: 'A conditional cash transfer scheme aimed at improving the status and well-being of the girl child in West Bengal.',
    category: 'Education',
    level: 'State',
    ministry: 'Govt of West Bengal',
    updatedAt: '20 Jan 2025',
    objectives: ['Prevent child marriage.', 'Encourage higher education for girls.'],
    benefits: ['Annual scholarship of ₹1,000 (K1).', 'One-time grant of ₹25,000 (K2).'],
    eligibility: ['Resident of West Bengal.', 'Girls aged 13-18 years for K1.', 'Girls aged 18-19 for K2.', 'Unmarried.'],
    documents: ['Birth Certificate', 'Aadhaar Card', 'Bank Passbook', 'Declaration of Unmarried Status'],
    howToApply: [
      'Obtain the application form from your school or college.',
      'Fill in the personal details and get it signed by the institutional head.',
      'Submit the form along with proof of age and bank details.',
      'Track your application status through the Kanyashree portal.',
      'The funds are transferred directly to the student’s bank account.'
    ],
    applicationUrl: 'https://www.wbkanyashree.gov.in/',
    faqs: [{ question: 'Is K2 mandatory after K1?', answer: 'Yes, if the student remains unmarried and continues education until 18.' }]
  },
  {
    id: 'gruha-lakshmi',
    title: 'Gruha Lakshmi Scheme (Karnataka)',
    description: 'Providing monthly financial support of ₹2,000 to the woman head of every household in Karnataka.',
    category: 'Women & Child',
    level: 'State',
    ministry: 'Govt of Karnataka',
    updatedAt: '18 Jan 2025',
    objectives: ['Support women-led households.', 'Address price rise issues.'],
    benefits: ['₹2,000 per month directly to woman head of family.'],
    eligibility: ['Resident of Karnataka.', 'Woman head of household as per Ration Card (BPL/APL/Antyodaya).'],
    documents: ['Ration Card', 'Aadhaar Card of woman and husband', 'Mobile Number'],
    howToApply: [
      'Register at Seva Sindhu portal or visit Karnataka One/Gram One centres.',
      'Submit your application with your Ration Card number.',
      'Link your bank account with Aadhaar for DBT.',
      'Provide your husband’s Aadhaar details for verification.',
      'Receive monthly payment notification via SMS.'
    ],
    applicationUrl: 'https://sevasindhu.karnataka.gov.in/',
    faqs: [{ question: 'Can APL card holders apply?', answer: 'Yes, but not those paying GST or Income Tax.' }]
  },
  {
    id: 'magalir-urimai',
    title: 'Magalir Urimai Thogai (Tamil Nadu)',
    description: 'Monthly basic income support of ₹1,000 for women heads of families in Tamil Nadu.',
    category: 'Women & Child',
    level: 'State',
    ministry: 'Govt of Tamil Nadu',
    updatedAt: '10 Feb 2025',
    objectives: ['Recognize women\'s unpaid labor.', 'Economic empowerment.'],
    benefits: ['₹1,000 per month via DBT.'],
    eligibility: ['Resident of Tamil Nadu.', 'Family income < ₹2.5 Lakh.', 'Electricity consumption < 3600 units/year.'],
    documents: ['Smart Ration Card', 'Aadhaar Card', 'Bank Details'],
    howToApply: [
      'The government organizes registration camps in phases.',
      'Receive an SMS invitation for the camp based on your ration card address.',
      'Visit the camp with your original Aadhaar and Ration Card.',
      'Fill the biometric-enabled application form at the camp.',
      'The money is credited to the bank account on the 15th of every month.'
    ],
    applicationUrl: 'https://www.tn.gov.in/',
    faqs: [{ question: 'What is the age limit?', answer: 'Women aged 21 and above are eligible.' }]
  },
  {
    id: 'delhi-e-bus-subsidy',
    title: 'Delhi Electric Vehicle Policy (E-Bus Expansion)',
    description: 'Special incentives and subsidies for individuals and businesses switching to electric mobility in the capital.',
    category: 'Business',
    level: 'State',
    ministry: 'Govt of Delhi',
    updatedAt: '01 Feb 2025',
    objectives: ['Reduce pollution.', 'Promote EV adoption.'],
    benefits: ['Purchase incentive up to ₹1.5 Lakh.', 'Road tax waiver.', 'Registration fee waiver.'],
    eligibility: ['Delhi residents.', 'Owners of EV vehicles registered in Delhi.'],
    documents: ['Aadhaar Card', 'Vehicle RC', 'Bank Details', 'Pollution Certificate of scrapped vehicle (if applicable)'],
    howToApply: [
      'Purchase an EV from an authorized dealer in Delhi.',
      'The dealer initiates the subsidy application through the RTO.',
      'Upload the RC and purchase invoice on the Delhi EV portal.',
      'The subsidy amount is verified by the Transport Department.',
      'Direct credit of subsidy to the bank account of the vehicle owner.'
    ],
    applicationUrl: 'https://ev.delhi.gov.in/',
    faqs: [{ question: 'Is it for two-wheelers?', answer: 'Yes, incentives apply to 2W, 3W, and 4W electric vehicles.' }]
  },
  {
    id: 'mgnrega',
    title: 'MGNREGA Employment Guarantee',
    description: 'Guarantees at least 100 days of wage employment in a financial year to every rural household whose adult members volunteer to do unskilled manual work.',
    category: 'Employment',
    level: 'Central',
    ministry: 'Ministry of Rural Development',
    updatedAt: '15 Dec 2024',
    objectives: ['Enhance livelihood security in rural areas.'],
    benefits: ['100 days guaranteed work.', 'Unemployment allowance if work not provided.', 'Minimum wage payment.'],
    eligibility: ['Adult members of rural households.', 'Willing to do unskilled manual labor.'],
    documents: ['Job Card', 'Aadhaar'],
    howToApply: [
      'Visit your local Gram Panchayat office.',
      'Register for a Job Card by providing household details and photographs.',
      'Once the Job Card is issued, submit a written or oral request for work.',
      'The Panchayat will allot work within 15 days of the request.',
      'Wages are directly credited to your bank account weekly.'
    ],
    applicationUrl: 'https://nrega.nic.in/',
    faqs: [{ question: 'Who pays wages?', answer: 'Central government funds wages.' }]
  },
  {
    id: 'pm-mudra',
    title: 'PM Mudra Yojana',
    description: 'Loans up to ₹20 Lakh (Tarun Plus) provided to non-corporate, non-farm small/micro enterprises to start or expand businesses.',
    category: 'Business',
    level: 'Central',
    ministry: 'Ministry of Finance',
    updatedAt: '12 Nov 2024',
    objectives: ['Funding the unfunded.', 'Generating employment through micro-units.'],
    benefits: ['Collateral free loans.', 'Three categories: Shishu, Kishore, Tarun.'],
    eligibility: ['Small business owners.', 'Startups.', 'Micro enterprises.'],
    documents: ['Business Plan', 'Aadhaar/PAN', 'KYC'],
    howToApply: [
      'Prepare your business plan for your micro-enterprise.',
      'Contact a commercial bank or micro-finance institution.',
      'Submit the Mudra application form under the appropriate category.',
      'The bank evaluates the proposal and sanctions the loan.',
      'Receive a Mudra RuPay card for cash withdrawal for working capital.'
    ],
    applicationUrl: 'https://www.mudra.org.in/',
    faqs: [{ question: 'Maximum loan?', answer: 'Now up to ₹20 Lakh for successful borrowers.' }]
  },
  {
    id: 'pm-awas-urban',
    title: 'Pradhan Mantri Awas Yojana (PMAY-U)',
    description: 'Provides central assistance to implementing agencies for providing houses to all eligible families/ beneficiaries by 2024-25.',
    category: 'Housing',
    level: 'Central',
    ministry: 'Ministry of Housing and Urban Affairs',
    updatedAt: '10 Jan 2025',
    objectives: ['Housing for all.', 'Slum rehabilitation.'],
    benefits: ['Interest subsidy on home loans.', 'Financial assistance for construction.'],
    eligibility: ['EWS/LIG families.', 'Should not own a pucca house.', 'Household income criteria apply.'],
    documents: ['Income Proof', 'Aadhaar', 'Affidavit of no pucca house'],
    howToApply: [
      'Visit the official PMAY portal.',
      'Apply under the "Citizen Assessment" menu.',
      'Select the relevant component (e.g. Subsidy for loan).',
      'Fill the personal and bank details in the online form.',
      'Print the application and submit to the nearest Common Service Centre or Bank.'
    ],
    applicationUrl: 'https://pmay-urban.gov.in/',
    faqs: [{ question: 'Is it for rural?', answer: 'PMAY-G is for rural, PMAY-U is for urban.' }]
  },
  {
    id: 'sukanya-samriddhi',
    title: 'Sukanya Samriddhi Yojana',
    description: 'A small deposit scheme for the girl child launched as a part of the \'Beti Bachao Beti Padhao\' campaign.',
    category: 'Finance',
    level: 'Central',
    ministry: 'Ministry of Finance',
    updatedAt: '01 Jan 2025',
    objectives: ['Savings for girl child education and marriage.'],
    benefits: ['High interest rate.', 'Income tax benefits (80C).', 'Maturity after 21 years.'],
    eligibility: ['Parent/Guardian of girl child.', 'Age of girl < 10 years.', 'Max 2 accounts per family.'],
    documents: ['Birth Certificate of girl', 'Aadhaar of parent'],
    howToApply: [
      'Visit any post office or authorized commercial bank branch.',
      'Fill out the SSY account opening form.',
      'Provide the birth certificate of the girl child.',
      'Complete the KYC process for the guardian.',
      'Make the initial deposit (minimum ₹250).'
    ],
    applicationUrl: 'https://www.indiapost.gov.in/',
    faqs: [{ question: 'Min deposit?', answer: '₹250 per year.' }]
  }
];
