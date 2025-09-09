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
    aboutNav: { en: "About Us", ar: "عن الشركة" },
    servicesNav: { en: "Services", ar: "الخدمات" },
    projectsNav: { en: "Projects", ar: "المشاريع" },
    otherPagesNav: { en: "Other Pages", ar: "صفحات أخرى" },
    featuresNav: { en: "Features", ar: "المميزات" },
    teamNav: { en: "Our Team", ar: "فريق العمل" },
    testimonialsNav: { en: "Testimonials", ar: "آراء العملاء" },
    error404Nav: { en: "404 Page", ar: "صفحة خطأ 404" },
    contactNav: { en: "Contact Us", ar: "اتصل بنا" },

    // Spinner
    loading: { en: "Loading...", ar: "جاري التحميل..." },

};

  let currentLanguage = localStorage.getItem("language") || "ar";

  function updateLanguage() {
    for (const id in elementsToTranslate) {
      const element = document.getElementById(id);
      if (element) {
        element.textContent = elementsToTranslate[id][currentLanguage];
      }
    }

    // تحديث لغة الصفحة واتجاه النص
    document.documentElement.lang = currentLanguage === "en" ? "en" : "ar";
    // document.style.direction = currentLanguage === "en" ? "ltr" : "rtl";
    document.body.style.textAlign = currentLanguage === "en" ? "left" : "right";
    if (languageButton) {
      languageButton.textContent =
        elementsToTranslate["languageButton"][currentLanguage];
    }
  }

  languageButton.addEventListener("click", function () {
    currentLanguage = currentLanguage === "en" ? "ar" : "en";
    localStorage.setItem("language", currentLanguage);
    updateLanguage();
    console.log(localStorage.getItem("language"));
  });

  updateLanguage(); // تطبيق اللغة المختارة عند تحميل الصفحة
});

document.addEventListener("DOMContentLoaded", function () {
  const footerAboutDiv = document.querySelector(".footer-about");

  function isArabic() {
    const htmlElement = document.querySelector("html");
    return htmlElement.getAttribute("lang") === "ar";
    // يمكنك استخدام طريقة أخرى للتحقق من اللغة إذا لزم الأمر
    // return document.body.classList.contains('rtl');
  }

  if (footerAboutDiv) {
    if (isArabic()) {
      footerAboutDiv.classList.remove("text-md-start");
      footerAboutDiv.classList.add("text-md-end");
    } else {
      footerAboutDiv.classList.remove("text-md-end");
      footerAboutDiv.classList.add("text-md-start");
    }
  }
});

document.getElementById("currentYear").textContent = new Date().getFullYear();
