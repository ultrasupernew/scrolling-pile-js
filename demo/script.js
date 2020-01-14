/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./dist/script.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "../scrolling-pile.js":
/*!****************************!*\
  !*** ../scrolling-pile.js ***!
  \****************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return ScrollingPile; });\nclass ScrollingPile {\n    constructor(cssSelector, options = {}, afterLoad = null) {\n        this.container = document.querySelector(cssSelector);\n        this.slides = this.container.querySelectorAll('.section');\n        this.current = 0;\n        this.scrollings = []; // Records the scrollings\n        this.lastAnimation = 0;\n        this.delta = 0;\n\n        // For touch events\n        this.touchStartY;\n        this.touchStartX;\n\n        // Options\n        // TODO : horizontal\n        this.options = {\n            scrollingSpeed: options.scrollingSpeed || 700,\n            dotsNav: options.dotsNav || true,\n            numbersNav: options.numbersNav || false,\n            infinite: options.infinite || false,\n            dotsColor: options.dotsColor || '#000000',\n            numbersColor: options.numbersColor || '#000000',\n            positionDotsNav: options.positionDotsNav || 'right',\n            positionNumbersNav: options.positionNumbersNav || 'right',\n            direction: options.direction || 'vertical',\n            touchSensitivity: options.touchSensitivity || 5,\n            backgroundColors: options.backgroundColors || [],\n        };\n\n        // After load callback function\n        this.afterLoad = afterLoad;\n\n        // For the wheel event\n        this.prevTime = new Date().getTime();\n\n        // Adds a \"save zone\" for devices such as Apple laptops and Apple magic mouses\n        this.scrollDelay = 400;\n\n        // Add the class 'active' on the first child\n        this.slides[0].classList.add('active');\n\n        // Updating CSS properties\n        if(this.options.dotsColor !== \"#000000\") { // Change the CSS property about the dots color\n            document.documentElement.style.setProperty('--dots-color', this.options.dotsColor);\n        }\n        if(this.options.numbersColor !== \"#000000\") { // Change the CSS property about the numbers color\n            document.documentElement.style.setProperty('--numbers-color', this.options.numbersColor);\n        }\n        if(this.options.scrollingSpeed !== 700) { // Change the CSS property about the scrolling speed\n            document.documentElement.style.setProperty('--scrolling-speed', this.options.scrollingSpeed/1000 + 's');\n        }\n\n        // Put the slides in the right order\n        // Wrap the content in an inner div\n        // Add all the classes needed\n        for(let i = 0; i < this.slides.length; i++) {\n            this.slides[i].style.zIndex = this.slides.length - i;\n            this.slides[i].classList.add('sp-section');\n\n            // Modify background-color of the slide if defined in the array in options\n            if(i <= this.options.backgroundColors.length-1) {\n                this.slides[i].style.backgroundColor = this.options.backgroundColors[i];\n            }\n\n            // If this is a long slide that can be scrolled before changing slide\n            if(!this.isScrollable()) {\n                let innerDiv = document.createElement('div');\n                innerDiv.style.Height = '100%';\n                innerDiv.innerHTML = this.slides[i].innerHTML;\n                this.slides[i].innerHTML = '';\n\n                this.slides[i].classList.add('sp-table');\n                innerDiv.classList.add('sp-tableCell');\n\n                this.slides[i].appendChild(innerDiv);\n            }\n        }\n\n        // Add the overflow hidden and the height 100vh on the container\n        this.container.style.overflow = 'hidden';\n        this.container.style.toucheAction = 'none';\n\n        // Create the dot navigation, if true in options\n        if(this.options.dotsNav) {\n            this.createDotsNav();\n        }\n\n        // Create the number navigation, if true in options\n        if(this.options.numbersNav) {\n            this.createNumbersNav();\n        }\n\n        // Add the scrolling behavior\n        this.scrollingBehavior(true);\n    }\n\n    /**\n     * Creates a DOM node for the dot navigation and attaches it to the container Node\n     */\n    createDotsNav() {\n        let dotsNav = document.createElement('ul');\n        dotsNav.classList.add('sp-dotsnav');\n\n        // Add the css class for the right position\n        dotsNav.classList.add('sp-dotsnav--' + this.options.positionDotsNav);\n\n        for(let i = 0; i < this.slides.length; i++) {\n            let dotsNavItem = document.createElement('li');\n            dotsNavItem.classList.add('sp-dotsnav__item');\n            dotsNavItem.dataset.page = i;\n            dotsNavItem.addEventListener('click', this.clickNavHandler.bind(this));\n            if(i == 0) dotsNavItem.classList.add('active');\n            dotsNav.appendChild(dotsNavItem);\n        }\n\n        this.container.appendChild(dotsNav);\n        this.dotsNav = dotsNav.children;\n    }\n    /**\n     * Creates a DOM node for the number navigation and attaches it to the container Node\n     */\n    createNumbersNav() {\n        let numbersNav = document.createElement('ul');\n        numbersNav.classList.add('sp-numbersnav');\n\n        // Add the css class for the right position\n        numbersNav.classList.add('sp-numbersnav--' + this.options.positionNumbersNav);\n\n        for(let i = 0; i < this.slides.length; i++) {\n            let numbersNavItem = document.createElement('li');\n            numbersNavItem.classList.add('sp-numbersnav__item');\n            numbersNavItem.innerHTML = i+1;\n            numbersNavItem.dataset.page = i;\n            numbersNavItem.addEventListener('click', this.clickNavHandler.bind(this));\n            if(i == 0) numbersNavItem.classList.add('active');\n            numbersNav.appendChild(numbersNavItem);\n        }\n\n        this.container.appendChild(numbersNav);\n        this.numbersNav = numbersNav.children;\n    }\n\n    /**\n     * Handler function to scroll page when a nav element is clicked\n     * \n     * @param {event} e \n     */\n    clickNavHandler(e) {\n        if(this.current > e.target.dataset.page) {\n            this.delta = 1; // If going up or left\n        }\n        else {\n            this.delta = -1; // If going down or right\n        }\n        this.scrollPage(this.slides[e.target.dataset.page], e.target.dataset.page);\n    }\n\n    /**\n     * Will add or remove event listeners in function of value\n     * \n     * @param {boolean} value true = add event listeners. false = remove event listeners.\n     */\n    scrollingBehavior(value) {\n        if(value) {\n            this.addMouseWheelHandler();\n            this.addTouchHandler();\n        }\n        else {\n            this.removeMouseWheelHandler();\n            this.removeTouchHandler();\n        }\n    }\n\n    /**\n     * Add the differents event Listeners of the mouse wheel for compatibility.\n     */\n    addMouseWheelHandler() {\n        if(this.slides[this.current].addEventListener) {\n            this.slides[this.current].addEventListener('mousewheel', this.MouseWheelHandler.bind(this), false); //IE9, Chrome, Safari, Opera\n            this.slides[this.current].addEventListener('wheel', this.MouseWheelHandler.bind(this), false); //Firefox\n        }\n        else {\n            this.slides[this.current].attachEvent('onmousewheel', this.MouseWheelHandler.bind(this)); //IE 6/7/8\n        }\n    }\n    /**\n     * Remove all the event Listeners of the mouse wheel for compatibility.\n     */\n    removeMouseWheelHandler() {\n        if(this.slides[this.current].removeEventListener) {\n            this.slides[this.current].removeEventListener('mousewheel', this.MouseWheelHandler.bind(this), false); //IE9, Chrome, Safari, Opera\n            this.slides[this.current].removeEventListener('wheel', this.MouseWheelHandler.bind(this), false); //Firefox\n        }\n        else {\n            this.slides[this.current].detachEvent('onmousewheel', this.MouseWheelHandler.bind(this)); //IE 6/7/8\n        }\n    }\n\n    /**\n     * Add the event Listeners touchstart and touchmove.\n     */\n    addTouchHandler() {\n        this.container.addEventListener('touchstart', this.touchStartHandler.bind(this));\n        this.container.addEventListener('touchmove', this.touchMoveHandler.bind(this));\n    }\n    /**\n     * Remove the event Listeners touchstart and touchmove.\n     */\n    removeTouchHandler() {\n        this.container.removeEventListener('touchstart', this.touchStartHandler.bind(this));\n        this.container.removeEventListener('touchmove', this.touchMoveHandler.bind(this));\n    }\n\n    /**\n     * Getting the starting positions of the touch event\n     * \n     * @param {event} e\n     */\n    touchStartHandler(e){\n        this.touchStartY = e.touches[0].clientY;\n        this.touchStartX = e.touches[0].clientX;\n    }\n\n    /** \n     * Manipulations of the touch move event.\n     * Set if this is a scroll up or down.\n     * Manage the history of scrolling.\n     * Decide if the touchmove is consider as a scroll.\n     * \n     * \n     * @param {event} e\n     */\n    touchMoveHandler(e){\n        let curTime = new Date().getTime();\n\n        if(this.options.direction === 'vertical' && this.touchStartY > e.touches[0].clientY) {\n            this.delta = -1; // If scrolling down\n        }\n        else if(this.options.direction === 'horizontal' && this.touchStartX - e.touches[0].clientX > 20) {\n            this.delta = -1; // If scrolling right\n        }\n        else if(this.options.direction === 'horizontal' && e.touches[0].clientX - this.touchStartX > 20) {\n            this.delta = 1; // If scrolling left\n        }\n        else if(this.options.direction === 'vertical') {\n            this.delta = 1; // If scrolling up\n        }\n\n        // Limiting the array to 150 (!!memory!!)\n        if(this.scrollings.length > 149) {\n            this.scrollings.shift();\n        }\n\n        // Keeping record of the previous scroll\n        if(this.options.direction === 'vertical') {\n            this.scrollings.push(e.touches[0].clientY);\n        }\n        else if(this.options.direction === 'horizontal') {\n            this.scrollings.push(e.touches[0].clientX);\n        }\n\n        // Time difference between the last scroll and this one\n        let timeDiff = curTime - this.prevTime;\n        this.prevTime = curTime;\n\n        // Haven't they scrolled in a while?\n        // (enough to be consider a different scrolling action to scroll another section)\n        if(timeDiff > 200){\n            //emptying the array, we dont care about old scrollings for our averages\n            this.scrollings = [];\n        }\n\n        // If the current section is not already moving\n        if(!this.isMoving()) {\n            let averageEnd = this.getAverage(this.scrollings, 10);\n            let averageMiddle = this.getAverage(this.scrollings, 70);\n            let isAccelarating = averageEnd >= averageMiddle;\n            let scrollable = this.isScrollable();\n\n            // If the user scroll enough to pass to the next slide\n            if(isAccelarating) {\n                // Scrolling down\n                if(this.delta < 0) {\n                    this.scrolling(this.options.direction === 'vertical' ? 'down' : 'right', scrollable);\n                }\n                else if(this.delta > 0) {\n                    this.scrolling(this.options.direction === 'vertical' ? 'up' : 'left', scrollable);\n                }\n            }\n\n            return false;\n        }\n    }\n\n    /**\n     * Manipulations of the mouse wheel event.\n     * Set if this is a scroll up or down.\n     * Manage the history of scrolling.\n     * Decide if the touchmove is consider as a scroll.\n     * \n     * @param {event} e \n     */\n    MouseWheelHandler(e) {\n        let curTime = new Date().getTime();\n\n        // Cross-browser wheel delta\n        e = e || window.event;\n        let value = this.options.direction === 'vertical' ? (e.wheelDelta || -e.deltaY || -e.detail) : -e.deltaX;\n        this.delta = Math.max(-1, Math.min(1, value)); // If scrolling up or down\n\n        let horizontalDetection = typeof e.wheelDeltaX !== 'undefined' || typeof e.deltaX !== 'undefined';\n        let isScrollingVertically = (Math.abs(e.wheelDeltaX) < Math.abs(e.wheelDelta)) ||(Math.abs(e.deltaX) < Math.abs(e.deltaY) || !horizontalDetection);\n\n        // Limiting the array to 150 (!!memory!!)\n        if(this.scrollings.length > 149) {\n            this.scrollings.shift();\n        }\n\n        // Keeping record of the previous scroll\n        this.scrollings.push(Math.abs(value));\n\n        // Time difference between the last scroll and this one\n        let timeDiff = curTime - this.prevTime;\n        this.prevTime = curTime;\n\n        // Haven't they scrolled in a while?\n        // (enough to be consider a different scrolling action to scroll another section)\n        if(timeDiff > 200){\n            //emptying the array, we dont care about old scrollings for our averages\n            this.scrollings = [];\n        }\n\n        // If the current section is not moving\n        if(!this.isMoving()) {\n            let averageEnd = this.getAverage(this.scrollings, 10);\n            let averageMiddle = this.getAverage(this.scrollings, 70);\n            let isAccelarating = averageEnd >= averageMiddle;\n            let scrollable = this.isScrollable();\n\n            // If the user scroll enough to passe to another slide\n            if(isAccelarating) {\n                // horizontal\n                if(!isScrollingVertically && this.options.direction === 'horizontal') {\n                    // Scrolling down\n                    if(this.delta < 0) {\n                        this.scrolling('right', scrollable);\n                    }\n                    else if(this.delta > 0) {\n                        this.scrolling('left', scrollable);\n                    }\n                }\n                // vertical\n                else if(isScrollingVertically && this.options.direction === 'vertical') {\n                    // Scrolling down\n                    if(this.delta < 0) {\n                        this.scrolling('down', scrollable);\n                    }\n                    else if(this.delta > 0) {\n                        this.scrolling('up', scrollable);\n                    }\n                }\n            }\n\n            return false;\n        }\n    }\n\n    /**\n     * Returns if the current slide is already moving or not\n     * \n     * @return {boolean}\n     */\n    isMoving() {\n        let timeNow = new Date().getTime();\n\n        // Cancel the scroll if it's currently animating or within quiet period (scrollDelay)\n        if(timeNow - this.lastAnimation < this.scrollDelay + this.options.scrollingSpeed) {\n            return true;\n        }\n\n        return false;\n    }\n    /**\n     * \n     * \n     * @param {Array} elements \n     * @param {integer} number \n     */\n    getAverage(elements, number) {\n        let sum = 0;\n\n        // count elements from the end to make the average, if there are not enough returns 1\n        let lastElements = elements.slice(Math.max(elements.length - number, 1));\n\n        for(let i = 0; i < lastElements.length; i++) {\n            sum += lastElements[i];\n        }\n\n        return Math.ceil(sum/number);\n    }\n\n    /**\n     * Returns if the current slide is a long one that can be scrolled before changing to the next or previous slide.\n     * \n     * @return {boolean}\n     */\n    isScrollable() {\n        return this.slides[this.current].classList.contains('sp-scrollable');\n    }\n\n    /**\n     * Will say when to change to the next slide when this is a scrollable slide.\n     * \n     * @param {string} type \n     * @param {boolean} scrollable \n     */\n    scrolling(type, scrollable) {\n        let check = (type === 'down') || (type === 'right') ? 'bottom' : 'top';\n\n        if(scrollable) {\n            if(this.options.direction === 'vertical' && this.isScrolled(check, this.slides[this.current])) {\n                this.moveSection(type);\n            }\n            else if(this.options.direction === 'horizontal') {\n                this.moveSection(type);\n            }\n        }\n        else {\n            this.moveSection(type);\n        }\n    }\n\n    /**\n     * Update the index of the next slide and execute the scroll page.\n     * \n     * @param {string} type \n     */\n    moveSection(type) {\n        let index;\n\n        // Setting the new index in function of the movement\n        if(type === 'down' || type === 'right') {\n            if(this.current+1 < this.slides.length) {\n                index = this.current + 1;\n            }\n            // If the option infinite is set to true\n            else if(this.options.infinite) {\n                index = 0;\n                this.delta = 1;\n            }\n        }\n        else if(type === 'up' || type === 'left') {\n            if(this.current-1 >= 0) {\n                index = this.current - 1;\n            }\n            // If the option infinite is set to true\n            else if(this.options.infinite) {\n                index = this.slides.length - 1;\n                this.delta = -1;\n            }\n        }\n\n        if(typeof index !== 'undefined') {\n            this.scrollPage(this.slides[index], index);\n        }\n    }\n\n    /**\n     * Calculate if we scrolled at the end or beginning of a scrollable slide.\n     * \n     * @param {string} check \n     * @param {Node} elem \n     * \n     * @return {boolean}\n     */\n    isScrolled(check, elem) {\n        // If we are at the top of the slide\n        if(check === 'top' && elem.scrollTop === 0) {\n            return true;\n        }\n        // If we are at the bottom of the slide\n        else if(check == 'bottom' && elem.scrollTop == elem.scrollHeight - elem.clientHeight) {\n            return true;\n        }\n        return false;\n    }\n\n    /**\n     * \n     * @param {integer} destination \n     * @param {integer} index \n     */\n    scrollPage(destination, index) {\n        let v = {\n            destination: this.slides[index],\n            activeSection: this.slides[this.current],\n            sectionIndex: parseInt(index),\n        };\n\n        // Calculate how many sections to move\n        v.nbrSectionsToMove = this.sectionsToMove(v.sectionIndex);\n        \n        // Get the sections to move\n        v.sectionsToMove = this.getSectionsToMove(v);\n\n        // Quiting when activeSection is the target element\n        if(v.activeSection == v.destination) {\n            return;\n        }\n\n        // Add and remove active CSS classes\n        v.destination.classList.add('active');\n        v.activeSection.classList.remove('active');\n\n        // Scrolling (moving sections up making them disappear)\n        if(this.delta < 0 || v.sectionIndex > this.current) {\n            // down\n            if(this.options.direction === 'vertical') {\n                v.translate3d = 'translate3d(0px, -100%, 0px)';\n            }\n            else if(this.options.direction === 'horizontal') {\n                v.translate3d = 'translate3d(-100%, 0px, 0px)';\n            }\n\n            v.animateSection = v.activeSection;\n        }\n        // Scrolling up or left (moving section down to the viewport)\n        else {\n            v.translate3d = 'translate3d(0px, 0px, 0px)';\n\n            v.animateSection = destination;\n        }\n\n        this.updateSlide(this.delta, v.nbrSectionsToMove);\n\n        this.performMovement(v);\n\n        let timeNow = new Date().getTime();\n        this.lastAnimation = timeNow;\n    }\n\n    /**\n     * Remove the event listeners on the current slide and add them on the next one.\n     * Update the current index of slide.\n     * Update CSS classes of the navigations.\n     * \n     * @param {integer} delta \n     * @param {integer} nbrSectionsToMove \n     */\n    updateSlide(delta, nbrSectionsToMove) {\n        // Remove the event listeners of the active slide\n        this.scrollingBehavior(false);\n\n        if(this.options.dotsNav) {\n            this.dotsNav[this.current].classList.remove('active');\n        }\n        if(this.options.numbersNav) {\n            this.numbersNav[this.current].classList.remove('active');\n        }\n\n        // Update the current index of the slide\n        if(delta < 0) {\n            this.current += nbrSectionsToMove;\n        }\n        else if(delta > 0) {\n            this.current -= nbrSectionsToMove;\n        }\n\n        // Add the event listeners of the new slide\n        this.scrollingBehavior(true);\n\n        if(this.options.dotsNav) {\n            this.dotsNav[this.current].classList.add('active');\n        }\n        if(this.options.numbersNav) {\n            this.numbersNav[this.current].classList.add('active');\n        }\n    }\n\n    /**\n     * Return the number of sections to move from the current slide\n     * \n     * @param {integer} nbr \n     * \n     * @return {integer}\n     */\n    sectionsToMove(nbr) {\n        if(this.current - nbr > 0) {\n            return this.current - nbr;\n        }\n        return nbr - this.current;\n    }\n\n    /**\n     * Returns an array of all the slides to move from the current through the destination excluded.\n     * \n     * @param {Object} v \n     * \n     * @return {Array}\n     */\n    getSectionsToMove(v) {\n        let sections = [];\n\n        // When going down\n        if(this.current < v.sectionIndex) {\n            // Take all the slides from the current slide excluded through the destination slide excluded\n            for(let i = this.current + 1; i < v.sectionIndex; i++) {\n                sections.push(this.slides[i]);\n            }\n        }\n        // When going up\n        else {\n            for(let i = v.sectionIndex + 1; i < this.current; i++) {\n                sections.push(this.slides[i]);\n            }\n        }\n        return sections;\n    }\n\n    /**\n     * Do the animation of the changement of slide. CSS translation.\n     * Execute the function after scroll.\n     * \n     * @param {Object} v \n     */\n    performMovement(v) {\n        v.animateSection.style.transform = v.translate3d;\n\n        if(v.sectionsToMove.length > 0) {\n            for(let i = 0; i < v.sectionsToMove.length; i++) {\n                v.sectionsToMove[i].style.transform = v.translate3d;\n            }\n        }\n\n\n        // After the animation, execute the function callback\n        setTimeout(this.afterSectionLoads.bind(this), this.options.scrollingSpeed);\n    }\n\n    /**\n     * Execute the callback function if it is defines.\n     */\n    afterSectionLoads() {\n        if(this.afterLoad) {\n            this.afterLoad(this);\n        }\n    }\n\n    /**\n     * Destroy the current ScrollingPile\n     */\n    destroy() {\n        for(this.current = 0; this.current > this.slides; this.current++) {\n            this.scrollingBehavior(false);\n        }\n        this.container.style.overflow = 'inherit';\n        this.container.style.toucheAction = 'inherit';\n        delete this;\n    }\n}\n\n\n//# sourceURL=webpack:///../scrolling-pile.js?");

/***/ }),

/***/ "./dist/script.js":
/*!************************!*\
  !*** ./dist/script.js ***!
  \************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _scrolling_pile_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../scrolling-pile.js */ \"../scrolling-pile.js\");\n\n\nconst test = new _scrolling_pile_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"]('.container',{\n    scrollingSpeed: 200,\n    dotsColor: '#2196f3',\n    positionDotsNav: 'top',\n    numbersNav: true,\n    numbersColor: '#2196f3',\n    infinite: true,\n    backgroundColors: ['#FCFCFC', '#ACACAC', 'salmon', 'blue'],\n    direction: 'horizontal'\n}, function(obj) {\n    console.log(obj);\n});\n\n\n//# sourceURL=webpack:///./dist/script.js?");

/***/ })

/******/ });