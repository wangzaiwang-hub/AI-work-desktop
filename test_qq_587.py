# -*- coding: utf-8 -*-
"""QQ邮箱SMTP测试 - 使用587端口STARTTLS"""

import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.header import Header
from datetime import datetime

SMTP_SERVER = "smtp.qq.com"
SMTP_PORT = 587  # 使用587端口
SENDER_EMAIL = "1034566686@qq.com"
SENDER_PASSWORD = "vllnsvpnxnwmbhjj"
RECIPIENT_EMAIL = "1034566686@qq.com"

def test_qq_email_587():
    """使用587端口测试"""
    print("=" * 60)
    print("📧 QQ邮箱SMTP测试 (端口587 + STARTTLS)")
    print("=" * 60)
    print(f"SMTP服务器: {SMTP_SERVER}:{SMTP_PORT}")
    print(f"发件人: {SENDER_EMAIL}")
    print(f"收件人: {RECIPIENT_EMAIL}")
    print("-" * 60)
    
    try:
        # 创建邮件
        print("\n[1/6] 创建邮件...")
        message = MIMEMultipart()
        message['From'] = SENDER_EMAIL
        message['To'] = RECIPIENT_EMAIL
        message['Subject'] = Header("Dify邮件配置测试", 'utf-8').encode()
        
        timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        body = f"""
这是一封来自Dify的测试邮件（使用587端口）。

如果你收到这封邮件，说明QQ邮箱SMTP配置成功！

配置信息：
- SMTP服务器: {SMTP_SERVER}
- 端口: {SMTP_PORT} (STARTTLS)
- 发件人: {SENDER_EMAIL}
- 发送时间: {timestamp}

祝使用愉快！
        """
        message.attach(MIMEText(body, 'plain', 'utf-8'))
        print("    ✓ 邮件创建成功")
        
        # 连接SMTP服务器（普通连接）
        print(f"\n[2/6] 连接到 {SMTP_SERVER}:{SMTP_PORT}...")
        server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT, timeout=30)
        print("    ✓ 连接成功")
        
        # 发送EHLO命令
        print("\n[3/6] 发送EHLO命令...")
        server.ehlo()
        print("    ✓ EHLO成功")
        
        # 启动TLS加密
        print("\n[4/6] 启动TLS加密...")
        server.starttls()
        print("    ✓ TLS启动成功")
        
        # 再次发送EHLO
        print("\n[5/6] 重新发送EHLO...")
        server.ehlo()
        print("    ✓ EHLO成功")
        
        # 登录
        print(f"\n[6/6] 登录邮箱 {SENDER_EMAIL}...")
        server.login(SENDER_EMAIL, SENDER_PASSWORD)
        print("    ✓ 登录成功")
        
        # 发送邮件
        print(f"\n[7/7] 发送邮件到 {RECIPIENT_EMAIL}...")
        server.sendmail(SENDER_EMAIL, [RECIPIENT_EMAIL], message.as_string())
        print("    ✓ 邮件发送成功")
        
        # 关闭连接
        server.quit()
        print("\n" + "=" * 60)
        print("✅ 测试完成！邮件发送成功！")
        print("=" * 60)
        print(f"\n请检查 {RECIPIENT_EMAIL} 的收件箱")
        
        return True
        
    except smtplib.SMTPAuthenticationError as e:
        print("\n❌ 认证失败")
        print(f"错误: {e}")
        print("\n请检查：")
        print("1. 邮箱地址是否正确")
        print("2. 授权码是否正确（不是QQ密码）")
        print("3. 是否已开启SMTP服务")
        return False
        
    except Exception as e:
        print(f"\n❌ 错误: {type(e).__name__}: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    test_qq_email_587()
