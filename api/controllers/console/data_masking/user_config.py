"""Per-user configuration API.

Authenticated endpoint — stores/retrieves user settings from the
``user_configs`` table so they persist across devices and sessions.
"""

import logging
from datetime import datetime, timezone

from flask import request
from flask_restx import Resource

from controllers.console import console_ns
from controllers.console.wraps import account_initialization_required, setup_required
from extensions.ext_database import db
from libs.login import current_account_with_tenant, login_required
from models.user_config import UserConfig

logger = logging.getLogger(__name__)


@console_ns.route("/user-config")
class UserConfigApi(Resource):
    """GET / PUT the current user's config JSON."""

    @setup_required
    @login_required
    @account_initialization_required
    def get(self):
        account, _ = current_account_with_tenant()
        row = db.session.query(UserConfig).filter_by(account_id=account.id).first()
        if not row:
            return {"config": {}}
        return {"config": row.config or {}}

    @setup_required
    @login_required
    @account_initialization_required
    def put(self):
        account, _ = current_account_with_tenant()
        data = request.get_json(silent=True) or {}
        config_patch: dict = data.get("config", {})
        if not isinstance(config_patch, dict):
            return {"error": "config must be a JSON object"}, 400

        row = db.session.query(UserConfig).filter_by(account_id=account.id).first()
        if row:
            merged = {**(row.config or {}), **config_patch}
            row.config = merged
            row.updated_at = datetime.now(timezone.utc).replace(tzinfo=None)
        else:
            row = UserConfig(account_id=account.id, config=config_patch)
            db.session.add(row)

        db.session.commit()
        return {"result": "success", "config": row.config}
