# coding: utf-8

# @Author: Rex.Lei
# @Time: 2022/10/27 9:47 下午
# @File: main.py

import requests

"""
Http工具类封装
"""

class RequestUtil:

    def __init__(self):
        pass

    def request(self, url, method, headers=None, param=None, content_type=None):
        """
        通用请求工具类
        :param url:
        :param method:
        :param headers:
        :param param:
        :param content_type:
        :return:
        """
        try:
            if method == 'get':
                result = requests.get(url=url, params=param, headers=headers).json()
                return result
            elif method == 'post':
                if content_type == 'application/json':
                    result = requests.post(url=url, json=param, headers=headers).json()
                    return result
                else:
                    result = requests.post(url=url, data=param, headers=headers).json()
                    return result
            else:
                print("http method not allowed")


        except Exception as e:
            print("http请求报错:{0}".format(e))


if __name__ == '__main__':
    url = "http://localhost:3000/api/v1/user/login"
    r = RequestUtil()
    data = {"username": "admin", "password": "123456"}
    headers = {"Content-Type": "application/json"}
    result = r.request(url, 'post', param=data, headers=headers)
    print(result)


