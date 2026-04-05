from sqlalchemy import Boolean, Column, DateTime, ForeignKey, Integer, JSON, String, Text, UniqueConstraint, func
from sqlalchemy.orm import relationship

from database import Base


class CaseRecord(Base):
    __tablename__ = "case_records"

    id = Column(Integer, primary_key=True, autoincrement=True)
    title = Column(String(255), nullable=False)
    company_code = Column(String(100), nullable=False)
    company_name = Column(String(255), nullable=False)
    fiscal_year = Column(String(10), nullable=False)
    fiscal_period = Column(String(20), nullable=False)
    account_code = Column(String(100), nullable=False)
    account_name = Column(String(255), nullable=False)
    issue_type = Column(String(100), nullable=False)
    voucher_reference = Column(String(100), nullable=True)
    summary = Column(Text, nullable=False)
    background = Column(Text, nullable=False)
    dispute_process = Column(Text, nullable=False)
    judgment_basis = Column(Text, nullable=False)
    conclusion = Column(Text, nullable=False)
    reference_entry = Column(Text, nullable=False)
    attachment_links = Column(JSON, nullable=False, default=list)
    tags = Column(JSON, nullable=False, default=list)
    risk_level = Column(String(50), nullable=False, default="中")
    source_type = Column(String(50), nullable=False, default="manual")
    status = Column(String(50), nullable=False, default="待审核")
    created_by = Column(String(100), nullable=False, default="system")
    created_at = Column(DateTime, server_default=func.now(), nullable=False)
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now(), nullable=False)


class SiteContent(Base):
    __tablename__ = "site_contents"
    __table_args__ = (UniqueConstraint("section_key", name="uq_site_contents_section_key"),)

    id = Column(Integer, primary_key=True, autoincrement=True)
    section_key = Column(String(100), nullable=False)
    title = Column(String(255), nullable=False)
    body = Column(Text, nullable=False, default="")
    items = Column(JSON, nullable=False, default=dict)
    is_published = Column(Boolean, nullable=False, default=True)
    updated_by = Column(String(100), nullable=False, default="system")
    created_at = Column(DateTime, server_default=func.now(), nullable=False)
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now(), nullable=False)


class RiskRule(Base):
    __tablename__ = "risk_rules"

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    risk_level = Column(String(50), nullable=False, default="中")
    trigger_account = Column(String(255), nullable=False, default="")
    keyword_pattern = Column(String(255), nullable=False, default="")
    suggestion = Column(Text, nullable=False)
    enabled = Column(Boolean, nullable=False, default=True)
    sort_order = Column(Integer, nullable=False, default=100)
    updated_by = Column(String(100), nullable=False, default="system")
    created_at = Column(DateTime, server_default=func.now(), nullable=False)
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now(), nullable=False)


class DisplayConfig(Base):
    __tablename__ = "display_configs"
    __table_args__ = (UniqueConstraint("config_key", name="uq_display_configs_config_key"),)

    id = Column(Integer, primary_key=True, autoincrement=True)
    config_key = Column(String(100), nullable=False)
    description = Column(Text, nullable=False, default="")
    config_value = Column(JSON, nullable=False, default=dict)
    updated_by = Column(String(100), nullable=False, default="system")
    created_at = Column(DateTime, server_default=func.now(), nullable=False)
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now(), nullable=False)


class AdminUser(Base):
    __tablename__ = "admin_users"
    __table_args__ = (UniqueConstraint("username", name="uq_admin_users_username"),)

    id = Column(Integer, primary_key=True, autoincrement=True)
    username = Column(String(100), nullable=False)
    password_hash = Column(String(255), nullable=False)
    password_salt = Column(String(255), nullable=False)
    is_active = Column(Boolean, nullable=False, default=True)
    last_login_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, server_default=func.now(), nullable=False)
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now(), nullable=False)

    sessions = relationship("AdminSession", back_populates="admin_user", cascade="all, delete-orphan")


class AdminSession(Base):
    __tablename__ = "admin_sessions"
    __table_args__ = (UniqueConstraint("token_hash", name="uq_admin_sessions_token_hash"),)

    id = Column(Integer, primary_key=True, autoincrement=True)
    admin_user_id = Column(Integer, ForeignKey("admin_users.id"), nullable=False)
    token_hash = Column(String(255), nullable=False)
    expires_at = Column(DateTime, nullable=False)
    created_at = Column(DateTime, server_default=func.now(), nullable=False)

    admin_user = relationship("AdminUser", back_populates="sessions")
