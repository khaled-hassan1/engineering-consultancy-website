(function ($) {
  "use strict";

  // Spinner
  var spinner = function () {
    setTimeout(function () {
      if ($('#spinner').length > 0) {
        $('#spinner').removeClass('show');
      }
    }, 1);
  };
  spinner();


  // Initiate the wowjs
  new WOW().init();


  // Sticky Navbar
  $(window).scroll(function () {
    if ($(this).scrollTop() > 300) {
      $('.sticky-top').addClass('bg-white shadow-sm').css('top', '0px');
    } else {
      $('.sticky-top').removeClass('bg-white shadow-sm').css('top', '-150px');
    }
  });


  // Back to top button
  $(window).scroll(function () {
    if ($(this).scrollTop() > 100) {
      $('.back-to-top').fadeIn('slow');
    } else {
      $('.back-to-top').fadeOut('slow');
    }
  });
  $('.back-to-top').click(function () {
    $('html, body').animate({ scrollTop: 0 }, 1500, 'easeInOutExpo');
    return false;
  });


  // Header carousel
  $(".header-carousel").owlCarousel({
    autoplay: true,
    smartSpeed: 1000,
    loop: true,
    dots: true,
    items: 1
  });


  // Testimonials carousel
  $(".testimonial-carousel").owlCarousel({
    items: 1,
    autoplay: true,
    smartSpeed: 1000,
    animateIn: 'fadeIn',
    animateOut: 'fadeOut',
    dots: true,
    loop: true,
    nav: false
  });

})(jQuery);


