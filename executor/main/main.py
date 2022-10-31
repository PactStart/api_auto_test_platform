# coding: utf-8

# @Author: Rex.Lei
# @Time: 2022/10/27 9:47 下午
# @File: main.py

from case.test_plan_executor import TestPlanExecutor
if __name__ == '__main__':
    executor = TestPlanExecutor()
    planId = 4;
    executor.run(planId);