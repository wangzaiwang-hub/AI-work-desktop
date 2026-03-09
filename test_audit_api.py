"""测试审计日志API"""
import requests

# 测试审计日志API
base_url = "http://localhost:5001/console/api"

# 1. 测试获取日志列表
print("测试获取审计日志列表...")
response = requests.get(f"{base_url}/operation-logs?page=1&limit=20")
print(f"状态码: {response.status_code}")
print(f"响应: {response.text[:500]}")

# 2. 测试获取统计数据
print("\n测试获取统计数据...")
response = requests.get(f"{base_url}/operation-logs/stats")
print(f"状态码: {response.status_code}")
print(f"响应: {response.text}")

# 3. 测试获取操作类型列表
print("\n测试获取操作类型列表...")
response = requests.get(f"{base_url}/operation-logs/actions")
print(f"状态码: {response.status_code}")
print(f"响应: {response.text}")
