
/**
 * Register 'notify' update plugin
 */
JeGol.addUpdatePlugins('notify',
{
	/**
	 * Update plugin - Audio visual inication for new messages.
	 * @param {Object} msgStanza - string topic
	 */
     DoUpdate: function(msgStanza)
     {
		flashIfOutofScope();
      	return false;
     }
});

var browserInfocus = 1;
var flashSpeed = 1500;
var defaultTitle = 'jeGol';

function onBlur() {
	browserInfocus = 0;
}
function onFocus(){
	browserInfocus = 1;
}

function flashIfOutofScope(){
	if (browserInfocus == 1)
    {
		window.document.title = defaultTitle;
    }  
  	else
    {
		if(window.document.title == defaultTitle)
		{
			window.document.title = '*New Message*';
		}else
		{
			window.document.title = defaultTitle;
		}
		setTimeout("flashIfOutofScope();",flashSpeed);
    }
}

if (/*@cc_on!@*/false) { // check for Internet Explorer
	document.onfocusin = onFocus;
	document.onfocusout = onBlur;
} else {
	window.onfocus = onFocus;
	window.onblur = onBlur;
}
