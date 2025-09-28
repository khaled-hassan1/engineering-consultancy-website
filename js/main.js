(function ($) {
  "use strict";

  /* ========= Spinner ========= */
  function spinner() {
    setTimeout(function () {
      if ($("#spinner").length > 0) {
        $("#spinner").removeClass("show");
      }
    }, 1);
  }
  spinner();

  /* ========= WOW ========= */
  new WOW().init();

  /* ========= Sticky Navbar ========= */
  $(window).on("scroll", function () {
    if ($(this).scrollTop() > 300) {
      $(".sticky-top").addClass("bg-white shadow-sm").css("top", "0px");
    } else {
      $(".sticky-top").removeClass("bg-white shadow-sm").css("top", "-150px");
    }
  });

  /* ========= Back to top ========= */
  $(window).on("scroll", function () {
    if ($(this).scrollTop() > 100) $(".back-to-top").fadeIn("slow");
    else $(".back-to-top").fadeOut("slow");
  });
  $(".back-to-top").on("click", function () {
    $("html, body").animate({ scrollTop: 0 }, 1500, "easeInOutExpo");
    return false;
  });

  /* ========= Globals ========= */
  var currentLanguage = sessionStorage.getItem("language") || "ar";
  var languageButton = null;

  /* ========= Bootstrap LTR/RTL toggle ========= */
  function applyBootstrapDirection(isRTL) {
    var ltr = document.getElementById("bootstrapLTR");
    var rtl = document.getElementById("bootstrapRTL");
    if (ltr && rtl) {
      ltr.disabled = !!isRTL;
      rtl.disabled = !isRTL;
    }
  }

  /* ========= Update all texts (original + Owl clones) ========= */
  function updateTexts() {
    var dicts = window.elementsToTranslate;
    if (!dicts || typeof dicts !== "object") return;

    for (var id in dicts) {
      var entry = dicts[id];
      if (!entry || typeof entry !== "object") continue;
      var val = entry[currentLanguage];
      if (typeof val !== "string") continue;

      // حدث كل العناصر اللي لها نفس الـ id (بما فيها نسخ Owl)
      var nodes = document.querySelectorAll('[id="' + id + '"]');
      nodes.forEach(function (node) {
        node.textContent = val;
      });
    }

    // Title & meta (اختياري)
    if (dicts.pageTitle && typeof dicts.pageTitle[currentLanguage] === "string") {
      document.title = dicts.pageTitle[currentLanguage];
    }
    if (
      dicts.pageDescription &&
      typeof dicts.pageDescription[currentLanguage] === "string"
    ) {
      var metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) metaDesc.setAttribute("content", dicts.pageDescription[currentLanguage]);
    }

    // زر اللغة
    if (
      languageButton &&
      dicts.languageButton &&
      typeof dicts.languageButton[currentLanguage] === "string"
    ) {
      languageButton.textContent = dicts.languageButton[currentLanguage];
    }
  }

  /* ========= Owl helpers ========= */
  function destroyCarousels() {
    $(".header-carousel, .testimonial-carousel").each(function () {
      var $el = $(this);
      if ($el.hasClass("owl-loaded")) {
        $el.trigger("destroy.owl.carousel");
        $el.removeClass("owl-loaded owl-hidden");
        // فك تغليف الـ stage اللي Owl عمله
        $el.find(".owl-stage-outer").children().unwrap();
      }
    });
  }

  function initCarousels(isRTL) {
    $(".header-carousel").owlCarousel({
      autoplay: true,
      smartSpeed: 1000,
      loop: true,
      dots: true,
      items: 1,
      rtl: !!isRTL,
      onInitialized: updateTexts,
      onRefreshed: updateTexts,
      onTranslated: updateTexts,
    });

    $(".testimonial-carousel").owlCarousel({
      items: 1,
      autoplay: true,
      smartSpeed: 1000,
      animateIn: "fadeIn",
      animateOut: "fadeOut",
      dots: true,
      loop: true,
      nav: false,
      rtl: !!isRTL,
      onInitialized: updateTexts,
      onRefreshed: updateTexts,
      onTranslated: updateTexts,
    });

    // تطبيق فوري بعد أول init
    updateTexts();
  }

  /* ========= بعض التعديلات حسب الاتجاه (اختياري) ========= */
  function flipAlignForFooter(isRTL) {
    var el = document.querySelector(".footer-about");
    if (!el) return;
    if (isRTL) {
      el.classList.remove("text-md-start");
      el.classList.add("text-md-end");
    } else {
      el.classList.remove("text-md-end");
      el.classList.add("text-md-start");
    }
  }

  /* ========= Language switch ========= */
  function setLanguage(lang) {
    currentLanguage = lang;
    sessionStorage.setItem("language", currentLanguage);

    var isRTL = currentLanguage === "ar";
    document.documentElement.lang = isRTL ? "ar" : "en";
    document.documentElement.dir = isRTL ? "rtl" : "ltr";

    applyBootstrapDirection(isRTL);
    updateTexts();
    updateFormTexts();

    flipAlignForFooter(isRTL);

    // Re-init Owl مع الاتجاه الجديد + ترجمة نسخ العناصر
    destroyCarousels();
    initCarousels(isRTL);

    // إشعار عام لو حبيت تربط حاجات تانية
    window.dispatchEvent(
      new CustomEvent("i18n:lang-changed", { detail: { lang: currentLanguage, rtl: isRTL } })
    );
  }

  /* ========= DOM Ready ========= */
  $(function () {
    languageButton = document.getElementById("languageButton");

    if (languageButton) {
      languageButton.addEventListener("click", function () {
        setLanguage(currentLanguage === "en" ? "ar" : "en");
      });
    }

    // تهيئة أولية
    setLanguage(currentLanguage);

    // سنة الفوتر
    var yearEl = document.getElementById("currentYear");
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // لو عرّفت قاموسك بعدين وعايز تدي إشارة:
    window.addEventListener("i18n:dict-ready", function () {
      updateTexts();
      updateFormTexts();
    });
  });

  // أمان إضافي بعد التحميل الكامل
  window.addEventListener("load", updateTexts);
  window.addEventListener("load", updateFormTexts);

})(jQuery);

function updateFormTexts() {
  var dicts = window.elementsToTranslate || {};
  // فضّل html lang، وإلا من sessionStorage
  var lang = (document.documentElement.lang || sessionStorage.getItem("language") || "ar");
  lang = lang.startsWith("ar") ? "ar" : "en";

  var form =
    document.getElementById("contactForm") ||
    document.querySelector(".col-lg-7 form") ||
    document.querySelector("form");
  if (!form) return;

  var fields = [
    { id: "name", labelKey: "formName", phKey: "formNamePH" },
    { id: "email", labelKey: "formEmail", phKey: "formEmailPH" },
    { id: "subject", labelKey: "formSubject", phKey: "formSubjectPH" },
    { id: "message", labelKey: "formMessage", phKey: "formMessagePH" },
  ];

  fields.forEach(function (f) {
    var control = form.querySelector("#" + f.id);
    var label = form.querySelector('label[for="' + f.id + '"]');
    if (!control && !label) return;

    var labelTxt = dicts[f.labelKey] && dicts[f.labelKey][lang];
    var phTxt = dicts[f.phKey] && dicts[f.phKey][lang];
    var finalPH = (typeof phTxt === "string") ? phTxt :
      (typeof labelTxt === "string" ? labelTxt : "");

    if (control) {
      control.setAttribute("placeholder", finalPH); // مهم مع form-floating
      control.setAttribute("aria-label", finalPH);  // وصولية أفضل
    }
    if (label && typeof labelTxt === "string") {
      label.textContent = labelTxt;
    }
  });

  // زر الإرسال
  var btn = form.querySelector("#formButton") || form.querySelector('button[type="submit"]');
  if (btn && dicts.formButton && typeof dicts.formButton[lang] === "string") {
    btn.textContent = dicts.formButton[lang];
  }
}


