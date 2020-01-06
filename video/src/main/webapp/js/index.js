var user_box=document.getElementById("user_box");
$("#log_btn").click(function(){
	if(user_box.style.opacity==0){
	$("#user_box").css("opacity","1")
	}
	else{
	$("#user_box").css("opacity","0")
	}
})
