// Utility function
function Util () {};

/* 
	class manipulation functions
*/
Util.hasClass = function(el, className) {
	return el.classList.contains(className);
};

Util.addClass = function(el, className) {
	var classList = className.split(' ');
 	el.classList.add(classList[0]);
 	if (classList.length > 1) Util.addClass(el, classList.slice(1).join(' '));
};

Util.removeClass = function(el, className) {
	var classList = className.split(' ');
	el.classList.remove(classList[0]);	
	if (classList.length > 1) Util.removeClass(el, classList.slice(1).join(' '));
};

Util.toggleClass = function(el, className, bool) {
	if(bool) Util.addClass(el, className);
	else Util.removeClass(el, className);
};

Util.setAttributes = function(el, attrs) {
  for(var key in attrs) {
    el.setAttribute(key, attrs[key]);
  }
};

/* 
  DOM manipulation
*/
Util.getChildrenByClassName = function(el, className) {
  var children = el.children,
    childrenByClass = [];
  for (var i = 0; i < children.length; i++) {
    if (Util.hasClass(children[i], className)) childrenByClass.push(children[i]);
  }
  return childrenByClass;
};

Util.is = function(elem, selector) {
  if(selector.nodeType){
    return elem === selector;
  }

  var qa = (typeof(selector) === 'string' ? document.querySelectorAll(selector) : selector),
    length = qa.length,
    returnArr = [];

  while(length--){
    if(qa[length] === elem){
      return true;
    }
  }

  return false;
};

/* 
	Animate height of an element
*/
Util.setHeight = function(start, to, element, duration, cb, timeFunction) {
	var change = to - start,
	    currentTime = null;

  var animateHeight = function(timestamp){  
    if (!currentTime) currentTime = timestamp;         
    var progress = timestamp - currentTime;
    if(progress > duration) progress = duration;
    var val = parseInt((progress/duration)*change + start);
    if(timeFunction) {
      val = Math[timeFunction](progress, start, to - start, duration);
    }
    element.style.height = val+"px";
    if(progress < duration) {
        window.requestAnimationFrame(animateHeight);
    } else {
    	if(cb) cb();
    }
  };
  
  //set the height of the element before starting animation -> fix bug on Safari
  element.style.height = start+"px";
  window.requestAnimationFrame(animateHeight);
};

/* 
	Smooth Scroll
*/

Util.scrollTo = function(final, duration, cb, scrollEl) {
  var element = scrollEl || window;
  var start = element.scrollTop || document.documentElement.scrollTop,
    currentTime = null;

  if(!scrollEl) start = window.scrollY || document.documentElement.scrollTop;
      
  var animateScroll = function(timestamp){
  	if (!currentTime) currentTime = timestamp;        
    var progress = timestamp - currentTime;
    if(progress > duration) progress = duration;
    var val = Math.easeInOutQuad(progress, start, final-start, duration);
    element.scrollTo(0, val);
    if(progress < duration) {
      window.requestAnimationFrame(animateScroll);
    } else {
      cb && cb();
    }
  };

  window.requestAnimationFrame(animateScroll);
};

/* 
  Focus utility classes
*/

//Move focus to an element
Util.moveFocus = function (element) {
  if( !element ) element = document.getElementsByTagName("body")[0];
  element.focus();
  if (document.activeElement !== element) {
    element.setAttribute('tabindex','-1');
    element.focus();
  }
};

/* 
  Misc
*/

Util.getIndexInArray = function(array, el) {
  return Array.prototype.indexOf.call(array, el);
};

Util.cssSupports = function(property, value) {
  if('CSS' in window) {
    return CSS.supports(property, value);
  } else {
    var jsProperty = property.replace(/-([a-z])/g, function (g) { return g[1].toUpperCase();});
    return jsProperty in document.body.style;
  }
};

// merge a set of user options into plugin defaults
// https://gomakethings.com/vanilla-javascript-version-of-jquery-extend/
Util.extend = function() {
  // Variables
  var extended = {};
  var deep = false;
  var i = 0;
  var length = arguments.length;

  // Check if a deep merge
  if ( Object.prototype.toString.call( arguments[0] ) === '[object Boolean]' ) {
    deep = arguments[0];
    i++;
  }

  // Merge the object into the extended object
  var merge = function (obj) {
    for ( var prop in obj ) {
      if ( Object.prototype.hasOwnProperty.call( obj, prop ) ) {
        // If deep merge and property is an object, merge properties
        if ( deep && Object.prototype.toString.call(obj[prop]) === '[object Object]' ) {
          extended[prop] = extend( true, extended[prop], obj[prop] );
        } else {
          extended[prop] = obj[prop];
        }
      }
    }
  };

  // Loop through each object and conduct a merge
  for ( ; i < length; i++ ) {
    var obj = arguments[i];
    merge(obj);
  }

  return extended;
};

// Check if Reduced Motion is enabled
Util.osHasReducedMotion = function() {
  if(!window.matchMedia) return false;
  var matchMediaObj = window.matchMedia('(prefers-reduced-motion: reduce)');
  if(matchMediaObj) return matchMediaObj.matches;
  return false; // return false if not supported
}; 

/* 
	Polyfills
*/
//Closest() method
if (!Element.prototype.matches) {
	Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;
}

if (!Element.prototype.closest) {
	Element.prototype.closest = function(s) {
		var el = this;
		if (!document.documentElement.contains(el)) return null;
		do {
			if (el.matches(s)) return el;
			el = el.parentElement || el.parentNode;
		} while (el !== null && el.nodeType === 1); 
		return null;
	};
}

//Custom Event() constructor
if ( typeof window.CustomEvent !== "function" ) {

  function CustomEvent ( event, params ) {
    params = params || { bubbles: false, cancelable: false, detail: undefined };
    var evt = document.createEvent( 'CustomEvent' );
    evt.initCustomEvent( event, params.bubbles, params.cancelable, params.detail );
    return evt;
   }

  CustomEvent.prototype = window.Event.prototype;

  window.CustomEvent = CustomEvent;
}

/* 
	Animation curves
*/
Math.easeInOutQuad = function (t, b, c, d) {
	t /= d/2;
	if (t < 1) return c/2*t*t + b;
	t--;
	return -c/2 * (t*(t-2) - 1) + b;
};

Math.easeInQuart = function (t, b, c, d) {
	t /= d;
	return c*t*t*t*t + b;
};

Math.easeOutQuart = function (t, b, c, d) { 
  t /= d;
	t--;
	return -c * (t*t*t*t - 1) + b;
};