window.elementsToTranslate = {
  // Meta Tags
  pageTitle: {
    en: "PMEC - Engineering, Environmental, Security and Safety Consulting",
    ar: "PMEC - استشارات هندسية وبيئية وأمن وسلامة"
  },
  pageDescription: {
    en: "PMEC provides expert engineering, environmental, security, and safety consulting services in Riyadh, Saudi Arabia. We offer innovative and sustainable solutions tailored to your business needs.",
    ar: "تقدم PMEC خدمات استشارية هندسية وبيئية وأمن وسلامة متخصصة في الرياض، المملكة العربية السعودية. نقدم حلولاً مبتكرة ومستدامة مصممة خصيصًا لتلبية احتياجات عملك."
  },

  // Spinner
  loadingSpinner: { en: "Loading...", ar: "جاري التحميل..." },

  // Navigation
  homeNav: { en: "Home", ar: "الرئيسية" },
  aboutNav: { en: "About", ar: "عن الشركة" },
  servicesNav: { en: "Services", ar: "الخدمات" },
  contactNav: { en: "Contact", ar: "اتصل بنا" },
  languageButton: { en: "العربية", ar: "English" },

  // Hero Section
  heroHomeTitlePart1: {
    en: "We Are The Best",
    ar: "نحن أفضل"
  },
  heroHomeTitlePart2: {
    en: "Engineering, Environmental, Security, and Safety Consulting Company",
    ar: "شركة استشارات هندسية وبيئية وأمن وسلامة"
  },
  heroHomeTitlePart3: {
    en: " In The World",
    ar: " في العالم"
  },
  heroHomeSubtitle: {
    en: "Providing comprehensive consulting solutions for a sustainable and secure future.",
    ar: "تقديم حلول استشارية شاملة لمستقبل مستدام وآمن."
  },
  heroDescription: {
    en: "Providing comprehensive engineering, environmental, security, and safety consulting services to help organizations achieve their goals while maintaining the highest standards of quality and compliance.",
    ar: "نقدم خدمات استشارية شاملة في مجالات الهندسة والبيئة والأمن والسلامة لمساعدة المؤسسات على تحقيق أهدافها مع الحفاظ على أعلى معايير الجودة والامتثال."
  },
  getQuoteBtn: { en: "Get Free Quote", ar: "احصل على عرض سعر مجاني" },

  // Hero Icons
  structuralEngineering: { en: "Structural Engineering", ar: "الهندسة الإنشائية" },
  environmentalSolutions: { en: "Environmental Solutions", ar: "الحلول البيئية" },
  expertConsultants: { en: "Expert Consultants", ar: "خبراء استشاريون" },
  costEffectiveSolutions: { en: "Cost-Effective Solutions", ar: "حلول فعالة من حيث التكلفة" },

  // About Section
  aboutHeading: { en: "About", ar: "من نحن" },
  aboutParagraph1: {
    en: "We are a leading firm providing a full spectrum of engineering, environmental, and security and safety consulting services. Our team of experts is dedicated to delivering innovative and sustainable solutions that help businesses thrive while protecting the environment.",
    ar: "نحن شركة رائدة تقدم مجموعة متكاملة من الخدمات الاستشارية في مجالات الهندسة والبيئة والأمن والسلامة. فريقنا من الخبراء ملتزم بتقديم حلول مبتكرة ومستدامة تساعد الشركات على الازدهار مع حماية البيئة."
  },
  aboutParagraph2: {
    en: "Our commitment is to help organizations achieve their goals by mitigating risks, improving efficiency, and ensuring compliance with the highest national and international standards. We believe in building a secure and sustainable future for our clients and our community.",
    ar: "التزامنا هو مساعدة المؤسسات على تحقيق أهدافها من خلال تخفيف المخاطر وتحسين الكفاءة وضمان الامتثال لأعلى المعايير الوطنية والدولية. نحن نؤمن ببناء مستقبل آمن ومستدام لعملائنا ومجتمعنا."
  },
  engineeringSolutions1: { en: "Engineering Solutions", ar: "حلول هندسية" },
  environmentalConsulting1: { en: "Environmental Consulting", ar: "استشارات بيئية" },
  securitySafetyManagement: { en: "Security & Safety Management", ar: "إدارة الأمن والسلامة" },
  sustainablePractices: { en: "Sustainable Practices", ar: "ممارسات مستدامة" },
  readMoreBtn: { en: "Read More", ar: "اقرأ المزيد" },

  // Why Choose Us Section
  whyChooseUsHeading: { en: "Why Choose Us", ar: "لماذا تختارنا" },
  securitySafetyTitle: { en: "Security and Safety", ar: "الأمن والسلامة" },
  securitySafetyText: {
    en: "Protecting your assets and personnel with advanced risk management and safety protocols.",
    ar: "حماية أصولك وموظفيك من خلال إدارة المخاطر المتقدمة وبروتوكولات السلامة."
  },
  integratedSolutionsTitle: { en: "Integrated Solutions", ar: "حلول متكاملة" },
  integratedSolutionsText: {
    en: "We offer a holistic approach, combining engineering, environmental, security, and safety to provide comprehensive and effective solutions.",
    ar: "نقدم نهجًا شموليًا، يجمع بين الهندسة والبيئة والأمن والسلامة لتوفير حلول شاملة وفعالة."
  },
  environmentalConsulting2: { en: "Environmental Consulting", ar: "استشارات بيئية" },
  environmentalConsultingText: {
    en: "Implementing sustainable practices to ensure environmental compliance and a greener future.",
    ar: "تطبيق ممارسات مستدامة لضمان الامتثال البيئي ومستقبل أكثر خضرة."
  },
  engineeringSolutions2: { en: "Engineering Solutions", ar: "حلول هندسية" },
  engineeringSolutionsText: {
    en: "Delivering innovative engineering services for complex projects and challenges.",
    ar: "تقديم خدمات هندسية مبتكرة للمشاريع والتحديات المعقدة."
  },
  clientSatisfactionTitle: { en: "Client Satisfaction", ar: "رضا العميل" },
  clientSatisfactionText: {
    en: "Our priority is to understand and meet the unique needs of each client, building long-term partnerships based on trust and results.",
    ar: "أولويتنا هي فهم وتلبية الاحتياجات الفريدة لكل عميل، وبناء شراكات طويلة الأمد قائمة على الثقة والنتائج."
  },
  strategicCostEffectiveTitle: { en: "Strategic & Cost-Effective", ar: "استراتيجية وفعالة التكلفة" },
  strategicCostEffectiveText: {
    en: "We provide smart, efficient strategies that maximize value and minimize costs without compromising on quality or safety.",
    ar: "نقدم استراتيجيات ذكية وفعالة تزيد من القيمة وتقلل من التكاليف دون المساومة على الجودة أو السلامة."
  },
  sustainableSafeSolutionsTitle: { en: "Sustainable & Safe Solutions", ar: "حلول مستدامة وآمنة" },
  sustainableSafeSolutionsText: {
    en: "We are dedicated to creating solutions that not only solve current challenges but also promote a sustainable and secure future.",
    ar: "نحن ملتزمون بابتكار حلول لا تحل التحديات الحالية فحسب، بل تعزز أيضًا مستقبلًا مستدامًا وآمنًا."
  },

  // Services Section
  ourProfessional: { en: "Our Professional ", ar: "خدماتنا " },
  ourProfessionalServices: { en: "Services ", ar: "الاحترافية " },
  servicesParagraph1: {
    en: "We are a leading consulting firm specializing in engineering, environmental, security, and safety solutions. Our diverse team provides expert guidance to help you navigate complex challenges and achieve your business objectives.",
    ar: "نحن شركة استشارية رائدة متخصصة في الحلول الهندسية والبيئية والأمن والسلامة. يقدم فريقنا المتنوع إرشادات الخبراء لمساعدتك على تجاوز التحديات المعقدة وتحقيق أهداف عملك."
  },
  servicesParagraph2: {
    en: "We are dedicated to providing the highest level of service, leveraging our extensive experience and innovative approach to deliver tailored solutions that meet your specific needs.",
    ar: "نحن ملتزمون بتقديم أعلى مستوى من الخدمة، مستفيدين من خبرتنا الواسعة ونهجنا المبتكر لتقديم حلول مصممة خصيصًا لتلبية احتياجاتك الخاصة."
  },
  callUsText: { en: "Call us direct 24/7 for a free consultation", ar: "اتصل بنا مباشرة 24/7 للحصول على استشارة مجانية" },
  engineeringSolutions3: { en: "Engineering Solutions", ar: "حلول هندسية" },
  engineeringSolutionsText2: {
    en: "Expert structural, civil, and mechanical engineering for robust and reliable project outcomes.",
    ar: "خبرة في الهندسة الإنشائية، المدنية، والميكانيكية لتحقيق نتائج مشاريع قوية وموثوقة."
  },
  environmentalConsulting3: { en: "Environmental Consulting", ar: "استشارات بيئية" },
  environmentalConsultingText2: {
    en: "Providing sustainable solutions for resource management, compliance, and impact assessments.",
    ar: "تقديم حلول مستدامة لإدارة الموارد، الامتثال، وتقييم الأثر البيئي."
  },
  safetyManagement: { en: "Safety Management", ar: "إدارة السلامة" },
  safetyManagementText: {
    en: "Comprehensive risk analysis, safety planning, and training to create a secure work environment.",
    ar: "تحليل شامل للمخاطر، وتخطيط للسلامة، وتدريب لخلق بيئة عمل آمنة."
  },
  securitySystems: { en: "Security Systems", ar: "أنظمة الأمن" },
  securitySystemsText: {
    en: "Designing and implementing advanced security infrastructure to protect assets and personnel.",
    ar: "تصميم وتطبيق بنية تحتية أمنية متقدمة لحماية الأصول والموظفين."
  },

  // Partners Section
  partnersHeading: { en: "Our partners", ar: "شركاؤنا" },
  partner1Title: { en: "The National Center for Environmental Compliance (NCEC)", ar: "المركز الوطني للالتزام البيئي (NCEC)" },
  partner1Text: {
    en: "The National Center for Environmental Compliance (NCEC) is a financially and administratively independent entity established in Saudi Arabia in 2020. Its mission is to ensure that development projects and activities adhere to the kingdom's environmental regulations and standards. The NCEC sets environmental controls and monitors their implementation to achieve a balance between economic development and environmental protection.",
    ar: "المركز الوطني للالتزام البيئي (NCEC) هو كيان مستقل ماليًا وإداريًا تأسس في المملكة العربية السعودية في عام 2020. وتتمثل مهمته في ضمان التزام المشاريع والأنشطة التنموية باللوائح والمعايير البيئية للمملكة. يحدد المركز الضوابط البيئية ويراقب تنفيذها لتحقيق التوازن بين التنمية الاقتصادية وحماية البيئة."
  },
  partner2Title: { en: "The Saudi Ministry of Environment, Water and Agriculture (MEWA)", ar: "وزارة البيئة والمياه والزراعة السعودية (MEWA)" },
  partner2Text: {
    en: "The Saudi Ministry of Environment, Water and Agriculture (MEWA) is the government body responsible for formulating and implementing comprehensive policies related to the environment, water, and agriculture sectors in the Kingdom. Its main mission is to achieve water and food security and to ensure environmental sustainability. The Ministry oversees various sectors including water, agriculture, animal resources, and fisheries, and it works to develop these sectors in a way that serves the national economy while preserving natural resources.",
    ar: "وزارة البيئة والمياه والزراعة السعودية (MEWA) هي الجهة الحكومية المسؤولة عن صياغة وتنفيذ السياسات الشاملة المتعلقة بقطاعات البيئة والمياه والزراعة في المملكة. تتمثل مهمتها الرئيسية في تحقيق الأمن المائي والغذائي وضمان الاستدامة البيئية. تشرف الوزارة على قطاعات مختلفة بما في ذلك المياه والزراعة والموارد الحيوانية ومصايد الأسماك، وتعمل على تطوير هذه القطاعات بما يخدم الاقتصاد الوطني مع الحفاظ على الموارد الطبيعية."
  },
  partner3Title: { en: "The Saudi Investment Recycling Company (SIRC)", ar: "الشركة السعودية لإعادة التدوير (SIRC)" },
  partner3Text: {
    en: "The Saudi Investment Recycling Company (SIRC), a wholly-owned subsidiary of the Public Investment Fund, was established in 2017. The company's main goal is to develop and operate the recycling sector in the Kingdom, supporting the objectives of a sustainable circular economy. SIRC handles various types of waste, including solid, hazardous, and construction waste, transforming it into reusable materials or energy sources. This contributes to achieving the goals of Saudi Vision 2030.",
    ar: "الشركة السعودية لإعادة التدوير (SIRC)، وهي شركة تابعة بالكامل لصندوق الاستثمارات العامة، تأسست في عام 2017. يتمثل هدف الشركة الرئيسي في تطوير وتشغيل قطاع إعادة التدوير في المملكة، ودعم أهداف الاقتصاد الدائري المستدام. تتعامل SIRC مع أنواع مختلفة من النفايات، بما في ذلك النفايات الصلبة والخطرة ونفايات البناء، وتحولها إلى مواد قابلة لإعادة الاستخدام أو مصادر طاقة. يساهم هذا في تحقيق أهداف رؤية السعودية 2030."
  },

  // Footer
  footerAboutText: {
    en: "PMEC is a leading consulting firm providing engineering, environmental, security, and safety solutions to clients worldwide. We are dedicated to excellence and innovation in all our projects.",
    ar: "PMEC هي شركة استشارية رائدة تقدم حلولاً في مجالات الهندسة والبيئة والأمن والسلامة للعملاء في جميع أنحاء العالم. نحن ملتزمون بالتميز والابتكار في جميع مشاريعنا."
  },
  getInTouchTitle: { en: "Get In Touch", ar: "تواصل معنا" },
  addressText: {
    en: "Najd Road, Dhahrat Laban District, Riyadh, Saudi Arabia, RDLB 3846",
    ar: "طريق نجد، حي ظهرة لبن، الرياض، المملكة العربية السعودية، RDLB 3846"
  },
  phoneText: { en: "+966 55 1795 955", ar: "+966 55 1795 955" },
  phoneText2: { en: "+966 50 7299 951", ar: "+966 50 7299 951" },
  emailText: { en: "enviormentalconsultant@gmail.com", ar: "enviormentalconsultant@gmail.com" },
  popularLinkTitle: { en: "Popular Link", ar: "روابط شائعة" },
  ourServicesTitle: { en: "Our Services", ar: "خدماتنا" },
  engineeringSolutions4: { en: "Engineering Solutions", ar: "حلول هندسية" },
  environmentalConsulting4: { en: "Environmental Consulting", ar: "استشارات بيئية" },
  safetyManagement2: { en: "Safety Management", ar: "إدارة السلامة" },
  securitySystems2: { en: "Security Systems", ar: "أنظمة الأمن" },
  allRightReserved: { en: "All Right Reserved.", ar: "جميع الحقوق محفوظة." },
  /// About
  // Meta Tags
  pageTitle: {
    en: "About PMEC - Engineering, Environmental, Security and Safety Consulting",
    ar: "حول PMEC - استشارات هندسية وبيئية وأمن وسلامة"
  },
  pageDescription: {
    en: "PMEC provides expert engineering, environmental, security, and safety consulting services in Riyadh, Saudi Arabia. We offer innovative and sustainable solutions tailored to your business needs.",
    ar: "تقدم PMEC خدمات استشارية هندسية وبيئية وأمن وسلامة متخصصة في الرياض، المملكة العربية السعودية. نقدم حلولاً مبتكرة ومستدامة مصممة خصيصًا لتلبية احتياجات عملك."
  },
  // Navbar
  homeNav: {
    en: "Home",
    ar: "الرئيسية"
  },
  aboutNav: {
    en: "About",
    ar: "حول"
  },
  servicesNav: {
    en: "Services",
    ar: "الخدمات"
  },
  contactNav: {
    en: "Contact",
    ar: "تواصل"
  },
  // Hero Section
  heroTitle: {
    en: "About",
    ar: "من نحن"
  },
  heroSubTitle: {
    en: "We are a leading consulting firm dedicated to providing innovative and sustainable solutions for our clients.",
    ar: "نحن شركة استشارات رائدة ملتزمة بتقديم حلول مبتكرة ومستدامة لعملائنا."
  },
  // About Section
  aboutHeading: {
    en: "About",
    ar: "من نحن"
  },
  aboutText1: {
    en: "We are a leading firm providing a full spectrum of engineering, environmental, and security and safety consulting services. Our team of experts is dedicated to delivering innovative and sustainable solutions that help businesses thrive while protecting the environment.",
    ar: "نحن شركة رائدة تقدم مجموعة متكاملة من الخدمات الاستشارية في الهندسة والبيئة والأمن والسلامة. يكرس فريق الخبراء لدينا جهوده لتقديم حلول مبتكرة ومستدامة تساعد الشركات على الازدهار مع حماية البيئة."
  },
  aboutText2: {
    en: "Our commitment is to help organizations achieve their goals by mitigating risks, improving efficiency, and ensuring compliance with the highest national and international standards. We believe in building a secure and sustainable future for our clients and our community.",
    ar: "التزامنا هو مساعدة المؤسسات على تحقيق أهدافها من خلال تخفيف المخاطر، وتحسين الكفاءة، وضمان الامتثال لأعلى المعايير الوطنية والدولية. نحن نؤمن ببناء مستقبل آمن ومستدام لعملائنا ومجتمعنا."
  },
  engineeringSolutionsAbout: {
    en: "Engineering Solutions",
    ar: "حلول هندسية"
  },
  environmentalConsultingAbout: {
    en: "Environmental Consulting",
    ar: "استشارات بيئية"
  },
  securitySafetyAbout: {
    en: "Security & Safety Management",
    ar: "إدارة الأمن والسلامة"
  },
  sustainablePracticesAbout: {
    en: "Sustainable Practices",
    ar: "ممارسات مستدامة"
  },
  readMoreBtn: {
    en: "Read More",
    ar: "اقرأ المزيد"
  },
  // Why Choose Us Section
  whyChooseUsTitle: {
    en: "Why",
    ar: "لماذا"
  },
  whyChooseUsTitleSpan: {
    en: "Choose Us",
    ar: "تختارنا"
  },
  securityAndSafetyTitle: {
    en: "Security and Safety",
    ar: "الأمن والسلامة"
  },
  securityAndSafetyText: {
    en: "Protecting your assets and personnel with advanced risk management and safety protocols.",
    ar: "حماية أصولك وموظفيك من خلال إدارة متقدمة للمخاطر وبروتوكولات السلامة."
  },
  integratedSolutionsTitle: {
    en: "Integrated Solutions",
    ar: "حلول متكاملة"
  },
  integratedSolutionsText: {
    en: "We offer a holistic approach, combining engineering, environmental, security, and safety to provide comprehensive and effective solutions.",
    ar: "نحن نقدم نهجًا شاملاً يجمع بين الهندسة والبيئة والأمن والسلامة لتوفير حلول شاملة وفعالة."
  },
  environmentalConsultingWhy: {
    en: "Environmental Consulting",
    ar: "استشارات بيئية"
  },
  environmentalConsultingText: {
    en: "Implementing sustainable practices to ensure environmental compliance and a greener future.",
    ar: "تطبيق ممارسات مستدامة لضمان الامتثال البيئي ومستقبل أكثر خضرة."
  },
  engineeringSolutionsWhy: {
    en: "Engineering Solutions",
    ar: "حلول هندسية"
  },
  engineeringSolutionsText: {
    en: "Delivering innovative engineering services for complex projects and challenges.",
    ar: "تقديم خدمات هندسية مبتكرة للمشاريع والتحديات المعقدة."
  },
  clientSatisfactionTitle: {
    en: "Client Satisfaction",
    ar: "رضا العميل"
  },
  clientSatisfactionText: {
    en: "Our priority is to understand and meet the unique needs of each client, building long-term partnerships based on trust and results.",
    ar: "أولويتنا هي فهم وتلبية الاحتياجات الفريدة لكل عميل، وبناء شراكات طويلة الأمد قائمة على الثقة والنتائج."
  },
  strategicCostEffectiveTitle: {
    en: "Strategic & Cost-Effective",
    ar: "استراتيجية وفعالة من حيث التكلفة"
  },
  strategicCostEffectiveText: {
    en: "We provide smart, efficient strategies that maximize value and minimize costs without compromising on quality or safety.",
    ar: "نحن نقدم استراتيجيات ذكية وفعالة تزيد القيمة وتقلل التكاليف دون المساومة على الجودة أو السلامة."
  },
  sustainableSafeSolutionsTitle: {
    en: "Sustainable & Safe Solutions",
    ar: "حلول مستدامة وآمنة"
  },
  sustainableSafeSolutionsText: {
    en: "We are dedicated to creating solutions that not only solve current challenges but also promote a sustainable and secure future.",
    ar: "نحن ملتزمون بإنشاء حلول لا تقتصر على حل التحديات الحالية فحسب، بل تعزز أيضًا مستقبلًا مستدامًا وآمنًا."
  },
  // Partners Section
  ourPartnersTitle: {
    en: "Our",
    ar: ""
  },
  ourPartnersSpan: {
    en: "partners",
    ar: "شركاؤنا"
  },

  // Footer
  footerAbout: {
    en: "PMEC is a leading consulting firm providing engineering, environmental, security, and safety solutions to clients worldwide. We are dedicated to excellence and innovation in all our projects.",
    ar: "بي إم إي سي هي شركة استشارية رائدة تقدم حلولاً في الهندسة والبيئة والأمن والسلامة للعملاء في جميع أنحاء العالم. نحن ملتزمون بالتميز والابتكار في جميع مشاريعنا."
  },
  getInTouch: {
    en: "Get In Touch",
    ar: "تواصل معنا"
  },
  address: {
    en: "Najd Road, Dhahrat Laban District, Riyadh, Saudi Arabia, RDLB 3846",
    ar: "طريق نجد، حي ظهرة لبن، الرياض، المملكة العربية السعودية، RDLB 3846"
  },
  popularLinks: {
    en: "Popular Link",
    ar: "روابط شائعة"
  },
  ourServices: {
    en: "Our Services",
    ar: "خدماتنا"
  },
  footerHomeLink: {
    en: "Home",
    ar: "الرئيسية"
  },
  footerAboutLink: {
    en: "About Us",
    ar: "من نحن"
  },
  footerServicesLink: {
    en: "Services",
    ar: "الخدمات"
  },
  footerContactLink: {
    en: "Contact Us",
    ar: "تواصل معنا"
  },
  footerEngineeringSolutions: {
    en: "Engineering Solutions",
    ar: "حلول هندسية"
  },
  footerEnvironmentalConsulting: {
    en: "Environmental Consulting",
    ar: "استشارات بيئية"
  },
  footerSafetyManagement: {
    en: "Safety Management",
    ar: "إدارة السلامة"
  },
  footerSecuritySystems: {
    en: "Security Systems",
    ar: "أنظمة الأمان"
  },
  copyright: {
    en: "All Right Reserved ",
    ar: "جميع الحقوق محفوظة "
  },
  designedBy: {
    en: "Designed by",
    ar: "تصميم"
  },
  /// Contact


  // Hero Section
  heroTitle: { en: "Contact", ar: "اتصل بنا" },
  heroSubtitle: {
    en: "We are here to help you. Get in touch with us for a free consultation.",
    ar: "نحن هنا لمساعدتك. تواصل معنا للحصول على استشارة مجانية."
  },

  // Contact Form
  formName: { en: "Your Name", ar: "اسمك" },
  formEmail: { en: "Your Email", ar: "بريدك الإلكتروني" },
  formSubject: { en: "Subject", ar: "الموضوع" },
  formMessage: { en: "Message", ar: "الرسالة" },
  formButton: { en: "Send Message", ar: "إرسال الرسالة" },
  formNamePH: { en: "Your Name", ar: "اسمك" },
  formEmailPH: { en: "Your Email", ar: "بريدك الإلكتروني" },
  formSubjectPH: { en: "Subject", ar: "الموضوع" },
  formMessagePH: { en: "Leave a message here", ar: "اكتب رسالتك هنا" },
  // Contact Info
  getInTouch: { en: "Get In Touch", ar: "تواصل معنا" },
  address: {
    en: "Najd Road, Dhahrat Laban District, Riyadh, Saudi Arabia, RDLB 3846",
    ar: "طريق نجد، حي ظهرة لبن، الرياض، المملكة العربية السعودية، 3846"
  },
  phone: { en: "+966 55 1795 955", ar: "+966 55 1795 955" },
  phone2: { en: "+966 50 7299 951", ar: "+966 50 7299 951" },
  contactEmail: { en: "enviormentalconsultant@gmail.com", ar: "enviormentalconsultant@gmail.com" },

  // Footer
  footerDescription: {
    en: "PMEC is a leading consulting firm providing engineering, environmental, security, and safety solutions to clients worldwide. We are dedicated to excellence and innovation in all our projects.",
    ar: "تُعد PMEC شركة رائدة في تقديم الاستشارات الهندسية والبيئية والأمنية والسلامة للعملاء حول العالم. نحن ملتزمون بالتميز والابتكار في جميع مشاريعنا."
  },
  footerLinks: { en: "Popular Link", ar: "روابط شائعة" },
  footerServices: { en: "Our Services", ar: "خدماتنا" },
  footerCopy: { en: "All Right Reserved", ar: "جميع الحقوق محفوظة" },

  /// Services

  // Meta
  pageTitle: {
    en: "Services - PMEC Engineering, Environmental, Security and Safety Consulting",
    ar: "الخدمات - PMEC للاستشارات الهندسية والبيئية والأمن والسلامة"
  },
  pageDescription: {
    en: "PMEC provides expert engineering, environmental, security, and safety consulting services in Riyadh, Saudi Arabia. We offer innovative and sustainable solutions tailored to your business needs.",
    ar: "تقدم PMEC خدمات استشارية متخصصة في الهندسة والبيئة والأمن والسلامة في الرياض، المملكة العربية السعودية، مع حلول مبتكرة ومستدامة مصممة لاحتياجات عملك."
  },

  // Hero
  servicesHeroTitle: { en: "Our Services", ar: "خدماتنا" },
  servicesHeroSubtitle: {
    en: "Comprehensive solutions for your engineering, environmental, security, and safety needs",
    ar: "حلول شاملة لاحتياجاتك في الهندسة والبيئة والأمن والسلامة"
  },

  // Overview
  servicesHeadline: { en: "Our Professional Services", ar: "خدماتنا الاحترافية" },
  servicesIntro: {
    en: "PMEC provides a comprehensive range of consulting services designed to help organizations achieve their goals while maintaining the highest standards of quality, safety, and environmental compliance.",
    ar: "تقدم PMEC مجموعة شاملة من خدمات الاستشارات لمساعدة المنظمات على تحقيق أهدافها مع الحفاظ على أعلى معايير الجودة والسلامة والامتثال البيئي."
  },

  // Stats labels (الأرقام تبقى كما هي)
  stats1Label: { en: "Engineering Projects Completed", ar: "مشاريع هندسية مُنجزة" },
  stats2Label: { en: "Environmental Assessments", ar: "تقييمات بيئية" },
  stats3Label: { en: "Safety Programs Implemented", ar: "برامج سلامة مطبّقة" },
  stats4Label: { en: "Satisfied Clients", ar: "عملاء راضون" },

  // Engineering
  engTitle: { en: "Engineering Solutions", ar: "الحلول الهندسية" },
  engIntro: {
    en: "Our engineering team provides innovative and reliable solutions for complex technical challenges across multiple disciplines.",
    ar: "يقدم فريقنا الهندسي حلولاً مبتكرة وموثوقة للتحديات التقنية المعقدة عبر تخصصات متعددة."
  },
  engStructuralTitle: { en: "Structural Engineering", ar: "الهندسة الإنشائية" },
  engStructuralDesc: {
    en: "Design and analysis of buildings, bridges, and infrastructure projects with focus on safety and durability.",
    ar: "تصميم وتحليل المباني والجسور ومشاريع البنية التحتية مع التركيز على السلامة والمتانة."
  },
  engCivilTitle: { en: "Civil Engineering", ar: "الهندسة المدنية" },
  engCivilDesc: {
    en: "Comprehensive planning and design services for transportation, water systems, and urban development projects.",
    ar: "خدمات شاملة للتخطيط والتصميم لمشاريع النقل وأنظمة المياه والتطوير الحضري."
  },
  engMechanicalTitle: { en: "Mechanical Engineering", ar: "الهندسة الميكانيكية" },
  engMechanicalDesc: {
    en: "HVAC systems, industrial equipment design, and energy-efficient mechanical solutions.",
    ar: "أنظمة التكييف والتهوية، وتصميم المعدات الصناعية، وحلول ميكانيكية عالية الكفاءة في الطاقة."
  },
  engElectricalTitle: { en: "Electrical Engineering", ar: "الهندسة الكهربائية" },
  engElectricalDesc: {
    en: "Power systems design, lighting solutions, and electrical infrastructure planning.",
    ar: "تصميم أنظمة القوى، وحلول الإضاءة، وتخطيط البنية التحتية الكهربائية."
  },

  // Environmental
  envTitle: { en: "Environmental Consulting", ar: "الاستشارات البيئية" },
  envIntro: {
    en: "We provide comprehensive environmental services to help organizations minimize their environmental impact and ensure regulatory compliance.",
    ar: "نقدم خدمات بيئية شاملة لمساعدة المؤسسات على تقليل أثرها البيئي وضمان الامتثال للأنظمة."
  },
  envEIATitle: { en: "Environmental Impact Assessments (EIA)", ar: "دراسات تقييم الأثر البيئي (EIA)" },
  envEIADesc: {
    en: "Comprehensive evaluation of potential environmental effects of proposed projects and developments.",
    ar: "تقييم شامل للآثار البيئية المحتملة للمشاريع والتطويرات المقترحة."
  },
  envSustainTitle: { en: "Sustainability Planning", ar: "تخطيط الاستدامة" },
  envSustainDesc: {
    en: "Development of sustainable practices and green initiatives to reduce environmental footprint.",
    ar: "تطوير ممارسات مستدامة ومبادرات خضراء لتقليل البصمة البيئية."
  },
  envWasteTitle: { en: "Waste Management Solutions", ar: "حلول إدارة النفايات" },
  envWasteDesc: {
    en: "Comprehensive waste reduction, recycling, and disposal strategies for various industries.",
    ar: "استراتيجيات شاملة لتقليل النفايات وإعادة التدوير والتخلص منها لمختلف القطاعات."
  },
  envRegTitle: { en: "Regulatory Compliance", ar: "الامتثال للأنظمة" },
  envRegDesc: {
    en: "Ensuring adherence to local and international environmental regulations and standards.",
    ar: "ضمان الالتزام بالأنظمة والمعايير البيئية المحلية والدولية."
  },

  // Safety
  safetyTitle: { en: "Safety Management", ar: "إدارة السلامة" },
  safetyIntro: {
    en: "Our safety experts help organizations create and maintain safe working environments through comprehensive risk management and safety planning.",
    ar: "يساعد خبراؤنا في السلامة المؤسسات على إنشاء بيئات عمل آمنة والحفاظ عليها عبر إدارة مخاطر شاملة وتخطيط للسلامة."
  },
  safetyRiskTitle: { en: "Risk Assessment & Analysis", ar: "تقييم وتحليل المخاطر" },
  safetyRiskDesc: {
    en: "Comprehensive identification and evaluation of workplace hazards and safety risks.",
    ar: "تحديد وتقييم شامل لمخاطر ومكامن الخطر في بيئة العمل."
  },
  safetyTrainingTitle: { en: "Safety Training Programs", ar: "برامج تدريب السلامة" },
  safetyTrainingDesc: {
    en: "Customized training programs to enhance safety awareness and compliance among employees.",
    ar: "برامج تدريب مخصصة لتعزيز الوعي بالسلامة والامتثال بين الموظفين."
  },
  safetyEmergencyTitle: { en: "Emergency Response Planning", ar: "خطط الاستجابة للطوارئ" },
  safetyEmergencyDesc: {
    en: "Development of comprehensive emergency procedures and crisis management protocols.",
    ar: "تطوير إجراءات طوارئ شاملة وبروتوكولات لإدارة الأزمات."
  },
  safetyAuditTitle: { en: "Safety Audits & Inspections", ar: "مراجعات وتفتيشات السلامة" },
  safetyAuditDesc: {
    en: "Regular safety assessments to ensure ongoing compliance and continuous improvement.",
    ar: "تقييمات سلامة دورية لضمان الاستمرارية في الامتثال والتحسين."
  },

  // Security
  secTitle: { en: "Security Systems", ar: "أنظمة الأمن" },
  secIntro: {
    en: "We design and implement comprehensive security solutions to protect your assets, personnel, and sensitive information.",
    ar: "نصمم ونطبق حلول أمن شاملة لحماية أصولك وموظفيك ومعلوماتك الحساسة."
  },
  secPhysicalTitle: { en: "Physical Security Systems", ar: "أنظمة الأمن المادي" },
  secPhysicalDesc: {
    en: "Access control, surveillance cameras, and perimeter security solutions for facilities protection.",
    ar: "أنظمة التحكم بالدخول، وكاميرات المراقبة، وحلول تأمين المحيط لحماية المنشآت."
  },
  secCyberTitle: { en: "Cybersecurity Consulting", ar: "استشارات الأمن السيبراني" },
  secCyberDesc: {
    en: "Information security assessments and implementation of digital security measures.",
    ar: "تقييم أمن المعلومات وتطبيق إجراءات الحماية الرقمية."
  },
  secRiskTitle: { en: "Security Risk Assessment", ar: "تقييم مخاطر الأمن" },
  secRiskDesc: {
    en: "Comprehensive evaluation of security vulnerabilities and threat analysis.",
    ar: "تقييم شامل لنقاط الضعف الأمنية وتحليل التهديدات."
  },
  secTrainingTitle: { en: "Security Personnel Training", ar: "تدريب أفراد الأمن" },
  secTrainingDesc: {
    en: "Professional training programs for security staff and emergency response teams.",
    ar: "برامج تدريب احترافية لطاقم الأمن وفرق الاستجابة للطوارئ."
  },

  // Process
  processHeadline: { en: "Our Process", ar: "منهجيتنا" },
  processStep1Title: { en: "Consultation", ar: "الاستشارة" },
  processStep1Desc: {
    en: "Initial assessment of your needs and project requirements",
    ar: "تقييم أولي لاحتياجاتك ومتطلبات المشروع"
  },
  processStep2Title: { en: "Planning", ar: "التخطيط" },
  processStep2Desc: {
    en: "Detailed project planning and strategy development",
    ar: "تخطيط تفصيلي للمشروع وتطوير الإستراتيجية"
  },
  processStep3Title: { en: "Implementation", ar: "التنفيذ" },
  processStep3Desc: {
    en: "Expert execution of solutions with continuous monitoring",
    ar: "تنفيذ احترافي للحلول مع متابعة مستمرة"
  },
  processStep4Title: { en: "Support", ar: "الدعم" },
  processStep4Desc: {
    en: "Ongoing support and maintenance for long-term success",
    ar: "دعم وصيانة مستمرة لضمان النجاح على المدى الطويل"
  },

  // CTA
  ctaTitle: { en: "Ready to Get Started?", ar: "جاهزون للانطلاق؟" },
  ctaDesc: {
    en: "Contact our team of experts today to discuss your project requirements and discover how PMEC can help you achieve your goals with our comprehensive consulting services.",
    ar: "تواصل مع فريق خبرائنا اليوم لمناقشة متطلبات مشروعك ومعرفة كيف يمكن لـ PMEC مساعدتك في تحقيق أهدافك من خلال خدماتنا الاستشارية الشاملة."
  },
  ctaButton: { en: "Get Free Quote", ar: "احصل على عرض مجاني" },
  ctaCallUs: { en: "Call us anytime", ar: "اتصل بنا في أي وقت" },

  // Footer
  footerDescription: {
    en: "PMEC is a leading consulting firm providing engineering, environmental, security, and safety solutions to clients worldwide. We are dedicated to excellence and innovation in all our projects.",
    ar: "تُعد PMEC شركة رائدة في تقديم حلول الاستشارات الهندسية والبيئية والأمن والسلامة للعملاء حول العالم، ملتزمون بالتميز والابتكار في جميع مشاريعنا."
  },
  footerPopularLinkTitle: { en: "Popular Link", ar: "روابط شائعة" },
  footerOurServicesTitle: { en: "Our Services", ar: "خدماتنا" },
  footerHomeLink: { en: "Home", ar: "الرئيسية" },
  footerAboutLink: { en: "About Us", ar: "عن الشركة" },
  footerServicesLink: { en: "Services", ar: "الخدمات" },
  footerContactLink: { en: "Contact Us", ar: "اتصل بنا" },
  footerService1: { en: "Engineering Solutions", ar: "الحلول الهندسية" },
  footerService2: { en: "Environmental Consulting", ar: "الاستشارات البيئية" },
  footerService3: { en: "Safety Management", ar: "إدارة السلامة" },
  footerService4: { en: "Security Systems", ar: "أنظمة الأمن" },
  footerCopyReserved: { en: "All Right Reserved", ar: "جميع الحقوق محفوظة" },

  // Contacts (use unique IDs to avoid duplicates)
  addressFooter: {
    en: "Najd Road, Dhahrat Laban District, Riyadh, Saudi Arabia, RDLB 3846",
    ar: "طريق نجد، حي ظهرة لبن، الرياض، المملكة العربية السعودية، 3846"
  },
  phoneFooter: { en: "+966 55 1795 955", ar: "+966 55 1795 955" },
  phoneFooter2: { en: "+966 50 7299 951", ar: "+966 50 7299 951" },
  emailFooter: { en: "enviormentalconsultant@gmail.com", ar: "enviormentalconsultant@gmail.com" }
  ,

  // Hero Section
  heroHomeTitlePart1: {
    en: "We Are The Best",
    ar: "نحن أفضل"
  },
  heroHomeTitlePart2: {
    en: "Environmental Consulting Company (Cat 1, 2, 3)",
    ar: "شركة استشارات بيئية (الفئات 1، 2، 3)"
  },
  heroHomeTitlePart3: {
    en: " In The World",
    ar: " في العالم"
  },
  heroHomeSubtitle: {
    en: "Everything you need to achieve Category A environmental compliance in environmental consulting.",
    ar: " كل ما يلزمك لتحقيق الالتزام البيئي في مجال الاستشارات البيئية الفئات 1، 2، 3 "
  },
  heroDescription: {
    en: "Specializing in securing all environmental permits for facilities, including gas stations, crushers, concrete and block factories, all factories and farms, and hospitals, ensuring full compliance with all NCEC requirements.",
    ar: "متخصصون في استخراج جميع التراخيص البيئية للمنشآت، بما في ذلك محطات الوقود، الكسارات، مصانع الخرسانة والبلك، جميع المصانع والمزارع، والمستشفيات، لضمان الامتثال التام لجميع متطلبات المركز الوطني للالتزام البيئي (NCEC)."
  },
  getQuoteBtn: {
    en: "Get Free Quote",
    ar: "اطلب عرض سعر مجاني"
  },

  // Hero Features
  environmentalSolutions: {
    en: "Environmental Compliance (Cat 1, 2, 3)",
    ar: "الالتزام البيئي (الفئات 1، 2، 3)"
  },
  complianceAssurance: {
    en: "Speed in Execution",
    ar: "سرعة في الإنجاز"
  },
  expertConsultants: {
    en: "Professional Consulting Team",
    ar: "فريق استشاري محترف"
  },
  discountOffers: {
    en: "30% Discounts",
    ar: "تخفيضات 30%"
  },

  // About Section
  aboutHeading: {
    en: "About Us",
    ar: "من نحن"
  },
  aboutParagraph1: {
    en: "We are a leading firm specializing in providing integrated environmental consulting services, helping facilities achieve the environmental compliance required by the National Center for Environmental Compliance (NCEC).",
    ar: "نحن شركة رائدة متخصصة في تقديم الخدمات الاستشارية البيئية المتكاملة، ونساعد المنشآت على تحقيق الالتزام البيئي المطلوب منها حسب تصنيف المركز الوطني للالتزام البيئي (NCEC)."
  },
  aboutParagraph2: {
    en: "Our services include issuing all environmental licenses for other facilities such as gas stations, crushers, concrete and block factories, and hospitals, guaranteeing accuracy in results and speed in execution.",
    ar: "خدماتنا تشمل إصدار جميع التراخيص البيئية للمنشآت الأخرى مثل محطات الوقود، الكسارات، مصانع الخرسانة والبلك، والمستشفيات، لضمان دقة في النتائج وسرعة في الإنجاز."
  },

  // About Checkmarks
  environmentalConsulting1: {
    en: "Environmental Permit Follow-up",
    ar: "متابعة التصريح البيئي"
  },
  impactAssessment: {
    en: "Environmental Impact Assessment",
    ar: "دراسة تقييم الأثر البيئي"
  },
  environmentalAuditing: {
    en: "Environmental Auditing",
    ar: "التدقيق البيئي للمنشآت"
  },
  sustainablePractices: {
    en: "Soil and Air Quality Analysis",
    ar: "تحاليل جودة التربة والهواء"
  },
  readMoreBtn: {
    en: "Read More",
    ar: "اقرأ المزيد"
  },

  // Why Choose Us Section
  whyChooseUsTitle: {
    en: "Why",
    ar: "لماذا"
  },
  whyChooseUsTitleSpan: {
    en: "Choose Us",
    ar: "تختارنا"
  },

  // Why Choose Us Cards (Updated from image data)
  environmentalComplianceTitle: {
    en: "Environmental Compliance (Cat 1, 2, 3)",
    ar: "الالتزام البيئي (الفئات 1، 2، 3)"
  },
  environmentalComplianceText: {
    en: "Guaranteed issuance of environmental permits for all required environmental facility categories.",
    ar: "ضمان استخراج التصاريح البيئية لجميع فئات المنشآت البيئية المطلوبة."
  },
  comprehensiveServiceTitle: {
    en: "Integrated Services for Projects",
    ar: "خدمات متكاملة للمشاريع"
  },
  comprehensiveServiceText: {
    en: "We offer integrated services to meet your project's environmental permit needs, including soil investigation and analysis.",
    ar: "نقدم خدمات متكاملة تلبي احتياجات التصاريح البيئية لمشروعك، بما في ذلك أعمال الجسات والتحاليل."
  },
  industrialExpertise: {
    en: "Specialization in Sensitive Facilities",
    ar: "تخصص في المنشآت الحساسة"
  },
  industrialExpertiseText: {
    en: "Specialized in gas stations, chemical factories, crushers, and hospitals.",
    ar: "متخصصون في محطات الوقود، المصانع الكيماوية، الكسارات، والمستشفيات."
  },
  clientSatisfactionTitle: {
    en: "Professional Consulting Team",
    ar: "فريق استشاري محترف"
  },
  clientSatisfactionText: {
    en: "A specialized team known for accuracy in results and speed in execution.",
    ar: "فريق متخصص يتميز بالدقة في النتائج والسرعة في الإنجاز."
  },
  professionalTeamTitle: {
    en: "Issuance of All Licenses",
    ar: "إصدار جميع التراخيص"
  },
  professionalTeamText: {
    en: "Issuance and follow-up service for all environmental licenses for other facilities.",
    ar: "خدمة إصدار ومتابعة لجميع التراخيص البيئية للمنشآت الأخرى."
  },
  bestPriceGuaranteedTitle: {
    en: "Our Best Prices Ever",
    ar: "أسعارنا الأفضل على الإطلاق"
  },
  bestPriceGuaranteedText: {
    en: "Competitive prices, with discounts up to  30% .",
    ar: "أسعار منافسة، مع خصومات تصل إلى  30% ."
  },

  // Services Section
  ourProfessional: {
    en: "Our Environmental",
    ar: "خدماتنا"
  },
  ourProfessionalServices: {
    en: "Services",
    ar: "البيئية"
  },
  servicesParagraph1: {
    en: "We offer integrated services to meet your project's environmental permit needs, from initial assessment to final permit issuance.",
    ar: "نقدم خدمات متكاملة لتلبية احتياجات التصاريح البيئية لمشروعك، من التقييم الأولي وحتى الحصول على التصريح النهائي."
  },
  servicesParagraph2: {
    en: "We work to ensure you achieve Environmental Compliance (Category A), and we provide specialized consultations for facilities with high NCEC classification.",
    ar: "نعمل على ضمان تحقيقك لـ الالتزام البيئي (الفئات 1، 2، 3)، ونوفر استشارات متخصصة للمنشآت ذات التصنيف العالي في المركز الوطني للالتزام البيئي."
  },
  callUsText: {
    en: "Call us direct 24/7 for a free consultation",
    ar: "اتصل بنا مباشرة 24/7 لاستشارة مجانية"
  },

  // Service Cards
  auditingAndStudies: {
    en: "Auditing & EIA Studies",
    ar: "التدقيق ودراسات الأثر البيئي"
  },
  auditingAndStudiesText: {
    en: "Preparing all necessary studies like EIA and environmental auditing.",
    ar: "إعداد دراسة تقييم الأثر البيئي والتدقيق البيئي المطلوبين."
  },
  testingAndAnalysis: {
    en: "Measurements & Analysis",
    ar: "القياسات والتحاليل"
  },
  testingAndAnalysisText: {
    en: "Soil investigation, air and light quality measurements, and soil quality analysis.",
    ar: "أعمال الجسات، قياسات جودة الهواء والضوء، وتحاليل جودة التربة."
  },
  licensingFollowUp: {
    en: "Environmental Permit Follow-up",
    ar: "متابعة التصاريح البيئية"
  },
  licensingFollowUpText: {
    en: "Follow-up on the application for the environmental permit for construction and operation.",
    ar: "متابعة طلب الحصول على التصريح البيئي للإنشاء والتشغيل."
  },
  managementPlans: {
    en: "Environmental Management Plans",
    ar: "خطط الإدارة البيئية"
  },
  managementPlansText: {
    en: "Preparing studies for Environmental Management Plans to ensure continuous environmental compliance.",
    ar: "إعداد دراسات خطط الإدارة البيئية لضمان الامتثال البيئي المستمر."
  },

  // Partners Section (Now focusing on facility types)
  ourPartnersTitle2: {
    en: "Key Facilities We",
    ar: "أهم"
  },
  ourPartnersSpan2: {
    en: "Serve",
    ar: " المنشآت التي نخدمها"
  },

  partner1Title2: {
    en: "Hospitals & Medical Centers (Category One)",
    ar: "المستشفيات والمراكز الطبية (فئة أولى)"
  },
  partner1Text2: {
    en: "Specialized in hospitals and medical centers of all specialties to achieve Environmental Compliance Category A. (Includes Category One).",
    ar: "متخصصون في المستشفيات والمراكز الطبية بجميع التخصصات لتحقيق الالتزام البيئي الفئات 1، 2، 3 (تشمل الفئة الأولى)."
  },
  partner2Title2: {
    en: "Gas Stations (Category Two)",
    ar: "محطات الوقود (فئة ثانية)"
  },
  partner2Text2: {
    en: "Specialized in oil stations and gas stations to ensure full environmental compliance (Includes oil change and Category Two stations).",
    ar: "متخصصون في محطات النفط ومحطات الوقود لضمان تحقيق الالتزام البيئي الكامل (تشمل محطات تغيير الزيوت والمحطات الفئة الثانية)."
  },
  partner3Title2: {
    en: "Crushers, Factories, and Petrochemical Plants (Category Three)",
    ar: "الكسارات والمصانع والبتروكيماوية (فئة ثالثة)"
  },
  partner3Text2: {
    en: "Specialized in petrochemical factories and all types of factories, crushers, quarries, concrete and block factories (Includes Category Three).",
    ar: "متخصصون في المصانع البتروكيماوية وجميع أنواع المصانع، والكسارات والمحاجر ومصانع الخرسانة والبلك (تشمل الفئة الثالثة)."
  },

  // Footer
  footerAboutText: {
    en: "PMEC is a leading firm specializing in Environmental Consulting (Category A) in Saudi Arabia. We are committed to providing sustainable and innovative solutions to ensure our clients' compliance.",
    ar: "بيوت المعمار هي شركة رائدة متخصصة في الاستشارات البيئية (الفئات 1، 2، 3) في المملكة العربية السعودية. نلتزم بتقديم حلول مستدامة ومبتكرة لضمان امتثال عملائنا."
  },
  getInTouchTitle: {
    en: "Get In Touch",
    ar: "تواصل معنا"
  },
  addressText: {
    en: "Najd Road, Dhahrat Laban District, Riyadh, Saudi Arabia, RDLB 3846",
    ar: "طريق نجد، حي ظهرة لبن، الرياض، المملكة العربية السعودية، RDLB 3846"
  },
  popularLinkTitle: {
    en: "Quick Links",
    ar: "روابط سريعة"
  },
  footerHomeLink: {
    en: "Home",
    ar: "الرئيسية"
  },
  footerAboutLink: {
    en: "About Us",
    ar: "من نحن"
  },
  footerServicesLink: {
    en: "Services",
    ar: "خدماتنا"
  },
  footerContactLink: {
    en: "Contact Us",
    ar: "اتصل بنا"
  },
  ourServices: {
    en: "Our Environmental Services",
    ar: "خدماتنا البيئية"
  },
  footerEnvironmentalConsulting: {
    en: "Environmental Compliance (Cat 1, 2, 3)",
    ar: "الالتزام البيئي (الفئات 1، 2، 3)"
  },
  footerImpactAssessment: {
    en: "EIA & Auditing Studies",
    ar: "دراسات الأثر البيئي والتدقيق"
  },
  footerTestingAndAnalysis: {
    en: "Measurements & Analysis",
    ar: "القياسات والتحاليل"
  },
  footerLicensingFollowUp: {
    en: "Licensing Follow-up",
    ar: "متابعة التصاريح البيئية"
  },
  copyright: {
    en: "All Rights Reserved",
    ar: "جميع الحقوق محفوظة"
  },
  designedBy: {
    en: "Designed",
    ar: "تصميم"
  }
  ,

  // Hero Section
  servicesHeroTitle: {
    en: "Our Environmental Services",
    ar: "خدماتنا البيئية"
  },
  servicesHeroSubtitle: {
    en: "Comprehensive solutions for all your Category A environmental consulting needs",
    ar: "حلول شاملة لجميع احتياجاتكم في مجال الاستشارات البيئية فئة أ"
  },

  // Services Overview
  servicesHeadline: {
    en: "Our Environmental Consulting Services",
    ar: "خدماتنا الاستشارية البيئية"
  },
  servicesIntro: {
    en: "PMEC Environmental Consulting provides a comprehensive range of environmental consulting services designed to help organizations achieve environmental compliance and maintain the highest environmental quality standards.",
    ar: "بيوت المعمار للاستشارات البيئية (PMEC) تقدم مجموعة شاملة من الخدمات الاستشارية البيئية المصممة لمساعدة المؤسسات على تحقيق الامتثال البيئي والحفاظ على أعلى معايير الجودة البيئية."
  },

  // Statistics
  stats1Label: {
    en: "Environmental Studies Completed",
    ar: "دراسة بيئية مكتملة"
  },
  stats2Label: {
    en: "Industrial Facilities Assessed",
    ar: "منشأة صناعية تم تقييمها"
  },
  stats3Label: {
    en: "Environmental Permits Obtained",
    ar: "ترخيص بيئي تم الحصول عليه"
  },
  stats4Label: {
    en: "Satisfied Clients",
    ar: "عميل راضٍ"
  },

  // Environmental Impact Assessment
  eiaTitle: {
    en: "Environmental Impact Assessment",
    ar: "دراسة تقييم الأثر البيئي"
  },
  eiaIntro: {
    en: "We provide comprehensive environmental impact assessment studies for projects and industrial facilities to ensure compliance with environmental standards.",
    ar: "نقدم دراسات شاملة لتقييم الأثر البيئي للمشاريع والمنشآت الصناعية لضمان الامتثال للمعايير البيئية."
  },
  eiaStudiesTitle: {
    en: "Integrated Environmental Impact Studies",
    ar: "دراسات الأثر البيئي المتكاملة"
  },
  eiaStudiesDesc: {
    en: "Comprehensive assessment of potential environmental impacts of new projects and existing expansions.",
    ar: "تقييم شامل للآثار البيئية المحتملة للمشاريع الجديدة والتوسعات القائمة."
  },
  eiaAuditTitle: {
    en: "Environmental Auditing",
    ar: "التدقيق البيئي"
  },
  eiaAuditDesc: {
    en: "Review and assessment of current environmental practices and recommendations for necessary improvements.",
    ar: "مراجعة وتقييم الممارسات البيئية الحالية والتوصية بالتحسينات اللازمة."
  },
  eiaComplianceTitle: {
    en: "Environmental Compliance Assessment",
    ar: "تقييم الامتثال البيئي"
  },
  eiaComplianceDesc: {
    en: "Examination of compliance level with local and international environmental laws and standards.",
    ar: "فحص مستوى الامتثال للقوانين والمعايير البيئية المحلية والدولية."
  },

  // Environmental Management Plans
  empTitle: {
    en: "Environmental Management Plans",
    ar: "خطط الإدارة البيئية"
  },
  empIntro: {
    en: "Preparing studies for Environmental Management Plans to ensure continuous environmental compliance and effective environmental risk management.",
    ar: "إعداد دراسات خطط الإدارة البيئية لضمان الامتثال البيئي المستمر وإدارة المخاطر البيئية بفعالية."
  },
  empDevelopmentTitle: {
    en: "Environmental Management Plan Development",
    ar: "تطوير خطط الإدارة البيئية"
  },
  empDevelopmentDesc: {
    en: "Preparing comprehensive plans for managing environmental aspects in industrial facilities.",
    ar: "إعداد خطط شاملة لإدارة الجوانب البيئية في المنشآت الصناعية."
  },
  empMonitoringTitle: {
    en: "Environmental Monitoring Programs",
    ar: "برامج المراقبة البيئية"
  },
  empMonitoringDesc: {
    en: "Establishing continuous monitoring programs for key environmental indicators.",
    ar: "وضع برامج مراقبة مستمرة للمؤشرات البيئية الرئيسية."
  },
  empResponseTitle: {
    en: "Environmental Emergency Response Plans",
    ar: "خطط الاستجابة للطوارئ البيئية"
  },
  empResponseDesc: {
    en: "Preparing rapid response procedures for potential environmental incidents.",
    ar: "إعداد إجراءات الاستجابة السريعة للحوادث البيئية المحتملة."
  },

  // Environmental Testing & Analysis
  testingTitle: {
    en: "Environmental Testing & Analysis",
    ar: "القياسات والتحاليل البيئية"
  },
  testingIntro: {
    en: "We provide comprehensive environmental testing and analysis services to ensure environmental quality and monitor pollution levels.",
    ar: "نقدم خدمات شاملة للقياسات والتحاليل البيئية لضمان جودة البيئة ومراقبة مستويات التلوث."
  },
  testingAirTitle: {
    en: "Air Quality Measurements",
    ar: "قياسات جودة الهواء"
  },
  testingAirDesc: {
    en: "Monitoring and measuring air pollutants and industrial emissions.",
    ar: "مراقبة وقياس ملوثات الهواء والانبعاثات الصناعية."
  },
  testingNoiseTitle: {
    en: "Noise Measurements",
    ar: "قياسات الضوضاء"
  },
  testingNoiseDesc: {
    en: "Monitoring noise levels and assessing their impact on the surrounding environment.",
    ar: "مراقبة مستويات الضوضاء وتقييم تأثيرها على البيئة المحيطة."
  },
  testingSoilTitle: {
    en: "Soil Quality Analysis",
    ar: "تحاليل جودة التربة"
  },
  testingSoilDesc: {
    en: "Examination and analysis of soil samples to assess pollution and degradation levels.",
    ar: "فحص وتحليل عينات التربة لتقييم مستوى التلوث والتدهور."
  },
  testingWaterTitle: {
    en: "Containment Works",
    ar: "أعمال الحبسات"
  },
  testingWaterDesc: {
    en: "Implementation of containment works and pollution source control.",
    ar: "تنفيذ أعمال الحبسات والتحكم في مصادر التلوث."
  },

  // Environmental Licensing
  licensingTitle: {
    en: "Environmental Licensing",
    ar: "التراخيص البيئية"
  },
  licensingIntro: {
    en: "We provide comprehensive follow-up services to obtain environmental permits for construction and operation for all types of facilities.",
    ar: "نقدم خدمات متابعة شاملة للحصول على التراخيص البيئية للإنشاء والتشغيل لجميع أنواع المنشآت."
  },
  licensingConstructionTitle: {
    en: "Environmental Construction Permit",
    ar: "التصريح البيئي للإنشاء"
  },
  licensingConstructionDesc: {
    en: "Following up on procedures to obtain environmental permits for new projects.",
    ar: "متابعة إجراءات الحصول على التصاريح البيئية للمشاريع الجديدة."
  },
  licensingOperationTitle: {
    en: "Environmental Operation Permit",
    ar: "التصريح البيئي للتشغيل"
  },
  licensingOperationDesc: {
    en: "Obtaining environmental operating licenses for existing facilities.",
    ar: "الحصول على تراخيص التشغيل البيئية للمنشآت القائمة."
  },
  licensingRenewalTitle: {
    en: "License Renewal",
    ar: "تجديد التراخيص"
  },
  licensingRenewalDesc: {
    en: "Following up on procedures for renewing expired environmental licenses.",
    ar: "متابعة إجراءات تجديد التراخيص البيئية المنتهية الصلاحية."
  },
  licensingDocumentationTitle: {
    en: "Required Documentation Preparation",
    ar: "إعداد الوثائق المطلوبة"
  },
  licensingDocumentationDesc: {
    en: "Preparing all required documents and studies for obtaining licenses.",
    ar: "تحضير جميع الوثائق والدراسات المطلوبة للحصول على التراخيص."
  },

  // Specialized Industries
  industriesHeadline: {
    en: "Specialized Industries",
    ar: "الصناعات المتخصصة"
  },
  industriesIntro: {
    en: "We specialize in providing environmental consulting for a wide range of industries and facilities",
    ar: "نحن متخصصون في تقديم الاستشارات البيئية لمجموعة واسعة من الصناعات والمنشآت"
  },

  // Process Section
  processHeadline: {
    en: "Our Methodology",
    ar: "منهجية العمل"
  },
  processStep1Title: {
    en: "Initial Consultation",
    ar: "الاستشارة الأولية"
  },
  processStep1Desc: {
    en: "Initial assessment of your needs and environmental project requirements",
    ar: "تقييم أولي لاحتياجاتكم ومتطلبات المشروع البيئية"
  },
  processStep2Title: {
    en: "Planning & Study",
    ar: "التخطيط والدراسة"
  },
  processStep2Desc: {
    en: "Detailed work plan preparation and comprehensive project study",
    ar: "إعداد خطة عمل مفصلة ودراسة شاملة للمشروع"
  },
  processStep3Title: {
    en: "Implementation & Follow-up",
    ar: "التنفيذ والمتابعة"
  },
  processStep3Desc: {
    en: "Implementation of environmental solutions with continuous monitoring",
    ar: "تنفيذ الحلول البيئية مع المراقبة المستمرة"
  },
  processStep4Title: {
    en: "Ongoing Support",
    ar: "الدعم المستمر"
  },
  processStep4Desc: {
    en: "Ongoing support and maintenance of environmental solutions for long-term success",
    ar: "دعم مستمر وصيانة للحلول البيئية لضمان النجاح طويل المدى"
  },

  // Partners
  partnersHeadline: {
    en: "Our Partners",
    ar: "شركاؤنا"
  },
  partnersIntro: {
    en: "We are proud of our partnerships with major companies in Saudi Arabia",
    ar: "نفخر بشراكتنا مع كبرى الشركات في المملكة العربية السعودية"
  },

  // Why Choose Us
  whyChooseHeadline: {
    en: "Why Choose Us",
    ar: "لماذا تختارنا"
  },

  // Call to Action
  ctaTitle: {
    en: "Ready to Get Started?",
    ar: "هل أنت مستعد للبدء؟"
  },
  ctaDesc: {
    en: "Contact our team of experts today to discuss your project requirements and discover how PMEC can help you achieve your goals through our comprehensive environmental consulting services.",
    ar: "تواصل مع فريق الخبراء لدينا اليوم لمناقشة متطلبات مشروعكم واكتشف كيف يمكن لـ PMEC مساعدتكم في تحقيق أهدافكم من خلال خدماتنا الاستشارية البيئية الشاملة."
  },
  ctaButton: {
    en: "Get Free Consultation",
    ar: "احصل على استشارة مجانية"
  },

  // Footer
  footerAboutText: {
    en: "PMEC is a leading company specialized in environmental consulting (Category A) in Saudi Arabia. We are committed to providing sustainable and innovative solutions to ensure our clients' compliance.",
    ar: "بيوت المعمار هي شركة رائدة متخصصة في الاستشارات البيئية (الفئات 1، 2، 3) في المملكة العربية السعودية. نلتزم بتقديم حلول مستدامة ومبتكرة لضمان امتثال عملائنا."
  },
  getInTouchTitle: {
    en: "Get In Touch",
    ar: "تواصل معنا"
  },
  addressText: {
    en: "Najd Road, Dhahrat Laban District, Riyadh, Saudi Arabia, RDLB 3846",
    ar: "طريق نجد، حي ظهرة لبن، الرياض، المملكة العربية السعودية، RDLB 3846"
  },
  phoneText: {
    en: "+966 55 1795 955",
    ar: "+966 55 1795 955"
  },
  phoneText2: {
    en: "+966 50 7299 951",
    ar: "+966 50 7299 951"
  },
  emailText: {
    en: "enviormentalconsultant@gmail.com",
    ar: "enviormentalconsultant@gmail.com"
  },
  websiteText: {
    en: "www.pmesc.net",
    ar: "www.pmesc.net"
  },
  popularLinkTitle: {
    en: "Quick Links",
    ar: "روابط سريعة"
  },
  footerHomeLink: {
    en: "Home",
    ar: "الرئيسية"
  },
  footerAboutLink: {
    en: "About Us",
    ar: "من نحن"
  },
  footerServicesLink: {
    en: "Our Services",
    ar: "خدماتنا"
  },
  footerContactLink: {
    en: "Contact Us",
    ar: "اتصل بنا"
  },
  ourServices: {
    en: "Our Environmental Services",
    ar: "خدماتنا البيئية"
  },
  footerEnvironmentalConsulting: {
    en: "Environmental Compliance (Category A)",
    ar: "الالتزام البيئي (الفئات 1، 2، 3)"
  },
  footerImpactAssessment: {
    en: "Environmental Impact Assessment",
    ar: "دراسة تقييم الأثر البيئي"
  },
  footerTestingAndAnalysis: {
    en: "Testing and Analysis",
    ar: "القياسات والتحاليل"
  },
  footerLicensingFollowUp: {
    en: "Environmental Permits Follow-up",
    ar: "متابعة التصاريح البيئية"
  },
  copyright: {
    en: "All Rights Reserved",
    ar: "جميع الحقوق محفوظة"
  },
  designedBy: {
    en: "Designed",
    ar: "تصميم"
  },
  currentYear: {
    en: "2025",
    ar: "2025"
  }
  ,
  // Navigation
  homeNav: {
    en: "Home",
    ar: "الرئيسية"
  },
  aboutNav: {
    en: "About",
    ar: "من نحن"
  },
  servicesNav: {
    en: "Services",
    ar: "خدماتنا"
  },
  contactNav: {
    en: "Contact",
    ar: "اتصل بنا"
  },
  languageButton: {
    en: "العربية",
    ar: "English"
  },

  // Hero Section
  servicesHeroTitle: {
    en: "Our Environmental Services",
    ar: "خدماتنا البيئية"
  },
  servicesHeroSubtitle: {
    en: "Comprehensive solutions for all your Category A environmental consulting needs",
    ar: "حلول شاملة لجميع احتياجاتكم في مجال الاستشارات البيئية فئة أ"
  },

  // Services Overview
  servicesHeadline: {
    en: "Our Environmental Consulting Services",
    ar: "خدماتنا الاستشارية البيئية"
  },
  servicesIntro: {
    en: "PMEC Environmental Consulting provides a comprehensive range of environmental consulting services designed to help organizations achieve environmental compliance and maintain the highest environmental quality standards.",
    ar: "بيوت المعمار للاستشارات البيئية (PMEC) تقدم مجموعة شاملة من الخدمات الاستشارية البيئية المصممة لمساعدة المؤسسات على تحقيق الامتثال البيئي والحفاظ على أعلى معايير الجودة البيئية."
  },

  // Statistics
  stats1Label: {
    en: "Environmental Studies Completed",
    ar: "دراسة بيئية مكتملة"
  },
  stats2Label: {
    en: "Industrial Facilities Assessed",
    ar: "منشأة صناعية تم تقييمها"
  },
  stats3Label: {
    en: "Environmental Permits Obtained",
    ar: "ترخيص بيئي تم الحصول عليه"
  },
  stats4Label: {
    en: "Satisfied Clients",
    ar: "عميل راضٍ"
  },

  // Environmental Impact Assessment
  eiaTitle: {
    en: "Environmental Impact Assessment",
    ar: "دراسة تقييم الأثر البيئي"
  },
  eiaIntro: {
    en: "We provide comprehensive environmental impact assessment studies for projects and industrial facilities to ensure compliance with environmental standards.",
    ar: "نقدم دراسات شاملة لتقييم الأثر البيئي للمشاريع والمنشآت الصناعية لضمان الامتثال للمعايير البيئية."
  },
  eiaStudiesTitle: {
    en: "Integrated Environmental Impact Studies",
    ar: "دراسات الأثر البيئي المتكاملة"
  },
  eiaStudiesDesc: {
    en: "Comprehensive assessment of potential environmental impacts of new projects and existing expansions.",
    ar: "تقييم شامل للآثار البيئية المحتملة للمشاريع الجديدة والتوسعات القائمة."
  },
  eiaAuditTitle: {
    en: "Environmental Auditing",
    ar: "التدقيق البيئي"
  },
  eiaAuditDesc: {
    en: "Review and assessment of current environmental practices and recommendations for necessary improvements.",
    ar: "مراجعة وتقييم الممارسات البيئية الحالية والتوصية بالتحسينات اللازمة."
  },
  eiaComplianceTitle: {
    en: "Environmental Compliance Assessment",
    ar: "تقييم الامتثال البيئي"
  },
  eiaComplianceDesc: {
    en: "Examination of compliance level with local and international environmental laws and standards.",
    ar: "فحص مستوى الامتثال للقوانين والمعايير البيئية المحلية والدولية."
  },

  // Environmental Management Plans
  empTitle: {
    en: "Environmental Management Plans",
    ar: "خطط الإدارة البيئية"
  },
  empIntro: {
    en: "Preparing studies for Environmental Management Plans to ensure continuous environmental compliance and effective environmental risk management.",
    ar: "إعداد دراسات خطط الإدارة البيئية لضمان الامتثال البيئي المستمر وإدارة المخاطر البيئية بفعالية."
  },
  empDevelopmentTitle: {
    en: "Environmental Management Plan Development",
    ar: "تطوير خطط الإدارة البيئية"
  },
  empDevelopmentDesc: {
    en: "Preparing comprehensive plans for managing environmental aspects in industrial facilities.",
    ar: "إعداد خطط شاملة لإدارة الجوانب البيئية في المنشآت الصناعية."
  },
  empMonitoringTitle: {
    en: "Environmental Monitoring Programs",
    ar: "برامج المراقبة البيئية"
  },
  empMonitoringDesc: {
    en: "Establishing continuous monitoring programs for key environmental indicators.",
    ar: "وضع برامج مراقبة مستمرة للمؤشرات البيئية الرئيسية."
  },
  empResponseTitle: {
    en: "Environmental Emergency Response Plans",
    ar: "خطط الاستجابة للطوارئ البيئية"
  },
  empResponseDesc: {
    en: "Preparing rapid response procedures for potential environmental incidents.",
    ar: "إعداد إجراءات الاستجابة السريعة للحوادث البيئية المحتملة."
  },

  // Environmental Testing & Analysis
  testingTitle: {
    en: "Environmental Testing & Analysis",
    ar: "القياسات والتحاليل البيئية"
  },
  testingIntro: {
    en: "We provide comprehensive environmental testing and analysis services to ensure environmental quality and monitor pollution levels.",
    ar: "نقدم خدمات شاملة للقياسات والتحاليل البيئية لضمان جودة البيئة ومراقبة مستويات التلوث."
  },
  testingAirTitle: {
    en: "Air Quality Measurements",
    ar: "قياسات جودة الهواء"
  },
  testingAirDesc: {
    en: "Monitoring and measuring air pollutants and industrial emissions.",
    ar: "مراقبة وقياس ملوثات الهواء والانبعاثات الصناعية."
  },
  testingNoiseTitle: {
    en: "Noise Measurements",
    ar: "قياسات الضوضاء"
  },
  testingNoiseDesc: {
    en: "Monitoring noise levels and assessing their impact on the surrounding environment.",
    ar: "مراقبة مستويات الضوضاء وتقييم تأثيرها على البيئة المحيطة."
  },
  testingSoilTitle: {
    en: "Soil Quality Analysis",
    ar: "تحاليل جودة التربة"
  },
  testingSoilDesc: {
    en: "Examination and analysis of soil samples to assess pollution and degradation levels.",
    ar: "فحص وتحليل عينات التربة لتقييم مستوى التلوث والتدهور."
  },
  testingWaterTitle: {
    en: "Containment Works",
    ar: "أعمال الحبسات"
  },
  testingWaterDesc: {
    en: "Implementation of containment works and pollution source control.",
    ar: "تنفيذ أعمال الحبسات والتحكم في مصادر التلوث."
  },

  // Environmental Licensing
  licensingTitle: {
    en: "Environmental Licensing",
    ar: "التراخيص البيئية"
  },
  licensingIntro: {
    en: "We provide comprehensive follow-up services to obtain environmental permits for construction and operation for all types of facilities.",
    ar: "نقدم خدمات متابعة شاملة للحصول على التراخيص البيئية للإنشاء والتشغيل لجميع أنواع المنشآت."
  },
  licensingConstructionTitle: {
    en: "Environmental Construction Permit",
    ar: "التصريح البيئي للإنشاء"
  },
  licensingConstructionDesc: {
    en: "Following up on procedures to obtain environmental permits for new projects.",
    ar: "متابعة إجراءات الحصول على التصاريح البيئية للمشاريع الجديدة."
  },
  licensingOperationTitle: {
    en: "Environmental Operation Permit",
    ar: "التصريح البيئي للتشغيل"
  },
  licensingOperationDesc: {
    en: "Obtaining environmental operating licenses for existing facilities.",
    ar: "الحصول على تراخيص التشغيل البيئية للمنشآت القائمة."
  },
  licensingRenewalTitle: {
    en: "License Renewal",
    ar: "تجديد التراخيص"
  },
  licensingRenewalDesc: {
    en: "Following up on procedures for renewing expired environmental licenses.",
    ar: "متابعة إجراءات تجديد التراخيص البيئية المنتهية الصلاحية."
  },
  licensingDocumentationTitle: {
    en: "Required Documentation Preparation",
    ar: "إعداد الوثائق المطلوبة"
  },
  licensingDocumentationDesc: {
    en: "Preparing all required documents and studies for obtaining licenses.",
    ar: "تحضير جميع الوثائق والدراسات المطلوبة للحصول على التراخيص."
  },

  // Specialized Industries
  industriesHeadline: {
    en: "Specialized Industries",
    ar: "الصناعات المتخصصة"
  },
  industriesIntro: {
    en: "We specialize in providing environmental consulting for a wide range of industries and facilities",
    ar: "نحن متخصصون في تقديم الاستشارات البيئية لمجموعة واسعة من الصناعات والمنشآت"
  },

  // Process Section
  processHeadline: {
    en: "Our Methodology",
    ar: "منهجية العمل"
  },
  processStep1Title: {
    en: "Initial Consultation",
    ar: "الاستشارة الأولية"
  },
  processStep1Desc: {
    en: "Initial assessment of your needs and environmental project requirements",
    ar: "تقييم أولي لاحتياجاتكم ومتطلبات المشروع البيئية"
  },
  processStep2Title: {
    en: "Planning & Study",
    ar: "التخطيط والدراسة"
  },
  processStep2Desc: {
    en: "Detailed work plan preparation and comprehensive project study",
    ar: "إعداد خطة عمل مفصلة ودراسة شاملة للمشروع"
  },
  processStep3Title: {
    en: "Implementation & Follow-up",
    ar: "التنفيذ والمتابعة"
  },
  processStep3Desc: {
    en: "Implementation of environmental solutions with continuous monitoring",
    ar: "تنفيذ الحلول البيئية مع المراقبة المستمرة"
  },
  processStep4Title: {
    en: "Ongoing Support",
    ar: "الدعم المستمر"
  },
  processStep4Desc: {
    en: "Ongoing support and maintenance of environmental solutions for long-term success",
    ar: "دعم مستمر وصيانة للحلول البيئية لضمان النجاح طويل المدى"
  },

  // Partners
  partnersHeadline: {
    en: "Our Partners",
    ar: "شركاؤنا"
  },
  partnersIntro: {
    en: "We are proud of our partnerships with major companies in Saudi Arabia",
    ar: "نفخر بشراكتنا مع كبرى الشركات في المملكة العربية السعودية"
  },

  // Why Choose Us
  whyChooseHeadline: {
    en: "Why Choose Us",
    ar: "لماذا تختارنا"
  },

  // Call to Action
  ctaTitle: {
    en: "Ready to Get Started?",
    ar: "هل أنت مستعد للبدء؟"
  },
  ctaDesc: {
    en: "Contact our team of experts today to discuss your project requirements and discover how PMEC can help you achieve your goals through our comprehensive environmental consulting services.",
    ar: "تواصل مع فريق الخبراء لدينا اليوم لمناقشة متطلبات مشروعكم واكتشف كيف يمكن لـ PMEC مساعدتكم في تحقيق أهدافكم من خلال خدماتنا الاستشارية البيئية الشاملة."
  },
  ctaButton: {
    en: "Get Free Consultation",
    ar: "احصل على استشارة مجانية"
  },

  // Footer
  footerAboutText: {
    en: "PMEC is a leading company specialized in environmental consulting (Category A) in Saudi Arabia. We are committed to providing sustainable and innovative solutions to ensure our clients' compliance.",
    ar: "بيوت المعمار هي شركة رائدة متخصصة في الاستشارات البيئية (الفئات 1، 2، 3) في المملكة العربية السعودية. نلتزم بتقديم حلول مستدامة ومبتكرة لضمان امتثال عملائنا."
  },
  getInTouchTitle: {
    en: "Get In Touch",
    ar: "تواصل معنا"
  },
  addressText: {
    en: "Najd Road, Dhahrat Laban District, Riyadh, Saudi Arabia, RDLB 3846",
    ar: "طريق نجد، حي ظهرة لبن، الرياض، المملكة العربية السعودية، RDLB 3846"
  },
  phoneText: {
    en: "+966 55 1795 955",
    ar: "+966 55 1795 955"
  },
  phoneText2: {
    en: "+966 50 7299 951",
    ar: "+966 50 7299 951"
  },
  emailText: {
    en: "enviormentalconsultant@gmail.com",
    ar: "enviormentalconsultant@gmail.com"
  },
  websiteText: {
    en: "www.pmesc.net",
    ar: "www.pmesc.net"
  },
  popularLinkTitle: {
    en: "Quick Links",
    ar: "روابط سريعة"
  },
  footerHomeLink: {
    en: "Home",
    ar: "الرئيسية"
  },
  footerAboutLink: {
    en: "About Us",
    ar: "من نحن"
  },
  footerServicesLink: {
    en: "Our Services",
    ar: "خدماتنا"
  },
  footerContactLink: {
    en: "Contact Us",
    ar: "اتصل بنا"
  },
  ourServices: {
    en: "Our Environmental Services",
    ar: "خدماتنا البيئية"
  },
  footerEnvironmentalConsulting: {
    en: "Environmental Compliance (Category A)",
    ar: "الالتزام البيئي (الفئات 1، 2، 3)"
  },
  footerImpactAssessment: {
    en: "Environmental Impact Assessment",
    ar: "دراسة تقييم الأثر البيئي"
  },
  footerTestingAndAnalysis: {
    en: "Testing and Analysis",
    ar: "القياسات والتحاليل"
  },
  footerLicensingFollowUp: {
    en: "Environmental Permits Follow-up",
    ar: "متابعة التصاريح البيئية"
  },
  copyright: {
    en: "All Rights Reserved",
    ar: "جميع الحقوق محفوظة"
  },
  designedBy: {
    en: "Designed",
    ar: "تصميم"
  },
  currentYear: {
    en: "2025",
    ar: "2025"
  },

  // Specialized Industries Cards
  fuelStationsTitle: {
    en: "Fuel Stations",
    ar: "محطات الوقود"
  },
  fuelStationsDesc: {
    en: "Comprehensive environmental services for fuel stations and petroleum facilities",
    ar: "خدمات بيئية شاملة لمحطات الوقود والمحطات النفطية"
  },
  petrochemicalTitle: {
    en: "Petrochemical Plants",
    ar: "المصانع البتروكيميائية"
  },
  petrochemicalDesc: {
    en: "Specialized environmental consulting for the petrochemical industry",
    ar: "استشارات بيئية متخصصة لصناعة البتروكيماويات"
  },
  concreteFactoriesTitle: {
    en: "Concrete & Block Factories",
    ar: "مصانع الخرسانة والبلك"
  },
  concreteFactoriesDesc: {
    en: "Environmental solutions for building materials and construction factories",
    ar: "حلول بيئية لمصانع مواد البناء والإنشاءات"
  },
  quarriesTitle: {
    en: "Quarries & Mines",
    ar: "الكسارات والمحاجر"
  },
  quarriesDesc: {
    en: "Specialized environmental management for mining and quarrying operations",
    ar: "إدارة بيئية متخصصة لعمليات التعدين والكسارات"
  },
  fishFarmsTitle: {
    en: "Fish & Poultry Farms",
    ar: "مزارع الأسماك والدواجن"
  },
  fishFarmsDesc: {
    en: "Environmental consulting for farms and agricultural projects",
    ar: "استشارات بيئية للمزارع والمشاريع الزراعية"
  },
  hospitalsTitle: {
    en: "Hospitals & Medical Centers",
    ar: "المستشفيات والمراكز الطبية"
  },
  hospitalsDesc: {
    en: "Specialized environmental solutions for healthcare facilities",
    ar: "حلول بيئية متخصصة للمنشآت الصحية"
  },

  // Why Choose Us Features
  discountTitle: {
    en: "30% Discounts",
    ar: "تخفيضات 30%"
  },
  discountDesc: {
    en: "Special offers and discounts up to 30% on our services",
    ar: "عروض خاصة وتخفيضات تصل إلى 30% على خدماتنا"
  },
  accuracyTitle: {
    en: "Accurate Results",
    ar: "دقة في النتائج"
  },
  accuracyDesc: {
    en: "We guarantee the accuracy and reliability of all environmental measurements and studies",
    ar: "نضمن دقة وموثوقية جميع القياسات والدراسات البيئية"
  },
  professionalTeamTitle: {
    en: "Professional Consulting Team",
    ar: "فريق استشاري محترف"
  },
  professionalTeamDesc: {
    en: "A team of certified experts in the field of environmental consulting",
    ar: "فريق من الخبراء المعتمدين في مجال الاستشارات البيئية"
  },
  speedTitle: {
    en: "Fast Delivery",
    ar: "سرعة في الإنجاز"
  },
  speedDesc: {
    en: "Commitment to deadlines and speed in service delivery",
    ar: "التزام بالمواعيد المحددة وسرعة في تسليم الخدمات"
  }

};

document.getElementById("currentYear").textContent = new Date().getFullYear();
window.dispatchEvent(new Event("i18n:dict-ready"));
