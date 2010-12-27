JeGol.addViewerPlugins('poll',
			       {
				    WriteLog: function(msg){
					return '<a target="_blank" href="' + msg + '">' + msg + '</a><br/><iframe target="new" class="jegol_plugin" frameborder="0" src="' + msg + '"> </iframe>';
				    }
				});