export type Course = {
  name: string;
  category: "programming" | "ai" | "learningenglish" | "learningfrench" | "softskills";
  link: string;
  language: "english" | "arabic" | "french";
  price: "Free" | "Freemium";
};

export const COURSES: Course[] = [
  { name: "edX", category: "programming", link: "https://www.edx.org", language: "english", price: "Freemium" },
  { name: "Coursera", category: "programming", link: "https://www.coursera.org", language: "english", price: "Freemium" },
  { name: "Khan Academy", category: "programming", link: "https://www.khanacademy.org", language: "english", price: "Freemium" },
  { name: "Harmash", category: "programming", link: "https://harmash.com/", language: "arabic", price: "Freemium" },
  { name: "freeCodeCamp", category: "programming", link: "https://www.freecodecamp.org", language: "english", price: "Freemium" },
  { name: "The Odin Project", category: "programming", link: "https://www.theodinproject.com", language: "english", price: "Freemium" },
  { name: "Scrimba", category: "programming", link: "https://scrimba.com", language: "english", price: "Freemium" },
  { name: "Udacity", category: "programming", link: "https://www.udacity.com", language: "english", price: "Freemium" },
  { name: "W3Schools", category: "programming", link: "https://www.w3schools.com/", language: "english", price: "Free" },
  { name: "Kaggle Learn", category: "ai", link: "https://www.kaggle.com/learn", language: "english", price: "Free" },
  { name: "Fast.ai", category: "ai", link: "https://www.fast.ai", language: "english", price: "Freemium" },
  { name: "Satr", category: "ai", link: "https://satr.codes/", language: "arabic", price: "Free" },
  { name: "Elzero Web School", category: "programming", link: "https://elzero.org/", language: "arabic", price: "Free" },
  { name: "Octocode", category: "programming", link: "https://octocode.io/", language: "arabic", price: "Freemium" },
  { name: "Hsoub Academy", category: "programming", link: "https://academy.hsoub.com/", language: "arabic", price: "Freemium" },
  { name: "ZAmericanEnglish", category: "learningenglish", link: "https://www.zamericanenglish.com/", language: "arabic", price: "Freemium" },
  { name: "Taleek", category: "learningenglish", link: "https://taleek.com/", language: "arabic", price: "Freemium" },
  { name: "Droos Online", category: "learningenglish", link: "https://droosonline.com/", language: "arabic", price: "Freemium" },
  { name: "Duolingo", category: "learningenglish", link: "https://ar.duolingo.com/", language: "arabic", price: "Free" },
  { name: "British Council - LearnEnglish", category: "learningenglish", link: "https://learnenglish.britishcouncil.org/", language: "english", price: "Free" },
  { name: "Introduction to Public Speaking", category: "softskills", link: "https://www.coursera.org/", language: "english", price: "Freemium" },
  { name: "How to Use SMART Goals: Achieve More in Less Time", category: "softskills", link: "https://www.udemy.com/", language: "english", price: "Free" },
  { name: "Diploma in Interpersonal Skills", category: "softskills", link: "https://alison.com/", language: "english", price: "Free" },
  { name: "Personal Branding for Career Success", category: "softskills", link: "https://www.open.edu/openlearn/", language: "english", price: "Freemium" },
  { name: "Critical Thinking at University", category: "softskills", link: "https://www.futurelearn.com/", language: "english", price: "Freemium" },
  { name: "Working in Diverse Teams", category: "softskills", link: "https://www.open.edu/openlearn/", language: "english", price: "Free" },
  { name: "The Science of Well-Being", category: "softskills", link: "https://www.coursera.org/", language: "english", price: "Freemium" },
  { name: "Leading With Effective Communication", category: "softskills", link: "https://www.edx.org/", language: "english", price: "Freemium" },
  { name: "مهارات التواصل الفعال", category: "softskills", link: "https://www.edraak.org/", language: "arabic", price: "Free" },
  { name: "السيرة الذاتية والمقابلة الوظيفية", category: "softskills", link: "https://www.rwaq.org/", language: "arabic", price: "Free" },
  { name: "مهارات تنظيم وإدارة الوقت", category: "softskills", link: "https://satr.codes/", language: "arabic", price: "Free" },
  { name: "مهارات حل المشكلات واتخاذ القرارات", category: "softskills", link: "https://www.rwaq.org/", language: "arabic", price: "Free" },
  { name: "Duolingo French", category: "learningfrench", link: "https://ar.duolingo.com/", language: "arabic", price: "Freemium" },
  { name: "Busuu French", category: "learningfrench", link: "https://www.busuu.com/ar", language: "arabic", price: "Freemium" },
  { name: "RFI Savoirs", category: "learningfrench", link: "https://francaisfacile.rfi.fr/ar/", language: "french", price: "Free" },
  { name: "Taleek French", category: "learningfrench", link: "https://taleek.com/", language: "arabic", price: "Freemium" },
];

function hostOf(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

const uniquePlatforms = new Set(COURSES.map((c) => hostOf(c.link)));
const uniqueCategories = new Set(COURSES.map((c) => c.category));
const uniqueLanguages = new Set(COURSES.map((c) => c.language));
const freeCourses = COURSES.filter((c) => c.price === "Free").length;

export const COURSE_STATS = {
  courses: COURSES.length,
  categories: uniqueCategories.size,
  languages: uniqueLanguages.size,
  platforms: uniquePlatforms.size,
  free: freeCourses,
};

// Curated recognizable platforms whose courses appear in the directory.
export const FEATURED_PLATFORMS: { name: string; url: string }[] = [
  { name: "Coursera", url: "https://www.coursera.org" },
  { name: "edX", url: "https://www.edx.org" },
  { name: "freeCodeCamp", url: "https://www.freecodecamp.org" },
  { name: "Khan Academy", url: "https://www.khanacademy.org" },
  { name: "Udacity", url: "https://www.udacity.com" },
  { name: "Kaggle", url: "https://www.kaggle.com/learn" },
  { name: "British Council", url: "https://learnenglish.britishcouncil.org/" },
  { name: "Duolingo", url: "https://www.duolingo.com" },
  { name: "The Odin Project", url: "https://www.theodinproject.com" },
  { name: "Scrimba", url: "https://scrimba.com" },
];