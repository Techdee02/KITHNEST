import uuid
from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, String, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class School(Base):
    """
    One row per school, one admin per school for now — deliberately not
    normalized into a separate admins table until multi-admin-per-school is
    an actual requirement.
    """

    __tablename__ = 'schools'

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name: Mapped[str] = mapped_column(String(200), nullable=False)
    short_name: Mapped[str] = mapped_column(String(100), nullable=False)
    code: Mapped[str] = mapped_column(String(12), nullable=False, unique=True, index=True)
    location: Mapped[str] = mapped_column(String(200), nullable=False)
    motto: Mapped[str | None] = mapped_column(String(200), nullable=True)

    admin_name: Mapped[str] = mapped_column(String(150), nullable=False)
    admin_email: Mapped[str] = mapped_column(String(255), nullable=False, unique=True, index=True)
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)

    logo_url: Mapped[str | None] = mapped_column(String(500), nullable=True)

    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())


class Update(Base):
    """
    A school-wide announcement/workload post. Parents look these up by
    school code — there's no real parent account system yet, so these are
    school-scoped, not per-parent.
    """

    __tablename__ = 'updates'

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    school_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey('schools.id', ondelete='CASCADE'), nullable=False, index=True
    )
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    body: Mapped[str] = mapped_column(String(2000), nullable=False)
    category: Mapped[str] = mapped_column(String(30), nullable=False, default='announcement')
    channel: Mapped[str] = mapped_column(String(10), nullable=False, default='app')

    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
