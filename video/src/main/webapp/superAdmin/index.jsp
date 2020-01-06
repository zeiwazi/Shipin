<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>教师教学评价系统</title>
<!-- jQuery文件。务必在bootstrap.min.js 之前引入 -->
<script src="//cdn.bootcss.com/jquery/1.11.3/jquery.min.js"></script>
<link rel="stylesheet" href="//cdn.bootcss.com/bootstrap/3.3.5/css/bootstrap.min.css">
<script src="//cdn.bootcss.com/bootstrap/3.3.5/js/bootstrap.min.js"></script>

<!-- bootstrap table   -->
<link href="https://cdn.bootcss.com/bootstrap-table/1.12.1/bootstrap-table.min.css" rel="stylesheet">
<script src="https://cdn.bootcss.com/bootstrap-table/1.12.1/bootstrap-table.js"></script>
<script src="https://cdn.bootcss.com/bootstrap-table/1.12.1/locale/bootstrap-table-zh-CN.js"></script>
    <script src="https://cdn.bootcss.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>
<link href="${pageContext.request.contextPath}/css/style.css" rel="stylesheet">
</head>
<body>、
<%	
session.setAttribute("name","fudaoqingkuang.jsp");
%>

<% 
String path = request.getContextPath(); 
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/"; 
String name = request.getParameter("url");//用request得到 
%> 
 <%@ include file="header.jsp"%>   
   <div class="container-fluid">
      <div class="row">
      
		 <%@ include file="left.jsp"%>  
		 
         <div class="col-sm-9 col-sm-offset-3 col-md-10 col-md-offset-2 main">

		 <iframe src="welcome.jsp"  height="1000px" name="frame" width="100%"  frameborder="0" id="frame"></iframe>
		 
        </div>
      </div>
    </div>
</body>
<script>
$(function(){
	var username='${sessionScope.userName }';
	if(username==""){
		location.href = '${pageContext.request.contextPath}/login.html';
	}
	
});


function setIframeHeight(iframe) {
	if (iframe) {
		var iframeWin = iframe.contentWindow || iframe.contentDocument.parentWindow;
		if (iframeWin.document.body) {
			iframe.height = iframeWin.document.documentElement.scrollHeight || iframeWin.document.body.scrollHeight;
		}
	}
};

window.onload = function () {
	setIframeHeight(document.getElementById('external-frame'));
};

</script>
    
</html>