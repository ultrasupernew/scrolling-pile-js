import ScrollingPile from '../../scrolling-pile.js';

const test = new ScrollingPile('.container',{
    scrollingSpeed: 200,
    dotsColor: '#2196f3',
    positionDotsNav: 'top',
    numbersNav: true,
    numbersColor: '#2196f3',
    infinite: true,
    backgroundColors: ['#FCFCFC', '#ACACAC', 'salmon', 'blue']
}, function(obj) {
    console.log(obj);
});
console.log(test);
