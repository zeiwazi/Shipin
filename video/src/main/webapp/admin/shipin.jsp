<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html lang="zh">
<head>
	<meta charset="UTF-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1"> 
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>视频播放</title>
	<link rel="stylesheet" type="text/css" href="http://at.alicdn.com/t/font_u4qz1594lnixusor.css">
	<link rel="stylesheet" type="text/css" href="css/normalize.css" />
	<link rel="stylesheet" type="text/css" href="css/htmleaf-demo.css">
	<link rel="stylesheet" type="text/css" href="css/common.css">
	<link rel="stylesheet" type="text/css" href="css/detail_p.css">
<style type="text/css">
	.div{width: 100%;
    height: 100%;
    overflow: hidden;
    position: absolute;
    top: 0%;
    left: 0%;
    margin-top: 0px;
    margin-left: 0px;
    cursor: pointer;
    background-color: black;
    z-index: 100;
    display: none;
    }
    .guanbiguanggao{
    	color:white;
    	float:right;
    }
.pinlunInfo{
	width:830px;
	
	border-radius:6px;
		
	/* float:left; */
	margin:  0 auto;
	overflow:hidden;
	margin-top:3px;
	}
.pinlun{
	width:830px;
	height:50;
	border-radius:6px;
		
	/* float:left; */
	margin:  0 auto;
	overflow:hidden;
	margin-top:3px;
	}
	.info{
	margin-top:5px;
	}
</style>

</head>
<body>
	<div class="htmleaf-container">
		<header class="htmleaf-header">
			<h1 id="title"></h1>
			
		</header>
		<div class="videos">
		    <!--bottom-->
		    <div class="video_b" style="margin-top:0">
		    	<div class="video_b_in">
		        	<div class="video_ls">
		            	<video id="vids">
		                您的浏览器不支持h5标签,请升级或换个浏览器
		                </video>
		                <!--标题-->
		                <div class="title_top">
		                	视频标题
		                </div>
		              
		               
		                <!--暂停-->
		                <div id="pass">
		                	<img src="media/zt.png">
		                </div>
		                 <div class="div">
		                 	<span class="guanbiguanggao">
		                 		关闭广告
		                 	</span>
		                	<video id="testvids" width="100%" height="100%" src="" autoplay="autoplay">
		                                                                   您的浏览器不支持h5标签,请升级或换个浏览器
		                   </video>
		                </div>
		                <!--控制器-->
		                <div class="controls">
		                	<!--进度条容器-->
		                    <div id="pBar">
		                    	<!--进度条底色-->
		                        <div class="pBar_bj">
		                        	<!--缓冲的进度条-->
		                            <div id="buff"></div>
		                        	<!--进度条动态-->
		                        	<div id="pBar_move">
		                            	<!--进度条按钮-->
		                        		<div id="pBtn"></div>
		                            </div>
		                        </div>
		                    </div>
		                    <!--展厅播放快进快退音量全屏-->
		                    <div class="trol_list">
		                    	<!--暂停和快进快退-->
		                        <div class="list_1">
		                        	<i class="iconfont icon-kuaitui-copy" onClick="ktui()"></i>
		                            <i class="iconfont icon-zanting2" id="ztbf"></i>
		                            <i class="iconfont icon-kuaijin" onClick="kjin()"></i>
		                        </div>
		                        <!--音量-->
		                        <div class="voice">
		                        	<i class="iconfont icon-yinliang" style="float:left;"></i>
		                            <div class="voicep">
		                            	<div id="vBar">
		                                	<div id="vBar_in"></div>
		                                </div>
		                                <div id="vBtn"></div>
		                            </div>
		                        </div>
		                        <!--时间-->
		                        <div class="vtime">
		                        	<font id="nTime">00:00:00</font>/<em id="aTime">00:00:00</em>
		                        </div>
		                        <!--全屏-->
		                        <i id="qp" class="iconfont icon-quanping"></i>
		                    </div>
		                </div> 
		            </div>
		        </div>
		    </div>
		<div class="">
		  <div class="pinlun">
		  <textarea name="" rows="" cols="" id="text" width="80%"></textarea>
	      <input type="button" class="send" id="send"  width="20%"value="评论" />
		 </div>
		  <div class="pinlunInfo">
		    <div class="info"> 
		      <p>评论者：<span>大壮</span>&nbsp;&nbsp;&nbsp;&nbsp;2018-04-27 15:59:48</p>
		      <p>&nbsp;&nbsp;&nbsp;&nbsp;很好看的电影，超级喜欢，很nice</p>
		   </div>
		  <div class="info"> 
		      <p>评论者：<span>大壮</span>&nbsp;&nbsp;&nbsp;&nbsp;2018-04-27 15:59:48</p>
		      <p>&nbsp;&nbsp;&nbsp;&nbsp;很好看的电影，超级喜欢，很nice</p>
		   </div>
		 </div>
		</div>
		
		</div>
		
	</div>
	
	<script src="http://cdn.bootcss.com/jquery/1.11.0/jquery.min.js" type="text/javascript"></script>
	<script>window.jQuery || document.write('<script src="js/jquery-1.11.0.min.js"><\/script>')</script>
