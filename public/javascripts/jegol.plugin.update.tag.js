
/**
 * Register 'like' update plugin
 */
JeGol.addUpdatePlugins('like',
{
	/**
	 * Adds the parameter to like section
	 * @param {Object} msg
	 */
     DoUpdate: function(msg)
     {
          var section = $("#jegol_tags").find('#like');
          if(section.length == 0){
               section = $('<fieldset id="like" class="jegol_tag_frameset" ><legend>/like</legend></fieldset>')
               $("#jegol_tags").append(section);
          }
          section.append('<div class="jegol_tags_item">' + msg + '</div>');
          return false;
     }
});

/**
 * Register 'action' update plugin
 */
JeGol.addUpdatePlugins('action',
{
	/**
	 * Adds the parameter to action section
	 * @param {Object} msg
	 */
     DoUpdate: function(msg)
     {
          var section = $("#jegol_tags").find('#action');
          if(section.length == 0){
               section = $('<fieldset id="action" class="jegol_tag_frameset" ><legend>/action</legend></fieldset>')
               $("#jegol_tags").append(section);
          }
          section.append('<div class="jegol_tags_item">' + msg + '</div>');
          return false;
     }
});

/**
 * Register 'decision' update plugin
 */
JeGol.addUpdatePlugins('decision',
{
	/**
	 * Adds the parameter to decision section
	 * @param {Object} msg
	 */
     DoUpdate: function(msg)
     {
          var section = $("#jegol_tags").find('#decision');
          if(section.length == 0){
               section = $('<fieldset id="decision" class="jegol_tag_frameset" ><legend>/decision</legend></fieldset>')
               $("#jegol_tags").append(section);
          }
          section.append('<div class="jegol_tags_item">' + msg + '</div>');
          return false;
     }
});

/**
 * Register 'park' update plugin
 */
JeGol.addUpdatePlugins('park',
{
	/**
	 * Adds the parameter to park section
	 * @param {Object} msg
	 */
     DoUpdate: function(msg)
     {
          var section = $("#jegol_tags").find('#park');
          if(section.length == 0){
               section = $('<fieldset id="park" class="jegol_tag_frameset" ><legend>/park</legend></fieldset>')
               $("#jegol_tags").append(section);
          }
          section.append('<div class="jegol_tags_item">' + msg + '</div>');
          return false;
     }
});