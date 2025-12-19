from fastapi import HTTPException, Request, Response
from datetime import datetime, timezone, timedelta
import uuid
import httpx
from typing import Optional


async def get_session_data(session_id: str) -> dict:
    """Exchange session_id for user data from Emergent Auth"""
    async with httpx.AsyncClient() as client:
        response = await client.get(
            "https://demobackend.emergentagent.com/auth/v1/env/oauth/session-data",
            headers={"X-Session-ID": session_id}
        )
        if response.status_code != 200:
            raise HTTPException(status_code=401, detail="Invalid session ID")
        return response.json()


async def create_or_update_user(db, user_data: dict) -> dict:
    """Create or update user in database"""
    # Admin email whitelist - add your admin emails here
    ADMIN_EMAILS = [
        "platinumvoidhosting@gmail.com",  # Auto-admin on sign in
    ]
    
    # Determine role based on email
    role = "admin" if user_data["email"] in ADMIN_EMAILS else "user"
    
    # Check if user exists by email
    existing_user = await db.users.find_one(
        {"email": user_data["email"]},
        {"_id": 0}
    )
    
    if existing_user:
        # Update existing user
        update_data = {
            "name": user_data["name"],
            "picture": user_data.get("picture"),
            "updated_at": datetime.now(timezone.utc)
        }
        
        # Update role if user is in admin whitelist and not already admin
        if role == "admin" and existing_user.get("role") != "admin":
            update_data["role"] = "admin"
        
        await db.users.update_one(
            {"email": user_data["email"]},
            {"$set": update_data}
        )
        return await db.users.find_one({"email": user_data["email"]}, {"_id": 0})
    else:
        # Create new user with custom user_id
        user_id = f"user_{uuid.uuid4().hex[:12]}"
        new_user = {
            "user_id": user_id,
            "email": user_data["email"],
            "name": user_data["name"],
            "picture": user_data.get("picture"),
            "role": role,  # Assign role based on whitelist
            "created_at": datetime.now(timezone.utc)
        }
        await db.users.insert_one(new_user)
        return await db.users.find_one({"user_id": user_id}, {"_id": 0})


async def create_session(db, user_id: str, session_token: str) -> dict:
    """Create new session in database"""
    session = {
        "user_id": user_id,
        "session_token": session_token,
        "expires_at": datetime.now(timezone.utc) + timedelta(days=7),
        "created_at": datetime.now(timezone.utc)
    }
    await db.user_sessions.insert_one(session)
    return session


async def get_user_from_session(db, session_token: str) -> Optional[dict]:
    """Get user data from session token"""
    # Find session
    session = await db.user_sessions.find_one(
        {"session_token": session_token},
        {"_id": 0}
    )
    
    if not session:
        return None
    
    # Check expiry with timezone-aware comparison
    expires_at = session["expires_at"]
    if isinstance(expires_at, str):
        expires_at = datetime.fromisoformat(expires_at)
    if expires_at.tzinfo is None:
        expires_at = expires_at.replace(tzinfo=timezone.utc)
    
    if expires_at < datetime.now(timezone.utc):
        # Session expired, delete it
        await db.user_sessions.delete_one({"session_token": session_token})
        return None
    
    # Get user
    user = await db.users.find_one(
        {"user_id": session["user_id"]},
        {"_id": 0}
    )
    return user


async def get_current_user(request: Request, db) -> dict:
    """Get current authenticated user from cookie or Authorization header"""
    # Try cookie first
    session_token = request.cookies.get("session_token")
    
    # Fallback to Authorization header
    if not session_token:
        auth_header = request.headers.get("Authorization")
        if auth_header and auth_header.startswith("Bearer "):
            session_token = auth_header.replace("Bearer ", "")
    
    if not session_token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    user = await get_user_from_session(db, session_token)
    if not user:
        raise HTTPException(status_code=401, detail="Session expired or invalid")
    
    return user


async def require_admin(request: Request, db) -> dict:
    """Require admin role for protected endpoints"""
    user = await get_current_user(request, db)
    if user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    return user


def set_session_cookie(response: Response, session_token: str):
    """Set httpOnly session cookie"""
    # Note: For local development, use secure=False and samesite="Lax"
    # For production, use secure=True and samesite="None"
    response.set_cookie(
        key="session_token",
        value=session_token,
        httponly=True,
        secure=False,  # Set to True in production
        samesite="Lax",  # Set to "None" in production
        path="/",
        max_age=7 * 24 * 60 * 60  # 7 days
    )


def clear_session_cookie(response: Response):
    """Clear session cookie"""
    response.delete_cookie(
        key="session_token",
        path="/"
    )
