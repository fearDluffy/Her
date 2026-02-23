// js/main.js - moving 'No' button logic for q3.html
(function(){
  function randomInt(min,max){return Math.floor(Math.random()*(max-min+1))+min}

  function attachRunner(){
    const btn = document.getElementById('noBtn');
    const playground = document.getElementById('playground');
    if(!btn || !playground) return;

    // allow the No button to move anywhere on the viewport
    btn.classList.add('move');

    // keep track of attempts to make a little more playful
    let tries = 0;

    function moveButton(){
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const btnRect = btn.getBoundingClientRect();

      const maxLeft = Math.max(8, vw - btnRect.width - 8);
      const maxTop = Math.max(8, vh - btnRect.height - 8);

      const left = randomInt(8, Math.floor(maxLeft));
      const top = randomInt(8, Math.floor(maxTop));

      btn.style.position = 'fixed';
      btn.style.left = left + 'px';
      btn.style.top = top + 'px';
      tries++;

      // playful nudge every few tries
      if(tries % 4 === 0){
        btn.classList.add('blocked');
        setTimeout(()=>btn.classList.remove('blocked'), 450);
      }
    }

    // place the No button to the right side of the Yes button by default
    function placeRightOfYes(){
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const btnRect = btn.getBoundingClientRect();
      const yes = playground.querySelector('.btn.yes');
      if(yes){
        const yesRect = yes.getBoundingClientRect();
        // place just to the right of the Yes button in viewport coords
        let left = Math.floor(yesRect.right + 8);
        let top = Math.floor(yesRect.top + (yesRect.height - btnRect.height)/2);
        const maxLeft = Math.max(8, vw - btnRect.width - 8);
        const maxTop = Math.max(8, vh - btnRect.height - 8);
        if(left > maxLeft) left = maxLeft;
        if(top < 8) top = 8;
        if(top > maxTop) top = maxTop;
        btn.style.position = 'fixed';
        btn.style.left = left + 'px';
        btn.style.top = top + 'px';
      } else {
        // fallback to center of viewport
        const left = Math.max(8, Math.floor((vw - btnRect.width)/2));
        const top = Math.max(8, Math.floor((vh - btnRect.height)/2));
        btn.style.position = 'fixed';
        btn.style.left = left + 'px';
        btn.style.top = top + 'px';
      }
    }

    // move on hover/focus attempts (desktop)
    btn.addEventListener('mouseover', moveButton);
    btn.addEventListener('focus', moveButton);

    // On touch devices intercept pointer/touch down to move the No button away before a click can register
    btn.addEventListener('pointerdown', function(e){
      if(e.pointerType === 'touch' || window.innerWidth <= 600){
        e.preventDefault();
        try{ navigator.vibrate && navigator.vibrate(40); }catch(_){ }
        moveButton();
        return;
      }
      // for mouse, just move
      moveButton();
    });
    // fallback for older mobile browsers: move on touchstart and prevent default click
    btn.addEventListener('touchstart', function(e){
      e.preventDefault();
      try{ navigator.vibrate && navigator.vibrate(40); }catch(_){ }
      moveButton();
    }, {passive:false});

    // prevent clicking "No" (so they can't choose it on desktop)
    btn.addEventListener('click', function(e){
      e.preventDefault();
      btn.classList.add('blocked');
      setTimeout(()=>btn.classList.remove('blocked'), 450);
    });

    // initialize placed to the right of Yes, then allow chase on hover
    window.addEventListener('load', placeRightOfYes);
    window.addEventListener('resize', function(){
      // reposition on resize
      placeRightOfYes();
    });
  }

  document.addEventListener('DOMContentLoaded', attachRunner);
})();