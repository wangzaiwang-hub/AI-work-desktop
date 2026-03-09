"""
审计日志API - 读取本地日志文件
Audit Logs API - Read local log file
"""
import json
from pathlib import Path
from typing import Any

from flask import Blueprint, request

audit_logs_bp = Blueprint("audit_logs", __name__, url_prefix="/console/api/audit-logs")

AUDIT_LOG_FILE = Path("logs/audit.log")


@audit_logs_bp.route("", methods=["GET"])
def get_audit_logs():
    """获取审计日志列表"""
    try:
        page = int(request.args.get("page", 1))
        limit = int(request.args.get("limit", 10))
        action_filter = request.args.get("action")
        
        # 读取日志文件
        if not AUDIT_LOG_FILE.exists():
            return {
                "data": [],
                "total": 0,
                "page": page,
                "limit": limit,
            }
        
        # 读取所有日志行
        logs = []
        with open(AUDIT_LOG_FILE, "r", encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if line:
                    try:
                        log_entry = json.loads(line)
                        # 过滤操作类型
                        if action_filter and log_entry.get("action") != action_filter:
                            continue
                        logs.append(log_entry)
                    except json.JSONDecodeError:
                        continue
        
        # 按时间倒序排序
        logs.sort(key=lambda x: x.get("timestamp", ""), reverse=True)
        
        # 分页
        total = len(logs)
        start = (page - 1) * limit
        end = start + limit
        page_logs = logs[start:end]
        
        # 转换为前端需要的格式
        result = []
        for log in page_logs:
            result.append({
                "id": log.get("timestamp", ""),  # 使用时间戳作为ID
                "action": log.get("action", ""),
                "content": log.get("content", {}),
                "created_at": log.get("timestamp", ""),
                "created_ip": log.get("ip", ""),
            })
        
        return {
            "data": result,
            "total": total,
            "page": page,
            "limit": limit,
        }
        
    except Exception as e:
        return {"error": str(e)}, 500


@audit_logs_bp.route("/stats", methods=["GET"])
def get_audit_stats():
    """获取审计日志统计"""
    try:
        if not AUDIT_LOG_FILE.exists():
            return {
                "total": 0,
                "today": 0,
            }
        
        from datetime import datetime, timedelta
        
        total = 0
        today = 0
        today_start = datetime.now().replace(hour=0, minute=0, second=0, microsecond=0)
        
        with open(AUDIT_LOG_FILE, "r", encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if line:
                    try:
                        log_entry = json.loads(line)
                        total += 1
                        
                        # 统计今天的日志
                        timestamp_str = log_entry.get("timestamp", "")
                        if timestamp_str:
                            log_time = datetime.fromisoformat(timestamp_str.replace('Z', '+00:00'))
                            if log_time >= today_start:
                                today += 1
                    except (json.JSONDecodeError, ValueError):
                        continue
        
        return {
            "total": total,
            "today": today,
        }
        
    except Exception as e:
        return {"error": str(e)}, 500


@audit_logs_bp.route("/actions", methods=["GET"])
def get_audit_actions():
    """获取所有操作类型"""
    try:
        if not AUDIT_LOG_FILE.exists():
            return {"actions": []}
        
        actions = set()
        
        with open(AUDIT_LOG_FILE, "r", encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if line:
                    try:
                        log_entry = json.loads(line)
                        action = log_entry.get("action")
                        if action:
                            actions.add(action)
                    except json.JSONDecodeError:
                        continue
        
        return {"actions": sorted(list(actions))}
        
    except Exception as e:
        return {"error": str(e)}, 500
