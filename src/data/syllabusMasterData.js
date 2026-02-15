/**
 * Read-only master syllabus data. Never mutate.
 * User data is built by copying from this; deletions only affect user state.
 */

const COMMON_CHAPTERS = {
  physics: [
    'Physical World', 'Units and Measurements', 'Motion in a Straight Line', 'Motion in a Plane',
    'Laws of Motion', 'Work, Energy and Power', 'System of Particles and Rotational Motion', 'Gravitation',
    'Mechanical Properties of Solids', 'Mechanical Properties of Fluids', 'Thermal Properties of Matter',
    'Thermodynamics', 'Kinetic Theory', 'Oscillations', 'Waves',
  ],
  chemistry: [
    'Some Basic Concepts of Chemistry', 'Structure of Atom', 'Classification of Elements and Periodicity',
    'Chemical Bonding and Molecular Structure', 'States of Matter', 'Thermodynamics', 'Equilibrium', 'Redox Reactions',
    'Hydrogen', 's-Block Elements', 'p-Block Elements', 'Organic Chemistry - Basic Principles', 'Hydrocarbons', 'Environmental Chemistry',
  ],
  maths: [
    'Sets', 'Relations and Functions', 'Trigonometric Functions', 'Principle of Mathematical Induction',
    'Complex Numbers and Quadratic Equations', 'Linear Inequalities', 'Permutations and Combinations', 'Binomial Theorem',
    'Sequences and Series', 'Straight Lines', 'Conic Sections', 'Introduction to Three Dimensional Geometry',
    'Limits and Derivatives', 'Mathematical Reasoning', 'Statistics', 'Probability',
  ],
};

const ENGLISH_PLUS_ONE = [
  { chapterName: 'Reading Comprehension', type: 'Skill' },
  { chapterName: 'Writing Skills', type: 'Skill' },
  { chapterName: 'Grammar and Usage', type: 'Skill' },
  { chapterName: 'I Will Fly', type: 'Prose' },
  { chapterName: 'If', type: 'Poem' },
  { chapterName: 'The Sacred Turtles of Kadavu', type: 'Prose' },
  { chapterName: 'The Price of Flowers', type: 'Prose' },
  { chapterName: 'Death the Leveller', type: 'Poem' },
  { chapterName: 'Literature - Drama', type: 'Drama' },
];

const ENGLISH_PLUS_TWO = [
  { chapterName: 'Reading Comprehension', type: 'Skill' },
  { chapterName: 'Writing Skills', type: 'Skill' },
  { chapterName: 'Grammar', type: 'Skill' },
  { chapterName: 'Flamingo - Prose', type: 'Prose' },
  { chapterName: 'Flamingo - Poetry', type: 'Poem' },
  { chapterName: 'Vistas - Supplementary', type: 'Prose' },
];

const MALAYALAM_LESSONS = [
  { chapterName: 'പദസമുച്ചയം', type: 'Grammar' },
  { chapterName: 'വാക്യം', type: 'Grammar' },
  { chapterName: 'നിരൂപണം', type: 'Prose' },
  { chapterName: 'ഗദ്യം - സാഹിത്യം', type: 'Prose' },
  { chapterName: 'പദ്യം - സാഹിത്യം', type: 'Poem' },
];

const MALAYALAM_PLUS_TWO = [
  { chapterName: 'ആധുനിക സാഹിത്യം', type: 'Prose' },
  { chapterName: 'നിരൂപണം', type: 'Prose' },
  { chapterName: 'കവിത', type: 'Poem' },
  { chapterName: 'നോവൽ', type: 'Prose' },
  { chapterName: 'നാടകം', type: 'Drama' },
];

const ARABIC_LESSONS = [
  { chapterName: 'النحو والصرف', type: 'Grammar' },
  { chapterName: 'القراءة والفهم', type: 'Skill' },
  { chapterName: 'التعبير الكتابي', type: 'Skill' },
  { chapterName: 'الأدب - النثر', type: 'Prose' },
  { chapterName: 'الأدب - الشعر', type: 'Poem' },
];

function toChapterEntries(chapters) {
  if (!chapters || chapters.length === 0) return [];
  return chapters.map((ch) =>
    typeof ch === 'string' ? { chapterName: ch, type: 'Chapter' } : { chapterName: ch.chapterName, type: ch.type || 'Chapter' }
  );
}

