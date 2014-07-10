window.onload = function()
{
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
		markdown.parentNode.replaceChild(slides, markdown);
	}
	document.head.appendChild(markedScript);
}
