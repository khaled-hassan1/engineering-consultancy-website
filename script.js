// Language Support
const translations = {
    en: {
        // Navigation
        company_name: "AlphaTech",
        nav_home: "Home",
        nav_about: "About", 
        nav_services: "Services",
        nav_contact: "Contact",
        
        // Hero Section
        hero_title: "Engineering Excellence for a Sustainable Future",
        hero_subtitle: "Leading consulting services in engineering, environmental solutions, and safety management for over 25 years.",
        hero_services_btn: "Our Services",
        hero_contact_btn: "Get Consultation",
        
        // Stats Section
        stats_years: "Years of Experience",
        stats_projects: "Completed Projects", 
        stats_clients: "Satisfied Clients",
        stats_countries: "Countries Served",
        
        // About Section
        about_title: "About AlphaTech Engineering",
        about_description: "Since 1998, AlphaTech Engineering has been at the forefront of innovative engineering solutions, environmental consulting, and safety management across the Middle East and beyond.",
        about_cert1: "ISO 9001 Certified",
        about_cert2: "OSHA Compliant", 
        about_cert3: "Environmental Excellence",
        about_cert4: "24/7 Support",
        
        // Services Section
        services_title: "Our Services",
        services_subtitle: "Comprehensive consulting solutions for complex engineering challenges",
        service1_title: "Engineering Consulting",
        service1_desc: "Structural, mechanical, and electrical engineering solutions for complex infrastructure projects.",
        service1_item1: "Structural Analysis",
        service1_item2: "MEP Design", 
        service1_item3: "Project Management",
        service1_list_title: "Our Engineering Services Include:",
        service1_item4: "Structural Design & Analysis",
        service1_item5: "Electrical Systems Design",
        service1_item6: "Mechanical Engineering",
        service1_item7: "Process Engineering",
        service1_item8: "Quality Assurance",
        service1_item9: "Technical Consulting",
        service2_title: "Environmental Solutions",
        service2_desc: "Sustainable environmental consulting and impact assessment for responsible development.",
        service2_item1: "Environmental Impact Assessment",
        service2_item2: "Waste Management",
        service2_item3: "Sustainability Planning",
        service2_list_title: "Environmental Services Include:",
        service2_item4: "Environmental Impact Studies",
        service2_item5: "Waste Management Solutions",
        service2_item6: "Water Quality Assessment",
        service2_item7: "Air Quality Monitoring",
        service2_item8: "Sustainability Consulting",
        service2_item9: "Environmental Auditing",
        service3_title: "Safety Management", 
        service3_desc: "Comprehensive safety protocols and risk management for industrial and construction environments.",
        service3_item1: "Risk Assessment",
        service3_item2: "Safety Training",
        service3_item3: "Compliance Audits",
        service3_list_title: "Safety Management Services:",
        service3_item4: "Risk Assessment & Analysis",
        service3_item5: "Safety Training Programs",
        service3_item6: "Compliance Auditing",
        service3_item7: "Safety Documentation",
        service3_item8: "Performance Monitoring",
        service3_item9: "Emergency Response Planning",
        
        // Contact Section
        contact_title: "Get In Touch",
        contact_subtitle: "Ready to discuss your project? Contact our experts today",
        contact_name: "Full Name",
        contact_email: "Email Address",
        contact_company: "Company",
        contact_service: "Service Interest",
        contact_message: "Message",
        contact_submit: "Send Message",
        contact_address_title: "Address",
        contact_address: "King Fahd Road, Business District\nRiyadh 11564, Saudi Arabia",
        contact_phone_title: "Phone",
        contact_email_title: "Email",
        service_select: "Select a service...",
        service_engineering: "Engineering Consulting",
        service_environmental: "Environmental Solutions",
        service_safety: "Safety Management",
        
        // Footer
        footer_description: "Leading the future of engineering, environmental, and safety consulting across the region.",
        footer_services: "Services",
        footer_company: "Company",
        footer_contact: "Contact Info",
        footer_copyright: "© 2025 AlphaTech Engineering. All rights reserved.",
        footer_privacy: "Privacy Policy",
        footer_terms: "Terms of Service"
    },
    ar: {
        // Navigation
        company_name: "ألفا تك",
        nav_home: "الرئيسية",
        nav_about: "من نحن",
        nav_services: "خدماتنا", 
        nav_contact: "اتصل بنا",
        
        // Hero Section
        hero_title: "التميز الهندسي من أجل مستقبل مستدام",
        hero_subtitle: "خدمات استشارية رائدة في الهندسة والحلول البيئية وإدارة السلامة لأكثر من 25 عاماً.",
        hero_services_btn: "خدماتنا",
        hero_contact_btn: "احصل على استشارة",
        
        // Stats Section
        stats_years: "سنوات من الخبرة",
        stats_projects: "مشروع مكتمل",
        stats_clients: "عميل راضٍ", 
        stats_countries: "دولة نخدمها",
        
        // About Section
        about_title: "حول ألفا تك للهندسة",
        about_description: "منذ عام 1998، كانت ألفا تك للهندسة في المقدمة في تقديم الحلول الهندسية المبتكرة والاستشارات البيئية وإدارة السلامة عبر الشرق الأوسط وما وراءه.",
        about_cert1: "معتمد ISO 9001",
        about_cert2: "متوافق مع OSHA",
        about_cert3: "التميز البيئي", 
        about_cert4: "دعم على مدار الساعة",
        
        // Services Section
        services_title: "خدماتنا",
        services_subtitle: "حلول استشارية شاملة للتحديات الهندسية المعقدة",
        service1_title: "الاستشارات الهندسية",
        service1_desc: "حلول هندسية إنشائية وميكانيكية وكهربائية لمشاريع البنية التحتية المعقدة.",
        service1_item1: "التحليل الإنشائي",
        service1_item2: "تصميم الأنظمة الميكانيكية والكهربائية",
        service1_item3: "إدارة المشاريع",
        service1_list_title: "خدماتنا الهندسية تشمل:",
        service1_item4: "التصميم والتحليل الإنشائي",
        service1_item5: "تصميم الأنظمة الكهربائية",
        service1_item6: "الهندسة الميكانيكية",
        service1_item7: "هندسة العمليات",
        service1_item8: "ضمان الجودة",
        service1_item9: "الاستشارات الفنية",
        service2_title: "الحلول البيئية",
        service2_desc: "استشارات بيئية مستدامة وتقييم الأثر البيئي للتنمية المسؤولة.",
        service2_item1: "تقييم الأثر البيئي",
        service2_item2: "إدارة النفايات",
        service2_item3: "تخطيط الاستدامة",
        service2_list_title: "الخدمات البيئية تشمل:",
        service2_item4: "دراسات الأثر البيئي",
        service2_item5: "حلول إدارة النفايات",
        service2_item6: "تقييم جودة المياه",
        service2_item7: "مراقبة جودة الهواء",
        service2_item8: "استشارات الاستدامة",
        service2_item9: "التدقيق البيئي",
        service3_title: "إدارة السلامة",
        service3_desc: "بروتوكولات سلامة شاملة وإدارة المخاطر للبيئات الصناعية والإنشائية.",
        service3_item1: "تقييم المخاطر",
        service3_item2: "التدريب على السلامة",
        service3_item3: "تدقيق الامتثال",
        service3_list_title: "خدمات إدارة السلامة:",
        service3_item4: "تقييم وتحليل المخاطر",
        service3_item5: "برامج التدريب على السلامة",
        service3_item6: "تدقيق الامتثال",
        service3_item7: "توثيق السلامة",
        service3_item8: "مراقبة الأداء",
        service3_item9: "تخطيط الاستجابة للطوارئ",
        
        // Contact Section
        contact_title: "تواصل معنا",
        contact_subtitle: "مستعد لمناقشة مشروعك؟ تواصل مع خبرائنا اليوم",
        contact_name: "الاسم الكامل",
        contact_email: "البريد الإلكتروني",
        contact_company: "الشركة",
        contact_service: "الخدمة المطلوبة",
        contact_message: "الرسالة", 
        contact_submit: "إرسال الرسالة",
        contact_address_title: "العنوان",
        contact_address: "طريق الملك فهد، الحي التجاري\nالرياض 11564، المملكة العربية السعودية",
        contact_phone_title: "الهاتف",
        contact_email_title: "البريد الإلكتروني",
        service_select: "اختر خدمة...",
        service_engineering: "الاستشارات الهندسية",
        service_environmental: "الحلول البيئية", 
        service_safety: "إدارة السلامة",
        
        // Footer
        footer_description: "نقود مستقبل الاستشارات الهندسية والبيئية والسلامة عبر المنطقة.",
        footer_services: "الخدمات",
        footer_company: "الشركة",
        footer_contact: "معلومات الاتصال",
        footer_copyright: "© 2025 ألفا تك للهندسة. جميع الحقوق محفوظة.",
        footer_privacy: "سياسة الخصوصية",
        footer_terms: "شروط الخدمة"
    }
};

