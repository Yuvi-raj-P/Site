window.addEventListener('load', function() {
    const firstSvg = document.querySelector('.svg-elem-1');
    const PLayer = document.querySelector('.hidden.spacing');
    const secondSvg = document.querySelector('.svg-elem-2');
    const dotSvg = document.querySelector('.hidden.circle');
    
    firstSvg.classList.remove('hidden');
    firstSvg.classList.add('animate');
    
    setTimeout(() => {
        dotSvg.classList.remove('hidden');
        dotSvg.classList.add('fade-in');
    }, 4000);

    firstSvg.addEventListener('animationend', function() {
        console.log('First animation ended');
        
        setTimeout(() => {
            console.log('Adding animate class to second SVG');
            secondSvg.classList.add('animate');
            PLayer.classList.remove('hidden');
        }, 50);
    });
});