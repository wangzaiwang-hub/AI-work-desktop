# -*- coding: utf-8 -*-
"""QQ邮箱SMTP测试脚本 - 使用标准方法"""

import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.header import Header
from datetime import datetime

# QQ邮箱配置
SMTP_SERVER = "smtp.qq.com"
SMTP_PORT = 465
SENDER_EMAIL = "1034566686@qq.com"
SENDER_PASSWORD = "vllnsvpnxnwmbhjj"
RECIPIENT_EMAIL = "1034566686@qq.com"  # 发给自己测试

def test_qq_email():
    """测试QQ邮箱发送"""
    print("=" * 60)
    print("📧 QQ邮箱SMTP测试")
    print("=" * 60)
    print(f"SMTP服务器: {SMTP_SERVER}:{SMTP_PORT}")
    print(f"发件人: {SENDER_EMAIL}")
    print(f"收件人: {RECIPIENT_EMAIL}")
    print("-" * 60)
    
    try:
        # 创建邮件
        print("\n[1/5] 创建邮件...")
        message = MIMEMultipart()
        message['From'] = SENDER_EMAIL
        message['To'] = RECIPIENT_EMAIL
        message['Subject'] = Header("Dify邮件配置测试", 'utf-8').encode()
        
        # 邮件正文
        timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        body = f"""
这是一封来自Dify的测试邮件。

如果你收到这封邮件，说明QQ邮箱SMTP配置成功！

配置信息：
- SMTP服务器: {SMTP_SERVER}
- 端口: {SMTP_PORT}
- 发件人: {SENDER_EMAIL}
- 发送时间: {timestamp}

祝使用愉快！
        """
        message.attach(MIMEText(body, 'plain', 'utf-8'))
        print("    ✓ 邮件创建成功")
        
        # 连接SMTP服务器
        print(f"\n[2/5] 连接到 {SMTP_SERVER}:{SMTP_PORT}...")
        server = smtplib.SMTP_SSL(SMTP_SERVER, SMTP_PORT, timeout=30)
        print("    ✓ 连接成功")
        
        # 发送EHLO命令
        print("\n[3/5] 发送EHLO命令...")
        server.ehlo()
        print("    ✓ EHLO成功")
        
        # 登录
        print(f"\n[4/5] 登录邮箱 {SENDER_EMAIL}...")
        server.login(SENDER_EMAIL, SENDER_PASSWORD)
        print("    ✓ 登录成功")
        
        # 发送邮件
        print(f"\n[5/5] 发送邮件到 {RECIPIENT_EMAIL}...")
        server.sendmail(SENDER_EMAIL, [RECIPIENT_EMAIL], message.as_string())
        print("    ✓ 邮件发送成功")
        
        # 关闭连接
        server.quit()
        print("\n" + "=" * 60)
        print("✅ 测试完成！邮件发送成功！")
        print("=" * 60)
        print(f"\n请检查 {RECIPIENT_EMAIL} 的收件箱")
        print("如果没有收到，请检查垃圾邮件箱")
        
        return True
        
    except smtplib.SMTPAuthenticationError as e:
        print("\n" + "=" * 60)
        print("❌ 认证失败")
        print("=" * 60)
        print(f"错误详情: {e}")
        print("\n可能的原因：")
        print("1. 邮箱地址或授权码错误")
        print("2. 未开启SMTP服务")
        print("3. 授权码已过期")
        print("\n解决方法：")
        print("1. 登录QQ邮箱网页版")
        print("2. 设置 → 账户 → POP3/IMAP/SMTP服务")
        print("3. 开启SMTP服务并重新生成授权码")
        return False
        
    except smtplib.SMTPException as e:
        print("\n" + "=" * 60)
        print("❌ SMTP错误")
        print("=" * 60)
        print(f"错误详情: {e}")
        return False
        
    except Exception as e:
        print("\n" + "=" * 60)
        print("❌ 发送失败")
        print("=" * 60)
        print(f"错误类型: {type(e).__name__}")
        print(f"错误详情: {e}")
        
        import traceback
        print("\n完整错误信息：")
        traceback.print_exc()
        return False

if __name__ == "__main__":
    test_qq_email()
