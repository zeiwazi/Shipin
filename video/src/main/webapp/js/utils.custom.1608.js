/*
	need jQuery,jQuery.ui.core,jQuery.ui.dialog,jQuery.form.js,jQuery.blockUI.js
*/
(function($){
	var utils = window.utils || (window.utils = {});
	var g_var = window.g_var || (window.g_var = {});
		g_var.logoutURL = g_var.logoutURL || 'login.jsp';
		g_var.resPath = ($('link:eq(0)').attr('href')||'${_skin_}').replace(/(.+)\/(css|js)\/.+/,'$1');

	var ud = utils.dtree = {};
		ud.setIcon = function(dtree,bPath,icon){
			bPath = bPath || '';
			icon = icon || {
				root		: g_var.resPath + '/imgs/dtree/fav_folder.gif',
				folder		: g_var.resPath + '/imgs/dtree/folder.gif',
				node		: g_var.resPath + '/imgs/dtree/node.gif',
				empty		: g_var.resPath + '/imgs/dtree/empty.gif',
				line		: g_var.resPath + '/imgs/dtree/line.gif',
				join		: g_var.resPath + '/imgs/dtree/join.gif',
				joinBottom	: g_var.resPath + '/imgs/dtree/joinbottom.gif',
				plus		: g_var.resPath + '/imgs/dtree/plus.gif',
				minus		: g_var.resPath + '/imgs/dtree/minus.gif',
				minusBottom	: g_var.resPath + '/imgs/dtree/minusbottom.gif',
				plusBottom	: g_var.resPath + '/imgs/dtree/plusbottom.gif',
				nlPlus		: g_var.resPath + '/imgs/dtree/nolines_plus.gif',
				nlMinus		: g_var.resPath + '/imgs/dtree/nolines_minus.gif',
				folderOpen	: g_var.resPath + '/imgs/dtree/folderopen.gif'
			};
			for(var a in icon) {
				dtree.icon[a] = bPath + icon[a];
			}
		}
	var uf = utils.form = {};
		uf.clear = function(f) {
			f = $(f);
			var a = ['checkbox','hidden','input','password','radio','text','textarea'];
			$.each(a,function(i,n){
				f.find(n).val('');
			});
			return f;
		};
		uf.fill = function(f,o,prefix) {
			f = $(f);
			for(var name in o) {
				var val = o[name];
				f.find('[name="'+ (prefix ? (prefix + name) : name) +'"]').val(val);
			}
			return f;
		};
		uf.json = function(f) {
			var o = $(f).serializeObject();
			var ret = {};
			for(var a in o) {
				if(o[a]) {
					ret[a] = o[a];
				}
			}
			return ret;
		};
	var ul = utils.layout = {};
		//func	: window.resize
		//args	: [#id, $url]...
		//fix bug - resize invalidation caused by iframe loading page(ie6,7,8)
		ul.resizeIframe = function(func, args) {
			$(window).resize(func).resize();
			for(var i=1; i<arguments.length; i++){
				var id = arguments[i][0], src = arguments[i][1];
				var iframe = $(id).attr('src',src);
				utils.iframe.onload(iframe,func);
			}
			window.setTimeout(func,1);
		}
	utils.getEl = function(id) {
		var el = null, win = window;
		do{
			if(el = win.document.getElementById(id))
				break;
		}while((win != window.top)&&(win = win.parent))
		return el;
	}
	utils.alert = function(msg,callback){
		setTimeout(function(){
			alert(msg);
			(callback || $.noop)();
		},1);
	}
	utils.confirm = function(msg,cbSuccess,cbFailed,sORfWhenMsgIsNull){
		if(msg || sORfWhenMsgIsNull === undefined){
			window.confirm(msg) ? cbSuccess.call(this) : (cbFailed||$.noop).call(this);
		}
		else{
			sORfWhenMsgIsNull ? cbSuccess.call(this) : (cbFailed||$.noop).call(this);
		}
	}
	utils.load = function(el, url, params, callback, dlgArgs) {
		dlgArgs = dlgArgs == undefined ? 'open' : (dlgArgs == false ? 'close' : dlgArgs);
		var $loading = utils.loadMask(dlgArgs, new Date().getTime() + Math.random());
		var onLoaded = (function($loading){
			return function(){
				setTimeout(function(){$loading.dialog('close');$loading.dialog('destroy');$loading.remove()},1);
			};
		})($loading);

		var $this = $(el);
			$this.load(url, params, function(jqXHR, status, responseText){
				onLoaded();
				if ( callback ) {
					$this.each( callback, [ responseText, status, jqXHR ] );
				}
			});
		return $this;
	};
	utils.getJSArgs = function(){
		var $scripts = document.getElementsByTagName('script');
		var $script = $scripts[ $scripts.length - 1 ];
		var params = $script.src.split('?')[1].split('&');
		
		var args={};
		for(var i=0; i<params.length; i++) {
			var param = params[i].split('=');
			var name = param[0];
			var value = param[1];
			if( args[name] == undefined ) {
				args[name] = value;
			}
			else if( args[name] instanceof Array ){
				args[name].push( value );
			}
			else {
				args[name] = [ args[name], value ];
			}
		}
		return args;
	};
	//utils.stdLoad($wrap, url, param, succ, fail)
	utils.stdLoad = function(opts){
		var $img = null;
		if( typeof(opts) == 'string' || (opts.getAttributeNode && opts.nodeType) || opts.jquery ) {
			$img = $(opts);
		}
		if( !$img.is('img') ) {
			var $el = $img;
			$img = $('<img src="resource/icon/loading.gif"/>');
			$img.appendTo($el);
		}
		if( !$img.attr('src') ) {
			$img.attr('src', 'resource/icon/loading.gif');
		}
		var args = [];
		for(var i=1; i<arguments.length; i++){
			args.push( arguments[i] );
		}
		//url,data,cbSuccess,cbFailure,dlgArgs
		var onSucc = args[2];
		args[2] = function(){
			$img.remove();
			onSucc.apply(this, arguments);
		};
		var onFail = args[3];
		args[3] = function(){
			$img.attr('src', 'resource/icon/retry.gif');
			if( $.isFunction(onFail) ){
				return onFail.apply(this, arguments);
			}
		};
		args[4] = false;
		return utils.stdPost.apply(utils, args);
	};
	utils.cbind = function(event, callback){
		(function(event, callback){
			var top = utils.getTop();
			var $top = top.$(top);
				$top.bind(event, callback);
			if( !window.onbeforeunload ) {
				window.onbeforeunload = function(){
					$top.unbind(event, callback);
				};
			}
			$(window).bind('unload', function(){
				$top.unbind(event, callback);
			});
		})(event + '.' + utils.uuid(), callback);
	};
	utils.cfire = function(event){
		var top = utils.getTop();
		var $top = top.$(top);
			$top.trigger.apply($top, arguments);
	};

	utils.getTabs = function(){
		try {
			var win = window;
			while( true ) {
				console.info( 'workspace_tabs', win.workspace_tabs, 'oTabs', win.oTabs );
				if( win.workspace_tabs ) {
					return win.workspace_tabs;
				}
				if( win.oTabs ) {
					return win.oTabs;
				}
				if( win == top ){
					break;
				}
				win = win.parent;
			}
		}
		catch (e){}
		return null;
	};
	utils.getWin = function(callback){
		var win = window;
		while( win != top ) {
			try {
				var CrossDomain = win.parent.CrossDomain;
				if( !$.isFunction(callback) || callback(win) ) {
					break;
				}
			}
			catch(e){break;}
			win = win.parent;
		}
		return win;
	};
	utils.link2 = function(){
		var opts = {};
		var args = arguments;
		if( args.length == 1 && $.isPlainObject(args[0]) ){
			opts = args[0];
		}
		else {
			opts.url = args[0];
			opts.title = args[1];
		}
		var open = function(opts){
			window.location.href = opts.url;
			utils.block($('body'));
		};
		var tabs = utils.getTabs();
		if( tabs != null ){
			open = function(opts){
				opts.code = opts.code || opts.url;
				tabs.addTab( opts );
			}
		}
		open(opts);
	};
	utils.linkClose = function(){
		var tabs = utils.getTabs();
		if( tabs ){
			console.info(tabs);
			tabs.closeTab(window);
		}
		var args = arguments;
		if( args.legnth  == 1 ){
			if( $.isFunction(args[0]) ){
				args[0];
			}
			else {
				document.location.href = args[0];
			}
		}
		else if( true || args.length == 0 ){
			window.close();
			location.replace('about:blank');
		}
	};
	/** @deprecated */
	utils.hasScroller = function (el) {
		// test targets
		var elems = el ? [el] : [document.documentElement, document.body];
		var scrollX = false, scrollY = false;
		for (var i = 0; i < elems.length; i++) {
			var o = elems[i];
			// test horizontal
			var sl = o.scrollLeft;
			o.scrollLeft += (sl > 0) ? -1 : 1;
			o.scrollLeft !== sl && (scrollX = scrollX || true);
			o.scrollLeft = sl;
			// test vertical
			var st = o.scrollTop;
			o.scrollTop += (st > 0) ? -1 : 1;
			o.scrollTop !== st && (scrollY = scrollY || true);
			o.scrollTop = st;
		}
		// ret
		return {
			x	: scrollX,
			y	: scrollY,
			scrollX: scrollX,
			scrollY: scrollY
		};
	};
	/** @deprecated */
	utils.getScrollSize = function(){
		var scroll = utils.hasScroller();
		return {
			width	: scroll.x ? 24 : 0,
			height	: scroll.y ? 24 : 0
		};
	};
})(jQuery);
(function($) {
	//hack for $.trim(1234)
	$._trim = $.trim;
	$.trim = function(text) {
		return $._trim((text || '').toString());
	}

	$.fn.serializeObject = function(containsAll) {
		if(containsAll) {
			var tmp = '_disabled_' + parseInt(Math.random()*100);
			var all = this.add(this.find('checkbox,input,password,radio,textarea'));
			$.each(all,function(i,el){
				$(el).attr(tmp,$(el).attr('disabled')).attr('disabled',false);
			});
			var o = all.serializeObject(false);
			$.each(all,function(i,el){
				$(el).attr('disabled',$(el).attr(tmp)=='true').removeAttr(tmp);
			});
			return o;
		}
		else {
			var o = {};
			var a = this.serializeArray();
			$.each(a, function() {
				if (o[this.name]) {
					if (!o[this.name].push) {
						o[this.name] = [o[this.name]];
					}
					o[this.name].push(this.value || '');
				} else {
					o[this.name] = this.value || '';
				}
			});
			return o;
		}
	};
})(jQuery);



