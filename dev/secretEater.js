document.addEventListener('click', function(e){
  if(window.isE) {
    if(e.target.parentNode.classList.contains('ready-for-poetry')){
      e.target.style.opacity = 0;
    } else {
      e.preventDefault();
      e.target.innerHTML = e.target.innerText.split(' ').map(w => {return `<span class="word">${w}</span>`}).join(' ');
      e.target.classList.add('ready-for-poetry');
      e.target.style.border = "solid 1px black";
      window.setTimeout(function(){
        e.target.style.border = "";
      }, 300);
    }
  }
});
document.addEventListener('keydown', function(e){
  if(e.key = 'e'){
    window.isE = true;
  }
});
document.addEventListener('keyup', function(e){
  if(e.key = 'e'){
    window.isE = false;
  }
});
