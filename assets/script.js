var before = document.querySelector('.before');
var after = document.querySelector('.after');

var splitter = ' '

var contentBefore = before.innerText.split(splitter);
var contentAfter =  []

before.addEventListener('click', function(e) {
  tt = e.target;
  if(tt.classList.contains('word')){
    text = tt.innerText;
    contentAfter.push(text.replace(/\W/,''));
    contentBefore.splice(tt.dataset.index, 1)
    render();
  }
})

function renderToHtml(cc){
  var rr = cc.map((c,i) => {return `<span class="word dib pointer" data-index="${i}" >${c}</span>`}).join(splitter);
  return rr
}

function render(){
  before.innerHTML = renderToHtml(contentBefore)
  after.innerHTML = renderToHtml(contentAfter)
}

render()
