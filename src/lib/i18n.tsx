import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Lang = "en" | "ar";

type Dict = Record<string, string>;

const en: Dict = {
  "nav.home": "Home",
  "nav.directory": "Directory",
  "nav.about": "About",
  "nav.admin": "Admin",
  "nav.explore": "Explore",
  "nav.menu": "Menu",
  "lang.toggle": "العربية",

  "home.badge": "Made in Algeria · for Algerian students",
  "home.title.a": "Build the portfolio that gets you into ",
  "home.title.b": "world-class universities",
  "home.title.c": ".",
  "home.subtitle": "LevelUp DZ gathers the courses, competitions and volunteering opportunities that turn smart Algerian students into international candidates.",
  "home.cta.browse": "Browse opportunities",
  "home.cta.mission": "Our mission",
  "home.stat.global": "Global & local programs",
  "home.stat.curated": "Curated for DZ students",
  "home.stat.built": "Built for top universities",
  "home.cat.courses.title": "Summer Courses",
  "home.cat.courses.desc": "Programming, English, AI, soft skills — taught by the best.",
  "home.cat.comp.title": "Competitions & Olympiads",
  "home.cat.comp.desc": "Hackathons, math & informatics olympiads, global contests.",
  "home.cat.vol.title": "Volunteering & Charities",
  "home.cat.vol.desc": "Make social impact at home and around the world.",
  "home.explore": "Explore",

  "about.kicker": "Our mission",
  "about.title.a": "Algerian talent deserves a ",
  "about.title.b": "world stage",
  "about.title.c": ".",
  "about.p1": "Every year, brilliant Algerian students are held back not by ability, but by access. They don't know the summer school exists. They miss the olympiad deadline. They never hear about the volunteering program that would have made their CV unforgettable.",
  "about.p2": "LevelUp DZ fixes that. We gather, vet and translate the opportunities — courses, competitions and volunteering — that build the kind of portfolio top universities actually want. Free. Open. Made by students, for students.",
  "about.pillar1.title": "Open the doors",
  "about.pillar1.desc": "Curated programs that admissions officers in Cambridge, MIT and Paris recognize.",
  "about.pillar2.title": "Show the way",
  "about.pillar2.desc": "Filter by category and format so you find what fits your level and your city.",
  "about.pillar3.title": "Lift the community",
  "about.pillar3.desc": "Volunteering work that builds character and improves life in Algeria.",
  "about.ready.title": "Ready to level up?",
  "about.ready.desc": "Open the directory and pick the first opportunity you'll apply to this month.",
  "about.ready.cta": "Browse opportunities",

  "dir.title": "Opportunities Directory",
  "dir.subtitle": "A curated collection updated for Algerian students. Filter by category and format, then apply directly from the card.",
  "dir.search": "Search by title, organizer, tag…",
  "dir.filters": "Filters",
  "dir.category": "Category",
  "dir.format": "Format",
  "dir.cat.all": "All",
  "dir.cat.courses": "📚 Courses",
  "dir.cat.competitions": "🏆 Competitions",
  "dir.cat.volunteering": "🤝 Volunteering",
  "dir.fmt.all": "Any format",
  "dir.fmt.online": "Online",
  "dir.fmt.in_person": "In-person",
  "dir.fmt.hybrid": "Hybrid",
  "dir.missing": "Found a missing opportunity? Email us — we'll add it to the directory.",
  "dir.none.title": "No opportunities match these filters.",
  "dir.none.desc": "Try a different category or clear your search.",
  "dir.count.one": "opportunity",
  "dir.count.many": "opportunities",

  "card.cat.courses": "📚 Course",
  "card.cat.competitions": "🏆 Competition",
  "card.cat.volunteering": "🤝 Volunteering",
  "card.by": "by",
  "card.apply": "Apply Now",

  "fb.q": "Did you find this useful?",
  "fb.hint": "Tell us in one line what we should add next.",
  "fb.yes": "Yes",
  "fb.no": "Not yet",
  "fb.placeholder": "Optional: a quick suggestion…",
  "fb.thanks.title": "You're the best ✨",
  "fb.thanks.desc": "Your feedback helps us improve.",
  "fb.toast.err": "Couldn't send feedback. Try again.",
  "fb.toast.ok": "Thanks for the feedback!",
  "footer.tagline": "A directory of courses, competitions and volunteering built for Algerian students who dream of joining the world's best universities.",
  "footer.copyright": "Built with care for طلاب الجزائر.",
};

