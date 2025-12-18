from fastapi import FastAPI, APIRouter, Request, Response, HTTPException
from fastapi.responses import JSONResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from typing import List
import uuid
from datetime import datetime, timezone

from models import (
    User, Server, ServerCreate, ServerUpdate, 
    Plan, PlanUpdate, Feature, FeatureUpdate,
    FAQ, FAQCreate, FAQUpdate, SiteContentUpdate
)
from auth import (
    get_session_data, create_or_update_user, create_session,
    get_current_user, require_admin, set_session_cookie, clear_session_cookie
)
from admin_routes import admin_user_router

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# ==================== Authentication Routes ====================

@api_router.post("/auth/session")
async def create_auth_session(request: Request, response: Response):
    """Handle session creation from Emergent OAuth"""
    body = await request.json()
    session_id = body.get("session_id")
    
    if not session_id:
        raise HTTPException(status_code=400, detail="session_id required")
    
    # Get user data from Emergent Auth
    user_data = await get_session_data(session_id)
    
    # Create or update user in our database
    user = await create_or_update_user(db, user_data)
    
    # Create session with the session_token from Emergent
    session_token = user_data.get("session_token")
    await create_session(db, user["user_id"], session_token)
    
    # Set httpOnly cookie
    set_session_cookie(response, session_token)
    
    return {"user": user}


@api_router.get("/auth/me")
async def get_current_user_info(request: Request):
    """Get current authenticated user"""
    user = await get_current_user(request, db)
    return user


@api_router.post("/auth/logout")
async def logout(request: Request, response: Response):
    """Logout user"""
    try:
        user = await get_current_user(request, db)
        session_token = request.cookies.get("session_token")
        
        if session_token:
            # Delete session from database
            await db.user_sessions.delete_one({"session_token": session_token})
        
        # Clear cookie
        clear_session_cookie(response)
        
        return {"message": "Logged out successfully"}
    except:
        # Even if auth fails, clear the cookie
        clear_session_cookie(response)
        return {"message": "Logged out"}


# ==================== Public Routes ====================

@api_router.get("/plans")
async def get_plans():
    """Get all server plans"""
    plans = await db.plans.find({}, {"_id": 0}).sort("order", 1).to_list(100)
    return {"plans": plans}


@api_router.get("/features")
async def get_features():
    """Get all features"""
    features = await db.features.find({}, {"_id": 0}).sort("order", 1).to_list(100)
    return {"features": features}


@api_router.get("/faqs")
async def get_faqs():
    """Get all FAQs"""
    faqs = await db.faqs.find({}, {"_id": 0}).sort("order", 1).to_list(100)
    return {"faqs": faqs}


@api_router.get("/content")
async def get_site_content():
    """Get site content"""
    content_list = await db.site_content.find({}, {"_id": 0}).to_list(100)
    content = {item["key"]: item["value"] for item in content_list}
    return content


# ==================== User Server Routes ====================

@api_router.get("/servers")
async def get_user_servers(request: Request):
    """Get user's servers"""
    user = await get_current_user(request, db)
    servers = await db.servers.find(
        {"user_id": user["user_id"]}, 
        {"_id": 0}
    ).to_list(100)
    return {"servers": servers}


@api_router.post("/servers")
async def create_server(request: Request, server_data: ServerCreate):
    """Create new server"""
    user = await get_current_user(request, db)
    
    # Generate server IP (mock)
    server_name_slug = server_data.name.lower().replace(" ", "-")
    
    server = {
        "server_id": f"server_{uuid.uuid4().hex[:12]}",
        "user_id": user["user_id"],
        "name": server_data.name,
        "status": "stopped",
        "plan": server_data.plan,
        "players": "0/10",
        "uptime": "0%",
        "ip": f"{server_name_slug}.yourserver.com",
        "port": "25565",
        "version": server_data.version,
        "created_at": datetime.now(timezone.utc)
    }
    
    await db.servers.insert_one(server)
    return await db.servers.find_one({"server_id": server["server_id"]}, {"_id": 0})