Math.easeInOutQuart = function (t, b, c, d) {
	t /= d/2;
	if (t < 1) return c/2*t*t*t*t + b;
	t -= 2;
	return -c/2 * (t*t*t*t - 2) + b;
};

Math.easeOutElastic = function (t, b, c, d) {
  var s=1.70158;var p=d*0.7;var a=c;
  if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
  if (a < Math.abs(c)) { a=c; var s=p/4; }
  else var s = p/(2*Math.PI) * Math.asin (c/a);
  return a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b;
};


/* JS Utility Classes */

// make focus ring visible only for keyboard navigation (i.e., tab key) 
(function() {
  var focusTab = document.getElementsByClassName('js-tab-focus'),
    shouldInit = false,
    outlineStyle = false,
    eventDetected = false;

  function detectClick() {
    if(focusTab.length > 0) {
      resetFocusStyle(false);
      window.addEventListener('keydown', detectTab);
    }
    window.removeEventListener('mousedown', detectClick);
    outlineStyle = false;
    eventDetected = true;
  };

  function detectTab(event) {
    if(event.keyCode !== 9) return;
    resetFocusStyle(true);
    window.removeEventListener('keydown', detectTab);
    window.addEventListener('mousedown', detectClick);
    outlineStyle = true;
  };

  function resetFocusStyle(bool) {
    var outlineStyle = bool ? '' : 'none';
    for(var i = 0; i < focusTab.length; i++) {
      focusTab[i].style.setProperty('outline', outlineStyle);
    }
  };

  function initFocusTabs() {
    if(shouldInit) {
      if(eventDetected) resetFocusStyle(outlineStyle);
      return;
    }
    shouldInit = focusTab.length > 0;
    window.addEventListener('mousedown', detectClick);
  };

  initFocusTabs();
  window.addEventListener('initFocusTabs', initFocusTabs);
}());

function resetFocusTabsStyle() {
  window.dispatchEvent(new CustomEvent('initFocusTabs'));
};
// File#: _1_animated-headline
// Usage: codyhouse.co/license
(function() {
    var TextAnim = function(element) {
      this.element = element;
      this.wordsWrapper = this.element.getElementsByClassName(' js-text-anim__wrapper');
      this.words = this.element.getElementsByClassName('js-text-anim__word');
      this.selectedWord = 0;
      // interval between two animations
      this.loopInterval = parseFloat(getComputedStyle(this.element).getPropertyValue('--text-anim-pause'))*1000 || 1000;
      // duration of single animation (e.g., time for a single word to rotate)
      this.transitionDuration = parseFloat(getComputedStyle(this.element).getPropertyValue('--text-anim-duration'))*1000 || 1000;
      // keep animating after first loop was completed
      this.loop = (this.element.getAttribute('data-loop') && this.element.getAttribute('data-loop') == 'off') ? false : true;
      this.wordInClass = 'text-anim__word--in';
      this.wordOutClass = 'text-anim__word--out';
      // check for specific animations
      this.isClipAnim = Util.hasClass(this.element, 'text-anim--clip');
      if(this.isClipAnim) {
        this.animBorderWidth = parseInt(getComputedStyle(this.element).getPropertyValue('--text-anim-border-width')) || 2;
        this.animPulseClass = 'text-anim__wrapper--pulse';
      }
      initTextAnim(this);
    };
  
    function initTextAnim(element) {
      // make sure there's a word with the wordInClass
      setSelectedWord(element);
      // if clip animation -> add pulse class
      if(element.isClipAnim) {
        Util.addClass(element.wordsWrapper[0], element.animPulseClass);
      }
      // init loop
      loopWords(element);
    };
  
    function setSelectedWord(element) {
      var selectedWord = element.element.getElementsByClassName(element.wordInClass);
      if(selectedWord.length == 0) {
        Util.addClass(element.words[0], element.wordInClass);
      } else {
        element.selectedWord = Util.getIndexInArray(element.words, selectedWord[0]);
      }
    };
  
    function loopWords(element) {
      // stop animation after first loop was completed
      if(!element.loop && element.selectedWord == element.words.length - 1) {
        return;
      }
      var newWordIndex = getNewWordIndex(element);
      setTimeout(function() {
        if(element.isClipAnim) { // clip animation only
          switchClipWords(element, newWordIndex);
        } else {
          switchWords(element, newWordIndex);
        }
      }, element.loopInterval);
    };
  
    function switchWords(element, newWordIndex) {
      // switch words
      Util.removeClass(element.words[element.selectedWord], element.wordInClass);
      Util.addClass(element.words[element.selectedWord], element.wordOutClass);
      Util.addClass(element.words[newWordIndex], element.wordInClass);
      // reset loop
      resetLoop(element, newWordIndex);
    };
  
    function resetLoop(element, newIndex) {
      setTimeout(function() { 
        // set new selected word
        Util.removeClass(element.words[element.selectedWord], element.wordOutClass);
        element.selectedWord = newIndex;
        loopWords(element); // restart loop
      }, element.transitionDuration);
    };
  
    function switchClipWords(element, newWordIndex) {
      // clip animation only
      var startWidth =  element.words[element.selectedWord].offsetWidth,
        endWidth = element.words[newWordIndex].offsetWidth;
      
      // remove pulsing animation
      Util.removeClass(element.wordsWrapper[0], element.animPulseClass);
      // close word
      animateWidth(startWidth, element.animBorderWidth, element.wordsWrapper[0], element.transitionDuration, function() {
        // switch words
        Util.removeClass(element.words[element.selectedWord], element.wordInClass);
        Util.addClass(element.words[newWordIndex], element.wordInClass);
        element.selectedWord = newWordIndex;
  
        // open word
        animateWidth(element.animBorderWidth, endWidth, element.wordsWrapper[0], element.transitionDuration, function() {
          // add pulsing class
          Util.addClass(element.wordsWrapper[0], element.animPulseClass);
          loopWords(element);
        });
      });
    };
  
    function getNewWordIndex(element) {
      // get index of new word to be shown
      var index = element.selectedWord + 1;
      if(index >= element.words.length) index = 0;
      return index;
    };
  
    function animateWidth(start, to, element, duration, cb) {
      // animate width of a word for the clip animation
      var currentTime = null;
  
      var animateProperty = function(timestamp){  
        if (!currentTime) currentTime = timestamp;         
        var progress = timestamp - currentTime;
        
        var val = Math.easeInOutQuart(progress, start, to - start, duration);
        element.style.width = val+"px";
        if(progress < duration) {
            window.requestAnimationFrame(animateProperty);
        } else {
          cb();
        }
      };
    
      //set the width of the element before starting animation -> fix bug on Safari
      element.style.width = start+"px";
      window.requestAnimationFrame(animateProperty);
    };
  
    window.TextAnim = TextAnim;
  
    // init TextAnim objects
    var textAnim = document.getElementsByClassName('js-text-anim'),
      reducedMotion = Util.osHasReducedMotion();
    if( textAnim ) {
      if(reducedMotion) return;
      for( var i = 0; i < textAnim.length; i++) {
        (function(i){ new TextAnim(textAnim[i]);})(i);
      }
    }
  }());
