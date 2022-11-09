const express = require('express');
const router = express.Router();

const permissionController = require('../controllers/PermissionController');

const expressJoi = require('@escook/express-joi');
const permissionCheck = require('../utils/PermissionCheck');

/**
 * @openapi
 * /api/v1/permission/add:
 *  post:
 *    tags:
 *      - 权限模块
 *    summary: 创建权限
 *    description: 创建权限
 *    parameters:
 *      - name: Authorization
 *        type: string
 *        description: jwt
 *        in: header
 *        required: true
 *    requestBody:
 *      description: 权限信息
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties: 
 *              parent_id:
 *                type: integer
 *                required: true
 *                description: 上级权限id
 *              type:
 *                type: string
 *                required: true
 *                description: 权限类型
 *              anon:
 *                type: boolean
 *                required: true
 *                description: 是否匿名即可访问
 *              name:
 *                type: string
 *                required: true
 *                description: 权限名称，要求唯一
 *              description:
 *                type: string
 *                required: true
 *                description: 权限描述
 *              internal:
 *                type: boolean
 *                required: true
 *                description: 是否内置权限
 * 
 *    produces: 
 *      - application/json 
 *    consumes: 
 *      - application/json 
 *    responses:
 *      200:
 *        description: OK
 * 
 */
router.post('/add',expressJoi(permissionCheck.permissionAddCheck),permissionController.addPermission);

/**
 * @openapi
 * /api/v1/permission/delete:
 *  post:
 *    tags:
 *      - 权限模块
 *    summary: 删除权限
 *    description: 删除权限
 *    parameters:
 *      - name: Authorization
 *        type: string
 *        description: jwt
 *        in: header
 *        required: true
 *    requestBody:
 *      description: 权限id
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties: 
 *              id:
 *                type: integer
 *                required: true
 *                description: 权限id
 *    produces: 
 *      - application/json 
 *    consumes: 
 *      - application/json 
 *    responses:
 *      200:
 *        description: OK
 * 
 */
router.post('/delete',expressJoi(permissionCheck.permissionDeleteCheck),permissionController.deletePermission);

/**
 * @openapi
 * /api/v1/permission/update:
 *  post:
 *    tags:
 *      - 权限模块
 *    summary: 修改权限
 *    description: 修改权限
 *    parameters:
 *      - name: Authorization
 *        type: string
 *        description: jwt
 *        in: header
 *        required: true
 *    requestBody:
 *      description: 权限信息
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties: 
 *              id:
 *                type: integer
 *                required: true
 *                description: 权限id
 *              type:
 *                type: string
 *                required: true
 *                description: 权限类型
 *              anon:
 *                type: boolean
 *                required: true
 *                description: 是否匿名即可访问
 *              name:
 *                type: string
 *                required: true
 *                description: 权限名称，要求唯一
 *              description:
 *                type: string
 *                required: true
 *                description: 权限描述
 *    produces: 
 *      - application/json 
 *    consumes: 
 *      - application/json 
 *    responses:
 *      200:
 *        description: OK
 * 
 */
router.post('/update',expressJoi(permissionCheck.permissionUpdateCheck),permissionController.updatePermission);

/**
 * @openapi
 * /api/v1/permission/query:
 *  get:
 *    tags:
 *      - 权限模块
 *    summary: 查询权限
 *    description: 查询权限
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
 *      - name: type
 *        type: string
 *        description: 权限类型
 *        in: query
 *      - name: anon
 *        type: boolean
 *        description: 是否支持匿名访问
 *        in: query
 *      - name: internal
 *        type: boolean
 *        description: 是否是内部权限
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
router.get('/query',expressJoi(permissionCheck.permissionQueryCheck),permissionController.queryPermission);

/**
 * @openapi
 * /api/v1/permission/importApiPerms:
 *  post:
 *    tags:
 *      - 权限模块
 *    summary: 根据API接口文档地址，批量导入API权限点
 *    description: 根据API接口文档地址，批量导入API权限点
 *    parameters:
 *      - name: Authorization
 *        type: string
 *        description: jwt
 *        in: header
 *        required: true
 *    requestBody:
 *      description: 权限信息
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties: 
 *              url:
 *                type: string
 *                required: true
 *                description: swagger api地址
 *    produces: 
 *      - application/json 
 *    consumes: 
 *      - application/json 
 *    responses:
 *      200:
 *        description: OK
 * 
 */
 router.post('/importApiPerms',expressJoi(permissionCheck.apiPermsImportCheck),permissionController.importApiPermission);

/**
 * @openapi
 * /api/v1/permission/importPagePerms:
 *  post:
 *    tags:
 *      - 权限模块
 *    summary: 批量导入页面权限点
 *    description: 批量导入页面权限点
 *    parameters:
 *      - name: Authorization
 *        type: string
 *        description: jwt
 *        in: header
 *        required: true
 *    requestBody:
 *      description: 权限信息
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties: 
 *              pages:
 *                type: array
 *                required: true
 *                description: 页面数组
 *    produces: 
 *      - application/json 
 *    consumes: 
 *      - application/json 
 *    responses:
 *      200:
 *        description: OK
 * 
 */
 router.post('/importPagePerms',permissionController.importPagePermission);

module.exports = router;