package com.m.service;

import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import com.m.mappers.ActionMapper;
import com.m.modle.Admin;
import com.m.modle.Guanggao;
import com.m.modle.Jiaoping;
import com.m.modle.Pinglun;
import com.m.modle.Shipin;
import com.m.modle.ShipinGuanggao;
import com.m.modle.Student;

@Service("actionService")
public class ActionServiceImpl implements ActionService {
	@Resource
	private ActionMapper Actionmapper;

	@Override
	public Admin adminLogin(Map<String, String> map) {
		// TODO Auto-generated method stub
		return Actionmapper.adminLogin(map);
	}

	@Override
	public int insertShipin(Map<String, String> map) {
		// TODO Auto-generated method stub
		return Actionmapper.insertShipin(map);
	}

	@Override
	public int deleteShipin(String id) {
		// TODO Auto-generated method stub
		return Actionmapper.deleteShipin(id);
	}

	@Override
	public List<Shipin> selecShipin(Map<String, String> map) {
		// TODO Auto-generated method stub
		return Actionmapper.selecShipin(map);
	}

	@Override
	public int updateShipin(Map<String, String> map) {
		// TODO Auto-generated method stub
		return Actionmapper.updateShipin(map);
	}

	@Override
	public int updateAdmin(Map<String, String> map) {
		// TODO Auto-generated method stub
		return Actionmapper.updateAdmin(map);
	}

	@Override
	public Shipin selecShipinByid(Map<String, String> map) {
		// TODO Auto-generated method stub
		return Actionmapper.selecShipinByid(map);
	}

	@Override
	public List<Guanggao> selecguanggaoByid(Map<String, String> map) {
		// TODO Auto-generated method stub
		return Actionmapper.selecguanggaoByid(map);
	}

	@Override
	public int insertGuanggao(Map<String, String> map) {
		// TODO Auto-generated method stub
		return Actionmapper.insertGuanggao(map);
	}

	@Override
	public int deleteGuanggao(String id) {
		// TODO Auto-generated method stub
		return Actionmapper.deleteGuanggao(id);
	}

	@Override
	public List<Guanggao> selectGuanggao(Map<String, String> map) {
		// TODO Auto-generated method stub
		return Actionmapper.selectGuanggao(map);
	}

	@Override
	public int updateGuanggao(Map<String, String> map) {
		// TODO Auto-generated method stub
		return Actionmapper.updateGuanggao(map);
	}

	@Override
	public int insertShipinguanggao(Map<String, String> map) {
		// TODO Auto-generated method stub
		return Actionmapper.insertShipinguanggao(map);
	}

	@Override
	public int deleteShipinguanggao(String id) {
		// TODO Auto-generated method stub
		return Actionmapper.deleteShipinguanggao(id);
	}

	@Override
	public List<ShipinGuanggao> selecShipinguanggao(Map<String, String> map) {
		// TODO Auto-generated method stub
		return Actionmapper.selecShipinguanggao(map);
	}

	@Override
	public int insertAdmin(Map<String, String> map) {
		// TODO Auto-generated method stub
		return Actionmapper.insertAdmin(map);
	}

	@Override
	public List<Shipin> selecShipinBytype(Map<String, String> map) {
		// TODO Auto-generated method stub
		return Actionmapper.selecShipinBytype(map);
	}

	@Override
	public List<Shipin> selectShipinBynameAndtype(Map<String, String> map) {
		// TODO Auto-generated method stub
		return Actionmapper.selectShipinBynameAndtype(map);
	}

	@Override
	public List<Pinglun> selectPinglun(Map<String, String> map) {
		// TODO Auto-generated method stub
		return Actionmapper.selectPinglun(map);
	}

	@Override
	public int insertPinglun(Map<String, String> map) {
		// TODO Auto-generated method stub
		return Actionmapper.insertPinglun(map);
	}
}
