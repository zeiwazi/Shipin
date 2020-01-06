<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html lang="zh">
<head>
	<meta charset="UTF-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1"> 
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>注册</title>
	<link rel='stylesheet prefetch' href='${pageContext.request.contextPath}/css/reset.css'>
	<link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/css/default.css">
	<link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/css/stylesr.css">
</head>
<body>
	
	<article class="htmleaf-content">
		<!-- multistep form -->
		<form id="msform">
			
			<fieldset>
				<h2 class="fs-title">创建你的账号</h2>
				<h3 class="fs-subtitle"> 管理员注册</h3>
				<input type="text" name="name" placeholder="名称" />
				<input type="password" name="password" value="" placeholder="密码" />
				<select name='sex' style="width: 100%;">
					 <option value="男">男</option>
					 <option value="女">女</option>
					</select>
				<input type="number" name="age" value=""  placeholder="年龄"/>
				<input type="text" name="address" value=""  placeholder="地址"/>
				<input type="text" name="phone" value=""  placeholder="电话"/>
				<input type="text" name="email" value=""  placeholder="邮箱"/>
				<input type="button" name="next" class="next action-button" value="注册" />
			</fieldset>
			
		</form>
	</article>
	
<script type="text/javascript" src="${pageContext.request.contextPath}/js/jquery.min.js"></script>
<script type="text/javascript" src="${pageContext.request.contextPath}/js/jquery.form.js"></script>
<script type="text/javascript">
$(function(){
	$('.next').click(function () {
		var	url='${pageContext.request.contextPath}/ction/insertAdmin';

		var opts = {};
		opts.url = url;
		opts.type = 'POST';
		opts.dataType = 'json';
		opts.data = {};
		opts.success = function(result){
			if(result){
				alert("注册成功！");
				location.href = '${pageContext.request.contextPath}/login.html';
				}else{
					alert("保存失败！");
					}
		};
		
	   $("#msform").ajaxSubmit(opts);
	});
});	
	</script>
</body>
</html>