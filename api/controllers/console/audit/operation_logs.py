from flask import request
from flask_login import current_user
from flask_restx import Resource, fields
from sqlalchemy import desc, func, or_
from sqlalchemy.orm import Session

from controllers.console import console_ns
from controllers.console.wraps import account_initialization_required
from extensions.ext_database import db
from libs.helper import TimestampField
from models.account import Account
from models.model import OperationLog
operation_log_model = console_ns.model(
    "OperationLog",
    {
        "id": fields.String(description="Log ID"),
        "tenant_id": fields.String(description="Tenant ID"),
        "account_id": fields.String(description="Account ID"),
        "account_name": fields.String(description="Account name"),
        "account_email": fields.String(description="Account email"),
        "action": fields.String(description="Action type"),
        "content": fields.Raw(description="Action content"),
        "created_at": TimestampField(description="Created time"),
        "created_ip": fields.String(description="IP address"),
    },
)

operation_log_list_model = console_ns.model(
    "OperationLogList",
    {
        "data": fields.List(fields.Nested(operation_log_model)),
        "total": fields.Integer(description="Total count"),
        "page": fields.Integer(description="Current page"),
        "limit": fields.Integer(description="Page size"),
        "has_more": fields.Boolean(description="Has more data"),
    },
)

stats_model = console_ns.model(
    "OperationLogStats",
    {
        "today_count": fields.Integer(description="Today's operation count"),
        "total_count": fields.Integer(description="Total operation count"),
        "verified_count": fields.Integer(description="Verified operation count"),
        "failed_count": fields.Integer(description="Failed operation count"),
    },
)


@console_ns.route("/operation-logs")
class OperationLogListApi(Resource):
    @account_initialization_required
    @console_ns.marshal_with(operation_log_list_model)
    def get(self):
        """Get operation logs list with pagination and filters"""
        parser = console_ns.parser()
        parser.add_argument("page", type=int, default=1, location="args")
        parser.add_argument("limit", type=int, default=20, location="args")
        parser.add_argument("action", type=str, location="args")
        parser.add_argument("account_id", type=str, location="args")
        parser.add_argument("keyword", type=str, location="args")
        parser.add_argument("start_date", type=str, location="args")
        parser.add_argument("end_date", type=str, location="args")
        args = parser.parse_args()

        page = max(1, args["page"])
        limit = min(100, max(1, args["limit"]))
        offset = (page - 1) * limit

        with Session(db.engine) as session:
            # Base query
            query = session.query(OperationLog, Account).join(
                Account, OperationLog.account_id == Account.id
            ).filter(OperationLog.tenant_id == current_user.current_tenant_id)

            # Apply filters
            if args.get("action"):
                query = query.filter(OperationLog.action == args["action"])

            if args.get("account_id"):
                query = query.filter(OperationLog.account_id == args["account_id"])

            if args.get("keyword"):
                keyword = f"%{args['keyword']}%"
                query = query.filter(
                    or_(
                        Account.name.ilike(keyword),
                        Account.email.ilike(keyword),
                        OperationLog.action.ilike(keyword),
                    )
                )

            if args.get("start_date"):
                query = query.filter(OperationLog.created_at >= args["start_date"])

            if args.get("end_date"):
                query = query.filter(OperationLog.created_at <= args["end_date"])

            # Get total count
            total = query.count()

            # Get paginated results
            results = query.order_by(desc(OperationLog.created_at)).offset(offset).limit(limit).all()

            # Format response
            data = []
            for log, account in results:
                data.append(
                    {
                        "id": log.id,
                        "tenant_id": log.tenant_id,
                        "account_id": log.account_id,
                        "account_name": account.name,
                        "account_email": account.email,
                        "action": log.action,
                        "content": log.content,
                        "created_at": int(log.created_at.timestamp()),
                        "created_ip": log.created_ip,
                    }
                )

            return {
                "data": data,
                "total": total,
                "page": page,
                "limit": limit,
                "has_more": total > page * limit,
            }


@console_ns.route("/operation-logs/stats")
class OperationLogStatsApi(Resource):
    @account_initialization_required
    @console_ns.marshal_with(stats_model)
    def get(self):
        """Get operation logs statistics"""
        with Session(db.engine) as session:
            # Today's count
            from datetime import datetime, timedelta

            today_start = datetime.now().replace(hour=0, minute=0, second=0, microsecond=0)
            today_count = (
                session.query(func.count(OperationLog.id))
                .filter(
                    OperationLog.tenant_id == current_user.current_tenant_id,
                    OperationLog.created_at >= today_start,
                )
                .scalar()
            )

            # Total count
            total_count = (
                session.query(func.count(OperationLog.id))
                .filter(OperationLog.tenant_id == current_user.current_tenant_id)
                .scalar()
            )

            # Verified count (actions that typically indicate success)
            verified_actions = ["login", "create", "update", "delete"]
            verified_count = (
                session.query(func.count(OperationLog.id))
                .filter(
                    OperationLog.tenant_id == current_user.current_tenant_id,
                    OperationLog.action.in_(verified_actions),
                )
                .scalar()
            )

            # Failed count (you can customize this based on your action naming)
            failed_count = (
                session.query(func.count(OperationLog.id))
                .filter(
                    OperationLog.tenant_id == current_user.current_tenant_id,
                    OperationLog.action.like("%fail%"),
                )
                .scalar()
            )

            return {
                "today_count": today_count or 0,
                "total_count": total_count or 0,
                "verified_count": verified_count or 0,
                "failed_count": failed_count or 0,
            }


@console_ns.route("/operation-logs/actions")
class OperationLogActionsApi(Resource):
    @account_initialization_required
    def get(self):
        """Get all unique action types"""
        with Session(db.engine) as session:
            actions = (
                session.query(OperationLog.action)
                .filter(OperationLog.tenant_id == current_user.current_tenant_id)
                .distinct()
                .all()
            )

            return {"actions": [action[0] for action in actions]}
