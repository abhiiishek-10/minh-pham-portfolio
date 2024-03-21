gsap.registerPlugin(ScrollToPlugin, ScrollTrigger);
console.log("development");

let stopLenis, resumeLenis;
function initiateLenis() {
    const lenis = new Lenis()
    lenis.on('scroll', ScrollTrigger.update)
    gsap.ticker.add((time) => {
        lenis.raf(time * 1000)
    })
    gsap.ticker.lagSmoothing(0)

    stopLenis = function stopLenis() {
        // console.log('lenis stopped');
        lenis.stop()
    }
    resumeLenis = function resumeLenis() {
        // console.log('lenis resumed');
        lenis.start()
    }
}

// ==============loader start================

// Loader Timeline
const loaderTl = gsap.timeline({});
document.onreadystatechange = function () {
    const isDocumentReady = document.readyState === "complete";

    const loaderAnimation = isDocumentReady ?
        loaderTl.to('.loading-text', { y: '100%', opacity: 0, ease: "power4.in" }, ">0.5")
            .to('.circle', { scale: 0, duration: 1, ease: "power4.inOut", stagger: -0.2 })
            .to('.loader', {
                opacity: 0,
                onComplete: () => {
                    $('.loader').remove();
                }
            }) :
        loaderTl.to('.circle', { scale: 1, duration: 1.5, ease: "power2.inOut", stagger: 0.3 })
            .to('.loading-text', { y: '-50%', opacity: 1, duration: 0.7, ease: "power3.out" });

    if (isDocumentReady) {
        loaderAnimation.play();
    }

};




// ==============loader end================

// Function to chop headings to letters
function chopHeadingsToLetters(element) {
    element.forEach(heading => {
        const text = heading.textContent.trim();
        let isSpace = false;

        heading.innerHTML = text.split('').map((letter, index) => {
            if (letter !== ' ') {
                const letterElement = document.createElement('div');
                letterElement.classList.add('letter');
                letterElement.style.setProperty('--delay', 0.2);
                letterElement.style.setProperty('--index', index);
                letterElement.textContent = letter;
                isSpace = false;
                return letterElement.outerHTML;
            } else if (!isSpace) {
                isSpace = true;
                return ' ';
            }
            return '';
        }).join('');
    });
}


