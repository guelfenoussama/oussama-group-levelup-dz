import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Lang = "en" | "ar";

type Dict = Record<string, string>;

const en: Dict = {
  "nav.home": "Home",
  "nav.directory": "Courses",
  "nav.about": "About",
  "nav.admin": "Admin",
  "nav.explore": "Explore",
  "nav.menu": "Menu",
  "lang.toggle": "العربية",

  "home.badge": "Made in Algeria · for Algerian students",
  "home.title.a": "Real skills for a ",
  "home.title.b": "competitive future",
  "home.title.c": ".",
  "home.subtitle": "School grades alone aren't enough to compete globally. LevelUp DZ helps Algerian students discover courses in programming, languages and modern skills — so they build a strong foundation and stand out internationally.",
  "home.cta.browse": "Browse courses",
  "home.cta.mission": "Our mission",
  "home.stat.global": "Global & local courses",
  "home.stat.curated": "Curated for DZ students",
  "home.stat.built": "Test for real-world skills",

  "home.cat.coding.title": "Programming & Tech",
  "home.cat.coding.desc": "Web development, software, data — the skills shaping today's economy.",
  "home.cat.lang.title": "Languages",
  "home.cat.lang.desc": "English, French and more — open the doors to study and work abroad.",
  "home.cat.ai.title": "AI & Modern Skills",
  "home.cat.ai.desc": "Artificial intelligence, soft skills and the tools every modern student needs.",
  "home.explore": "Explore",

  "about.kicker": "Our mission",
  "about.title.a": "Beyond grades — ",
  "about.title.b": "real skills for real life",
  "about.title.c": ".",
  "about.p1": "The traditional school system in Algeria does a lot, but it can't do everything. Many talented students finish their studies without ever touching the practical skills — programming, languages, modern tools — that the world now expects.",
  "about.p2": "LevelUp DZ helps fill that gap. We gather quality courses that build a strong foundation and a competitive skill portfolio, so Algerian students grow into useful, confident citizens who can stand out internationally.",
  "about.pillar1.title": "Build real skills",
  "about.pillar1.desc": "Practical courses in coding, languages and modern tools — not just theory.",
  "about.pillar2.title": "Find your path",
  "about.pillar2.desc": "Filter by topic and format so you find what fits your level and your city.",
  "about.pillar3.title": "Grow with confidence",
  "about.pillar3.desc": "Become a useful citizen at home and a strong candidate anywhere in the world.",
  "about.ready.title": "Ready to level up?",
  "about.ready.desc": "Open the directory and pick the first course you'll start this month.",
  "about.ready.cta": "Browse courses",

  "dir.title": "Courses Directory",
  "dir.subtitle": "A curated collection of courses for Algerian students. Filter by topic and format, then start learning directly from the card.",
  "dir.search": "Search by title, organizer, tag…",
  "dir.filters": "Filters",
  "dir.topic": "Topic",
  "dir.format": "Format",
  "dir.topic.all": "All topics",
  "dir.topic.coding": "💻 Programming & Tech",
  "dir.topic.languages": "🗣️ Languages",
  "dir.topic.ai": "🤖 AI",
  "dir.topic.soft": "✨ Soft Skills",
  "dir.fmt.all": "Any format",
  "dir.fmt.online": "Online",
  "dir.fmt.in_person": "In-person",
  "dir.fmt.hybrid": "Hybrid",
  "dir.missing": "Found a missing course? Email us — we'll add it to the directory.",
  "dir.none.title": "No courses match these filters.",
  "dir.none.desc": "Try a different topic or clear your search.",
  "dir.count.one": "course",
  "dir.count.many": "courses",

  "card.cat.courses": "📚 Course",
  "card.by": "by",
  "card.apply": "Go to course",

  "fb.q": "Did you find this useful?",
  "fb.hint": "Tell us in one line what we should add next.",
  "fb.yes": "Yes",
  "fb.no": "Not yet",
  "fb.placeholder": "Optional: a quick suggestion…",
  "fb.thanks.title": "You're the best ✨",
  "fb.thanks.desc": "Your feedback helps us improve.",
  "fb.toast.err": "Couldn't send feedback. Try again.",
  "fb.toast.ok": "Thanks for the feedback!",
  "footer.tagline": "A directory of real-world courses built for Algerian students who want to grow strong skills and stand out internationally.",
  "footer.copyright": "Built with care for طلاب الجزائر.",

  "streak.label": "Daily streak",
  "streak.day": "Day Streak",
  "streak.days": "Days Streak",
  "streak.coach": "Your daily coach",
  "streak.started": "Started",
  "streak.completed": "Completed",
  "streak.name.set": "Add your name",
  "streak.name.change": "Change name",
  "streak.name.placeholder": "Your first name",
  "streak.msg.start": "Welcome{name} — pick one course today and plant the first spark.",
  "streak.msg.great": "You're doing great today{name} — one small step keeps the streak alive!",
  "streak.msg.keep": "Keep the flame burning{name} — consistency beats intensity.",
  "streak.msg.fire": "You're on fire{name}! Future-you is already proud.",
  "card.progress": "Progress",
};

