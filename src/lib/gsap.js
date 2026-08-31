import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Observer } from 'gsap/Observer';
import { CustomEase } from 'gsap/CustomEase';

gsap.registerPlugin(ScrollTrigger, Observer, CustomEase);

// One house ease, used everywhere. Long tail, no bounce — the difference
// between "premium" and "bouncy" is almost entirely this curve.
CustomEase.create('house', '0.16, 1, 0.3, 1');
CustomEase.create('houseIn', '0.7, 0, 0.84, 0');

gsap.defaults({ ease: 'house', duration: 1.05 });

export { gsap, ScrollTrigger, Observer };
