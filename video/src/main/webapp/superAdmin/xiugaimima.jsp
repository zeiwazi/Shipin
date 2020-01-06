<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>修改密码</title>
<script type="text/javascript" src="${pageContext.request.contextPath}/easyui/jquery.min.js"></script>
<script type="text/javascript" src="${pageContext.request.contextPath}/easyui/jquery.easyui.min.js"></script>
<script type="text/javascript" src="${pageContext.request.contextPath}/easyui/easyui-lang-zh_CN.js"></script>
<script type="text/javascript" src="${pageContext.request.contextPath}/js/jquery.form.js"></script>
<link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/easyui/easyui.css" />
<link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/easyui/icon.css" />
 <style type="text/css">
 </style>

 <script type="text/javascript">

 
 $(function(){
	
	var username= '<%=session.getAttribute("userName")%>';
	var userid='<%=session.getAttribute("userId")%>';
	$("#next").click(function(){
		var password=$("#password").val();
		if(password==""){
			alert("密码不能为空请填写密码");
			return false;
		}
		$.ajax({
			type:"post",
			url:"${pageContext.request.contextPath}/ction/updatepassword",
			data:{"id":userid,"password":password},
			error:function(){},
	    	timeout:1000,
			success:function(data){
				if(data){
					alert("修改成功");
				}else{
					alert("修改失败");
				}
			}
		});
	});	 

	});

</script>
</head>
<body>
<h2>修改密码</h2>

<p><input type="password" id="password" value="" placeholder="新密码" /></p>
				
<p><input type="button" id="next" class="next action-button" value="确认修改" /></p>

</body>
</html>