
//==============================================
//		beg.bmstable
//==============================================
(function(exports, name){
	"use strict";
	function bmstable(opts) {
		var self = {};

			self.params = {};
			self.params.wrap = 'body';
			self.params.showFooter = true;
			self.params.showPagination = true;
			self.params.showCheckbox = 'checkbox';
			self.params.showOverlay = true;
			self.params.showHeader = true;
			self.params.autoHeight = true;
			self.params.autoWidth = true;
			self.params.resizable = false;
			self.params.movable = false;
			self.params.column = [/*{name : 'name', label:'名称', width: 80}*/];
			self.params.button = [/*{name : '', label : '', img : '', disabled : false, cls : 'textRight'}*/];
			self.params.idName = 'id';
			self.params.loadWhenInit = true;
			self.params.loadingImage = 'resource/icon/spinner.gif';
			self.params.url = function(){/*return 'task/task!ajaxFindTaskList.action';*/}
			self.params.params = function(pageNum, pageSize){return {pageSize : $.cookie('pageSize') || ''};}
			self.params.fnNoneData = function(result){
				return '<tr><td><div class="cell" style="text-align:center;">暂无数据.</div></td></tr>';
			}
			self.params.fnFailure = function(result){
				var $wrap = $(self.params.wrap);
					$wrap.delegate('[name="bmstable-btnRetry"]', 'click', function(event){
						$wrap.undelegate('[name="bmstable-btnRetry"]', 'click');
						if( !self.params.showOverlay ) {
							var $this = $(event.currentTarget);
								$this = $this.parent();
								$this.html('<img src="' + self.params.loadingImage + '" class="loading"/>');
						}
						self.util.reload();
					});
				var message = result.message || '';
				var istr = 'Exception:';
				var idx = message.indexOf(istr);
				if( idx != -1 ) {
					message = message.substr(idx + istr.length);
				}
				var ret = '<tr><td><div class="cell" style="text-align:center;">';
					ret += '<label class="error">获取数据时出错，<a href="javascript:void(0);" name="bmstable-btnRetry">点此</a>重试</label><div>' + message + '</div>';
					ret += '</div></td></tr>';
				return ret;
			};
			self.params.uuid = new Date().getTime() + parseInt(Math.random() * 1000);

			self.params.on = {};
			self.params.on.result = function(result){};//结果集拦截
			self.params.on.transform = function(row, data){};//行拦截
			self.params.on.pagination = function(pageNum, pageSize){
				var params = $.extend({
					 pageSize	: pageSize
					,pageNum	: pageNum
				}, self.util.getRequestParams(pageNum, pageSize));
				self.util.request( self.util.getRequestURL(), params );
			};
			self.params.on.checkAll = function(){}
			self.params.on.afterLoad = function(){}


			self.data = {};
			self.data.widget = {};
			self.data.result = [];
			self.data.cache = {};


			self.util = {};
			self.util.request = function(url, params){
				var $wrap = $(self.params.wrap);
				var succ = function(_result) {
					var result = self.params.on.result.call(self, _result) || _result;
						result.items = utils.isStandardResult(result) ? result.data.items || result.data : result;
					var $body = $(self.util.build(result));
						$body.appendTo($wrap.empty());
					self.util.bedeckFooter($body, result);
					self.util.bedeck();
					self.params.on.afterLoad.call( self, self.data.widget );
				};
				var fail = function(result) {
					var _fnNoneData = self.params.fnNoneData
					self.params.fnNoneData = self.params.fnFailure;
					
					result.data = {columns:[],pagination:{items:[]}};
					succ(result);

					self.params.fnNoneData = _fnNoneData;
					return false;
				};
				if( self.params.result ) {
					succ( self.params.result );
				}
				else {
					if( !self.params.showOverlay ) {
						var $body = $('.contentWrap', $wrap);
						if( !$body.length ){
							$body = $wrap;
						}
						$body.html('<table class="w100P h100P"><tbody><tr><td class="textCenter"><img src="' + self.params.loadingImage + '" class="loading"/></td></tr></tbody></table>');
					}
					if( !params.pageSize && $.cookie('pageSize') ) {
						params.pageSize = $.cookie('pageSize');
					}
					utils.stdPost(url, params, succ, fail, self.params.showOverlay ? 'open' : 'close');
				}
			}
			self.util.build = function(result){
				var items = result.items;
				var cls = ['bmstable', (result.items.length ? '' : 'bmstable-none-data') ];
				return [
					 '<div class="' + cls.join(' ') + '">'
					,'<div class="headerWrap">' + self.util.buildHeader(result) + '</div>'
					,'<div class="contentWrap">' + self.util.buildContent(result) + '</div>'
					,'<div class="footerWrap">' + self.util.buildFooter(result) + '</div>'
					,'</div>'
				].join('');
			}
			self.util.buildHeader = function(result){
				var cb = self.params.column.length ? self.util.buildCheckbox() : '';
				var html = '<table class="header"><thead><tr>' + cb;
				$.each(self.params.column, function(i, item){
					html += '<th ' + self.util.getColumnAttribute(item) + ' data-name="' + item.name + '">';
					html +=		'<div ' + self.util.getColumnAttribute(item) + '>';
					html +=			'<table class="hotspot">';
					html +=				'<tr>';
					html +=					'<td class="move"><div class="mover">&nbsp;</div></td>';
					html +=					'<td>' + item.label + '</td>';
					html +=					'<td class="spot"><div class="resizer"></div></td>';
					html +=				'</tr>';
					html +=			'</table>';
					html +=		'</div>';
					html += '</th>';
				});
				html += '<th class="fixScroll" style="display:none;"><div>&nbsp;</div></th></tr></thead></table>';
				return html;
			}
			self.util.buildContent = function(result){
				
				self.data.cache = {};
				
				var items = result.items;
				var cls = ['content', items.length ? '' : 'none'];
				var html = '<table class="' + cls.join(' ') + '"><tbody>';
				if( !items.length ) {
					html += self.params.fnNoneData(result);
				}
				else {
					$.each(items, function(i, item) {
						if( self.params.on.transform.call(self, item, items, i) !== false ){

							var key = self.util.getRandom();
							self.data.cache[key] = item;
							
							if( item[self.params.idName] ) {
								self.data.cache[item[self.params.idName]] = item;
							}
							
							html += '<tr class="row ' + ['odd', 'even'][i%2] + '" data-bmstable-key="' + key + '">' + self.util.buildCheckbox(item);
							$.each(self.params.column, function(i, column){
								html += 
									'<td ' + self.util.getColumnAttribute(column) + ' data-name="' + column.name + '">' +
										'<div ' + self.util.getColumnAttribute(column) + '>' + (item[column.name] || '') + '</div>' +
									'</td>'
								;
							});
							html += '</tr>';
						}
					});
				}
				html += '</tbody></table>';
				return html;
			}
			self.util.buildFooter = function(result){
				return '<table class="footer"><tbody><tr><td><div class="lWrap"></div><div class="rWrap"></div></td></tr></tbody></table>';
			}
			self.util.buildCheckbox = function(data){
				var type = '';
				if( self.params.showCheckbox == 'checkbox' ) {
					type = 'checkbox';
				}
				else if( self.params.showCheckbox == 'radio' ) {
					type = "radio";
				}
				if( type ) {
					if( data ) {
						var addition = [];
						if( data['checkbox-disabled'] === true ) {
							addition.push('disabled="true"');
						}
						if( data['checkbox-checked'] === true ) {
							addition.push('checked="checked"');
						}
						return [
							 '<td class="selectBox" style="display:none;">'
							,	'<input type="' + type + '" name="' + self.params.idName + '" value="' + data[self.params.idName] + '" ' + addition.join(' ') + ' />'
							,'</td>'
						].join('');
					}
					else {
						return type == 'checkbox' 
							? '<th class="selectBox" style="display:none;"><input type="' + type + '" name="' + self.params.idName + '" /></th>'
							: '<th class="selectBox" style="display:none;"></th>'
						;
					}
				}
				return '';
			}
			self.util.getColumnAttribute = function(column){
				var w = self.util.getWidthParam(column);
				var s = 'style="$style"'.replace('$style', [!w ? '' : 'width:'+w, column.style||''].join(';'));
				var c = 'class="$class"'.replace('$class', ['cell', column.cls, (w ? 'cell-w' : '')].join(' '));
				var a = 'data-name="$colName"'.replace('$colName', column.name || '');
				return [s,c,a].join(' ');
			}
			self.util.getWidthParam = function(column){
				if( column.width ) {
					return self.util.isNumber(column.width) ? (column.width + 'px') : column.width;
				}
				return '';
			}
			self.util.getRequestURL = function(){
				return $.isFunction(self.params.url) ? self.params.url.call(self) : self.params.url;
			}
			self.util.getRequestParams = function(pStart, pSize){
				return $.isFunction(self.params.params) ? self.params.params.call(self, pStart, pSize) : self.params.params;
			}
			self.util.isNumber = function(str) {
				return parseFloat(str) == str;
			}
			self.util.isDisabled = function($el) {
				return $el.attr('disabled');
			}
			self.util.getRandom = function(){
				return [new Date().getTime(),parseInt(Math.random() * 100), parseInt(Math.random() * 100), parseInt(Math.random() * 100)].join('');
			}
			self.util.bedeckFooter = function($body, result){

				var $wrap = $(self.params.wrap);
				var $foot = $('.footer', $wrap);

				if( !self.params.showFooter || (!self.params.showPagination && !self.params.button.length) ) {
					$foot.parent().hide();
				}

				//添加分页
				if( self.params.showPagination ) {
					$('.rWrap', $body).append( utils.pagination(self.params.on.pagination, result.data) );
				}
				//添加按钮
				if( self.params.button.length ) {
					var html = '';
					var fnClick = {};
					$.each( self.params.button, function(i, item){
						fnClick[item.name] = item.click || self.params.on[item.name] || $.noop;
						html += '<a href="javascript:void(0)" class="bmstable-btn" name="' + item.name + '" ' + (item.disabled ? 'disabled="true"' : '') + '>' + (item.img ? '<img src="' + item.img + '" />' : '') + item.label + '</a>';
					});
					$('.lWrap', $body).append( html ).delegate('a.bmstable-btn', 'click', function(event){
						var $target = $(event.currentTarget);
						var name = $target.attr('name');
						if( !self.util.isDisabled($target) && fnClick[name] ) {
							fnClick[name].call( $target, self.data.widget );
						}
					});
				}
				return $body;
			}
			self.util.bedeck = function(){
				var $wrap = $(self.params.wrap);
				var $bmst = $('.bmstable', $wrap);
				var $head = $('.header', $wrap);
				var $body = $('.content', $wrap);
				var $foot = $('.footer', $wrap);
				var $bodyWrap = $body.parent();
				var $headWrap = $head.parent();
				var $fixScroll = $('.fixScroll', $head);

				if( !self.params.showHeader ){
					$headWrap.hide();
				}

				if( self.params.autoHeight ) {
					var resizeEventName = 'resize.bmstable-' + self.params.uuid;
					$(window).unbind(resizeEventName).bind(resizeEventName, function(){
						window.setTimeout(function(){
							var b = $head.is(':visible') ? utils.getOutHeight($bmst) : 0;
							var h = $head.is(':visible') ? utils.getOuterHeight($head) : 0;
							var f = $foot.is(':visible') ? utils.getOuterHeight($foot) : 0;
							$bodyWrap.height( $wrap.height() - h - f - b );
							//$head.width($body.width());
							$fixScroll[$bodyWrap.height() < $body.height() ? 'show' : 'hide']();
						}, 500);
					}).trigger(resizeEventName);
				}
				if( self.params.autoWidth ){
					var aw = 0;
					var mw = $body.width() - $('.selectBox', $head).width() - 12;
					var nw = {};
					var $row = $('.row', $body).first();
					var $cell = $('div.cell', $row);
						$cell.each(function(){
							var $this = $(this);
							var w = $this.outerWidth();
							var n = $this.attr('data-name');
							nw[n] = w;
							aw += w;
						});
					if( mw > aw ){
						var a = 0;
						for(var n in nw){
							var w = nw[n];
								w = Math.floor(w + (mw - aw) * w/aw);
							self.util.resizeColumn(n, w);
							a += w;
						}
					}
				}

				var scrollEventName = 'scroll.bmstable-' + self.params.uuid;
				$bodyWrap.unbind(scrollEventName).bind(scrollEventName, function(){
					$headWrap.css('margin-left', -$bodyWrap.scrollLeft());
				});

				//resize
				(function($headWrap){
					if( !self.params.resizable ){
						$('.spot', $headWrap).hide();
						return false;
					}
					$('.resizer', $headWrap).hover(
						 function(){ $(this).addClass('drag'); }
						,function(){ $(this).removeClass('drag'); }
					);
					var opts = {};
						opts.axis = 'x';
						opts.start = function(event, ui) {
							var $this = $(this);
								$this.data('position', ui.position);
						};
						opts.stop = function(event, ui){
							var $this = $(this);
							var $cell = $this.closest('th.cell');
							var name = $cell.attr('data-name');
							var position = $this.data('position');
							var width = $cell.width() + ui.position.left - position.left;
							self.util.resizeColumn( name, width );
							$this.css('left', 'auto');
						};
					$('.resizer', $headWrap).draggable(opts);
				})($headWrap);

				//drag/drop
				(function($headWrap){
					if( !self.params.movable ){
						$('.move', $headWrap).hide();
						return false;
					}
					var $lwrap = $('<div class="alwrap"><img src="resource/icon/al.gif" /></div>');
					var $rwrap = $('<div class="arwrap"><img src="resource/icon/ar.gif" /></div>');
					$('.mover', $headWrap).draggable({
						axis	: 'x',
						revert	: 'invalid'
					});
					$('th.cell', $headWrap).droppable({
						accept		: '.mover',
						activeClass	: 'active',
						hoverClass	: 'hover',
						drop		: function(event, ui){
							var $this = $(this);
								$this.removeClass('moving'); 
							var $drag = $(ui.draggable);
								$drag.css('left', 'auto');
							var $cell = $drag.closest('th.cell');
							var $cells = $this.parent().children();
							var ithis = $cells.index($this);
							var icell = $cells.index($cell);
							if( ithis != icell ){
								self.util.move2Column($this.attr('data-name'), $cell.attr('data-name'), ithis - icell);
							}
							$lwrap.remove();
							$rwrap.remove();
						},
						out			: function(event, ui){ $(this).removeClass('moving'); },
						over		: function(event, ui){
							var $this = $(this);
								$this.addClass('moving');
							var $drag = $(ui.draggable);
							var $cell = $drag.closest('th.cell');
							var $cells = $this.parent().children();
							var ithis = $cells.index($this);
							var icell = $cells.index($cell);
							if( ithis < icell ){
								$rwrap.remove();
								$lwrap.appendTo($this);
							}
							else if( ithis > icell ){
								$lwrap.remove();
								$rwrap.appendTo($this).css('left', $this.offset().left + $this.width() - $rwrap.width());
							}
						},
						create		: function(event, ui){ },
						activate	: function(event, ui){ },
						deactivate	: function(event, ui){ }
					});
				})($headWrap);

				$('.row', $body).hover(
					function(){$(this).addClass('hover');}, 
					function(){$(this).removeClass('hover');}
				);

				$('.selectBox', $wrap)[ self.params.showCheckbox == 'checkbox' || self.params.showCheckbox == 'radio' ? 'show' : 'hide' ]();
				utils.checkbox.relating($('.selectBox input', $head), $('.selectBox input', $body));

				$('.selectBox input', $body).change(function(){
					self.params.on.checkAll.call( this, self.data.widget );
				});

				$wrap.parent().css({overflow:'hidden'});
			}
			self.util.reload = function(){
				self.util.request( self.util.getRequestURL(), self.util.getRequestParams() );
			};
			self.util.getWidget = function(){
				var oSelf = {};
					oSelf.$wrap	 = $(self.params.wrap);
					oSelf.params = self.params;
					oSelf.bmstable = self;

				$.each( self.params.button, function(i, item){
					oSelf['$' + item.name] = $('[name="' + item.name + '"]', $('.lWrap', oSelf.$wrap));
				});
				oSelf.getObjectFromInnerElement = function(el) {
					return self.data.cache[ $(el).closest('[data-bmstable-key]').attr('data-bmstable-key') ];
				}
				oSelf.getObject = function(key){
					return self.data.cache[key];
				}
				oSelf.getCheckedObject = function(){
					var rets = {
						ids		: [],
						objects	: []
					};
					$('.selectBox input', $('.content', oSelf.$wrap)).filter(':checked').filter(':enabled').each(function(){
						var $this = $(this);
						var $data = $this.closest('[data-bmstable-key]');
						var name = $data.attr('data-bmstable-key');
						var data = self.data.cache[name];
						rets.ids.push( data[self.params.idName] );
						rets.objects.push( data );
					});
					return rets;
				}
				oSelf.setCheckStatus = function(ids, isEnabled){
					if( !$.isArray(ids) ){
						ids = [ids];
					}
					$('.selectBox input', $('.content', oSelf.$wrap)).each(function(){
						var $this = $(this);
						var value = $this.attr('value');
						if( $.inArray(value, ids) != -1 ){
							if( !isEnabled ) {
								$this.attr('disabled', true);
							}
							else {
								$this.removeAttr('disabled');
							}
						}
					});
				}
				oSelf.reload = function(){ self.util.reload(); }
				oSelf.getHead = function(){ return $('.header', oSelf.$wrap); }
				oSelf.getBody = function(){ return $('.content', oSelf.$wrap); }
				oSelf.getFoot = function(){ return $('.footer', oSelf.$wrap); }
				return oSelf;
			};
			self.util.resizeColumn = function(name, width){
				var $wrap = $(self.params.wrap);
				var $head = $('.header', $wrap);
				var $body = $('.content', $wrap);
				$('th.cell[data-name="' + name + '"]', $head).add('td.cell[data-name="' + name + '"]', $body).each(function(){
					var $this = $(this);
					var $cell = $this.children('.cell');
					$this.width( width - utils.getOutWidth($this) );
					$cell.width( width - utils.getOutWidth($cell) );
				});
				$head.width($body.width());
			};
			self.util.move2Column = function(n1, n2, p){
				var $wrap = $(self.params.wrap);
				var $head = $('.header', $wrap);
				var $body = $('.content', $wrap);
				var fnName = p > 0 ? 'insertAfter' : 'insertBefore';
				var $th1 = $('th.cell[data-name="' + n1 + '"]', $head);
				var $th2 = $('th.cell[data-name="' + n2 + '"]', $head);
					$th2[fnName]($th1);
				var $td1 = $('td.cell[data-name="' + n1 + '"]', $body);
				var $td2 = $('td.cell[data-name="' + n2 + '"]', $body);
					$td2.each(function(i, item){
						$(this)[fnName]($td1.eq(i));
					});
			};
		
		$.extend( true, self.params, opts || {} );
		
		if( self.params.loadWhenInit ) {
			self.util.request( self.util.getRequestURL(), self.util.getRequestParams() );
		}
		return $.extend( self.data.widget, self.util.getWidget() );
	}
	exports[name] = function(opts){
		return new bmstable(opts);
	}
})(utils, 'bmstable');
//==============================================
//		end.bmstable
//==============================================



