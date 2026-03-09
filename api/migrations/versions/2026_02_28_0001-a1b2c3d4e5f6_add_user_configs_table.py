"""add user_configs table

Revision ID: a1b2c3d4e5f6
Revises: 788d3099ae3a
Create Date: 2026-02-28 00:01:00.000000

"""

from alembic import op
import models as models
import sqlalchemy as sa

revision = "a1b2c3d4e5f6"
down_revision = "788d3099ae3a"
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        "user_configs",
        sa.Column("id", models.types.StringUUID(), server_default=sa.text("uuid_generate_v4()"), nullable=False),
        sa.Column("account_id", models.types.StringUUID(), nullable=False),
        sa.Column("config", sa.JSON(), nullable=False, server_default=sa.text("'{}'::jsonb")),
        sa.Column("created_at", sa.DateTime(), server_default=sa.text("CURRENT_TIMESTAMP"), nullable=False),
        sa.Column("updated_at", sa.DateTime(), server_default=sa.text("CURRENT_TIMESTAMP"), nullable=False),
        sa.PrimaryKeyConstraint("id", name="user_config_pkey"),
        sa.UniqueConstraint("account_id", name="user_config_account_id_unique"),
    )


def downgrade():
    op.drop_table("user_configs")
