var BOSH_SERVICE = '/http-bind/';//'http://dev.qworky.net:5280/http-bind/';//

var JeGol = {
    connection: null,
    room: null,
    nickname: null,
    joined: null,
    participants: null,
    lastmessagefrom: null,
    autoReconnect: true,
    viewerPlugins: {},
    updatePlugins: {},
	/**
	* Registers viewer plugins
	*/
    addViewerPlugins: function (pluginName, pluginPrototype)
    {
        JeGol.viewerPlugins[pluginName] = pluginPrototype;
    },
	/**
	* Registers update plugin's
	*/
    addUpdatePlugins: function (pluginName, pluginPrototype)
    {
        JeGol.updatePlugins[pluginName] = pluginPrototype;
    },
	/**
	* Initialize components 
	*/
    init : function()
    {
		// init registered plugin's
		for (var pluginName in JeGol.viewerPlugins) {
		    if (JeGol.viewerPlugins.hasOwnProperty(pluginName)) {
				var pluginPrototype = JeGol.viewerPlugins[pluginName];
				var pluginObject = function () {};
				pluginObject.prototype = pluginPrototype;
				this[pluginName] = new pluginObject();
		    }
		}
		for (var pluginName in JeGol.updatePlugins) {
		    if (JeGol.updatePlugins.hasOwnProperty(pluginName)) {
				var pluginPrototype = JeGol.updatePlugins[pluginName];
				var pluginObject = function () {};
				pluginObject.prototype = pluginPrototype;
				this[pluginName] = new pluginObject();
		    }
		}
    },
    /**
    * Send message based on type ('chat' or 'groupchat')
    */
    execCommand : function(body){
		if(!body) return false;
		
		// clean out extra white space
		body = $.trim(body);
		
		// check if it is command type stanza "/{command} {parameter}
		var commandExists = body.match(/^\/(.+)\s/);
		if(commandExists){
			// separate command from parameter
		    var commandName = body.substring(1, body.indexOf(' '));
		    var parameter = body.substring(body.indexOf(' ') + 1, body.length);
		    
		    switch (commandName)
		    {
				case 'nickname' : // /nickname ...  is a special command
				    return JeGol.changeNickname(parameter);
				default:
				    return JeGol.sendStanza(parameter, commandName);
		    }
		}else{
			// default command is /body ....
		    return JeGol.sendStanza(body, 'body');
		}
    },
    /**
    * Sends stanza of XMPP-type groupchat.  
	* The inner body tag is added for the purpose of graceful degradation
	* for other unaware XMPP clients who look for the <body> tag.
	* If the command passed is already 'body' type, it will not be duplicated.
	* <body ...>
	*    <{command}>{message}</{command}>
	*    <body>/{command} {message}</body>
	*    <id>{psudo-GUID}</id>
	* </body>
    */
    sendStanza : function(message, type){       
		Strophe.debug('Sending ' + type + '...');
		if(JeGol._isNullOrEmpty(message) ) return false;
		
		var msg = $msg({
	            to: JeGol.room,
	            type: "groupchat"});
				
		msg.c(type).t(message);
		//for graceful degradation on other client
		if(type != 'body') {
		    msg.up();
		    msg.c('body').t('/' + type + ' ' + message);
		}
		msg.up();
		msg.c('id').t(JeGol.psudoGuid());
		JeGol.connection.send(msg); 
		
		return false;
    },
    /**
    * Reconnect to chat room requesting full chat history
    */
    getFullHistory : function(){
		// first make sure I am logged out
		JeGol.logout();
		// Clear out UI chat log
		$('#jegol_chatlog').empty();
		// Fetch log from begining of time
		JeGol.joinMUC({"since" : '1970-01-01T00:00:00Z'}); //get full chat history
    },
  
    /**
    * Establish connection
    * option 1 - from hidden fields with authenticated SID from server side
    */
    loginSIDOnPage : function(data){
        Strophe.info('Login started...');
		JeGol.room = data.room;
		JeGol.nickname = data.nickname;
        JeGol.connection.attach(data.jid, data.sid, data.rid, JeGol.onConnect);
        Strophe.info('Login complete.');
    },
    /**
    * Establish connection
    * option 2- from server side json store request for SID
    */
    loginSIDFromServer : function(serviceURL){
        Strophe.info('Login started...');
        
        Strophe.debug('Getting SID from SID service...');
            
        $.getJSON(serviceURL.jsonURL, function(data) {
            Strophe.debug('SID service returned...');
            try {
				JeGol.room = data.room;
				JeGol.nickname = data.nickname;
				JeGol.connection.attach(data.jid, data.sid, data.rid, JeGol.onConnect);
		              
				Strophe.info('Login complete.');
              
            }
			catch(e){
				Strophe.error('Login failed: ' + e.message);
            }
        
        });
    },
    /**
    * Establish connection
    * option 3 - from hidden fields with username/password
    */
    loginUsernamePassword : function(data){
        Strophe.info('Login started...');
		JeGol.room = data.room;
		JeGol.nickname = data.nickname;
        JeGol.connection.connect(data.jid, data.password, JeGol.onConnect);
        Strophe.info('Login complete.');
    },
    /**
    * Sends 'unavailable' XMPP-presence stanza and disconnect.
    */
    logout : function(){
		Strophe.info('Logout...');
		JeGol.connection.send($pres({to: JeGol.room + "/" + JeGol.nickname, type: 'unavailable'}).c('x', {xmlns: Strophe.NS.MUC}));
		JeGol.connection.disconnect();
    },
  
    /**
    * Re-login
    */
    refreshconnection : function(){
		Strophe.info('Refreshing connection...');
		
		if(JeGol.status == Strophe.Status.CONNECTED)
		    JeGol.logout();
		else
		    $(document).trigger('connect');
		
		return false;
    },
    /**
    * Changes nickname by sending XMPP-presence type stanza 
    */
    changeNickname : function(newNickname)
    {
		JeGol.setCookie("nickname", newNickname,1);
		var msg = Strophe.xmlElement("presence", [
			      ["from", JeGol.connection.jid],
			      ["to", JeGol.room + "/" + newNickname]
		 ]);
		var x = Strophe.xmlElement("x", [["xmlns", Strophe.NS.MUC]]);
		msg.appendChild(x);
		JeGol.connection.send(msg);
		
		return false;
    },
  
    /**
    * Listener for connection status change.
    * On Connected: Join chat room
	* On Disconnect: auto reconnect if so configured
    */
    onConnect : function (status){
		var ready = false;
		Strophe.info('Connection status: ' + status);
		switch (status)
		{
		    case Strophe.Status.DISCONNECTED:
				Strophe.info('Connection status: disconnected.');
				$('#jegol_connection_status').text('disconnected');
				$(document).trigger('disconnected');
				break;
		    case Strophe.Status.CONNECTED:
		    case Strophe.Status.ATTACHED:
				Strophe.info('Strophe is connected.');
				$('#jegol_connection_status').text('connected');
				$(document).trigger('connected');
				break;
		}
    },
      
    /**
    * Listener for presence. Updates roaster on UI
    */
    onPresence : function(pres){
        var from = $(pres).attr('from');
        var room = Strophe.getBareJidFromJid(from);
        
        if(room.toLowerCase() === JeGol.room.toLowerCase()){
            var nickname = Strophe.getResourceFromJid(from);
	    var nickname_cleaned = JeGol._stripTimeStampFromNickname(nickname);
            
            if($(pres).attr('type') === 'error' && !JeGol.joined){
                JeGol.connection.disconnect();
            } else if (!JeGol.participants[nickname] && $(pres).attr('type') !== 'unavailable'){
                var user_jid = $(pres).find('item').attr('jid');
                JeGol.participants[nickname] = user_jid || true;
                $('#jegol_roster').append('<li id="li_' + nickname_cleaned + '">' + nickname_cleaned + '</li>');
                
                if(JeGol.joined){
                    $(document).trigger('user_joined', nick);
                }
            } else if (JeGol.participants[nickname] && $(pres).attr('type') === 'unavailable'){
                $('#jegol_roster').find('#li_' + nickname_cleaned).remove();
				JeGol.participants[nickname] = false;
                $(document).trigger('user_left', nickname);
            }
        }
        
        if($(pres).attr('type') !== 'error' && !JeGol.joined){
            if($(pres).find("status[code='110']").length > 0){
                //check if server changed our nickname
                if($(pres).find("status[code='210']").length > 0){
                    JeGol.nickname = Strophe.getResourceFromJid(from);
                }
                
                $(document).trigger('room_joined');
            }
        }
        return true;
    },
    /**
    * Listener for in-bound messages.
	*/
    onPublicMessage : function(msg) {
        var from = $(msg).attr('from');
        var room = Strophe.getBareJidFromJid(from);
        var nickname = Strophe.getResourceFromJid(from);
        
        if(room.toLowerCase() === JeGol.room.toLowerCase()){
            //message from room or user?
            var notice = !nickname;
            
            var body = $(msg).children('body').text();
            var msgID = $(msg).children('id').text();
            
	    	//timestamp = now if message just came in, or get it from historical timestamp
            var delayed = $(msg).children('delay').length > 0 ||
                $(msg).children("x[xmlns='jabber:x:delay']").length > 0;
		
		    var timestamp = new Date().toTimeString();
		    if(delayed){
				timestamp = $(msg).children('delay').attr('stamp');
		    }
	    

	    	var subject = $(msg).children('subject').text();
	        if(!notice){
				// 1 [Viewer plug-in]- First chance to handle the message goes to the registered VIEWER type plug-ins
				//    Check if any of them could handle this message. If so, no other handler should bother
				var commandIsNotHandledYet = true;
				for (var pluginName in JeGol.viewerPlugins) {
				    if (JeGol.viewerPlugins.hasOwnProperty(pluginName) && $(msg).children(pluginName).text()) {
						var commandParam = $(msg).children(pluginName).text();
						var log = '<div><div class="jegol_log_timestamp">' + timestamp + '</div>';
						log += JeGol._logNickname(nickname);
						log += '<div id="imBody" class="jegol_log_message">';
						log += JeGol[pluginName].WriteLog(commandParam);
						log += '</div></div>';
						var imDiv = $(log);
						imDiv.hover(TagMenuHelper.tagMenuPopIn, TagMenuHelper.tagMenuPopOut);
						JeGol.addMessage(imDiv);
						// No other shouldn't bother if viewer handles it
						commandIsNotHandledYet = false;
						break;
				    }
				}
				
				// 2 [Update plug-in] - Second change to handle message goes to the UPDATE plug-ins
				//     Check if any of them could handle it. Also let the default handler log the message even if it is handled here
				if(commandIsNotHandledYet)
				{
				    for (var pluginName in JeGol.updatePlugins) {
						if (JeGol.updatePlugins.hasOwnProperty(pluginName) && $(msg).children(pluginName).text()) {
						    var commandParam = $(msg).children(pluginName).text();
						    JeGol[pluginName].DoUpdate(commandParam);
						    // Do not change set commandIsNotHandledYet to true because we want the default
							// handler to log it as well.
						    break;
						}
				    }
				}
			
				// 3 [Default] - Use default viewer if no other viewer plugin handled the message
				if (commandIsNotHandledYet){
				   
				    var logmsg = JeGol['default'].WriteLog(timestamp, JeGol._logNickname(nickname), msgID, body);
				    
				    JeGol.addMessage(logmsg);
				}
				
				// audio visual indicator
				JeGol['notify'].DoUpdate($(msg));
		
		    }
			else{
                JeGol.addMessage('<div>***' + body + '</div>');
            }
        }
        return true;
    },
    /**
    * Append to message log to UI
    */
    addMessage : function(msg){
        var chat = $('#jegol_chatlog').get(0);
        var isAtBottom = chat.scrollTop >= chat.scrollHeight - chat.clientHeight;
        
        $('#jegol_chatlog').append(msg);
        
        if(isAtBottom){
            chat.scrollTop = chat.scrollHeight;
        }
    },
    /**
    * Helper: HTML encode 
    */
    _htmlEncode : function (value){ 
		return $('<div/>').text(value).html(); 
    }, 
    /**
    * Helper: HTML dencode 
    */
    _htmlDecode : function(value){ 
		return $('<div/>').html(value).text(); 
    },
    /**
    * Helper: True if string is null or empty or line break 
    */
    _isNullOrEmpty : function(value){
		if(!value
		   ||
		   value.lengh == 0
		   ||
		   value == '\n'
		   ){
		  return true;
		}
		return false;
    },
/*
    _log : function (level, msg) {
		try{
		    var dateTime = new Date();
		    msg = '[' + dateTime.getHours() + ':' + dateTime.getMinutes() + ':' + dateTime.getSeconds() + ':' + dateTime.getMilliseconds() +'] ' + msg;
		    if(console)
				console.log(msg);
		}catch(e){}
    },
*/
	/**
	* To support multiple browser/client with same nickname, a timestamp is added after a ":~:" pattern. 
	* This helper strips the nickname to bare name. e.g. Guest1324:~:1278889735, alem:~:1278889735
	*/
    _stripTimeStampFromNickname : function(nickname){
		return nickname.split(':~:')[0];
    },
	/**
	* If the same JID/nickname sends multiple messages, do not display it repeatedly. 
	* The first message will have the nickname, subsequent messages will not until the sequence is broken by 
	* someone else sending a message in between.
	*/
    _logNickname : function(nickname){
		if(JeGol.lastmessagefrom != nickname) //skip nickname if from same nickname
		{
		    JeGol.lastmessagefrom = nickname;
		    var tempName = JeGol._stripTimeStampFromNickname(nickname);
		    return '<div id="fromJID" from="' + tempName + '" class="jegol_log_nickname">' + tempName + ': </div>';
		}
		return '';
    },
	/**
	 * Helper: Generate psudo GUID
	 */
    psudoGuid : function(){
		return (JeGol.S4()+JeGol.S4()
			+"-"+
			JeGol.S4()+JeGol.S4()
			+"-"+
			JeGol.S4()+JeGol.S4()
			+"-"+
			JeGol.S4()+JeGol.S4());
    },
    S4 : function() {
		return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    },
	/**
	 * Helper: Set value in cookie
	 */
    setCookie: function (c_name,value,expiredays)
    {
		var exdate=new Date();
		exdate.setDate(exdate.getDate()+expiredays);
		document.cookie=c_name+ "=" +escape(value)+
		((expiredays==null) ? "" : ";expires="+exdate.toUTCString());
    },
	/**
	 * Helper: Get value from cookie
	 */
    getCookie: function (c_name)
    {
		if (document.cookie.length>0)
		{
		    c_start=document.cookie.indexOf(c_name + "=");
		    if (c_start!=-1)
		    {
			c_start=c_start + c_name.length+1;
			c_end=document.cookie.indexOf(";",c_start);
			if (c_end==-1) c_end=document.cookie.length;
			return unescape(document.cookie.substring(c_start,c_end));
		    }
		}
		return "";
    }
}