@api_router.get("/servers/{server_id}")
async def get_server(request: Request, server_id: str):
    """Get server details"""
    user = await get_current_user(request, db)
    server = await db.servers.find_one(
        {"server_id": server_id, "user_id": user["user_id"]},
        {"_id": 0}
    )
    if not server:
        raise HTTPException(status_code=404, detail="Server not found")
    return server


@api_router.put("/servers/{server_id}")
async def update_server(request: Request, server_id: str, updates: ServerUpdate):
    """Update server settings"""
    user = await get_current_user(request, db)
    
    # Check server ownership
    server = await db.servers.find_one(
        {"server_id": server_id, "user_id": user["user_id"]}
    )
    if not server:
        raise HTTPException(status_code=404, detail="Server not found")
    
    # Update server
    update_data = {k: v for k, v in updates.dict().items() if v is not None}
    if update_data:
        update_data["updated_at"] = datetime.now(timezone.utc)
        await db.servers.update_one(
            {"server_id": server_id},
            {"$set": update_data}
        )
    
    return await db.servers.find_one({"server_id": server_id}, {"_id": 0})


@api_router.post("/servers/{server_id}/start")
async def start_server(request: Request, server_id: str):
    """Start server"""
    user = await get_current_user(request, db)
    
    server = await db.servers.find_one(
        {"server_id": server_id, "user_id": user["user_id"]}
    )
    if not server:
        raise HTTPException(status_code=404, detail="Server not found")
    
    await db.servers.update_one(
        {"server_id": server_id},
        {"$set": {"status": "running", "updated_at": datetime.now(timezone.utc)}}
    )
    
    return await db.servers.find_one({"server_id": server_id}, {"_id": 0})


@api_router.post("/servers/{server_id}/stop")
async def stop_server(request: Request, server_id: str):
    """Stop server"""
    user = await get_current_user(request, db)
    
    server = await db.servers.find_one(
        {"server_id": server_id, "user_id": user["user_id"]}
    )
    if not server:
        raise HTTPException(status_code=404, detail="Server not found")
    
    await db.servers.update_one(
        {"server_id": server_id},
        {"$set": {"status": "stopped", "updated_at": datetime.now(timezone.utc)}}
    )
    
    return await db.servers.find_one({"server_id": server_id}, {"_id": 0})


@api_router.post("/servers/{server_id}/restart")
async def restart_server(request: Request, server_id: str):
    """Restart server"""
    user = await get_current_user(request, db)
    
    server = await db.servers.find_one(
        {"server_id": server_id, "user_id": user["user_id"]}
    )
    if not server:
        raise HTTPException(status_code=404, detail="Server not found")
    
    await db.servers.update_one(
        {"server_id": server_id},
        {"$set": {"status": "running", "updated_at": datetime.now(timezone.utc)}}
    )
    
    return await db.servers.find_one({"server_id": server_id}, {"_id": 0})


@api_router.get("/servers/{server_id}/console")
async def get_server_console(request: Request, server_id: str):
    """Get server console logs (mocked)"""
    user = await get_current_user(request, db)
    
    server = await db.servers.find_one(
        {"server_id": server_id, "user_id": user["user_id"]}
    )
    if not server:
        raise HTTPException(status_code=404, detail="Server not found")
    
    # Mock console logs
    logs = [
        "[12:00:01] [Server thread/INFO]: Starting minecraft server version 1.20.1",
        "[12:00:02] [Server thread/INFO]: Loading properties",
        "[12:00:03] [Server thread/INFO]: Preparing level \"world\"",
        "[12:00:05] [Server thread/INFO]: Done (2.5s)! For help, type \"help\"",
    ]
    
    return {"logs": logs}


@api_router.delete("/servers/{server_id}")
async def delete_server(request: Request, server_id: str):
    """Delete server"""
    user = await get_current_user(request, db)
    
    result = await db.servers.delete_one(
        {"server_id": server_id, "user_id": user["user_id"]}
    )
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Server not found")
    
    return {"message": "Server deleted successfully"}