//==============================================
//beg.bmstcombox
//==============================================
(function(exports, name){
	"use strict";
	var Combox = function(_opts){
	var $doc = $(document);
	var opts = {};
		opts.$input = $;
		opts.build = function(i, item, key){
			return this.tmpl.replace(/\$label/g, this.label(item)).replace(/\$key/g, key);
		};
		opts.filter = function($items, val, oCombox){
			$items.hide().filter(':contains("' + val + '")').show();
		};
		opts.name = function(item){ return this.label(item); };//@deprecated
		opts.label = function(item){ return item || ''; };
		opts.data = function(){};
		opts.tmpl = '<li name="item" class="item" data-key="$key">$label</li>';
		opts.equals = function(item, val){ return val == item; };
		opts.onSelected = function(item){};
		opts = $.extend(opts, _opts || {});
	var self = this;
		self.opts = opts;
		self.items = [];
		self.cache = {};
		self.initElement = function(){
			if( !self.$panel ) {
				self.$panel = $('<div class="bmst-combox-panel"></div>');
				self.$body = $('<ul class="bmst-combox-body"><li><img src="resource/icon/loading.gif">加载中...</li></ul>');
				self.$drop = $('<span class="bmst-combox-drop"></span>');
				self.$wrap = $('<span class="bmst-combox"></span>');
				
				self.$wrap.insertAfter(opts.$input);
				self.$wrap.append(opts.$input).append(self.$drop);

				self.$panel.append( self.$body );
				self.$panel.width( self.$wrap.width() + 11 );

				var ename = utils.uuid();
				var hide = function(){
					window.setTimeout(function(){
						self.$panel.hide();
						$('[name=item]', self.$panel).show().removeClass('hover');
					}, 100);
				};
				var show = function(){
					if( self.$panel.is(':hidden') ) {
						var offset = self.$wrap.offset();
							offset.top += self.$wrap.outerHeight() + 1;
						self.$panel.show().offset(offset);
						self.$panel.width( self.$wrap.width() + 11 );
						//ie11 bug?
						if( $.browser.msie && $.browser.msie ) {
							self.$panel.css({
								 top	: offset.top
								,left	: offset.left
							});
						}
						window.setTimeout(function(){
							self.$panel.offset(offset);
						}, 100);
					}
				};
				
				$doc.bind('click.' + ename, hide);

				self.$wrap.bind('click.' + ename, function(){return false;});
				self.$panel.bind('click.' + ename, function(){return false;});
				self.$panel.hide();

				opts.$input.addClass('bmst-combox-input');
				opts.$input.bind('keyup.bmst-combox', function(event){
					var $items = $('[name=item]', self.$body);
					var $visib = $items.filter(':visible');
					var $hover = $visib.filter('.hover');
					if( event.which == 38 ){//up
						var idx = 0;
						if( $hover.length ) {
							idx = $hover.prevAll(':visible').length - 1;
							if( idx < 0 ) {
								idx = $visib.length - 1;
							}
						}
						$hover.removeClass('hover');
						$visib.eq(idx).addClass('hover');
					}
					else if( event.which == 40 ){//down
						var idx = 0;
						if( $hover.length ) {
							idx = $hover.prevAll(':visible').length + 1;
							if( idx >= $visib.length ) {
								idx = 0;
							}
						}
						$hover.removeClass('hover');
						$visib.eq(idx).addClass('hover');
					}
					else if( event.which == 13 ) {//enter
						$hover.trigger('click');
					}
					else {
						opts.filter($items, opts.$input.val(), self);
					}
					show();
				});
				opts.$input.bind('click', function(event){
					if( opts.$input.get(0).readOnly ){
						self.$drop.click();
					}
				});
				self.$drop.hover(
					function(){self.$drop.addClass('bmst-combox-drop-hover');}, 
					function(){self.$drop.removeClass('bmst-combox-drop-hover');}
				);
				self.$drop.click(function(){
					$('.bmst-combox-panel').hide();
					opts.$input.focus();
					show();
				});
				self.$panel.delegate('[name=item]', 'click', function(event){
					var $this = $(event.currentTarget);
					var data = null;
					var key = $this.attr('data-key');
					if( key ) {
						data = self.cache[key];
					}
					else {
						data = self.items[$this.prevAll().length];
					}
					if( opts.onSelected(data) !== false ) {
						opts.$input.val(opts.label(data));
						opts.$input.change();
						hide();
					}
				});
				self.$panel.delegate('[name=item]', 'mouseenter', function(event){
					var $this = $(event.currentTarget);
						$this.addClass('hover');
				});
				self.$panel.delegate('[name=item]', 'mouseleave', function(event){
					var $this = $(event.currentTarget);
						$this.removeClass('hover');
				});
				self.$panel.hover(function(){}, function(){/*hide();*/});
				self.$panel.appendTo($('body'));
			}
		};
		self.build = function(){
			var html = [];
			$.each(self.items, function(i, item){
				var key = utils.uuid();
				self.cache[key] = item;
				html.push( opts.build(i, item, key) );
			});
			self.$body.html( html.join('') );
		};
		self.waiting = function(html){
			self.cache = {};
			self.items = [];
			self.$body.html(html || '<li><img src="resource/icon/loading.gif">加载中...</li>');
		};
		self.setData = function(data){
			self.cache = {};
			self.items = data;
			self.build();
			self.setValue(opts.$input.val());
		};
		self.setValue = function(val){
			for(var key in self.cache) {
				var item = self.cache[key];
				if( opts.equals(item, val) ){
					$('[data-key="' + key + '"]', self.$panel).trigger('click');
				}
			}
		};
		self.getLabel = function(val){
			val = val == undefined ? opts.$input.val() : val;
			for(var i=0; i<self.items.length; i++){
				var item = self.items[i];
				if( opts.equals(item, val) ){
					return opts.label(item);
				}
			}
			return null;
		};
		self.init = function(){
			self.initElement();
			if( $.isFunction(opts.data) ) {
				opts.data.call(self, opts, function(data){
					self.setData(data);
				});
			}
			else if( $.isArray(opts.data) ){
				self.setData(opts.data);
			}
			else {
				throw 'data must be function or array.';
			}
			return self;
		};
	return self;
	};
	exports[name || 'bmstcombox'] = {
		bind : function(opts){
			return new Combox(opts).init();
		}
	};
})(utils, 'bmstcombox');
//==============================================
//end.bmstcombox
//==============================================



