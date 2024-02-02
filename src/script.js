gsap.registerPlugin(Draggable, ScrollToPlugin, ScrollTrigger);
window.onload = function () {
    gsap.to('.loader', {
        height: 0,
        duration: 1,
        ease: 'power4.inOut',
        onComplete: (self) => { $('.loader').remove() }
    })
}

function initiateLenis() {
    const lenis = new Lenis()
    lenis.on('scroll', ScrollTrigger.update)
    gsap.ticker.add((time) => {
        lenis.raf(time * 1000)
    })
    gsap.ticker.lagSmoothing(0)
}


function chopHeadingsToLetters(element) {
    // const headings = document.querySelectorAll('.heading-1');
    const headings = element;
    headings.forEach(heading => {
        const text = heading.textContent.trim(); // Trim leading and trailing whitespace
        let isSpace = false; // Flag to track unnecessary spaces
        heading.innerHTML = text
            .split('')
            .map((letter, index) => {
                if (letter !== ' ') { // Skip empty spaces
                    const letterElement = document.createElement('div');
                    letterElement.classList.add('letter');
                    letterElement.style.setProperty('--delay', 0.2);
                    letterElement.style.setProperty('--index', index);
                    letterElement.textContent = letter;
                    isSpace = false; // Reset the flag when a non-space character is encountered
                    return letterElement.outerHTML;
                } else if (!isSpace) { // Add space only if it's not an unnecessary space
                    isSpace = true; // Set the flag to true for unnecessary spaces
                    return ' ';
                }
                return '';
            })
            .join('');
    });
}