// File#: _1_back-to-top
// Usage: codyhouse.co/license
(function() {
    var backTop = document.getElementsByClassName('js-back-to-top')[0];
    if( backTop ) {
      var dataElement = backTop.getAttribute('data-element');
      var scrollElement = dataElement ? document.querySelector(dataElement) : window;
      var scrollDuration = parseInt(backTop.getAttribute('data-duration')) || 300, //scroll to top duration
        scrollOffsetInit = parseInt(backTop.getAttribute('data-offset-in')) || parseInt(backTop.getAttribute('data-offset')) || 0, //show back-to-top if scrolling > scrollOffset
        scrollOffsetOutInit = parseInt(backTop.getAttribute('data-offset-out')) || 0, 
        scrollOffset = 0,
        scrollOffsetOut = 0,
        scrolling = false;
  
      // check if target-in/target-out have been set
      var targetIn = backTop.getAttribute('data-target-in') ? document.querySelector(backTop.getAttribute('data-target-in')) : false,
        targetOut = backTop.getAttribute('data-target-out') ? document.querySelector(backTop.getAttribute('data-target-out')) : false;
  
      updateOffsets();
      
      //detect click on back-to-top link
      backTop.addEventListener('click', function(event) {
        event.preventDefault();
        if(!window.requestAnimationFrame) {
          scrollElement.scrollTo(0, 0);
        } else {
          dataElement ? Util.scrollTo(0, scrollDuration, false, scrollElement) : Util.scrollTo(0, scrollDuration);
        } 
        //move the focus to the #top-element - don't break keyboard navigation
        Util.moveFocus(document.getElementById(backTop.getAttribute('href').replace('#', '')));
      });
      
      //listen to the window scroll and update back-to-top visibility
      checkBackToTop();
      if (scrollOffset > 0 || scrollOffsetOut > 0) {
        scrollElement.addEventListener("scroll", function(event) {
          if( !scrolling ) {
            scrolling = true;
            (!window.requestAnimationFrame) ? setTimeout(function(){checkBackToTop();}, 250) : window.requestAnimationFrame(checkBackToTop);
          }
        });
      }
  
      function checkBackToTop() {
        updateOffsets();
        var windowTop = scrollElement.scrollTop || document.documentElement.scrollTop;
        if(!dataElement) windowTop = window.scrollY || document.documentElement.scrollTop;
        var condition =  windowTop >= scrollOffset;
        if(scrollOffsetOut > 0) {
          condition = (windowTop >= scrollOffset) && (window.innerHeight + windowTop < scrollOffsetOut);
        }
        Util.toggleClass(backTop, 'back-to-top--is-visible', condition);
        scrolling = false;
      }
  
      function updateOffsets() {
        scrollOffset = getOffset(targetIn, scrollOffsetInit, true);
        scrollOffsetOut = getOffset(targetOut, scrollOffsetOutInit);
      }
  
      function getOffset(target, startOffset, bool) {
        var offset = 0;
        if(target) {
          var windowTop = scrollElement.scrollTop || document.documentElement.scrollTop;
          if(!dataElement) windowTop = window.scrollY || document.documentElement.scrollTop;
          var boundingClientRect = target.getBoundingClientRect();
          offset = bool ? boundingClientRect.bottom : boundingClientRect.top;
          offset = offset + windowTop;
        }
        if(startOffset && startOffset) {
          offset = offset + parseInt(startOffset);
        }
        return offset;
      }
    }
  }());

  
  console.log("%cHi there! 👋 This page is for demo purposes only. We have minified HTML, CSS and JavaScript and shortened class names.", "font-size:14px");console.log("%cAny doubts, get in touch at therkut01@gmail.com", "font-size:12px");

    
(function() {
    var darkThemeSelected = checkDarkTheme();
    if (darkThemeSelected)
        document.getElementsByTagName("html")[0].setAttribute('data-theme', 'dark');
    function checkDarkTheme() {
        var darkThemestorage = (localStorage.getItem('themeSwitch') !== null && localStorage.getItem('themeSwitch') === 'dark')
          , lightThemestorage = (localStorage.getItem('themeSwitch') !== null && localStorage.getItem('themeSwitch') === 'light')
          , darkThemeMatchMedia = window.matchMedia("(prefers-color-scheme: dark)").matches;
        return (darkThemestorage || (darkThemeMatchMedia && !lightThemestorage));
    }
    ;
}());

// File#: _1_main-header
// Usage: codyhouse.co/license
(function() {
    var mainHeader = document.getElementsByClassName('js-header');
    if( mainHeader.length > 0 ) {
      var trigger = mainHeader[0].getElementsByClassName('js-header__trigger')[0],
        nav = mainHeader[0].getElementsByClassName('js-header__nav')[0];
  
      // we'll use these to store the node that needs to receive focus when the mobile menu is closed 
      var focusMenu = false;
  
      //detect click on nav trigger
      trigger.addEventListener("click", function(event) {
        event.preventDefault();
        toggleNavigation(!Util.hasClass(nav, 'header__nav--is-visible'));
      });
  
      // listen for key events
      window.addEventListener('keyup', function(event){
        // listen for esc key
        if( (event.keyCode && event.keyCode == 27) || (event.key && event.key.toLowerCase() == 'escape' )) {
          // close navigation on mobile if open
          if(trigger.getAttribute('aria-expanded') == 'true' && isVisible(trigger)) {
            focusMenu = trigger; // move focus to menu trigger when menu is close
            trigger.click();
          }
        }
        // listen for tab key
        if( (event.keyCode && event.keyCode == 9) || (event.key && event.key.toLowerCase() == 'tab' )) {
          // close navigation on mobile if open when nav loses focus
          if(trigger.getAttribute('aria-expanded') == 'true' && isVisible(trigger) && !document.activeElement.closest('.js-header')) trigger.click();
        }
      });
  
      // listen for resize
      var resizingId = false;
      window.addEventListener('resize', function() {
        clearTimeout(resizingId);
        resizingId = setTimeout(doneResizing, 500);
      });
  
      function doneResizing() {
        if( !isVisible(trigger) && Util.hasClass(mainHeader[0], 'header--expanded')) toggleNavigation(false); 
      };
    }
  
    function isVisible(element) {
      return (element.offsetWidth || element.offsetHeight || element.getClientRects().length);
    };
  
    function toggleNavigation(bool) { // toggle navigation visibility on small device
      Util.toggleClass(nav, 'header__nav--is-visible', bool);
      Util.toggleClass(mainHeader[0], 'header--expanded', bool);
      trigger.setAttribute('aria-expanded', bool);
      if(bool) { //opening menu -> move focus to first element inside nav
        nav.querySelectorAll('[href], input:not([disabled]), button:not([disabled])')[0].focus();
      } else if(focusMenu) {
        focusMenu.focus();
        focusMenu = false;
      }
    };
  }());
