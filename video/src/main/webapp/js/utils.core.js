/*
	need jQuery,jQuery.ui.core,jQuery.ui.dialog,jQuery.form.js,jQuery.blockUI.js
*/
(function(exports){
	if( !exports.console ) {
		exports.console = {};
		exports.console.info = exports.console.debug = exports.console.error = function(){};
	}
	var console = exports.console;
})(window);
(function($){
	var utils = window.utils || (window.utils = {});
	var g_var = window.g_var || (window.g_var = {});
		g_var.logoutURL = g_var.logoutURL || 'login.jsp';
		g_var.resPath = ($('link:eq(0)').attr('href')||'${_skin_}').replace(/(.+)\/(css|js)\/.+/,'$1');
	
	utils.qs = function(str, quotes){
		return (quotes || '"') + str + (quotes || '"');
	};

	utils.inArray = function(array, val) {
		for(var i=0; i<array.length; i++) {
			if( typeof(val) == 'function' ){
				if( val(i, array[i]) !== false ){
					return i;
				}
			}
			else if( array[i] == val ) {
				return i;
			}
		}
		return -1;
	};
	/**
	 * utils.rmArray(origArray, delArray, fnEquals) 
	 * | utils.rmArray(array, item, fnEquals) 
	 * | utils.rmArray(array, fnEquals)
	 * fnEquals = function(i, origItem, delItem){}
	 */
	utils.rmArray = utils.delArray = function(){
		var args = arguments;
		var items = args[0];
		var rm = $.isFunction(args[1]) ? [null] : args[1];
			rm = $.isArray(rm) ? rm : [rm];
		var equals = $.isFunction(args[1]) ? args[1] : args[2];
			equals = $.isFunction(equals) ? equals : function(i, o1, o2){return o1 == o2;}
		$.each(rm, function(i, item){
			for(var i=0; i<items.length; i++) {
				if( equals(i, items[i], item) ) {
					items.splice(i, 1);
					i--;
				}
			}
		});
		return items;
	};
	utils.each = function(array, callback){
		var rets = [];
		if( array instanceof Array ){
			for(var i=0; i<array.length; i++){
				var val = callback(i, array[i]);
				if( val !== null && val !== undefined ){
					rets.push( val );
				}
			}
		}
		else {
			var map = array;
			for(var attr in map){
				var val = callback(attr, map[attr]);
				if( val !== null && val !== undefined ){
					rets.push( val );
				}
			}
		}
		return rets;
	};
	/**
	 * utils.map({a : 1, b : 2}, function(k, v){ return k == 'b' ? 3 : null }) = {b : 3}
	 * utils.map([{name:'a',code:1},{name:'b',code:2}], function(i,item){ var ret = {}; if(item.code>1){ret[item.name]=item.code;} return ret; }) = {a:1}
	 */
	utils.map = function(array, callback){
		var ctx = {};
			ctx.map = function(){
				var ret = {};
				for(var i=0; i<arguments.length; i+=2){
					ret[arguments[i]] = arguments[i+1];
				}
				return ret;
			}
		var onResult = function(ret, attr, val){
			if( $.isPlainObject(val) ){
				for(var attr in val){
					ret[attr] = val[attr];
				}
			}
			else {
				ret[attr] = val;
			}
		}
		var ret = {};
		if( $.isArray(array) ){
			for(var i=0; i<array.length; i++){
				var val = callback.call(ctx, i, array[i]) || {};
				if( val !== null && val !== undefined ){
					onResult(ret, attr, val);
				}
			}
		}
		else if( $.isPlainObject(array) ) {
			var map = array;
			for(var attr in map){
				var val = callback.call(ctx, attr, map[attr]);
				if( val !== null && val !== undefined ){
					onResult(ret, attr, val);
				}
			}
		}
		else {
			return ctx.map.apply(this, arguments);
		}
		return ret;
	};

	utils.uuid = function(){
		return new Date().getTime() + ('000' + parseInt(Math.random() * 1000)).substr(-3) + ('000' + parseInt(Math.random() * 1000)).substr(-3);
	}

	utils.isLoginPage = function(responseText) {
		return (responseText && responseText.toString().indexOf('<!--this is login page(flag for ajax)-->') != -1);
	}
	utils.isErrorPage = function(responseText) {
		return (responseText && responseText.toString().indexOf('<!--this is exception page(flag for ajax)-->') != -1);
	}
	utils.isTipsPage = function(responseText) {
		return (responseText && responseText.toString().indexOf('<!--this is message page(flag for ajax)-->') != -1);
	}
	utils.isStandardResult = function(result) {
		return result
			&& typeof result.state		!= 'undefined'
			&& typeof result.message	!= 'undefined'
			&& typeof result.data		!= 'undefined'
			&& typeof result.success	!= 'undefined'
			&& typeof result.error		!= 'undefined'
			&& typeof result.warn		!= 'undefined';
	};

	utils.getTop = function(){
		var win = window;
		while( win != top ) {
			try {
				if( win.parent.CrossDomain ){ console.debug('[utils.getTop]'); }
			}
			catch(e){break;}
			win = win.parent;
		}
		return win;
	};
	utils.getOutWidth = function($this){
		var wd = parseFloat($this.css('padding-left'))
			+ parseFloat($this.css('padding-right')) 
			+ parseFloat($this.css('margin-left')) 
			+ parseFloat($this.css('margin-right'))
			+ parseFloat($this.css('border-left-width'))
			+ parseFloat($this.css('border-right-width'))
		;
		return Math.ceil(wd) || 0;
	};
	utils.getOuterWidth = function($this) {
		return $this.width() + utils.getOutWidth($this);
	};
	utils.getOutHeight = function($this){
		var hd = parseFloat($this.css('padding-top')) 
			+ parseFloat($this.css('padding-bottom')) 
			+ parseFloat($this.css('margin-top')) 
			+ parseFloat($this.css('margin-bottom'))
			+ parseFloat($this.css('border-top-width'))
			+ parseFloat($this.css('border-bottom-width'))
		;
		return Math.ceil(hd) || 0;
	};
	utils.getOuterHeight = function($this) {
		return $this.height() + utils.getOutHeight($this);
	};

	(function(exports){
		var uc = exports;
			uc.relating = function(chk,aChk,els) {
				var $chkAll = $(chk);
				var $chkItem = $(aChk);
				$chkAll.click(function(){this.blur();this.focus();});
				$chkAll.change(function(){
					var checked = $chkAll.attr('checked') || false;
					$chkItem.each(function(i,chk){
						var $chk = $(chk);
						if( $chk.is(':enabled') ){
							$chk.attr('checked', checked).trigger('change', 'chkAll');
						}
					});
				});
				$chkItem.each(function(i,chk){
					var $chk = $(chk);
						$chk.click(function(){this.blur();this.focus();});
						$chk.change(function(event, src){
							if( 'chkAll' != src ) {
								$chkAll.attr('checked', utils.checkbox.isAllChecked(aChk));
							}
						});
				});
				if(els){
					els = $.isArray(els) ? els : [els];
					$(chk).add($chkItem).each(function(i,chk){
						$(chk).click(function(){
							$.each(els,function(i,el){
								$(el).attr('disabled',!utils.checkbox.isAnyChecked(aChk));
							});
						});
					});
				}
			};
			uc.isChecked = function (chk){
				return $(chk).is(':enabled') && $(chk).is(':checked');
			};
			uc.isAnyChecked	= function(aChk){
				return $.grep($(aChk),utils.checkbox.isChecked).length;
			};
			uc.isAllChecked	= function(aChk){
				return $.grep($(aChk),utils.checkbox.isChecked).length == $(aChk).length;
			};
	})(utils.checkbox = {});


	(function(exports){
		var ui = exports;
			ui.onload = function(/*iframe, func*/) {
				var src = null;
				var ifrm = null;
				var callback = null;
				if(arguments.length == 1) {
					src = arguments[0].src;
					ifrm = arguments[0].iframe;
					callback = arguments[0].callback || arguments[0].func;
				}
				if(arguments.length == 2) {
					var iframe = arguments[0]
						,func = arguments[1];

					ifrm = $(iframe).get(0);
					callback = function(){
						func.call(ifrm);
					}
				}
				else if(arguments.length >= 3) {
					var iframe = arguments[0]
						,func = arguments[2]
						,src = arguments[1];

					ifrm = $(iframe).attr('src',src).get(0);
					callback = function(){
						func.call(ifrm);
					}
				}
				ifrm.addEventListener
					? ifrm.addEventListener('load', callback, false)
					: (ifrm.attachEvent ? ifrm.attachEvent('onload', callback) : ifrm.onload = callback);
			};
			ui.dialog = function(options){
				var self = this;
				var opts = {};
					opts.name = new Date().getTime();
					opts.width  = $('body').width()*.8;
					opts.height  = $('body').height()*.8;
					opts.autoOpen = true;
					opts.onload = $.noop;
					opts.title = options.title || '';
					opts.html = '<iframe frameborder="0" name="' + name + '"/>';
					opts = $.extend(opts, options);

				var $dialog = utils.dialog(opts, opts.html, opts.title, opts.name);
				var $c = $dialog.dialog('widget').find('div.ui-dialog-content');
				var $f = $dialog.dialog('widget').find('iframe');
				utils.block($c.css('overflow','hidden'));
				utils.iframe.onload($f, opts.url, function(){
					if(opts.onload.apply(self,arguments) !== false){
						utils.unblock($c);
					}
				});
				self.$dialog = $dialog;
				self.$body = $c;
				self.$ifrm = $f;
				if( options.isHideCloseButton === false ){
					$dialog.dialog('widget').find('.ui-dialog-titlebar-close').show();
				}
				return self;
			}
	})(utils.iframe = {});

	utils.block = function(el,opts) {
		var options = { 
			theme	: true, 
			title	: '请稍候...', 
			message	: '<p><img src="resource/imgs/loading.gif" /></p>',
			themedCSS : {
				width : 'auto'
			},
			overlayCSS : {
				backgroundColor : '#eeeeee'
			}
		};
		if($.browser.msie && /^6/.test($.browser.version)){
			options.themedCSS.width = 72;
		}
		if(opts){
			options = $.extend(options,opts);
		}
		(el?$(el):$('body')).block(options);
	}
	utils.unblock = function(el,opts) {
		(el?$(el):$('body')).unblock(opts);
	}
	utils.loadMask = function(dlgArgs, id) {
		var opts = {
			modal		: true,
			width		: 'auto',
			height		: 100,
			bgiframe	: true,
			autoOpen	: false,
			buttons		: null,
			closeOnEscape : false,
			dialogClass		: 'none-close'
		};
		var title = '请稍候...';
		var html = '<img src="resource/imgs/loading.gif"/>';
		var $dlg = utils.dialog(opts,html,title,id||'UTILS_EXT_DIALOG_LOADING');
		return $dlg.dialog.apply($dlg,arguments);
	}
	utils.dialog = function(opts,html,title,id) {
		id = (id==null?'UTILS_EXT_DIALOG_MESSAGE':id);
		var dlg = $('#'+id);
		if(!dlg.length){
			var options = {
				modal		: true,
				bgiframe	: true,
				autoOpen	: false,
				maxWidth	: $('body').width(),
				maxHeight	: $('body').height(),
				buttons		: {
					'确定': function() {dlg.dialog('close');}
				}
			};
			if($.isPlainObject(opts)){
				options = $.extend(options,opts);
			}
			dlg = $('<div id="'+id+'" class="dialog-default" style="display:none;" />');
			dlg.appendTo($('body'));
			dlg.dialog(options).dialog('widget').find('.ui-dialog-titlebar-close').hide();
		}
		else{
			if($.isArray(opts)){
				dlg.dialog.apply(dlg,opts);
			}
			else if($.isPlainObject(opts)){
				dlg.dialog.call(dlg,'option',opts);
			}
		}
		if(title != undefined){
			dlg.dialog('option','title',title);
		}
		if(html != undefined && html != null){
			dlg.html($(html));
		}
		if(typeof opts == 'string' || $.isPlainObject(opts)){
			return dlg.dialog.call(dlg,opts);
		}
		else{
			return dlg.dialog.call(dlg,'open');
		}
	}
	utils._stdPost = function(opts){

		if( !$.isFunction(opts.onTips) ) { opts.onTips = $.noop; }
		if( !$.isFunction(opts.onLogin) ) { opts.onLogin = $.noop; }
		if( !$.isFunction(opts.onFatal) ) { opts.onFatal = $.noop; }
		if( !$.isFunction(opts.onError) ) { opts.onError = $.noop; }
		if( !$.isFunction(opts.onBefore) ) { opts.onBefore = $.noop; }
		if( !$.isFunction(opts.onFailure) ) { opts.onFailure = $.noop; }
		if( !$.isFunction(opts.onSuccess) ) { opts.onSuccess = $.noop; }
		if( !$.isFunction(opts.onComplete) ) { opts.onComplete = $.noop; }

		var dlgArgs = (opts.onBefore() === false || opts.showMask === false || opts.dlgArgs == false) ? 'close' : (opts.dlgArgs || 'open');
		var $loading = utils.loadMask(dlgArgs, new Date().getTime() + Math.random());
			$loading.dialog( 'option', {dialogClass : 'stdLoading'} );
		var onLoaded = (function($loading){
			return function(){
				setTimeout(function(){$loading.dialog('close');$loading.dialog('destroy');$loading.remove()},1);
			};
		})($loading);

		var onResponse = function(responseText){
			if(responseText == null || $.trim(responseText.toString()).length==0){
				console.info( '[stdPost]none response text.' );
				//utils.alert('the operation was canceled.');
				return 'none';
			}
			else if(utils.isErrorPage(responseText)){
				if( opts.onError() !== false ) {
					utils.dialog({
						width : $('body').width()*.6,
						height : $('body').height()*.6,
						autoOpen : true
					},responseText,'出错啦...','UTILS_EXT_ERROR_MESSAGE');
				}
				return 'error';
			}
			else if(utils.isTipsPage(responseText)){
				if( opts.onTips() !== false ) {
					utils.dialog({
						//width : $('body').width()*.6,
						//height : $('body').height()*.6,
						autoOpen : true
					},responseText,'提示','UTILS_EXT_TIPS_MESSAGE');
				}
				return 'tips';
			}
			else if(utils.isLoginPage(responseText)){
				if( opts.onLogin() !==  false ) {
					window.top.location.href = g_var.logoutURL;
				}
				return 'login';
			}
			return false;
		};

		var ajaxOpts = {
			url			: opts.url,
			data		: opts.data,
			type		: 'post',
			//dataType	: 'json',
			jsonp		: null,
			jsonpCallback	: null
		};
		$.each(['contentType'], function(i, item){
			if( opts[item] !== undefined ) {
				ajaxOpts[item] = opts[item];
			}
		});
		ajaxOpts.error = function (XMLHttpRequest, textStatus, errorThrown) {
			if (XMLHttpRequest.readyState == 4){
				onLoaded();
				if(!onResponse(errorThrown)){
					var message = null;
					switch (XMLHttpRequest.status){
						case 0:
						case 400:
							message = "XmlHttpRequest status: [400] Bad Request";
							break;
						case 404:
							message = "XmlHttpRequest status: [404] \nThe requested URL "+ opts.url +" was not found on this server.";
							break;
						case 503:
							message = "XmlHttpRequest status: [503] Service Unavailable";
							break;
						default:
							message = textStatus == 'timeout'
								? 'ajax request timeout，please try again！' 
								: 'XmlHttpRequest unknow status: [' + XMLHttpRequest.status + '].errorThrown: [' + errorThrown + ']';
					}
					if( opts.onFatal(message, XMLHttpRequest, textStatus, errorThrown) !== false ) {
						utils.alert( message );
					}
				}
				opts.onComplete(XMLHttpRequest, textStatus, errorThrown);
			}
		};
		ajaxOpts.success = function(result){
			onLoaded();
			if( !onResponse(result) ){
				if(result.state == result.success){
					opts.onSuccess(result);
				}
				else if( opts.onFailure(result) !== false ) {
					utils.alert(result.message);
				}
			}
			opts.onComplete();
		};
		if( console ){
			console.debug('[stdPost]', ajaxOpts);
		}
		$loading.data('xhr',$.ajax(ajaxOpts));
	};
	utils.stdPost = function(url,data,cbSuccess,cbFailure,dlgArgs) {
		if( $.isPlainObject(arguments[0]) ) {
			return utils._stdPost( arguments[0] );
		}
		var isBoolean = function(o){ return typeof o == 'boolean' || o instanceof Boolean; }
		if( isBoolean(arguments[0]) ){
			return utils._stdPost({
				 url	: arguments[1]
				,data	: JSON.stringify(arguments[2])
				,onSuccess	: arguments[3]
				,onFailure	: arguments[4]
				,dlgArgs	: arguments[5]
				,contentType : 'application/json;charset=utf-8'
			});
		}
		return utils._stdPost({
			 url	: url
			,data	: data
			,onSuccess	: cbSuccess
			,onFailure	: cbFailure
			,dlgArgs	: dlgArgs
		});
	}
	utils.stdPost.cbBefore = function(){}
	utils.stdPost.cbFinish = function(){}
	utils.stdPost.cbQuiet = function(){return false;}

	
	utils.parseGet2Post = function(url, target, formId){

		console.info(url);

		var href = url.substr(0, url.indexOf('?'));
		var query = url.substr(href.length+1);

		var form = '<form name="' + formId + '" id="' + formId + '" target="' + target + '" action="' + href + '" method="post">';
		var queries = {};
		var parts = query.split('&');
		for(var i=0; i<parts.length; i++) {
			var part = parts[i].split('=');
			var key = decodeURIComponent(part[0]);
			var val = decodeURIComponent(part[1]);
			
			console.info(key + ' => ' + val);

			queries[key] = val;
			form += '<input type="hidden" name="' + key + '" value="' + val + '" />';
		}
		form += '</form>';

		return ({
			 href	: href
			,query	: query
			,queries: queries
			,form	: form
		});
	}
})(jQuery);



