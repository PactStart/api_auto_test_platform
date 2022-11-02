const express = require('express');
const router = express.Router();

const roleController = require('../controllers/RoleController');

const expressJoi = require('@escook/express-joi');
const RoleCheck = require('../utils/RoleCheck');

/**
 * @openapi
 * /api/v1/role/add:
 *  post:
 *    tags:
 *      - 角色模块
 *    summary: 创建角色
 *    description: 创建角色
 *    parameters:
 *      - name: Authorization
 *        type: string
 *        description: jwt
 *        in: header
 *        required: true
 *    requestBody:
 *      description: 角色信息
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties: 
 *              name:
 *                type: string
 *                required: true
 *              description:
 *                type: string
 *                required: true
 *    produces: 
 *      - application/json 
 *    responses:
 *      200:
 *        description: OK
 * 
 */
router.post('/add',expressJoi(RoleCheck.roleAddCheck),roleController.addRole);

/**
 * @openapi
 * /api/v1/role/delete:
 *  post:
 *    tags:
 *      - 角色模块
 *    summary: 删除角色
 *    description: 删除角色
 *    parameters:
 *      - name: Authorization
 *        type: string
 *        description: jwt
 *        in: header
 *        required: true
 *    requestBody:
 *      description: 角色信息
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties: 
 *              id:
 *                type: integer
 *                required: true
 *                description: 角色id
 *    produces: 
 *      - application/json 
 *    responses:
 *      200:
 *        description: OK
 * 
 */
router.post('/delete',expressJoi(RoleCheck.roleDeleteCheck),roleController.deleteRole);

/**
 * @openapi
 * /api/v1/role/update:
 *  post:
 *    tags:
 *      - 角色模块
 *    summary: 修改角色
 *    description: 修改角色
 *    parameters:
 *      - name: Authorization
 *        type: string
 *        description: jwt
 *        in: header
 *        required: true
 *    requestBody:
 *      description: 角色信息
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties: 
 *              id:
 *                type: integer
 *                required: true
 *                description: 角色id
 *              description:
 *                type: string
 *                required: true
 *                description: 角色描述
 *    produces: 
 *      - application/json 
 *    consumes: 
 *      - application/json 
 *    responses:
 *      200:
 *        description: OK
 * 
 */
router.post('/update',expressJoi(RoleCheck.roleUpdateCheck),roleController.updateRole);

/**
 * @openapi
 * /api/v1/role/query:
 *  get:
 *    tags:
 *      - 角色模块
 *    summary: 查询角色
 *    description: 查询角色
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
router.get('/query',expressJoi(RoleCheck.roleQueryCheck),roleController.queryRole);

/**
 * @openapi
 * /api/v1/role/assignPermissions:
 *  post:
 *    tags:
 *      - 角色模块
 *    summary: 给角色设置权限（删除已有，重新设置）
 *    description: 给角色设置权限（删除已有，重新设置）
 *    parameters:
 *      - name: Authorization
 *        type: string
 *        description: jwt
 *        in: header
 *        required: true
 *    requestBody:
 *      description: 角色id和权限id数组
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties: 
 *              roleId:
 *                type: integer
 *                required: true
 *                description: 角色id
 *              permissionIds:
 *                type: array
 *                required: true
 *                description: 权限id数组
 *    produces: 
 *      - application/json 
 *    consumes: 
 *      - application/json 
 *    responses:
 *      200:
 *        description: OK
 * 
 */
router.post('/assignPermissions',expressJoi(RoleCheck.rolePermissionsCheck),roleController.assignPermissions);

/**
 * @openapi
 * /api/v1/role/removePermissions:
 *  post:
 *    tags:
 *      - 角色模块
 *    summary: 角色绑定权限
 *    description: 角色绑定权限
 *    parameters:
 *      - name: Authorization
 *        type: string
 *        description: jwt
 *        in: header
 *        required: true
 *    requestBody:
 *      description: 角色id和权限id数组
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties: 
 *              roleId:
 *                type: integer
 *                required: true
 *                description: 角色id
 *              permissionIds:
 *                type: array
 *                required: true
 *                description: 权限id数组
 *    produces: 
 *      - application/json 
 *    consumes: 
 *      - application/json 
 *    responses:
 *      200:
 *        description: OK
 * 
 */
 router.post('/bindPermissions',expressJoi(RoleCheck.rolePermissionsCheck),roleController.bindPermissions);