const ar: Dict = {
  "nav.home": "الرئيسية",
  "nav.directory": "الدورات",
  "nav.about": "من نحن",
  "nav.admin": "الإدارة",
  "nav.explore": "استكشف",
  "nav.menu": "القائمة",
  "lang.toggle": "English",

  "home.badge": "صُنع في الجزائر · للطلاب الجزائريين",
  "home.title.a": "مهارات حقيقية لمستقبل ",
  "home.title.b": "تنافسي",
  "home.title.c": ".",
  "home.subtitle": "علامات المدرسة وحدها لا تكفي للمنافسة عالميًا. يساعد LevelUp DZ الطلاب الجزائريين على اكتشاف دورات في البرمجة واللغات والمهارات الحديثة — ليبنوا أساسًا قويًا ويتميزوا دوليًا.",
  "home.cta.browse": "تصفح الدورات",
  "home.cta.mission": "رسالتنا",
  "home.stat.global": "دورات عالمية ومحلية",
  "home.stat.curated": "مختارة للطلاب الجزائريين",
  "home.stat.built": "مبنية لمهارات الحياة الحقيقية",

  "home.cat.coding.title": "البرمجة والتقنية",
  "home.cat.coding.desc": "تطوير الويب والبرمجيات والبيانات — مهارات تصنع اقتصاد اليوم.",
  "home.cat.lang.title": "اللغات",
  "home.cat.lang.desc": "الإنجليزية والفرنسية وغيرها — أبواب للدراسة والعمل في الخارج.",
  "home.cat.ai.title": "الذكاء الاصطناعي والمهارات الحديثة",
  "home.cat.ai.desc": "الذكاء الاصطناعي والمهارات الناعمة والأدوات التي يحتاجها كل طالب اليوم.",
  "home.explore": "استكشف",

  "about.kicker": "رسالتنا",
  "about.title.a": "أبعد من العلامات — ",
  "about.title.b": "مهارات حقيقية للحياة",
  "about.title.c": ".",
  "about.p1": "النظام المدرسي التقليدي في الجزائر يقدّم الكثير، لكنه لا يستطيع تقديم كل شيء. كثير من الطلاب الموهوبين يُنهون دراستهم دون أن يلمسوا المهارات العملية — البرمجة، اللغات، الأدوات الحديثة — التي يطلبها العالم اليوم.",
  "about.p2": "يساعد LevelUp DZ على سدّ هذه الفجوة. نجمع دورات نوعية تبني أساسًا قويًا وملفًا تنافسيًا من المهارات، ليتطور الطالب الجزائري إلى مواطن نافع وواثق قادر على التميّز دوليًا.",
  "about.pillar1.title": "ابنِ مهارات حقيقية",
  "about.pillar1.desc": "دورات عملية في البرمجة واللغات والأدوات الحديثة — لا مجرد نظريات.",
  "about.pillar2.title": "اعثر على طريقك",
  "about.pillar2.desc": "فلترة حسب الموضوع والصيغة لتجد ما يناسب مستواك ومدينتك.",
  "about.pillar3.title": "انمُ بثقة",
  "about.pillar3.desc": "كن مواطنًا نافعًا في بلدك ومرشحًا قويًا في أي مكان من العالم.",
  "about.ready.title": "هل أنت مستعد للارتقاء؟",
  "about.ready.desc": "افتح الدليل واختر أول دورة ستبدأها هذا الشهر.",
  "about.ready.cta": "تصفح الدورات",

  "dir.title": "دليل الدورات",
  "dir.subtitle": "مجموعة مختارة من الدورات للطلاب الجزائريين. فلتر حسب الموضوع والصيغة ثم ابدأ التعلم مباشرة من البطاقة.",
  "dir.search": "ابحث بالعنوان أو المنظّم أو الوسم…",
  "dir.filters": "الفلاتر",
  "dir.topic": "الموضوع",
  "dir.format": "الصيغة",
  "dir.topic.all": "كل المواضيع",
  "dir.topic.coding": "💻 البرمجة والتقنية",
  "dir.topic.languages": "🗣️ اللغات",
  "dir.topic.ai": "🤖 الذكاء الاصطناعي",
  "dir.topic.soft": "✨ المهارات الناعمة",
  "dir.fmt.all": "أي صيغة",
  "dir.fmt.online": "عن بُعد",
  "dir.fmt.in_person": "حضوري",
  "dir.fmt.hybrid": "مختلط",
  "dir.missing": "هل تعرف دورة مفقودة؟ راسلنا وسنضيفها إلى الدليل.",
  "dir.none.title": "لا توجد دورات تطابق هذه الفلاتر.",
  "dir.none.desc": "جرّب موضوعًا مختلفًا أو امسح البحث.",
  "dir.count.one": "دورة",
  "dir.count.many": "دورة",

  "card.cat.courses": "📚 دورة",
  "card.by": "بواسطة",
  "card.apply": "ابدأ الدورة",

  "fb.q": "هل وجدت هذا مفيدًا؟",
  "fb.hint": "أخبرنا بسطر واحد ماذا تريد أن نضيف لاحقًا.",
  "fb.yes": "نعم",
  "fb.no": "ليس بعد",
  "fb.placeholder": "اختياري: اقتراح سريع…",
  "fb.thanks.title": "أنت الأفضل ✨",
  "fb.thanks.desc": "ملاحظاتك تساعدنا على التحسّن.",
  "fb.toast.err": "تعذّر إرسال الملاحظات. حاول مجددًا.",
  "fb.toast.ok": "شكرًا على ملاحظاتك!",
  "footer.tagline": "دليل لدورات حقيقية مصمَّم للطلاب الجزائريين الذين يريدون بناء مهارات قوية والتميّز دوليًا.",
  "footer.copyright": "صُنع بحبٍ لطلاب الجزائر.",

  "streak.label": "السلسلة اليومية",
  "streak.day": "يوم متواصل",
  "streak.days": "أيام متواصلة",
  "streak.coach": "مدرّبك اليومي",
  "streak.started": "بدأت",
  "streak.completed": "أكملت",
  "streak.name.set": "أضف اسمك",
  "streak.name.change": "غيّر الاسم",
  "streak.name.placeholder": "اسمك الأول",
  "streak.msg.start": "مرحبًا{name} — اختر دورة واحدة اليوم وأشعل الشرارة الأولى.",
  "streak.msg.great": "أبليت حسنًا اليوم{name} — خطوة صغيرة تُبقي السلسلة حيّة!",
  "streak.msg.keep": "أبقِ اللهب مشتعلًا{name} — الاستمرار خير من الاندفاع.",
  "streak.msg.fire": "أنت في قمة العطاء{name}! المستقبل يفتخر بك سلفًا.",
  "card.progress": "تقدّمك",
};

const dicts: Record<Lang, Dict> = { en, ar };

type Ctx = {
  lang: Lang;
  dir: "ltr" | "rtl";
  t: (key: string) => string;
  setLang: (l: Lang) => void;
  toggle: () => void;
};

const I18nCtx = createContext<Ctx | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    const stored = (typeof window !== "undefined" && (localStorage.getItem("lang") as Lang | null)) || null;
    if (stored === "en" || stored === "ar") setLangState(stored);
  }, []);

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = lang;
      document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    }
    if (typeof window !== "undefined") localStorage.setItem("lang", lang);
  }, [lang]);

  const setLang = (l: Lang) => setLangState(l);
  const toggle = () => setLangState((l) => (l === "en" ? "ar" : "en"));
  const t = (key: string) => dicts[lang][key] ?? dicts.en[key] ?? key;

  return (
    <I18nCtx.Provider value={{ lang, dir: lang === "ar" ? "rtl" : "ltr", t, setLang, toggle }}>
      {children}
    </I18nCtx.Provider>
  );
}

export function useI18n() {
  const ctx = useContext(I18nCtx);
  if (!ctx) throw new Error("useI18n must be used inside I18nProvider");
  return ctx;
}