const ar: Dict = {
  "nav.home": "الرئيسية",
  "nav.directory": "الفرص",
  "nav.about": "من نحن",
  "nav.admin": "الإدارة",
  "nav.explore": "استكشف",
  "nav.menu": "القائمة",
  "lang.toggle": "English",

  "home.badge": "صُنع في الجزائر · للطلاب الجزائريين",
  "home.title.a": "ابنِ ملفًا يقودك إلى ",
  "home.title.b": "أرقى الجامعات العالمية",
  "home.title.c": ".",
  "home.subtitle": "يجمع LevelUp DZ الدورات والمسابقات وفرص التطوع التي تحوّل الطلاب الجزائريين الموهوبين إلى مرشحين دوليين.",
  "home.cta.browse": "تصفح الفرص",
  "home.cta.mission": "رسالتنا",
  "home.stat.global": "برامج عالمية ومحلية",
  "home.stat.curated": "مختارة للطلاب الجزائريين",
  "home.stat.built": "مصمَّمة لأفضل الجامعات",
  "home.cat.courses.title": "الدورات الصيفية",
  "home.cat.courses.desc": "البرمجة، الإنجليزية، الذكاء الاصطناعي والمهارات الناعمة من أفضل المدرّبين.",
  "home.cat.comp.title": "المسابقات والأولمبيادات",
  "home.cat.comp.desc": "هاكاثونات، أولمبيادات رياضيات ومعلوماتية ومنافسات عالمية.",
  "home.cat.vol.title": "التطوع والأعمال الخيرية",
  "home.cat.vol.desc": "أحدث أثرًا اجتماعيًا في بلدك وفي العالم.",
  "home.explore": "استكشف",

  "about.kicker": "رسالتنا",
  "about.title.a": "الموهبة الجزائرية تستحق ",
  "about.title.b": "منصة عالمية",
  "about.title.c": ".",
  "about.p1": "في كل عام، يُحرم طلاب جزائريون موهوبون من الفرص، لا بسبب قدراتهم، بل بسبب عدم وصول المعلومة. لا يعلمون بوجود المدرسة الصيفية، أو يفوّتون موعد الأولمبياد، أو لا يسمعون عن برنامج التطوع الذي كان سيغيّر سيرتهم الذاتية.",
  "about.p2": "LevelUp DZ يصلح ذلك. نجمع وننتقي ونترجم الفرص — دورات ومسابقات وتطوع — التي تبني الملف الذي تبحث عنه الجامعات الكبرى فعلًا. مجاني. مفتوح. صُنع بأيدي الطلاب للطلاب.",
  "about.pillar1.title": "افتح الأبواب",
  "about.pillar1.desc": "برامج مختارة يعترف بها المسؤولون عن القبول في كامبريدج وMIT وباريس.",
  "about.pillar2.title": "ارسم الطريق",
  "about.pillar2.desc": "فلترة حسب الفئة والصيغة لتجد ما يناسب مستواك ومدينتك.",
  "about.pillar3.title": "ارفع المجتمع",
  "about.pillar3.desc": "أعمال تطوعية تبني الشخصية وتحسّن الحياة في الجزائر.",
  "about.ready.title": "هل أنت مستعد للارتقاء؟",
  "about.ready.desc": "افتح الدليل واختر أول فرصة ستتقدم لها هذا الشهر.",
  "about.ready.cta": "تصفح الفرص",

  "dir.title": "دليل الفرص",
  "dir.subtitle": "مجموعة مختارة محدّثة للطلاب الجزائريين. فلتر حسب الفئة والصيغة ثم تقدّم مباشرة من البطاقة.",
  "dir.search": "ابحث بالعنوان أو المنظّم أو الوسم…",
  "dir.filters": "الفلاتر",
  "dir.category": "الفئة",
  "dir.format": "الصيغة",
  "dir.cat.all": "الكل",
  "dir.cat.courses": "📚 دورات",
  "dir.cat.competitions": "🏆 مسابقات",
  "dir.cat.volunteering": "🤝 تطوع",
  "dir.fmt.all": "أي صيغة",
  "dir.fmt.online": "عن بُعد",
  "dir.fmt.in_person": "حضوري",
  "dir.fmt.hybrid": "مختلط",
  "dir.missing": "هل تعرف فرصة مفقودة؟ راسلنا وسنضيفها إلى الدليل.",
  "dir.none.title": "لا توجد فرص تطابق هذه الفلاتر.",
  "dir.none.desc": "جرّب فئة مختلفة أو امسح البحث.",
  "dir.count.one": "فرصة",
  "dir.count.many": "فرصة",

  "card.cat.courses": "📚 دورة",
  "card.cat.competitions": "🏆 مسابقة",
  "card.cat.volunteering": "🤝 تطوع",
  "card.by": "بواسطة",
  "card.apply": "قدّم الآن",

  "fb.q": "هل وجدت هذا مفيدًا؟",
  "fb.hint": "أخبرنا بسطر واحد ماذا تريد أن نضيف لاحقًا.",
  "fb.yes": "نعم",
  "fb.no": "ليس بعد",
  "fb.placeholder": "اختياري: اقتراح سريع…",
  "fb.thanks.title": "أنت الأفضل ✨",
  "fb.thanks.desc": "ملاحظاتك تساعدنا على التحسّن.",
  "fb.toast.err": "تعذّر إرسال الملاحظات. حاول مجددًا.",
  "fb.toast.ok": "شكرًا على ملاحظاتك!",
  "footer.tagline": "دليل للدورات والمسابقات والتطوع، مصمَّم للطلاب الجزائريين الذين يحلمون بالالتحاق بأفضل جامعات العالم.",
  "footer.copyright": "صُنع بحبٍ لطلاب الجزائر.",
};

const dicts: Record<Lang, Dict> = { en, ar };

type Ctx = {
  lang: Lang;
  dir: "ltr" | "rtl";
  t: (key: string) => string;
  setLang: (l: Lang) => void;
  toggle: () => void;
};

const I18nContext = createContext<Ctx | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    if (typeof window === "undefined") return "en";
    return (window.localStorage.getItem("lang") as Lang) || "en";
  });

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    try {
      window.localStorage.setItem("lang", lang);
    } catch {}
  }, [lang]);

  const setLang = (l: Lang) => setLangState(l);
  const toggle = () => setLangState((l) => (l === "en" ? "ar" : "en"));
  const t = (key: string) => dicts[lang][key] ?? dicts.en[key] ?? key;

  return (
    <I18nContext.Provider
      value={{ lang, dir: lang === "ar" ? "rtl" : "ltr", t, setLang, toggle }}
    >
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}