//==============================================
// beg.utils.date
//==============================================
(function($){
	utils.formatDate = function(date,format){
		var fill = function(num){
			return (['00','01','02','03','04','05','06','07','08','09','10','11','12'][num]||num);
		}
		var isJavaDateObject = function(date){
			return date != null && 
				typeof(date) == 'object' 
				&& date.date != undefined
				&& date.day != undefined
				&& date.hours != undefined
				&& date.minutes != undefined
				&& date.month != undefined
				//&& date.nanos != undefined
				&& date.seconds != undefined
				&& date.time != undefined
				&& date.timezoneOffset != undefined
				&& date.year != undefined;
		}
		if( date == undefined ) {
			return date;
		}
		else if( date instanceof Date ){
			return format
				.replace(/yyyy/g, date.getFullYear())
				.replace(/MM/g, fill(date.getMonth()+1))
				.replace(/dd/g, fill(date.getDate()))
				.replace(/HH/, fill(date.getHours()))
				.replace(/mm/, fill(date.getMinutes()))
				.replace(/ss/, fill(date.getSeconds()))
				.replace(/SSS/, fill(date.getMilliseconds()))
			;
		}
		else if( isJavaDateObject(date) ){
			return utils.formatDate(new Date(date.time), format);
		}
		else{
			throw 'arguments[0] must be a date object.';
		}
	};
	utils.parseDate = function(str,format){
		str = str.toString();
		var date = new Date(0);
		var get = function(part){
			var idx = format.indexOf(part);
			return (idx == -1) ? null : parseInt(str.substr(idx, part.length).replace(/^0/,''));
		}
		var mapp = {
			 'yyyy'	: 'setFullYear'
			//,'yy'	: 'setYear'
			,'MM'	: 'setMonth'
			//,'M'	: 'setMonth'
			,'dd'	: 'setDate'
			,'HH'	: 'setHours'
			,'hh'	: 'setHours'
			,'mm'	: 'setMinutes'
			,'ss'	: 'setSeconds'
		};
		for(var attr in mapp){
			var n = get(attr);
			var f = mapp[attr];
			if( n != null ){
				if( attr == 'MM' ){
					n--;
				}
				date[f](n);
			}
		};
		return date;
	};
	utils.date = function(_date, _format) {
		var date = _format ? utils.parseDate(_date, _format) : (_date || new Date());
			date.add = function(_field, num){
				var field = _field.substr(0,1).toUpperCase() + _field.substr(1).toLowerCase();
				if( !this['get' + field] ) {
					throw '[utils.date.add]unexpect field:' + _field;
				}
				var date = this.clone();
					date['set'+field]( date['get'+field]() + num );
				return date;
			}
			date.set = function(_field, num) {
				var field = _field.substr(0,1).toUpperCase() + _field.substr(1).toLowerCase();
				if( !this['get' + field] ) {
					throw '[utils.date.set]unexpect field:' + _field;
				}
				var date = this.clone();
					date['set'+field]( num );
				return date;
			}
			date.trans = function(org, dst) {
				return utils.date( utils.parseDate( utils.formatDate(this, org), dst ) );
			}
			date.format = function(format) {
				return utils.formatDate(this, format);
			}
			date.isToday = function(){
				return this.getDate() == new Date().getDate();
			}
			date.clone = function(){
				return utils.date(new Date(this.getTime()));
			}
		return date;
	}
})(jQuery);
//==============================================
// beg.utils.date
//==============================================