//==============================================
//		beg.bmstedit
//==============================================
(function(exports, name){
	"use strict";
	var Editor = function(opts, $wrap){
		var self = {};
			self.opts = {};
			self.opts.$wrap = $wrap || opts.$wrap;
			self.opts.validate = opts.validate || $.noop;
			self.opts.getLabel = opts.getLabel || $.noop;
			self.opts.getInput = opts.getInput || $.noop;
			self.opts.onCancel = opts.onCancel || $.noop;
			self.opts.onEnsure = opts.onEnsure || $.noop;
			self.bind = function(){
				var $wrap = self.opts.$wrap;
				if( $wrap.is('[data-mField]') ) {
					$wrap = $wrap.parent();
				}
				var $field = $('[data-mField]', $wrap);
				var name = $field.attr('data-mField');
				var value = self.util.getFieldValue($field);
				var $edit = $('[data-mEdit]', $wrap);
				var $editable = $('.editable', $wrap);
				if( !$edit.length ) {
					$editable = $('<img src="resource/icon/edit.gif" class="editable" style="display:none;"/>');
					$editable.appendTo($wrap);
					var html  = '<span class="factor" data-mEdit="' + name + '" style="display:none;">';
						html +=		self.util.getInputHtml($field, name, value);
						html += '	<img src="resource/icon/factor-ensure.gif" class="spot ensure"/>';
						html += '	<img src="resource/icon/factor-cancel.gif" class="spot cancel"/>';
						html += '</span>';
					$edit = $( html );
					$edit.appendTo($wrap);
				}
				var $input = $('[data-mInput]', $edit);
				if( $field.attr('data-mInputClass') ) {
					$input.addClass( $field.attr('data-mInputClass') );
				}
				self.object = {
					 $wrap		: $wrap
					,$field		: $field
					,$editable	: $editable
					,$input		: $input
					,$edit		: $edit
					,$ensure	: $('.ensure', $edit)
					,$cancel	: $('.cancel', $edit)
				};
				$field.data('mEditor', self);
				$wrap.addClass('bmstedit');
				return self;
			};
			self.edit = function(){
				self.object.$editable.hide();
				self.object.$field.hide();
				self.object.$edit.show();
				self.object.$ensure.show();
				self.object.$cancel.show();
				self.object.$input.focus();
				if( self.util.isReadonly() ) {
					self.object.$field.show();
				}
				self.object.$edit.addClass('edit');
			};
			self.ensure = function(){
				self.util.setLabel();
				self.cancel();
			};
			self.cancel = function(){
				self.object.$editable.hide();
				self.object.$field.show();
				self.object.$edit.hide();
				self.object.$edit.removeClass('edit input');
			};
			self.input = function(){
				self.edit();
				self.object.$ensure.hide();
				self.object.$cancel.hide();
				self.object.$edit.addClass('input');
			};
			self.enabledit = function(){
				self.disabledit();
				if( !self.util.isReadonly() ) {
					self.object.$wrap
						.bind('mouseenter.mEditor', function(){
							if( self.object.$edit.is(':hidden') ){
								self.object.$editable.show();
								self.object.$wrap.addClass('hover');
							}
						})
						.bind('mouseleave.mEditor', function(){self.object.$editable.hide();self.object.$wrap.removeClass('hover');})
					;
				}
			};
			self.disabledit = function(){
				self.object.$wrap.unbind('mouseenter mouseleave');
			};
			self.getName = function(){ return self.object.$field.attr('data-mField'); }
			self.getValue = function(){ return self.object.$input.val(); };
			self.setValue = function(value){
				self.object.$field.attr('data-mValue', value);
				self.util.setValue(value);
				self.util.setLabel();
			};
			self.clsValue = function(){
				self.util.setValue('');
				self.util.setLabel();
			};
			self.validate = function(){
				var name = self.getName();
				var value = self.getValue();
				if( self.opts.validate(name, value) === false ) {
					self.object.$input.addClass('careful');
					self.object.$input.one('focus', function(){ self.object.$input.removeClass('careful'); });
					return false;
				}
				return true;
			}
			self.init = function(){
				self.bind();
				self.object.$edit.undelegate('.cancel').delegate('.cancel', 'click', function(){
					if( self.opts.onCancel.call(self) != false ) {
						self.cancel();
					}
				});
				self.object.$edit.undelegate('.ensure').delegate('.ensure', 'click', function(){
					if( self.opts.onEnsure.call(self) != false ) {
						self.ensure();
					}
				});
				self.object.$wrap.undelegate('.editable').delegate('.editable', 'click', function(){
					self.edit();
				});
				return self;
			};
			self.util = {};
			self.util.isReadonly = function($field){
				return ($field || self.object.$field).is('[data-mReadonly]');
			};
			self.util.getFieldValue = function($field){
				return $field.is('[data-mValue]') ? $field.attr('data-mValue') : $field.text();
			};
			self.util.getInputHtml = function($field, name, value){
				var input = '<input type="hidden" data-mInput="' + name + '" value="' + value + '"/>';
				if( !self.util.isReadonly($field) ) {
					input = self.opts.getInput(name, value);
					if( input ) {
						var $inputWrap = $('<div>' + input + '</div>');
						if( !$('[data-mInput]', $inputWrap).length ) {
							$inputWrap
								.children()
								.first()
								.attr('data-mInput', name)
							;
							input = $inputWrap.html();
						}
					}
					else {
						input = '<input type="text" data-mInput="' + name + '" value="' + value + '" />';
					}
				}
				return input;
			};
			self.util.setValue = function(value){
				self.object.$input.val( value );
			};
			self.util.setLabel = function(){
				var name = self.getName();
				var value = self.getValue();
				var label = self.opts.getLabel(self.object.$field, name, value);
				if( label === undefined ) {
					label = value;
				}
				self.object.$field.html(label);
			};
		return self.init();
	};
	var bmstedit = function(opts){
		var self = {};
			self.opts = $.extend({}, opts);
			self.opts.$wrap = $(opts.$wrap || 'body');
			self.tag = {};
			self.setTag = function(key, value) {
				self.tag[key] = value;
			};
			self.getTag = function(key){
				return self.tag[key];
			};
			self.getEditor = function($field){
				return $($field).data('mEditor');
			};
			self.init = function(){
				self.$fields = $('[data-mField]', self.opts.$wrap).each(function(){
					Editor(self.opts, $(this));
				});
				self.opts.$wrap.undelegate('[data-mInput]').delegate('[data-mInput]', 'change', function(event){
					var $this = $(event.currentTarget);
					var name = $this.attr('data-mInput');
					var $fields = self.$fields.filter('[data-mField="' + name + '"]');
					var oEditor = $fields.filter(function(){ return $(this).data('mEditor').object.$input = $this; }).first().data('mEditor');
					var value = oEditor.getValue();
					$fields.each(function(i, item){
						$(this).data('mEditor').setValue( value );
					});
				});
				self.opts.$wrap.data('mBmstedit', self);
				return self;
			};
			self.input = function(){
				self.$fields.each(function(i, item){
					self.getEditor(item).input();
				});
			};
			self.cancel = function(){
				self.$fields.each(function(i, item){
					self.getEditor(item).cancel();
				});
			}
			self.enabledit = function(){
				self.$fields.each(function(i, item){
					self.getEditor(item).enabledit();
				});
			};
			self.disabledit = function(){
				self.$fields.each(function(i, item){
					self.getEditor(item).disabledit();
				});
			};
			self.getValue = function(){
				var rets = {};
				self.$fields.not('[data-mReadonly]').each(function(i, item){
					var oEdit = self.getEditor(item);
					var name = oEdit.getName();
					rets[name] = oEdit.getValue();
				});
				self.$fields.filter('[data-mReadonly]').each(function(i, item){
					var oEdit = self.getEditor(item);
					var name = oEdit.getName();
					if( rets[name] == null ){
						rets[name] = oEdit.getValue();
					}
				});
				return rets;
			};
			self.setValue = function(entity){
				for(var attr in entity) {
					var $field = self.$fields.filter('[data-mField="' + attr + '"]');
					if( !$field.length ) {
						console.debug("[setValue]can't find field:" + attr);
					}
					else {
						$field.each(function(){
							self.getEditor(this).setValue( entity[attr] );
							console.debug('[setValue]set field value:' + attr + '=' + entity[attr] );
						});
					}
				}
			};
			self.clsValue = function(){
				self.$fields.each(function(i, item){
					self.getEditor(item).clsValue();
				});
			};
			self.validate = function(){
				var bRet = true;
				self.$fields.each(function(i, item){
					bRet &= self.getEditor(item).validate();
				});
				return bRet;
			};
		return self.init();
	};
	var extendArrays = function(oEditors, extEvent){
		if( !$.isArray(oEditors) ) { oEditors = []; }
		var hasExt = function(name){ return extEvent && $.isFunction(extEvent[name]); }
		oEditors.getValue = function(){
			var rets = [];
			$.each(oEditors, function(i, item){
				rets.push( item.getValue() );
			});
			return rets;
		};
		oEditors.setValue = function(items){
			$.each(items, function(i, item){
				if( oEditors[i] ) {
					oEditors[i].setValue(item);
				}
			});
		};
		oEditors.clsValue = function(){
			oEditors.length = 0;
			if( hasExt('clsValue') ) {
				extEvent.clsValue();
			}
		};
		oEditors.remove = function(isRemove){
			for(var i=0; i<oEditors.length; i++) {
				if( !$.isFunction(isRemove) || isRemove(oEditors[i]) ){
					oEditors.splice(i, 1);
					i--;
				}
			}
		};
		oEditors.validate = function(){
			var bRet = true;
			$.each(oEditors, function(i, item){
				bRet &= item.validate();
			});
			return bRet;
		};
		var keys = ['edit', 'input', 'cancel', 'enabledit', 'disabledit'];
		$.each(keys, function(i, key){
			oEditors[key] = (function(key){
				return function(){
					$.each(oEditors, function(i, item){
						item[key].apply(item, arguments);
					});
				};
			})(key);
		});
		return oEditors;
	};
	var getBmsteditor = function(field) {
		var $field = $(field);
		if( $field.is('.bmstedit') ) {
			$field = $field.children('[data-mfield]');
		}
		if( !$field.is('[data-mfield]') ) {
			$field = $field.closest('.bmstedit');
			$field = $field.children('[data-mfield]');
		}
		return $field.data('mEditor');
	}
	exports[name || 'bmstedit'] = {
		 bind			: function(){ return bmstedit.apply(this, arguments); }
		,getBmstedit	: function($el){ return $el.data('mBmstedit'); }
		,getBmsteditor	: getBmsteditor
		,extArrays		: extendArrays
	};
})(utils, 'bmstedit');
//==============================================
//		end.bmstedit
//==============================================



