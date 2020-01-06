package com.m.controller;

import java.io.File;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.commons.CommonsMultipartFile;

import com.m.modle.Admin;
import com.m.modle.Guanggao;
import com.m.modle.Pinglun;
import com.m.modle.Shipin;
import com.m.modle.ShipinGuanggao;
import com.m.modle.Student;
import com.m.service.ActionService;
import com.m.util.CreateUUid;
import com.m.util.DateUtil;
import com.m.util.DownloadUtil;
import com.m.util.MysqldataBackAndRestore;
import com.m.util.UploadUtil;


@Controller
@RequestMapping(value = "/ction")
public class Action {
	@Autowired
	public ActionService service;
	CreateUUid createUUid=new CreateUUid();
	@ResponseBody
	@RequestMapping("/login")
    public boolean login(String name,String password,String type,ModelMap attribute,HttpServletRequest request){
		boolean flag=false;
		Map<String,String> map=new HashMap<String,String>();
		map.put("name", name);
		map.put("password", password);
		map.put("type", type);
		Admin admin=service.adminLogin(map);
		if(admin!=null){
				request.getSession().setAttribute("userId", admin.getId());
				request.getSession().setAttribute("userName",name);
				request.getSession().setAttribute("type",admin.getType());
				flag=true;
		}
		
        return flag;
    }
	
	
	@ResponseBody
	@RequestMapping("/tuichu")
    public boolean tuichu(ModelMap attribute,HttpServletRequest request){
			request.getSession().setAttribute("userId", null);
			request.getSession().setAttribute("userName",null);
			request.getSession().setAttribute("type", null);
			
        return true;
    }
	@ResponseBody
	@RequestMapping("/insertAdmin")
    public int insertAdmin(String name,String password,String sex,String age,String phone,String address,String email
			,String qq,ModelMap attribute,HttpServletRequest request){
		Map<String,String> map=new HashMap<String,String>();
		map.put("name", name);
		map.put("sex", sex);
		map.put("age", age);
		map.put("type", "user");
		map.put("phone", phone);
		map.put("address", address);
		map.put("email", email);
		map.put("password", password);
		map.put("qq", qq);
		
        return service.insertAdmin(map);
    }
	@ResponseBody
	@RequestMapping("/selectShipinByname")
	public List<Shipin> selectStudentByname(String name,HttpServletRequest request){
		Map<String,String> map=new HashMap<String,String>();
		map.put("name", "%"+name+"%");
		return  service.selecShipin(map);
	}
	@ResponseBody
	@RequestMapping("/selectShipinBynameAndtype")
	public List<Shipin> selectShipinBynameAndtype(String name,String type,HttpServletRequest request){
		Map<String,String> map=new HashMap<String,String>();
		map.put("name", "%"+name+"%");
		map.put("type", "%"+type+"%");
		return  service.selectShipinBynameAndtype(map);
	}
	@ResponseBody
	@RequestMapping("/selecShipinBytype")
	public List<Shipin> selecShipinBytype(String type,HttpServletRequest request){
		Map<String,String> map=new HashMap<String,String>();
		map.put("type", type);
		return  service.selecShipinBytype(map);
	}
	@ResponseBody
	@RequestMapping("/deleteShipin")
    public int deleteShipin(String id,ModelMap attribute,HttpServletRequest request){
			
        return service.deleteShipin(id);
    }
	@ResponseBody
	@RequestMapping("/insertShipin")
    public int insertShipin(@RequestParam CommonsMultipartFile file ,String title,String type,String jianjie,ModelMap attribute,HttpServletRequest request){
		if(file!=null &&  file.getSize() > 0){
			String pathKaitibaogao = UploadUtil.upload(file, request, UploadUtil.UPLOAD_URL_COMMON_DIR);
			String path =request.getSession().getServletContext().getRealPath("/")+File.separator+"data/shipin"+File.separator+file.getFileItem().getName();
			Map<String,String> map=new HashMap<String,String>();
			map.put("title", title);
			map.put("type", type);
			map.put("jianjie", jianjie);
			map.put("url", "shipin"+File.separator+file.getFileItem().getName());
			map.put("riqi", new DateUtil().getCurrentDateStr());
			 return service.insertShipin(map);
		}
		 return 0;
		
	
       
    }
	@ResponseBody
	@RequestMapping("/updateShipin")
    public int updateShipin( String title, String type,String jianjie,String id,ModelMap attribute,HttpServletRequest request){
			Map<String,String> map=new HashMap<String,String>();
			map.put("title", title);
			map.put("type", type);
			map.put("jianjie", jianjie);
			map.put("id", id);
			return service.updateShipin(map);
    }
	@ResponseBody
	@RequestMapping("/selectGuanggaoByname")
	public List<Guanggao> selectGuanggaoByname(String name,HttpServletRequest request){
		Map<String,String> map=new HashMap<String,String>();
		map.put("name", "%"+name+"%");
		return  service.selectGuanggao(map);
	}
	@ResponseBody
	@RequestMapping("/deleteGuanggao")
    public int deleteGuanggao(String id,ModelMap attribute,HttpServletRequest request){
			
        return service.deleteGuanggao(id);
    }
	@ResponseBody
	@RequestMapping("/insertGuanggao")
    public int insertGuanggao(@RequestParam CommonsMultipartFile file ,String title,String type,String jianjie,ModelMap attribute,HttpServletRequest request){
		if(file!=null &&  file.getSize() > 0){
			String pathKaitibaogao = UploadUtil.upload(file, request, UploadUtil.UPLOAD_URL_COMMON_DIR);
			String path =request.getSession().getServletContext().getRealPath("/")+File.separator+"data/guanggao"+File.separator+file.getFileItem().getName();
			Map<String,String> map=new HashMap<String,String>();
			map.put("title", title);
			map.put("type", type);
			map.put("jianjie", jianjie);
			map.put("url", "guanggao"+File.separator+file.getFileItem().getName());
			map.put("riqi", new DateUtil().getCurrentDateStr());
			 return service.insertGuanggao(map);
		}
		 return 0;
    }
	@ResponseBody
	@RequestMapping("/updateGuanggao")
    public int updateGuanggao( String title, String type,String jianjie,String id,ModelMap attribute,HttpServletRequest request){
			Map<String,String> map=new HashMap<String,String>();
			map.put("title", title);
			map.put("type", type);
			map.put("jianjie", jianjie);
			map.put("id", id);
			return service.updateGuanggao(map);
    }
	@ResponseBody
	@RequestMapping("/updatepassword")
    public int updatepassword( String password,String id,ModelMap attribute,HttpServletRequest request){
			Map<String,String> map=new HashMap<String,String>();
			map.put("password", password);
			map.put("id", id);
			return service.updateAdmin(map);
    }
	@ResponseBody
	@RequestMapping("/selecShipinByid")
    public Module selecShipinByid(String id,ModelMap attribute,HttpServletRequest request){
			Map<String,String> map=new HashMap<String,String>();
			map.put("id", id);
			Module modul=new Module();
			modul.setShipin(service.selecShipinByid(map));
			modul.setGuanggaolist( service.selecguanggaoByid(map));
			return modul;
    }
	
