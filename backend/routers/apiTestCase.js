const express = require('express');
const router = express.Router();

const apiTestCaseController = require('../controllers/ApiTestCaseController');
const expressJoi = require('@escook/express-joi');
const ApiTestCaseCheck = require('../utils/ApiTestCaseCheck');

/**
 * @openapi
 * /api/v1/testCase/add:
 *  post:
 *    tags:
 *      - 测试用例模块
 *    summary: 创建测试用例
 *    description: 创建测试计划
 *    parameters:
 *      - name: Authorization
 *        type: string
 *        description: jwt
 *        in: header
 *        required: true
 *    requestBody:
 *      description: 测试用例信息
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties: 
 *              appId:
 *                type: string
 *                required: true
 *                description: 应用id
 *              apiId:
 *                type: integer
 *                required: true
 *                description: 接口id
 *              name:
 *                type: string
 *                required: true
 *                description: 用例名称
 *              run:
 *                type: boolean
 *                required: true
 *                description: 是否运行
 *              headers:
 *                type: string
 *                required: true
 *                description: 请求头，json格式字符串
 *              preCasId:
 *                type: integer
 *                description: 前置用例id
 *              preFields:
 *                type: string
 *                description: 前置用例字段，json格式字符串
 *              requestBody:
 *                type: string
 *                description: 请求数据，如果是get接口，会放在查询字符串中；如果是post+json接口，数据会放在body中；如果是post表单接口，会放在表单中
 *              assert:
 *                type: string
 *                required: true
 *                description: 断言
 *    produces: 
 *      - application/json
 *    consumes: 
 *      - application/json
 *    responses:
 *      200:
 *        description: OK
 * 
 */
router.post('/add',expressJoi(ApiTestCaseCheck.apiTestCaseAddCheck),apiTestCaseController.addApiTestCase);

/**
 * @openapi
 * /api/v1/testCase/delete:
 *  post:
 *    tags:
 *      - 测试用例模块
 *    summary: 删除测试用例
 *    description: 删除测试用例
 *    parameters:
 *      - name: Authorization
 *        type: string
 *        description: jwt
 *        in: header
 *        required: true
 *    requestBody:
 *      description: 用例id
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties: 
 *              id:
 *                type: integer
 *                required: true
 *                description: 用例id
 *    produces: 
 *      - application/json 
 *    consumes: 
 *      - application/json
 *    responses:
 *      200:
 *        description: OK
 * 
 */
router.post('/delete',expressJoi(ApiTestCaseCheck.apiTestCaseDeleteCheck),apiTestCaseController.deleteApiTestCase);

/**
 * @openapi
 * /api/v1/testCase/update:
 *  post:
 *    tags:
 *      - 测试用例模块
 *    summary: 修改测试用例
 *    description: 修改测试用例
 *    parameters:
 *      - name: Authorization
 *        type: string
 *        description: jwt
 *        in: header
 *        required: true
 *    requestBody:
 *      description: 用例信息
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties: 
 *              id:
 *                type: integer
 *                required: true
 *                description: 用例id
 *              name:
 *                type: string
 *                required: true
 *                description: 用例名称
 *              run:
 *                type: boolean
 *                required: true
 *                description: 是否运行
 *              headers:
 *                type: string
 *                required: true
 *                description: 请求头，json格式字符串
 *              preCaseId:
 *                type: integer
 *                description: 前置用例id
 *              preFields:
 *                type: string
 *                description: 前置用例字段，json格式字符串
 *              requestBody:
 *                type: string
 *                description: 请求数据，如果是get接口，会放在查询字符串中；如果是post+json接口，数据会放在body中；如果是post表单接口，会放在表单中
 *              assert:
 *                type: string
 *                required: true
 *                description: 断言
 *    produces: 
 *      - application/json 
 *    consumes: 
 *      - application/json
 *    responses:
 *      200:
 *        description: OK
 * 
 */
router.post('/update',expressJoi(ApiTestCaseCheck.apiTestCaseUpdateCheck),apiTestCaseController.updateApiTestCase);

/**
 * @openapi
 * /api/v1/testCase/query:
 *  get:
 *    tags:
 *      - 测试用例模块
 *    summary: 查询测试用例
 *    description: 查询测试用例
 *    parameters:
 *      - name: Authorization
 *        type: string
 *        description: jwt
 *        in: header
 *        required: true
 *      - name: appId
 *        type: string
 *        description: 应用id
 *        in: query
 *      - name: apiId
 *        type: string
 *        description: 接口id
 *        in: query
 *      - name: run
 *        type: boolean
 *        description: 是否运行
 *        in: query
 *      - name: name
 *        type: string
 *        description: 用例名称
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
router.get('/query',expressJoi(ApiTestCaseCheck.apiTestCaseQueryCheck),apiTestCaseController.queryApiTestCase);


/**
 * @openapi
 * /api/v1/testCase/createDefault:
 *  post:
 *    tags:
 *      - 测试用例模块
 *    summary: 为api创建默认的测试用例
 *    description: 为api创建默认的测试用例
 *    parameters:
 *      - name: Authorization
 *        type: string
 *        description: jwt
 *        in: header
 *        required: true
 *    requestBody:
 *      description: API id
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties: 
 *              id:
 *                type: integer
 *                required: true
 *                description: API id
 *    produces: 
 *      - application/json 
 *    consumes: 
 *      - application/json
 *    responses:
 *      200:
 *        description: OK
 * 
 */
 router.post('/delete',expressJoi(ApiTestCaseCheck.apiTestCaseDeleteCheck),apiTestCaseController.deleteApiTestCase);

 /**
 * @openapi
 * /api/v1/testCase/createDefaultForAll:
 *  post:
 *    tags:
 *      - 测试用例模块
 *    summary: 为应用的所有api创建默认的测试用例
 *    description: 为应用的所有api创建默认的测试用例
 *    parameters:
 *      - name: Authorization
 *        type: string
 *        description: jwt
 *        in: header
 *        required: true
 *    requestBody:
 *      description: 用例id
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties: 
 *              appId:
 *                type: integer
 *                required: true
 *                description: 应用id
 *    produces: 
 *      - application/json 
 *    consumes: 
 *      - application/json
 *    responses:
 *      200:
 *        description: OK
 * 
 */
router.post('/createDefaultForAll',expressJoi(ApiTestCaseCheck.apiTestCaseCreateDefaultForAllCheck),apiTestCaseController.createDefaultForAll);


/**
 * @openapi
 * /api/v1/testCase/bactchSetPreCase:
 *  post:
 *    tags:
 *      - 测试用例模块
 *    summary: 为应用的所有api设置默认前置用例
 *    description: 为应用的所有api设置默认前置用例
 *    parameters:
 *      - name: Authorization
 *        type: string
 *        description: jwt
 *        in: header
 *        required: true
 *    requestBody:
 *      description: 用例id
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties: 
 *              appId:
 *                type: integer
 *                required: true
 *                description: 应用id
 *              preCaseId:
 *                type: integer
 *                required: true
 *                description: 用例id
 *              preFields:
 *                type: string
 *                required: true
 *                description: 前置字段
 *    produces: 
 *      - application/json 
 *    consumes: 
 *      - application/json
 *    responses:
 *      200:
 *        description: OK
 * 
 */
 router.post('/bactchSetPreCase',expressJoi(ApiTestCaseCheck.apiTestCaseBatchSetPreCaseCheck),apiTestCaseController.batchSetPreCase);

module.exports = router;