//==============================================
//		end.bmstips
//==============================================
(function(exports, name){
	"use strict";
	var Tips = function(opts){
		var self = {};
			self.name = new Date().getTime() + parseInt(Math.random() * 1000);
			self.delay = opts.delay || 500;
			self.period = opts.period || 2000;
			self.showTime = opts.showTime || 1000 * 10;
			self.getWin = function(){
				return utils.getTop();
			};
			self.getWrap = function(){
				if( !self.$wrap || !self.$wrap.length ) {
					var jQuery = self.getWin().jQuery || $;
					var $body = jQuery( 'body' );
					var $wrap = jQuery('[name="bmstips"]', $body);
					if( !$wrap.length ) {
						$wrap = jQuery('<div name="bmstips" class="bmstips"></div>');
						$wrap.appendTo( $body );
					}
					self.$wrap = jQuery('[name="bmstips"]', $body);
					self.jQuery = jQuery;
				}
				return self.$wrap;
			};
			self.init = function(){
				self.$wrap = self.getWrap();
				self.$wrap.undelegate('.tips-item');
				self.$wrap.delegate('.tips-item', 'mouseenter', function(event){ self.jQuery(event.currentTarget).attr('data-hover', true); });
				self.$wrap.delegate('.tips-item', 'mouseleave', function(event){ self.jQuery(event.currentTarget).removeAttr('data-hover'); });
				return self;
			}
			self.show = function(html){
				var $wrap = self.getWrap();
				var $item = self.jQuery('<div name="' + self.name + '" class="tips-item"></div>');
					$item.appendTo( $wrap );
					$item.html( html );
					$item.attr('data-time', new Date().getTime());
					$item.show(self.delay);
				(function($item){
					var win = self.getWin();
					var iTimer = win.setInterval(function(){
						var isHover = $item.attr('data-hover');
						if( !isHover ) {					
							var lastTime = $item.attr('data-time');
							if( new Date().getTime() - lastTime > self.showTime ) {
								$item.hide(self.delay);
								win.clearInterval(iTimer);
								win.setTimeout(function(){
									$item.remove();
								}, self.delay);
							}
						}
					}, self.period);
					win.eval("if( 'utils.bmstips.clear' in window ){ window['utils.bmstips.clear'](); }");
				})($item);
				return $item;
			};
		return self.init();
	};
	var oTips = new Tips({});
	exports[name || 'bmstips'] = {
		 info	: function(){ var $item = oTips.show.apply(oTips, arguments); $item.addClass('tips-info'); }
		,warn	: function(){ var $item = oTips.show.apply(oTips, arguments); $item.addClass('tips-warn'); }
		,error	: function(){ var $item = oTips.show.apply(oTips, arguments); $item.addClass('tips-error'); }
	};
	window['utils.bmstips.clear'] = function(){
		if( !('utils.bmstips.clear.inited' in window) ){
			var self = window['utils.bmstips.clear.inited'] = {};
				self.delay = 500;
				self.period = 2000;
				self.showTime = 1000 * 10;
				self.remove = function($item){
					var isHover = $item.attr('data-hover');
					if( !isHover ) {					
						var lastTime = $item.attr('data-time');
						if( new Date().getTime() - lastTime > self.showTime ) {
							$item.hide(self.delay);
							setTimeout(function(){
								$item.remove();
							}, self.delay);
	}
					}
				};
				self.iTimer = window.setInterval(function(){
					var $items = $('.bmstips > .tips-item').each(function(){
						var $item = $(this);
						self.remove($item);
					});
					if( !$items.length ){
						clearInterval(self.iTimer);
						delete window['utils.bmstips.clear.inited'];
					}
				}, self.period);
		}
	};
})(utils, 'bmstips');
//==============================================
//		end.bmstips
//==============================================