if (window.innerWidth <= 991) {

    console.log(" ================== is-touch ================== ");

    window.onload = function () {
        initiateLenis();

        let mobileTl = gsap.timeline();
        mobileTl.to('.loader', {
            height: 0,
            duration: 1,
            ease: 'power4.inOut',
            onComplete: (self) => { $('.loader').remove() }
        })


        const mobileHeader = document.querySelector('.mobile-header');
        const mainWrapper = document.querySelector('#sliderWrapper');
        mainWrapper.style.paddingTop = Math.floor(mobileHeader.offsetHeight) + 'px';

        mobileTl.from('.intro-img img', {
            clipPath: 'inset(50% )',
            duration: 1,
            ease: 'power4.inOut',
        })


        let innerSliders = document.querySelectorAll('.slide-group')
        innerSliders.forEach((slider) => {
            Draggable.create(slider, {
                type: "x",
                bounds: $('.showcase-main'),
                edgeResistance: 0.65,
            })
        })



        chopHeadingsToLetters(document.querySelectorAll('.heading-1'));
        gsap.utils.toArray('.heading-1').forEach(el => {
            gsap.to(el, {

                scrollTrigger: {
                    trigger: el,
                    toggleClass: 'char',
                    start: 'top bottom',
                    // markers: true,
                    toggleActions: 'play none none none',
                },
                // stagger: 0.2
            });
        });


        const headerTl = gsap.timeline({
            paused: true
        })
        const animateOpenNav = () => {
            headerTl.to("#nav-container", 0.7, {
                x: '0%',
                // autoAlpha: 1,
                delay: 0.1,
                ease: 'power3.out',
            })

            const navLinks = document.querySelectorAll('#nav-container .nav-link');
            navLinks.forEach((navLink) => {

                const letters = gsap.utils.toArray(navLink.children);
                headerTl.to(letters, 0.2, {
                    scaleY: 1,
                    // duration: 0.5,
                    ease: 'power3.out',
                    // stagger: 0.1,
                }).reverse();
            })
        }

        const openNav = () => {
            animateOpenNav();
            chopHeadingsToLetters(document.querySelectorAll("#nav-container .nav-link-wrapper .nav-link"));
            const navBtn = document.getElementById('menu-toggle-btn');
            navBtn.onclick = function (e) {
                navBtn.classList.toggle('active');
                if (navBtn.classList.contains('active')) {
                    headerTl.reverse();
                } else {
                }
                headerTl.reversed(!headerTl.reversed())
            }
        }
        openNav();




    }







}
else {
    console.log("================== no-touch ================== ");

    function fitFirstLastSections() {
        //NOTE: controlling landing section's width to extactly match the available space on the screen excluding the space that bands are taking up.
        const landingSection = document.querySelector(".intro-section");
        landingSection.style.width = (window.innerWidth - document.querySelector('.bands').offsetWidth) + 'px';
        landingSection.querySelector('.intro-main').style.height = (window.innerHeight - landingSection.querySelector('header').offsetHeight) + 'px';


        const contactSection = document.querySelector(".contact-section");
        contactSection.style.width = (window.innerWidth - document.querySelector('.bands').offsetWidth) + 'px';
    }
    fitFirstLastSections();


    const slider = document.querySelector("#panels");
    const sliderWrapper = document.querySelector("#sliderWrapper");

    const sections = gsap.utils.toArray(".section");
    sections.forEach((section) => {
        $(section).css('min-width', (window.innerWidth - $('.bands').width()) + 'px');
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
    const totalBands = document.querySelectorAll('.band');
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
                id: "1",
                invalidateOnRefresh: true,
            }
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
            scrub: 1,
            // markers: true
        }
    })
    // ============ About title translate end ============




    // ============ Sticky header start ============
    // setTimeout(() => {
    //     $('#sec-1 .header').parent().css('width', window.innerWidth - 300 + 'px')
    //     const sec1 = document.querySelector('#sec-1').offsetWidth;
    //     console.log(sec1);
    //     gsap.to('#sec-1 .header', {
    //         translateX: `${(sec1 - $('#sec-1 .header').width()) - 160}px`,
    //         ease: 'none',
    //         scrollTrigger: {
    //             trigger: '#sec-1 .header',
    //             containerAnimation: scrollTween,
    //             start: 'left left+=100',
    //             endTrigger: '#sec-1',
    //             end: 'right right-=200',
    //             scrub: true,
    //             markers: true
    //         }
    //     })

    // }, 100);


    const headerWrapper = document.querySelectorAll('.header-wrapper');
    const bandWidth = document.querySelector('.band').offsetWidth;
    setTimeout(() => {
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
    }, 100);
    // ============ Sticky header end ============







    // Calculate the cumulative width of previous sections
    const cumulativeWidths = [];
    let cumulativeWidth = 0;
    sections.forEach((section, index) => {
        cumulativeWidth += section.scrollWidth;
        cumulativeWidths.push(cumulativeWidth);
    });


    // Add click event on anchor tags with class "band"
    const bandLinks = document.querySelectorAll('a.band');
    bandLinks.forEach((link, index) => {
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
    const showcaseImages = document.querySelectorAll('.showcase-img');
    showcaseImages.forEach((image, index) => {
        gsap.from(image, {
            clipPath: 'inset(22% 20% 22% 20%)',
            duration: 1, ease: 'power4.inOut',
            scrollTrigger: {
                trigger: image.parentElement,
                // start: `left right-=100px`,
                start: `left right-=${(totalBands.length + 1) - image.offsetParent.offsetParent.dataset.section.replace('band-', '')}00px`,

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


    // ======== Showcase Navbar animation start ========
    setTimeout(() => {
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




    }, 100);

    // ======== Showcase Navbar animation end ========




    chopHeadingsToLetters(document.querySelectorAll('.heading-1'));
    gsap.utils.toArray('.heading-1').forEach(el => {
        gsap.to(el, {

            scrollTrigger: {
                trigger: el,
                toggleClass: 'char',
                containerAnimation: scrollTween,
                start: 'left 85%',
                // end: 'right 50%',
                // scrub: true,
                // markers: true,
                toggleActions: 'play none none none',
            },
            // stagger: 0.2


        });
    });
}


// $(window).bind('resize', function (e) {
//     if (window.RT) clearTimeout(window.RT);
//     window.RT = setTimeout(function () {
//         this.location.reload(); /* false to get page from cache */
//     }, 100);
// });


