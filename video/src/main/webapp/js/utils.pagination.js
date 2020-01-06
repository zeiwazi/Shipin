/*
	need jQuery,jQuery.cookie
*/
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
		var html = '<span>' +
						'<img class="btnFirst" title="首页"/><img class="btnPrev" title="上一页"/><img class="btnNext" title="下一页"/>&nbsp;<img class="btnLast" title="尾页"/>&nbsp;' +
						'显示第<select class="selPStart"></select>页，每页<select class="selPSize"></select>条记录，共<span style="color:#FF9900;" class="txtITotal"></span>条记录' +
					'</span>';
		if( $.isPlainObject(arguments[1]) ){
			var pagination = arguments[1];
			if( typeof(pagination.PSize) != 'undefined'
				&& typeof(pagination.PTotal) != 'undefined'
				&& typeof(pagination.PStart) != 'undefined'
				&& typeof(pagination.IStart) != 'undefined'
				&& typeof(pagination.ITotal) != 'undefined' ){
					PSize = pagination.PSize;
					PTotal = pagination.PTotal;
					PStart = pagination.PStart;
					IStart = pagination.IStart;
					ITotal = pagination.ITotal;
				}
		}
		var el = $(html);
		var btnFirst = el.find('.btnFirst');
		var btnPrev = el.find('.btnPrev');
		var btnNext = el.find('.btnNext');
		var btnLast = el.find('.btnLast');
		var txtITotal = el.find('.txtITotal').text(ITotal);
		var selPStart = el.find('.selPStart');
		var selPSize = el.find('.selPSize');
		html = '';
		for(var i=1; i<=(PTotal||1); i++){
			html += '<option value="$i" $selected>$i</option>'.replace(/\$i/g,i).replace(/\$selected/g,PStart==i ? 'selected="true"' : '');
			//selPStart.append($('<option />').val(i).text(i).attr('selected',PStart==i));//with ie,too slow when PTotal large than 5000
		}
		selPStart.html(html);
		$.each([10,20,50,100],function(n,i){
			selPSize.append($('<option />').val(i).text(i).attr('selected',PSize==i));
		});
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
		if(PStart>=PTotal)
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
