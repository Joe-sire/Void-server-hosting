"""Direct Google OAuth implementation"""
from fastapi import APIRouter, Request, Response, HTTPException
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
import os
import uuid
from datetime import datetime, timezone, timedelta
from auth import create_or_update_user, create_session, set_session_cookie

google_auth_router = APIRouter(prefix="/auth/google")

GOOGLE_CLIENT_ID = os.environ.get('GOOGLE_CLIENT_ID')
GOOGLE_CLIENT_SECRET = os.environ.get('GOOGLE_CLIENT_SECRET')


@google_auth_router.post("/verify")
async def verify_google_token(request: Request, response: Response):
    """Verify Google ID token and create session"""
    from server import db
    
    body = await request.json()
    token = body.get("token")
    
    if not token:
        raise HTTPException(status_code=400, detail="Token required")
    
    try:
        # Verify the token
        idinfo = id_token.verify_oauth2_token(
            token, 
            google_requests.Request(), 
            GOOGLE_CLIENT_ID
        )
        
        # Extract user info
        user_data = {
            "id": idinfo.get("sub"),
            "email": idinfo.get("email"),
            "name": idinfo.get("name"),
            "picture": idinfo.get("picture")
        }
        
        # Create or update user in our database
        user = await create_or_update_user(db, user_data)
        
        # Generate session token
        session_token = f"google_session_{uuid.uuid4().hex}"
        await create_session(db, user["user_id"], session_token)
        
        # Set httpOnly cookie
        set_session_cookie(response, session_token)
        
        return {
            "user": user,
            "session_token": session_token
        }
        
    except ValueError as e:
        # Invalid token
        raise HTTPException(status_code=401, detail=f"Invalid token: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Authentication failed: {str(e)}")
