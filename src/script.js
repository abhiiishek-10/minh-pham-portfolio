gsap.registerPlugin(ScrollToPlugin, ScrollTrigger);

document.addEventListener('DOMContentLoaded', () => {

    $('#introSection').css('width', `${window.innerWidth - $('.bands').width()}px`)

    const sections = gsap.utils.toArray('section');
    const wrapper = document.querySelector(".wrapper");
    let wrapperWidth = 0;
    sections.forEach(sec => {
        wrapperWidth += $(sec).width();
    })
    // console.log(wrapperWidth);

    let scrollTween = gsap.to(sections, {
        // xPercent: -100 * (sections.length - 1),
        x: `-${wrapperWidth - window.innerWidth}px`,
        ease: 'none',
        scrollTrigger: {
            trigger: '.wrapper',
            pin: true,
            scrub: 1,
            // snap: 1 / (sections.length - 1),
            start: 'top top',
            endTrigger: $('.wrapper').width(),
            // markers: true,
            end: () => "+=" + (wrapper.offsetWidth - innerWidth)
        }
    })

    // setting width of parent of bands
    $('.bands').css('width', `${$('.band').length * $('.band').width()}px`)

    const bands = gsap.utils.toArray('.band');
    let offset = 0;
    let reversedOffset = $('.band').length * $('.band').width();
    let bandTriggers = [];
    bands.forEach(band => {
        bandTriggers.push(gsap.to(band, {
            ease: 'linear',
            xPercent: -(band.getBoundingClientRect().left - offset),
            scrollTrigger: {
                containerAnimation: scrollTween,
                trigger: $(`.section[data-section='${band.id}']`),
                // trigger: band,
                scrub: true,
                start: `bottom bottom-=${reversedOffset + 16}`,
                endTrigger: $(`.section[data-section='${band.id}']`),
                // endTrigger: band,
                end: `bottom top+=${offset}`,
                // end: 3000,
                // markers: true
            }
        }))
        offset += $('.band').width();
        reversedOffset -= $('.band').width();
    })


    $(window).on('scroll', () => {
        // console.log(`scrollTop: ${$(window).scrollTop()}`);
    })

    $('.band').on('click', function (e) {
        // band click logic goes 
        scrollTween.scrollTrigger.start = 0;
        e.preventDefault();
        let targetElem = document.querySelector($(this).data('section')),
            y = targetElem;

        let totalScroll = scrollTween.scrollTrigger.end - scrollTween.scrollTrigger.start;

        // let totalMovement = (sections.length - 1) * targetElem.offsetWidth;
        let totalMovement = wrapperWidth - window.innerWidth;

        y = (Math.round(scrollTween.scrollTrigger.start + ((bandTriggers[$(this).index()].scrollTrigger.markerEnd.offsetLeft - ($(this).index() * $(this).width())) / totalMovement) * totalScroll));



        console.log(bandTriggers[$(this).index()].scrollTrigger.markerStart.offsetLeft);
        console.log(y);
        gsap.to(window, {
            ease: 'linear',
            scrollTo: {
                y: y,
                autoKill: false
            },
        });
    })









})



