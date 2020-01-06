/*
Navicat MySQL Data Transfer

Source Server         : mysql
Source Server Version : 50717
Source Host           : localhost:3306
Source Database       : shipin

Target Server Type    : MYSQL
Target Server Version : 50717
File Encoding         : 65001

Date: 2018-05-01 13:23:28
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for `admin`
-- ----------------------------
DROP TABLE IF EXISTS `admin`;
CREATE TABLE `admin` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `type` varchar(200) DEFAULT NULL,
  `name` varchar(200) DEFAULT NULL,
  `password` varchar(200) DEFAULT NULL,
  `sex` varchar(200) DEFAULT NULL,
  `age` int(11) DEFAULT NULL,
  `phone` varchar(200) DEFAULT NULL,
  `email` varchar(200) DEFAULT NULL,
  `qq` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of admin
-- ----------------------------
INSERT INTO `admin` VALUES ('1', 'user', '1', '1', '男', '21', '13507681912', '123456789@qq.com', null);
INSERT INTO `admin` VALUES ('2', 'shipinAdmin', '1', '12', '男', '213', '321', '321', null);
INSERT INTO `admin` VALUES ('3', 'guanggaoAdmin', '2', '12', '男', '213', '321', '321', null);
INSERT INTO `admin` VALUES ('4', 'superAdmin', '3', '1', '男', '321', '321', '321', null);

-- ----------------------------
-- Table structure for `guanggao`
-- ----------------------------
DROP TABLE IF EXISTS `guanggao`;
CREATE TABLE `guanggao` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `type` varchar(500) DEFAULT NULL,
  `title` varchar(500) DEFAULT NULL,
  `jianjie` varchar(200) DEFAULT NULL,
  `jishu` varchar(200) DEFAULT NULL,
  `canshu` varchar(200) DEFAULT NULL,
  `xiaoguo` varchar(200) DEFAULT NULL,
  `url` varchar(300) DEFAULT NULL,
  `riqi` varchar(300) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of guanggao
-- ----------------------------
INSERT INTO `guanggao` VALUES ('1', 'video', '汽车广告', '优信二手车，', null, null, null, 'guanggao/240.mp4', null);
INSERT INTO `guanggao` VALUES ('3', 'video', '23', '23', null, null, null, 'guanggao/240.mp4', '2018-04-27 15:59:48');
INSERT INTO `guanggao` VALUES ('4', 'video', '瓜子二手车', '123', null, null, null, 'guanggao/240.mp4', '2018-05-01 11:14:27');
INSERT INTO `guanggao` VALUES ('5', 'video', '毛豆新车网', '123', null, null, null, 'guanggao\\240.mp4', '2018-05-01 11:33:17');

-- ----------------------------
-- Table structure for `pinglun`
-- ----------------------------
DROP TABLE IF EXISTS `pinglun`;
CREATE TABLE `pinglun` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `shipinid` varchar(500) DEFAULT NULL,
  `userid` varchar(500) DEFAULT NULL,
  `neirong` varchar(500) DEFAULT NULL,
  `shijian` varchar(500) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of pinglun
-- ----------------------------
INSERT INTO `pinglun` VALUES ('1', '2', '1', '123', '2018-04-30 13:29:06');
INSERT INTO `pinglun` VALUES ('2', '2', '1', '123', '2018-04-30 13:29:08');
INSERT INTO `pinglun` VALUES ('3', '2', '1', '123', '2018-04-30 13:29:16');
INSERT INTO `pinglun` VALUES ('4', '2', '1', '123', '2018-04-30 13:29:22');
INSERT INTO `pinglun` VALUES ('5', '2', '1', '123', '2018-04-30 13:30:15');
INSERT INTO `pinglun` VALUES ('11', '2', '1', '12321321', '2018-04-30 13:35:45');
INSERT INTO `pinglun` VALUES ('12', '2', '1', '123', '2018-04-30 14:15:37');
INSERT INTO `pinglun` VALUES ('13', '2', '1', '嗯好的', '2018-04-30 14:15:45');
INSERT INTO `pinglun` VALUES ('14', '2', '1', '还是很好的', '2018-05-01 11:07:11');

-- ----------------------------
-- Table structure for `shipin`
-- ----------------------------
DROP TABLE IF EXISTS `shipin`;
CREATE TABLE `shipin` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `type` varchar(500) DEFAULT NULL,
  `title` varchar(500) DEFAULT NULL,
  `jianjie` varchar(500) DEFAULT NULL,
  `url` varchar(500) DEFAULT NULL,
  `riqi` varchar(500) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of shipin
-- ----------------------------
INSERT INTO `shipin` VALUES ('2', '警匪', '致命追击', '致命追击', 'shipin/ts.mp4', '2018-04-30 11:23:30');
INSERT INTO `shipin` VALUES ('3', '悬疑', '少年包青天', '少年包青天', 'shipin/ts.mp4', '2018-04-27 11:23:30');
INSERT INTO `shipin` VALUES ('4', '武侠', '侠客行', '侠客行', 'shipin/ts.mp4', '2018-04-29 11:23:30');
INSERT INTO `shipin` VALUES ('5', '恐怖', '侏罗纪公园', '侏罗纪公园', 'shipin/ts.mp4', '2018-04-28 11:23:30');
INSERT INTO `shipin` VALUES ('6', '古装', '神雕侠侣', '神雕侠侣', 'shipin/ts.mp4', '2018-04-22 11:23:30');
INSERT INTO `shipin` VALUES ('7', '爱情', '乡村爱情故事', '乡村爱情故事', 'shipin/ts.mp4', '2018-04-22 11:23:30');
INSERT INTO `shipin` VALUES ('8', '喜剧', '大话西游', '大话西游', 'shipin/ts.mp4', '2018-04-22 11:23:30');
INSERT INTO `shipin` VALUES ('9', '惊悚', '全面出击', '全面出击', 'shipin/ts.mp4', '2018-04-28 11:23:30');
INSERT INTO `shipin` VALUES ('10', '爱情', '我的高考我的班', '我的高考我的班', 'shipin/ts.mp4', '2018-04-22 11:23:30');
INSERT INTO `shipin` VALUES ('11', '悬疑', '唐人街探案', '唐人街探案', 'shipin/ts.mp4', '2018-04-22 11:23:30');
INSERT INTO `shipin` VALUES ('12', '悬疑', '大追捕', '大追捕', 'shipin/ts.mp4', '2018-04-22 11:23:30');
INSERT INTO `shipin` VALUES ('13', '惊悚', '电锯惊魂', '电锯惊魂', 'shipin/ts.mp4', '2018-04-29 11:23:30');
INSERT INTO `shipin` VALUES ('14', '惊悚', '全民目击', '全民目击', 'shipin/ts.mp4', '2018-04-29 11:23:30');
INSERT INTO `shipin` VALUES ('15', '武侠', '大漠孤侠', '大漠孤侠', 'shipin/ts.mp4', '2018-04-29 11:23:30');
INSERT INTO `shipin` VALUES ('16', '武侠', '独孤九剑', '独孤九剑', 'shipin/ts.mp4', '2018-04-29 11:23:30');
INSERT INTO `shipin` VALUES ('17', '武侠', '战神传说', '战神传说', 'shipin/ts.mp4', '2018-04-29 11:23:30');
INSERT INTO `shipin` VALUES ('18', '警匪', '大事件', '大事件', 'shipin/ts.mp4', '2018-04-30 11:23:30');

-- ----------------------------
-- Table structure for `shipin_guanggao`
-- ----------------------------
DROP TABLE IF EXISTS `shipin_guanggao`;
CREATE TABLE `shipin_guanggao` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `guanggaoid` int(11) DEFAULT NULL,
  `shipinid` int(11) DEFAULT NULL,
  `kaiboshiduan` varchar(200) DEFAULT NULL,
  `shijian` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of shipin_guanggao
-- ----------------------------
INSERT INTO `shipin_guanggao` VALUES ('1', '1', '2', '5', '3');
INSERT INTO `shipin_guanggao` VALUES ('2', '1', '2', '10', '3');
INSERT INTO `shipin_guanggao` VALUES ('3', '1', '9', '8', '4');
INSERT INTO `shipin_guanggao` VALUES ('4', '4', '4', '6', '4');
INSERT INTO `shipin_guanggao` VALUES ('5', '5', '5', '6', '4');
