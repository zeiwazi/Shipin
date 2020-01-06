package com.m.util;

import java.util.UUID;

public class CreateUUid {
	 public  String getUUID(){    
	        String uuid = UUID.randomUUID().toString().trim().replaceAll("-", "");    
	        return uuid;    
	    }  
}
