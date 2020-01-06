package com.m.service;

import java.util.List;
import java.util.Map;

import com.m.modle.Admin;
import com.m.modle.Guanggao;
import com.m.modle.Jiaoping;
import com.m.modle.Pinglun;
import com.m.modle.Shipin;
import com.m.modle.ShipinGuanggao;
import com.m.modle.Student;

public interface ActionService {
	
public Admin adminLogin(Map<String,String> map);
	
	public int insertShipin(Map<String,String> map);
	public int deleteShipin(String id);
	public List<Shipin> selecShipin(Map<String,String> map);
	public List<Shipin> selecShipinBytype(Map<String,String> map);
	public int updateShipin(Map<String,String> map);
	public int updateAdmin(Map<String,String> map);
	public Shipin selecShipinByid(Map<String,String> map);
	public List<Guanggao> selecguanggaoByid(Map<String,String> map);

	public int insertGuanggao(Map<String,String> map);
	public int deleteGuanggao(String id);
	public List<Guanggao> selectGuanggao(Map<String,String> map);
	public int updateGuanggao(Map<String,String> map);
	
	public int insertShipinguanggao(Map<String,String> map);
	public int deleteShipinguanggao(String id);
	public List<ShipinGuanggao> selecShipinguanggao(Map<String,String> map);
	public int insertAdmin(Map<String,String> map);
	public List<Shipin> selectShipinBynameAndtype(Map<String,String> map);
	public List<Pinglun> selectPinglun(Map<String,String> map);
	public int insertPinglun(Map<String,String> map);
}