/**
* Bind event: jegol_init
*/
$(document).bind('jegol_init', function(e, d){
    JeGol.init();
    $(document).trigger('connect');
});


/**
* On Connect event - initialize a strope connection and login from authenticated session service URL
*/
$(document).bind('connect', function(e, d){
   JeGol.connection = new Strophe.Connection(BOSH_SERVICE);
   $('#jegol_connection_status').text('connecting...');
   JeGol.loginSIDFromServer({jsonURL: $('#jegol_service_url').val()});
});

/**
* After connection is made, initialize properties
*/
$(document).bind('connected', function(){
	// Chat room is not yet joined
	JeGol.joined = false; 
	// Empty participants list. Haven't gotten them yet.
	JeGol.participants = {};
	// Make my presence known to XMPP server
	JeGol.connection.send($pres().c('priority').t('-1'));
	
	// Register listeners
	JeGol.connection.addHandler(JeGol.onPresence, null, 'presence', null, null,  null); 
	// TODO: Private IM is not supported yet 
	//JeGol.connection.addHandler(JeGol.onPublicMessage, null, 'message', 'chat', null,  null); 
	JeGol.connection.addHandler(JeGol.onPublicMessage, null, 'message', 'groupchat', null,  null);
    
	// If nickname is known from cookie, pick that up.
	if(JeGol.getCookie("nickname") != ''){
		JeGol.nickname = JeGol.getCookie("nickname");
    }
	
	// Make my presence known to chat room
	JeGol.connection.send($pres({to: JeGol.room + '/' + JeGol.nickname}).c('x', {xmlns: Strophe.NS.MUC}));
});

