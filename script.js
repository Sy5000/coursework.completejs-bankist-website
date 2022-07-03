'use strict';
///////////////////////////////////////
// Modal window
const section1 = document.querySelector('#section--1');
const section2 = document.querySelector('#section--2');
const section3 = document.querySelector('#section--3');

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');

const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');

const nav = document.querySelector('.nav');
const navHeight = nav.getBoundingClientRect().height; //read client to get dynamic height
// console.log(navHeight);

const header = document.querySelector('.header'); //header using query selector

const allSections = document.querySelectorAll('.section');

const dotContainer = document.querySelector('.dots');
////////////////////MODAL
//e = event
const openModal = function (e) {
  // e.preventdefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};
//attach class to var//forEach var attach callback function to openModal when clicked
btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});
////////////////////

////////////////////EVENT DELAGATION - navigation
// //generic function, scoll to anchor (dynamic using 'forEach' to group buttons and 'this' read anchor)
// //-----wrong-----//
// document.querySelectorAll('.nav__link').forEach(function (el) {
//   el.addEventListener('click', function (e) {
//     e.preventDefault(); //stop page auto nav to anchor point w/o smooth scroll
//     const id = this.getAttribute('href');
//     console.log(id);
//     document.querySelector(id).scrollIntoView({ behavior: 'smooth' }); //with smooth scroll
//   });
// });
// //inefficient as function is copied multiple times forEach button
// //solution - event delagation, add function to shared parent element
// //when click event bubbles up from each button will trigger function
// //function will not be copied multiple times
//-----correct-----//
//1.add event listener to shared parent element
//2.determine which element originated the event (click)
document.querySelector('.nav__links').addEventListener('click', function (e) {
  console.log(e.target); //log where the click event came from
  e.preventDefault(); //block jump to anchor point

  //matching strategy
  if (e.target.classList.contains('nav__link')) {
    console.log('LINK');
    const id = e.target.getAttribute('href');
    console.log(id);
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' }); //with smooth scroll
  }
});
//notes - dont add functions to every elements, use parents and determine where
////////////////////

////////////////////TABBED CONTENT
//event deligation - add function to parent
tabsContainer.addEventListener('click', function (e) {
  // console.log(e.target); //identify click location

  //matching strategy - find button - use 'closest' to return only button elements by className (not the span which is also in the button)
  const clicked = e.target.closest('.operations__tab'); // console.log(clicked); //return button location

  //Guard clause
  if (!clicked) return; //exit (by return) function when no click identified (outside buttons & inside parent div)

  //Hide areas first
  tabs.forEach(t => t.classList.remove('operations__tab--active')); //remove 'active' from all class attributes
  tabsContent.forEach(c => c.classList.remove('operations__content--active'));
  //Active tab
  clicked.classList.add('operations__tab--active'); //add 'active' to clicked class attribute
  //Activate content area
  // use data coded into the data-tab attribute // console.log(clicked.dataset.tab);
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});
////////////////////

////////////////////PASSING ARGUMENTS INTO EVENT HANDLERS (HANDLER FUNCTIONS)
//Menu fade animation
const handleHover = function (e, opacity) {
  // console.log(this, e.currentTarget); //from bind //'argument' becomes 'this'

  if (e.target.classList.contains('nav__link')) {
    const link = e.target; //element working with
    const siblings = link.closest('.nav').querySelectorAll('.nav__link'); //sibling elements
    const logo = link.closest('.nav').querySelector('img'); //other elements to manipulate

    siblings.forEach(el => {
      if (el !== link) el.style.opacity = this; //'this' from bind function
    });
    logo.style.opacity = this;
  }
};
//REFACTOR AGAIN FROM BELOW
nav.addEventListener('mouseover', handleHover.bind(0.5));
nav.addEventListener('mouseout', handleHover.bind(1));

// //REFACTOR FROM BELOW
// nav.addEventListener('mouseover', function (e) {
//   //function that contains conditional
//   //ids click, if a navlink (organises between clicked and not clicked siblings)
//   //feeds click and opacity to appropriate function
//   handleHover(e, 0.5);
// });
// nav.addEventListener('mouseout', function (e) {
//   handleHover(e, 1);
// });