<!-- 	<script type="text/javascript" src="js/vedio.js"></script> -->
	<script type="text/javascript">
	var shipinid=GetQueryString("id");
	var username='${sessionScope.userName }';
	var userid='<%=session.getAttribute("userId")%>';
	 function GetQueryString(name)

	   {

	        var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");

	        var r = window.location.search.substr(1).match(reg);

	        if(r!=null)return  unescape(r[2]); return null;

	   }
	 function loadpinglun(shipinid){
		 $.ajax({
				type:"post",
				url:"${pageContext.request.contextPath}/ction/selectPinglun",
				data:{"shipinid":shipinid},
				error:function(){},
		    	timeout:1000,
				success:function(data){
					var html='';
				
					for(var i=0;i<data.length;i++){
		   				 html+='<div class="info"> '
				      +'<p>评论者：<span>'+data[i].username+'</span>&nbsp;&nbsp;&nbsp;&nbsp;'+data[i].shijian+'</p>'
				      +'<p>&nbsp;&nbsp;&nbsp;&nbsp;'+data[i].neirong+'</p>'
				      +'</div>';
				}
					$(".pinlunInfo").html(html);
			  }
			});
	 }
	 
	$(function(){
		var xzdz="";
		/*获取控制对象*/	
		var vids=document.getElementById("vids");
		var guanggao=document.getElementById("testvids");
		var sskd=$(".controls").width();/*替换原来的764*/
		var guanggaolist;
			$.ajax({
				type:"post",
				url:"${pageContext.request.contextPath}/ction/selecShipinByid",
				data:{"id":shipinid},
				error:function(){},
		    	timeout:1000,
				success:function(data){
					var shipin=data.shipin;
				    guanggaolist=data.guanggaolist;
					if(shipin){
						$("#title").html(shipin.title);
						$(".title_top").html(shipin.title);
						xzdz="../data/"+shipin.url;
						vids.src=xzdz;
					}
				}
			});
			loadpinglun(shipinid);
			$("#send").click(function(){
				var neirong=$("#text").val();
				if(neirong==""){
					alert("请填写评论信息");
					return false;
				}
				$.ajax({
					type:"post",
					url:"${pageContext.request.contextPath}/ction/insertPinglun",
					data:{"shipinid":shipinid,"userid":userid,"neirong":neirong},
					error:function(){},
			    	timeout:1000,
					success:function(data){
						loadpinglun(shipinid);
						$("#text").val("");
					}
				});
			});
			
			
			
			/*一开始默认的视频路径（每个页面都会有一个默认的视频吧）*/

			/*点击右边的话替换左边视频的地址链接以及替换播放器的名字*/
			$(".one_tb").click(function(){
				$(this).addClass("on").siblings(".one_tb").removeClass("on");
				var hName=$(this).find("h3").html();
				var vid_src=$(this).attr("vid_src");
				
				vids.src=vid_src+xzdz;
				vids.play();
				})
			/*点击暂停图标的时候*/		
			$("#pass").click(function(){
				$(this).css({display:"none"});
				$("#ztbf").attr("class","iconfont icon-zanting")
				vids.play();
				});
			/*点击控制按钮里面的暂停图标的时候*/	
			$("#ztbf").click(function(){	
				if(vids.paused){
					vids.play();
					$("#ztbf").attr("class","iconfont icon-zanting")
					}else{
						vids.pause();
						$("#ztbf").attr("class","iconfont icon-zanting2")
						}
			})
			/*不论任何途径只要是暂停或者播放*/
			vids.onplay=function(){
				$("#pass").css({display:"none"});
				$("#ztbf").attr("class","iconfont icon-zanting");
				}
			vids.onpause=function(){
				$("#pass").css({display:"block"});
				$("#ztbf").attr("class","iconfont icon-zanting2");
				$("#pBar").on('mouseup',function(){
						$(this).off('mousemove')
						})
				}
			/*时间转换器*/
			function numFormat(time){
			    time = parseInt(time);
			   
			    var h = addZero(Math.floor(time/3600));
			    var  m = addZero(Math.floor((time%3600)/60));
			    var s = addZero(Math.floor(time%60));
			    return h+":"+m+":"+s;
			}
			function addZero(num){
			    if(num<10){
			        return "0"+num;
			    }else{
			        return ''+num;
			    }
			}
			/*当前时间/总的时间(canplay方法开始)*/
			vids.oncanplay=function(){
			var aTime=numFormat(vids.duration);
			$("#aTime").html(aTime);
			/*第一步,进度条跟着时间动(鼠标点下的时候)*/
			vids.ontimeupdate=function(){
				sskd=$(".controls").width()
				var hc=(vids.buffered.end(0)/vids.duration)*sskd;
				$("#buff").css({width:hc+'px'})
				var nTime=numFormat(vids.currentTime);
				$("#nTime").html(nTime);
				/*当前的时间比上总的时间乘以总的长度*/
				var nLengh=(vids.currentTime/vids.duration)*(sskd-20);
				$("#pBar_move").css({width:nLengh+'px'});
				
				addguanggao(vids.currentTime);
				
				
				}
	     guanggao.addEventListener("ended",function(){
		         $(".div").css("display","none");
		         vids.play();
		 });
		$(".guanbiguanggao").click(function(){
			if(username==""){
				 if(confirm('未登录不能跳过广告，是否去登录??')){
					 location.href = '${pageContext.request.contextPath}/login.html';
				}
				
			}else{
				$(".div").css("display","none");
				guanggao.src= "";
				vids.play();
			}
			
			
		});
		function addguanggao(time){
			if(guanggaolist.length>0){
				for(var i=0;i<guanggaolist.length;i++){
					console.log(parseInt(time*4));
					console.log("+++"+guanggaolist[i].kaiboshiduan*4);
					if(parseInt(time*4)==guanggaolist[i].kaiboshiduan*4){
						vids.pause();
						$(".div").css("display","block");
						guanggao.src= "../data/"+guanggaolist[i].url;
					}
				}
			}	
		}
		
			/*第二步,点击时的进度条*/
			$("#pBar").mousedown(function(e){
				var cLk=e.clientX;/*点击距离(点击在进度条区域)*/
				var pJl=$("#pBar").offset().left;/*获取进度条距离左边的距离*/	
				var mLengh=cLk-pJl;/*移动的距离*/
				if(mLengh>=(sskd-20)){
					mLengh=(sskd-20)
					}
				$("#pBar_move").css({width:mLengh+'px'});/*改变进度条的距离*/
				var cTime1=mLengh/(sskd-20)*vids.duration;
				vids.currentTime=cTime1;
				var cTime2=numFormat(cTime1);
				$("#nTime").html(cTime2);/*改变html的显示时间*/
				vids.play();
			/*---------------------------------鼠标拖拽的距离---------------------------------------*/
				$(document).on('mousemove',function(e){
					vids.pause();
					var newLeft=e.clientX-pJl;/*拖拽的距离*/
					if(newLeft<=0){
			            newLeft=0;
			        }
					if(newLeft>=(sskd-20)){
						newLeft=(sskd-20)
						}
					var cTime3=newLeft/(sskd-20)*vids.duration;
					var cTime4=numFormat(cTime3);
					$("#pBar_move").css({width:newLeft+'px'});
					vids.currentTime=cTime3;
					$("#nTime").html(cTime4);
					})/*拖拽结束*/
			/*----------------------------------鼠标松开----------------------------------------*/
					$("body").on('mouseup',function(){
						$(document).off('mousemove');
						vids.play();
						})/*松开结束*/
				})/*mousedown方法结束*/
			}/*(canplay方法结束)*/
			/*----------------------------------快进快退(点击html的时候)----------------------------------*/	
			function ktui(){
				vids.currentTime-=10;
			}
			function kjin(){
				vids.currentTime+=10;
			}
			/*----------------------------------快进快退(点击键盘的时候)----------------------------------*/
			$(document).keydown(function (event) {
				if (event.keyCode===37){
					vids.currentTime-=10;
				}
				if (event.keyCode===39){
					vids.currentTime+=10;
				}
				/*----暂停播放(点击键盘空格的时候)----*/
				if (event.keyCode===32){
					if(vids.paused){
					vids.play()
					$("#ztbf").attr("class","iconfont icon-zanting")
					}else{
						vids.pause()
						$("#ztbf").attr("class","iconfont icon-zanting2")
						}
				}
				/*-----------退出全屏-----------*/
				if (event.keyCode===27){
					$(".video_ls").removeClass("on");
					$(".controls").css({width:"764px"})
				}
			})
			/*鼠标双击事件(双击播放器然后全屏)*/
			$(".video_ls").dblclick(function(){
				$(".video_ls").addClass("on");
				var oBox=$("body").width()-66;
				$(".controls").css({width:oBox+'px'})
			});
			/*全屏播放按钮*/
			$("#qp").click(function(){
				if($(".video_ls").hasClass("on")){
					$(".video_ls").removeClass("on");
					$(".controls").css({width:"764px"})
					}else{
						$(".video_ls").addClass("on");
						var oBox=$("body").width()-66;
						$(".controls").css({width:oBox+'px'})
						}
			})	
			/*收藏*/
			$("#like").click(function(){
				if($(this).hasClass("on")){
					$(this).removeClass("on")
					}else{
						$(this).addClass("on")
						}
				})
			/*点赞*/
			$("#zan").click(function(){
				if($(this).hasClass("on")){
					$(this).removeClass("on")
					}else{
						$(this).addClass("on")
						}
				})
			/*音量加减*/
			vBtn.onmousedown = function(ev){
			    var ev=ev||window.event;
			    var xs=ev.clientX - this.offsetLeft;
			    document.onmousemove = function(ev){
			        var newLefts=ev.clientX-xs;
			        if(newLefts<=0){
			            newLefts=0;
			        }else if(newLefts>=vBar.offsetWidth-vBtn.offsetWidth){
			            newLefts=vBar.offsetWidth-vBtn.offsetWidth;
			        }
			        vBtn.style.left=newLefts+"px";
			        vBar_in.style.width =(newLefts+8)+"px";
			        var prop=newLefts/(vBar.offsetWidth-vBtn.offsetWidth);
			        vids.volume =prop;
			        //静音改变音量图标
			        if(!vids.volume){
			            icon.style.backgroundImage="url(images/iconb.png)"
			        }else{
			            icon.style.backgroundImage="url(images/icona.png)"
			        }
			    }
				document.onmouseup = function(){
				document.onmousemove = null;
				document.onmouseup = null;
			    }
			}	

		});
	</script>
</body>
</html>