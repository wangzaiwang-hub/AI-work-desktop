import smtplib
from email.mime.text import MIMEText

print("开始测试QQ邮箱SMTP...")

try:
    # 配置
    smtp_server = "smtp.qq.com"
    smtp_port = 465
    username = "1034566686@qq.com"
    password = "vllnsvpnxnwmbhjj"
    
    print(f"连接到 {smtp_server}:{smtp_port}")
    
    # 连接
    server = smtplib.SMTP_SSL(smtp_server, smtp_port, timeout=30)
    print("连接成功")
    
    # 登录
    print("正在登录...")
    server.login(username, password)
    print("登录成功！")
    
    # 发送测试邮件
    to_email = "1034566686@qq.com"  # 发给自己
    msg = MIMEText("这是Dify邮件配置测试", "plain", "utf-8")
    msg["Subject"] = "Dify测试邮件"
    msg["From"] = username
    msg["To"] = to_email
    
    print(f"发送测试邮件到 {to_email}")
    server.send_message(msg)
    print("邮件发送成功！请检查收件箱")
    
    server.quit()
    print("测试完成")
    
except smtplib.SMTPAuthenticationError as e:
    print(f"认证失败: {e}")
    print("请检查邮箱地址和授权码是否正确")
except Exception as e:
    print(f"错误: {type(e).__name__}: {e}")
    import traceback
    traceback.print_exc()
