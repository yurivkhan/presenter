window.onload = function()
{
	function createSlide(n)
	{
		var slide = document.createElement('div');
		slide.id = 's' + n;
		slide.classList.add('slide');
		return slide;
	}

	var scriptPath = document.getElementById('presenter-loader').src.replace(/\/[^\/]*$/, '/');

	var stylesLink = document.createElement('link');
	stylesLink.type = 'text/css';
	stylesLink.rel = 'stylesheet';
	stylesLink.href = scriptPath + 'presenter.css';
	document.head.appendChild(stylesLink);

	var highlightScript = document.createElement('script');
	highlightScript.type = 'text/javascript';
	highlightScript.src = scriptPath + 'highlight.pack.js';
	highlightScript.onload = function()
	{

	var markedScript = document.createElement('script');
	markedScript.type = 'text/javascript';
	markedScript.src = scriptPath + 'marked.js';
	markedScript.onload = function()
	{
		marked.setOptions({
			highlight: function(code, lang) {
				return lang ? hljs.highlight(lang, code).value : code;
			}
		});

		var markdown = document.getElementById('markdown');
		var slides = document.createElement('div');
		slides.id = 'slides';
		slides.innerHTML = marked(markdown.textContent);

		var slideNumber = 1;
		var slide = createSlide(slideNumber++);

		for (var node = slides.firstChild; node;)
		{
			if (node.nodeType === Node.ELEMENT_NODE
				&& /^hr$/i.test(node.tagName))
			{
				var parent = node.parentNode;
				var hr = node;
				node = node.nextSibling;
				parent.replaceChild(slide, hr);
				slide = createSlide(slideNumber++);
				continue;
			}
			if (node.nodeType === Node.ELEMENT_NODE
				&& /^p$/i.test(node.tagName)
				&& node.childNodes.length === 1
				&& node.firstChild.nodeType === Node.ELEMENT_NODE
				&& /^img$/i.test(node.firstChild.tagName)
				&& (!slide.firstChild
					|| (slide.childNodes.length === 1
						&& slide.firstChild.nodeType === Node.TEXT_NODE
						&& slide.firstChild.nodeValue.trim() === '')))
			{
				var parent = node.parentNode;
				var p = node;
				var img = node.firstChild;
				slide.classList.add('image');
				slide.style.backgroundImage = 'url(' + img.src + ')';
				img.alt.
					split(/\s+/).
					filter(function(s) { return s !== ''; }).
					forEach(slide.classList.add.bind(slide.classList));
				node = node.nextSibling;
				parent.removeChild(p);
				continue;
			}
			var child = node;
			node = node.nextSibling;
			slide.appendChild(child);
		}
		slides.appendChild(slide);

		markdown.parentNode.replaceChild(slides, markdown);

		window.location.replace(window.location.hash || '#s1');

		var SHIFT = 256, CTRL = 512, ALT = 1024, META = 2048;

		function previousSlide(event, slides, thisSlide)
		{
			window.location.replace('#' + (thisSlide.previousSibling || thisSlide).id);
			event.preventDefault();
		}
		function nextSlide(event, slides, thisSlide)
		{
			window.location.replace('#' + (thisSlide.nextSibling || thisSlide).id);
			event.preventDefault();
		}
		function firstSlide(event, slides, thisSlide)
		{
			window.location.replace('#' + (slides.firstChild || slides).id);
			event.preventDefault();
		}
		function lastSlide(event, slides, thisSlide)
		{
			window.location.replace('#' + (slides.lastChild || slides).id);
			event.preventDefault();
		}

		var keyBindings = {};
		keyBindings[8/*Backspace*/] =
			keyBindings[SHIFT | 32/*Space*/] =
			keyBindings[33/*PgUp*/] =
			keyBindings[37/*Left*/] =
			keyBindings[38/*Up*/] = previousSlide;

		keyBindings[32/*Space*/] =
			keyBindings[34/*PgDn*/] =
			keyBindings[39/*Right*/] =
			keyBindings[40/*Down*/] = nextSlide;

		keyBindings[36/*Home*/] = firstSlide;

		keyBindings[35/*End*/] = lastSlide;

		var charBindings = {};
		charBindings['n'] = charBindings['N'] =
			charBindings['f'] = charBindings['F'] = nextSlide;
		charBindings['p'] = charBindings['P'] =
			charBindings['b'] = charBindings['B'] = previousSlide;
		charBindings['a'] = charBindings['A'] =
			charBindings['^'] = charBindings['g'] = firstSlide;
		charBindings['e'] = charBindings['E'] =
			charBindings['$'] = charBindings['G'] = lastSlide;

		window.onkeydown = function (event)
		{
			var keyCode = event.keyCode |
				(event.metaKey ? META : 0) |
				(event.altKey ? ALT : 0) |
				(event.ctrlKey ? CTRL : 0) |
				(event.shiftKey ? SHIFT : 0);
			if (keyBindings[keyCode])
				keyBindings[keyCode](
					event,
					document.getElementById('slides'),
					document.getElementById(window.location.hash.replace(/^#/, '')));
		}
		window.onkeypress = function (event)
		{
			var charCode = (event.metaKey ? 'M-' : '') +
				(event.altKey ? 'A-' : '') +
				(event.ctrlKey ? 'C-' : '') +
				String.fromCharCode(event.charCode);
			if (charBindings[charCode])
				charBindings[charCode](
					event,
					document.getElementById('slides'),
					document.getElementById(window.location.hash.replace(/^#/, '')));
		}
	}
	document.head.appendChild(markedScript);
	}
	document.head.appendChild(highlightScript);
}
