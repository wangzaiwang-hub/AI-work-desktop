"""Per-user configuration storage.

Each user (Account) has at most one row.  The ``config`` column is a
JSON dict that holds all user-level settings (sandbox path, security
toggles, download paths, etc.).
"""

from datetime import datetime

import sqlalchemy as sa
from sqlalchemy import func
from sqlalchemy.orm import Mapped, mapped_column

from .base import TypeBase
from .types import AdjustedJSON, StringUUID


class UserConfig(TypeBase):
    __tablename__ = "user_configs"
    __table_args__ = (
        sa.PrimaryKeyConstraint("id", name="user_config_pkey"),
        sa.UniqueConstraint("account_id", name="user_config_account_id_unique"),
    )

    id: Mapped[str] = mapped_column(
        StringUUID,
        server_default=sa.text("uuid_generate_v4()"),
        default=None,
        init=False,
    )
    account_id: Mapped[str] = mapped_column(StringUUID, nullable=False)
    config: Mapped[dict] = mapped_column(AdjustedJSON, nullable=False, default=dict)
    created_at: Mapped[datetime] = mapped_column(
        sa.DateTime, nullable=False, server_default=func.current_timestamp(), init=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        sa.DateTime, nullable=False, server_default=func.current_timestamp(), init=False
    )

    def __repr__(self) -> str:
        return f"<UserConfig account_id={self.account_id}>"
