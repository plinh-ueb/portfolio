document.addEventListener("DOMContentLoaded", () => {
    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

    const wrapper = document.getElementById("wrapper");
    const panels = gsap.utils.toArray(".panel");
    
    // Total horizontal scroll distance
    // If there are N panels, we need to shift by -(N - 1) * 100vw
    const totalScroll = 100 * (panels.length - 1);

    let scrollTween = gsap.to(panels, {
        xPercent: -totalScroll,
        ease: "none",
        scrollTrigger: {
            trigger: wrapper,
            pin: true,
            scrub: 1,
            // Precise snapping to each panel
            snap: {
                snapTo: 1 / (panels.length - 1),
                duration: { min: 0.2, max: 0.6 },
                ease: "power1.inOut",
                directional: false // Snaps to closest instead of direction-based
            },
            // The scroll length determines how long the user has to scroll vertically
            end: () => "+=" + (window.innerWidth * (panels.length - 1)),
            onUpdate: (self) => {
                const progress = self.progress;
                const currentIndex = Math.round(progress * (panels.length - 1));
                
                // Select navbar items
                const navIntro = document.querySelector('.nav-item[data-target="0"]');
                const navJourney = document.querySelector('.nav-item[data-target="2"]');
                const navSummary = document.querySelector('.nav-item[data-target="8"]');
                
                if (navIntro && navJourney && navSummary) {
                    // Remove active from all first
                    [navIntro, navJourney, navSummary].forEach(btn => btn.classList.remove('active'));
                    
                    // Highlight based on current index
                    if (currentIndex <= 1) {
                        navIntro.classList.add('active');
                    } else if (currentIndex >= 2 && currentIndex <= 7) {
                        navJourney.classList.add('active');
                    } else if (currentIndex === 8) {
                        navSummary.classList.add('active');
                    }
                }
            }
        }
    });

    // Animate content inside panels when they come into view
    panels.forEach((panel, i) => {
        // Find elements to animate inside this panel
        const box = panel.querySelector(".content-box");
        if(box) {
            gsap.from(box, {
                opacity: 0,
                y: 30,
                duration: 1,
                scrollTrigger: {
                    trigger: panel,
                    containerAnimation: scrollTween,
                    start: "left center+=200",
                    toggleActions: "play none none reverse"
                }
            });
        }
    });

    // Navigation Click Handling
    function scrollToPanel(index) {
        const totalPixels = window.innerWidth * (panels.length - 1);
        const targetY = (index / (panels.length - 1)) * totalPixels;
        
        gsap.to(window, {
            scrollTo: targetY,
            duration: 1.2,
            ease: "power2.inOut"
        });
    }

    // Top Navbar
    document.querySelectorAll('.nav-item').forEach(button => {
        button.addEventListener('click', function() {
            const targetIndex = parseInt(this.getAttribute('data-target'));
            scrollToPanel(targetIndex);
        });
    });

    // Summary Nav Buttons
    document.querySelectorAll('.nav-btn').forEach(button => {
        button.addEventListener('click', function() {
            const targetIndex = parseInt(this.getAttribute('data-target'));
            scrollToPanel(targetIndex);
        });
    });

    // Scroll to panel on load if query param 'panel' is present
    const urlParams = new URLSearchParams(window.location.search);
    const panelParam = urlParams.get('panel');
    if (panelParam !== null) {
        const index = parseInt(panelParam);
        if (!isNaN(index) && index >= 0 && index < panels.length) {
            setTimeout(() => {
                scrollToPanel(index);
            }, 300);
        }
    }
});