var WordDealer = (function () {
	'use strict';
	var Constructor = function (inputText, spacer) {
   var papi = {};
   var spacer = papi.spacer = spacer || ' ';
   var words = papi.words = inputText.split(spacer);
   var activeWords = papi.activeWords = [];
   papi.select = function (ii) { activeWords.push(ii); }
   return papi;
  }
  return Constructor;
})();

// global mousepressed listener
window.mousePressed = false;
document.addEventListener('mousedown', function(e){window.mousePressed = true;});
document.addEventListener('mouseup', function(e){window.mousePressed = false;});

var input = document.querySelector('.input');
var output = document.querySelector('.output');
var titleDescription = document.querySelector('.title-description');

var textIndex = 0;
var symbolReg = /(^\W+)|(\W+$)/g;

var pp = new WordDealer(window.texts[0].contents.trim(), ' ');


function wordsTemplate(w,i){ return `<span tabindex="0" class="word ${w}" data-index="${i}">${w}</span>` }
function render_input(rr){ return pp.words.map((w,i) => wordsTemplate(w,i)).join(pp.spacer) }
function render_description(){ return `Hey we got you a hot copy of "${window.texts[textIndex].title}", or would you rather `}
function updateSource() {
	titleDescription.innerHTML = render_description();
	input.innerHTML = render_input(pp.words);
	output.innerHTML = "";
}

updateSource();

function event_handler_input(e) {
	if (e.keyCode == 13 || e.type == "click" || e.type == "mouseover"){
		var tt = e.target;
	  var index = tt.dataset.index;
	  var cl = tt.classList;
	  if(cl.contains("word") && !cl.contains("active")) {
	    cl.add("active");
	    cl.add("bite");
			tt.tabIndex = -1;
	    pp.select(index);
	    output.innerHTML += " " + wordsTemplate(pp.words[index].replace(symbolReg, '').toLowerCase(), index);
	  }
	}
}

function event_handler_addSpace(e) {
	console.log(	e.target.classList)
	console.log(e.target.classList.contains('space'))
	if (
		e.target.classList.contains('space') && (
		e.keyCode == 13 ||
		e.type == "click" ||
		e.type == "mouseover")
	){
		var cc = document.createElement('span');
		cc.classList.add('space');
		// cc.classList.add('bite');
		cc.innerHTML += e.target.innerHTML;
	  output.appendChild(cc);
	  window.setTimeout(function(){
	    cc.classList.add('bite')
	  }, 300)
	}
}

function event_handler_next(e) {
	textIndex = textIndex < window.texts.length -1 ? textIndex + 1 : 0;
	pp = new WordDealer(window.texts[textIndex].contents.trim(), ' ');
	updateSource();
}

var addSpace = document.querySelector('.add-space')
addSpace.addEventListener('click', event_handler_addSpace)
addSpace.addEventListener('keydown', event_handler_addSpace);
addSpace.addEventListener('mouseover', function(e){ if (window.mousePressed) { event_handler_addSpace(e) } });


var nextText = document.querySelector('.next-text');
nextText.addEventListener('click', event_handler_next);
nextText.addEventListener('keydown', event_handler_next);

input.addEventListener('click', event_handler_input);
input.addEventListener('keydown', event_handler_input);
input.addEventListener('mouseover', function(e){ if (window.mousePressed) { event_handler_input(e) } });