//==============================================
//		end.bmstag
//==============================================
(function(exports, name){
	"use strict";
	var Scutcheon = function(opts){
		var self = {};
			self.opts = {};
			self.opts.$wrap = opts.$wrap;
			self.opts.kinds = opts.kinds || [];
			self.opts.isMulti = opts.isMulti === true;
			self.opts.isCreatable = !!opts.isCreatable;
			self.opts.isDeletable = !!opts.isDeletable;
			self.opts.equals = opts.equals;
			self.opts.getKind = opts.getKind || $.noop;
			self.opts.getLabel = opts.getLabel || $.noop;
			self.opts.onDelete = opts.onDelete || $.noop;
			self.opts.onCreate = opts.onCreate || $.noop;
			self.opts.onClick = opts.onClick || $.noop;
			self.data = {};
			self.init = function(){
				if( !self.$wrap ) {
					self.$wrap = $('<span class="bmstag"></span>');
					self.$wrap.appendTo( self.opts.$wrap );
					self.$wrap.delegate('.item', 'click', function(event){
						var $item = $(event.currentTarget).closest('[data-bmstag-key]');
						var key = $item.attr('data-bmstag-key');
						var val = self.data[key];
						self.opts.onClick.call(self, val);
					});
					self.$wrap.delegate('.strike', 'click', function(event){
						var $item = $(event.currentTarget).closest('[data-bmstag-key]');
						var key = $item.attr('data-bmstag-key');
						var val = self.data[key];
						if( self.opts.onDelete.call(self, val) !== false ){
							delete self.data[key];
							$item.remove();
						}
					});
					if( !self.opts.kinds.length ) {
						self.$wrap.delegate('.raise', 'click', function(event){
							var data = self.get();
							var item = self.opts.onCreate.call(self, data);
							if( item ) {
								self.add( item );
							}
						});
					}
					else {
						self.util.setKind();
					}

					self.$btnCreate = $('<a href="javascript:void(0);" class="raise"><img src="resource/icon/bmstag-select.png" /></a>');
					self.$btnCreate.appendTo( self.$wrap );
					if( !self.opts.isCreatable ){
						self.$btnCreate.hide();
					}
					if( !self.opts.isDeletable ){
						self.$wrap.addClass('readonly');
					}
					
					self.$items = $('<span class="items"></span>');
					self.$items.appendTo( self.$wrap );

					if( $.isArray(opts.items) ) {
						$.each(opts.items, function(i, item){
							self.add( item );
						});
					}
					self.opts.$wrap
						.attr('data-bmstag-wrap', true)
						.data('mBmstag', self)
					;
				}
				return self;
			};
			self.add = function(item){
				var items = $.isArray(item) ? item : [item];
				$.each(items, function(i, item){
					if( !self.opts.isMulti ) {
						$('.strike', self.$wrap).click();
					}
					var key = utils.uuid();
					var $item = $('<span class="item"></span>');
						$item.append( self.util.getLabelHtml(item) );
						$item.append( '<span class="strike"><img src="resource/icon/del.gif" /></span>' );
						$item.attr( 'data-bmstag-key', key );
						$item.appendTo( self.$items );
					self.data[key] = item;
					if( !self.opts.isCreatable ){
						self.$btnCreate.hide();
					}
				});
			};
			self.get = function(){
				var rets = [];
				for(var key in self.data) {
					rets.push( self.data[key] );
				}
				return rets;
			};
			self.clear = function(){
				$('.strike', self.$wrap).click();
			};
			self.exists = function(item) {
				for(var key in self.data) {
					if( self.util.equals(item, self.data[key]) ){
						return true;
					}
				}
				return false;
			};
			self.remove = function(item){
				for(var key in self.data) {
					if( self.util.equals(item, self.data[key]) ){
						var $item = $('[data-bmstag-key="' + key + '"]', self.$wrap);
						$('.strike', $item).click();
					}
				}
			};
			self.util = {};
			self.util.setKind = function(){
				var data = {};
				var $ul = $('<ul class="bmstag-kind" style="display:none;"></ul>');
				var hide = function(){
					$ul.hide();
					self.$btnCreate.removeClass('kind');
				}
				$.each(self.opts.kinds, function(i, item){
					var key = utils.uuid();
					$ul.append('<li data-bmstag-kind="' + key + '">' + self.util.getKindLabel(item) + '</li>');
					data[key] = item;
				});
				self.$wrap.append($ul);
				self.$wrap.delegate('.raise', 'mouseenter', function(event){
					var pos = self.$btnCreate.position();
					$ul.show();
					$ul.offset({
						 left	: pos.left
						,top	: pos.top + self.$btnCreate.outerHeight()
					});
					window.setTimeout(function(){
						var pos = self.$btnCreate.position();
						$ul.offset({
							 left	: pos.left
							,top	: pos.top + self.$btnCreate.outerHeight()
						});
					}, 100);
					self.$btnCreate.addClass('kind');
					$(document).one('click', hide);
				});
				self.$wrap.delegate('.bmstag-kind', 'mouseleave', hide);
				self.$wrap.delegate('.bmstag-kind > li', 'click', function(event){
					var $this = $(event.currentTarget);
					var kind = data[ $this.attr('data-bmstag-kind') ];
					var item = self.opts.onCreate.call(self, self.get(), kind);
					if( item ) {
						self.add( item );
					}
					hide();
				});
			};
			self.util.getKindLabel = function(item){
				var name = self.opts.getKind(item);
				if( !name ) {
					name = item;
				}
				return name;
			};
			self.util.getLabelHtml = function(item){
				var name = self.opts.getLabel(item);
				if( !name ) {
					name = item;
				}
				return '<span class="label">' + name + '</span>';
			}
			self.util.getItem = function(el){
				var $el = $(el).closest('[data-bmstag-key]');
				var key = $el.attr('data-bmstag-key');
				return {key : key, value : self.data[key]};
			};
			self.util.equals = function(o1, o2) {
				var equals = self.opts.equals;
				if( !$.isFunction(equals) ) {
					equals = function(o1, o2) {
						return o1 == o2;
					};
				}
				return equals(o1, o2);
			}
		return self.init();
	};
	exports[name || 'bmstag'] = {
		 bind	: function(opts){ return new Scutcheon(opts); }
		,getag	: function(el){ return $(el).closest('[data-bmstag-wrap]').data('mBmstag') }
	};
})(utils, 'bmstag');
//==============================================
//		end.bmstag
//==============================================