const PLUS_ONE_STREAMS = {
  computerScience: {
    name: 'Computer Science',
    subjects: [
      { key: 'physics', name: 'Physics', chapters: COMMON_CHAPTERS.physics },
      { key: 'chemistry', name: 'Chemistry', chapters: COMMON_CHAPTERS.chemistry },
      { key: 'maths', name: 'Maths', chapters: COMMON_CHAPTERS.maths },
      { key: 'computerScience', name: 'Computer Science', chapters: ['Introduction to Computers', 'Programming in C++', 'Data Structures', 'Database Management', 'Computer Networks', 'Web Technology'] },
      { key: 'english', name: 'English', chapters: ENGLISH_PLUS_ONE },
      { key: 'malayalam', name: 'Malayalam', chapters: MALAYALAM_LESSONS },
    ],
  },
  bioScience: {
    name: 'Bio Science',
    subjects: [
      { key: 'physics', name: 'Physics', chapters: COMMON_CHAPTERS.physics },
      { key: 'chemistry', name: 'Chemistry', chapters: COMMON_CHAPTERS.chemistry },
      { key: 'maths', name: 'Maths', chapters: COMMON_CHAPTERS.maths },
      { key: 'biology', name: 'Biology', chapters: ['The Living World', 'Biological Classification', 'Plant Kingdom', 'Animal Kingdom', 'Morphology of Flowering Plants', 'Anatomy of Flowering Plants', 'Structural Organisation in Animals', 'Cell - The Unit of Life', 'Biomolecules', 'Cell Cycle and Cell Division', 'Transport in Plants', 'Mineral Nutrition', 'Photosynthesis', 'Respiration in Plants', 'Plant Growth and Development', 'Digestion and Absorption', 'Breathing and Exchange of Gases', 'Body Fluids and Circulation', 'Excretory Products and their Elimination', 'Locomotion and Movement', 'Neural Control and Coordination', 'Chemical Coordination and Integration'] },
      { key: 'english', name: 'English', chapters: ENGLISH_PLUS_ONE },
      { key: 'malayalam', name: 'Malayalam', chapters: MALAYALAM_LESSONS },
    ],
  },
  commerce: {
    name: 'Commerce',
    subjects: [
      { key: 'accountancy', name: 'Accountancy', chapters: ['Introduction to Accounting', 'Theory Base of Accounting', 'Recording of Transactions', 'Bank Reconciliation Statement', 'Trial Balance and Rectification of Errors', 'Depreciation, Provisions and Reserves', 'Financial Statements', 'Accounts from Incomplete Records', 'Applications of Computers in Accounting'] },
      { key: 'businessStudies', name: 'Business Studies', chapters: ['Nature and Purpose of Business', 'Forms of Business Organisation', 'Private, Public and Global Enterprises', 'Business Services', 'Emerging Modes of Business', 'Social Responsibilities of Business', 'Sources of Business Finance', 'Small Business', 'Internal Trade', 'International Business'] },
      { key: 'economics', name: 'Economics', chapters: ['Introduction to Microeconomics', 'Consumer Equilibrium and Demand', 'Producer Behaviour and Supply', 'Forms of Market and Price Determination', 'Introduction to Macroeconomics', 'National Income and Related Aggregates', 'Money and Banking', 'Determination of Income and Employment', 'Government Budget and the Economy', 'Balance of Payments'] },
      { key: 'english', name: 'English', chapters: ENGLISH_PLUS_ONE },
      { key: 'malayalam', name: 'Malayalam', chapters: MALAYALAM_LESSONS },
    ],
  },
  humanities: {
    name: 'Humanities',
    subjects: [
      { key: 'history', name: 'History', chapters: ['From the Beginning of Time', 'Writing and City Life', 'An Empire Across Three Continents', 'The Central Islamic Lands', 'Nomadic Empires', 'The Three Orders', 'Changing Cultural Traditions', 'Confrontation of Cultures', 'The Industrial Revolution', 'Displacing Indigenous Peoples', 'Paths to Modernisation'] },
      { key: 'politicalScience', name: 'Political Science', chapters: ['Political Theory', 'Freedom', 'Equality', 'Social Justice', 'Rights', 'Citizenship', 'Nationalism', 'Secularism', 'Peace', 'Development'] },
      { key: 'economics', name: 'Economics', chapters: ['Introduction to Microeconomics', 'Consumer Equilibrium and Demand', 'Producer Behaviour and Supply', 'Forms of Market and Price Determination', 'Introduction to Macroeconomics', 'National Income and Related Aggregates', 'Money and Banking', 'Determination of Income and Employment', 'Government Budget and the Economy', 'Balance of Payments'] },
      { key: 'english', name: 'English', chapters: ENGLISH_PLUS_ONE },
      { key: 'malayalam', name: 'Malayalam', chapters: MALAYALAM_LESSONS },
    ],
  },
};

