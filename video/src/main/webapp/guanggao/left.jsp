<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>Insert title here</title>
<style type="text/css">
	.li{
		background-color: #428bca;
		
	}
.sidebar{background-color: #428bca;}
.actives{
background-color: #eee;
color: #428bca;
}
.actives a{

color: #428bca;
}
a{color:white;}
</style>
</head>
<body>
        <div class="col-sm-3 col-md-2 sidebar">
          <ul class="nav nav-sidebar">
            <li class="active"><a href="#" id="flag"></a></li>
          </ul>
          
          <ul class="nav nav-sidebar" id="ul">
           <li class="li"><a href="welcome.jsp" target="frame">首页</a></li>
           <li class="li"><a href="guanggaoshipinguanli.jsp" target="frame">广告视频管理</a></li>
           <li class="li"><a href="charuguanggaoguanli.jsp" target="frame">插入广告</a></li>
           <li class="li"><a href="xiugaimima.jsp" target="frame">账户管理</a></li>
          </ul>
        </div>
</body>
<script type="text/javascript" src="${pageContext.request.contextPath}/js/jquery.min.js"></script>
<script type="text/javascript">
var userId='${sessionScope.userId }';
	
	$(function(){
		var type='${sessionScope.type }';
		$("#flag").html(type+"登录");
		
		
		
		
		  var $doc = $(document);
			 
		$doc.delegate('.li','click',function(event){
			$('.li').removeClass("actives");
			$(this).addClass("actives");
		});
		
		
	});
</script>
</html>