import ScrollingPile from '../../scrolling-pile.js';

const test = new ScrollingPile('.container',{
    scrollingSpeed: 200,
    bulletsColor: '#2196f3',
    positionNav: 'top'
}, function(obj) {
    obj.destroy();
    console.log(obj);
});
console.log(test);
