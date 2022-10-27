const express = require('express');
const router = express.Router();

const appController = require('../controllers/AppController');
const expressJoi = require('@escook/express-joi');
const AppCheck = require('../utils/AppCheck');


/**
 * @openapi
 * /api/v1/app/add:
 *  post:
 *    tags:
 *      - 应用模块
 *    summary: 创建应用
 *    description: 创建应用
 *    parameters:
 *      - name: Authorization
 *        type: string
 *        description: jwt
 *        in: header
 *        required: true
 *    requestBody:
 *      description: 应用信息
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties: 
 *              name:
 *                type: string
 *                required: true
 *    produces: 
 *      - application/json 
 *    responses:
 *      200:
 *        description: OK
 * 
 */
router.post('/add',expressJoi(AppCheck.appAddCheck),appController.addApp);

/**
 * @openapi
 * /api/v1/app/delete:
 *  post:
 *    tags:
 *      - 应用模块
 *    summary: 删除应用
 *    description: 删除应用
 *    parameters:
 *      - name: Authorization
 *        type: string
 *        description: jwt
 *        in: header
 *        required: true
 *    requestBody:
 *      description: 应用信息
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties: 
 *              id:
 *                type: integer
 *                required: true
 *                description: 应用id
 *    produces: 
 *      - application/json 
 *    responses:
 *      200:
 *        description: OK
 * 
 */
router.post('/delete',expressJoi(AppCheck.appDeleteCheck),appController.deleteApp);

/**
 * @openapi
 * /api/v1/app/update:
 *  post:
 *    tags:
 *      - 应用模块
 *    summary: 修改应用
 *    description: 修改应用
 *    parameters:
 *      - name: Authorization
 *        type: string
 *        description: jwt
 *        in: header
 *        required: true
 *    requestBody:
 *      description: 应用信息
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties: 
 *              id:
 *                type: integer
 *                required: true
 *                description: 应用id
 *              name:
 *                type: string
 *                required: true
 *                description: 应用名称
 *    produces: 
 *      - application/json 
 *    responses:
 *      200:
 *        description: OK
 * 
 */
router.post('/update',expressJoi(AppCheck.appUpdateCheck),appController.updateApp);

/**
 * @openapi
 * /api/v1/app/query:
 *  get:
 *    tags:
 *      - 应用模块
 *    summary: 查询应用
 *    description: 查询应用
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
 *    produces: 
 *      - application/json 
 *    responses:
 *      200:
 *        description: OK
 * 
 */
router.get('/query',expressJoi(AppCheck.appQueryCheck),appController.queryApp);

module.exports = router;