
JeGol.addViewerPlugins('youtube',
			       {
				    WriteLog: function(msg){
					return '<a target="_blank" href="' + msg + '">' + msg + '</a><br/><object class="jegol_plugin"><param name="movie" value="' + msg + '&amp;hl=en_US&amp;fs=1"></param><param name="allowFullScreen" value=""></param><param name="allowscriptaccess" value="always"></param><embed src="' + msg + '&amp;hl=en_US&amp;fs=1" type="application/x-shockwave-flash" allowscriptaccess="always" allowfullscreen="true" class="jegol_plugin"></embed></object>';
				    }
				});