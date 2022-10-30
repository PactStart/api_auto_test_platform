# coding: utf-8

# @Author: Rex.Lei
# @Time: 2022/10/27 9:49 下午
# @File: mail_util.py

import smtplib
from email.mime.text import MIMEText
from email.header import Header

class MailUtil:

    def __init__(self, mail_host):
        self.mail_host = mail_host

    def send(self, title, content, sender, auth_code, receivers):
        message = MIMEText(content, 'html', 'utf-8')
        message['From'] = "{}".format(sender)
        message['To'] = ",".join(receivers)
        message["Subject"] = title
        try:
            smtp_obj = smtplib.SMTP_SSL(self.mail_host, 465)  # 启用ssl发信，端口一般是465
            smtp_obj.login(sender, auth_code)  # 登录
            smtp_obj.sendmail(sender, receivers, message.as_string())
            print("Mail 发送成功")
        except Exception as e:
            print(e)


if __name__ == '__main__':
    mail = MailUtil("smtp.126.com")
    sender = "xxx@126.com"
    receivers = ['xxx@qq.com']
    title = "测试报告"
    content = "这是一封测试平台发送的邮件"
    auth_code = "IAVEGDPLRCJFEVON"
    mail.send(title, content, sender, auth_code, receivers)
