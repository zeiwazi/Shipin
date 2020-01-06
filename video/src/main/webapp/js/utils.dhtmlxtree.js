(function($){
	window.utils = window.utils || {};

	function addClass(el,cn){
		var regexp = new RegExp('(^|\\s+)' +cn+ '($|\\s+)');
		var className = el.className||'';
		if(!regexp.test(className)){
			className += ' ' + cn;
		}
		el.className = className;
	}
	function removeClass(el,cn){
		var regexp = new RegExp('(^|\\s+)' +cn+ '($|\\s+)','g');
		el.className = (el.className||'').replace(regexp,' ');
	}
	utils.extContextmenu2DhtmlXTreeObject = function(tree,menuOption)
	{
		tree._TinsertNewItem_extContextmenu2DhtmlXTreeObject = tree.insertNewItem;
		tree.insertNewItem = function(parentId,itemId,itemText,itemActionHandler,image1,image2,image3,optionStr,children)
		{
			var item = this._TinsertNewItem_extContextmenu2DhtmlXTreeObject(parentId,itemId,itemText,itemActionHandler,image1,image2,image3,optionStr,children);
			$(item.tr).find('td.standartTreeRow').contextmenu(menuOption);
			return item;
		}
	}
	utils.extDhtmlXTreeObjectOnMouseHandler = function(tree)
	{
		tree.setOnMouseInHandler(function(itemId){
			var item = this.getItem(itemId);
			//if(!item.i_sel)
			//	item.span.parentNode.style.backgroundColor = '#ABCDEF';
			if(!item.i_sel){
				addClass(item.span.parentNode,'hover');
			}
		});
		tree.setOnMouseOutHandler(function(itemId){
			var item = this.getItem(itemId);
			//if(!item.i_sel)
			//	item.span.parentNode.style.backgroundColor = '#FFFFFF';
			if(!item.i_sel){
				removeClass(item.span.parentNode,'hover');
			}
		});
	}
	if(window.dhtmlXTreeObject)
	{
		dhtmlXTreeObject.prototype.ext = {};

		dhtmlXTreeObject.prototype._TinsertNewItem = dhtmlXTreeObject.prototype.insertNewItem;
		dhtmlXTreeObject.prototype.insertNewItem = function(parentId,itemId,itemText,itemActionHandler,image1,image2,image3,optionStr,children)
		{
			if(!this.NoParent)
			{
				this.NoParent = this._TinsertNewItem(this.rootId,'____NOPARENT____',"u can't see me");
				try{this.moveItem(this.NoParent.id,'up_strict',this.getAllSubItems(this.rootId).toString().split(this.dlmtr)[0]);}catch (e){/*alert(e);*/}
				this.NoParent.tr.parentNode.removeChild(this.NoParent.tr);
				this.NoParent.__ps = {};
			}
			var item = this._TinsertNewItem(parentId,itemId,itemText,itemActionHandler,image1,image2,image3,optionStr,children);
			var pitem = this.NoParent;
			var ps = pitem.__ps;
			if(item == -1)
			{
				item = this._TinsertNewItem(pitem.id,itemId,itemText,itemActionHandler,image1,image2,image3,optionStr,children);
				(ps[parentId] = ps[parentId] || []).push(item);
			}
			for(var pid in ps)
			{
				if(itemId == pid)
				{
					for(var i=0; i<ps[itemId].length; i++)
						this.moveItem(ps[itemId][i].id,'item_child',item.id);
				}
			}
			return item;
		}
		dhtmlXTreeObject.prototype._getLineStatus =function(itemId,itemObject)
		{
			if (itemObject.childNodes[itemObject.childsCount-1].id==itemId
				||itemObject.childNodes[itemObject.childsCount-1].id=='____NOPARENT____') 
				return 0;
			return 1;
		}
		dhtmlXTreeObject.prototype._markItem=function(node)
		{
			removeClass(node.span.parentNode,'hover');
			addClass(node.span.parentNode,'selected');
			//node.span.parentNode.style.backgroundColor = '#FEDCBA';
			if (node.scolor)  node.span.style.color=node.scolor;
			//node.span.className="selectedTreeRow";
			node.i_sel=true;
			this._selected[this._selected.length]=node;
		}
		dhtmlXTreeObject.prototype._unselectItem=function(node)
		{
			if ((node)&&(node.i_sel))
			{
				removeClass(node.span.parentNode,'selected');
				//node.span.parentNode.style.backgroundColor = '#FFFFFF';
				//node.span.className="standartTreeRow";
				if (node.acolor)  node.span.style.color=node.acolor;
				node.i_sel=false;
				for (var i=0; i<this._selected.length; i++)
				{
					if (!this._selected[i].i_sel)
					{
						this._selected.splice(i,1);
						break;
					}
				}
			}
		}
		dhtmlXTreeObject.prototype._unselectItems=function()
		{
			for (var i=0; i<this._selected.length; i++)
			{
				var node=this._selected[i];
				this._unselectItem(node);
			}
			this._selected=new Array();
		}
		//extend
		/*
		 * return dhtmlXTreeItemObject
		 */
		dhtmlXTreeObject.prototype.getItem = dhtmlXTreeObject.prototype._globalIdStorageFind;
		dhtmlXTreeObject.prototype.getParent=function(itemId)
		{
			return this.getItem(this.getParentId(itemId));
		}
		dhtmlXTreeObject.prototype.getItem4El=function(el)
		{
			var itemId = el.id ? el.id.split('-')[1] : null;
			return this.getItem(itemId);
		}
		dhtmlXTreeObject.prototype.getSelectedItem=function()
		{
			var ids = this.getSelectedItemId();
			var itemId = ids.split(this.dlmtr)[0];
			return this.getItem(itemId);
		}
		dhtmlXTreeObject.prototype.getSelectedItems=function()
		{
			var items = [];
			var ids = this.getSelectedItemId();
			if( ids ) {
				var aid = ids.split(this.dlmtr);
				for(var i=0; i<aid.length; i++){
					items.push(this.getItem(aid[i]))
				}
			}
			return items;
		}
		dhtmlXTreeObject.prototype.setChecks=function(items,state)
		{
			for(var i=0; i<items.length; i++)
			{
				this.setCheck(items[i],state);
			}
		}
		dhtmlXTreeObject.prototype.unCheckAll=function()
		{
			var items = this.getAllChecked().toString().split(this.dlmtr);
			this.setChecks(items,false);
		}
		dhtmlXTreeObject.prototype.disableCheckboxExpand=function(itemid,state)
		{
			if(!state)
			{
				var item = this.getItem(itemid);
				do
				{
					this.disableCheckbox(item.id,state);
					item = this.getParent(item.id);
				}
				while(item && item.dscheck && item.id != this.rootId);
			}
			else
			{
				var items = this.getAllSubItems(itemid).toString().split(this.dlmtr).concat(itemid);
				for(var i=0; i<items.length; i++)
				{
					this.disableCheckbox(items[i],state);
				}
			}
		}
		dhtmlXTreeObject.prototype.disableAllCheckbox=function(state)
		{
			for(var item in this._idpull)
			{
				this.disableCheckbox(item,state);
			}
		}
		dhtmlXTreeObject.prototype.deleteItems=function(items,selectParent)
		{
			for(var i=0; i<items.length; i++)
				this.deleteItem(items[i], selectParent);
		}
		dhtmlXTreeObject.prototype.hideCheckbox=function(item)
		{
			item.chkb.style.display = 'none';
		}
		dhtmlXTreeObject.prototype.showCheckbox=function(item)
		{
			item.chkb.style.display = 'block';
		}
		dhtmlXTreeObject.prototype.getNextItem=function(itemId)
		{
			var pitemId = this.getParentId(itemId);
			var item = this.getItem(itemId);
			var pitem = this.getItem(pitemId);
			var next = undefined;
			if(pitem)
			{
				for(var i=0; i<pitem.childNodes.length; i++)
				{
					if(pitem.childNodes[i] == item)
					{
						next = pitem.childNodes[i+1];
						break;
					}
				}
			}
			return next;
		}
		dhtmlXTreeObject.prototype.getPrevItem=function(itemId)
		{
			var pitemId = this.getParentId(itemId);
			var item = this.getItem(itemId);
			var pitem = this.getItem(pitemId);
			var prev = undefined;
			if(pitem)
			{
				for(var i=0; i<pitem.childNodes.length; i++)
				{
					if(pitem.childNodes[i] == item)
					{
						prev = pitem.childNodes[i-1];
						break;
					}
				}
			}
			return prev;
		}
		dhtmlXTreeObject.prototype.getAllSubItems =function(itemId,returnArray)
		{
			var subitems = this._getAllSubItems(itemId);
			if( returnArray )
			{
				subitems = subitems ? subitems.toString().split(this.dlmtr) : [];
			}
			return subitems;
		}

		/**  
		*     @desc: open/close node 
		*     @type: private
		*     @param: itemObject - node object        
		*     @param: mode - open/close mode [1-close 2-open](optional)
		*     @topic: 6
		*/      
		dhtmlXTreeObject.prototype._HideShow=function(itemObject,mode)
		{
			if ((this.XMLsource)&&(!itemObject.XMLload)) 
			{
				if (mode==1) 
					return; //close for not loaded node - ignore it
				itemObject.XMLload=1;
				this._loadDynXML(itemObject.id);
				return;
			};

			var Nodes=itemObject.htmlNode.childNodes[0].childNodes;
			var Count=Nodes.length;
			if (Count>1)
			{
				//if ( ( (Nodes[1].style.display!="none") || (mode==1) ) && (mode!=2) ) 
				if( ( (this._isOpening(itemObject)) || (mode==1) ) && (mode!=2) ) 
				{
					//nb:solves standard doctype prb in IE
					this.allTree.childNodes[0].border = "1";
					this.allTree.childNodes[0].border = "0";
					nodestyle="none";
				}
				else
				{
					nodestyle="";
				}

				for (var i=1; i<Count; i++)
				{
					//Nodes[i].style.display=nodestyle;
					Nodes[i].style.display=Nodes[i].unshowabled ? 'none' : nodestyle;
				}
			}
			this._correctPlus(itemObject);
		}
		dhtmlXTreeObject.prototype._isOpening=function(itemObject)
		{
			var Nodes=itemObject.htmlNode.childNodes[0].childNodes;
			for(var i=1; i<Nodes.length; i++)
			{
				if((Nodes[i].style.display!="none"))
					return true;
				else if(!Nodes[i].unshowabled)
					return false;
			}
			return Nodes.length>1;
			if( Nodes.length<=1 )
			{
				return false;
			}
			else
			{
				if(Nodes[0].opened == 'undefined')
					Nodes[0].opened = true;
				Nodes[0].opened = !Nodes[0].opened;
				alert(Nodes[0].opened);
				return Nodes[0].opened;
			}
		}
		dhtmlXTreeObject.prototype.filter = function(itemid,text)
		{
			var item = this.getItem(itemid);
			var container = $(item.span).closest('tbody');
			if(text){
				$.each(container.children('tr:gt(0)'),function(i,n){
					var tr = n;
					if( $(tr).children('td').find('span:contains("'+text+'")').length ){
						tr.style.display = 'table-row';
						tr.unshowabled = false;
					}else{
						tr.style.display = 'none';
						tr.unshowabled = true;
					}
				});
				/*?bug for $('tr').hide()?
				container.children('tr:gt(0)')
					.hide()
					.find('span:contains("'+text+'")')
					.closest('tr')
					.show();
				*/
			}else{
				container.children('tr:gt(0)').show().attr('unshowabled',false);
			}
		}
		dhtmlXTreeObject.prototype.clearFilter = function(itemid)
		{
			itemid = itemid || this.rootId;
			var item = this.getItem(itemid);
			$(item.span).closest('table').find('tr:gt(0)').show().attr('unshowabled',false);
		}
		dhtmlXTreeObject.prototype.setStdResultAutoLoading = function(filePath) {
			this.setXMLAutoLoading(filePath);
			this.ext.setStdResultAutoLoading = true;
			this.ext._loadDynXML = this._loadDynXML;
			this._loadDynXML = function(id, src) {
				src=src||this.XMLsource;
				var sn=(new Date()).valueOf();
				this._ld_id=id;
				this.loadStdResult(src+getUrlSymbol(src)+"uid="+sn+"&id="+this._escape(id));
			}
		}
		dhtmlXTreeObject.prototype.loadStdResult = function(url,data,cbSuccess,cbFailed,dlgArgs) {
			var tree = this;
			var afterCall = $.isFunction(data) ? data : $.noop;
				cbSuccess = $.isFunction(cbSuccess) ? cbSuccess : function(result){
					tree.loadXMLString(result.data, afterCall);
				};
			dlgArgs = $.extend({modal:false,autoOpen:true}, dlgArgs || {});
			utils.stdPost(url, data, cbSuccess, cbFailed, dlgArgs);
		}
	}
})(jQuery);
