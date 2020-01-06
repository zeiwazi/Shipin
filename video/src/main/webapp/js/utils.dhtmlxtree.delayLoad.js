(function($){
	window.utils = window.utils || {};
	/**
	 *	func_url : func_url(itemId) return query url
	 *	func_object : func_object(data) return {pid,id,text,isfolder,itemActionHandler,img1,img2,img3,optionStr,key(for setUserData)}
	 */
	utils.extDhtmlXTreeObjectEnabledDelayLoad = function(tree,data,func_object,func_afterOpen)
	{
		tree._correctPlus=function(itemObject)
		{
			if (!itemObject.htmlNode) return;
			var imsrc=itemObject.htmlNode.childNodes[0].childNodes[0].childNodes[0].lastChild;
			var imsrc2=itemObject.htmlNode.childNodes[0].childNodes[0].childNodes[2].childNodes[0];
			
			var workArray=this.lineArray;
			if ((this.XMLsource)&&(!itemObject.XMLload))
			{
				var workArray=this.plusArray;
				this._setSrc(imsrc2,this.iconURL+itemObject.images[2]);
				if (this._txtimg) return (imsrc.innerHTML="[+]");
			}
			else if ((itemObject.childsCount)||(itemObject.unParsed)||(itemObject.enabledDelayLoad != undefined))
			{
				if ( /*((itemObject.htmlNode.childNodes[0].childNodes[1])&&(itemObject.htmlNode.childNodes[0].childNodes[1].style.display!="none"))
					||(!itemObject.enabledDelayLoad)*/
					this._isOpening(itemObject)||(!itemObject.enabledDelayLoad) )
				{
					if (!itemObject.wsign) var workArray=this.minusArray;
					this._setSrc(imsrc2,this.iconURL+itemObject.images[1]);
					if (this._txtimg) return (imsrc.innerHTML="[-]");
				}
				else
				{
					if (!itemObject.wsign) var workArray=this.plusArray;
					this._setSrc(imsrc2,this.iconURL+itemObject.images[2]);
					if (this._txtimg) return (imsrc.innerHTML="[+]");
				}
			}
			else
			{
				this._setSrc(imsrc2,this.iconURL+itemObject.images[0]);
			}
			var tempNum=2;
			if (!itemObject.treeNod.treeLinesOn)
			{
				this._setSrc(imsrc,this.imPath+workArray[3]);
			}
			else
			{
				if (itemObject.parentObject) tempNum=this._getCountStatus(itemObject.id,itemObject.parentObject);
				this._setSrc(imsrc,this.imPath+workArray[tempNum]);
			}
		};
		tree._attachChildNode=function(parentObject,itemId,itemText,itemActionHandler,image1,image2,image3,optionStr,childs,beforeNode,afterNode)
		{
			if (beforeNode && beforeNode.parentObject)
				parentObject=beforeNode.parentObject;
			if (((parentObject.XMLload==0)&&(this.XMLsource))&&(!this.XMLloadingWarning))
			{
				parentObject.XMLload=1;
				this._loadDynXML(parentObject.id);
			}
			var Count=parentObject.childsCount;
			var Nodes=parentObject.childNodes;
			if (afterNode)
			{
				if (afterNode.tr.previousSibling.previousSibling)
					beforeNode=afterNode.tr.previousSibling.nodem;
				else
					optionStr=optionStr.replace("TOP","")+",TOP";
			}
			
			if (beforeNode)
			{
				var ik,jk;
				for (ik=0; ik<Count; ik++)
				{
					if (Nodes[ik]==beforeNode)
					{
						for (jk=Count; jk!=ik; jk--)
							Nodes[1+jk]=Nodes[jk];
						break;
					}
				}
				ik++;
				Count=ik;
			}
			if (optionStr)
			{
				var tempStr=optionStr.split(",");
				for (var i=0; i<tempStr.length; i++)
				{
					switch(tempStr[i])
					{
						case "TOP":
							if (parentObject.childsCount>0)
							{
								beforeNode=new Object;
								beforeNode.tr=parentObject.childNodes[0].tr.previousSibling;
							}
							parentObject._has_top=true;
							for  (ik=Count; ik>0; ik--)
								Nodes[ik]=Nodes[ik-1];
							Count=0;
							break;
						}
				};
			};
			var n;
			if (!(n=this._idpull[itemId]) || n.span!=-1)
			{
				n=Nodes[Count]=new dhtmlXTreeItemObject(itemId,itemText,parentObject,this,itemActionHandler,1);
				itemId = Nodes[Count].id;
				parentObject.childsCount++;
			}
			if(!n.htmlNode)
			{
				n.label=itemText;
				n.htmlNode=this._createItem((this.checkBoxOff?1:0),n);
				n.htmlNode.objBelong=n;
			}
			if(image1) n.images[0]=image1;
			if(image2) n.images[1]=image2;
			if(image3) n.images[2]=image3;
			
			var tr=this._drawNewTr(n.htmlNode);
			if ((this.XMLloadingWarning)||(this._hAdI))
				n.htmlNode.parentNode.parentNode.style.display="none";


			if ((beforeNode)&&(beforeNode.tr.nextSibling))
				parentObject.htmlNode.childNodes[0].insertBefore(tr,beforeNode.tr.nextSibling);
			else if (this.parsingOn==parentObject.id)
				this.parsedArray[this.parsedArray.length]=tr;
			else
				parentObject.htmlNode.childNodes[0].appendChild(tr);


			if ((beforeNode)&&(!beforeNode.span))
				beforeNode=null;
			
			if (this.XMLsource) if ((childs)&&(childs!=0)) 
				n.XMLload=0;
			else
				n.XMLload=1;
			n.tr=tr;
			tr.nodem=n;

			if (parentObject.itemId==0)
				tr.childNodes[0].className="hiddenRow";

			if ((parentObject._r_logic)||(this._frbtr))
				this._setSrc(n.htmlNode.childNodes[0].childNodes[0].childNodes[1].childNodes[0],this.imPath+this.radioArray[0]);
			
			if (optionStr)
			{
				var tempStr=optionStr.split(",");
				for (var i=0; i<tempStr.length; i++)
				{
					switch(tempStr[i])
					{
						case "SELECT": this.selectItem(itemId,false); break;
						case "CALL": this.selectItem(itemId,true);   break;
						case "CHILD":  n.XMLload=0;  break;
						case "CHECKED":
							if (this.XMLloadingWarning)
								this.setCheckList+=this.dlmtr+itemId;
							else
								this.setCheck(itemId,1);
							break;
						case "HCHECKED":
							this._setCheck(n,"unsure");
							break;
						case "OPEN": n.openMe=1;  break;
					}
				};
			};

			//only add
			if(childs)
			{
				n.unParsed = true;
				n.enabledDelayLoad = true;
			}

			if (!this.XMLloadingWarning)
			{
				if ((this._getOpenState(parentObject)<0)&&(!this._hAdI))
					this.openItem(parentObject.id);
				
				if (beforeNode)
				{
					this._correctPlus(beforeNode);
					this._correctLine(beforeNode);
				}
				this._correctPlus(parentObject);
				this._correctLine(parentObject);
				this._correctPlus(n);
				if (parentObject.childsCount>=2)
				{
					this._correctPlus(Nodes[parentObject.childsCount-2]);
					this._correctLine(Nodes[parentObject.childsCount-2]);
				}
				if (parentObject.childsCount!=2)
					this._correctPlus(Nodes[0]);
				
				if (this.tscheck)
					this._correctCheckStates(parentObject);
				
				if (this._onradh)
				{
					if (this.xmlstate==1)
					{
						var old=this.onXLE;
						this.onXLE=function(id){ this._onradh(itemId); if (old) old(id); }
					}
					else
						this._onradh(itemId);
				}
			}
			return n;
		};
		tree.addItem = function(parentId,itemId,itemText,children,itemActionHandler,image1,image2,image3,optionStr)
		{
			var item = this.insertNewItem(parentId,itemId,itemText,itemActionHandler,image1,image2,image3,optionStr,children);
			return item;
		}
		if(data)
		{
			if(!tree._d){
				var root = [];
				var cache = {};
				for(var i=0; i<data.length; i++){
					var o = data[i];
					if(typeof func_object == 'function'){
						o = func_object(o);
					}
					o.childs = [];
					cache[o.id] = o;
					if(!cache[o.pid]){
						root.push(o);
					}
					else{
						cache[o.pid].childs.push(o);
						cache[o.pid].isfolder = true;
					}
					for(var j=0; j<root.length; j++){
						if(o.id == root[j].pid){
							o.childs.push(root[j]);
							root.splice(j--,1);
						}
					}
				}
				tree._d = {
					root : root
					,data : data
					,cache : cache
				}
			}
			tree.setOnOpenHandler(function(itemId){
				var item = this.getItem(itemId);
				if(item.unParsed && !item.childsCount){
					item.unParsed = !item.unParsed;
					var data = this._d.cache[itemId];
					var childs = data ? data.childs : this._d.root;
					for(var i=0; i<childs.length; i++){
						var o = childs[i];
						var item = tree.addItem(o.pid,o.id,o.text||o.name,o.isfolder||o.childs.length,o.itemActionHandler,o.img1,o.img2,o.img3,o.optionStr);
						var key = o.key || '_defData';
						tree.setUserData(item.id,key,o);
					};
					if(!childs.length)
						tree._correctPlus(item);
					if(typeof func_afterOpen == 'function')
						func_afterOpen.call(tree,childs,itemId);
					return false;
				}
				return true;
			});
		}
	}
	utils.extDhtmlXTreeObjectDelayLoad = function(tree,itemId)
	{
		var item = tree.getItem(itemId);
		item.unParsed = !item.unParsed;
		tree.callEvent('onOpenStart',[itemId,2]);
	}
})(jQuery);