//==============================================
// beg.utils.formatNumber
//==============================================
(function($){
	utils.isNumber = function(str, isPure) {
		return isPure ? parseFloat(str) == str : !isNaN(parseInt(str));
	}
	//utils.formatNumber('12345.6789', '#,##0.00') = 12,345.68
	utils.formatNumber = function(str, format) {
		var na = (str == undefined ? '' : str).toString().split(/\./);
		var fa = format.split(/\./);
		var sp = format.indexOf(',') > 0;
		var sd = format.indexOf('.') != -1;
		var ph = '`';
		var ra = [];
		var _rep = function(str, num) {
			return new Array(num+1).join(str);
		}
		var ms = Math.max(na[0].length, fa[0].length);
		na[0] = _rep(ph, ms - na[0].length) + na[0];
		fa[0] = _rep(ph, ms - fa[0].length) + fa[0];
		for(var i=0; i<ms; i++) {
			var n = na[0].charAt(i);
			var f = fa[0].charAt(i);
			if( sp && ra.length && (ms-i)%3 == 0 ) {
				ra.push(',');
			}
			if( n != ph ) {
				ra.push(n);
			}
			else if( f == '0' ) {
				ra.push(0);
			}
		}
		if( sd ) {
			var _toFixed = function(num, fractionDigits){
				if( fractionDigits <= 0 ){
					return parseInt(num).toString();
				}
				else if( num == 0 ){
					return '0.' + new Array(fractionDigits+1).join('0');
				}
				else {
					var ret = parseInt(num * Math.pow(10, fractionDigits+1) + 5)/Math.pow(10, fractionDigits+1);
						ret = ret + '.' + new Array(fractionDigits+1).join('0');
						ret = ret.substr(0, ret.indexOf('.') + fractionDigits + 1);
					return ret;
				}
			}
			ra.push('.');
			//na[1] = _toFixed(parseFloat('0.' + na[1]), parseInt('1' + fa[1]).toString().length-1).substr(2);
			na[1] = parseFloat(_toFixed(parseFloat('0.' + na[1]), fa[1].length)).toString().substr(2);

			var ms = Math.max(na[1].length, fa[1].length);
			na[1] = na[1] + _rep(ph, ms - na[1].length);
			fa[1] = fa[1] + _rep(ph, ms - fa[1].length);
			for(var i=0; i<ms; i++) {
				var n = na[1].charAt(i);
				var f = fa[1].charAt(i);
				if( n != ph && f != ph && (f == '#' || (f>=0 && f<=9)) ) {
					ra.push(n);
				}
				else if( f != ph && f != '#' ) {
					ra.push(f);
				}
			}
		}

		return ra.join('').replace(/-,/g, '-').replace(/\.$/, '').replace(/\.%$/, '%');
	}
})($);
//==============================================
// end.utils.formatNumber
//==============================================


