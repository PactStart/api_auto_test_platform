const express = require('express');
const router = express.Router();

const apiTestPlanController = require('../controllers/ApiTestPlanController');
const expressJoi = require('@escook/express-joi');
const ApiTestPlanCheck = require('../utils/ApiTestPlanCheck');

/**
 * @openapi
 * /api/v1/testPlan/add:
 *  post:
 *    tags:
 *      - 测试计划模块
 *    summary: 创建测试计划
 *    description: 创建测试计划
 *    parameters:
 *      - name: Authorization
 *        type: string
 *        description: jwt
 *        in: header
 *        required: true
 *    requestBody:
 *      description: 测试计划
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties: 
 *              appId:
 *                type: string
 *                required: true
 *                description: 应用id
 *              chooseAllCase:
 *                type: boolean
 *                required: true
 *                description: 是否选择所有的用例
 *              caseIds:
 *                type: array
 *                required: false
 *                items:
 *                  type: integer
 *                description: 需要执行的用例id数组,如果chooseAllCase为false，必填
 *              baseUrl:
 *                type: string
 *                required: true
 *                description: 接口base_url
 *              name:
 *                type: string
 *                required: true
 *                description: 计划名称
 *    produces: 
 *      - application/json 
 *    consumes: 
 *      - application/json
 *    responses:
 *      200:
 *        description: OK
 * 
 */
router.post('/add',expressJoi(ApiTestPlanCheck.apiTestPlanAddCheck),apiTestPlanController.addApiTestPlan);

/**
 * @openapi
 * /api/v1/testPlan/delete:
 *  post:
 *    tags:
 *      - 测试计划模块
 *    summary: 删除测试计划
 *    description: 删除测试计划
 *    parameters:
 *      - name: Authorization
 *        type: string
 *        description: jwt
 *        in: header
 *        required: true
 *    requestBody:
 *      description: 计划id
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties: 
 *              id:
 *                type: integer
 *                required: true
 *                description: 计划id
 *    produces: 
 *      - application/json
 *    consumes: 
 *      - application/json
 *    responses:
 *      200:
 *        description: OK
 * 
 */
router.post('/delete',expressJoi(ApiTestPlanCheck.apiTestPlanDeleteCheck),apiTestPlanController.deleteApiTestPlan);

/**
 * @openapi
 * /api/v1/testPlan/query:
 *  get:
 *    tags:
 *      - 测试计划模块
 *    summary: 查询测试计划
 *    description: 查询测试计划
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
 *      - name: name
 *        type: string
 *        description: 计划名称
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
router.get('/query',expressJoi(ApiTestPlanCheck.apiTestPlanQueryCheck),apiTestPlanController.queryApiTestPlan);

/**
 * @openapi
 * /api/v1/testPlan/queryRunResult:
 *  get:
 *    tags:
 *      - 测试计划模块
 *    summary: 查询测试报告
 *    description: 查询测试报告
 *    parameters:
 *      - name: Authorization
 *        type: string
 *        description: jwt
 *        in: header
 *        required: true
 *      - name: planId
 *        type: integer
 *        description: 计划id
 *        in: query
 *      - name: caseId
 *        type: integer
 *        description: 用例id
 *        in: query
 *      - name: pass
 *        type: boolean
 *        description: 是否执行通过
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
 *    consumes: 
 *      - application/json
 *    responses:
 *      200:
 *        description: OK
 * 
 */
router.get('/queryRunResult',expressJoi(ApiTestPlanCheck.apiTestPlanRunResultQueryCheck),apiTestPlanController.queryApiTestPlanRunResult);

module.exports = router;