
JeGol.addViewerPlugins('default',
{
     WriteLog: function(timestamp, nickname, msgID, defaultMsg)
     {
          defaultMsg = defaultMsg.replace(/(https?:\/\/([-\w\.]+)(:\d+)?([-~`!@#%&={}:;,"'<>\/\[\]\\\^\$\.\|\?\*\+\(\)\w\/]*))/g,'<a class="imLink" target="_new" href="$1">$1</a>');
          var id = (new Date()).getTime();
          var imDiv = $('<div></div>')
               .html('<div class="jegol_log_timestamp">' + timestamp + '</div>' + nickname + '<div id="imBody" class="jegol_log_message">' + defaultMsg + '</div>')
                  .attr('id', 'imDiv_' + id)
                  .attr('msgID', msgID);
                  
          imDiv.hover(TagMenuHelper.tagMenuPopIn, TagMenuHelper.tagMenuPopOut);

          return imDiv;
     }
});
