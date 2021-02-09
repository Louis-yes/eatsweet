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

var textIndex = window.texts.length;
var symbolReg = /(^\W+)|(\W+$)/g;

function wordsTemplate(w,i){ return `<span tabindex="0" class="word ${w}" data-index="${i}">${w}</span>` }
function render_input(rr){ return pp.words.map((w,i) => wordsTemplate(w,i)).join(pp.spacer) }
function render_description(txt){ return `Here's some of <em>${txt.title}.</em>`}
function updateSource() {
	titleDescription.innerHTML = render_description(window.currText);
	input.innerHTML = render_input(pp.words);
	output.innerHTML = "";
}
function updateText(){
	textIndex = textIndex < window.texts.length -1 ? textIndex + 1 : 0;
	var newText = window.texts[textIndex].split("|");
	var currText = window.currText = {author:newText[1], title: newText[0], contents:newText[2]}
	pp = new WordDealer(currText.contents,' ');
	updateSource();
}
var pp = {};
updateText();

function willOverflow(el, newContent) {
	function isOverflown(element) {
		console.log(element.scrollHeight,element.clientHeight)
		return element.scrollHeight > element.clientHeight || element.scrollWidth > element.clientWidth;
	}
	var clone = el.cloneNode(true);
	clone.innerHTML += newContent;
	el.parentNode.appendChild(clone)
	var isOver = isOverflown(clone);
	el.parentNode.removeChild(clone);
	return isOver;
}

function indicateOverflow(el) {
	el.classList.add('overflow');
	window.setTimeout(function(){
		el.classList.remove('overflow');
	}, 400);
}

function event_handler_input(e) {
	var tt = e.target, index = tt.dataset.index, cl = tt.classList;
	if (
		cl.contains("word") && !cl.contains("active") &&
		(e.keyCode == 13 || e.type == "click" || e.type == "mouseover")
	){
		var word = pp.words[index].replace(symbolReg, '');
		word = word.length > 1 ? word.toLowerCase() : word;
		var str = " " + wordsTemplate(word, index);
		if(!willOverflow(output, str)){
			output.innerHTML += str;
			cl.add("active");
			cl.add("bite");
			tt.tabIndex = -1;
			pp.select(index);
		} else {
			indicateOverflow(output);
		}
	}
}

function event_handler_addSpace(e) {
	if (
		e.target.classList.contains('space') &&
		(e.keyCode == 13 || e.type == "click" || e.type == "mouseover")
	){
		var cc = document.createElement('span');
		cc.classList.add('space');
		var spc =
		cc.innerHTML += e.target.innerHTML;
		if(!willOverflow(output, cc.outerHTML)){
			output.appendChild(cc);
		  window.setTimeout(function(){
		    output.querySelector('.space:not(.bite)').classList.add('bite')
		  }, 300)
		} else {
			indicateOverflow(output);
		}
	}
}

function event_handler_download(e) {
	if(e.target.classList.contains('download')){
		var el = e.target.dataset.downloadTarget || ".output";
		console.log(el)
		var type = e.target.dataset.downloadType || "composition";
		html2canvas(
			document.querySelector(el),
			{
				width:output.clientWidth,
				height: output.clientHeight,
				scrollX: -window.scrollX,
				scrollY: -window.scrollY,
				windowWidth: document.documentElement.offsetWidth,
				windowHeight: document.documentElement.offsetHeight,
				onclone: function (doc) {
						var bites = doc.body.getElementsByClassName("bite");
						Array.prototype.forEach.call(bites, function(b){ b.style.visibility = "hidden"; })
				}
			}
		).then(function(canvas) {
			var fileName = "refined_from_" + window.currText.title.split(" ").join("_");
			var img = document.createElement('img');
			var link = document.createElement('a');

			img.src = canvas.toDataURL();
			link.href = img.src;
			link.download = fileName + ".png";
			link.click();
		});
	}
}

function event_handler_next(e) {
	updateText();
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

var download = document.querySelector('.tools-sharing');
if(!html2canvas) { download.parentNode.removeChild(download) }
else { download.addEventListener('click', event_handler_download);}
