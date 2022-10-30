const express = require('express');
const router = express.Router();

const appConfigController = require('../controllers/appConfigController');

const expressJoi = require('@escook/express-joi');
const AppConfigCheck = require('../utils/AppConfigCheck');

/**
 * @openapi
 * /api/v1/appConfig/add:
 *  post:
 *    tags:
 *      - 应用配置模块
 *    summary: 创建应用配置
 *    description: 创建应用配置
 *    parameters:
 *      - name: Authorization
 *        type: string
 *        description: jwt
 *        in: header
 *        required: true
 *    requestBody:
 *      description: 应用配置信息
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties: 
 *              appId:
 *                type: string
 *                required: true
 *                description: 应用id
 *              configKey:
 *                type: string
 *                required: true
 *                description: 配置名称
 *              configValue:
 *                type: string
 *                required: true
 *                description: 配置值
 *    produces: 
 *      - application/json 
 *    consumes: 
 *      - application/json 
 *    responses:
 *      200:
 *        description: OK
 * 
 */
router.post('/add',expressJoi(AppConfigCheck.appConfigAddCheck),appConfigController.addAppConfig);

/**
 * @openapi
 * /api/v1/appConfig/delete:
 *  post:
 *    tags:
 *      - 应用配置模块
 *    summary: 删除应用配置
 *    description: 删除应用配置
 *    parameters:
 *      - name: Authorization
 *        type: string
 *        description: jwt
 *        in: header
 *        required: true
 *    requestBody:
 *      description: 应用配置信息
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties: 
 *              id:
 *                type: integer
 *                required: true
 *                description: 应用配置id
 *    produces: 
 *      - application/json 
 *    consumes: 
 *      - application/json 
 *    responses:
 *      200:
 *        description: OK
 * 
 */
router.post('/delete',expressJoi(AppConfigCheck.appConfigAddCheck),appConfigController.deleteAppConfig);

/**
 * @openapi
 * /api/v1/appConfig/update:
 *  post:
 *    tags:
 *      - 应用配置模块
 *    summary: 修改应用配置
 *    description: 修改应用配置
 *    parameters:
 *      - name: Authorization
 *        type: string
 *        description: jwt
 *        in: header
 *        required: true
 *    requestBody:
 *      description: 应用配置信息
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties: 
 *              id:
 *                type: integer
 *                required: true
 *                description: 应用配置id
 *              configKey:
 *                type: string
 *                required: true
 *                description: 配置名称
 *              configValue:
 *                type: string
 *                required: true
 *                description: 配置值
 *    produces: 
 *      - application/json 
 *    consumes: 
 *      - application/json
 *    responses:
 *      200:
 *        description: OK
 * 
 */
router.post('/update',expressJoi(AppConfigCheck.appConfigUpdateCheck),appConfigController.updateAppConfig);

/**
 * @openapi
 * /api/v1/appConfig/query:
 *  get:
 *    tags:
 *      - 应用配置模块
 *    summary: 查询应用配置
 *    description: 查询应用配置
 *    parameters:
 *      - name: Authorization
 *        type: string
 *        description: jwt
 *        in: header
 *        required: true
 *      - name: appId
 *        type: integer
 *        description: 应用id
 *        in: query
 *      - name: configName
 *        type: string
 *        description: 配置名称
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
 *    produces: 
 *      - application/json 
 *    responses:
 *      200:
 *        description: OK
 * 
 */
router.get('/query',expressJoi(AppConfigCheck.appConfigQueryCheck),appConfigController.queryAppConfig);

module.exports = router;