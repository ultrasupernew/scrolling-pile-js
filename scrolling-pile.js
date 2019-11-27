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
        this.options = {
            scrollingSpeed: options.scrollingSpeed || 700,
            dotsNav: options.dotsNav || true,
            bulletsColor: options.bulletsColor || '#000000',
            positionNav: options.positionNav || 'right',
            direction: 'vertical',
            touchSensitivity: options.touchSensitivity || 5,
            normalScrollElements: options.normalScrollElements || null,
            normalScrollElementTouchThreshold: options.normalScrollElements || 5,
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
        if(this.options.bulletsColor !== "#000000") document.documentElement.style.setProperty('--dots-color', this.options.bulletsColor);
        if(this.options.scrollingSpeed !== 700) document.documentElement.style.setProperty('--scrolling-speed', this.options.scrollingSpeed/1000 + 's');

        // Put the slides in the right order
        // Wrap the content in an inner div
        // Add all the classes needed
        for(let i = 0; i < this.slides.length; i++) {
            this.slides[i].style.zIndex = this.slides.length - i;
            this.slides[i].classList.add('sp-section');

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
        if(this.options.dotsNav) this.createDotsNav();

        // Add the scrolling behavior
        this.scrollingBehavior(true);
    }

    createDotsNav() {
        let dotsNav = document.createElement('ul');
        dotsNav.classList.add('sp-dotsnav');

        if(this.options.positionNav !== 'right') {
            if(this.options.positionNav === 'left') {
                dotsNav.style.right = 'inherit';
                dotsNav.style.left = '5px';
            }
            else if(this.options.positionNav === 'top') {
                dotsNav.style.right = '50%';
                dotsNav.style.top = '15px';
                dotsNav.style.transform = 'translateX(-50%)';
                dotsNav.style.flexDirection = 'row';
                dotsNav.style.height = 'auto';
                dotsNav.style.width = '30%';
            }
            else if(this.options.positionNav === 'bottom') {
                dotsNav.style.right = '50%';
                dotsNav.style.bottom = '15px';
                dotsNav.style.transform = 'translateX(-50%)';
                dotsNav.style.flexDirection = 'row';
                dotsNav.style.height = 'auto';
                dotsNav.style.width = '30%';
            }
            else if(this.options.positionNav === 'center') {
                dotsNav.style.right = '50%';
                dotsNav.style.transform = 'translate(-50%, -50%)';
                dotsNav.style.flexDirection = 'row';
                dotsNav.style.height = 'auto';
                dotsNav.style.width = '30%';
            }
        }

        for(let i = 0; i < this.slides.length; i++) {
            let dotsNavItem = document.createElement('li');
            dotsNavItem.classList.add('sp-dotsnav__item');
            dotsNavItem.dataset.page = i;
            dotsNavItem.addEventListener('click', this.clickDotsHandler.bind(this));
            if(i == 0) dotsNavItem.classList.add('active');
            dotsNav.appendChild(dotsNavItem);
        }

        this.container.appendChild(dotsNav);
        this.dotsNav = dotsNav.children;
    }

    clickDotsHandler(e) {
        this.scrollPage(this.slides[e.target.dataset.page], e.target.dataset.page);
    }

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

    addMouseWheelHandler() {
        if(this.slides[this.current].addEventListener) {
            this.slides[this.current].addEventListener('mousewheel', this.MouseWheelHandler.bind(this), false); //IE9, Chrome, Safari, Opera
            this.slides[this.current].addEventListener('wheel', this.MouseWheelHandler.bind(this), false); //Firefox
        }
        else {
            this.slides[this.current].attachEvent('onmousewheel', this.MouseWheelHandler.bind(this)); //IE 6/7/8
        }
    }
    removeMouseWheelHandler() {
        if(this.slides[this.current].removeEventListener) {
            this.slides[this.current].removeEventListener('mousewheel', this.MouseWheelHandler.bind(this), false); //IE9, Chrome, Safari, Opera
            this.slides[this.current].removeEventListener('wheel', this.MouseWheelHandler.bind(this), false); //Firefox
        }
        else {
            this.slides[this.current].detachEvent('onmousewheel', this.MouseWheelHandler.bind(this)); //IE 6/7/8
        }
    }

    addTouchHandler() {
        this.container.removeEventListener('touchstart ', this.touchStartHandler.bind(this));
        this.container.addEventListener('touchstart', this.touchStartHandler.bind(this));
        this.container.removeEventListener('touchmove', this.touchMoveHandler.bind(this));
        this.container.addEventListener('touchmove', this.touchMoveHandler.bind(this));
    }
    removeTouchHandler() {
        this.container.removeEventListener('touchstart', this.touchStartHandler.bind(this));
        this.container.removeEventListener('touchmove', this.touchMoveHandler.bind(this));
    }

    /**
     * Getting the starting possitions of the touch event
     */
    touchStartHandler(e){
        this.touchStartY = e.touches[0].clientY;
        this.touchStartX = e.touches[0].clientX;
    }

    /* Detecting touch events
        */
    touchMoveHandler(event){
        let curTime = new Date().getTime();

        if(this.touchStartY > event.touches[0].clientY) this.delta = -1; // If scrolling down
        else this.delta = 1; // If scrolling up

        // Limiting the array to 150 (!!memory!!)
        if(this.scrollings.length > 149) {
            this.scrollings.shift();
        }

        // Keeping record of the previous scroll
        this.scrollings.push(event.touches[0].clientY);

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
                // Scrolling down ?
                if(this.delta < 0) {
                    this.scrolling('down', scrollable);
                }
                else if(this.delta > 0) {
                    this.scrolling('up', scrollable);
                }
            }

            return false;
        }
    }

    MouseWheelHandler(e) {
        let curTime = new Date().getTime();

        // Cross-browser wheel delta
        e = e || window.event;
        let value = e.wheelDelta || -e.deltaY || -e.detail;
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
            if(isAccelarating && isScrollingVertically) {
                // Scrolling down ?
                if(this.delta < 0) {
                    this.scrolling('down', scrollable);
                }
                else if(this.delta > 0) {
                    this.scrolling('up', scrollable);
                }
            }

            return false;
        }
    }

    isMoving() {
        let timeNow = new Date().getTime();

        // Cancel the scroll if it's currently animating or within quiet period (scrollDelay)
        if(timeNow - this.lastAnimation < this.scrollDelay + this.options.scrollingSpeed) {
            return true;
        }

        return false;
    }
    getAverage(elements, number) {
        let sum = 0;

        // count elements from the end to make the average, if there are not enough returns 1
        let lastElements = elements.slice(Math.max(elements.length - number, 1));

        for(let i = 0; i < lastElements.length; i++) {
            sum += lastElements[i];
        }

        return Math.ceil(sum/number);
    }
    isScrollable() {
        return this.slides[this.current].classList.contains('sp-scrollable');
    }

    moveSection(type) {
        let index;

        // Looping to the top if no sections left
        if(type == 'down' && this.current+1 < this.slides.length) {
            index = this.current + 1;
        }
        else if(type == 'up' && this.current-1 >= 0) {
            index = this.current - 1;
        }

        if(typeof index !== 'undefined') this.scrollPage(this.slides[index], index);
    }

    scrolling(type, scrollable) {
        let check = type == 'down' ? 'bottom' : 'top';

        if(scrollable) {
            if(this.isScrolled(check, this.slides[this.current])) {
                this.moveSection(type);
            }
        }
        else {
            this.moveSection(type);
        }
    }

    isScrolled(check, elem) {
        if(check === 'top' && elem.scrollTop === 0) {
            return true;
        }
        else if(check == 'bottom' && elem.scrollTop == elem.scrollHeight - elem.clientHeight) {
            return true;
        }
        return false;
    }

    scrollPage(destination, index) {
        let v = {
            destination: this.slides[index],
            activeSection: this.slides[this.current],
            sectionIndex: parseInt(index),
        };

        // Calculate how many sections to move
        v.nbrSectionsToMove = this.sectionsToMove(v.sectionIndex);
        // Reinitialise the delta, because if nbrSectionsToMove is greater than 1
        // it means that the user used the dots navigation
        if(v.nbrSectionsToMove > 1) this.delta = 0;
        // Get the sections to move
        v.sectionsToMove = this.getSectionsToMove(v);

        // Quiting when activeSection is the target element
        if(v.activeSection == v.destination) return;

        v.destination.classList.add('active');
        v.activeSection.classList.remove('active');

        // Scrolling down (moving sections up making them disappear)
        if(this.delta < 0 || v.sectionIndex > this.current) {
            v.translate3d = this.getTranslate3d();

            v.animateSection = v.activeSection;

            this.scrollingBehavior(false);
            if(this.options.dotsNav) this.dotsNav[this.current].classList.remove('active');
            this.current += v.nbrSectionsToMove;
            this.scrollingBehavior(true);
            if(this.options.dotsNav) this.dotsNav[this.current].classList.add('active');
        }
        // Scrolling up (moving section down to the viewport)
        else {
            v.translate3d = 'translate3d(0px, 0px, 0px)';

            v.animateSection = destination;

            this.scrollingBehavior(false);
            if(this.options.dotsNav) this.dotsNav[this.current].classList.remove('active');
            this.current -= v.nbrSectionsToMove;
            this.scrollingBehavior(true);
            if(this.options.dotsNav) this.dotsNav[this.current].classList.add('active');
        }

        this.performMovement(v);

        let timeNow = new Date().getTime();
        this.lastAnimation = timeNow;
    }

    sectionsToMove(nbr) {
        if(this.current - nbr > 0) {
            return this.current - nbr;
        }
        return nbr - this.current;
    }
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

    getTranslate3d() {
        return 'translate3d(0px, -100%, 0px)';
    }
    performMovement(v) {
        v.animateSection.style.transform = v.translate3d;

        if(v.sectionsToMove.length > 0) {
            for(let i = 0; i < v.sectionsToMove.length; i++) {
                v.sectionsToMove[i].style.transform = v.translate3d;
            }
        }

        setTimeout(this.afterSectionLoads.bind(this), this.options.scrollingSpeed);
    }

    afterSectionLoads() {
        if(this.afterLoad) this.afterLoad(this);
    }
}