//==============================================
//		beg.bmstcalendar
//==============================================
(function(exports, name){
	var ODate = function(date){
		this.value = new Date(date instanceof Date ? date.getTime() : date);
		this.setDate = function(date){
			this.value.setDate(date);
			return this;
		}
		this.setHours = function(hours) {
			this.value.setHours(hours);
			return this;
		}
		this.getMaxDate = function(){
			return new ODate(this.value).setDate(32).setDate(1).setHours(0).setHours(-1).value.getDate();
		}
		this.getFirstDay = function(){
			return new ODate(this.value).setDate(1).value.getDay();
		}
	}
	var OCalendar = function(date){
		var oDate = date instanceof ODate ? date : new ODate(date || new Date());
		var fill = function(num){
			return (['00','01','02','03','04','05','06','07','08','09','10','11','12'][num]||num);
		}
		var getPrefix = function(date) {
			return [date.getFullYear(), fill(date.getMonth()+1)].join('');
		}
		var build2dMatrix = function(oDate){
			var mData = [];
			var mDay = oDate.getFirstDay();
			var mPrefix = getPrefix(oDate.value);
			var mMaxDate = oDate.getMaxDate();
			for(var i=0; i<mMaxDate;) {
				var data = [];
				while( data.length < 7 && i<mMaxDate ) {
					var idx = mDay - 1 >= 0 ? mDay - 1 : 6;
					data[idx] = mPrefix + fill(++i);
					mDay++;
				}
				mData.push(data);
				mDay = 1;
			}
			return mData;
		}
		var fill2dMatrix = function(oDate, mData) {
			var oLastMonth = new ODate(oDate.value).setDate(1).setDate(-1);
			var oNextMonth = new ODate(oDate.value).setDate(32);
			var lmMaxDate = oLastMonth.getMaxDate();
			var lmPrefix = getPrefix(oLastMonth.value);
			var nmPrefix = getPrefix(oNextMonth.value);
			var fData = mData[0];
			for(var i=6; i>=0; i--) {
				fData[i] = fData[i] || (lmPrefix + fill(lmMaxDate--));
			}
			var lData = mData[mData.length -1];
			for(var i=1; lData.length < 7; i++) {
				lData[lData.length] = nmPrefix + fill(i);
			}
			return mData;
		}
		var self = {};
			self.data = fill2dMatrix(oDate, build2dMatrix(oDate));
			self.html = function() {
				var html = ['<table class="bmstcalendar">','<thead><tr>','<th>Monday</th>','<th>Tuesday</th>','<th>Wednesday</th>','<th>Thursday</th>','<th>Friday</th>','<th>Saturday</th>','<th>Sunday</th>','</tr></thead>'];
				for(var i=0; i<self.data.length; i++) {
					html.push('<tr data-row="' + i + '">');
					var date = self.data[i];
					for(var d=0; d<date.length; d++) {
						var sdate = date[d] || '';
						html.push( '<td data-date="' + sdate + '" data-day="' + (d+1) + '">' + parseInt(sdate.substr(sdate.length-2)) + '</td>' );
					}
					html.push('</tr>');
				}
				html.push('</table>');
				return html.join('');
			}
			self.lastPrefix = getPrefix(new ODate(oDate.value).setDate(1).setDate(-1).value);
			self.nextPrefix = getPrefix(new ODate(oDate.value).setDate(32).value);
		return self;
	}
	
	exports[name || 'bmstcalendar'] = {
		 build	: function(){return OCalendar.apply(this, arguments);}
	};
})(utils, 'bmstcalendar');
//==============================================
//		end.bmstcalendar
//==============================================
