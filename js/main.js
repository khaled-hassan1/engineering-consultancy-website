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
  var currentLanguage = localStorage.getItem("language") || "en";
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
    localStorage.setItem("language", currentLanguage);

    var isRTL = currentLanguage === "ar";
    document.documentElement.lang = isRTL ? "ar" : "en";
    document.documentElement.dir = isRTL ? "rtl" : "ltr";

    applyBootstrapDirection(isRTL);
    updateTexts();
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
    window.addEventListener("i18n:dict-ready", updateTexts);
  });

  // أمان إضافي بعد التحميل الكامل
  window.addEventListener("load", updateTexts);
})(jQuery);
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
    emailText: { en: "info@pmesc.net", ar: "info@pmesc.net" },
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

    // Contact Info
    getInTouch: { en: "Get In Touch", ar: "تواصل معنا" },
    address: {
      en: "Najd Road, Dhahrat Laban District, Riyadh, Saudi Arabia, RDLB 3846",
      ar: "طريق نجد، حي ظهرة لبن، الرياض، المملكة العربية السعودية، 3846"
    },
    phone: { en: "+966 55 1795 955", ar: "+966 55 1795 955" },
    email: { en: "info@pmesc.net", ar: "info@pmesc.net" },

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
    emailFooter: { en: "info@pmesc.net", ar: "info@pmesc.net" }};

document.getElementById("currentYear").textContent = new Date().getFullYear();
window.dispatchEvent(new Event("i18n:dict-ready"));
