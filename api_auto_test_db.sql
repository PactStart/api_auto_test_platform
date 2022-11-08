/*
 Navicat Premium Data Transfer

 Source Server         : localhost
 Source Server Type    : MySQL
 Source Server Version : 50734
 Source Host           : localhost:3306
 Source Schema         : auto_test

 Target Server Type    : MySQL
 Target Server Version : 50734
 File Encoding         : 65001

 Date: 08/11/2022 17:46:53
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for api
-- ----------------------------
DROP TABLE IF EXISTS `api`;
CREATE TABLE `api` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `app_id` int(11) NOT NULL COMMENT '应用id',
  `group_name` varchar(50) COLLATE utf8mb4_bin NOT NULL COMMENT 'api分组',
  `module_name` varchar(50) COLLATE utf8mb4_bin NOT NULL COMMENT '模块名',
  `api_name` varchar(50) COLLATE utf8mb4_bin NOT NULL COMMENT 'api描述',
  `url` varchar(100) COLLATE utf8mb4_bin NOT NULL COMMENT '接口地址',
  `request_method` varchar(6) COLLATE utf8mb4_bin NOT NULL COMMENT '请求方式',
  `content_type` varchar(20) COLLATE utf8mb4_bin NOT NULL DEFAULT '' COMMENT '数据提交方式：application/json | multipart/form-data | application/x-www-form-urlencoded | ''''',
  `query` varchar(1024) COLLATE utf8mb4_bin NOT NULL DEFAULT '' COMMENT 'query参数定义',
  `body` text COLLATE utf8mb4_bin NOT NULL COMMENT 'body参数定义，json schema',
  `headers` varchar(1024) COLLATE utf8mb4_bin NOT NULL DEFAULT '' COMMENT 'header参数定义',
  `case_num` int(11) NOT NULL DEFAULT '0' COMMENT '用例数量',
  `create_at` bigint(20) NOT NULL COMMENT '创建时间',
  `create_by` varchar(50) COLLATE utf8mb4_bin NOT NULL COMMENT '创建人',
  `update_at` bigint(20) NOT NULL COMMENT '修改时间',
  `update_by` varchar(50) COLLATE utf8mb4_bin NOT NULL DEFAULT '' COMMENT '修改人',
  `del` tinyint(1) NOT NULL DEFAULT '0' COMMENT '是否删除',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `uk_appid_url` (`app_id`,`url`) COMMENT '应用url唯一索引'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin COMMENT='API接口';

-- ----------------------------
-- Table structure for api_test_case
-- ----------------------------
DROP TABLE IF EXISTS `api_test_case`;
CREATE TABLE `api_test_case` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `app_id` int(20) NOT NULL COMMENT '应用id',
  `api_id` int(11) NOT NULL COMMENT 'API id',
  `name` varchar(50) COLLATE utf8mb4_bin NOT NULL COMMENT '用例名称',
  `run` tinyint(1) NOT NULL COMMENT '是否运行',
  `headers` varchar(255) COLLATE utf8mb4_bin NOT NULL DEFAULT '{}' COMMENT '请求头',
  `pre_case_id` int(20) NOT NULL DEFAULT '0' COMMENT '前置用例id',
  `pre_fields` varchar(255) COLLATE utf8mb4_bin NOT NULL DEFAULT '[]' COMMENT '前置字段，用于当前case的header和body的动态参数替换',
  `request_body` varchar(255) COLLATE utf8mb4_bin NOT NULL DEFAULT '{}' COMMENT '请求内容',
  `assert` varchar(255) COLLATE utf8mb4_bin NOT NULL DEFAULT '[]' COMMENT '断言，例子：[{"field":"$.code","predicate":"=","expect":"0","msg":"code不为0"}]\n',
  `create_at` bigint(20) NOT NULL COMMENT '创建时间',
  `create_by` varchar(50) COLLATE utf8mb4_bin NOT NULL COMMENT '创建人',
  `update_at` bigint(20) NOT NULL COMMENT '修改时间',
  `update_by` varchar(50) COLLATE utf8mb4_bin NOT NULL DEFAULT '' COMMENT '修改人',
  `del` tinyint(1) NOT NULL DEFAULT '0' COMMENT '是否删除',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

-- ----------------------------
-- Table structure for api_test_plan
-- ----------------------------
DROP TABLE IF EXISTS `api_test_plan`;
CREATE TABLE `api_test_plan` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `app_id` int(20) NOT NULL COMMENT '应用id',
  `name` varchar(50) COLLATE utf8mb4_bin NOT NULL COMMENT '计划名称',
  `base_url` varchar(255) COLLATE utf8mb4_bin NOT NULL COMMENT 'API接口地址前缀',
  `case_num` int(20) NOT NULL DEFAULT '0' COMMENT 'TestCase数量',
  `pass_num` int(20) NOT NULL DEFAULT '0' COMMENT 'TestCase通过数量',
  `create_at` bigint(20) NOT NULL COMMENT '创建时间',
  `create_by` varchar(50) COLLATE utf8mb4_bin NOT NULL COMMENT '创建人',
  `start_at` bigint(20) DEFAULT NULL COMMENT '开始时间',
  `end_at` bigint(20) DEFAULT NULL COMMENT '结束时间',
  `cost` int(11) DEFAULT NULL COMMENT '耗时',
  `run` tinyint(1) NOT NULL DEFAULT '0' COMMENT '是否已完成运行',
  `mail_report` tinyint(1) NOT NULL DEFAULT '0' COMMENT '是否邮件发送测试报告',
  `mail_receivers` varchar(200) COLLATE utf8mb4_bin NOT NULL DEFAULT '' COMMENT '测试报告邮件接收人',
  `del` tinyint(1) NOT NULL DEFAULT '0' COMMENT '是否删除',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin COMMENT='api测试计划';

-- ----------------------------
-- Table structure for api_test_plan_run_log
-- ----------------------------
DROP TABLE IF EXISTS `api_test_plan_run_log`;
CREATE TABLE `api_test_plan_run_log` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `app_id` int(20) NOT NULL COMMENT '应用id',
  `plan_id` int(11) NOT NULL COMMENT '计划 id',
  `case_id` int(11) NOT NULL COMMENT '用例 id',
  `case_name` varchar(50) COLLATE utf8mb4_bin NOT NULL COMMENT '用例名称',
  `group_name` varchar(50) COLLATE utf8mb4_bin NOT NULL COMMENT 'api分组',
  `module_name` varchar(50) COLLATE utf8mb4_bin NOT NULL COMMENT '模块名',
  `api_name` varchar(50) COLLATE utf8mb4_bin NOT NULL COMMENT 'api描述',
  `url` varchar(100) COLLATE utf8mb4_bin NOT NULL COMMENT '接口地址',
  `request_method` varchar(6) COLLATE utf8mb4_bin NOT NULL COMMENT '请求方式',
  `content_type` varchar(20) COLLATE utf8mb4_bin NOT NULL DEFAULT '' COMMENT '数据提交方式，针对post的表单提交或者json''提交',
  `headers` varchar(255) COLLATE utf8mb4_bin NOT NULL DEFAULT '{}' COMMENT '请求头',
  `pre_case_id` int(20) NOT NULL DEFAULT '0' COMMENT '前置用例id',
  `pre_fields` varchar(255) COLLATE utf8mb4_bin NOT NULL DEFAULT '[]' COMMENT '前置字段，用于当前case的header和body的动态参数替换，例子：[{"field":"$.data.token","applyTo":"header"}]\n',
  `request_body` varchar(255) COLLATE utf8mb4_bin NOT NULL DEFAULT '{}' COMMENT '请求内容',
  `assert` varchar(255) COLLATE utf8mb4_bin NOT NULL DEFAULT '[]' COMMENT '断言，例子：[{"field":"$.code","predicate":"=","expect":"0","msg":"code不为0"}]\n',
  `pass` tinyint(1) DEFAULT NULL COMMENT '是否通过',
  `msg` varchar(128) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '断言结果',
  `response` text COLLATE utf8mb4_bin COMMENT '实际响应',
  `create_at` bigint(20) NOT NULL COMMENT '创建时间',
  `create_by` varchar(50) COLLATE utf8mb4_bin NOT NULL COMMENT '创建人',
  `start_at` bigint(20) DEFAULT NULL COMMENT '开始时间',
  `end_at` bigint(20) DEFAULT NULL COMMENT '结束时间',
  `cost` int(11) DEFAULT NULL COMMENT '耗时',
  `del` tinyint(1) NOT NULL DEFAULT '0' COMMENT '删除标记',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin COMMENT='api测试用例执行日志';

-- ----------------------------
-- Table structure for app
-- ----------------------------
DROP TABLE IF EXISTS `app`;
CREATE TABLE `app` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '应用名称',
  `create_at` bigint(20) NOT NULL COMMENT '创建时间',
  `create_by` varchar(50) COLLATE utf8mb4_bin NOT NULL COMMENT '创建人',
  `update_at` bigint(20) NOT NULL COMMENT '修改时间',
  `update_by` varchar(50) COLLATE utf8mb4_bin NOT NULL COMMENT '修改人',
  `del` tinyint(1) NOT NULL DEFAULT '0' COMMENT '是否删除',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin COMMENT='应用';

-- ----------------------------
-- Table structure for app_config
-- ----------------------------
DROP TABLE IF EXISTS `app_config`;
CREATE TABLE `app_config` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `app_id` int(20) NOT NULL COMMENT '应用id',
  `description` varchar(100) COLLATE utf8mb4_bin NOT NULL COMMENT '配置描述',
  `config_key` varchar(50) COLLATE utf8mb4_bin NOT NULL COMMENT '配置名称',
  `config_value` varchar(200) COLLATE utf8mb4_bin NOT NULL COMMENT '配置值',
  `create_at` bigint(20) NOT NULL COMMENT '创建时间',
  `create_by` varchar(50) COLLATE utf8mb4_bin NOT NULL COMMENT '创建人',
  `update_at` bigint(20) NOT NULL COMMENT '修改时间',
  `update_by` varchar(50) COLLATE utf8mb4_bin NOT NULL DEFAULT '' COMMENT '修改人',
  `del` tinyint(1) NOT NULL DEFAULT '0' COMMENT '是否删除',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_appid_configkey` (`app_id`,`config_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin COMMENT='应用配置';

-- ----------------------------
-- Table structure for sys_permission
-- ----------------------------
DROP TABLE IF EXISTS `sys_permission`;
CREATE TABLE `sys_permission` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `parent_id` int(11) NOT NULL DEFAULT '0' COMMENT '上级权限',
  `type` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '类型:API,Page,Button',
  `anon` tinyint(1) NOT NULL DEFAULT '0' COMMENT '是否支持匿名访问',
  `login` tinyint(1) NOT NULL DEFAULT '0' COMMENT '是否登录就能访问',
  `name` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '权限名称',
  `description` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '权限描述',
  `internal` tinyint(1) NOT NULL DEFAULT '0' COMMENT '是否内置权限，内置权限不允许修改和删除',
  `create_at` bigint(20) NOT NULL COMMENT '创建时间',
  `create_by` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '创建人',
  `update_at` bigint(20) NOT NULL COMMENT '更新时间',
  `update_by` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '更新人',
  `del` tinyint(1) NOT NULL DEFAULT '0' COMMENT '是否删除',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `uk_name` (`name`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='角色表';

-- ----------------------------
-- Table structure for sys_role
-- ----------------------------
DROP TABLE IF EXISTS `sys_role`;
CREATE TABLE `sys_role` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '角色名称',
  `description` varchar(1024) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '角色描述',
  `create_at` bigint(20) NOT NULL COMMENT '创建时间',
  `create_by` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '创建人',
  `update_at` bigint(20) NOT NULL COMMENT '更新时间',
  `update_by` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '更新人',
  `del` tinyint(1) NOT NULL DEFAULT '0' COMMENT '是否删除',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `uk_name` (`name`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='角色表';

-- ----------------------------
-- Table structure for sys_role_permission
-- ----------------------------
DROP TABLE IF EXISTS `sys_role_permission`;
CREATE TABLE `sys_role_permission` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `role_id` int(11) NOT NULL COMMENT '角色ID',
  `permission_id` int(11) NOT NULL COMMENT '权限ID',
  `create_at` bigint(20) NOT NULL COMMENT '创建时间',
  `create_by` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '创建人',
  `update_at` bigint(20) NOT NULL COMMENT '更新时间',
  `update_by` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '更新人',
  `del` tinyint(1) NOT NULL DEFAULT '0' COMMENT '是否删除',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `uk_roleid_permid` (`role_id`,`permission_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='角色权限表';

-- ----------------------------
-- Table structure for sys_user
-- ----------------------------
DROP TABLE IF EXISTS `sys_user`;
CREATE TABLE `sys_user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(64) NOT NULL DEFAULT '' COMMENT '管理员名称',
  `password` varchar(100) NOT NULL DEFAULT '' COMMENT '管理员密码',
  `mfa_key` varchar(128) NOT NULL DEFAULT '' COMMENT '虚拟设备密钥',
  `nickname` varchar(64) NOT NULL DEFAULT '' COMMENT '昵称',
  `phone` varchar(11) NOT NULL DEFAULT '' COMMENT '手机号',
  `email` varchar(255) NOT NULL DEFAULT '' COMMENT '邮箱地址',
  `last_login_ip` varchar(63) NOT NULL DEFAULT '' COMMENT '最近一次登录IP地址',
  `last_login_time` bigint(20) DEFAULT NULL COMMENT '最近一次登录时间',
  `avatar` varchar(255) NOT NULL DEFAULT '' COMMENT '头像图片',
  `super_admin` tinyint(1) NOT NULL DEFAULT '0' COMMENT '是否是超级管理员',
  `create_at` bigint(20) NOT NULL COMMENT '创建时间',
  `create_by` varchar(50) NOT NULL COMMENT '创建人',
  `update_at` bigint(20) NOT NULL COMMENT '更新时间',
  `update_by` varchar(50) NOT NULL COMMENT '更新人',
  `del` tinyint(1) NOT NULL DEFAULT '0' COMMENT '是否删除',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `uk_username` (`username`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='管理员表';

-- ----------------------------
-- Table structure for sys_user_role
-- ----------------------------
DROP TABLE IF EXISTS `sys_user_role`;
CREATE TABLE `sys_user_role` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL COMMENT '用户ID',
  `role_id` int(11) NOT NULL COMMENT '角色ID',
  `create_at` bigint(20) NOT NULL COMMENT '创建时间',
  `create_by` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '创建人',
  `update_at` bigint(20) NOT NULL COMMENT '更新时间',
  `update_by` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '更新人',
  `del` tinyint(1) NOT NULL DEFAULT '0' COMMENT '是否删除',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `uk_uid_rid` (`user_id`,`role_id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='角色表';

SET FOREIGN_KEY_CHECKS = 1;
