// TODO
// - trigger initial view
// - add interesting intros
// - fill in colophon
// - create list of texts
// - textured edges of pages
// - add touch events
// - finesse animation timings

var Erasure = (function() {
		window.Erasure = {}
		// global mousepressed listener
		window.Erasure.mousePressed = false;
		document.addEventListener('mousedown', function(e){window.Erasure.mousePressed = true;});
		document.addEventListener('mouseup', function(e){window.Erasure.mousePressed = false;});

		function setVisibility(el, show) {
			// handle all visibility with classnames for now
			el.tabIndex = show ? 0 : -1;
		}

		function splitWrap (string, classname) {
			return string.split(' ').map(w => { return `<span class="${classname}" tabindex="0">${w}</span>`}).join(' ');
		}

		function hide(el){
			setVisibility(el, false)
		}

		function show(el){
			setVisibility(el, true)
		}

		window.Erasure.show = show;
		window.Erasure.hide = hide;

		var Constructor = function(el, ec){
			var eraseClass = ec || "erase-able";
			var erasedClass = "erased";
			function erase (e) {
				if (
					e.target.classList.contains(eraseClass)
					&& !e.target.classList.contains(erasedClass)
				) {
					hide(e.target);
					e.target.classList.add(erasedClass);
					var erased = new Event("erased", {bubbles: true});
					e.target.dispatchEvent(erased);
				}
			}

			function update (string) {
				el.innerHTML = splitWrap(string, eraseClass)
				var updated = new Event("updated", {bubbles: true});
				el.dispatchEvent(updated);
			}

			var pf = {}
			pf.update = update;
			el.erasure = pf;

			el.addEventListener("click", erase)
			el.addEventListener("keydown", function(e) { if(e.code === "Enter") { erase(e) } })
			el.addEventListener("mouseover", function(e) { if( window.Erasure.mousePressed ) { erase(e) }});

			// touch events?

			update(el.innerText);
			return el;
		}
		return Constructor;
})();

var eatsweet = (function() {
	var texts = [];
	var currentText = 0;
	function willOverflow(el, newContent) {
		function isOverflown(element) { return element.scrollHeight > element.clientHeight || element.scrollWidth > element.clientWidth; }
		var clone = el.cloneNode(true);
		clone.innerHTML += newContent;
		el.parentNode.appendChild(clone)
		var isOver = isOverflown(clone);
		el.parentNode.removeChild(clone);
		delete clone
		return isOver;
	}

	function fadeIn (el) {
		el.classList.add("erased");
		requestAnimationFrame(function(){
			el.classList.remove("erased");
			if(el.classList.contains("space")) {
				window.setTimeout(function(){
					el.classList.add("erased");
				}, 300);
			}
		});
	}

	function fadeOut (el) {
		el.classList.add("erased");
	}

	function triggerOverflow(el) {
		el.classList.add('overflow');
		window.setTimeout(function(){
			el.classList.remove('overflow');
		}, 400);
	}

	function addToContainer (output, el) {
		if(willOverflow(output, el.outerHTML)){
			triggerOverflow(output);
		} else {
			el.classList.add("before-add");
			output.appendChild(el);
			window.requestAnimationFrame(function(){
				el.classList.remove("before-add");
				el.classList.add("after-add");
			});
			var added = new Event("added", {bubbles: true});
			el.dispatchEvent(added);
		}
	}

	var Constructor = function(opts){
		var input = opts.input;
		var output = opts.output;
		var description = opts.description;
		var space = opts.space;
		texts = opts.texts;

		function addWord (e) {
			var symbolReg = /(^\W+)|(\W+$)/g;
			var el = document.createElement('span');
			var word = e.target.innerText;
			word = word.length > 1 ? word.toLowerCase() : word;
			el.className = "word";
			el.innerText = word.replace(symbolReg,"") + " ";
			addToContainer(output, el);
		}

		function addSpace (e) {
			var el = document.createElement('span');
			el.className = "word space";
			addToContainer(output, el);
		}

		function updateText (string, cb) {
			fadeOut(input)
			fadeOut(output)
			window.setTimeout(function(){
				output.innerHTML = "";
				input.erasure.update(string);
				fadeIn(input);
				fadeIn(output);
				cb();
			}, 700)
		}

		function changeText (n){
				var descriptionTemplates = [ "Here's some of" ];
				var txt;
				currentText = n || currentText < texts.length -1 ? currentText + 1 : 0;
				txt = texts[currentText];
				fadeOut(description);
				description.classList.add("updating");
				updateText(txt.content, function(){
					description.innerHTML = `
						<span class="title-description">Here's some of <em>${txt.title}</em> by <em>${txt.author}</em></span>
						<br>
						<span class="change-text">want something different?</span>
					`
					description.classList.remove("updating");
					fadeIn(description);
				});
		}

		input = new Erasure(input);
		changeText(0);
		input.addEventListener("erased", addWord);
		output.addEventListener("added", function(e){fadeIn(e.target)});
		space.addEventListener("click", addSpace);
		description.addEventListener("click", function(e){
			if(e.target.classList.contains("change-text") && !description.classList.contains("updating")){
				changeText();
			}
		});

		return {
			texts: texts,
			currentText: function(){return texts[currentText]},
			fadeIn: fadeIn,
			fadeOut: fadeOut
		}
	}
	return Constructor;
})();

var texts = window.texts.map(t => {
	var nt = t.split("|"); return {title: nt[0], author: nt[1], content: nt[2]}
});
var poem = new eatsweet({
	input: document.querySelector('.input'),
	output: document.querySelector('.output'),
	description: document.querySelector('.intro'),
	space: document.querySelector('.space'),
	texts: texts
})

var download = document.querySelector('.tools-sharing');
function event_handler_download(e) {
	if(e.target.classList.contains('download')){
		var el = e.target.dataset.downloadTarget || ".output-tools";
		var type = e.target.dataset.downloadType || "composition";
		html2canvas(
			document.querySelector(el),
			{
				width: document.querySelector(el).clientWidth,
				height: document.querySelector(el).clientHeight,
				scrollX: -window.scrollX,
				scrollY: -window.scrollY,
				windowWidth: document.documentElement.offsetWidth,
				windowHeight: document.documentElement.offsetHeight,
				onclone: function (doc) {
						var bites = doc.body.getElementsByClassName("erased");
						Array.prototype.forEach.call(bites, function(b){ b.style.visibility = "hidden"; })
						var spaces = doc.body.getElementsByClassName("space");
						Array.prototype.forEach.call(spaces, function(b){ b.style.visibility = "hidden"; })
				}
			}
		).then(function(canvas) {
			var fileName = "refined_from_" + poem.currentText().title.split(" ").join("_");
			var img = document.createElement('img');
			var link = document.createElement('a');

			img.src = canvas.toDataURL();
			link.href = img.src;
			link.download = fileName + ".png";
			link.click();
		});
	}
}
if(!html2canvas) { download.parentNode.removeChild(download) }
else { download.addEventListener('click', event_handler_download);}

function toggleColophon () {
	var cc = document.querySelector("#colophon-content");
	if(cc.classList.contains("erased")){
		poem.fadeIn(cc);
	} else {
		poem.fadeOut(cc);
	}
}