//$h,$f
(function($) {
	var $doc = $(document);
	window.$h = function(fn, iMilliSeconds){
		//iMilliSeconds = iMilliSeconds == undefined ? 50 : 0;
		(function(fn, iMilliSeconds){
			var func = function(){
				try {
					fn.apply(this, arguments);
				}
				catch (e){
					console.error(e);
				}
			};
			$doc.bind('head.inited', function(){
				var self = this;
				var args = arguments;
				if( parseInt(iMilliSeconds) ){
					window.setTimeout(function(){ func.apply(self, args); }, iMilliSeconds);
				}
				else {
					func.apply(self, args);
				}
			});
		})(fn, iMilliSeconds);
	}
	window.$f = function(fn, iMilliSeconds){
		//iMilliSeconds = iMilliSeconds == undefined ? 50 : 0;
		(function(fn, iMilliSeconds){
			var func = function(){
				try {
					fn.apply(this, arguments);
				}
				catch (e){
					console.error(e);
				}
			};
			$doc.bind('foot.inited', function(){
				var self = this;
				var args = arguments;
				if( parseInt(iMilliSeconds) ){
					window.setTimeout(function(){ func.apply(self, args); }, iMilliSeconds);
				}
				else {
					func.apply(self, args);
				}
			});
		})(fn, iMilliSeconds);
	}
})(jQuery);