if (window.innerWidth <= 991) {
    ScrollTrigger.config({
        ignoreMobileResize: true
    });
    console.log(" ================== is-touch ================== ");

    window.addEventListener('load', function () {
        initiateLenis();
        const navLinks = document.querySelectorAll("#nav-container .nav-link");
        const mobileHeader = document.querySelector('.mobile-header');
        const mainWrapper = document.querySelector('#sliderWrapper');
        const allHeadings = document.querySelectorAll('.heading-1');
        const navBtn = document.getElementById('menu-toggle-btn');

        let mobileTl = gsap.timeline();
        mobileTl.to('.loader', {
            height: 0,
            duration: 1,
            ease: 'power4.inOut',
            onComplete: () => { $('.loader').remove() }
        })

        mainWrapper.style.paddingTop = `${Math.floor(mobileHeader.offsetHeight)}px`;

        mobileTl.from('.intro-img img', {
            clipPath: 'inset(50%)',
            duration: 0.5,
            ease: 'power4.inOut',
        })

        chopHeadingsToLetters(allHeadings);
        allHeadings.forEach(el => {
            gsap.to(el, {

                scrollTrigger: {
                    trigger: el,
                    toggleClass: 'char',
                    start: 'top bottom',
                    // markers: true,
                    toggleActions: 'play none none none',
                    ignoreMobileResize: true
                },
                // stagger: 0.2
            });
        });


        const headerTl = gsap.timeline({
            paused: true
        })

        function scaleLetter() {
            navLinks.forEach(navLink => {
                navLink.classList.toggle('char');
            });
        }

        const animateOpenNav = () => {
            headerTl.to("#nav-container", 0.7, {
                x: '0%',
                // autoAlpha: 1,
                delay: 0.1,
                ease: 'power3.out',
            }).reverse();
        }

        const openNav = () => {
            animateOpenNav();
            chopHeadingsToLetters(navLinks);

            navBtn.onclick = function (e) {
                navBtn.classList.toggle('active');
                if (navBtn.classList.contains('active')) {
                    headerTl.reverse();
                    scaleLetter()
                    navBtn.querySelector('.open').classList.remove('d-none');
                    navBtn.querySelector('.closed').classList.add('d-none');
                    stopLenis();
                } else {
                    scaleLetter()
                    navBtn.querySelector('.open').classList.add('d-none');
                    navBtn.querySelector('.closed').classList.remove('d-none');
                    resumeLenis();
                }
                headerTl.reversed(!headerTl.reversed())
            }
        }
        openNav();

        function navLinkClick() {

            navLinks.forEach((link) => {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    const targetSection = link.getAttribute('href');
                    gsap.to(window, {
                        duration: 0.2,
                        scrollTo: {
                            y: targetSection,
                            offsetY: mobileHeader.offsetHeight
                        }
                    });
                    setTimeout(() => {
                        navBtn.click();
                    }, 300);
                })
            })
        }
        navLinkClick();

    })





}
else {
    window.addEventListener('load', () => {



        console.log("================== no-touch ================== ");
        const allHeadings = document.querySelectorAll('.heading-1');
        const bands = document.querySelector('.bands')
        const totalBands = document.querySelectorAll('.band');
        const slider = document.querySelector("#panels");
        const sliderWrapper = document.querySelector("#sliderWrapper");
        const sections = gsap.utils.toArray(".section");

        const headerWrapper = document.querySelectorAll('.header-wrapper');
        const bandWidth = document.querySelector('.band').offsetWidth;
        const showcaseImages = document.querySelectorAll('.showcase-img');



        function fitFirstLastSections() {
            //NOTE: controlling landing section's width to exactly match the available space on the screen excluding the space that bands are taking up.
            const landingSection = document.querySelector(".intro-section");
            landingSection.style.width = (window.innerWidth - bands.offsetWidth) + 'px';
            landingSection.querySelector('.intro-main').style.height = (window.innerHeight - landingSection.querySelector('header').offsetHeight) + 'px';


            const contactSection = document.querySelector(".contact-section");
            contactSection.style.width = (window.innerWidth - bands.offsetWidth) + 'px';
        }
        fitFirstLastSections();




        sections.forEach((section) => {
            section.style.minWidth = (window.innerWidth - bands.offsetWidth) + 'px'
        });


        function distance() {
            return sliderWrapper.scrollWidth - window.innerWidth
        }

        window.addEventListener("resize", () => {
            fitFirstLastSections();
            distance();
            ScrollTrigger.refresh();
        });

        let scrollTween = gsap.to(sliderWrapper, {
            x: window.innerWidth,
            xPercent: -100,
            ease: "none", // <-- IMPORTANT!
            scrollTrigger: {
                trigger: "#sliderWrapper",
                pin: true,
                scrub: 1,
                // markers: true,
                end: `+=${distance()}`,
                invalidateOnRefresh: true,
            }
        });


        // ============ Bands translation start ============

        totalBands.forEach((band, index) => {
            gsap.to(band, {
                x: () => -1 * window.innerWidth,
                xPercent: totalBands.length * band.offsetWidth,
                ease: "none",
                scrollTrigger: {
                    trigger: `#sec-${index}`,
                    containerAnimation: scrollTween,
                    start: `right right-=${(totalBands.length - index) * band.offsetWidth}px`,
                    end: `right left+=${index * band.offsetWidth}px`,
                    // markers: true,
                    toggleActions: "play none none reset",
                    scrub: true,
                    id: index + 1,
                    invalidateOnRefresh: true,
                    // markers: true,
                },

            })
        })
        // ============ Bands translation end ============


        // ============ About title translate start ============
        gsap.from('#sec-1 #aboutTitle', {
            xPercent: -13,
            ease: 'none',
            scrollTrigger: {
                trigger: '#sec-1',
                containerAnimation: scrollTween,
                start: 'left left',
                end: '+=300',
                scrub: 2,
                // markers: true
            }
        })
        // ============ About title translate end ============




        // ============ Sticky header start ============




        // setTimeout(() => {
        headerWrapper.forEach((headerWrapper, index) => {
            let header = headerWrapper.querySelector('.header');
            headerWrapper.style.width = window.innerWidth - (totalBands.length * bandWidth) + 'px';
            let parentSection = headerWrapper.parentElement;

            gsap.to(header, {
                translateX: `${(parentSection.offsetWidth - header.offsetWidth)}px`,
                ease: 'none',
                scrollTrigger: {
                    trigger: header,
                    containerAnimation: scrollTween,
                    start: `left left+=${(index + 1) * bandWidth}`,
                    endTrigger: parentSection,
                    end: `right right-=${(totalBands.length - (index + 1)) * bandWidth}`,
                    scrub: true,
                    // markers: true
                }
            })
        })
        // }, 100);
        // ============ Sticky header end ============




        // Calculate the cumulative width of previous sections
        const cumulativeWidths = [];
        let cumulativeWidth = 0;
        sections.forEach((section, index) => {
            cumulativeWidth += section.scrollWidth;
            cumulativeWidths.push(cumulativeWidth);
        });


        // Add click event on anchor tags with class "band"

        totalBands.forEach((link, index) => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                // Calculate the left position based on cumulative widths
                const leftPosition = index >= 0 ? cumulativeWidths[index] : 0;
                console.log(`Left position of section ${link.id}: ${leftPosition}px`);
                gsap.to(window, {
                    duration: 1,
                    scrollTo: {
                        y: leftPosition,
                    }
                });
            });
        });




        // ======== Showcase images reveal animation start ========
        console.log('line 362');
        showcaseImages.forEach((image, index) => {
            gsap.from(image, {
                clipPath: 'inset(22% 20% 22% 20%)',
                duration: 1, ease: 'power4.inOut',
                scrollTrigger: {
                    trigger: image.parentElement,
                    // start: `left right-=100px`,
                    start: `left right-=${((totalBands.length + 1) - image.offsetParent.offsetParent.dataset.section.replace('band-', '')) * bandWidth}px`,

                    containerAnimation: scrollTween,
                    toggleActions: 'play none none reverse',
                    // markers: true,
                    onEnter: () => {
                        gsap.to(image.querySelector('img'), {
                            scale: 1,
                            duration: 1,
                            ease: 'power4.inOut',
                        })
                    }, onLeaveBack: () => {
                        gsap.to(image.querySelector('img'), {
                            scale: 1.5,
                            duration: 1,
                            ease: 'power4.inOut',
                        })
                    }
                }
            })
        })
        // ======== Showcase images reveal animation end ========


        // ======== Showcase sticky Heading & Sticky Navbar animation start ========
        function showcaseNavbarAnimation() {
            // setTimeout(() => {
            const showcaseNav = document.querySelector('#showcase-nav');
            const showcaseHeader = showcaseNav.offsetParent.querySelector('.header');
            gsap.to(showcaseNav.firstElementChild, {
                translateX: `${showcaseNav.offsetParent.offsetWidth - (showcaseHeader.offsetWidth)}px`,
                ease: 'none',
                scrollTrigger: {
                    containerAnimation: scrollTween,
                    trigger: showcaseNav,
                    start: `left left+=${showcaseNav.offsetParent.id.replace('sec-', '') * bandWidth}`,
                    end: `right right-=${(totalBands.length - showcaseNav.offsetParent.id.replace('sec-', '')) * bandWidth}`,
                    scrub: true,
                    // markers: true,
                }
            })
            gsap.to('.showcase-heading .heading-1', {
                translateX: `${showcaseNav.offsetParent.offsetWidth - (showcaseHeader.offsetWidth)}px`,
                ease: 'none',
                scrollTrigger: {
                    containerAnimation: scrollTween,
                    trigger: showcaseNav,
                    start: `left left+=${showcaseNav.offsetParent.id.replace('sec-', '') * bandWidth}`,
                    end: `right right-=${(totalBands.length - showcaseNav.offsetParent.id.replace('sec-', '')) * bandWidth}`,
                    scrub: true,
                    // markers: true,

                }
            })



            const showcaseNavLinks = gsap.utils.toArray("#showcase-nav a.showcase-nav-link");
            const showcasePanels = gsap.utils.toArray("#showcase-panels > div.slide-group");
            const cumulativeShowcasePanelWidths = [];
            let cumulativeShowcasePanelWidth = 0;

            showcasePanels.forEach((panel, i) => {
                cumulativeShowcasePanelWidth += panel.scrollWidth;
                cumulativeShowcasePanelWidths.push(cumulativeShowcasePanelWidth);

                ScrollTrigger.create({
                    containerAnimation: scrollTween,
                    trigger: panel,
                    star: `right center`,
                    endTrigger: showcasePanels[i + 1],
                    end: `left center`,
                    // markers: true,
                    onLeave: () => {
                        if (showcaseNavLinks[i + 1]) {
                            showcaseNavLinks[i + 1].classList.add('showcase-nav__active');
                            showcaseNavLinks[i].classList.remove('showcase-nav__active');
                        }
                    },
                    onEnterBack: () => {
                        showcaseNavLinks[i].classList.add('showcase-nav__active');
                        if (showcaseNavLinks[i + 1]) {
                            showcaseNavLinks[i + 1].classList.remove('showcase-nav__active');

                        }
                    },

                })
            })


            // showcaseNavLinks.forEach((link, i) => {
            //     console.log();
            //     link.addEventListener("click", e => {
            //         e.preventDefault();
            //         console.log(cumulativeShowcasePanelWidths[i]);
            //         const leftPosition = i >= 0 ? cumulativeShowcasePanelWidths[i] : 0;

            //         gsap.to(window, {
            //             duration: 1,
            //             scrollTo: {
            //                 y: showcasePanels[i].getBoundingClientRect().left,
            //                 // offsetY: 
            //             }
            //         });
            //     });
            // });




            // }, 100);
        }
        showcaseNavbarAnimation();
        // ======== Showcase sticky Heading & Sticky Navbar animation end ========



        // ======== Headings animation start ========
        chopHeadingsToLetters(allHeadings);
        allHeadings.forEach(el => {
            gsap.to(el, {

                scrollTrigger: {
                    trigger: el,
                    // toggleClass: 'char',
                    containerAnimation: scrollTween,
                    start: 'left 90%',
                    // end: 'right 50%',
                    // scrub: true,
                    // markers: true,
                    toggleActions: 'play none none none',
                    onEnter: () => {
                        el.classList.add('char');
                    },
                    onLeave: () => {
                        el.classList.remove('char');
                        if (el.id === 'sticky-showcase-title') {
                            el.classList.add('char');
                        }
                    },
                    onEnterBack: () => {
                        el.classList.add('char');
                    },
                    onLeaveBack: () => {
                        el.classList.remove('char');
                    }
                },
                // stagger: 0.2
            });
        });
        // ======== Headings animation end ========


        // ======== Accent Colors changing effect start ========
        const sectionColors = [
            { 'primary': '#333333', 'secondary': '#B3B3B3' },
            { 'primary': '#2B6984', 'secondary': '#2B6984' },
            { 'primary': '#69b088', 'secondary': '#69b088' },
            { 'primary': '#d66b58', 'secondary': '#d66b58' },
        ]

        sections.forEach((section, index) => {
            section.addEventListener('mouseover', () => {
                gsap.to('.band', {
                    '--black-20': sectionColors[index].primary,
                    '--lightBorder': sectionColors[index].secondary,
                    duration: 0.7,
                    // ease: 'power4.inOut'
                })

                if (index > 0) {
                    gsap.to('.cursor-circle', {
                        backgroundColor: sectionColors[index].primary,
                        duration: 0.7,
                    })
                    gsap.to(`#sec-${index} .header`, {
                        '--black-20': sectionColors[index].primary,
                        '--lightBorder': sectionColors[index].secondary,
                    })
                    gsap.to(`#sec-${index}`, {
                        '--primary-dark': sectionColors[index].primary,
                    })
                } else {
                    gsap.to('.cursor-circle', {
                        backgroundColor: 'var(--primary-dark)',
                        duration: 0.7,
                    })
                }
            })

        })
        // ======== Accent Colors changing effect end ========


        // ======== Cursor movement update start ========
        window.onmousemove = (e) => {
            gsap.to(':root', {
                '--x': e.clientX,
                '--y': e.clientY,
                duration: 0.3

            })
        }
        // ======== Cursor movement update end ========



        // ======== Section header nav links click handler start ========

        document.querySelectorAll(".section .nav-link").forEach((link) => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                document.querySelector(`.band[data-section="${link.getAttribute('href')}"]`).click();

            })
        })

        // scroll indicator click handler
        document.querySelectorAll('.scroll-indicator a').forEach((link) => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                document.querySelector(`.band[data-section="${e.target.getAttribute('href')}"`).click();
            })
        })







        // ======== Section header nav links click handler end ========

        $(window).bind('resize', function (e) {
            if (window.RT) clearTimeout(window.RT);
            window.RT = setTimeout(function () {
                this.location.reload(true); /* false to get page from cache */
            }, 100);
        });



    })

}





