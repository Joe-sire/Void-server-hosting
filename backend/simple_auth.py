"""Simple access code authentication"""
from fastapi import APIRouter, Request, Response, HTTPException
import os
import uuid
from datetime import datetime, timezone, timedelta
from pydantic import BaseModel
from auth import create_session, set_session_cookie

simple_auth_router = APIRouter(prefix="/auth")

# Admin access codes - add more as needed
ACCESS_CODES = {
    "platinumvoidhosting@gmail.com": "minecraft2024",  # Change this code!
}

class LoginRequest(BaseModel):
    email: str
    access_code: str


@simple_auth_router.post("/login")
async def simple_login(request: Request, response: Response, login_data: LoginRequest):
    """Simple login with email and access code"""
    from server import db
    
    email = login_data.email.lower().strip()
    
    # Check if email has an access code
    if email not in ACCESS_CODES:
        raise HTTPException(status_code=401, detail="No access code found for this email")
    
    # Verify access code
    if ACCESS_CODES[email] != login_data.access_code:
        raise HTTPException(status_code=401, detail="Invalid access code")
    
    # Check if user exists
    user = await db.users.find_one({"email": email}, {"_id": 0})
    
    if not user:
        # Create new user
        user_id = f"user_{uuid.uuid4().hex[:12]}"
        user = {
            "user_id": user_id,
            "email": email,
            "name": email.split('@')[0].replace('.', ' ').title(),
            "picture": None,
            "role": "admin",  # Auto-admin for whitelisted emails
            "created_at": datetime.now(timezone.utc)
        }
        await db.users.insert_one(user)
        user = await db.users.find_one({"user_id": user_id}, {"_id": 0})
    
    # Generate session token
    session_token = f"session_{uuid.uuid4().hex}"
    await create_session(db, user["user_id"], session_token)
    
    # Set httpOnly cookie
    set_session_cookie(response, session_token)
    
    return {
        "user": user,
        "session_token": session_token
    }