/**
* On disconnect, clear out UI elements, kill connection and trigger reconnection if specified
*/
$(document).bind('disconnected', function(){
    JeGol.connection = null;
    $('#jegol_topic').empty();
    $('#jegol_roster').empty();
    $('#jegol_chatlog').empty();
    
    if(JeGol.autoReconnect == true)
    {
		$(document).trigger('connect');
    }
});

$(document).bind('room_joined', function(){
    JeGol.joined = true;
    JeGol.addMessage("<div class='jegol_log_i_joined'>*** Room joined.</div>")
});

$(document).bind('user_joined', function(e, nickname){
    JeGol.addMessage("<div class='jegol_log_user_joined'>" + JeGol._stripTimeStampFromNickname(nickname) + " joined.</div>")
});

$(document).bind('user_left', function(e, nickname){
    JeGol.addMessage("<div class='jegol_log_user_left'>" + JeGol._stripTimeStampFromNickname(nickname) + " left.</div>")
});

/**
* UI action listener - on enter, do post
*/
$('#jegol_msgArea').live('keypress', function(e) {
    if(e.keyCode == 13) {
        e.preventDefault();        
        JeGol.execCommand($(this).val());
        $(this).val('');
    }
});

$('#jegol_postButton').live('click', function(e){
    JeGol.execCommand($('#jegol_msgArea').val());
    $('#jegol_msgArea').val('');
});

/**
* Start connection on HTML page load
*/
window.onload = function() {
	$(document).trigger('jegol_init');
};

/**
 *  Close connection on HTML page unload
 */
window.onbeforeunload = function(){
    //var r=confirm("Are you sure you want to leave the chat room?");
    //if (r==true)
    //{
	JeGol.autoReconnect = false;
	JeGol.logout();
    //}
};
