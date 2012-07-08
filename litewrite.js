function $(id){
	return document.getElementById(id)
}
var id = localStorage.last_id = localStorage.last_id || 0


function show(id) {
	$('editor').innerHTML = localStorage.getItem(id + '_html') || ''
	localStorage.setItem('current-document', id)
}

function select() {
	document.createRange().setStart($('editor'), 0)
	getSelection().removeAllRanges()
	getSelection().addRange(document.createRange())
}

function create() {
	id = ++localStorage.last_id
	$('editor').textContent = ''
	localStorage.setItem(id, '')
	location.hash = '#'+ id
	select()
	updateList()
}

function updateList() {
	var l = parseInt(localStorage.last_id) + 1
	var r = []
	for (var i=0; i<l; ++i) {
		var item = localStorage.getItem(i)
		// var itemhtml = localStorage.getItem(i+'_html')
		if (item) {
			r.push('<a id="item_'+ i +'" href="#'+i+'">'+ item.slice(0, 50) +'</a>')
			// this makes for a better cut, but does not always work
			// r.push('<a id="item_'+ i +'" href="#'+i+'">'+ itemhtml.slice(0, itemhtml.indexOf('<') +'</a>')
		}
	}

	$('entries').innerHTML = r.join('')
	highlightSelected()
}

function check() {
	var hash = location.hash
	if (hash) {
		id = hash.slice(1)
		if (id in localStorage) {
			show(id)
		}
	} else {
		show(localStorage.getItem('current-document'))
		location.hash = '#'+localStorage.getItem('current-document')
	}
	updateList()
	select()
	document.getElementsByTagName('body')[0].className = localStorage.getItem('bgcolor');
	$('aside').className = 'visible';
	setTimeout( function() { $('aside').className = ''; } , 2000); // maybe only fade out after typing start
}

function setTitle(str) {
	if (str.length >= 30) {
		var i = str.lastIndexOf(" ") + 1
		if (i)
			str = str.slice(0, i)
		str += '...'
	}
	document.title = str
}

function highlightSelected(){
	var hash = location.hash.slice(1)
	if (!hash) return
	var element = $('item_'+hash)
	if (element) {
		element.className += ' selected'
		setTitle(element.textContent)
	}
}

function colorToggle(){
	var body = document.getElementsByTagName('body')[0];
	if(body.className == 'dark') {
		body.className = ''
		localStorage.setItem('bgcolor', '')
	}
	else {
		body.className = 'dark'
		localStorage.setItem('bgcolor', 'dark')
	}
}

function formatting(){ // this needs to get incredibly optimized …
	for(i=0; i<$('editor').getElementsByTagName('div').length; i++) {
		// bullet points, deactivated for now /*
		/*if(($('editor').getElementsByTagName('div')[i].innerHTML.substring(0, 2) == '* ') || ($('editor').getElementsByTagName('div')[i].innerHTML.substring(0, 2) == '• ')) {
			$('editor').getElementsByTagName('div')[i].className = 'listelement';
			if($('editor').getElementsByTagName('div')[i].innerHTML.substring(0, 2) == '* ') {
				$('editor').getElementsByTagName('div')[i].innerHTML = '•' + $('editor').getElementsByTagName('div')[i].innerHTML.substring(1);
			}
		}
		// headings
		else */if($('editor').getElementsByTagName('div')[i].innerHTML.substring(0, 1) == '#') {
			$('editor').getElementsByTagName('div')[i].className = 'subheading';
		}
		else {
			$('editor').getElementsByTagName('div')[i].className = '';
		}
	}
}


$('editor').onkeyup = $('editor').onpaste = function(e){
	var html = e.target.innerHTML
	if (html != localStorage.getItem(id+'_html')) {
		localStorage.setItem(id, e.target.textContent)
		localStorage.setItem(id+'_html', html)
		updateList()
	}
	formatting();
}

onload=onhashchange=check