document.addEventListener("DOMContentLoaded", function () {
  const languageButton = document.getElementById("languageButton");
  const elementsToTranslate = {
    // Navigation
    homeNav: { en: "Home", ar: "الرئيسية" },
    aboutNav: { en: "About", ar: "عن الشركة" },
    servicesNav: { en: "Services", ar: "الخدمات" },
    projectsNav: { en: "Projects", ar: "المشاريع" },
    pagesNav: { en: "Pages", ar: "الصفحات" },
    featuresNav: { en: "Features", ar: "المميزات" },
    teamNav: { en: "Our Team", ar: "فريقنا" },
    testimonialsNav: { en: "Testimonial", ar: "آراء العملاء" },
    error404Nav: { en: "404 Page", ar: "صفحة 404" },
    contactNav: { en: "Contact", ar: "اتصل بنا" },
    languageButton: { en: "العربية", ar: "English" },

    // Hero Section
    heroTitle: { en: "Building a <span class='text-primary'>Safer, Smarter</span> World", ar: "بناء عالم <span class='text-primary'>أكثر أماناً وذكاءً</span>" },
    heroSubtitle: { en: "A Leader in Engineering and Consulting Since 1990", ar: "رائدون في الهندسة والاستشارات منذ 1990" },

    // Services
    structuralEngineering: { en: "Structural Engineering", ar: "الهندسة الإنشائية" },
    environmentalSolutions: { en: "Environmental Solutions", ar: "الحلول البيئية" },
    expertConsultants: { en: "Expert Consultants", ar: "استشاريون خبراء" },
    costEffectiveSolutions: { en: "Cost-Effective Solutions", ar: "حلول فعالة التكلفة" },

    // About Section
    historyTitle: { en: "<span class='text-uppercase text-primary bg-light px-2'>History</span> of Our Excellence", ar: "<span class='text-uppercase text-primary bg-light px-2'>تاريخ</span> تميزنا" },
    aboutDescription1: { en: "With decades of experience, we provide a wide range of engineering, environmental, security, and safety consulting services. Our team of experts is dedicated to delivering innovative and sustainable solutions for our clients.", ar: "مع عقود من الخبرة، نقدم مجموعة واسعة من خدمات الاستشارات الهندسية والبيئية والأمنية والسلامة. فريق خبرائنا مكرس لتقديم حلول مبتكرة ومستدامة لعملائنا." },
    aboutDescription2: { en: "We are committed to helping organizations achieve their goals by mitigating risks, improving efficiency, and ensuring compliance with the highest standards.", ar: "نحن ملتزمون بمساعدة المؤسسات على تحقيق أهدافها من خلال تخفيف المخاطر وتحسين الكفاءة وضمان الامتثال لأعلى المعايير." },

    // Why Choose Us
    whyChooseTitle: { en: "Why <span class='text-uppercase text-primary bg-light px-2'>Choose Us</span>", ar: "لماذا <span class='text-uppercase text-primary bg-light px-2'>تختارنا</span>" },
    experience25Years: { en: "25+ Years Experience", ar: "خبرة أكثر من 25 عاماً" },
    experienceDesc: { en: "Our extensive history of successful projects demonstrates our commitment to delivering high-quality, reliable solutions.", ar: "تاريخنا الطويل من المشاريع الناجحة يظهر التزامنا بتقديم حلول عالية الجودة وموثوقة." },
    integratedSolutions: { en: "Integrated Solutions", ar: "حلول متكاملة" },
    integratedDesc: { en: "We offer a holistic approach, combining engineering, environmental, security, and safety to provide comprehensive and effective solutions.", ar: "نقدم نهجاً شاملاً، يجمع بين الهندسة والبيئة والأمن والسلامة لتوفير حلول شاملة وفعالة." },
    skilledEngineers: { en: "Skilled Engineers & Analysts", ar: "مهندسون ومحللون مهرة" },
    skilledDesc: { en: "Our team consists of certified professionals with deep expertise in their respective fields, ensuring top-tier service.", ar: "يتكون فريقنا من محترفين معتمدين ذوي خبرة عميقة في مجالاتهم، مما يضمن خدمة من الدرجة الأولى." },
    clientSatisfaction: { en: "Client Satisfaction", ar: "رضا العملاء" },
    clientDesc: { en: "Our priority is to understand and meet the unique needs of each client, building long-term partnerships based on trust and results.", ar: "أولويتنا هي فهم وتلبية الاحتياجات الفريدة لكل عميل، وبناء شراكات طويلة الأمد قائمة على الثقة والنتائج." },
    strategicCostEffective: { en: "Strategic & Cost-Effective", ar: "استراتيجي وفعال التكلفة" },
    strategicDesc: { en: "We provide smart, efficient strategies that maximize value and minimize costs without compromising on quality or safety.", ar: "نقدم استراتيجيات ذكية وفعالة تزيد من القيمة وتقلل التكاليف دون المساس بالجودة أو السلامة." },
    sustainableSafe: { en: "Sustainable & Safe Solutions", ar: "حلول مستدامة وآمنة" },
    sustainableDesc: { en: "We are dedicated to creating solutions that not only solve current challenges but also promote a sustainable and secure future.", ar: "نحن مكرسون لإنشاء حلول لا تحل التحديات الحالية فحسب، بل تعزز أيضاً مستقبلاً مستداماً وآمناً." },

    // Projects Section
    latestProjectsTitle: { en: "Our Latest <span class='text-uppercase text-primary bg-light px-2'>Projects</span>", ar: "أحدث <span class='text-uppercase text-primary bg-light px-2'>مشاريعنا</span>" },
    latestProjectsCount: { en: "6 of our latest projects", ar: "6 من أحدث مشاريعنا" },
    structural: { en: "Structural", ar: "إنشائي" },
    environmental: { en: "Environmental", ar: "بيئي" },
    security: { en: "Security", ar: "أمني" },
    safety: { en: "Safety", ar: "سلامة" },
    planning: { en: "Planning", ar: "تخطيط" },
    analysis: { en: "Analysis", ar: "تحليل" },

    // Services Section
    professionalServicesTitle: { en: "Our Professional <span class='text-uppercase text-primary bg-light px-2'>Services</span>", ar: "خدماتنا <span class='text-uppercase text-primary bg-light px-2'>المهنية</span>" },
    servicesDescription1: { en: "We are a leading consulting firm specializing in engineering, environmental, security, and safety solutions. Our diverse team provides expert guidance to help you navigate complex challenges and achieve your business objectives.", ar: "نحن شركة استشارية رائدة متخصصة في الحلول الهندسية والبيئية والأمنية وحلول السلامة. فريقنا المتنوع يقدم إرشادات خبيرة لمساعدتك في التنقل عبر التحديات المعقدة وتحقيق أهدافك التجارية." },
    servicesDescription2: { en: "We are dedicated to providing the highest level of service, leveraging our extensive experience and innovative approach to deliver tailored solutions that meet your specific needs.", ar: "نحن مكرسون لتقديم أعلى مستوى من الخدمة، مستفيدين من خبرتنا الواسعة ونهجنا المبتكر لتقديم حلول مخصصة تلبي احتياجاتك المحددة." },
    callDirect: { en: "Call us direct 24/7 for a free consultation", ar: "اتصل بنا مباشرة على مدار الساعة للحصول على استشارة مجانية" },

    engineeringSolutions: { en: "Engineering Solutions", ar: "الحلول الهندسية" },
    engineeringDesc: { en: "Expert structural, civil, and mechanical engineering for robust and reliable project outcomes.", ar: "هندسة إنشائية ومدنية وميكانيكية خبيرة لنتائج مشاريع قوية وموثوقة." },
    environmentalConsulting: { en: "Environmental Consulting", ar: "الاستشارات البيئية" },
    environmentalDesc: { en: "Providing sustainable solutions for resource management, compliance, and impact assessments.", ar: "تقديم حلول مستدامة لإدارة الموارد والامتثال وتقييمات الأثر." },
    safetyManagement: { en: "Safety Management", ar: "إدارة السلامة" },
    safetyDesc: { en: "Comprehensive risk analysis, safety planning, and training to create a secure work environment.", ar: "تحليل شامل للمخاطر وتخطيط السلامة والتدريب لإنشاء بيئة عمل آمنة." },
    securitySystems: { en: "Security Systems", ar: "أنظمة الأمان" },
    securityDesc: { en: "Designing and implementing advanced security infrastructure to protect assets and personnel.", ar: "تصميم وتنفيذ بنية تحتية أمنية متقدمة لحماية الأصول والموظفين." },

    // Team Section
    professionalConsultants: { en: "Our Professional <span class='text-uppercase text-primary bg-light px-2'>Consultants</span>", ar: "استشاريونا <span class='text-uppercase text-primary bg-light px-2'>المحترفون</span>" },
    engineer: { en: "Engineer", ar: "مهندس" },

    // Testimonials
    outstandingSafety: { en: "Outstanding Safety Management", ar: "إدارة سلامة متميزة" },
    testimonial1: { en: "PMEC provided an exceptional safety plan for our project. Their expertise and attention to detail ensured our team operated in a secure and compliant environment. Highly recommended.", ar: "قدمت PMEC خطة سلامة استثنائية لمشروعنا. خبرتهم واهتمامهم بالتفاصيل ضمن عمل فريقنا في بيئة آمنة ومتوافقة. أنصح بهم بشدة." },
    customerSatisfaction: { en: "Customer Satisfaction", ar: "رضا العملاء" },
    testimonial2: { en: "The team at PMEC was incredibly responsive and knowledgeable. They guided us through every step of the process, and we couldn't be happier with the results.", ar: "كان فريق PMEC سريع الاستجابة وذو معرفة واسعة. لقد أرشدونا خلال كل خطوة من العملية، ولا يمكن أن نكون أكثر سعادة بالنتائج." },
    excellentSecurity: { en: "Excellent Security Solutions", ar: "حلول أمنية ممتازة" },
    testimonial3: { en: "PMEC designed and implemented a comprehensive security system for our facility. Their approach was strategic and effective, providing us with peace of mind.", ar: "صممت PMEC ونفذت نظام أمان شامل لمنشأتنا. كان نهجهم استراتيجياً وفعالاً، مما وفر لنا راحة البال." },

    // Newsletter
    subscribeNewsletter: { en: "Subscribe the <span class='text-uppercase text-primary bg-white px-2'>Newsletter</span>", ar: "اشترك في <span class='text-uppercase text-primary bg-white px-2'>النشرة الإخبارية</span>" },
    enterEmail: { en: "Enter Your Email", ar: "أدخل بريدك الإلكتروني" },
    newsletterDesc: { en: "Stay informed with the latest industry insights and news from our team.", ar: "ابق على اطلاع بأحدث رؤى الصناعة والأخبار من فريقنا." },

    // Footer
    getInTouch: { en: "Get In Touch", ar: "تواصل معنا" },
    popularLink: { en: "Popular Link", ar: "روابط مهمة" },
    ourServices: { en: "Our Services", ar: "خدماتنا" },
    aboutUs: { en: "About Us", ar: "عن الشركة" },
    contactUs: { en: "Contact Us", ar: "اتصل بنا" },
    privacyPolicy: { en: "Privacy Policy", ar: "سياسة الخصوصية" },
    termsCondition: { en: "Terms & Condition", ar: "الشروط والأحكام" },
    career: { en: "Career", ar: "الوظائف" },
    engineeringSolutionsFooter: { en: "Engineering Solutions", ar: "الحلول الهندسية" },
    environmentalPlanning: { en: "Environmental Planning", ar: "التخطيط البيئي" },
    safetyManagementFooter: { en: "Safety Management", ar: "إدارة السلامة" },
    securitySystemsFooter: { en: "Security Systems", ar: "أنظمة الأمان" },
    riskAnalysis: { en: "Risk Analysis", ar: "تحليل المخاطر" },
    allRightsReserved: { en: "All Right Reserved", ar: "جميع الحقوق محفوظة" },
    home: { en: "Home", ar: "الرئيسية" },
    cookies: { en: "Cookies", ar: "ملفات تعريف الارتباط" },
    help: { en: "Help", ar: "المساعدة" },
    faqs: { en: "FAQs", ar: "الأسئلة الشائعة" },

    // Company Description
    companyDesc: { en: "PMEC is a leading consulting firm providing engineering, environmental, security, and safety solutions to clients worldwide. We are dedicated to excellence and innovation in all our projects.", ar: "PMEC هي شركة استشارية رائدة تقدم حلول الهندسة والبيئة والأمن والسلامة للعملاء في جميع أنحاء العالم. نحن مكرسون للتميز والابتكار في جميع مشاريعنا." },

    // Awards and Features
    awardWinning: { en: "Award Winning", ar: "حائزة على جوائز" },
    professionalStaff: { en: "Professional Staff", ar: "طاقم محترف" },
    support247: { en: "24/7 Support", ar: "دعم على مدار الساعة" },
    fairPrices: { en: "Fair Prices", ar: "أسعار عادلة" },
    readMore: { en: "Read More", ar: "اقرأ المزيد" },
    awardWinningFirm: { en: "Award Winning Firm Since 1990", ar: "شركة حائزة على جوائز منذ 1990" }
  };

  let currentLanguage = localStorage.getItem("language") || "ar";

  function updateLanguage() {
    const isArabic = currentLanguage === "ar";
    
    // Update document direction and language
    document.documentElement.lang = isArabic ? "ar" : "en";
    document.documentElement.dir = isArabic ? "rtl" : "ltr";
    document.body.classList.toggle("rtl", isArabic);
    
    // Update text content for all elements
    for (const id in elementsToTranslate) {
      const element = document.getElementById(id);
      if (element) {
        if (elementsToTranslate[id][currentLanguage].includes('<span')) {
          element.innerHTML = elementsToTranslate[id][currentLanguage];
        } else {
          element.textContent = elementsToTranslate[id][currentLanguage];
        }
      }
    }

    // Update language button
    if (languageButton) {
      languageButton.textContent = elementsToTranslate["languageButton"][currentLanguage];
    }

    // Update Bootstrap classes for RTL support
    updateBootstrapRTL(isArabic);
  }

  function updateBootstrapRTL(isArabic) {
    // Update text alignment classes
    const textStartElements = document.querySelectorAll('.text-start, .text-md-start, .text-lg-start');
    const textEndElements = document.querySelectorAll('.text-end, .text-md-end, .text-lg-end');
    
    if (isArabic) {
      textStartElements.forEach(el => {
        el.classList.remove('text-start', 'text-md-start', 'text-lg-start');
        el.classList.add('text-end', 'text-md-end', 'text-lg-end');
      });
    } else {
      textEndElements.forEach(el => {
        el.classList.remove('text-end', 'text-md-end', 'text-lg-end');
        el.classList.add('text-start', 'text-md-start', 'text-lg-start');
      });
    }

    // Update margin and padding classes for RTL
    const elementsWithMargin = document.querySelectorAll('[class*="me-"], [class*="ms-"], [class*="pe-"], [class*="ps-"]');
    elementsWithMargin.forEach(el => {
      const classes = el.className.split(' ');
      const newClasses = classes.map(cls => {
        if (isArabic) {
          if (cls.includes('me-')) return cls.replace('me-', 'ms-');
          if (cls.includes('ms-')) return cls.replace('ms-', 'me-');
          if (cls.includes('pe-')) return cls.replace('pe-', 'ps-');
          if (cls.includes('ps-')) return cls.replace('ps-', 'pe-');
        }
        return cls;
      });
      el.className = newClasses.join(' ');
    });
  }

  if (languageButton) {
    languageButton.addEventListener("click", function () {
      currentLanguage = currentLanguage === "en" ? "ar" : "en";
      localStorage.setItem("language", currentLanguage);
      updateLanguage();
    });
  }

  updateLanguage();
});