const PLUS_TWO_STREAMS = {
  computerScience: {
    name: 'Computer Science',
    subjects: [
      { key: 'physics', name: 'Physics', chapters: ['Electric Charges and Fields', 'Electrostatic Potential and Capacitance', 'Current Electricity', 'Moving Charges and Magnetism', 'Magnetism and Matter', 'Electromagnetic Induction', 'Alternating Current', 'Electromagnetic Waves', 'Ray Optics and Optical Instruments', 'Wave Optics', 'Dual Nature of Radiation and Matter', 'Atoms', 'Nuclei', 'Semiconductor Electronics'] },
      { key: 'chemistry', name: 'Chemistry', chapters: ['The Solid State', 'Solutions', 'Electrochemistry', 'Chemical Kinetics', 'Surface Chemistry', 'General Principles and Processes of Isolation of Elements', 'The p-Block Elements', 'The d and f Block Elements', 'Coordination Compounds', 'Haloalkanes and Haloarenes', 'Alcohols, Phenols and Ethers', 'Aldehydes, Ketones and Carboxylic Acids', 'Amines', 'Biomolecules', 'Polymers', 'Chemistry in Everyday Life'] },
      { key: 'maths', name: 'Maths', chapters: ['Relations and Functions', 'Inverse Trigonometric Functions', 'Matrices', 'Determinants', 'Continuity and Differentiability', 'Application of Derivatives', 'Integrals', 'Application of Integrals', 'Differential Equations', 'Vector Algebra', 'Three Dimensional Geometry', 'Linear Programming', 'Probability'] },
      { key: 'computerScience', name: 'Computer Science', chapters: ['C++ Revision Tour', 'Object Oriented Programming', 'Data Structures - Stack and Queue', 'Data File Handling', 'Database Concepts and SQL', 'Boolean Algebra', 'Communication and Network Concepts'] },
      { key: 'english', name: 'English', chapters: ENGLISH_PLUS_TWO },
      { key: 'malayalam', name: 'Malayalam', chapters: MALAYALAM_PLUS_TWO },
    ],
  },
  bioScience: {
    name: 'Bio Science',
    subjects: [
      { key: 'physics', name: 'Physics', chapters: ['Electric Charges and Fields', 'Electrostatic Potential and Capacitance', 'Current Electricity', 'Moving Charges and Magnetism', 'Magnetism and Matter', 'Electromagnetic Induction', 'Alternating Current', 'Electromagnetic Waves', 'Ray Optics and Optical Instruments', 'Wave Optics', 'Dual Nature of Radiation and Matter', 'Atoms', 'Nuclei'] },
      { key: 'chemistry', name: 'Chemistry', chapters: ['The Solid State', 'Solutions', 'Electrochemistry', 'Chemical Kinetics', 'Surface Chemistry', 'General Principles and Processes of Isolation of Elements', 'The p-Block Elements', 'The d and f Block Elements', 'Coordination Compounds', 'Haloalkanes and Haloarenes', 'Alcohols, Phenols and Ethers', 'Aldehydes, Ketones and Carboxylic Acids', 'Amines', 'Biomolecules', 'Polymers', 'Chemistry in Everyday Life'] },
      { key: 'biology', name: 'Biology', chapters: ['Reproduction in Organisms', 'Sexual Reproduction in Flowering Plants', 'Human Reproduction', 'Reproductive Health', 'Principles of Inheritance and Variation', 'Molecular Basis of Inheritance', 'Evolution', 'Human Health and Disease', 'Strategies for Enhancement in Food Production', 'Microbes in Human Welfare', 'Biotechnology - Principles and Processes', 'Biotechnology and its Applications', 'Organisms and Populations', 'Ecosystem', 'Biodiversity and Conservation', 'Environmental Issues'] },
      { key: 'english', name: 'English', chapters: ENGLISH_PLUS_TWO },
      { key: 'malayalam', name: 'Malayalam', chapters: MALAYALAM_PLUS_TWO },
    ],
  },
  commerce: {
    name: 'Commerce',
    subjects: [
      { key: 'accountancy', name: 'Accountancy', chapters: ['Accounting for Partnership Firms', 'Reconstitution of Partnership', 'Accounting for Share Capital', 'Issue and Redemption of Debentures', 'Financial Statements of a Company', 'Analysis of Financial Statements', 'Accounting Ratios', 'Cash Flow Statement'] },
      { key: 'businessStudies', name: 'Business Studies', chapters: ['Nature and Significance of Management', 'Principles of Management', 'Business Environment', 'Planning', 'Organising', 'Staffing', 'Directing', 'Controlling', 'Financial Management', 'Financial Markets', 'Marketing', 'Consumer Protection'] },
      { key: 'economics', name: 'Economics', chapters: ['Introduction to Macroeconomics', 'National Income Accounting', 'Money and Banking', 'Income Determination', 'The Government: Budget and the Economy', 'Open Economy Macroeconomics'] },
      { key: 'english', name: 'English', chapters: ENGLISH_PLUS_TWO },
      { key: 'malayalam', name: 'Malayalam', chapters: MALAYALAM_PLUS_TWO },
    ],
  },
  humanities: {
    name: 'Humanities',
    subjects: [
      { key: 'history', name: 'History', chapters: ['Bricks, Beads and Bones', 'Kings, Farmers and Towns', 'Kinship, Caste and Class', 'Thinkers, Beliefs and Buildings', 'Through the Eyes of Travellers', 'Bhakti-Sufi Traditions', 'An Imperial Capital: Vijayanagara', 'Peasants, Zamindars and the State', 'Kings and Chronicles', 'Colonialism and the Countryside', 'Rebels and the Raj', 'Colonial Cities', 'Mahatma Gandhi and the Nationalist Movement', 'Understanding Partition', 'Framing the Constitution'] },
      { key: 'politicalScience', name: 'Political Science', chapters: ['The Cold War Era', 'The End of Bipolarity', 'US Hegemony in World Politics', 'Alternative Centres of Power', 'Contemporary South Asia', 'International Organisations', 'Security in the Contemporary World', 'Environment and Natural Resources', 'Globalisation'] },
      { key: 'economics', name: 'Economics', chapters: ['Introduction to Macroeconomics', 'National Income Accounting', 'Money and Banking', 'Income Determination', 'The Government: Budget and the Economy', 'Open Economy Macroeconomics'] },
      { key: 'english', name: 'English', chapters: ENGLISH_PLUS_TWO },
      { key: 'malayalam', name: 'Malayalam', chapters: MALAYALAM_PLUS_TWO },
    ],
  },
};

export const SYLLABUS_MASTER = Object.freeze({
  plusOne: Object.freeze(PLUS_ONE_STREAMS),
  plusTwo: Object.freeze(PLUS_TWO_STREAMS),
});

const LANGUAGE_CHAPTERS = {
  malayalam: MALAYALAM_LESSONS,
  arabic: ARABIC_LESSONS,
};

export function getMasterSyllabusForProfile(classKey, streamKey, language) {
  const syllabus = SYLLABUS_MASTER[classKey];
  if (!syllabus) return [];
  const stream = syllabus[streamKey];
  if (!stream) return [];
  const langChapters = LANGUAGE_CHAPTERS[language] || MALAYALAM_LESSONS;
  const langSubjectName = language === 'arabic' ? 'Arabic' : 'Malayalam';
  return stream.subjects.map((sub) => {
    if (sub.key === 'malayalam') {
      return { name: langSubjectName, chapters: toChapterEntries(langChapters) };
    }
    return { name: sub.name, chapters: toChapterEntries(sub.chapters) };
  });
}
