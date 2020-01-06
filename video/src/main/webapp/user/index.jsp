<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>

    <!-- Basic Page Needs
  ================================================== -->
	<meta charset="utf-8">
	<title>视频首页</title>
	<meta name="description" content="Free Responsive Html5 Css3 Templates | zerotheme.com">
	<meta name="author" content="www.zerotheme.com">
	
    <!-- Mobile Specific Metas
  ================================================== -->
	<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
    
    <!-- CSS
  ================================================== -->
  	<link rel="stylesheet" href="${pageContext.request.contextPath}/user/css/zerogrid.css">
	<link rel="stylesheet" href="${pageContext.request.contextPath}/user/css/style.css">
	<link rel="stylesheet" href="${pageContext.request.contextPath}/user/css/menu.css">
	<!-- Owl Carousel Assets -->
	<link href="${pageContext.request.contextPath}/user/css/owl.carousel.css" rel="stylesheet">
    <link href="${pageContext.request.contextPath}/user/css/owl.theme.css" rel="stylesheet">
	<!-- Custom Fonts -->
    <link href="${pageContext.request.contextPath}/user/font-awesome/css/font-awesome.min.css" rel="stylesheet" type="text/css">
	<style type="text/css">
	.active{background-color:red;}
	
	</style>
	<!--[if lt IE 8]>
       <div style=' clear: both; text-align:center; position: relative;'>
         <a href="http://windows.microsoft.com/en-US/internet-explorer/products/ie/home?ocid=ie6_countdown_bannercode">
           <img src="http://storage.ie6countdown.com/assets/100/images/banners/warning_bar_0000_us.jpg" border="0" height="42" width="820" alt="You are using an outdated browser. For a faster, safer browsing experience, upgrade for free today." />
        </a>
      </div>
    <![endif]-->
    <!--[if lt IE 9]>
		<script src="js/html5.js"></script>
		<script src="js/css3-mediaqueries.js"></script>
	<![endif]-->
    
</head>
<script type="text/javascript" src="${pageContext.request.contextPath}/js/jquery.min.js"></script>
<script type="text/javascript" src="${pageContext.request.contextPath}/js/jquery.form.js"></script>
<script type="text/javascript">
$(function(){
	loadList(1,"","");
	var $doc = $(document);
	var type="";
	
	 $doc.delegate('.ye','click',function(event){
		var name= $("#searchtxt").val();
		 loadList($(this).html(),name,type);
	 });
	 $(".type").click(function(){
		 type=$(this).attr("data-id");
		 var name= $("#searchtxt").val();
		 loadList(1,name,type);
	 });
	 $("#search").click(function(){
		
		 var name= $("#searchtxt").val();
		 loadList(1,name,type);
	 });
});	


function loadList(page,name,type){
	 $.ajax({
	   		url :"${pageContext.request.contextPath}/ction/selectShipinBynameAndtype",
	   		data:{"name":name,"type":type},
	   		type : 'post',
	   		success : function(data) {
	   			var  hmtl="";
	   			var start=(page-1)*16;
	   			
	   			var end=start+16;
	   			if(end>data.length){
	   				end=data.length;
	   			}
	   			for(var i=start;i<end;i++){
	   				var htmlhead='<div class="header"><h2>视频列表</h2></div>';
	   				$("#center_frame").html("");
					var head='<div class="row">';
					var html='';
					var size=data.length;
						if(i==0){
							html=head+html;
						}
						if(i%4==0&&i!=0){
							$("#center_frame").append(html+"</div>");
							html=head;
						}
						
						hmtl+='<div class="col-1-4">'
							+'<div class="wrap-col">'
							+'<div class="wrap-vid">'
							+'<div class="zoom-container">'
							+'	<a href="../admin/shipin.jsp?id='+data[i].id+'">'
							+'		<span class="zoom-caption">'
							+'			<i class="icon-play fa fa-play"></i>'
							+'		</span>'
							+'		<img src="${pageContext.request.contextPath}/user/images/1.jpg" />'
							+'	</a>'
							+'</div>'
							+'<h3 class="vid-name"><a href="#">'+data[i].title+'</a></h3>'
							+'<div class="info">'
							+'	<h5>By <a href="#">Kelvin</a></h5>'
							+'	<span><i class="fa fa-calendar"></i>'+data[i].riqi+'</span> '
							+'	<span><i class="fa fa-heart"></i>1,200</span>'
							+'</div>'
							+'</div></div></div>';
						
						if(i==(size-1)){
							$("#center_frame").append(html+"</div>");
							
						}			 
				}
					
	   			$("#shipinlist").html("");
	   			$("#shipinlist").append(htmlhead+hmtl);
	   			var size=data.length;
	   			var pages=1;
	   			if(size>16){
	   				pages=size/16+1;
	   			}
	   			
	   			var htmlpage="";
	   			for(var i=1;i<=pages;i++){
	   				if(page==i){
	   					htmlpage+=" <li ><a class='ye active'>"+i+"</a></li>"
	   				}else{
	   					htmlpage+="<li><a class='ye'>"+i+"</a></li>"
	   				}
	   				
	   			}
	   			$("#yeshu").html("");
	   			$("#yeshu").append(htmlpage);
	   		},
	   		error : function(msg) {
	   		},
	   	});


	 }