/**
 * @openapi
 * /api/v1/role/unbindPermissions:
 *  post:
 *    tags:
 *      - 角色模块
 *    summary: 角色解绑权限
 *    description: 角色解绑权限
 *    parameters:
 *      - name: Authorization
 *        type: string
 *        description: jwt
 *        in: header
 *        required: true
 *    requestBody:
 *      description: 角色id和权限id数组
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties: 
 *              roleId:
 *                type: integer
 *                required: true
 *                description: 角色id
 *              permissionIds:
 *                type: array
 *                required: true
 *                description: 权限id数组
 *    produces: 
 *      - application/json 
 *    consumes: 
 *      - application/json 
 *    responses:
 *      200:
 *        description: OK
 * 
 */
router.post('/unbindPermissions',expressJoi(RoleCheck.rolePermissionsCheck),roleController.unbindPermissions);

/**
 * @openapi
 * /api/v1/role/listPermissions:
 *  get:
 *    tags:
 *      - 角色模块
 *    summary: 查询角色拥有的权限
 *    description: 查询角色拥有的权限
 *    parameters:
 *      - name: Authorization
 *        type: string
 *        description: jwt
 *        in: header
 *        required: true
 *      - name: roleId
 *        type: integer
 *        description: 角色id
 *        in: query
 *        required: true
 *    produces: 
 *      - application/json 
 *    responses:
 *      200:
 *        description: OK
 * 
 */
router.get('/listPermissions',expressJoi(RoleCheck.roleIdCheck),roleController.listPermissions);

/**
 * @openapi
 * /api/v1/role/assignUsers:
 *  post:
 *    tags:
 *      - 角色模块
 *    summary: 角色关联用户
 *    description: 角色关联用户
 *    parameters:
 *      - name: Authorization
 *        type: string
 *        description: jwt
 *        in: header
 *        required: true
 *    requestBody:
 *      description: 角色id和用户id数组
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties: 
 *              roleId:
 *                type: integer
 *                required: true
 *                description: 角色id
 *              permissionIds:
 *                type: array
 *                required: true
 *                description: 用户id数组
 *    produces: 
 *      - application/json 
 *    responses:
 *      200:
 *        description: OK
 * 
 */
router.post('/assignUsers',expressJoi(RoleCheck.roleUsersCheck),roleController.assignToUsers);

/**
 * @openapi
 * /api/v1/role/bindUsers:
 *  post:
 *    tags:
 *      - 角色模块
 *    summary: 角色绑定用户
 *    description: 角色绑定用户
 *    parameters:
 *      - name: Authorization
 *        type: string
 *        description: jwt
 *        in: header
 *        required: true
 *    requestBody:
 *      description: 角色id和用户id数组
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties: 
 *              roleId:
 *                type: integer
 *                required: true
 *                description: 角色id
 *              permissionIds:
 *                type: array
 *                required: true
 *                description: 用户id数组
 *    produces: 
 *      - application/json 
 *    responses:
 *      200:
 *        description: OK
 * 
 */
 router.post('/bindUsers',expressJoi(RoleCheck.roleUsersCheck),roleController.bindUsers);

/**
 * @openapi
 * /api/v1/role/unbindUsers:
 *  post:
 *    tags:
 *      - 角色模块
 *    summary: 角色解绑用户
 *    description: 角色解绑用户
 *    parameters:
 *      - name: Authorization
 *        type: string
 *        description: jwt
 *        in: header
 *        required: true
 *    requestBody:
 *      description: 角色id和用户id数组
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties: 
 *              roleId:
 *                type: integer
 *                required: true
 *                description: 角色id
 *              permissionIds:
 *                type: array
 *                required: true
 *                description: 用户id数组
 *    produces: 
 *      - application/json 
 *    responses:
 *      200:
 *        description: OK
 * 
 */
router.post('/unbindUsers',expressJoi(RoleCheck.roleUsersCheck),roleController.unbindUsers);

/**
 * @openapi
 * /api/v1/role/listUsers:
 *  get:
 *    tags:
 *      - 角色模块
 *    summary: 查询拥有角色的用户
 *    description: 查询拥有角色的用户
 *    parameters:
 *      - name: Authorization
 *        type: string
 *        description: jwt
 *        in: header
 *        required: true
 *      - name: roleId
 *        type: integer
 *        description: 角色id
 *        in: query
 *        required: true
 *    produces: 
 *      - application/json 
 *    responses:
 *      200:
 *        description: OK
 * 
 */
router.get('/listUsers',expressJoi(RoleCheck.roleIdCheck),roleController.listUsers);

module.exports = router;