//==============================================
// beg.utils.validate
//==============================================
(function(exports){
	var validate = {};
		validate.isBlank = function(val) {
			return val == null || /^\s*$/.test(val);
		}
		validate.isChinese = function(val) {
			 return  /^[^u4e00-u9fa5]+$/.test(val);	
		}
		validate.isEmail = function(val) {
			 return /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/.test(val);
		}
		validate.is26Letters = function(val) {
			return /^[a-zA-Z]+$/.test(val) ;
		}
		validate.isInteger = function(val) {
			return val == '0' || /^[1-9][0-9]*$/.test(val) ;
		}
		validate.isNumeric = function(val) {
			return /^\d+\.\d+$/.test(val) || validate.isInteger(val);
		}
		validate.isString = function(val) {
		   return /^\w+$/.test(val) ;
		}
		validate.isPhone = function(val) {
			return /^((\d{3}-)?(\d){11,12},)*(\d{3}-)?(\d){11,12}$/.test(val) ;
		}
		validate.isMobile = function(val) {
			return /^1\d{10}$/.test(val);
		}
		validate.isURL = function(val) {
			return /^(http(s)?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w- .\/\?\%\&\=]*)?/.test(val);
			//return /^[a-zA-z]+:\/\/(\w+[\.:?\/?])*(\.(\w+(-\w+)*\/{0,1}))*(\?\S*)?$/.test(val) ;
		}
		validate.isIP = function(val) {
			return /^[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}$/.test(val) ;
		}
	exports.validate = validate;
})(utils);
//==============================================
// end.utils.validate
//==============================================



