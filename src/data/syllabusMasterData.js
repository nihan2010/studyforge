/**
 * Read-only master syllabus data. Never mutate.
 * User data is built by copying from this; deletions only affect user state.
 */

const COMMON_CHAPTERS = {
  physics: [
    { chapterName: 'Units and Measurements', type: 'Chapter' },
    { chapterName: 'Motion in a Straight Line', type: 'Chapter' },
    { chapterName: 'Motion in a Plane', type: 'Chapter' },
    { chapterName: 'Laws of Motion', type: 'Chapter' },
    { chapterName: 'Work, Energy and Power', type: 'Chapter' },
    { chapterName: 'System of Particles and Rotational Motion', type: 'Chapter' },
    { chapterName: 'Gravitation', type: 'Chapter' },
    { chapterName: 'Mechanical Properties of Solids', type: 'Chapter' },
    { chapterName: 'Mechanical Properties of Fluids', type: 'Chapter' },
    { chapterName: 'Thermal Properties of Matter', type: 'Chapter' },
    { chapterName: 'Thermodynamics', type: 'Chapter' },
    { chapterName: 'Kinetic Theory', type: 'Chapter' },
    { chapterName: 'Oscillations', type: 'Chapter' },
    { chapterName: 'Waves', type: 'Chapter' },
  ],
  chemistry: [
    { chapterName: 'Some Basic Concepts of Chemistry', type: 'Chapter' },
    { chapterName: 'Structure of Atom', type: 'Chapter' },
    { chapterName: 'Classification of Elements and Periodicity', type: 'Chapter' },
    { chapterName: 'Chemical Bonding and Molecular Structure', type: 'Chapter' },
    { chapterName: 'Thermodynamics', type: 'Chapter' },
    { chapterName: 'Equilibrium', type: 'Chapter' },
    { chapterName: 'Redox Reactions', type: 'Chapter' },
    { chapterName: 'Organic Chemistry - Basic Principles', type: 'Chapter' },
    { chapterName: 'Hydrocarbons', type: 'Chapter' },
  ],
  maths: [
    { chapterName: 'Sets', type: 'Chapter' },
    { chapterName: 'Relations and Functions', type: 'Chapter' },
    { chapterName: 'Trigonometric Functions', type: 'Chapter' },
    { chapterName: 'Complex Numbers and Quadratic Equations', type: 'Chapter' },
    { chapterName: 'Linear Inequalities', type: 'Chapter' },
    { chapterName: 'Permutations and Combinations', type: 'Chapter' },
    { chapterName: 'Binomial Theorem', type: 'Chapter' },
    { chapterName: 'Sequences and Series', type: 'Chapter' },
    { chapterName: 'Straight Lines', type: 'Chapter' },
    { chapterName: 'Conic Sections', type: 'Chapter' },
    { chapterName: 'Introduction to Three Dimensional Geometry', type: 'Chapter' },
    { chapterName: 'Limits and Derivatives', type: 'Chapter' },
    { chapterName: 'Statistics', type: 'Chapter' },
    { chapterName: 'Probability', type: 'Chapter' },
  ],
};

const CS_PLUS_ONE = [
  { chapterName: 'The Discipline Of Computing', type: 'Chapter' },
  { chapterName: 'Data Representation and Boolean Algebra', type: 'Chapter' },
  { chapterName: 'Components of the Computer System', type: 'Chapter' },
  { chapterName: 'Principles of Programming and Problem Solving', type: 'Chapter' },
  { chapterName: 'Introduction to C++ Programming..', type: 'Chapter' },
  { chapterName: 'Data Types and Operators', type: 'Chapter' },
  { chapterName: 'Control Statements', type: 'Chapter' },
  { chapterName: 'Arrays', type: 'Chapter' },
  { chapterName: 'String Handling and I/O Functions', type: 'Chapter' },
  { chapterName: 'Functions', type: 'Chapter' },
  { chapterName: 'Computer Networks ', type: 'Chapter' },
  { chapterName: 'Internet and Mobile Computing ', type: 'Chapter' },
];

const ENGLISH_PLUS_ONE = [
  { chapterName: 'His First Flight', type: 'Skill' },
  { chapterName: ' I will Fly ', type: 'Skill' },
  { chapterName: 'Quest for a Theory of Everything', type: 'Skill' },
  { chapterName: 'If (Poem)', type: 'Prose' },
  { chapterName: 'And then Gandhi Came', type: 'Poem' },
  { chapterName: 'The Price of Flowers ', type: 'Prose' },
  { chapterName: 'Death the Leveller (Poem)', type: 'Prose' },
  { chapterName: 'Sunrise on the Hills (Poem) ', type: 'Poem' },
  { chapterName: ' The Trip of Le Horla ', type: 'Drama' },
  { chapterName: 'The Sacred Turtles of Kadavu ', type: 'Chapter' },
  { chapterName: 'Disasters and Disaster Management in India', type: 'Chapter' },
  { chapterName: 'The Serang of Ranaganji', type: 'Chapter' },
  { chapterName: 'The Wreck of the Titanic (Poem) ', type: 'Chapter' },
  { chapterName: 'Gooseberries', type: 'Chapter' },
  { chapterName: 'To Sleep (Poem)', type: 'Chapter' },
  { chapterName: 'Going out for a Walk', type: 'Chapter' },
  { chapterName: 'The Cyberspace', type: 'Chapter' },
  { chapterName: 'Is Society Dead?', type: 'Chapter' },
  { chapterName: 'Conceptual Fruit', type: 'Chapter' },
  { chapterName: 'Discourses', type: 'Chapter' },
  { chapterName: 'Grammar', type: 'Chapter' },
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
  { chapterName: 'സന്ദർശനം', type: 'Grammar' },
  { chapterName: 'ഓർമ്മയുടെ ഞരമ്പ്', type: 'Grammar' },
  { chapterName: 'വേരുകൾ നഷ്ടപ്പെടുത്തുന്നവർ', type: 'Prose' },
  { chapterName: 'മത്സ്യം', type: 'Prose' },
  { chapterName: 'കായലരികത്ത്', type: 'Poem' },
  { chapterName: 'സിനിമയും സമൂഹവും ', type: 'Chapter' },
  { chapterName: 'കളവുപോയ സൈക്കിളും കഴിഞ്ഞുപോയ കാലഘട്ടവും ', type: 'Chapter' },
  { chapterName: 'കൈപ്പാട് ', type: 'Chapter' },
  { chapterName: 'കേൾക്കുന്നുണ്ടോ?', type: 'Chapter' },
  { chapterName: 'കാവ്യകലയെക്കുറിച്ച് ചില നിരീക്ഷണങ്ങൾ', type: 'Chapter' },
  { chapterName: 'ഊഞ്ഞാലിൽ', type: 'Chapter' },
  { chapterName: 'അനർഘനിമിഷം', type: 'Chapter' },
  { chapterName: 'ലാത്തിയും വെടിയുണ്ടയും ', type: 'Chapter' },
  { chapterName: 'പീലിക്കണ്ണുകൾ ', type: 'Chapter' },
  { chapterName: 'അനുകമ്പ ', type: 'Chapter' },
  { chapterName: 'മുഹ്യിദ്ദീൻമാല', type: 'Chapter' },
  { chapterName: 'വാസനവികൃതി ', type: 'Chapter' },
  { chapterName: 'സംക്രമണം ', type: 'Chapter' },
  { chapterName: 'ശസ്ത്രക്രിയ ', type: 'Chapter' },
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
      { key: 'computerScience', name: 'Computer Science', chapters: CS_PLUS_ONE },
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
