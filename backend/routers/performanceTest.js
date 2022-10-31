const express = require('express');
const router = express.Router();

const PerformanceTestController = require('../controllers/PerformanceTestController');

/**
 * @openapi
 * /api/v1/pt/goods/list:
 *  get:
 *    tags:
 *      - 性能测试Demo
 *    summary: 获取所有的商品
 *    description: 获取所有的商品
 *    produces: 
 *      - application/json
 *    responses:
 *      200:
 *        description: OK
 */
router.get('/list', PerformanceTestController.getGoodsList);

/**
 * @openapi
 * /api/v1/pt/goods/detail:
 *  get:
 *    tags:
 *      - 性能测试Demo
 *    summary: 获取商品详情
 *    description: 获取商品详情
 *    parameters:
 *      - name: id
 *        type: integer
 *        description: 商品id
 *        in: query
 *        required: true
 *    produces: 
 *      - application/json
 *    responses:
 *      200:
 *        description: OK
 */
 router.get('/detail', PerformanceTestController.getGoodsDetail);

 /**
 * @openapi
 * /api/v1/pt/goods/secKill:
 *  post:
 *    tags:
 *      - 性能测试Demo
 *    summary: 秒杀商品
 *    description: 秒杀商品
 *    produces: 
 *      - application/json
 *    requestBody:
 *      description: 商品id
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties: 
 *              id:
 *                type: integer
 *                required: true
 *                description: 商品id
 *    responses:
 *      200:
 *        description: OK
 */
router.post('/secKill', PerformanceTestController.secKill);

module.exports = router;