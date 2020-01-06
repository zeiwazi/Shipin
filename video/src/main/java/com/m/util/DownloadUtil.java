package com.m.util;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class DownloadUtil {

	public static String encoding = "UTF-8";
	
	/**
	 * 下载
	 * @param fileName
	 * @param request
	 * @param response
	 * @throws Exception
	 */
	public static void downLoad(String path,HttpServletRequest request,HttpServletResponse response) throws Exception{
	    File file = new File(path);
		if( file.exists() ){
				String fileName = file.getName();
		    	String userAgent = request.getHeader("User-Agent"); 
		    	
		    	//针对IE或者以IE为内核的浏览器：
		    	if (userAgent.contains("MSIE")||userAgent.contains("Trident")) {
		    		fileName = java.net.URLEncoder.encode(fileName, "UTF-8");
		    	} 
		    	else {
		    		//非IE浏览器的处理：
		    		fileName = new String(fileName.getBytes("UTF-8"),"ISO-8859-1");
		    	}
				response.setHeader("Content-Disposition", "attachment;filename=" + fileName );  
			    response.setContentType("application/OCTET-STREAM;charset=UTF-8");
		        response.setCharacterEncoding("UTF-8");
		    	 try {
					FileInputStream fis = new FileInputStream(file);
					OutputStream fos = response.getOutputStream();
					byte[] buffer = new byte[1024*1024*1];
					int len = 0;
					while((len=fis.read(buffer)) !=-1){
						fos.write(buffer, 0, len);
					}
					fis.close();
					fos.flush();
					fos.close();
				} catch (Exception e) {
					e.printStackTrace();
			    	throw new Exception(e.getMessage(),e);
				} 
		    }
		else{
	    	throw new Exception("文件不存在!![path:"+ file.getAbsolutePath() +"]" );
	    }
	}
}
