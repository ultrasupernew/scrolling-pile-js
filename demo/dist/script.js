import ScrollingPile from '../../scrolling-pile.js';

const test = new ScrollingPile('.container',{
    scrollingSpeed: 200,
    bulletsColor: '#2196f3',
    positionNav: 'top'
}, function(obj) {
    console.log(obj.current);
});
console.log(test);