let currentLanguage = 'en';

// Language Toggle Function
function toggleLanguage() {
    currentLanguage = currentLanguage === 'en' ? 'ar' : 'en';
    updateLanguage();
}

// Update Language Function
function updateLanguage() {
    const html = document.documentElement;
    const langToggle = document.getElementById('lang-toggle');
    
    // Update HTML attributes
    html.setAttribute('lang', currentLanguage);
    html.setAttribute('dir', currentLanguage === 'ar' ? 'rtl' : 'ltr');
    
    // Update language toggle button
    langToggle.textContent = currentLanguage === 'en' ? 'العربية' : 'English';
    
    // Update all translatable elements
    const elements = document.querySelectorAll('[data-key]');
    elements.forEach(element => {
        const key = element.getAttribute('data-key');
        if (translations[currentLanguage][key]) {
            element.textContent = translations[currentLanguage][key];
        }
    });
    
    // Update title
    document.title = currentLanguage === 'en' 
        ? 'AlphaTech Engineering - Professional Consulting Services'
        : 'ألفا تك للهندسة - خدمات استشارية محترفة';
}

// Smooth Scrolling for Navigation Links
document.addEventListener('DOMContentLoaded', function() {
    // Initialize language
    updateLanguage();
    
    // Smooth scrolling for anchor links
    const navLinks = document.querySelectorAll('a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const navbarHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = targetSection.offsetTop - navbarHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.classList.add('navbar-scrolled');
        } else {
            navbar.classList.remove('navbar-scrolled');
        }
        
        // Back to top button
        const backToTop = document.querySelector('.back-to-top');
        if (window.scrollY > 300) {
            backToTop?.classList.add('show');
        } else {
            backToTop?.classList.remove('show');
        }
    });
    
    // Contact form submission
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Simulate form submission
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="bi bi-arrow-clockwise spin me-2"></i>' + 
                (currentLanguage === 'en' ? 'Sending...' : 'جاري الإرسال...');
            
            setTimeout(() => {
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
                
                // Show success message
                alert(currentLanguage === 'en' 
                    ? 'Thank you! Your message has been sent successfully.' 
                    : 'شكراً لك! تم إرسال رسالتك بنجاح.');
                
                // Reset form
                contactForm.reset();
            }, 2000);
        });
    }
    
    // Add scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll('.service-card');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease';
        observer.observe(el);
    });
});

// Back to Top Button
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Counter Animation for Stats
function animateCounters() {
    const counters = document.querySelectorAll('.stat-item h3');
    
    counters.forEach(counter => {
        const target = parseInt(counter.textContent.replace('+', ''));
        let current = 0;
        const increment = target / 50;
        
        const updateCounter = () => {
            if (current < target) {
                current += increment;
                counter.textContent = Math.floor(current) + (target > 10 ? '+' : '');
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target + (target > 10 ? '+' : '');
            }
        };
        
        updateCounter();
    });
}

// Intersection Observer for Stats Animation
const statsObserver = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateCounters();
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

// Observe stats section
const statsSection = document.querySelector('.stats-section');
if (statsSection) {
    statsObserver.observe(statsSection);
}

// Add loading animation
window.addEventListener('load', function() {
    const loader = document.querySelector('.page-loader');
    if (loader) {
        loader.classList.add('fade-out');
        setTimeout(() => loader.remove(), 500);
    }
});

// Service card hover effects
document.addEventListener('DOMContentLoaded', function() {
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
});

// Add CSS for spinning animation
const style = document.createElement('style');
style.textContent = `
    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
    .spin {
        animation: spin 1s linear infinite;
    }
`;
document.head.appendChild(style);