	@ResponseBody
	@RequestMapping("/selecShipinguanggao")
	public List<ShipinGuanggao> selecShipinguanggao(String name,HttpServletRequest request){
		Map<String,String> map=new HashMap<String,String>();
		return  service.selecShipinguanggao(map);
	}
	@ResponseBody
	@RequestMapping("/deleteShipinguanggao")
    public int deleteShipinguanggao(String id,ModelMap attribute,HttpServletRequest request){
			
        return service.deleteShipinguanggao(id);
    }
	@ResponseBody
	@RequestMapping("/insertShipinguanggao")
    public int insertShipinguanggao(String guanggaoid,String shipinid,String kaiboshiduan,String shijian,ModelMap attribute,HttpServletRequest request){
			Map<String,String> map=new HashMap<String,String>();
			map.put("guanggaoid", guanggaoid);
			map.put("shipinid", shipinid);
			map.put("kaiboshiduan", kaiboshiduan);
			map.put("shijian", shijian);
			return service.insertShipinguanggao(map);
    }
	@ResponseBody
	@RequestMapping("/selectPinglun")
    public List<Pinglun> selectPinglun(String shipinid,ModelMap attribute,HttpServletRequest request){
			Map<String,String> map=new HashMap<String,String>();
			map.put("shipinid", shipinid);
			return service.selectPinglun(map);
    }@ResponseBody
	@RequestMapping("/insertPinglun")
    public int insertPinglun(String userid,String shipinid,String neirong,ModelMap attribute,HttpServletRequest request){
			Map<String,String> map=new HashMap<String,String>();
			map.put("shipinid", shipinid);
			map.put("userid", userid);
			map.put("neirong", neirong);
			map.put("shijian", new DateUtil().getCurrentDateStr());
			return service.insertPinglun(map);
    }
	
	class Module{
		private Shipin shipin;
		private List<Guanggao>  guanggaolist;
		public Shipin getShipin() {
			return shipin;
		}
		public void setShipin(Shipin shipin) {
			this.shipin = shipin;
		}
		public List<Guanggao> getGuanggaolist() {
			return guanggaolist;
		}
		public void setGuanggaolist(List<Guanggao> guanggaolist) {
			this.guanggaolist = guanggaolist;
		}
		
		
	}
}