//==============================================
// beg.utils.pagination，need jQuery,jQuery.cookie
//==============================================
(function($){
	window.utils = window.utils || {};
	//url:null or (parameter name in document.location.href.[iStart,pSize]) or jQuery
	utils.pagination = function(url,PSize,PStart,PTotal,IStart,ITotal)
	{
		var resPath = g_var.resPath || ($('link:eq(0)').attr('href')||'${_skin_}').replace(/(.+)\/(css|js)\/.+/,'$1');
		var icon = {
			first	: resPath + '/icon/page/first.gif',
			dFirst	: resPath + '/icon/page/first_disabled.gif',
			prev	: resPath + '/icon/page/prev.gif',
			dPrev	: resPath + '/icon/page/prev_disabled.gif',
			next	: resPath + '/icon/page/next.gif',
			dNext	: resPath + '/icon/page/next_disabled.gif',
			last	: resPath + '/icon/page/last.gif',
			dLast	: resPath + '/icon/page/last_disabled.gif'
		};
		var html = '<span class="pagination">' +
						'<span class="op1"><img class="btnFirst" title="首页"/><img class="btnPrev" title="上一页"/><img class="btnNext" title="下一页"/>&nbsp;<img class="btnLast" title="尾页"/></span>' +
						'<span class="op2">&nbsp;显示第<select class="selPStart"></select>页，每页<select class="selPSize"></select>条记录，共<span style="color:#FF9900;" class="txtITotal"></span>条记录</span>' +
					'</span>';
		if( $.isPlainObject(arguments[1]) ){
			var pagination = arguments[1];
			var getVal = function(defVal, key1, key2){
				for(var i=1; i<arguments.length; i++){
					var key = arguments[i];
					var val = pagination[key];
					if( val != undefined ){
						return val;
					}
				}
				return defVal;
			}
			PSize = getVal(PSize, 'PSize', 'psize', 'pSize');
			PTotal = getVal(PTotal, 'PTotal', 'ptotal', 'pTotal');
			PStart = getVal(PStart, 'PStart', 'pstart', 'pStart');
			IStart = getVal(IStart, 'IStart', 'istart', 'iStart');
			ITotal = getVal(ITotal, 'ITotal', 'itotal', 'iTotal');
		}
		PStart = PStart || 1;

		var el = $(html);
		var btnFirst = el.find('.btnFirst');
		var btnPrev = el.find('.btnPrev');
		var btnNext = el.find('.btnNext');
		var btnLast = el.find('.btnLast');
		var txtITotal = el.find('.txtITotal').text(ITotal);
		var selPStart = el.find('.selPStart');
		var selPSize = el.find('.selPSize');
		html = '';
		if( PTotal <= 100 ) {
			for(var i=1; i<=(PTotal||1); i++){
				html += '<option value="$i" $selected>$i</option>'.replace(/\$i/g,i).replace(/\$selected/g,PStart==i ? 'selected="true"' : '');
				//selPStart.append($('<option />').val(i).text(i).attr('selected',PStart==i));//with ie,too slow when PTotal large than 5000
			}
		}
		else {
			for(var i=1; i<=Math.min(10, (PTotal||1)); i++){
				html += '<option value="$i" $selected>$i</option>'.replace(/\$i/g,i).replace(/\$selected/g,PStart==i ? 'selected="true"' : '');
				//selPStart.append($('<option />').val(i).text(i).attr('selected',PStart==i));//with ie,too slow when PTotal large than 5000
			}
			if( PTotal > 10 ) {
				for(var i=5; i>-5; i--) {
					var idx = PStart - i;
					if( idx > 10 && idx <= PTotal ) {
						html += '<option value="$i" $selected>$i</option>'.replace(/\$i/g,idx).replace(/\$selected/g,PStart==idx ? 'selected="true"' : '');
					}
				}
				if( PStart + 5 < PTotal ) {
					html += '<option value="$i" $selected>$i</option>'.replace(/\$i/g,PTotal).replace(/\$selected/g,PStart==PTotal ? 'selected="true"' : '');
				}
			}
		}
		selPStart.html(html);

		html = '';
		$.each([10,20,50,100],function(n,i){
			html += '<option value="$value" $selected>$text</option>'
				.replace('$text', i)
				.replace('$value', i)
				.replace('$selected', PSize==i ? 'selected="true"' : '')
			;
		});
		selPSize.append( html );

		var jump = function(){
			var pSize = PSize;
			var pStart = PStart;
			el.attr('disabled',true);
			$.cookie && $.cookie('pageSize',pSize,{path: '/', expires: 365});
			
			if( $.isFunction(url) ){
				url.call(this,pStart,pSize);
			}
			else if( url == null || $.isArray(url)){
				var res = new RegExp(($.isArray(url) ? url[0] : 'pageNum') + '\s*=\s*[^&]*');
				var rep = new RegExp(($.isArray(url) ? url[1] : 'pageSize') + '\s*=\s*[^&]*');
				url = document.location.href;
				url = url.match(res) ? url.replace(res,'pageNum=$pStart') : url + (url.indexOf('?')==-1 ? '?' : '&') + 'pageNum=$pStart';
				url = url.match(rep) ? url.replace(rep,'pageSize=$pSize') : url + (url.indexOf('?')==-1 ? '?' : '&') + 'pageSize=$pSize';
				document.location.href = url.replace(/\$pStart/,pStart).replace(/\$pSize/,pSize);
			}
			else if( $(url).length && $(url).attr('tagName').toLowerCase() == 'form' ){
				var $frm = $(url);
				var $pStart = $frm.find('*[name=pageNum]');
				var $pSize = $frm.find('*[name=pageSize]');
				var $pStart = $pStart.length ? $pStart : $('<input type="hidden" name="pageNum" />').appendTo($frm);
				var $pSize = $pSize.length ? $pSize : $('<input type="hidden" name="pageSize" />').appendTo($frm);
				$pStart.val(pStart);
				$pSize.val(pSize);
				$frm.submit();
			}
			else{
				throw 'wrong parameter in utils.pagination';
			}
		}
		selPStart.change(function(){
			PStart = $(this).val();
			jump();
		});
		selPSize.change(function(){
			PSize = $(this).val();
			PStart = 1;
			jump();
		});
		if(PStart<=1)
		{
			btnFirst.attr('src', icon.dFirst);
			btnPrev.attr('src', icon.dPrev);
		}
		else
		{
			btnFirst.attr('src', icon.first).css('cursor','pointer').click(function(){
				PStart = 1;
				jump();
			});
			btnPrev.attr('src', icon.prev).css('cursor','pointer').click(function(){
				PStart--;
				jump();
			});
		}
		if(PTotal<=1 || PStart>=PTotal)
		{
			btnNext.attr('src', icon.dNext);
			btnLast.attr('src', icon.dLast);
		}
		else
		{
			btnNext.attr('src', icon.next).css('cursor','pointer').click(function(){
				PStart++;
				jump();
			});
			btnLast.attr('src', icon.last).css('cursor','pointer').click(function(){
				PStart = PTotal;
				jump();
			});
		}
		return el;
	};
	utils.pagination.reload = function(el)
	{
		$(el).find('select.selPStart').change();
	}
})(jQuery);
//==============================================
// end.utils.pagination
//==============================================



