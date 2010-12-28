
TagMenuHelper = {
     tagMenuPopIn : function() //toggle menu on hover
     {
          var menu = $(this).find("#menu");
          if(menu.length == 0)
          {     
               //create and show QMUC IM menu
               var menuItems = TagMenuHelper._getMenuItems();
               
               menu = TagMenuHelper._createMenu(menuItems);
               menu.insertBefore($(this).find('#imBody'));
          }
          menu.slideToggle("slow");
     },
     tagMenuPopOut : function()
     {
          var item = $(this);
          var menu = item.find("#menu");
          menu.slideToggle("fast");
          //menu.remove();
     },
     _createMenu : function(menuItems)
     {
          var menu = $("<div id='menu'></div>")
                      .addClass('jegol_plugin_menu')
                      .hide(); //start out hidden
          //IM menu
          $.each(
            menuItems,
               function(index, aMenuItem)
               {  
                 //menu.append('|');
                 var menuItem = $("<input/>")
				 				 .attr('type', 'submit')
								 .val(aMenuItem.action)
                                 .attr('action', aMenuItem.action)
                                 .addClass('jegol_Button')
                                 .click(function(){aMenuItem.clicked($(this))});
                 menu.append(menuItem);
                 //menu.append('| ');
                 menu.append(' ');
               }
          );
          
          return menu;
     },
     _menuItemClicked : function(sender)
     {
          var p = sender.parent().parent();
          var f = p.find('#fromJID').attr('from');
          var b = p.find('#imBody').html();
          var action = sender.attr('action');
                 
          JeGol.sendStanza(b, action);
     },
     _getMenuItems: function()
     {
          var menuItems = new Array();
          menuItems[0] = {action: 'like',
                         clicked: function(sender){
                              var values = TagMenuHelper._getValues(sender);
                                     
                              JeGol.sendStanza(values.body, values.action);
                              }};
          menuItems[1] = {action: 'action',
                         clicked: function(sender){
                              var values = TagMenuHelper._getValues(sender);
                                     
                              JeGol.sendStanza(values.body, values.action);
                              }};
          menuItems[2] = {action: 'decision',
                         clicked: function(sender){
                              var values = TagMenuHelper._getValues(sender);
                                     
                              JeGol.sendStanza(values.body, values.action);
                              }};
          menuItems[3] = {action: 'park',
                         clicked: function(sender){
                              var values = TagMenuHelper._getValues(sender);
                                     
                              JeGol.sendStanza(values.body, values.action);
                              }};
          menuItems[4] = {action: 'tweet',
                         clicked: function(sender){
                              var values = TagMenuHelper._getValues(sender);
                              var url = 'http://twitter.com/share'
                              url += '?via=jeGol';
                              url += '&text=' + values.from + '-'+  values.body;
                              url += '&url=' + document.location.href;
                              window.open (url, 'tweet from notablechat', "location=1,status=1,scrollbars=1, width=500,height=500");
                              }};
          return menuItems;
     },
     _getValues : function(sender){
          var p = sender.parent().parent();
          var f = p.find('#fromJID').attr('from');
          var b = p.find('#imBody').text();
          var action = sender.attr('action');
          return {from: f, body: b, action: action};
     }
}