//mousehover does not bubble
// //fade out
// nav.addEventListener('mouseover', function (e) {
//   // if (e.target.classList.contains('nav__link')) {
//   //   const link = e.target; //element working with
//   //   const siblings = link.closest('.nav').querySelectorAll('.nav__link'); //sibling elements
//   //   const logo = link.closest('.nav').querySelector('img'); //other elements to manipulate
//   //   siblings.forEach(el => {
//   //     if (el !== link) el.style.opacity = 0.5;
//   //   });
//   //   logo.style.opacity = 0.5;
//   // }
// });

// //fade in
// nav.addEventListener('mouseout', function (e) {
//   if (e.target.classList.contains('nav__link')) {
//     const link = e.target; //element working with
//     const siblings = link.closest('.nav').querySelectorAll('.nav__link'); //sibling elements
//     const logo = link.closest('.nav').querySelector('img');

//     siblings.forEach(el => {
//       if (el !== link) el.style.opacity = 1;
//     });
//     logo.style.opacity = 1;
//   }
// });
////////////////////

////////////////////STICKY NAV
// // sticky changes
// const initialCoords = section1.getBoundingClientRect(); //size of viewport (dynamic)
// console.log(initialCoords);

// window.addEventListener('scroll', function () {
//   console.log(window.scrollY); //check the window object scrollY attribute

//   if (window.scrollY > initialCoords.top) nav.classList.add('sticky');
//   else nav.classList.remove('sticky');
// });
// ////////////////////

////////////////////INTERSECTION OBSERVER API (STICKY NAV #2)
//what to do when intersection is triggered
//3
const stickyNav = function (entries) {
  const [entry] = entries; //index
  // console.log(entry);
  if (!entry.isIntersecting) nav.classList.add('sticky');
  //isIntersecting = T/F perameter from client window
  else nav.classList.remove('sticky');
};

