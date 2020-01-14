export default class ScrollingPile {
    constructor(cssSelector, options = {}, afterLoad = null) {
        this.container = document.querySelector(cssSelector);
        this.slides = this.container.querySelectorAll('.section');
        this.current = 0;
        this.scrollings = []; // Records the scrollings
        this.lastAnimation = 0;
        this.delta = 0;

        // For touch events
        this.touchStartY;
        this.touchStartX;

        // Options
        // TODO : horizontal
        this.options = {
            scrollingSpeed: options.scrollingSpeed || 700,
            dotsNav: options.dotsNav || true,
            numbersNav: options.numbersNav || false,
            infinite: options.infinite || false,
            dotsColor: options.dotsColor || '#000000',
            numbersColor: options.numbersColor || '#000000',
            positionDotsNav: options.positionDotsNav || 'right',
            positionNumbersNav: options.positionNumbersNav || 'right',
            direction: options.direction || 'vertical',
            touchSensitivity: options.touchSensitivity || 5,
            backgroundColors: options.backgroundColors || []
        };

        // After load callback function
        this.afterLoad = afterLoad;

        // For the wheel event
        this.prevTime = new Date().getTime();

        // Adds a "save zone" for devices such as Apple laptops and Apple magic mouses
        this.scrollDelay = 400;

        // Add the class 'active' on the first child
        this.slides[0].classList.add('active');

        // Updating CSS properties
        if(this.options.dotsColor !== "#000000") { // Change the CSS property about the dots color
            document.documentElement.style.setProperty('--dots-color', this.options.dotsColor);
        }
        if(this.options.numbersColor !== "#000000") { // Change the CSS property about the numbers color
            document.documentElement.style.setProperty('--numbers-color', this.options.numbersColor);
        }
        if(this.options.scrollingSpeed !== 700) { // Change the CSS property about the scrolling speed
            document.documentElement.style.setProperty('--scrolling-speed', this.options.scrollingSpeed/1000 + 's');
        }

        // Put the slides in the right order
        // Wrap the content in an inner div
        // Add all the classes needed
        for(let i = 0; i < this.slides.length; i++) {
            this.slides[i].style.zIndex = this.slides.length - i;
            this.slides[i].classList.add('sp-section');

            // Modify background-color of the slide if defined in the array in options
            if(i <= this.options.backgroundColors.length-1) {
                this.slides[i].style.backgroundColor = this.options.backgroundColors[i];
            }

            // If this is a long slide that can be scrolled before changing slide
            if(!this.isScrollable()) {
                let innerDiv = document.createElement('div');
                innerDiv.style.Height = '100%';
                innerDiv.innerHTML = this.slides[i].innerHTML;
                this.slides[i].innerHTML = '';

                this.slides[i].classList.add('sp-table');
                innerDiv.classList.add('sp-tableCell');

                this.slides[i].appendChild(innerDiv);
            }
        }

        // Add the overflow hidden and the height 100vh on the container
        this.container.style.overflow = 'hidden';
        this.container.style.toucheAction = 'none';

        // Create the dot navigation, if true in options
        if(this.options.dotsNav) {
            this.createDotsNav();
        }

        // Create the number navigation, if true in options
        if(this.options.numbersNav) {
            this.createNumbersNav();
        }

        // Add the scrolling behavior
        this.scrollingBehavior(true);
    }

    /**
     * Creates a DOM node for the dot navigation and attaches it to the container Node
     */
    createDotsNav() {
        let dotsNav = document.createElement('ul');
        dotsNav.classList.add('sp-dotsnav');

        // Add the css class for the right position
        dotsNav.classList.add('sp-dotsnav--' + this.options.positionDotsNav);

        for(let i = 0; i < this.slides.length; i++) {
            let dotsNavItem = document.createElement('li');
            dotsNavItem.classList.add('sp-dotsnav__item');
            dotsNavItem.dataset.page = i;
            dotsNavItem.addEventListener('click', this.clickNavHandler.bind(this));
            if(i == 0) dotsNavItem.classList.add('active');
            dotsNav.appendChild(dotsNavItem);
        }

        this.container.appendChild(dotsNav);
        this.dotsNav = dotsNav.children;
    }
    /**
     * Creates a DOM node for the number navigation and attaches it to the container Node
     */
    createNumbersNav() {
        let numbersNav = document.createElement('ul');
        numbersNav.classList.add('sp-numbersnav');

        // Add the css class for the right position
        numbersNav.classList.add('sp-numbersnav--' + this.options.positionNumbersNav);

        for(let i = 0; i < this.slides.length; i++) {
            let numbersNavItem = document.createElement('li');
            numbersNavItem.classList.add('sp-numbersnav__item');
            numbersNavItem.innerHTML = i+1;
            numbersNavItem.dataset.page = i;
            numbersNavItem.addEventListener('click', this.clickNavHandler.bind(this));
            if(i == 0) numbersNavItem.classList.add('active');
            numbersNav.appendChild(numbersNavItem);
        }

        this.container.appendChild(numbersNav);
        this.numbersNav = numbersNav.children;
    }

    /**
     * Handler function to scroll page when a nav element is clicked
     * 
     * @param {event} e 
     */
    clickNavHandler(e) {
        if(this.current > e.target.dataset.page) {
            this.delta = 1; // If going up or left
        }
        else {
            this.delta = -1; // If going down or right
        }
        this.scrollPage(this.slides[e.target.dataset.page], e.target.dataset.page);
    }

    /**
     * Will add or remove event listeners in function of value
     * 
     * @param {boolean} value true = add event listeners. false = remove event listeners.
     */
    scrollingBehavior(value) {
        if(value) {
            this.addMouseWheelHandler();
            this.addTouchHandler();
        }
        else {
            this.removeMouseWheelHandler();
            this.removeTouchHandler();
        }
    }

    /**
     * Add the differents event Listeners of the mouse wheel for compatibility.
     */
    addMouseWheelHandler() {
        if(this.slides[this.current].addEventListener) {
            this.slides[this.current].addEventListener('mousewheel', this.MouseWheelHandler.bind(this), false); //IE9, Chrome, Safari, Opera
            this.slides[this.current].addEventListener('wheel', this.MouseWheelHandler.bind(this), false); //Firefox
        }
        else {
            this.slides[this.current].attachEvent('onmousewheel', this.MouseWheelHandler.bind(this)); //IE 6/7/8
        }
    }
    /**
     * Remove all the event Listeners of the mouse wheel for compatibility.
     */
    removeMouseWheelHandler() {
        if(this.slides[this.current].removeEventListener) {
            this.slides[this.current].removeEventListener('mousewheel', this.MouseWheelHandler.bind(this), false); //IE9, Chrome, Safari, Opera
            this.slides[this.current].removeEventListener('wheel', this.MouseWheelHandler.bind(this), false); //Firefox
        }
        else {
            this.slides[this.current].detachEvent('onmousewheel', this.MouseWheelHandler.bind(this)); //IE 6/7/8
        }
    }

    /**
     * Add the event Listeners touchstart and touchmove.
     */
    addTouchHandler() {
        this.container.addEventListener('touchstart', this.touchStartHandler.bind(this));
        this.container.addEventListener('touchmove', this.touchMoveHandler.bind(this));
    }
    /**
     * Remove the event Listeners touchstart and touchmove.
     */
    removeTouchHandler() {
        this.container.removeEventListener('touchstart', this.touchStartHandler.bind(this));
        this.container.removeEventListener('touchmove', this.touchMoveHandler.bind(this));
    }

    /**
     * Getting the starting positions of the touch event
     * 
     * @param {event} e
     */
    touchStartHandler(e){
        this.touchStartY = e.touches[0].clientY;
        this.touchStartX = e.touches[0].clientX;
    }

    /** 
     * Manipulations of the touch move event.
     * Set if this is a scroll up or down.
     * Manage the history of scrolling.
     * Decide if the touchmove is consider as a scroll.
     * 
     * 
     * @param {event} e
     */
    touchMoveHandler(e){
        let curTime = new Date().getTime();

        if(this.options.direction === 'vertical' && this.touchStartY > e.touches[0].clientY) {
            this.delta = -1; // If scrolling down
        }
        else if(this.options.direction === 'horizontal' && this.touchStartX - e.touches[0].clientX > 20) {
            this.delta = -1; // If scrolling right
        }
        else if(this.options.direction === 'horizontal' && e.touches[0].clientX - this.touchStartX > 20) {
            this.delta = 1; // If scrolling left
        }
        else if(this.options.direction === 'vertical') {
            this.delta = 1; // If scrolling up
        }

        // Limiting the array to 150 (!!memory!!)
        if(this.scrollings.length > 149) {
            this.scrollings.shift();
        }

        // Keeping record of the previous scroll
        if(this.options.direction === 'vertical') {
            this.scrollings.push(e.touches[0].clientY);
        }
        else if(this.options.direction === 'horizontal') {
            this.scrollings.push(e.touches[0].clientX);
        }

        // Time difference between the last scroll and this one
        let timeDiff = curTime - this.prevTime;
        this.prevTime = curTime;

        // Haven't they scrolled in a while?
        // (enough to be consider a different scrolling action to scroll another section)
        if(timeDiff > 200){
            //emptying the array, we dont care about old scrollings for our averages
            this.scrollings = [];
        }

        // If the current section is not already moving
        if(!this.isMoving()) {
            let averageEnd = this.getAverage(this.scrollings, 10);
            let averageMiddle = this.getAverage(this.scrollings, 70);
            let isAccelarating = averageEnd >= averageMiddle;
            let scrollable = this.isScrollable();

            // If the user scroll enough to pass to the next slide
            if(isAccelarating) {
                // Scrolling down
                if(this.delta < 0) {
                    this.scrolling(this.options.direction === 'vertical' ? 'down' : 'right', scrollable);
                }
                else if(this.delta > 0) {
                    this.scrolling(this.options.direction === 'vertical' ? 'up' : 'left', scrollable);
                }
            }

            return false;
        }
    }

    /**
     * Manipulations of the mouse wheel event.
     * Set if this is a scroll up or down.
     * Manage the history of scrolling.
     * Decide if the touchmove is consider as a scroll.
     * 
     * @param {event} e 
     */
    MouseWheelHandler(e) {
        let curTime = new Date().getTime();

        // Cross-browser wheel delta
        e = e || window.event;
        let value = this.options.direction === 'vertical' ? (e.wheelDelta || -e.deltaY || -e.detail) : -e.deltaX;
        this.delta = Math.max(-1, Math.min(1, value)); // If scrolling up or down

        let horizontalDetection = typeof e.wheelDeltaX !== 'undefined' || typeof e.deltaX !== 'undefined';
        let isScrollingVertically = (Math.abs(e.wheelDeltaX) < Math.abs(e.wheelDelta)) ||(Math.abs(e.deltaX) < Math.abs(e.deltaY) || !horizontalDetection);

        // Limiting the array to 150 (!!memory!!)
        if(this.scrollings.length > 149) {
            this.scrollings.shift();
        }

        // Keeping record of the previous scroll
        this.scrollings.push(Math.abs(value));

        // Time difference between the last scroll and this one
        let timeDiff = curTime - this.prevTime;
        this.prevTime = curTime;

        // Haven't they scrolled in a while?
        // (enough to be consider a different scrolling action to scroll another section)
        if(timeDiff > 200){
            //emptying the array, we dont care about old scrollings for our averages
            this.scrollings = [];
        }

        // If the current section is not moving
        if(!this.isMoving()) {
            let averageEnd = this.getAverage(this.scrollings, 10);
            let averageMiddle = this.getAverage(this.scrollings, 70);
            let isAccelarating = averageEnd >= averageMiddle;
            let scrollable = this.isScrollable();

            // If the user scroll enough to passe to another slide
            if(isAccelarating) {
                // horizontal
                if(!isScrollingVertically && this.options.direction === 'horizontal') {
                    console.log('ok');
                    // Scrolling down
                    if(this.delta < 0) {
                        this.scrolling('right', scrollable);
                    }
                    else if(this.delta > 0) {
                        this.scrolling('left', scrollable);
                    }
                }
                // vertical
                else if(isScrollingVertically && this.options.direction === 'vertical') {
                    // Scrolling down
                    if(this.delta < 0) {
                        this.scrolling('down', scrollable);
                    }
                    else if(this.delta > 0) {
                        this.scrolling('up', scrollable);
                    }
                }
            }

            return false;
        }
    }

    /**
     * Returns if the current slide is already moving or not
     * 
     * @return {boolean}
     */
    isMoving() {
        let timeNow = new Date().getTime();

        // Cancel the scroll if it's currently animating or within quiet period (scrollDelay)
        if(timeNow - this.lastAnimation < this.scrollDelay + this.options.scrollingSpeed) {
            return true;
        }

        return false;
    }
    /**
     * 
     * 
     * @param {Array} elements 
     * @param {integer} number 
     */
    getAverage(elements, number) {
        let sum = 0;

        // count elements from the end to make the average, if there are not enough returns 1
        let lastElements = elements.slice(Math.max(elements.length - number, 1));

        for(let i = 0; i < lastElements.length; i++) {
            sum += lastElements[i];
        }

        return Math.ceil(sum/number);
    }

    /**
     * Returns if the current slide is a long one that can be scrolled before changing to the next or previous slide.
     * 
     * @return {boolean}
     */
    isScrollable() {
        return this.slides[this.current].classList.contains('sp-scrollable');
    }

    /**
     * Will say when to change to the next slide when this is a scrollable slide.
     * 
     * @param {string} type 
     * @param {boolean} scrollable 
     */
    scrolling(type, scrollable) {
        let check = (type === 'down') || (type === 'right') ? 'bottom' : 'top';

        if(scrollable) {
            if(this.options.direction === 'vertical' && this.isScrolled(check, this.slides[this.current])) {
                this.moveSection(type);
            }
            else if(this.options.direction === 'horizontal') {
                this.moveSection(type);
            }
        }
        else {
            this.moveSection(type);
        }
    }

    /**
     * Update the index of the next slide and execute the scroll page.
     * 
     * @param {string} type 
     */
    moveSection(type) {
        let index;

        // Setting the new index in function of the movement
        if(type === 'down' || type === 'right') {
            if(this.current+1 < this.slides.length) {
                index = this.current + 1;
            }
            // If the option infinite is set to true
            else if(this.options.infinite) {
                index = 0;
                this.delta = 1;
            }
        }
        else if(type === 'up' || type === 'left') {
            if(this.current-1 >= 0) {
                index = this.current - 1;
            }
            // If the option infinite is set to true
            else if(this.options.infinite) {
                index = this.slides.length - 1;
                this.delta = -1;
            }
        }

        if(typeof index !== 'undefined') {
            this.scrollPage(this.slides[index], index);
        }
    }

    /**
     * Calculate if we scrolled at the end or beginning of a scrollable slide.
     * 
     * @param {string} check 
     * @param {Node} elem 
     * 
     * @return {boolean}
     */
    isScrolled(check, elem) {
        // If we are at the top of the slide
        if(check === 'top' && elem.scrollTop === 0) {
            return true;
        }
        // If we are at the bottom of the slide
        else if(check == 'bottom' && elem.scrollTop == elem.scrollHeight - elem.clientHeight) {
            return true;
        }
        return false;
    }

    /**
     * 
     * @param {integer} destination 
     * @param {integer} index 
     */
    scrollPage(destination, index) {
        let v = {
            destination: this.slides[index],
            activeSection: this.slides[this.current],
            sectionIndex: parseInt(index),
        };

        // Calculate how many sections to move
        v.nbrSectionsToMove = this.sectionsToMove(v.sectionIndex);
        
        // Get the sections to move
        v.sectionsToMove = this.getSectionsToMove(v);

        // Quiting when activeSection is the target element
        if(v.activeSection == v.destination) {
            return;
        }

        // Add and remove active CSS classes
        v.destination.classList.add('active');
        v.activeSection.classList.remove('active');

        // Scrolling (moving sections up making them disappear)
        if(this.delta < 0 || v.sectionIndex > this.current) {
            // down
            if(this.options.direction === 'vertical') {
                v.translate3d = 'translate3d(0px, -100%, 0px)';
            }
            else if(this.options.direction === 'horizontal') {
                v.translate3d = 'translate3d(-100%, 0px, 0px)';
            }

            v.animateSection = v.activeSection;
        }
        // Scrolling up or left (moving section down to the viewport)
        else {
            v.translate3d = 'translate3d(0px, 0px, 0px)';

            v.animateSection = destination;
        }

        this.updateSlide(this.delta, v.nbrSectionsToMove);

        this.performMovement(v);

        let timeNow = new Date().getTime();
        this.lastAnimation = timeNow;
    }

    /**
     * Remove the event listeners on the current slide and add them on the next one.
     * Update the current index of slide.
     * Update CSS classes of the navigations.
     * 
     * @param {integer} delta 
     * @param {integer} nbrSectionsToMove 
     */
    updateSlide(delta, nbrSectionsToMove) {
        // Remove the event listeners of the active slide
        this.scrollingBehavior(false);

        if(this.options.dotsNav) {
            this.dotsNav[this.current].classList.remove('active');
        }
        if(this.options.numbersNav) {
            this.numbersNav[this.current].classList.remove('active');
        }

        // Update the current index of the slide
        if(delta < 0) {
            this.current += nbrSectionsToMove;
        }
        else if(delta > 0) {
            this.current -= nbrSectionsToMove;
        }

        // Add the event listeners of the new slide
        this.scrollingBehavior(true);

        if(this.options.dotsNav) {
            this.dotsNav[this.current].classList.add('active');
        }
        if(this.options.numbersNav) {
            this.numbersNav[this.current].classList.add('active');
        }
    }

    /**
     * Return the number of sections to move from the current slide
     * 
     * @param {integer} nbr 
     * 
     * @return {integer}
     */
    sectionsToMove(nbr) {
        if(this.current - nbr > 0) {
            return this.current - nbr;
        }
        return nbr - this.current;
    }

    /**
     * Returns an array of all the slides to move from the current through the destination excluded.
     * 
     * @param {Object} v 
     * 
     * @return {Array}
     */
    getSectionsToMove(v) {
        let sections = [];

        // When going down
        if(this.current < v.sectionIndex) {
            // Take all the slides from the current slide excluded through the destination slide excluded
            for(let i = this.current + 1; i < v.sectionIndex; i++) {
                sections.push(this.slides[i]);
            }
        }
        // When going up
        else {
            for(let i = v.sectionIndex + 1; i < this.current; i++) {
                sections.push(this.slides[i]);
            }
        }
        return sections;
    }

    /**
     * Do the animation of the changement of slide. CSS translation.
     * Execute the function after scroll.
     * 
     * @param {Object} v 
     */
    performMovement(v) {
        v.animateSection.style.transform = v.translate3d;

        if(v.sectionsToMove.length > 0) {
            for(let i = 0; i < v.sectionsToMove.length; i++) {
                v.sectionsToMove[i].style.transform = v.translate3d;
            }
        }


        // After the animation, execute the function callback
        setTimeout(this.afterSectionLoads.bind(this), this.options.scrollingSpeed);
    }

    /**
     * Execute the callback function if it is defines.
     */
    afterSectionLoads() {
        if(this.afterLoad) {
            this.afterLoad(this);
        }
    }

    /**
     * Destroy the current ScrollingPile
     */
    destroy() {
        for(this.current = 0; this.current > this.slides; this.current++) {
            this.scrollingBehavior(false);
        }
        this.container.style.overflow = 'inherit';
        this.container.style.toucheAction = 'inherit';
        delete this;
    }
}
