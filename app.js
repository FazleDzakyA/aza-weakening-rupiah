/* ==========================================================================
   APPLICATION LOGIC: RUPIAH & REFORMASI (PORTAL INTERAKTIF)
   Author: Azalia Fitriani
   Features: Scroll Observer, Chart.js Data Mapping, Mobile Nav Drawer, Simulator
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // 1. RESPONSIVE NAVIGATION DRAWER
    // ==========================================
    const menuToggle = document.getElementById('menu-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navOverlay = document.getElementById('nav-overlay');
    const navLinks = document.querySelectorAll('.nav-link');

    const toggleMenu = () => {
        menuToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        navOverlay.classList.toggle('active');
        document.body.classList.toggle('no-scroll');
    };

    const closeMenu = () => {
        menuToggle.classList.remove('active');
        navMenu.classList.remove('active');
        navOverlay.classList.remove('active');
        document.body.classList.remove('no-scroll');
    };

    menuToggle.addEventListener('click', toggleMenu);
    navOverlay.addEventListener('click', closeMenu);

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            closeMenu();
            // Update active state
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        });
    });

    // ==========================================
    // 2. NAVBAR SCROLL EFFECT
    // ==========================================
    const navbar = document.getElementById('navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // ==========================================
    // 3. SCROLL REVEAL (INTERSECTION OBSERVER)
    // ==========================================
    const revealElements = document.querySelectorAll('.scroll-reveal');
    
    const revealOnScroll = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target); // Stop observing once revealed
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => {
        revealOnScroll.observe(el);
    });

    // ==========================================
    // 4. CHART.JS: INTERACTIVE DATA GRAPH
    // ==========================================
    const ctx = document.getElementById('rupiahChart').getContext('2d');
    
    // Historical Exchange Rate Data (1998 - 2026)
    const years = [
        '1998 (Krismon)', '1999 (BJ Habibie)', '2001 (Gus Dur)', '2003 (Megawati)', 
        '2005 (SBY Awal)', '2008 (Krisis Global)', '2011 (SBY Emas)', '2013 (Taper Tantrum)', 
        '2015 (Jokowi Awal)', '2018 (Kenaikan Fed)', '2020 (Covid-19)', '2022 (Pasca-Pandemi)', 
        '2024 (Pemilu)', '2025 (Global Tariff)', 'Mei 2026 (Rekor Terendah)'
    ];
    
    const rates = [16600, 6500, 9500, 8400, 9800, 12000, 9000, 12200, 13800, 15200, 16500, 15600, 15800, 16800, 17706];
    
    // Color thresholds for line styling (Green for strong, Gold for transition, Red for peak weakening)
    const getPointColors = () => {
        return rates.map(rate => {
            if (rate <= 9500) return '#00f5a0'; // Emerald Green
            if (rate <= 14000) return '#f5af19'; // Gold
            return '#ff3366'; // Crimson Red
        });
    };

    // Create Gradient Fill
    const chartGradient = ctx.createLinearGradient(0, 0, 0, 400);
    chartGradient.addColorStop(0, 'rgba(255, 51, 102, 0.25)');
    chartGradient.addColorStop(0.5, 'rgba(245, 175, 25, 0.15)');
    chartGradient.addColorStop(1, 'rgba(0, 245, 160, 0.01)');

    const rupiahChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: years,
            datasets: [{
                label: 'Nilai Kurs Rupiah per 1 USD',
                data: rates,
                borderColor: '#00f5a0',
                borderWidth: 3,
                pointBackgroundColor: getPointColors(),
                pointBorderColor: 'rgba(255,255,255,0.7)',
                pointBorderWidth: 1.5,
                pointRadius: 6,
                pointHoverRadius: 9,
                fill: true,
                backgroundColor: chartGradient,
                tension: 0.35
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false // We use our custom legend
                },
                tooltip: {
                    backgroundColor: '#161e31',
                    titleFont: {
                        family: 'Plus Jakarta Sans',
                        size: 14,
                        weight: 'bold'
                    },
                    bodyFont: {
                        family: 'Plus Jakarta Sans',
                        size: 13
                    },
                    padding: 14,
                    borderColor: 'rgba(255, 255, 255, 0.08)',
                    borderWidth: 1,
                    cornerRadius: 12,
                    displayColors: false,
                    callbacks: {
                        label: function(context) {
                            let value = context.parsed.y;
                            let formattedValue = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value);
                            return `Kurs: ${formattedValue}`;
                        },
                        afterLabel: function(context) {
                            const index = context.dataIndex;
                            const notes = [
                                'Puncak Krisis Moneter 1997/1998, kejatuhan rezim Soeharto.',
                                'Stabilisasi hebat BJ Habibie dan UU Independensi Bank Indonesia.',
                                'Transisi kepemimpinan nasional Gus Dur ke Megawati.',
                                'Pengakhiran kerja sama bantuan IMF secara resmi.',
                                'Awal pertumbuhan stabil dan reorganisasi moneter.',
                                'Hantaman hebat Krisis Finansial Global Subprime Mortgage.',
                                'Periode Commodity Boom, ekspor tinggi menstabilkan kurs.',
                                'Penarikan stimulus likuiditas global oleh The Fed (AS).',
                                'Tekanan arus modal global & perlambatan ekonomi China.',
                                'Dampak perang dagang AS-China & kenaikan suku bunga Fed.',
                                'Pandemi Covid-19 mengguncang stabilitas pasar keuangan dunia.',
                                'Fase pemulihan pasca-pandemi dan intervensi BI.',
                                'Transisi politik pemilu dan persiapan pemerintahan baru.',
                                'Sentimen kebijakan tarif global & defisit APBN jangka pendek.',
                                'Tekanan geopolitik Timur Tengah, suku bunga AS tinggi & MSCI rebalancing.'
                            ];
                            return '\nPeristiwa Utama:\n' + notes[index];
                        }
                    }
                }
            },
            scales: {
                y: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.05)',
                        drawBorder: false
                    },
                    ticks: {
                        color: '#94a3b8',
                        font: {
                            family: 'Plus Jakarta Sans',
                            size: 11
                        },
                        callback: function(value) {
                            return 'Rp ' + value.toLocaleString('id-ID');
                        }
                    }
                },
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: '#94a3b8',
                        font: {
                            family: 'Plus Jakarta Sans',
                            size: 11
                        },
                        maxRotation: 45,
                        minRotation: 45
                    }
                }
            }
        }
    });

    // ==========================================
    // 5. INTERACTIVE EXCHANGE RATE SIMULATOR
    // ==========================================
    const presetProduct = document.getElementById('preset-product');
    const customAmountGroup = document.getElementById('custom-amount-group');
    const customUsd = document.getElementById('custom-usd');
    
    const eraCards = document.querySelectorAll('.era-checkbox-card');
    const btnCalculate = document.getElementById('btn-calculate');
    
    const resultPlaceholder = document.getElementById('result-placeholder');
    const resultDetails = document.getElementById('result-details');
    
    const resUsdVal = document.getElementById('res-usd-val');
    
    const resEraAName = document.getElementById('res-era-a-name');
    const resEraAIDR = document.getElementById('res-era-a-idr');
    
    const resEraBName = document.getElementById('res-era-b-name');
    const resEraBIDR = document.getElementById('res-era-b-idr');
    
    const resSelisihPersen = document.getElementById('res-selisih-persen');
    const resSelisihIDR = document.getElementById('res-selisih-idr');

    // Mapped rates for comparison card
    const eraRates = {
        habibie: { name: 'Era Habibie (Terkuat 1999)', rate: 6500 },
        sby: { name: 'Era SBY (Stabil 2008)', rate: 9000 },
        jokowi: { name: 'Era Jokowi (Covid-19 2020)', rate: 14800 },
        prabowo: { name: 'Era Prabowo (Terbaru Mei 2026)', rate: 17706 }
    };

    // Toggle custom amount field
    presetProduct.addEventListener('change', () => {
        if (presetProduct.value === 'custom') {
            customAmountGroup.style.display = 'block';
        } else {
            customAmountGroup.style.display = 'none';
        }
    });

    // Toggle active state for era checkbox selection
    eraCards.forEach(card => {
        card.addEventListener('click', () => {
            const era = card.getAttribute('data-era');
            
            // Allow selecting two eras to compare
            const activeCards = document.querySelectorAll('.era-checkbox-card.active');
            
            if (card.classList.contains('active')) {
                // Keep active if it's one of only two, but don't allow 0 active cards
                if (activeCards.length > 1) {
                    card.classList.remove('active');
                }
            } else {
                if (activeCards.length >= 2) {
                    // Remove first active card to make room
                    activeCards[0].classList.remove('active');
                }
                card.classList.add('active');
            }
        });
    });

    // Handle simulator calculation with rich micro-animations
    btnCalculate.addEventListener('click', () => {
        // Fetch usd amount
        let usdVal = 0;
        if (presetProduct.value === 'custom') {
            usdVal = parseFloat(customUsd.value) || 0;
        } else {
            usdVal = parseFloat(presetProduct.value);
        }

        if (usdVal <= 0) {
            alert('Silakan masukkan nominal Dolar AS yang valid.');
            return;
        }

        // Get selected eras
        const activeCards = document.querySelectorAll('.era-checkbox-card.active');
        if (activeCards.length < 2) {
            alert('Pilih 2 Era untuk dibandingkan (misalnya Habibie dan Prabowo).');
            return;
        }

        // Identify Era A (Lower Rate) vs Era B (Higher Rate)
        const eraAKey = activeCards[0].getAttribute('data-era');
        const eraBKey = activeCards[1].getAttribute('data-era');
        
        let eraAData = eraRates[eraAKey];
        let eraBData = eraRates[eraBKey];

        // Ensure Era A has the lower rate for logical comparison (inflation progression)
        if (eraAData.rate > eraBData.rate) {
            let temp = eraAData;
            eraAData = eraBData;
            eraBData = temp;
        }

        // Do calculation math
        const idrAVal = usdVal * eraAData.rate;
        const idrBVal = usdVal * eraBData.rate;
        const selisihIDR = idrBVal - idrAVal;
        const selisihPersen = ((eraBData.rate - eraAData.rate) / eraAData.rate) * 100;

        // Smooth output rendering
        resultPlaceholder.style.display = 'none';
        resultDetails.style.display = 'block';

        // Animate numbers
        resUsdVal.textContent = usdVal.toLocaleString('id-ID');
        resEraAName.textContent = eraAData.name;
        resEraBName.textContent = eraBData.name;
        
        animateNumber(resEraAIDR, 0, idrAVal, 'Rp ');
        animateNumber(resEraBIDR, 0, idrBVal, 'Rp ');
        animateNumber(resSelisihIDR, 0, selisihIDR, 'Rp ');
        
        resSelisihPersen.textContent = selisihPersen.toFixed(1) + '%';
    });

    // Helper function for smooth counting number animation
    const animateNumber = (element, start, end, prefix = '') => {
        let current = start;
        const duration = 800; // ms
        const steps = 40;
        const increment = (end - start) / steps;
        const stepTime = duration / steps;
        
        const timer = setInterval(() => {
            current += increment;
            if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
                clearInterval(timer);
                current = end;
            }
            element.textContent = prefix + Math.round(current).toLocaleString('id-ID');
        }, stepTime);
    };

    // ==========================================
    // 6. SCROLL HIGHLIGHT ACTIVE NAVIGATION LINK
    // ==========================================
    const sections = document.querySelectorAll('section');

    const handleScrollHighlight = () => {
        let scrollPosition = window.scrollY + 120; // offset for nav height

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    };

    window.addEventListener('scroll', handleScrollHighlight);

    // Initial Trigger for calculations so it doesn't look blank
    btnCalculate.click();

});
