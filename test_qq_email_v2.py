import smtplib
import ssl
from email.mime.text import MIMEText

print("开始测试QQ邮箱SMTP (使用不同方法)...")

# 配置
smtp_server = "smtp.qq.com"
smtp_port = 465
username = "1034566686@qq.com"
password = "vllnsvpnxnwmbhjj"

print(f"\n配置信息:")
print(f"  服务器: {smtp_server}")
print(f"  端口: {smtp_port}")
print(f"  用户名: {username}")
print(f"  授权码: {'*' * len(password)}")

# 方法1: 使用默认SSL上下文
print("\n方法1: 使用默认SSL上下文...")
try:
    context = ssl.create_default_context()
    server = smtplib.SMTP_SSL(smtp_server, smtp_port, context=context, timeout=30)
    server.set_debuglevel(0)
    print("  连接成功")
    server.login(username, password)
    print("  ✓ 登录成功！")
    server.quit()
except Exception as e:
    print(f"  ✗ 失败: {e}")

# 方法2: 使用STARTTLS (端口587)
print("\n方法2: 使用STARTTLS (端口587)...")
try:
    server = smtplib.SMTP(smtp_server, 587, timeout=30)
    server.set_debuglevel(0)
    print("  连接成功")
    server.starttls()
    print("  TLS启动成功")
    server.login(username, password)
    print("  ✓ 登录成功！")
    
    # 发送测试邮件
    to_email = "1034566686@qq.com"
    msg = MIMEText("这是Dify邮件配置测试", "plain", "utf-8")
    msg["Subject"] = "Dify测试邮件"
    msg["From"] = username
    msg["To"] = to_email
    
    print(f"  发送测试邮件到 {to_email}")
    server.send_message(msg)
    print("  ✓ 邮件发送成功！请检查收件箱")
    
    server.quit()
except Exception as e:
    print(f"  ✗ 失败: {e}")

# 方法3: 禁用证书验证的SSL
print("\n方法3: 禁用证书验证...")
try:
    context = ssl.create_default_context()
    context.check_hostname = False
    context.verify_mode = ssl.CERT_NONE
    
    server = smtplib.SMTP_SSL(smtp_server, smtp_port, context=context, timeout=30)
    server.set_debuglevel(0)
    print("  连接成功")
    server.login(username, password)
    print("  ✓ 登录成功！")
    
    # 发送测试邮件
    to_email = "1034566686@qq.com"
    msg = MIMEText("这是Dify邮件配置测试", "plain", "utf-8")
    msg["Subject"] = "Dify测试邮件"
    msg["From"] = username
    msg["To"] = to_email
    
    print(f"  发送测试邮件到 {to_email}")
    server.send_message(msg)
    print("  ✓ 邮件发送成功！请检查收件箱")
    
    server.quit()
except Exception as e:
    print(f"  ✗ 失败: {e}")

print("\n测试完成")
