/**
 * Register 'subject' update plugin
 */
JeGol.addUpdatePlugins('subject',
{
	/**
	 * Update plugin - Sets topic/subject of chat window.
	 * @param {Object} msgTitle - string topic
	 */
     DoUpdate: function(msgTitle)
     {
          $("#jegol_topic").html(msgTitle);
          return false;
     }
});


