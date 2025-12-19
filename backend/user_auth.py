"""User authentication with email/password"""
from fastapi import APIRouter, Request, Response, HTTPException
import uuid
from datetime import datetime, timezone
from pydantic import BaseModel, EmailStr
from passlib.context import CryptContext
from auth import create_session, set_session_cookie

user_auth_router = APIRouter(prefix="/auth")

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Admin access code for existing admin
ADMIN_ACCESS_CODE = "minecraft2024"

class SignUpRequest(BaseModel):
    name: str
    email: EmailStr
    password: str

class SignInRequest(BaseModel):
    email: EmailStr
    password: str


def hash_password(password: str) -> str:
    """Hash a password"""
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a password against a hash"""
    return pwd_context.verify(plain_password, hashed_password)


@user_auth_router.post("/signup")
async def signup(request: Request, response: Response, signup_data: SignUpRequest):
    """Sign up a new user"""
    from server import db
    
    email = signup_data.email.lower().strip()
    
    # Check if user already exists
    existing_user = await db.users.find_one({"email": email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Check if password is provided (not admin access code)
    if signup_data.password == ADMIN_ACCESS_CODE:
        raise HTTPException(status_code=400, detail="Invalid password")
    
    # Create new user
    user_id = f"user_{uuid.uuid4().hex[:12]}"
    hashed_password = hash_password(signup_data.password)
    
    user = {
        "user_id": user_id,
        "email": email,
        "name": signup_data.name,
        "password_hash": hashed_password,
        "picture": None,
        "role": "user",  # Regular users by default
        "created_at": datetime.now(timezone.utc)
    }
    
    await db.users.insert_one(user)
    
    # Remove password hash from response
    user_response = await db.users.find_one({"user_id": user_id}, {"_id": 0, "password_hash": 0})
    
    # Generate session token
    session_token = f"session_{uuid.uuid4().hex}"
    await create_session(db, user_id, session_token)
    
    # Set httpOnly cookie
    set_session_cookie(response, session_token)
    
    return {
        "user": user_response,
        "session_token": session_token
    }


@user_auth_router.post("/signin")
async def signin(request: Request, response: Response, signin_data: SignInRequest):
    """Sign in an existing user"""
    from server import db
    
    email = signin_data.email.lower().strip()
    
    # Check if this is admin access code login (for existing admin)
    if email == "platinumvoidhosting@gmail.com" and signin_data.password == ADMIN_ACCESS_CODE:
        # Admin login with access code
        user = await db.users.find_one({"email": email}, {"_id": 0, "password_hash": 0})
        
        if not user:
            # Create admin user if doesn't exist
            user_id = f"user_{uuid.uuid4().hex[:12]}"
            user = {
                "user_id": user_id,
                "email": email,
                "name": "Admin User",
                "picture": None,
                "role": "admin",
                "created_at": datetime.now(timezone.utc)
            }
            await db.users.insert_one(user)
            user = await db.users.find_one({"user_id": user_id}, {"_id": 0, "password_hash": 0})
        
        # Generate session token
        session_token = f"session_{uuid.uuid4().hex}"
        await create_session(db, user["user_id"], session_token)
        set_session_cookie(response, session_token)
        
        return {
            "user": user,
            "session_token": session_token
        }
    
    # Regular user login
    user = await db.users.find_one({"email": email})
    
    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    # Check if user has password (not OAuth user)
    if "password_hash" not in user:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    # Verify password
    if not verify_password(signin_data.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    # Remove password hash from response
    user_response = await db.users.find_one({"user_id": user["user_id"]}, {"_id": 0, "password_hash": 0})
    
    # Generate session token
    session_token = f"session_{uuid.uuid4().hex}"
    await create_session(db, user["user_id"], session_token)
    
    # Set httpOnly cookie
    set_session_cookie(response, session_token)
    
    return {
        "user": user_response,
        "session_token": session_token
    }