// File#: _1_modal-window
// Usage: codyhouse.co/license
(function() {
    var Modal = function(element) {
      this.element = element;
      this.triggers = document.querySelectorAll('[aria-controls="'+this.element.getAttribute('id')+'"]');
      this.firstFocusable = null;
      this.lastFocusable = null;
      this.moveFocusEl = null; // focus will be moved to this element when modal is open
      this.modalFocus = this.element.getAttribute('data-modal-first-focus') ? this.element.querySelector(this.element.getAttribute('data-modal-first-focus')) : null;
      this.selectedTrigger = null;
      this.preventScrollEl = this.getPreventScrollEl();
      this.showClass = "modal--is-visible";
      this.initModal();
    };
  
    Modal.prototype.getPreventScrollEl = function() {
      var scrollEl = false;
      var querySelector = this.element.getAttribute('data-modal-prevent-scroll');
      if(querySelector) scrollEl = document.querySelector(querySelector);
      return scrollEl;
    };
  
    Modal.prototype.initModal = function() {
      var self = this;
      //open modal when clicking on trigger buttons
      if ( this.triggers ) {
        for(var i = 0; i < this.triggers.length; i++) {
          this.triggers[i].addEventListener('click', function(event) {
            event.preventDefault();
            if(Util.hasClass(self.element, self.showClass)) {
              self.closeModal();
              return;
            }
            self.selectedTrigger = event.currentTarget;
            self.showModal();
            self.initModalEvents();
          });
        }
      }
  
      // listen to the openModal event -> open modal without a trigger button
      this.element.addEventListener('openModal', function(event){
        if(event.detail) self.selectedTrigger = event.detail;
        self.showModal();
        self.initModalEvents();
      });
  
      // listen to the closeModal event -> close modal without a trigger button
      this.element.addEventListener('closeModal', function(event){
        if(event.detail) self.selectedTrigger = event.detail;
        self.closeModal();
      });
  
      // if modal is open by default -> initialise modal events
      if(Util.hasClass(this.element, this.showClass)) this.initModalEvents();
    };
  
    Modal.prototype.showModal = function() {
      var self = this;
      Util.addClass(this.element, this.showClass);
      this.getFocusableElements();
      if(this.moveFocusEl) {
        this.moveFocusEl.focus();
        // wait for the end of transitions before moving focus
        this.element.addEventListener("transitionend", function cb(event) {
          self.moveFocusEl.focus();
          self.element.removeEventListener("transitionend", cb);
        });
      }
      this.emitModalEvents('modalIsOpen');
      // change the overflow of the preventScrollEl
      if(this.preventScrollEl) this.preventScrollEl.style.overflow = 'hidden';
    };
  
    Modal.prototype.closeModal = function() {
      if(!Util.hasClass(this.element, this.showClass)) return;
      Util.removeClass(this.element, this.showClass);
      this.firstFocusable = null;
      this.lastFocusable = null;
      this.moveFocusEl = null;
      if(this.selectedTrigger) this.selectedTrigger.focus();
      //remove listeners
      this.cancelModalEvents();
      this.emitModalEvents('modalIsClose');
      // change the overflow of the preventScrollEl
      if(this.preventScrollEl) this.preventScrollEl.style.overflow = '';
    };
  
    Modal.prototype.initModalEvents = function() {
      //add event listeners
      this.element.addEventListener('keydown', this);
      this.element.addEventListener('click', this);
    };
  
    Modal.prototype.cancelModalEvents = function() {
      //remove event listeners
      this.element.removeEventListener('keydown', this);
      this.element.removeEventListener('click', this);
    };
  
    Modal.prototype.handleEvent = function (event) {
      switch(event.type) {
        case 'click': {
          this.initClick(event);
        }
        case 'keydown': {
          this.initKeyDown(event);
        }
      }
    };
  
    Modal.prototype.initKeyDown = function(event) {
      if( event.keyCode && event.keyCode == 9 || event.key && event.key == 'Tab' ) {
        //trap focus inside modal
        this.trapFocus(event);
      } else if( (event.keyCode && event.keyCode == 13 || event.key && event.key == 'Enter') && event.target.closest('.js-modal__close')) {
        event.preventDefault();
        this.closeModal(); // close modal when pressing Enter on close button
      }	
    };
  
    Modal.prototype.initClick = function(event) {
      //close modal when clicking on close button or modal bg layer 
      if( !event.target.closest('.js-modal__close') && !Util.hasClass(event.target, 'js-modal') ) return;
      event.preventDefault();
      this.closeModal();
    };
  
    Modal.prototype.trapFocus = function(event) {
      if( this.firstFocusable == document.activeElement && event.shiftKey) {
        //on Shift+Tab -> focus last focusable element when focus moves out of modal
        event.preventDefault();
        this.lastFocusable.focus();
      }
      if( this.lastFocusable == document.activeElement && !event.shiftKey) {
        //on Tab -> focus first focusable element when focus moves out of modal
        event.preventDefault();
        this.firstFocusable.focus();
      }
    }
  
    Modal.prototype.getFocusableElements = function() {
      //get all focusable elements inside the modal
      var allFocusable = this.element.querySelectorAll(focusableElString);
      this.getFirstVisible(allFocusable);
      this.getLastVisible(allFocusable);
      this.getFirstFocusable();
    };
  
    Modal.prototype.getFirstVisible = function(elements) {
      //get first visible focusable element inside the modal
      for(var i = 0; i < elements.length; i++) {
        if( isVisible(elements[i]) ) {
          this.firstFocusable = elements[i];
          break;
        }
      }
    };
  
    Modal.prototype.getLastVisible = function(elements) {
      //get last visible focusable element inside the modal
      for(var i = elements.length - 1; i >= 0; i--) {
        if( isVisible(elements[i]) ) {
          this.lastFocusable = elements[i];
          break;
        }
      }
    };
  
    Modal.prototype.getFirstFocusable = function() {
      if(!this.modalFocus || !Element.prototype.matches) {
        this.moveFocusEl = this.firstFocusable;
        return;
      }
      var containerIsFocusable = this.modalFocus.matches(focusableElString);
      if(containerIsFocusable) {
        this.moveFocusEl = this.modalFocus;
      } else {
        this.moveFocusEl = false;
        var elements = this.modalFocus.querySelectorAll(focusableElString);
        for(var i = 0; i < elements.length; i++) {
          if( isVisible(elements[i]) ) {
            this.moveFocusEl = elements[i];
            break;
          }
        }
        if(!this.moveFocusEl) this.moveFocusEl = this.firstFocusable;
      }
    };
  
    Modal.prototype.emitModalEvents = function(eventName) {
      var event = new CustomEvent(eventName, {detail: this.selectedTrigger});
      this.element.dispatchEvent(event);
    };
  
    function isVisible(element) {
      return element.offsetWidth || element.offsetHeight || element.getClientRects().length;
    };
  
    window.Modal = Modal;
  
    //initialize the Modal objects
    var modals = document.getElementsByClassName('js-modal');
    // generic focusable elements string selector
    var focusableElString = '[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex]:not([tabindex="-1"]), [contenteditable], audio[controls], video[controls], summary';
    if( modals.length > 0 ) {
      var modalArrays = [];
      for( var i = 0; i < modals.length; i++) {
        (function(i){modalArrays.push(new Modal(modals[i]));})(i);
      }
  
      window.addEventListener('keydown', function(event){ //close modal window on esc
        if(event.keyCode && event.keyCode == 27 || event.key && event.key.toLowerCase() == 'escape') {
          for( var i = 0; i < modalArrays.length; i++) {
            (function(i){modalArrays[i].closeModal();})(i);
          };
        }
      });
    }
  }());
