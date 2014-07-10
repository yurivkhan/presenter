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

	var markedScript = document.createElement('script');
	markedScript.type = 'text/javascript';
	markedScript.src = scriptPath + 'marked.js';
	markedScript.onload = function()
	{
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
			var child = node;
			node = node.nextSibling;
			slide.appendChild(child);
		}
		slides.appendChild(slide);

		markdown.parentNode.replaceChild(slides, markdown);
	}
	document.head.appendChild(markedScript);
}
