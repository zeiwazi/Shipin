<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>广告视频管理</title>
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
	 var opts = {
				method : 'post',
				url:'${pageContext.request.contextPath}/ction/selectGuanggaoByname?name=',//提取所有
				nowrap : false,
				striped : true,
				fit : true,
				fitColumns : true,
				pagePosition :	'bottom',
				idField : 'uuid',
				loadMsg : '数据加载中,请稍后...',
				//rownumbers : true,
				showFooter : true,
				emptyMsg : "没有相关记录!!",
			    columns:[[    
			        {field:'type',title:'广告类型',align: 'center',width:120},   
			        {field:'title',title:'标题',align: 'center',width:120},    
			        {field:'jianjie',title:'简介',align: 'center',width:320}, 
			        {field:'url',title:'地址',align: 'center',width:320}, 
			        {field:'operator',title:'操作',align: 'center',width:120}    
			       
			    ]],
			    rowStyler : function(index,row){
			    	row.operator = [
                        '<a href="javascript:void(0);" name="btnedit" data-uuid="' + row.uuid +'" title="编辑" ><img src="${pageContext.request.contextPath}/images/edit.png" />编辑</a>',
						'<a href="javascript:void(0);" name="btnRemove" data-uuid="' + row.uuid +'" title="删除" ><img src="${pageContext.request.contextPath}/images/delete.png" />删除</a>'
					].join('');
			    },
			    toolbar : "#ttt",
				onLoadSuccess : function(result){
					
				}
		 };
		 $("#dataContent").datagrid(opts);

	
	$("#add").click(function(){
		
		var url='';
		if(flage=="insert"){
			url='${pageContext.request.contextPath}/ction/insertGuanggao';
		}else{
			url='${pageContext.request.contextPath}/ction/updateGuanggao';
		}

		var opts = {};
		opts.url = url;
		opts.type = 'POST';
		opts.dataType = 'json';
		opts.data = {};
		opts.success = function(result){
			if(result){
				alert("保存成功！");
				$('#dd').dialog('close');
				 $("#dataContent").datagrid('reload');
				}else{
					alert("保存失败！");
					}
		};
		
	   $("#formData").ajaxSubmit(opts);
		
		
	});	 
	var rowdata=null;
	var flage="insert";
	$('#dataContent').datagrid({
		onClickRow: function(rowIndex, rowData){
			rowdata=rowData;
		}
	});

	
    $("#close").click(function(){
    	
    	$('#dd').dialog('close');
	});	 
    
    var $doc = $(document);
	 //删除
	 $doc.delegate('[name=btnRemove]','click',function(event){
		 if(confirm('是否删这条视频记录吗??')){
		$.ajax({
			type:"post",
			url:"${pageContext.request.contextPath}/ction/deleteGuanggao",
			data:{"id":rowdata.id},
			error:function(){},
	    	timeout:1000,
			success:function(data){
				if(data){
					alert("删除成功");
					 $("#dataContent").datagrid('reload');
				}else{
					alert("删除失败");
				}
			}
		});
		 }
	 });
	
	$("#addFile").click(function(){
		flage="insert";
		$("input[name='title']").val("");
		$("input[name='jianjie']").val("");
		$("input[name='file']").val("");
	 $('#dd').dialog('open');
	});
	// 修改
	 $doc.delegate('[name=btnedit]','click',function(event){
		 flage="update";
		 $('#dd').dialog('open');
		 $("input[name='id']").val(rowdata.id);
		 $("input[name='title']").val(rowdata.title);
		 $("input[name='jianjie']").val(rowdata.jianjie);
		 $("input[name='type']").val(rowdata.type);
		 
		 
		 });
	
	
	$("#search").click(function(){
		var name=$("#user").val();
		//var zhaoshangzhuanyuan=$("#zhaoshang").val();
		$.ajax({
			type:"post",
			url:"${pageContext.request.contextPath}/ction/selectGuanggaoByname",
			data:{"name":name},
			error:function(){},
	    	timeout:1000,
			success:function(data){
				$('#dataContent').datagrid('loadData',data);
			}
		});
	});
	});

</script>
</head>
<body>
<h2>视频信息</h2>
	 <div  id="dataContent"></div >
	
	 <div id="dd" class="easyui-dialog" title="视频信息" style="width:400px;height:400px;"   
        data-options="iconCls:'icon-save',buttons:'#bb',resizable:true,modal:true,closed:true">  
        
         <form class="form-horizontal" id="formData">
          <input  name="id" type="hidden"value=''>
 		 	 <table>
				<tr>
					<td>标题:</td>
					<td><input type="text" name="title" value="" />
					</td>
				</tr>
				<tr>
					<td>类型:</td>
					<td><select name="type">
					      <option value="image">image</option>
					       <option value="video">video</option>
					    </select>
					</td>
				</tr>
				<tr>
					<td>简介:</td>
					<td><input type="text" name="jianjie" value="" />
					</td>
				</tr>
				<tr>
					<td>广告:</td>
					<td><input type="file" name="file" value="" />
					</td>
				</tr>
			</table> 
		</form>
</div>  
	 <div id="ttt" style="padding:3px">
		 <div>
		  <a href="#" id="addFile"class="easyui-linkbutton" data-options="iconCls:'icon-add',plain:true">上传广告</a>
          
		 </div>
		  <div>
		   <span>广告标题:</span>
		  <input id="user" style="line-height:20px;width:150px;border:1px solid #ccc"/>
		  <a href="#" class="easyui-linkbutton" id="search">查询</a>
		  </div>
	   </div>
   <div id="bb">
	<a href="#" id="add"class="easyui-linkbutton">保存</a>
	<a href="#" id="close"class="easyui-linkbutton">关闭</a>
</div>
</body>
</html>