from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime


class User(BaseModel):
    user_id: str
    email: str
    name: str
    picture: Optional[str] = None
    role: str = "user"  # 'user' or 'admin'
    created_at: datetime
    updated_at: Optional[datetime] = None


class UserSession(BaseModel):
    user_id: str
    session_token: str
    expires_at: datetime
    created_at: datetime


class Server(BaseModel):
    server_id: str
    user_id: str
    name: str
    status: str = "stopped"  # 'running', 'stopped', 'restarting'
    plan: str
    players: str = "0/10"
    uptime: str = "0%"
    ip: str
    port: str = "25565"
    version: str = "1.20.1"
    created_at: datetime
    updated_at: Optional[datetime] = None


class ServerCreate(BaseModel):
    name: str
    plan: str
    version: str = "1.20.1"


class ServerUpdate(BaseModel):
    name: Optional[str] = None
    max_players: Optional[int] = None
    game_mode: Optional[str] = None
    difficulty: Optional[str] = None


class Plan(BaseModel):
    plan_id: str
    name: str
    description: str
    price: float
    ram: str
    storage: str
    slots: str
    cpu: str
    backups: str
    support: str
    featured: bool = False
    order: int = 0
    created_at: datetime
    updated_at: Optional[datetime] = None


class PlanUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    ram: Optional[str] = None
    storage: Optional[str] = None
    slots: Optional[str] = None
    cpu: Optional[str] = None
    backups: Optional[str] = None
    support: Optional[str] = None
    featured: Optional[bool] = None


class Feature(BaseModel):
    feature_id: str
    icon: str
    title: str
    description: str
    order: int = 0
    created_at: datetime
    updated_at: Optional[datetime] = None


class FeatureUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    icon: Optional[str] = None


class FAQ(BaseModel):
    faq_id: str
    question: str
    answer: str
    order: int = 0
    created_at: datetime
    updated_at: Optional[datetime] = None


class FAQCreate(BaseModel):
    question: str
    answer: str


class FAQUpdate(BaseModel):
    question: Optional[str] = None
    answer: Optional[str] = None


class SiteContent(BaseModel):
    key: str
    value: str
    updated_at: Optional[datetime] = None


class SiteContentUpdate(BaseModel):
    hero_title: Optional[str] = None
    hero_subtitle: Optional[str] = None
    hero_description: Optional[str] = None
