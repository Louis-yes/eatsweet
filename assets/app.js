/*!
 * Revealing Constructor Pattern Boilerplate
 * (c) 2019 Chris Ferdinandi, MIT License, https://gomakethings.com
 */
var Palette = (function () {
	'use strict';

	var Constructor = function (inputText) {
		var publicAPIS = {};
		var input = [];
		var output = [];

		function wordObject(w, index){
			return {text: w, index: index};
		}

		var templates = {
			input: function(w) {
				return `<span class='word ${w.text} ${activeOutputs().indexOf(w.index) > 0 ? 'active':''}' data-index="${w.index}">${w.text}</span>`;
			},
			output: function(w) {
				return `<span class='word ${w.text}' data-index="${w.index}">${w.text.replace(/(^\W+)|(\W+$)/g,'').toLowerCase()}</span>`;
			}
		}

		var init = function (options) {
			if(!inputText) { return }
			var count = 0;
			input = inputText.split(' ');
		};

		var render = function(aa, template){
			return aa.map(w => template(w)).join(' ');
		}

		var activeOutputs = function () {
			return output.map(o => o.index);
		}

		publicAPIS.renderInput = function(){
			var inputW = input.map((w,i) => {return wordObject(w,i)});
			return render(inputW, templates.input);
		}

		publicAPIS.renderOutput = function(){
			return render(output, templates.output);
		}

		publicAPIS.toOutput = function (ii) {
			output.push(wordObject(input[ii], ii));
		}

		publicAPIS.fromOutput = function(ii) {
			var out = output.find(a => a.index == ii)
			var outi = output.indexOf(out);
			output.splice(outi,1);
		}

		publicAPIS.activeOutputs = function() {
			return activeOutputs();
		}

		publicAPIS.templates = function(tt) {
			if(tt.input) templates = tt.input;
			if(tt.output) template = tt.ouput;
		}

		publicAPIS.input = input;
		publicAPIS.output = output;

		init(inputText);

		return publicAPIS;
	};

	return Constructor;
})();


var Brush = (function () {
	'use strict';
	var mousepressed = false;
	document.addEventListener('mousedown', function(e){mousepressed = true;});
	document.addEventListener('mouseup', function(e){mousepressed = false;});

	var Constructor = function (opts) {
		var opts = opts || {}
		var text = opts.text || "Lorem Ipsum Dolor Sit Amet";
		var inputEl = opts.inputElement || document.querySelector('.input');
		var outputEl = opts.outputElement || document.querySelector('.output');
		var pp = {}

		function init(){
			pp = new Palette(text);
			inputEl.innerHTML = pp.renderInput();

			inputEl.addEventListener('click', event_handler_input);
			inputEl.addEventListener('mouseover', function(e){if(mousepressed){event_handler_input(e)}});
		}

		function event_handler_input(e){
			if (e.target.classList.contains('word') && !e.target.classList.contains('active')) {
				pp.toOutput(e.target.dataset.index);

				outputEl.innerHTML = pp.renderOutput();
				e.target.classList.add('active');

				[...outputEl.querySelectorAll('.word')].pop().classList.add('active');
				window.setTimeout(function () {
					[...outputEl.querySelectorAll('.word')].pop().classList.remove('active');
				}, 0);
			}
		}

		init()
		var publicAPIS = {}
		return publicAPIS;
	};

	return Constructor;
} )();

var brush = new Brush({text: document.querySelector('#test').innerText});
// the 2 div holders

function init(){

}
