const express = require('express');
const router = express.Router();

const apiController = require('../controllers/ApiController');

const expressJoi = require('@escook/express-joi');
const ApiCheck = require('../utils/ApiCheck');

/**
 * @openapi
 * /api/v1/api/add:
 *  post:
 *    tags:
 *      - API模块
 *    summary: 创建API
 *    description: 创建API
 *    parameters:
 *      - name: Authorization
 *        type: string
 *        description: jwt
 *        in: header
 *        required: true
 *    requestBody:
 *      description: API信息
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties: 
 *              appId:
 *                type: string
 *                required: true
 *                description: 应用id
 *              groupName:
 *                type: string
 *                required: true
 *                description: 分组名称
 *              moduleName:
 *                type: string
 *                required: true
 *                description: 模块名称
 *              apiName:
 *                type: string
 *                required: true
 *                description: api名称
 *              url:
 *                type: string
 *                required: true
 *                description: api路径
 *              requestMethod:
 *                type: string
 *                required: true
 *                description: 请求方式，get|post
 *              contentType:
 *                type: string
 *                required: true
 *                description: 请求格式，x-www-form-url-encoded | application/json | none
 *    produces: 
 *      - application/json 
 *    consumes: 
 *      - application/json
 *    responses:
 *      200:
 *        description: OK
 * 
 */
router.post('/add',expressJoi(ApiCheck.apiAddCheck),apiController.addApi);

/**
 * @openapi
 * /api/v1/api/delete:
 *  post:
 *    tags:
 *      - API模块
 *    summary: 删除API
 *    description: 删除API
 *    parameters:
 *      - name: Authorization
 *        type: string
 *        description: jwt
 *        in: header
 *        required: true
 *    requestBody:
 *      description: API信息
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties: 
 *              id:
 *                type: integer
 *                required: true
 *                description: APIid
 *    produces: 
 *      - application/json
 *    consumes: 
 *      - application/json
 *    responses:
 *      200:
 *        description: OK
 * 
 */
router.post('/delete',expressJoi(ApiCheck.apiDeleteCheck),apiController.deleteApi);

/**
 * @openapi
 * /api/v1/api/update:
 *  post:
 *    tags:
 *      - API模块
 *    summary: 修改API
 *    description: 修改API
 *    parameters:
 *      - name: Authorization
 *        type: string
 *        description: jwt
 *        in: header
 *        required: true
 *    requestBody:
 *      description: API信息
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties: 
 *              id:
 *                type: integer
 *                required: true
 *                description: id
 *              groupName:
 *                type: string
 *                required: true
 *                description: 分组名称
 *              moduleName:
 *                type: string
 *                required: true
 *                description: 模块名称
 *              apiName:
 *                type: string
 *                required: true
 *                description: api名称
 *              url:
 *                type: string
 *                required: true
 *                description: api路径
 *              requestMethod:
 *                type: string
 *                required: true
 *                description: 请求方式，get|post
 *              contentType:
 *                type: string
 *                required: true
 *                description: 请求格式，x-www-form-url-encoded | application/json | none
 *    produces: 
 *      - application/json
 *    consumes: 
 *      - application/json
 *    responses:
 *      200:
 *        description: OK
 * 
 */
router.post('/update',expressJoi(ApiCheck.apiUpdateCheck),apiController.updateApi);

/**
 * @openapi
 * /api/v1/api/query:
 *  get:
 *    tags:
 *      - API模块
 *    summary: 查询API
 *    description: 查询API
 *    parameters:
 *      - name: Authorization
 *        type: string
 *        description: jwt
 *        in: header
 *        required: true
 *      - name: groupName
 *        type: string
 *        description: 分组名称
 *        in: query
 *      - name: moduleName
 *        type: string
 *        description: 模块名称
 *        in: query
 *      - name: keyword
 *        type: string
 *        description: api名称
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
router.get('/query',expressJoi(ApiCheck.apiQueryCheck),apiController.queryApi);

/**
 * @openapi
 * /api/v1/api/import:
 *  post:
 *    tags:
 *      - API模块
 *    summary: 导入swagger api
 *    description: 导入swagger api
 *    parameters:
 *      - name: Authorization
 *        type: string
 *        description: jwt
 *        in: header
 *        required: true
 *    requestBody:
 *      description: swagger api url
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties: 
 *              app_id:
 *                type: integer
 *                required: true
 *                description: 应用id
 *              url:
 *                type: string
 *                required: true
 *                description: api文档地址
 *    produces: 
 *      - application/json 
 *    consumes: 
 *      - application/json
 *    responses:
 *      200:
 *        description: OK
 * 
 */
router.post('/import',expressJoi(ApiCheck.apiImportCheck),apiController.importSwaggerApi);


module.exports = router;