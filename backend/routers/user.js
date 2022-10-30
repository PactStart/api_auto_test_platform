const express = require('express');
const router = express.Router();

const userController = require('../controllers/UserController');
const expressJoi = require('@escook/express-joi');
const UserCheck = require('../utils/UserCheck');

/**
 * @openapi
 * /api/v1/user/login:
 *  post:
 *    tags:
 *      - 用户模块
 *    summary: 登录
 *    description: 账号密码登录
 *    requestBody:
 *      description: 账号密码信息
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties: 
 *              username:
 *                type: string
 *                required: true
 *              password:
 *                type: string
 *                required: true
 *    produces: 
 *      - application/json 
 *    consumes: 
 *      - application/json 
 *    responses:
 *      200:
 *        description: OK
 * 
 */
router.post('/login', expressJoi(UserCheck.userLoginCheck), userController.loginByUserName);

/**
 * @openapi
 * /api/v1/user/logout:
 *  get:
 *    tags:
 *      - 用户模块
 *    summary: 退出登录
 *    description: 退出登录
 *    parameters:
 *      - name: Authorization
 *        type: string
 *        description: jwt
 *        in: header
 *    produces: 
 *      - application/json 
 *    responses:
 *      200:
 *        description: OK
 * 
 */
 router.get('/logout', userController.logout);

 /**
 * @openapi
 * /api/v1/user/resetPwd:
 *  post:
 *    tags:
 *      - 用户模块
 *    summary: 重置密码
 *    description: 重置密码
 *    parameters:
 *      - name: Authorization
 *        type: string
 *        description: jwt
 *        in: header
 *      
 *    requestBody:
 *      description: 账号密码信息
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties: 
 *              oldPassword:
 *                type: string
 *                description: 旧密码
 *                required: true
 *              newPassword:
 *                type: string
 *                description: 新密码
 *                required: true
 *    produces: 
 *      - application/json 
 *    consumes: 
 *      - application/json 
 *    responses:
 *      200:
 *        description: OK
 * 
 */
  router.post('/resetPwd',expressJoi(UserCheck.userResetPwdCheck), userController.resetPwd);


/**
 * @openapi
 * /api/v1/user/userInfo:
 *  get:
 *    tags:
 *      - 用户模块
 *    summary: 获取当前登录用户的信息
 *    description: 登录后调用获取个人信息，包括当前用户的权限信息
 *    parameters:
 *      - name: Authorization
 *        type: string
 *        description: jwt
 *        in: header
 *    responses:
 *      200:
 *        description: 成功返回用户信息
 */
router.get('/userInfo',  userController.userInfo);

/**
 * @openapi
 * /api/v1/user/add:
 *  post:
 *    tags:
 *      - 用户模块
 *    summary: 创建用户
 *    description: 通过账号、初始密码、昵称创建一个新用户
 *    parameters:
 *      - name: Authorization
 *        type: string
 *        description: jwt
 *        in: header
 *    requestBody:
 *      description: 账号密码和昵称信息
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties: 
 *              username:
 *                type: string
 *                required: true
 *              password:
 *                type: string
 *                required: true
 *              nickname:
 *                type: string
 *                required: true
 *    produces: 
 *      - application/json 
 *    consumes: 
 *      - application/json 
 *    responses:
 *      200:
 *        description: OK
 */
router.post('/add',expressJoi(UserCheck.userAddCheck), userController.addUser);

/**
 * @openapi
 * /api/v1/user/delete:
 *  post:
 *    tags:
 *      - 用户模块
 *    summary: 删除用户
 *    description: 通过id删除用户
 *    parameters:
 *      - name: Authorization
 *        type: string
 *        description: jwt
 *        in: header
 *    requestBody:
 *      description: 用户id
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties: 
 *              id:
 *                type: integer
 *                description: 用户id
 *                required: true
 *    produces: 
 *      - application/json 
 *    consumes: 
 *      - application/json 
 *    responses:
 *      200:
 *        description: OK
 */
router.post('/delete',expressJoi(UserCheck.userDeleteCheck), userController.deleteUser);

/**
 * @openapi
 * /api/v1/user/update:
 *  post:
 *    tags:
 *      - 用户模块
 *    summary: 修改用户信息
 *    description: 修改个人信息，只有超级管理员能修改其他人的信息
 *    parameters:
 *      - name: Authorization
 *        type: string
 *        description: jwt
 *        in: header
 *    requestBody:
 *      description: 用户
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties: 
 *              id:
 *                type: integer
 *                description: 用户id
 *                required: true
 *              phone:
 *                type: string
 *                description: 手机号
 *              email:
 *                type: string
 *                description: 邮箱
 *    produces: 
 *      - application/json 
 *    consumes: 
 *      - application/json 
 *    responses:
 *      200:
 *        description: OK
 */
router.post('/update', expressJoi(UserCheck.userUpdateCheck), userController.updateUser);

/**
 * @openapi
 * /api/v1/user/query:
 *  get:
 *    tags:
 *      - 用户模块
 *    summary: 分页查询用户
 *    description: 分页查询用户
 *    parameters:
 *      - name: Authorization
 *        type: string
 *        description: jwt
 *        in: header
 *        required: true
 *      - name: keyword
 *        type: string
 *        description: 关键字
 *        in: query
 *      - name: page
 *        type: integer
 *        description: 第几页
 *        required: true
 *        in: query
 *      - name: size
 *        type: integer
 *        description: 每页大小
 *        required: true
 *        in: query
 *    responses:
 *      200:
 *        description: OK
 */
router.get('/query', expressJoi(UserCheck.userQueryCheck), userController.queryUser);

module.exports = router;