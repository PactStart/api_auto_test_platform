# coding: utf-8

# @Author: Rex.Lei
# @Time: 2022/10/27 9:49 下午
# @File: test_plan_executor.py

import time
import json
import jsonpath
from util.db_util import MysqlDb
from util.request_util import RequestUtil
from util.mail_util import MailUtil


class TestPlanExecutor:

    def exec(self, plan_id):
        """
        执行测试计划
        :param plan_id: 计划id
        :return:
        """
        # 加载测试计划
        plan = self.load_test_plan(plan_id);
        # 加载测试用例
        cases = self.load_test_case(plan_id);
        # 加载配置
        config_map = self.load_config(plan['app_id']);

        context = {}
        context['start_at'] = round(time.time() * 1000)
        pass_num = 0
        # 遍历测试用例
        for case in cases:
            try:
                # 执行测试用例
                start_at = round(time.time() * 1000)
                response = self.exec_test_case(case, config_map)
                end_at = round(time.time() * 1000)

                # 断言判断
                assert_result = self.assert_response(case, response)
                assert_result['start_at'] = start_at
                assert_result['end_at'] = end_at

                if assert_result['is_pass']:
                    pass_num = pass_num + 1
                # 更新测试用例运行结果
                self.update_test_case_result(case, response, assert_result)

            except Exception as e:
                print(e)
                # print('测试用例执行发生异常:case_id: {0}, case_name: {1}'.format(case['case_id'], case['case_name']), e)

        context['end_at'] = round(time.time() * 1000)
        context['pass_num'] = pass_num
        # 更新测试计划运行结果
        self.update_test_plan_result(plan, context)

        # 发送测试报告
        # self.send_test_report(plan)

    def load_test_plan(self, plan_id):
        """
        加载测试计划
        :param plan_id: 计划id
        :return:
        """
        print('load_test_plan')
        my_db = MysqlDb()
        sql = "select * from `api_test_plan` where id = {0}".format(plan_id)
        results = my_db.query(sql)
        return results[0]

    def load_test_case(self, plan_id):
        """
        加载测试用例
        :param plan_id:
        :return:
        """
        print("load_test_case")
        my_db = MysqlDb()
        sql = "select * from `api_test_case_run_log` where plan_id='{0}'".format(plan_id)
        results = my_db.query(sql)
        return results

    def load_config(self, app_id):
        """
        加载应用配置
        :param app_id:
        :return:
        """
        print('load_config')
        my_db = MysqlDb()
        sql = "select * from `app_config` where app_id = {0}".format(app_id)
        results = my_db.query(sql)
        config_map = {}
        for row in results:
            config_map[row['config_key']] = row['config_value']
        return config_map

    def exec_test_case(self, case, config_map):
        """
        执行测试用例
        :param case:
        :param config_map:
        :return:
        """
        print('exec_test_case')
        headers = json.loads(case['headers'])
        content_type = case['content_type']
        body = json.loads(case['request_body'])
        method = case['request_method']
        request_url = config_map['base_url'] + case['url']

        # 是否有前置条件
        if case['pre_case_id'] > 0:
            pre_case_id = case['pre_case_id']
            pre_case = self.get_case_by_id(pre_case_id)
            # 递归调用
            pre_case_response = self.exec_test_case(pre_case, config_map)
            pre_case_assert_result = self.assert_response(pre_case, pre_case_response)
            if not pre_case_assert_result['pass']:
                # 前置用例没有通过
                return pre_case_response
            pre_fields = json.loads(case['pre_fields'])
            for pre_field in pre_fields:
                if pre_fields['scope'] == 'header':
                    # 替换header中的动态参数
                    for header in headers:
                        field_name = pre_fields['field']
                        if header == field_name:
                            field_value = pre_case_response['data'][field_name]
                            headers[field_name] = field_value
                elif pre_field['scope'] == 'body' or pre_field['scope'] == 'query':
                    # 替换body或者query中的动态参数
                    for key in body.keys():
                        field_name = pre_fields['field']
                        if key == field_name:
                            field_value = pre_case_response['data'][field_name]
                            body[field_name] = field_value

        # 请求
        headers['content-type'] = content_type
        if (method == 'post' and content_type == 'application/json'):
            param = json.dumps(body)
        else:
            param = body
        req = RequestUtil();
        response = req.request(request_url, method, headers, param)
        return response

    def get_case_by_id(self, case_id):
        """
        根据id获取测试用例
        :param case_id:
        :return:
        """
        print('get_case_by_id')
        my_db = MysqlDb();
        sql = "select * from api_test_case_run_log where id = {0}".format(case_id)
        results = my_db.query(sql)
        if(len(results) > 0):
            return results[0]
        return None

    def update_test_case_result(self, case, response, assert_result):
        """
        更新测试用例运行结果
        :param case: 用例
        :param response: http响应
        :param assert_result: 断言结果
        :return:
        """
        print('update_test_case_result')
        sql = "update api_test_case_run_log set pass = {0}, msg = '{1}', response = \"{2}\", start_at = {3} , end_at = {4}, cost = {5} where id = {6}".format(
            '1' if assert_result['is_pass'] else '0', assert_result['msg'], str(response), assert_result['start_at'],
            assert_result['end_at'], assert_result['end_at'] - assert_result['start_at'], case['id'])
        my_db = MysqlDb()
        rows = my_db.execute(sql)
        return rows

    def assert_response(self, case, response):
        """
        断言
        :param case: 用例
        :param response: http响应
        :return:
        """
        print('assert_response')
        assert_obj_arr = json.loads(case['assert'])

        is_all_pass = True
        for assert_obj in assert_obj_arr:
            field_path = assert_obj['fieldPath']
            predicate = assert_obj['predicate']
            expect_value = assert_obj['expectValue']
            actual_value = jsonpath.jsonpath(response, field_path)
            if not actual_value:
                continue
            actual_value = actual_value[0]
            is_pass = True
            if predicate == 'exist':
                is_pass = actual_value == None
            elif predicate == '=':
                is_pass = expect_value == actual_value
            elif predicate == '!=':
                is_pass = expect_value != actual_value
            elif predicate == '>':
                is_pass = float(actual_value) > float(expect_value)
            elif predicate == '>=':
                is_pass = float(actual_value) >= float(expect_value)
            elif predicate == '<':
                is_pass = float(actual_value) < float(expect_value)
            elif predicate == '<=':
                is_pass = float(actual_value) <= float(expect_value)
            elif predicate == 'in':
                is_pass = actual_value in json.loads(expect_value)
            elif predicate == 'contains':
                is_pass = str(actual_value).__contains__(str(expect_value))

            if not is_pass:
                msg = assert_obj['msg']

        assert_result = {}
        assert_result['is_pass'] = is_all_pass
        if not is_all_pass:
            assert_result['msg'] = msg
        else:
            assert_result['msg'] = 'success'
        return assert_result

    def update_test_plan_result(self, plan, context):
        """
        更新测试计划执行结果
        :param plan:
        :param context:
        :return:
        """
        print('update_test_plan_result')

        sql = "update api_test_plan set start_at = {0}, end_at = {1}, cost = {2} ,pass_num = {3}, run = 1 where id = {4}".format(
            context['start_at'], context['end_at'], context['end_at'] - context['start_at'], context['pass_num'], plan['id'])
        my_db = MysqlDb()
        rows = my_db.execute(sql)
        return rows

    def send_test_report(self, plan, config_map):
        """
        发送测试报告
        :param plan:
        :param config_map:
        :return:
        """
        print('send_test_report')
        test_report_url = config_map['test_report_url']
        content = "您的测试计划:{0} 已执行完成，点击连接查看测试报告：{1}/{2}".format(plan['name'], test_report_url, plan['id'])
        mail_host = config_map['mail_host']
        mail_sender = config_map['mail_sender']
        mail_auth_code = config_map['mail_auth_code']
        mail_receivers = plan['mail_receivers'].split(",")
        mail = MailUtil(mail_host)
        mail.send('测试报告：{0}'.format(plan['name']), content, mail_sender, mail_auth_code, mail_receivers)


if __name__ == '__main__':
    executor = TestPlanExecutor();
    executor.exec(4);
