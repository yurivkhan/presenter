window.onload = function()
{
	var scriptPath = document.getElementById('presenter-loader').src.replace(/\/[^\/]*$/, '/');

	var markedScript = document.createElement('script');
	markedScript.type = 'text/javascript';
	markedScript.src = scriptPath + 'marked.js';
	markedScript.onload = function()
	{
		console.log(marked);
	}
	document.head.appendChild(markedScript);
}
