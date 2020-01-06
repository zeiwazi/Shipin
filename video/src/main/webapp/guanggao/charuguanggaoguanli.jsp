<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>广告插入管理</title>
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
				url:'${pageContext.request.contextPath}/ction/selecShipinguanggao',//提取所有
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
			        {field:'guanggaoname',title:'广告名称',align: 'center',width:120},   
			        {field:'shipinname',title:'视频名称',align: 'center',width:120},    
			        {field:'kaiboshiduan',title:'开播时间',align: 'center',width:320}, 
			        {field:'shijian',title:'总时间',align: 'center',width:320}, 
			        {field:'operator',title:'操作',align: 'center',width:120}    
			       
			    ]],
			    rowStyler : function(index,row){
			    	row.operator = [
						'<a href="javascript:void(0);" name="btnRemove" data-uuid="' + row.uuid +'" title="删除" ><img src="${pageContext.request.contextPath}/images/delete.png" />删除</a>'
					].join('');
			    },
			    toolbar : "#ttt",
				onLoadSuccess : function(result){
					
				}
		 };
		 $("#dataContent").datagrid(opts);

	
	$("#add").click(function(){
		 var guanggaoid=$('#guanggaoid').combogrid('getValue');
		 var shipinid=$('#shipinid').combogrid('getValue');
		 var kaiboshiduan=$('#kaiboshiduan').val();
 		 var shijian=$('#shijian').val();
		$.ajax({
			type:"post",
			url:"${pageContext.request.contextPath}/ction/insertShipinguanggao",
			data:{"guanggaoid":guanggaoid,"shipinid":shipinid,"kaiboshiduan":kaiboshiduan,"shijian":shijian},
			error:function(){},
	    	timeout:1000,
			success:function(data){
				if(data){
					alert("保存成功");
					$("#dataContent").datagrid('reload');
					$('#dd').dialog('close');
				}else{
					alert("保存失败");
				}
			}
		});

		
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
			url:"${pageContext.request.contextPath}/ction/deleteShipinguanggao",
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
<h2>广告植入信息</h2>
	 <div  id="dataContent"></div >
	
	 <div id="dd" class="easyui-dialog" title="视频信息" style="width:400px;height:400px;"   
        data-options="iconCls:'icon-save',buttons:'#bb',resizable:true,modal:true,closed:true">  
        
         <form class="form-horizontal" id="formData">
          <input  name="id" type="hidden"value=''>
 		 	 <table>
				<tr>
					<td>选择广告:</td>
					<td><select class="easyui-combogrid"id="guanggaoid" style="width:250px" id="userid" data-options="
			panelWidth: 500,
			idField: 'id',
			textField: 'title',
			url: '${pageContext.request.contextPath}/ction/selectGuanggaoByname?name=',
			method: 'get',
			columns: [[
				{field:'type',title:'广告类型',align: 'center',width:120},   
			        {field:'title',title:'标题',align: 'center',width:120},    
			        {field:'jianjie',title:'简介',align: 'center',width:120}, 
			        {field:'url',title:'地址',align: 'center',width:120} 
			]],
			fitColumns: true
		">
	     </select>
					</td>
				</tr>
				<tr>
					<td>选择视频:</td>
					<td><select class="easyui-combogrid" id="shipinid"style="width:250px" id="userid" data-options="
			panelWidth: 500,
			idField: 'id',
			textField: 'title',
			url: '${pageContext.request.contextPath}/ction/selectShipinByname?name=',
			method: 'get',
			columns: [[
				 {field:'type',title:'视频类型',align: 'center',width:120},   
			        {field:'title',title:'标题',align: 'center',width:120},    
			        {field:'jianjie',title:'简介',align: 'center',width:120}, 
			        {field:'url',title:'地址',align: 'center',width:120}, 
			        {field:'riqi',title:'上传日期',align: 'center',width:120}
			]],
			fitColumns: true
		">
	     </select>
					<td>
					</td>
				</tr>
				<tr>
					<td>开播时间</td>
					<td><input type="number" id="kaiboshiduan" value="" />
					</td>
				</tr>
				<tr>
					<td>播放总时间:</td>
					<td><input type="number" id="shijian" value="" />
					</td>
				</tr>
			</table> 
		</form>
</div>  
	 <div id="ttt" style="padding:3px">
		 <div>
		  <a href="#" id="addFile"class="easyui-linkbutton" data-options="iconCls:'icon-add',plain:true">新增广告植入</a>
          
		 </div>
		  
	   </div>
   <div id="bb">
	<a href="#" id="add"class="easyui-linkbutton">保存</a>
	<a href="#" id="close"class="easyui-linkbutton">关闭</a>
</div>
</body>
</html>