//==============================================
// beg.utils.page && utils.section
//==============================================
(function(exports){
	if( !exports.console ) {
		exports.console = {};
		exports.console.info = exports.console.debug = exports.console.error = function(){};
	}
	var console = exports.console;

	var utils = exports.utils || (exports.utils = {});
	utils.page = {};
	utils.page.create = function(name, object) {
		var initCall = function(init, caller) {
			for(var attr in init){
				var fn = init[attr];
				if( typeof(fn) == 'function' ) {
					console.info('[utils.section:' + (name||'-') + ']call init.' + attr);
					fn.call(caller);
				}
			}
			caller.isInited = true;
		}
		var page = object || {};
			page.init = function(){
				if( !this.isInited ) {
					initCall(this.init, this);
				}
			}
			page.extInit = function(fn){
				var self = this;
				if( typeof(fn) == 'function' ) {
					var init = self.init;
					self.init = function(){
						if( fn.apply(self, arguments) !== false ) {
							initCall(init, self);
							self.init = init;
						}
					}
				}
			}
			page._boolean = function(str) {
				return !/^\s*$|0|false|null|undefined/ig.test(str);
			}
			page._name = function(name, $parent) {
				return $('[name="' + name + '"]', $parent || this.$wrap);
			}
			page._bind = function($el, event, callback) {
				return $el.unbind(event, callback).bind(event, callback);
			}
			page._delegate = function(selector, type, callback, el){
				return $(el || page.$wrap).undelegate(selector, type).delegate(selector, type, callback);
			}
			page._on = function(type, selector, callback){
				return page.$wrap.off.apply(page.$wrap, arguments).on.apply(page.$wrap, arguments);
			}
			page._exports = function(exportsObjects){
				for( var attr in exportsObjects) {
					if( page[attr] == undefined ) {
						(function(){
							var value = exportsObjects[attr];
							if( $.isFunction(value) ) {
								page[attr] = function(){
									return value.apply(page, arguments);
								}
							}
							else {
								page[attr] = value;
							}
							console.info('[utils.section:' + (name||'-') + ']export:' + attr);
						})();
					}//fi
				}//end of for
			}
			page._initEvent = function(){
				var self = this;
				self.$wrap.on('click', '[name]', function(event){
					if( self.event ) {
						var $this = $(event.currentTarget);
						if( $this.is(':visible') && $this.not('[disabled]').length && !$this.hasClass('disabled') ){
							var name = $this.attr('name');
							if( $.isFunction(self.event[name]) ){
								self.event[name].apply($this, arguments);
							}
						}
					}
				});
			}
			page.$wrap = $(document);
			page.$wrap.data('oWidget', page);
		return page;
	}
	utils.section = {};
	utils.section.getElement = function(name, $parent){
		var sel = '[name="section-' + name + '-wrap"]';
		var $el = $(sel, $parent);
		if( !$el.length ) {
			throw "can't get section:" + sel;
		}
		return $el;
	}
	utils.section.getWidget = function(name, $parent){
		var oWidget = utils.section.getElement(name, $parent).data('oWidget');
		if( !oWidget ) {
			throw "can't get section.widget:" + name;
		}
		return oWidget;
	}
	utils.section.create = function(name, object) {
		var section = utils.page.create(name, object);
		if( !section.init._id ) {
			var id = section.init._id = new Date().getTime() + parseInt((Math.random()+0.1)*1000);
			var $script = $('script[name="section-' + name + '-script"]')
				.not('[section-id]')
				.first()
				.attr('section-id', id);

			var wrap = '[name="section-' + name + '-wrap"]';
			
			var $wrap = $script.closest(wrap);
			
			if( !$wrap.length ) {
				$wrap = $script.prev(wrap);
			}
			if( !$wrap.length ) {
				$wrap = $(wrap);
			}
			$wrap.each(function(){
				var $this = $(this);
				if( !$this.data('oWidget') ) {
					$this.data('oWidget', section);
					section.$wrap = $this;
					return false;
				}
			});
			if( !section.$wrap.length ) {
				throw '[utils.section]can not find wrap:' + wrap;
			}
		}
		return section;
	}
})(window);
//==============================================
// end.utils.page && utils.section
//==============================================