//=============================
//		2014/12/01
//=============================
(function($){
	utils.iframe.extRes = function(opts){
		opts = opts || {};
		opts.dialog = opts.dialog || { /*width : 256, height : 256*/ };
		var on = {};
			on.ensure = function(){ /*utils.linkClose();*/ }
			on.cancel = function(){ /*utils.linkClose();*/ }
			on.resize = function(){}
			on.getDialogOption = function(){ return opts.dialog; };
		return window.onResExt = on;
	};
	utils.iframe.resExt = function(option){
		option.width = option.width || 256;
		option.height = option.height || 256;
		option.buttons = option.buttons || {};
		option.onLoad = option.onLoad || $.noop;
		option.onClose = option.onClose || $.noop;
		option.onCancel = option.onCancel || $.noop;
		option.onEnsure = option.onEnsure || $.noop;
		option.adaptive = !!option.adaptive;
		var opts = {};
			opts.url = option.url;
			opts.title = option.title;
			opts.width = option.width;
			opts.height = option.height;
			opts.buttons = option.buttons;
			opts.isHideCloseButton = option.isHideCloseButton;
			opts.onload = function(){
				var $dialog = this.$dialog;
					$dialog.bind("dialogclose", function( event, ui ){
						if( option.onClose() !== false ){
							window.setTimeout(function(){
								$dialog.remove();
							}, 500);
						}
					});
				var win = this.$ifrm.get(0).contentWindow;
				if( win && win.onResExt ){
					win.onResExt.close = function(){
						$dialog.dialog('close');
					};
					win.onResExt.cancel = function(){
						if( option.onCancel() !== false ){
							$dialog.dialog('close');
						}
					};
					win.onResExt.ensure = function(){
						if( option.onEnsure.apply(this, arguments) !== false ){
							$dialog.dialog('close');
						}
					};
					win.onResExt.fire = function(eventName){
						var func = option[eventName];
						if( $.isFunction(func) && func.apply(this, arguments) !== false ){
							$dialog.dialog('close');
						}
					};
					if( win.onResExt.getDialogOption ){
						var $body = $('body');
						var dialogOption = win.onResExt.getDialogOption();
						for(var attr in dialogOption ){
							var val = dialogOption[attr];
							if( attr == 'width' ){
								val = val <= 1 ? $body.width() * val : val;
							}
							else if( attr == 'height' ){
								val = val <= 1 ? $body.height() * val : val;
							}
							$dialog.dialog('option', attr, val);
						}
						if( !dialogOption.position ){
							$dialog.dialog('option', 'position', {at : 'center'});
						}
					}
					if( win.onResExt.onload ){
						win.onResExt.onload();
					}
				}
				option.onLoad.call(win);
			};
		var dialog = utils.iframe.dialog;
		if( option.adaptive ) {
			var win = utils.getWin(function(win){
				if( !win.$ || !win.utils ) {
					return false;
				}
				var $body = win.$('body');
				return $body.width() >= option.width && $body.height() >= option.height;
			});
			dialog = win.utils.iframe.dialog;
		}
		dialog(opts);
	};
})(jQuery);