//2.observe & (custom func, trigger object perams(triggers func))
const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`, //add margin to match size of navigation element// dynamic
});
//1.target element
headerObserver.observe(header);
////////////////////

////////////////////REVEAL ELEMENTS ON SCROLL (using intersection observer API)
//animate sections into view
//3 what to do when intersection is triggered
const revealSection = function (entries, observer) {
  const [entry] = entries; //loop by index
  // console.log(entry); //check observer

  if (!entry.isIntersecting) return; //guard clasue, keep hidden
  //identify which section entered the viewport
  entry.target.classList.remove('section--hidden'); //remove hidden class
  observer.unobserve(entry.target); //remove observer (make whole observer work 1 time)
};
//2.observer & (custom func, trigger object perams(triggers func))
const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});

//1 target element('s with loop)
allSections.forEach(function (section) {
  //point the observer to element
  sectionObserver.observe(section);
  //add hidden class
  // section.classList.add('section--hidden');
});

////////////////////

////////////////////LAZY LOAD IMAGES
// swap lo res with hi-res in data set and remove blur (good for performance)
const imgTargets = document.querySelectorAll('img[data-src]'); //use css img with data-src attribute
//3. action func for intersection
const loadImg = function (entries, observer) {
  const [entry] = entries;
  console.log(entry);

  if (!entry.isIntersecting) return; //guard clause, keep lo-res
  //replace src with data.src
  entry.target.src = entry.target.dataset.src; //swap for full res at src
  //remove blur by listening for the load event
  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });
  observer.unobserve(entry.target); //remove observer (make whole observer work 1 time)
};
//2. observer
const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: '200px', //add margin to hide lazy load below fold
});
//1. point observer @ elements
imgTargets.forEach(img => imgObserver.observe(img));
////////////////////

////////////////////SLIDER
const slides = document.querySelectorAll('.slide');
const btnLeft = document.querySelector('.slider__btn--left');
const btnRight = document.querySelector('.slider__btn--right');
// console.log(slides);
let currentSlide = 0;
const maxSlide = slides.length;
//dev
// const slider = document.querySelector('.slider');
// // slider.style.transform = 'scale(0.4) translateX(-850px)'; //shrink to view all
// // slider.style.overflow = 'visible'; //display all

const slider = function () {
  //Functions

  //loop through each slide and change Xaxis * 100%
  //default values 0%, 100%, 200%, 300% (move these values to slide)
  const createDots = function () {
    slides.forEach(function (_, i) {
      dotContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  };

  //input current slide
  const activateDot = function (slide) {
    //remove active class from all
    document
      .querySelectorAll('.dots__dot')
      .forEach(dot => dot.classList.remove('dots__dot--active'));
    //pass index from dataset, change class
    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add('dots__dot--active');
  };

  ////////////////////
  //go to slide func
  const goToSlide = function (slide) {
    slides.forEach(
      //curSlide = 1: -100%,0%,100%,200%etc
      (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
    );
  };

  const nextSlide = function () {
    //loop logic (reset at end or increment)
    if (currentSlide === maxSlide - 1) {
      currentSlide = 0;
    } else {
      currentSlide++; //increment current slide
    }

    goToSlide(currentSlide);
    activateDot(currentSlide);
  };
  const prevSlide = function () {
    if (currentSlide === 0) {
      currentSlide = maxSlide - 1;
    } else {
      currentSlide--;
    }
    goToSlide(currentSlide);
    activateDot(currentSlide);
  };

  btnRight.addEventListener('click', nextSlide);
  btnLeft.addEventListener('click', prevSlide);

  const init = function () {
    goToSlide(0); //set silde index to zero on page load
    createDots();
    activateDot(0);
  };
  init();
  //Event handlers

  document.addEventListener('keydown', function (e) {
    console.log(e); ////find keys required in console (< >)
    if (e.key === 'ArrowLeft') prevSlide();
    if (e.key === 'ArrowRight') nextSlide();
    //OR (short circuiting)
    // e.key === 'ArrowRight' && nextSlide();
  });

  //add function to common parent, match to click
  dotContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      console.log('DOT');
      const { slide } = e.target.dataset;
      console.log(slide);
      goToSlide(slide);
      activateDot(slide);
    }
  });
};
slider();
////////////////////

////////////////////Lifecycle DOM events

//when page is parsed to DOM tree
// document.addEventListener('DOMContentLoaded', function (e) {
//   console.log('HTML parsed DOM tree built', e);
// });
// //fully loaded page
// window.addEventListener('load', function (e) {
//   console.log('Page fully loaded', e);
// });
// //before user leaves the page
// window.addEventListener('beforeunload', function (e) {
//   e.preventDefault();
//   console.log(e);
//   e.returnValue = ''; //unable to customise//browser creates messsage//use on forms, posts etc
// });
////////////////////
////////////////////
// notes
//DOM tree is made of nodes. Is an interface

//SELECTING,CREATING,DELETING ELEMENTS
//selecting DOM elements
// console.log(document.documentElement); //all HTML
// console.log(document.head); //all head
// console.log(document.body); //all body

// const allSections = document.querySelectorAll('.section'); //select all by class name
// console.log(allSections);

// document.getElementById('section--1');
// //retrieves live html list (dynamic list)
// const allButtons = document.getElementsByTagName('button');
// console.log(allButtons);
// //dynamic html collection
// console.log(document.getElementsByClassName('btn'));

//Creating and inserting elements
const message = document.createElement('div'); //only exists here
message.classList.add('cookie-message'); //create a class and add to new element
// message.textContent = 'We use cookies for improved functionality and analytics.'; //add text to element
message.innerHTML =
  'We use cookies for improved functionality and analytics. <button class="btn btn--close-cookie">Got it!</button>'; //format element as HTML
//decide where to place in DOM
// header.prepend(message); //prepend = 1st child
header.append(message); //append = last child (can only be in 1 place)
//to make a 2nd element CLONE
// header.append(message.cloneNode(true)); //true clones all child elements

// header.before(message); //as sibling to header BEFORE
// header.after(message); //as sibling to header AFTER

//DELETE
document
  .querySelector('.btn--close-cookie')
  .addEventListener('click', function () {
    message.remove(); //selecting VAR means no need to run document.querySelector again for element
    // message.parentElement.removeChild(message); //OLD way pre .remove() method
  });

////////////////////STYLES, ATTRIBUTES & CLASSES

//styles
//element,stlye,propertyName
message.style.backgroundColor = '#37383d';
message.style.width = '106%';

// //can only read inline styles (set in js)
// console.log(getComputedStyle(message)); //retrieve ALL computed styles of message var()
// console.log(getComputedStyle(message).color); //retrieve specified property ONLY
// console.log(getComputedStyle(message).height);

//set new value for property
// message.style.height = getComputedStyle(message).height + 40 + 'px'; //height property returns STRING (wont work)
message.style.height =
  Number.parseFloat(getComputedStyle(message).height, 10) + 40 + 'px'; //parse string to number

// Root
//For when styles are NOT inline
// document.documentElement.style.setProperty('--color-primary', 'orangered'); //(name , value)
// console.log(document.documentElement); //allHTML

// //Attributes
// const logo = document.querySelector('.nav__logo');
// console.log(logo.alt);

// console.log(logo.className); //.class is non standard// className has to be used
// console.log(logo.getAttribute('designer')); //non standard attribute search
// logo.setAttribute('company', 'Bankist'); //set a new attribute

// console.log(logo.src); //absolute url, img / links
// console.log(logo.getAttribute('src')); //relative url, img /links

// const link = document.querySelector('.nav__link--btn');
// console.log(link.href); //absolute
// console.log(link.getAttribute('href')); //relative

// //Data attributes
// console.log(logo.dataset.versionNumber); //camelcase instead of dashes in attribute name
// //dataset can be used to store user data in the HTML

// //Classes
// logo.classList.add('c');
// logo.classList.remove('c');
// logo.classList.toggle('c');
// logo.classList.contains('c'); //not includes

//DONT USE
// logo.className = 'Simon'; //applies to all classes

// ////////////////SMOOTH SCROLLING

// const btnScrollTo = document.querySelector('.btn--scroll-to');
// const section1 = document.querySelector('#section--1');
// // const section2 = document.querySelector('#section--2');
// // const section3 = document.querySelector('#section--3');

// btnScrollTo.addEventListener('click', function (e) {
//   const s1coords = section1.getBoundingClientRect(); //client viewport stats
//   console.log(s1coords);

//   console.log(e.target.getBoundingClientRect()); //position of link

//   console.log('Current scroll X/Y', window.pageXOffset, window.pageYOffset);

//   console.log(
//     'height/width viewport',
//     document.documentElement.clientHeight,
//     document.documentElement.clientWidth
//   );

//   //scrolling OLD
//   // window.scrollTo({
//   //   left: s1coords.left + window.pageXOffset,
//   //   top: s1coords.top + window.pageYOffset, // current pos + offset
//   //   behavior: 'smooth',
//   // });
//   //scrolling NEW
//   section1.scrollIntoView({ behavior: 'smooth' }); //Modern broswers ONLY
//   //
// });

// ////////////////////EVENTS AND EVENT HANDLERS
// //https://developer.mozilla.org/en-US/docs/Web/Events
// //save element to var
// const h1 = document.querySelector('h1');

// const alertH1 = function (e) {
//   alert('addEventListener: Good stuff you are reading the H1 heading');
//   //better - can remove event listener
//   h1.removeEventListener('mouseenter', alertH1);
// };
// //another way to remove listener
// setTimeout(() => h1.removeEventListener('mouseenter', alertH1), 3000); //timeout @3s

// //mouseenter = hover event in css
// h1.addEventListener('mouseenter', alertH1);

// //add new event to same function - OLD WAY - cannot remove listener
// // h1.onmouseenter = function (e) {
// //   alert('addEventListener: Good stuff you are reading the H1 heading');
// // };

////////////////////EVENT PROPAGATION-Bubbling & capturing
//DOM > Doc > Element(html) > element(body) > element(section) > element(p) > element (a)
//capturing phase = click event generated at ROOT > travels through parent elements to target > target phase begins
//bubbling phase = event listener travels back up through to the top of the DOM tree
//events PROPOGATE from 1 place to another in teh DOM

// ////////////////////EVENT PROPAGATION in PRACTICE
// //visualise event as it CAPTURES and BUBBLES

// // //rgb(255,255,255) //Random color func
// const randomInt = (min, max) =>
//   Math.floor(Math.random() * (max - min + 1) + min);
// const randomColor = () =>
//   `rgb(${randomInt(0, 255)},${randomInt(0, 255)},${randomInt(0, 255)})`;
// console.log(randomColor());

// //assign random bkg col to link background
// //parent
// document.querySelector('.nav').addEventListener(
//   'click',
//   function (e) {
//     console.log('NAV', e.target, e.currentTarget);
//     // this = what the event handler is attached to eg(querySelector('.class'))
//     console.log(e.currentTarget === this); //true
//     this.style.backgroundColor = randomColor();
//   },
//   true //true changes default behaviour (default listenes for BUBBLING/ (e) up the DOM, changing it listenes for CAPTURING / (e) down the DOM)
// );
// //child
// document.querySelector('.nav__links').addEventListener('click', function (e) {
//   console.log('CONTAINER', e.target, e.currentTarget);
//   // this = what the event handler is attached to eg(querySelector('.class'))
//   this.style.backgroundColor = randomColor();
// });
// //Child2
// document.querySelector('.nav__link').addEventListener('click', function (e) {
//   console.log('LINK', e.target, e.currentTarget);
//   // this = what the event handler is attached to eg(querySelector('.class'))
//   this.style.backgroundColor = randomColor();

//   //stop propogation //stop event reaching parent elements //AVOID
//   // e.stopImmediatePropagation();
// });
// //click function will trigger seperate event listeners on parent / child elements as it BUBBLES or CAPTURES up/down
// //e.target = where the (e) event happened (all 3 will be the same as they are handling the same event from the DOM root)
// // e.currentTarget where the event is currently === this

// // event listener only listenes during bubbling phase

// ////////////////////DOM TRAVERSING
// //walking through DOM
// //usefull for selection of child / parent elements
// //querySelector() = up | closest() = down
// const h1 = document.querySelector('h1');

// //going down - child
// console.log(h1.querySelectorAll('.highlight')); // can go multiple levels deep
// console.log(h1.childNodes); //direct children
// console.log(h1.children); //dynamic list //direct children
// console.log((h1.firstElementChild.style.color = 'white')); //target 1st child and set style
// console.log((h1.lastElementChild.style.color = 'orangered'));

// //going up = parents
// console.log(h1.parentNode);
// console.log(h1.parentElement);

// h1.closest('.header').style.background = 'var(--gradient-secondary)';

// h1.closest('h1').style.background = 'var(--gradient-primary)';
// //returns closest element that matches string

// //going sideways - sibling
// //can only prev or next
// console.log(h1.previousElementSibling);
// console.log(h1.nextElementSibling);

// console.log(h1.previousSibling);
// console.log(h1.nextSibling);
// //workaround to read more than direct siblings. Read parent and return ALL children
// console.log(h1.parentElement.children);
// //save to array and manipulate ONLY siblings (not original h1 element)
// [...h1.parentElement.children].forEach(function (el) {
//   if (el !== h1) el.style.transform = 'scale(0.5)';
// });
// ////////////////////

////////////////////INTERSECTION OBSERVER API (STICKY#2)
// const obsCallback = function (entries, observer) {
//   entries.forEach(entry => {
//     console.log(entry);
//   });
// };

// const obsOptions = {
//   root: null,
//   // threshold: 0.1, //intersects @set% eg 0.1=10% THEN obsCallback is called
//   //as array
//   threshold: [0, 0.2], // 0 triggers function when target comes into view OR completely leaves view | .2 = 20%
// };
// // var =  observe intersect data (arguments = func, object) func=loop each trigger > log data-T/F etc | object=set conditions to trigger 'obsCallback' func
// const observer = new IntersectionObserver(obsCallback, obsOptions);
// observer.observe(section1); //target var/element to observe intersection data
////////////////////
