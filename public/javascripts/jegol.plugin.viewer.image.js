
JeGol.addViewerPlugins('image',
			       {
				    WriteLog: function(msg){
					return '<a target="_blank" href="' + msg + '">' + msg + '</a><br/><img class="jegol_plugin" src="' + msg + '"/>';
                                    }
				});