// File#: _1_reading-progressbar
// Usage: codyhouse.co/license
(function() {
    var readingIndicator = document.getElementsByClassName('js-reading-progressbar')[0],
      readingIndicatorContent = document.getElementsByClassName('js-reading-content')[0];
    
    if( readingIndicator && readingIndicatorContent) {
      var progressInfo = [],
        progressEvent = false,
        progressFallback = readingIndicator.getElementsByClassName('js-reading-progressbar__fallback')[0],
        progressIsSupported = 'value' in readingIndicator;
  
      var boundingClientRect = readingIndicatorContent.getBoundingClientRect();
  
      progressInfo['height'] = readingIndicatorContent.offsetHeight;
      progressInfo['top'] = boundingClientRect.top;
      progressInfo['bottom'] = boundingClientRect.bottom;
      progressInfo['window'] = window.innerHeight;
      progressInfo['class'] = 'reading-progressbar--is-active';
      progressInfo['hideClass'] = 'reading-progressbar--is-out';
      
      //init indicator
      setProgressIndicator();
      // wait for font to be loaded - reset progress bar
      if(document.fonts) {
        document.fonts.ready.then(function() {
          triggerReset();
        });
      }
      // listen to window resize - update progress
      window.addEventListener('resize', function(event){
        triggerReset();
      });
  
      //listen to the window scroll event - update progress
      window.addEventListener('scroll', function(event){
        if(progressEvent) return;
        progressEvent = true;
        (!window.requestAnimationFrame) ? setTimeout(function(){setProgressIndicator();}, 250) : window.requestAnimationFrame(setProgressIndicator);
      });
      
      function setProgressIndicator() {
        var boundingClientRect = readingIndicatorContent.getBoundingClientRect();
        progressInfo['top'] = boundingClientRect.top;
        progressInfo['bottom'] = boundingClientRect.bottom;
  
        if(progressInfo['height'] <= progressInfo['window']) {
          // short content - hide progress indicator
          Util.removeClass(readingIndicator, progressInfo['class']);
          progressEvent = false;
          return;
        }
        // get new progress and update element
        Util.addClass(readingIndicator, progressInfo['class']);
        var value = (progressInfo['top'] >= 0) ? 0 : 100*(0 - progressInfo['top'])/(progressInfo['height'] - progressInfo['window']);
        readingIndicator.setAttribute('value', value);
        if(!progressIsSupported && progressFallback) progressFallback.style.width = value+'%';
        // hide progress bar when target is outside the viewport
        Util.toggleClass(readingIndicator, progressInfo['hideClass'], progressInfo['bottom'] <= 0);
        progressEvent = false;
      };
  
      function triggerReset() {
        if(progressEvent) return;
        progressEvent = true;
        (!window.requestAnimationFrame) ? setTimeout(function(){resetProgressIndicator();}, 250) : window.requestAnimationFrame(resetProgressIndicator);
      };
  
      function resetProgressIndicator() {
        progressInfo['height'] = readingIndicatorContent.offsetHeight;
        progressInfo['window'] = window.innerHeight;
        setProgressIndicator();
      };
    }
  }());
