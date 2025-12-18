"""Admin-only routes for user management"""
from fastapi import APIRouter, Request, HTTPException
from datetime import datetime, timezone
from pydantic import BaseModel
from auth import require_admin

admin_user_router = APIRouter(prefix="/admin")


class UserRoleUpdate(BaseModel):
    role: str


@admin_user_router.get("/users")
async def get_all_users(request: Request):
    """Get all users (admin only)"""
    from server import db
    await require_admin(request, db)
    
    users = await db.users.find({}, {"_id": 0}).sort("created_at", -1).to_list(100)
    return {"users": users}


@admin_user_router.put("/users/{user_id}/role")
async def update_user_role(request: Request, user_id: str, role_update: UserRoleUpdate):
    """Update user role (admin only)"""
    from server import db
    admin_user = await require_admin(request, db)
    
    # Validate role
    if role_update.role not in ["user", "admin"]:
        raise HTTPException(status_code=400, detail="Role must be 'user' or 'admin'")
    
    # Prevent admin from changing their own role
    if user_id == admin_user["user_id"]:
        raise HTTPException(status_code=400, detail="Cannot change your own role")
    
    # Find user
    user = await db.users.find_one({"user_id": user_id})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Update role
    await db.users.update_one(
        {"user_id": user_id},
        {
            "$set": {
                "role": role_update.role,
                "updated_at": datetime.now(timezone.utc)
            }
        }
    )
    
    updated_user = await db.users.find_one({"user_id": user_id}, {"_id": 0})
    return updated_user
