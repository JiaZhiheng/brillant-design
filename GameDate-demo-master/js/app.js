//GSAP动画的结构很简单

//我们来拆解下，一个动画都由哪些部分组成→ 

//1、去哪儿         英文               to/form
//2、谁去动         要动的内容     跟写css一样，class用 "." /id用 "#",
//3、怎么去         左右动，x       上下动，y  其他的都是css样式变化
//4、去多久         英文               duration
//5、啥时候去      ScrollTrigger

//gsap的动画逻辑也是按照 这个常规的动画逻辑来的，
//我们按照这个逻辑，来写一下logo的加载动画

gsap.registerPlugin(ScrollTrigger);

gsap.to(".logo", {
    y: 60,
    skewX: "-25deg",
    duration: 2,
});

gsap.to(".nav", {
    x: -120,
    duration: 2,
});

gsap.from(".date", {
    y: 120,
    opacity: 0,
    duration: 2,
});

gsap.from(".release", {
    x: 120,
    opacity: 0,
    duration: 2,
});
//第一个游戏角色
gsap.to(".first", {
    rotateX: "45deg",
    skewX: "-25deg",
    transformOrigin: "bottom",
    duration: 2,
    scrollTrigger: {
        trigger: '.first',
        start: 'top 25%',
        end: 'top top',
        //markers: true,
        scrub: true,
        //        scrub: false,
    },
});
gsap.to(".one img", {
    x: -30,
    scale: 1.2,
    transformOrigin: "bottom",
    duration: 2,
    scrollTrigger: {
        trigger: '.first',
        start: 'top 25%',
        end: 'top top',
        //markers: true,
        scrub: true,
        //        scrub: false,
    },
});
gsap.from(".one .time", {
    x: -50,
    opacity: 0,
    transformOrigin: "bottom",
    duration: 2,
    scrollTrigger: {
        trigger: '.first',
        start: 'top 25%',
        end: 'top top',
        //markers: true,
        scrub: true,
        //        scrub: false,
    },
});
gsap.from(".one .des", {
    x: -100,
    y: -100,
    transformOrigin: "bottom",
    duration: 2,
    scrollTrigger: {
        trigger: '.first',
        start: 'top 25%',
        end: 'top top',
        //markers: true,
        scrub: true,
        //        scrub: false,
    },
});
gsap.to(".one .btn", {
    opacity: 0,
    y: -50,
    transformOrigin: "bottom",
    duration: 2,
    scrollTrigger: {
        trigger: '.first',
        start: 'top 25%',
        end: 'top top',
        //markers: true,
        scrub: true,
        //        scrub: false,
    },
});
//第二个游戏角色
gsap.to(".sec", {
    rotateX: "45deg",
    skewX: "-25deg",
    transformOrigin: "bottom",
    duration: 2,
    scrollTrigger: {
        trigger: '.sec',
        start: 'top 40%',
        end: 'top 15%',
        //markers: true,
        scrub: true,
        //        scrub: false,
    },
});
gsap.to(".two img", {
    x: -30,
    scale: 1.2,
    transformOrigin: "bottom",
    duration: 2,
    scrollTrigger: {
        trigger: '.sec',
        start: 'top 40%',
        end: 'top 15%',
        //markers: true,
        scrub: true,
        //        scrub: false,
    },
});
gsap.from(".two .time", {
    x: -50,
    opacity: 0,
    transformOrigin: "bottom",
    duration: 2,
    scrollTrigger: {
        trigger: '.sec',
        start: 'top 40%',
        end: 'top 15%',
        //markers: true,
        scrub: true,
        //        scrub: false,
    },
});
gsap.from(".two .des", {
    x: -100,
    y: -100,
    transformOrigin: "bottom",
    duration: 2,
    scrollTrigger: {
        trigger: '.sec',
        start: 'top 40%',
        end: 'top 15%',
        //markers: true,
        scrub: true,
        //        scrub: false,
    },
});
gsap.to(".two .btn", {
    opacity: 0,
    y: -50,
    transformOrigin: "bottom",
    duration: 2,
    scrollTrigger: {
        trigger: '.sec',
        start: 'top 40%',
        end: 'top 15%',
        //markers: true,
        scrub: true,
        //        scrub: false,
    },
});

//第三个游戏角色
gsap.to(".third", {
    rotateX: "45deg",
    skewX: "-25deg",
    transformOrigin: "bottom",
    duration: 2,
    scrollTrigger: {
        trigger: '.third',
        start: 'top 50%',
        end: 'top 25%',
        //markers: true,
        scrub: true,
        //        scrub: false,
    },
});
gsap.to(".three img", {
    x: -30,
    scale: 1.2,
    transformOrigin: "bottom",
    duration: 2,
    scrollTrigger: {
        trigger: '.third',
        start: 'top 50%',
        end: 'top 25%',
        //markers: true,
        scrub: true,
        //        scrub: false,
    },
});
gsap.from(".three .time", {
    x: -50,
    opacity: 0,
    transformOrigin: "bottom",
    duration: 2,
    scrollTrigger: {
        trigger: '.third',
        start: 'top 50%',
        end: 'top 25%',
        //markers: true,
        scrub: true,
        //        scrub: false,
    },
});
gsap.from(".three .des", {
    x: -100,
    y: -100,
    transformOrigin: "bottom",
    duration: 2,
    scrollTrigger: {
        trigger: '.third',
        start: 'top 50%',
        end: 'top 25%',
        //markers: true,
        scrub: true,
        //        scrub: false,
    },
});
gsap.to(".three .btn", {
    opacity: 0,
    y: -50,
    transformOrigin: "bottom",
    duration: 2,
    scrollTrigger: {
        trigger: '.third',
        start: 'top 50%',
        end: 'top 25%',
        //markers: true,
        scrub: true,
        //        scrub: false,
    },
});
//有问题随时联系老袭微信：zongjianriji
//有问题随时联系老袭微信：zongjianriji
//有问题随时联系老袭微信：zongjianriji
//有问题随时联系老袭微信：zongjianriji
//有问题随时联系老袭微信：zongjianriji
//有问题随时联系老袭微信：zongjianriji
//有问题随时联系老袭微信：zongjianriji
//有问题随时联系老袭微信：zongjianriji
//有问题随时联系老袭微信：zongjianriji
//有问题随时联系老袭微信：zongjianriji