// File#: _1_reveal-effects
// Usage: codyhouse.co/license
(function() {
	var fxElements = document.getElementsByClassName('reveal-fx');
	var intersectionObserverSupported = ('IntersectionObserver' in window && 'IntersectionObserverEntry' in window && 'intersectionRatio' in window.IntersectionObserverEntry.prototype);
	if(fxElements.length > 0) {
		// deactivate effect if Reduced Motion is enabled
		if (Util.osHasReducedMotion() || !intersectionObserverSupported) {
			fxRemoveClasses();
			return;
		}
		//on small devices, do not animate elements -> reveal all
		if( fxDisabled(fxElements[0]) ) {
			fxRevealAll();
			return;
		}

		var fxRevealDelta = 120; // amount (in pixel) the element needs to enter the viewport to be revealed - if not custom value (data-reveal-fx-delta)
		
		var viewportHeight = window.innerHeight,
			fxChecking = false,
			fxRevealedItems = [],
			fxElementDelays = fxGetDelays(), //elements animation delay
			fxElementDeltas = fxGetDeltas(); // amount (in px) the element needs enter the viewport to be revealed (default value is fxRevealDelta) 
		
		
		// add event listeners
		window.addEventListener('load', fxReveal);
		window.addEventListener('resize', fxResize);
		window.addEventListener('restartAll', fxRestart);

		// observe reveal elements
		var observer = [];
		initObserver();

		function initObserver() {
			for(var i = 0; i < fxElements.length; i++) {
				observer[i] = new IntersectionObserver(
					function(entries, observer) { 
						if(entries[0].isIntersecting) {
							fxRevealItemObserver(entries[0].target);
							observer.unobserve(entries[0].target);
						}
					}, 
					{rootMargin: "0px 0px -"+fxElementDeltas[i]+"px 0px"}
				);
	
				observer[i].observe(fxElements[i]);
			}
		};

		function fxRevealAll() { // reveal all elements - small devices
			for(var i = 0; i < fxElements.length; i++) {
				Util.addClass(fxElements[i], 'reveal-fx--is-visible');
			}
		};

		function fxResize() { // on resize - check new window height and reveal visible elements
			if(fxChecking) return;
			fxChecking = true;
			(!window.requestAnimationFrame) ? setTimeout(function(){fxReset();}, 250) : window.requestAnimationFrame(fxReset);
		};

		function fxReset() {
			viewportHeight = window.innerHeight;
			fxReveal();
		};

		function fxReveal() { // reveal visible elements
			for(var i = 0; i < fxElements.length; i++) {(function(i){
				if(fxRevealedItems.indexOf(i) != -1 ) return; //element has already been revelead
				if(fxElementIsVisible(fxElements[i], i)) {
					fxRevealItem(i);
					fxRevealedItems.push(i);
				}})(i); 
			}
			fxResetEvents(); 
			fxChecking = false;
		};

		function fxRevealItem(index) {
			if(fxElementDelays[index] && fxElementDelays[index] != 0) {
				// wait before revealing element if a delay was added
				setTimeout(function(){
					Util.addClass(fxElements[index], 'reveal-fx--is-visible');
				}, fxElementDelays[index]);
			} else {
				Util.addClass(fxElements[index], 'reveal-fx--is-visible');
			}
		};

		function fxRevealItemObserver(item) {
			var index = Util.getIndexInArray(fxElements, item);
			if(fxRevealedItems.indexOf(index) != -1 ) return; //element has already been revelead
			fxRevealItem(index);
			fxRevealedItems.push(index);
			fxResetEvents(); 
			fxChecking = false;
		};

		function fxGetDelays() { // get anmation delays
			var delays = [];
			for(var i = 0; i < fxElements.length; i++) {
				delays.push( fxElements[i].getAttribute('data-reveal-fx-delay') ? parseInt(fxElements[i].getAttribute('data-reveal-fx-delay')) : 0);
			}
			return delays;
		};

		function fxGetDeltas() { // get reveal delta
			var deltas = [];
			for(var i = 0; i < fxElements.length; i++) {
				deltas.push( fxElements[i].getAttribute('data-reveal-fx-delta') ? parseInt(fxElements[i].getAttribute('data-reveal-fx-delta')) : fxRevealDelta);
			}
			return deltas;
		};

		function fxDisabled(element) { // check if elements need to be animated - no animation on small devices
			return !(window.getComputedStyle(element, '::before').getPropertyValue('content').replace(/'|"/g, "") == 'reveal-fx');
		};

		function fxElementIsVisible(element, i) { // element is inside viewport
			return (fxGetElementPosition(element) <= viewportHeight - fxElementDeltas[i]);
		};

		function fxGetElementPosition(element) { // get top position of element
			return element.getBoundingClientRect().top;
		};

		function fxResetEvents() { 
			if(fxElements.length > fxRevealedItems.length) return;
			// remove event listeners if all elements have been revealed
			window.removeEventListener('load', fxReveal);
			window.removeEventListener('resize', fxResize);
		};

		function fxRemoveClasses() {
			// Reduced Motion on or Intersection Observer not supported
			while(fxElements[0]) {
				// remove all classes starting with 'reveal-fx--'
				var classes = fxElements[0].getAttribute('class').split(" ").filter(function(c) {
					return c.lastIndexOf('reveal-fx--', 0) !== 0;
				});
				fxElements[0].setAttribute('class', classes.join(" ").trim());
				Util.removeClass(fxElements[0], 'reveal-fx');
			}
		};

		function fxRestart() {
      // restart the reveal effect -> hide all elements and re-init the observer
      if (Util.osHasReducedMotion() || !intersectionObserverSupported || fxDisabled(fxElements[0])) {
        return;
      }
      // check if we need to add the event listensers back
      if(fxElements.length <= fxRevealedItems.length) {
        window.addEventListener('load', fxReveal);
        window.addEventListener('resize', fxResize);
      }
      // remove observer and reset the observer array
      for(var i = 0; i < observer.length; i++) {
        if(observer[i]) observer[i].disconnect();
      }
      observer = [];
      // remove visible class
      for(var i = 0; i < fxElements.length; i++) {
        Util.removeClass(fxElements[i], 'reveal-fx--is-visible');
      }
      // reset fxRevealedItems array
      fxRevealedItems = [];
      // restart observer
      initObserver();
    };
	}
}());
// File#: _1_social-sharing
// Usage: codyhouse.co/license
(function() {
    function initSocialShare(button) {
      button.addEventListener('click', function(event){
        event.preventDefault();
        var social = button.getAttribute('data-social');
        var url = getSocialUrl(button, social);
        (social == 'mail')
          ? window.location.href = url
          : window.open(url, social+'-share-dialog', 'width=626,height=436');
      });
    };
  
    function getSocialUrl(button, social) {
      var params = getSocialParams(social);
      var newUrl = '';
      for(var i = 0; i < params.length; i++) {
        var paramValue = button.getAttribute('data-'+params[i]);
        if(params[i] == 'hashtags') paramValue = encodeURI(paramValue.replace(/\#| /g, ''));
        if(paramValue) {
          (social == 'facebook') 
            ? newUrl = newUrl + 'u='+encodeURIComponent(paramValue)+'&'
            : newUrl = newUrl + params[i]+'='+encodeURIComponent(paramValue)+'&';
        }
      }
      if(social == 'linkedin') newUrl = 'mini=true&'+newUrl;
      return button.getAttribute('href')+'?'+newUrl;
    };
  
    function getSocialParams(social) {
      var params = [];
      switch (social) {
        case 'twitter':
          params = ['text', 'hashtags'];
          break;
        case 'facebook':
        case 'linkedin':
          params = ['url'];
          break;
        case 'pinterest':
          params = ['url', 'media', 'description'];
          break;
        case 'mail':
          params = ['subject', 'body'];
          break;
      }
      return params;
    };
  
    var socialShare = document.getElementsByClassName('js-social-share');
    if(socialShare.length > 0) {
      for( var i = 0; i < socialShare.length; i++) {
        (function(i){initSocialShare(socialShare[i])})(i);
      }
    }
  }());
// File#: _1_stacking-cards
// Usage: codyhouse.co/license
(function() {
    var StackCards = function(element) {
      this.element = element;
      this.items = this.element.getElementsByClassName('js-stack-cards__item');
      this.scrollingFn = false;
      this.scrolling = false;
      initStackCardsEffect(this); 
      initStackCardsResize(this); 
    };
  
    function initStackCardsEffect(element) { // use Intersection Observer to trigger animation
      setStackCards(element); // store cards CSS properties
      var observer = new IntersectionObserver(stackCardsCallback.bind(element), { threshold: [0, 1] });
      observer.observe(element.element);
    };
  
    function initStackCardsResize(element) { // detect resize to reset gallery
      element.element.addEventListener('resize-stack-cards', function(){
        setStackCards(element);
        animateStackCards.bind(element);
      });
    };
    
    function stackCardsCallback(entries) { // Intersection Observer callback
      if(entries[0].isIntersecting) {
        if(this.scrollingFn) return; // listener for scroll event already added
        stackCardsInitEvent(this);
      } else {
        if(!this.scrollingFn) return; // listener for scroll event already removed
        window.removeEventListener('scroll', this.scrollingFn);
        this.scrollingFn = false;
      }
    };
    
    function stackCardsInitEvent(element) {
      element.scrollingFn = stackCardsScrolling.bind(element);
      window.addEventListener('scroll', element.scrollingFn);
    };
  
    function stackCardsScrolling() {
      if(this.scrolling) return;
      this.scrolling = true;
      window.requestAnimationFrame(animateStackCards.bind(this));
    };
  
    function setStackCards(element) {
      // store wrapper properties
      element.marginY = getComputedStyle(element.element).getPropertyValue('--stack-cards-gap');
      getIntegerFromProperty(element); // convert element.marginY to integer (px value)
      element.elementHeight = element.element.offsetHeight;
  
      // store card properties
      var cardStyle = getComputedStyle(element.items[0]);
      element.cardTop = Math.floor(parseFloat(cardStyle.getPropertyValue('top')));
      element.cardHeight = Math.floor(parseFloat(cardStyle.getPropertyValue('height')));
  
      // store window property
      element.windowHeight = window.innerHeight;
  
      // reset margin + translate values
      if(isNaN(element.marginY)) {
        element.element.style.paddingBottom = '0px';
      } else {
        element.element.style.paddingBottom = (element.marginY*(element.items.length - 1))+'px';
      }
  
      for(var i = 0; i < element.items.length; i++) {
        if(isNaN(element.marginY)) {
          element.items[i].style.transform = 'none;';
        } else {
          element.items[i].style.transform = 'translateY('+element.marginY*i+'px)';
        }
      }
    };
  
    function getIntegerFromProperty(element) {
      var node = document.createElement('div');
      node.setAttribute('style', 'opacity:0; visbility: hidden;position: absolute; height:'+element.marginY);
      element.element.appendChild(node);
      element.marginY = parseInt(getComputedStyle(node).getPropertyValue('height'));
      element.element.removeChild(node);
    };
  
    function animateStackCards() {
      if(isNaN(this.marginY)) { // --stack-cards-gap not defined - do not trigger the effect
        this.scrolling = false;
        return; 
      }
  
      var top = this.element.getBoundingClientRect().top;
  
      if( this.cardTop - top + this.element.windowHeight - this.elementHeight - this.cardHeight + this.marginY + this.marginY*this.items.length > 0) { 
        this.scrolling = false;
        return;
      }
  
      for(var i = 0; i < this.items.length; i++) { // use only scale
        var scrolling = this.cardTop - top - i*(this.cardHeight+this.marginY);
        if(scrolling > 0) {  
          var scaling = i == this.items.length - 1 ? 1 : (this.cardHeight - scrolling*0.05)/this.cardHeight;
          this.items[i].style.transform = 'translateY('+this.marginY*i+'px) scale('+scaling+')';
        } else {
          this.items[i].style.transform = 'translateY('+this.marginY*i+'px)';
        }
      }
  
      this.scrolling = false;
    };
  
    // initialize StackCards object
    var stackCards = document.getElementsByClassName('js-stack-cards'),
      intersectionObserverSupported = ('IntersectionObserver' in window && 'IntersectionObserverEntry' in window && 'intersectionRatio' in window.IntersectionObserverEntry.prototype),
      reducedMotion = Util.osHasReducedMotion();
      
    if(stackCards.length > 0 && intersectionObserverSupported && !reducedMotion) { 
      var stackCardsArray = [];
      for(var i = 0; i < stackCards.length; i++) {
        (function(i){
          stackCardsArray.push(new StackCards(stackCards[i]));
        })(i);
      }
      
      var resizingId = false,
        customEvent = new CustomEvent('resize-stack-cards');
      
      window.addEventListener('resize', function() {
        clearTimeout(resizingId);
        resizingId = setTimeout(doneResizing, 500);
      });
  
      function doneResizing() {
        for( var i = 0; i < stackCardsArray.length; i++) {
          (function(i){stackCardsArray[i].element.dispatchEvent(customEvent)})(i);
        };
      };
    }
  }());
// File#: _1_sticky-hero
// Usage: codyhouse.co/license
(function() {
	var StickyBackground = function(element) {
	  this.element = element;
	  this.scrollingElement = this.element.getElementsByClassName('sticky-hero__content')[0];
	  this.nextElement = this.element.nextElementSibling;
	  this.scrollingTreshold = 0;
	  this.nextTreshold = 0;
	  initStickyEffect(this);
	};
  
	function initStickyEffect(element) {
	  var observer = new IntersectionObserver(stickyCallback.bind(element), { threshold: [0, 0.1, 1] });
	  observer.observe(element.scrollingElement);
	  if(element.nextElement) observer.observe(element.nextElement);
	};
  
	function stickyCallback(entries, observer) {
	  var threshold = entries[0].intersectionRatio.toFixed(1);
	  (entries[0].target ==  this.scrollingElement)
		? this.scrollingTreshold = threshold
		: this.nextTreshold = threshold;
  
	  Util.toggleClass(this.element, 'sticky-hero--media-is-fixed', (this.nextTreshold > 0 || this.scrollingTreshold > 0));
	};
  
  
	var stickyBackground = document.getElementsByClassName('js-sticky-hero'),
	  intersectionObserverSupported = ('IntersectionObserver' in window && 'IntersectionObserverEntry' in window && 'intersectionRatio' in window.IntersectionObserverEntry.prototype);
	if(stickyBackground.length > 0 && intersectionObserverSupported) { // if IntersectionObserver is not supported, animations won't be triggeres
	  for(var i = 0; i < stickyBackground.length; i++) {
		(function(i){ // if animations are enabled -> init the StickyBackground object
		  if( Util.hasClass(stickyBackground[i], 'sticky-hero--overlay-layer') || Util.hasClass(stickyBackground[i], 'sticky-hero--scale')) new StickyBackground(stickyBackground[i]);
		})(i);
	  }
	}
  }());
// File#: _1_theme-switch
// Usage: codyhouse.co/license


  (function() {
  var t = document.getElementById("switch-light-dark");
  if (t) {
      var e = document.getElementsByTagName("html")[0]
        , n = t.querySelector('input[value="dark"]');
      "dark" == e.getAttribute("data-theme") && (n.checked = !0),
      t.addEventListener("change", function(t) {
          "dark" == t.target.value ? (e.setAttribute("data-theme", "dark"),
          localStorage.setItem("themeSwitch", "dark")) : (e.removeAttribute("data-theme"),
          localStorage.setItem("themeSwitch", "light"))
      })
  }
}());

// File#: _1_vertical-timeline
// Usage: codyhouse.co/license
(function() {
    var VTimeline = function(element) {
      this.element = element;
      this.sections = this.element.getElementsByClassName('js-v-timeline__section');
      this.animate = this.element.getAttribute('data-animation') && this.element.getAttribute('data-animation') == 'on' ? true : false;
      this.animationClass = 'v-timeline__section--animate';
      this.animationDelta = '-150px';
      initVTimeline(this);
    };
  
    function initVTimeline(element) {
      if(!element.animate) return;
      for(var i = 0; i < element.sections.length; i++) {
        var observer = new IntersectionObserver(vTimelineCallback.bind(element, i),
        {rootMargin: "0px 0px "+element.animationDelta+" 0px"});
        observer.observe(element.sections[i]);
      }
    };
  
    function vTimelineCallback(index, entries, observer) {
      if(entries[0].isIntersecting) {
        Util.addClass(this.sections[index], this.animationClass);
        observer.unobserve(this.sections[index]);
      } 
    };
  
    //initialize the VTimeline objects
    var timelines = document.querySelectorAll('.js-v-timeline'),
      intersectionObserverSupported = ('IntersectionObserver' in window && 'IntersectionObserverEntry' in window && 'intersectionRatio' in window.IntersectionObserverEntry.prototype),
      reducedMotion = Util.osHasReducedMotion();
    if( timelines.length > 0) {
      for( var i = 0; i < timelines.length; i++) {
        if(intersectionObserverSupported && !reducedMotion) (function(i){new VTimeline(timelines[i]);})(i);
        else timelines[i].removeAttribute('data-animation');
      }
    }
  }());
// File#: _2_points-of-interest
// Usage: codyhouse.co/license
(function() {
    function initPoi(element) {
      element.addEventListener('click', function(event){
        var poiItem = event.target.closest('.js-poi__item');
        if(poiItem) Util.addClass(poiItem, 'poi__item--visited');
      });
    };
  
    var poi = document.getElementsByClassName('js-poi');
    for(var i = 0; i < poi.length; i++) {
      (function(i){initPoi(poi[i]);})(i);
    }
  }());
// File#: _2_pricing-table
// Usage: codyhouse.co/license
(function() {
    // NOTE: you need the js code only when using the --has-switch variation of the pricing table
    // default version does not require js
    var pTable = document.getElementsByClassName('js-p-table--has-switch');
    if(pTable.length > 0) {
      for(var i = 0; i < pTable.length; i++) {
        (function(i){ addPTableEvent(pTable[i]);})(i);
      }
  
      function addPTableEvent(element) {
        var pSwitch = element.getElementsByClassName('js-p-table__switch')[0];
        if(pSwitch) {
          pSwitch.addEventListener('change', function(event) {
            Util.toggleClass(element, 'p-table--yearly', (event.target.value == 'yearly'));
          });
        }
      }
    }
  }());
// File#: _2_sticky-sharebar
// Usage: codyhouse.co/license
(function() {
    var StickyShareBar = function(element) {
      this.element = element;
      this.contentTarget = document.getElementsByClassName('js-sticky-sharebar-target');
      this.contentTargetOut = document.getElementsByClassName('js-sticky-sharebar-target-out');
      this.showClass = 'sticky-sharebar--on-target';
      this.threshold = '50%'; // Share Bar will be revealed when .js-sticky-sharebar-target element reaches 50% of the viewport
      initShareBar(this);
      initTargetOut(this);
    };
  
    function initShareBar(shareBar) {
      if(shareBar.contentTarget.length < 1) {
        shareBar.showSharebar = true;
        Util.addClass(shareBar.element, shareBar.showClass);
        return;
      }
      if(intersectionObserverSupported) {
        shareBar.showSharebar = false;
        initObserver(shareBar); // update anchor appearance on scroll
      } else {
        Util.addClass(shareBar.element, shareBar.showClass);
      }
    };
  
    function initObserver(shareBar) { // target of Sharebar
      var observer = new IntersectionObserver(
        function(entries, observer) { 
          shareBar.showSharebar = entries[0].isIntersecting;
          toggleSharebar(shareBar);
        }, 
        {rootMargin: "0px 0px -"+shareBar.threshold+" 0px"}
      );
      observer.observe(shareBar.contentTarget[0]);
    };
  
    function initTargetOut(shareBar) { // target out of Sharebar
      shareBar.hideSharebar = false;
      if(shareBar.contentTargetOut.length < 1) {
        return;
      }
      var observer = new IntersectionObserver(
        function(entries, observer) { 
          shareBar.hideSharebar = entries[0].isIntersecting;
          toggleSharebar(shareBar);
        }
      );
      observer.observe(shareBar.contentTargetOut[0]);
    };
  
    function toggleSharebar(shareBar) {
      Util.toggleClass(shareBar.element, shareBar.showClass, shareBar.showSharebar && !shareBar.hideSharebar);
    };
  
    //initialize the StickyShareBar objects
    var stickyShareBar = document.getElementsByClassName('js-sticky-sharebar'),
      intersectionObserverSupported = ('IntersectionObserver' in window && 'IntersectionObserverEntry' in window && 'intersectionRatio' in window.IntersectionObserverEntry.prototype);
    
    if( stickyShareBar.length > 0 ) {
      for( var i = 0; i < stickyShareBar.length; i++) {
        (function(i){ new StickyShareBar(stickyShareBar[i]); })(i);
      }
    }
  }());