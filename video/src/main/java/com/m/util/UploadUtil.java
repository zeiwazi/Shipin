package com.m.util;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.util.HashMap;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.servlet.http.HttpServletRequest;

import org.apache.commons.codec.digest.DigestUtils;
import org.apache.commons.io.IOUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.multipart.commons.CommonsMultipartFile;


/**
 * 文件上传统一处理类
 * @author chenchudong
 *
 */
public class UploadUtil {

	private static Logger logger = LoggerFactory.getLogger(UploadUtil.class);
	
	private static final String TYPE_IMAGE_SUFFIX = "(jpg)|(jpeg)|(png)"
													+ "|(bmp)|(GIF)|(JPG)"
													+ "|(PNG)|(JPEG)";
	private static final String TYPE_FILE_SUFFIX = "(pdf)|(xls)|(xlsx)";
	/**上传文件放在web根目录下的upload文件夹**/
	private static final String UPLOAD_ABSOLUTE_ROOT_DIR = "image";
	private static final String UPLOAD_ABSOLUTE_IMAGE_DIR = UPLOAD_ABSOLUTE_ROOT_DIR + File.separator + "image"; 
	private static final String UPLOAD_ABSOLUTE_COMMON_DIR =  UPLOAD_ABSOLUTE_ROOT_DIR + File.separator + "common"; 
	public static final String UPLOAD_ABSSOLUTE_EXIMP_DIR = UPLOAD_ABSOLUTE_ROOT_DIR + File.separator + "eximp";//excel导入存放位置
	public static final String UPLOAD_ABSSOLUTE_XMLIMP_DIR = UPLOAD_ABSOLUTE_ROOT_DIR + File.separator + "XMLIMP";//XML导入导出存放位置
	public static final String UPLOAD_ABSSOLUTE_PDMIMP_DIR = UPLOAD_ABSOLUTE_ROOT_DIR + File.separator + "PDMIMP";//PDM导入导出存放位置
	public static final String UPLOAD_URL_ROOT_DIR = "upload";
	public static final String UPLOAD_URL_IMAGE_DIR = "image/shop";//图片存放
	//public static final String UPLOAD_URL_EXIMP_DIR = "upload/eximp";//导入导出存放位置
	public static final String UPLOAD_URL_COMMON_DIR = "data";//通用上传位置 

	
	 
	/**
	 * 上传文件的时候，有些浏览器（IE）会传递完整路径（c:\Documents and Settings\***\*.xls），另一些（firefox,chrom）刚只传递文件名（**.xls）
	 * 这里只取文件名
	 * @param fileName
	 * @return
	 */
	public static String getFileName(String fileName) {
		int index = fileName.lastIndexOf(File.separator);
		index = index == -1 ? fileName.lastIndexOf(File.separator) : index;
		if( index != -1 ) {
			fileName = fileName.substring(index+1);
		}
		return fileName;
	}
	
	/**
	 * url路径： 目录路径
	 * @param request
	 * @return
	   @author:chenchudong
	 */
	public static String getUploadDir(HttpServletRequest request){
		//return request.getContextPath()+ UPLOAD_URL_IMAGE_DIR;
		return  UPLOAD_URL_IMAGE_DIR;
	}
	/**
	 * 上传目录的绝对路径
	 * @param request
	 * @return
	   @author:chenchudong
	 */
	public static String getUploadAbsoluteDir(HttpServletRequest request,String dir){
		String path = request.getSession().getServletContext().getRealPath("/") + dir;
		File fileDir = new File(path);
		if( !fileDir.exists() ){
			fileDir.mkdirs();
		}
		return path;
	}
	
	/**
	 * 获取文件名的md5
	 * @param fileName
	 * @return
	   @author:chenchudong
	 */
	public static String getMd5FileName(String fileName){
		return DigestUtils.md5Hex(fileName) + "." + getFileSubffix(fileName);
	}
	/**
	 * 获取文件名的后缀
	 * @param fileName
	 * @return
	   @author:chenchudong
	 */
	public static String getFileSubffix(String fileName){
		return fileName.substring(fileName.lastIndexOf(".") + 1);
	}
	
	/**
	 * 验证上传文件的合法后缀
	 * @param fileName
	 * @return
	   @author:chenchudong
	 */
	public  static boolean validateFileSuffix(String fileName){
		String suffix = getFileSubffix(fileName);
		Pattern pattern = Pattern.compile(TYPE_IMAGE_SUFFIX);
		Matcher matcher = pattern.matcher(suffix);
		if( matcher.find() ){
			return true;
		}
		return false;
	}
	
	/**
	 * 根据上传文件的后缀确定文件上传的类型
	 * @param fileName 文件名 包含后缀
	 * @return 文件类型
	   @author:chenchudong
	 */
	public static String getUploadFileType(String fileName){
		String suffix = fileName.substring(fileName.lastIndexOf(".") + 1);
		return suffix.toLowerCase();
	}
	/**
	 * 
	 * @param fileComm
	 * @param request
	 * @param path
	 * @return 
	   @author:chenchudong
	 */
	public static String upload(CommonsMultipartFile fileComm
			,HttpServletRequest request
			,String path){
		try {
			if( path.equals("") ){
				path = UPLOAD_ABSOLUTE_COMMON_DIR;
			}
			String uploadDir =  getUploadAbsoluteDir(request, path);
			path = uploadDir + File.separator + fileComm.getOriginalFilename();
			gennerateFile(path, fileComm);
			return path;
		} catch (Exception e) {
			e.printStackTrace();
			logger.error(e.getMessage(),e);
		}
		return path;
	}
	
	
	/**
	 * 文件上传
	 * @param fileComm
	 * @param request
	 * @return
	   @author:chenchudong
	 */
	public static String upload(CommonsMultipartFile fileComm,HttpServletRequest request){
		try{
			String origFileName = fileComm.getOriginalFilename();
			if( validateFileSuffix(origFileName) ){
				String fileName = getMd5FileName(getFileName(origFileName)) ;
				String path = getUploadAbsoluteDir(request,UPLOAD_ABSOLUTE_IMAGE_DIR) 
							+ File.separator 
							+ fileName ;
				
				gennerateFile(path, fileComm);
				String imgUrlPath = getUploadDir(request) + "/" + fileName;
				return imgUrlPath;
			}
			else{
				logger.error("上传非法文件,fileName:" + origFileName);
			}
		}catch( Exception e ){
			e.printStackTrace();
			logger.error(e.getMessage(), e);
		}
		return null;
	}
	
	public static void gennerateFile(String path,CommonsMultipartFile fileComm) throws Exception{
		File file = new File(path);
		FileOutputStream fos = new FileOutputStream(file);
		InputStream ins = fileComm.getInputStream();
		byte[] buffer = new byte[1024];
		int len = 0;
		while( (len = ins.read(buffer)) != -1 ){
			fos.write(buffer, 0, len);
		}
		fos.flush();
		fos.close();
		ins.close();
	}
	
//	public static void main(String[] args) {
//		System.out.println(validateFileSuffix("33333jpeg.ww"));
//	}
}