</script>
<body id="wrapper" >
<div class="wrap-body">
	
	<!--////////////////////////////////////Header-->
	<header>
		<div class="wrap-header">
			<div class="zerogrid">
				<div class="row">
					<a href="#" class="logo"><img src="${pageContext.request.contextPath}/user/images/logo.png" /></a>
					<ul class="quick-link">
					
						<li><a href="${pageContext.request.contextPath}/login.html" title="Log in"><i class="fa fa-user"></i></a></li>
						
					</ul>
					
				</div>
			</div>
		</div>
		
    </header>
	<!--////////////////////////////////////Menu-->
	<a href="#" class="nav-toggle">Toggle Navigation</a>
    <nav class="cmn-tile-nav">
		<ul class="clearfix">
			<li class="colour-1 type" data-id="警匪"><a >警匪</a></li>
			<li class="colour-2 type" data-id="悬疑"><a >悬疑</a></li>
			<li class="colour-3 type" data-id="恐怖"><a >恐怖</a></li>
			<li class="colour-4 type" data-id="惊悚"><a  data-id="惊悚">惊悚</a></li>
			<li class="colour-5 type" data-id="武侠"><a  data-id="武侠">武侠</a></li>
			<li class="colour-6 type" data-id="古装"><a  data-id="古装">古装</a></li>
			<li class="colour-7 type" data-id="爱情"><a  data-id="爱情">爱情</a></li>
			<li class="colour-8 type" data-id="喜剧"><a data-id="喜剧">喜剧</a></li>
		</ul>
    </nav>
	<!--////////////////////////////////////Container-->
	<section id="container" class="index-page">
		<div class="wrap-container zerogrid">
			<div class="row">
				<div id="main-content" class="col-2-3">
					<section class="all" id="shipinlist">
						<div class="header">
							<h2>视频列表</h2>
						</div>
						<div class="row">
							<div class="col-1-4">
								<div class="wrap-col">
									<div class="wrap-vid">
										<div class="zoom-container">
											<a href="single.html">
												<span class="zoom-caption">
													<i class="icon-play fa fa-play"></i>
												</span>
												<img src="${pageContext.request.contextPath}/user/images/1.jpg" />
											</a>
										</div>
										<h3 class="vid-name"><a href="#">Video's Name</a></h3>
										<div class="info">
											<h5>By <a href="#">Kelvin</a></h5>
											<span><i class="fa fa-calendar"></i>25/3/2015</span> 
											<span><i class="fa fa-heart"></i>1,200</span>
										</div>
									</div>
								</div>
							</div>
							<div class="col-1-4">
								<div class="wrap-col">
									<div class="wrap-vid">
										<div class="zoom-container">
											<a href="single.html">
												<span class="zoom-caption">
													<i class="icon-play fa fa-play"></i>
												</span>
												<img src="${pageContext.request.contextPath}/user/images/2.jpg" />
											</a>
										</div>
										<h3 class="vid-name"><a href="#">Video's Name</a></h3>
										<div class="info">
											<h5>By <a href="#">Kelvin</a></h5>
											<span><i class="fa fa-calendar"></i>25/3/2015</span> 
											<span><i class="fa fa-heart"></i>1,200</span>
										</div>
									</div>
								</div>
							</div>
							<div class="col-1-4">
								<div class="wrap-col">
									<div class="wrap-vid">
										<div class="zoom-container">
											<a href="single.html">
												<span class="zoom-caption">
													<i class="icon-play fa fa-play"></i>
												</span>
												<img src="${pageContext.request.contextPath}/user/images/3.jpg" />
											</a>
										</div>
										<h3 class="vid-name"><a href="#">Video's Name</a></h3>
										<div class="info">
											<h5>By <a href="#">Kelvin</a></h5>
											<span><i class="fa fa-calendar"></i>25/3/2015</span> 
											<span><i class="fa fa-heart"></i>1,200</span>
										</div>
									</div>
								</div>
							</div>
							<div class="col-1-4">
								<div class="wrap-col">
									<div class="wrap-vid">
										<div class="zoom-container">
											<a href="single.html">
												<span class="zoom-caption">
													<i class="icon-play fa fa-play"></i>
												</span>
												<img src="${pageContext.request.contextPath}/user/images/4.jpg" />
											</a>
										</div>
										<h3 class="vid-name"><a href="#">Video's Name</a></h3>
										<div class="info">
											<h5>By <a href="#">Kelvin</a></h5>
											<span><i class="fa fa-calendar"></i>25/3/2015</span> 
											<span><i class="fa fa-heart"></i>1,200</span>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div class="row">
							<div class="col-1-4">
								<div class="wrap-col">
									<div class="wrap-vid">
										<div class="zoom-container">
											<a href="single.html">
												<span class="zoom-caption">
													<i class="icon-play fa fa-play"></i>
												</span>
												<img src="${pageContext.request.contextPath}/user/images/5.jpg" />
											</a>
										</div>
										<h3 class="vid-name"><a href="#">Video's Name</a></h3>
										<div class="info">
											<h5>By <a href="#">Kelvin</a></h5>
											<span><i class="fa fa-calendar"></i>25/3/2015</span> 
											<span><i class="fa fa-heart"></i>1,200</span>
										</div>
									</div>
								</div>
							</div>
							<div class="col-1-4">
								<div class="wrap-col">
									<div class="wrap-vid">
										<div class="zoom-container">
											<a href="single.html">
												<span class="zoom-caption">
													<i class="icon-play fa fa-play"></i>
												</span>
												<img src="${pageContext.request.contextPath}/user/images/14.jpg" />
											</a>
										</div>
										<h3 class="vid-name"><a href="#">Video's Name</a></h3>
										<div class="info">
											<h5>By <a href="#">Kelvin</a></h5>
											<span><i class="fa fa-calendar"></i>25/3/2015</span> 
											<span><i class="fa fa-heart"></i>1,200</span>
										</div>
									</div>
								</div>
							</div>
							<div class="col-1-4">
								<div class="wrap-col">
									<div class="wrap-vid">
										<div class="zoom-container">
											<a href="single.html">
												<span class="zoom-caption">
													<i class="icon-play fa fa-play"></i>
												</span>
												<img src="${pageContext.request.contextPath}/user/images/1.jpg" />
											</a>
										</div>
										<h3 class="vid-name"><a href="#">Video's Name</a></h3>
										<div class="info">
											<h5>By <a href="#">Kelvin</a></h5>
											<span><i class="fa fa-calendar"></i>25/3/2015</span> 
											<span><i class="fa fa-heart"></i>1,200</span>
										</div>
									</div>
								</div>
							</div>
							<div class="col-1-4">
								<div class="wrap-col">
									<div class="wrap-vid">
										<div class="zoom-container">
											<a href="single.html">
												<span class="zoom-caption">
													<i class="icon-play fa fa-play"></i>
												</span>
												<img src="${pageContext.request.contextPath}/user/images/2.jpg" />
											</a>
										</div>
										<h3 class="vid-name"><a href="#">Video's Name</a></h3>
										<div class="info">
											<h5>By <a href="#">Kelvin</a></h5>
											<span><i class="fa fa-calendar"></i>25/3/2015</span> 
											<span><i class="fa fa-heart"></i>1,200</span>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div class="row">
							<div class="col-1-4">
								<div class="wrap-col">
									<div class="wrap-vid">
										<div class="zoom-container">
											<a href="single.html">
												<span class="zoom-caption">
													<i class="icon-play fa fa-play"></i>
												</span>
												<img src="${pageContext.request.contextPath}/user/images/3.jpg" />
											</a>
										</div>
										<h3 class="vid-name"><a href="#">Video's Name</a></h3>
										<div class="info">
											<h5>By <a href="#">Kelvin</a></h5>
											<span><i class="fa fa-calendar"></i>25/3/2015</span> 
											<span><i class="fa fa-heart"></i>1,200</span>
										</div>
									</div>
								</div>
							</div>
							<div class="col-1-4">
								<div class="wrap-col">
									<div class="wrap-vid">
										<div class="zoom-container">
											<a href="single.html">
												<span class="zoom-caption">
													<i class="icon-play fa fa-play"></i>
												</span>
												<img src="${pageContext.request.contextPath}/user/images/4.jpg" />
											</a>
										</div>
										<h3 class="vid-name"><a href="#">Video's Name</a></h3>
										<div class="info">
											<h5>By <a href="#">Kelvin</a></h5>
											<span><i class="fa fa-calendar"></i>25/3/2015</span> 
											<span><i class="fa fa-heart"></i>1,200</span>
										</div>
									</div>
								</div>
							</div>
							<div class="col-1-4">
								<div class="wrap-col">
									<div class="wrap-vid">
										<div class="zoom-container">
											<a href="single.html">
												<span class="zoom-caption">
													<i class="icon-play fa fa-play"></i>
												</span>
												<img src="${pageContext.request.contextPath}/user/images/5.jpg" />
											</a>
										</div>
										<h3 class="vid-name"><a href="#">Video's Name</a></h3>
										<div class="info">
											<h5>By <a href="#">Kelvin</a></h5>
											<span><i class="fa fa-calendar"></i>25/3/2015</span> 
											<span><i class="fa fa-heart"></i>1,200</span>
										</div>
									</div>
								</div>
							</div>
							<div class="col-1-4">
								<div class="wrap-col">
									<div class="wrap-vid">
										<div class="zoom-container">
											<a href="single.html">
												<span class="zoom-caption">
													<i class="icon-play fa fa-play"></i>
												</span>
												<img src="${pageContext.request.contextPath}/user/images/14.jpg" />
											</a>
										</div>
										<h3 class="vid-name"><a href="#">Video's Name</a></h3>
										<div class="info">
											<h5>By <a href="#">Kelvin</a></h5>
											<span><i class="fa fa-calendar"></i>25/3/2015</span> 
											<span><i class="fa fa-heart"></i>1,200</span>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div class="row">
							<div class="col-1-4">
								<div class="wrap-col">
									<div class="wrap-vid">
										<div class="zoom-container">
											<a href="single.html">
												<span class="zoom-caption">
													<i class="icon-play fa fa-play"></i>
												</span>
												<img src="${pageContext.request.contextPath}/user/images/1.jpg" />
											</a>
										</div>
										<h3 class="vid-name"><a href="#">Video's Name</a></h3>
										<div class="info">
											<h5>By <a href="#">Kelvin</a></h5>
											<span><i class="fa fa-calendar"></i>25/3/2015</span> 
											<span><i class="fa fa-heart"></i>1,200</span>
										</div>
									</div>
								</div>
							</div>
							<div class="col-1-4">
								<div class="wrap-col">
									<div class="wrap-vid">
										<div class="zoom-container">
											<a href="single.html">
												<span class="zoom-caption">
													<i class="icon-play fa fa-play"></i>
												</span>
												<img src="${pageContext.request.contextPath}/user/images/2.jpg" />
											</a>
										</div>
										<h3 class="vid-name"><a href="#">Video's Name</a></h3>
										<div class="info">
											<h5>By <a href="#">Kelvin</a></h5>
											<span><i class="fa fa-calendar"></i>25/3/2015</span> 
											<span><i class="fa fa-heart"></i>1,200</span>
										</div>
									</div>
								</div>
							</div>
							<div class="col-1-4">
								<div class="wrap-col">
									<div class="wrap-vid">
										<div class="zoom-container">
											<a href="single.html">
												<span class="zoom-caption">
													<i class="icon-play fa fa-play"></i>
												</span>
												<img src="${pageContext.request.contextPath}/user/images/3.jpg" />
											</a>
										</div>
										<h3 class="vid-name"><a href="#">Video's Name</a></h3>
										<div class="info">
											<h5>By <a href="#">Kelvin</a></h5>
											<span><i class="fa fa-calendar"></i>25/3/2015</span> 
											<span><i class="fa fa-heart"></i>1,200</span>
										</div>
									</div>
								</div>
							</div>
							<div class="col-1-4">
								<div class="wrap-col">
									<div class="wrap-vid">
										<div class="zoom-container">
											<a href="single.html">
												<span class="zoom-caption">
													<i class="icon-play fa fa-play"></i>
												</span>
												<img src="${pageContext.request.contextPath}/user/images/4.jpg" />
											</a>
										</div>
										<h3 class="vid-name"><a href="#">Video's Name</a></h3>
										<div class="info">
											<h5>By <a href="#">Kelvin</a></h5>
											<span><i class="fa fa-calendar"></i>25/3/2015</span> 
											<span><i class="fa fa-heart"></i>1,200</span>
										</div>
									</div>
								</div>
							</div>
						</div>
					</section>
					<div class="navigation">
						<ul id="yeshu">
							<li><a href="#"><</a></li>
							<li><a href="#">1</a></li>
							<li><a href="#">2</a></li>
							<li><a href="#">3</a></li>
							<li><a href="#">4</a></li>
							<li><a href="#">></a></li>
						</ul>
					</div>
				</div>
				<div id="sidebar" class="col-1-3">
					<form id="form-container" action="">
						<!--<input type="submit" id="searchsubmit" value="" />-->
						<a class="search-submit-button" href="javascript:void(0)">
							<i class="fa fa-search" id="search"></i>
						</a>
						<div id="searchtext">
							<input type="text" id="searchtxt" name="s" placeholder="搜索">
						</div>
					</form>
					<!---- Start Widget ---->
					<div class="widget wid-post">
						<div class="wid-header">
							<h5>最新视频</h5>
						</div>
						<div class="wid-content">
							<div class="post wrap-vid">
								<div class="zoom-container">
									<a href="single.html">
										<span class="zoom-caption">
											<i class="icon-play fa fa-play"></i>
										</span>
										<img src="${pageContext.request.contextPath}/user/images/4.jpg" />
									</a>
								</div>
								<div class="wrapper">
									<h5 class="vid-name"><a href="#">Video's Name</a></h5>
									<div class="info">
										<h6>By <a href="#">Kelvin</a></h6>
										<span><i class="fa fa-calendar"></i>25/3/2015</span> 
										<span><i class="fa fa-heart"></i>1,200</span>
									</div>
								</div>
							</div>
							<div class="post wrap-vid">
								<div class="zoom-container">
									<a href="single.html">
										<span class="zoom-caption">
											<i class="icon-play fa fa-play"></i>
										</span>
										<img src="${pageContext.request.contextPath}/user/images/14.jpg" />
									</a>
								</div>
								<div class="wrapper">
									<h5 class="vid-name"><a href="#">Video's Name</a></h5>
									<div class="info">
										<h6>By <a href="#">Kelvin</a></h6>
										<span><i class="fa fa-calendar"></i>25/3/2015</span> 
										<span><i class="fa fa-heart"></i>1,200</span>
									</div>
								</div>
							</div>
							<div class="post wrap-vid">
								<div class="zoom-container">
									<a href="single.html">
										<span class="zoom-caption">
											<i class="icon-play fa fa-play"></i>
										</span>
										<img src="${pageContext.request.contextPath}/user/images/3.jpg" />
									</a>
								</div>
								<div class="wrapper">
									<h5 class="vid-name"><a href="#">Video's Name</a></h5>
									<div class="info">
										<h6>By <a href="#">Kelvin</a></h6>
										<span><i class="fa fa-calendar"></i>25/3/2015</span> 
										<span><i class="fa fa-heart"></i>1,200</span>
									</div>
								</div>
							</div>
						</div>
					</div>
					<!---- Start Widget ---->
					<div class="widget wid-news">
						<div class="wid-header">
							<h5>热门视频</h5>
						</div>
						<div class="wid-content">
							<div class="row">
								<div class="wrap-vid">
									<div class="zoom-container">
										<a href="single.html">
											<span class="zoom-caption">
												<i class="icon-play fa fa-play"></i>
											</span>
											<img src="${pageContext.request.contextPath}/user/images/1.jpg" />
										</a>
									</div>
									<h3 class="vid-name">Video's Name</h3>
									<div class="info">
										<h5>By <a href="#">Kelvin</a></h5>
										<span><i class="fa fa-calendar"></i>25/3/2015</span> 
										<span><i class="fa fa-heart"></i>1,200</span>
									</div>
								</div>
							</div>
							
							
						</div>
					</div>
				</div>
			</div>
		</div>
	</section>
	

	<!-- Slider -->
	<script src="${pageContext.request.contextPath}/user/js/jquery-2.1.1.js"></script>
	<script src="${pageContext.request.contextPath}/user/js/demo.js"></script>
	<!-- Search -->
	<script src="${pageContext.request.contextPath}/user/js/modernizr.custom.js"></script>
	<script src="${pageContext.request.contextPath}/user/js/classie.js"></script>
	<script src="${pageContext.request.contextPath}/user/js/uisearch.js"></script>
	<script>
		new UISearch( document.getElementById( 'sb-search' ) );
	</script>
	<!-- Carousel -->
	<script src="js/owl.carousel.js"></script>
    <script>
    $(document).ready(function() {

      $("#owl-demo-1").owlCarousel({
        items : 4,
        lazyLoad : true,
        navigation : true
      });
	  $("#owl-demo-2").owlCarousel({
        items : 4,
        lazyLoad : true,
        navigation : true
      });

    });
    </script>
</div>
</body></html>