# ==================== Admin Routes ====================

@api_router.put("/admin/plans/{plan_id}")
async def update_plan(request: Request, plan_id: str, updates: PlanUpdate):
    """Update plan (admin only)"""
    await require_admin(request, db)
    
    plan = await db.plans.find_one({"plan_id": plan_id})
    if not plan:
        raise HTTPException(status_code=404, detail="Plan not found")
    
    update_data = {k: v for k, v in updates.dict().items() if v is not None}
    if update_data:
        update_data["updated_at"] = datetime.now(timezone.utc)
        await db.plans.update_one(
            {"plan_id": plan_id},
            {"$set": update_data}
        )
    
    return await db.plans.find_one({"plan_id": plan_id}, {"_id": 0})


@api_router.put("/admin/features/{feature_id}")
async def update_feature(request: Request, feature_id: str, updates: FeatureUpdate):
    """Update feature (admin only)"""
    await require_admin(request, db)
    
    feature = await db.features.find_one({"feature_id": feature_id})
    if not feature:
        raise HTTPException(status_code=404, detail="Feature not found")
    
    update_data = {k: v for k, v in updates.dict().items() if v is not None}
    if update_data:
        update_data["updated_at"] = datetime.now(timezone.utc)
        await db.features.update_one(
            {"feature_id": feature_id},
            {"$set": update_data}
        )
    
    return await db.features.find_one({"feature_id": feature_id}, {"_id": 0})


@api_router.post("/admin/faqs")
async def create_faq(request: Request, faq_data: FAQCreate):
    """Create FAQ (admin only)"""
    await require_admin(request, db)
    
    # Get max order
    faqs = await db.faqs.find({}).sort("order", -1).limit(1).to_list(1)
    max_order = faqs[0]["order"] if faqs else 0
    
    faq = {
        "faq_id": f"faq_{uuid.uuid4().hex[:12]}",
        "question": faq_data.question,
        "answer": faq_data.answer,
        "order": max_order + 1,
        "created_at": datetime.now(timezone.utc)
    }
    
    await db.faqs.insert_one(faq)
    return await db.faqs.find_one({"faq_id": faq["faq_id"]}, {"_id": 0})


@api_router.put("/admin/faqs/{faq_id}")
async def update_faq(request: Request, faq_id: str, updates: FAQUpdate):
    """Update FAQ (admin only)"""
    await require_admin(request, db)
    
    faq = await db.faqs.find_one({"faq_id": faq_id})
    if not faq:
        raise HTTPException(status_code=404, detail="FAQ not found")
    
    update_data = {k: v for k, v in updates.dict().items() if v is not None}
    if update_data:
        update_data["updated_at"] = datetime.now(timezone.utc)
        await db.faqs.update_one(
            {"faq_id": faq_id},
            {"$set": update_data}
        )
    
    return await db.faqs.find_one({"faq_id": faq_id}, {"_id": 0})


@api_router.delete("/admin/faqs/{faq_id}")
async def delete_faq(request: Request, faq_id: str):
    """Delete FAQ (admin only)"""
    await require_admin(request, db)
    
    result = await db.faqs.delete_one({"faq_id": faq_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="FAQ not found")
    
    return {"message": "FAQ deleted successfully"}


@api_router.put("/admin/content")
async def update_site_content(request: Request, updates: SiteContentUpdate):
    """Update site content (admin only)"""
    await require_admin(request, db)
    
    update_mapping = {
        "hero_title": updates.hero_title,
        "hero_subtitle": updates.hero_subtitle,
        "hero_description": updates.hero_description
    }
    
    for key, value in update_mapping.items():
        if value is not None:
            await db.site_content.update_one(
                {"key": key},
                {"$set": {"value": value, "updated_at": datetime.now(timezone.utc)}},
                upsert=True
            )
    
    # Return updated content
    content_list = await db.site_content.find({}, {"_id": 0}).to_list(100)
    content = {item["key"]: item["value"] for item in content_list}
    return content


# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()