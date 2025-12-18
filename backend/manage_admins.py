"""Admin Management Script - Add or remove admin users"""
from motor.motor_asyncio import AsyncIOMotorClient
import asyncio
import os
from dotenv import load_dotenv
from pathlib import Path
import sys

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
db_name = os.environ['DB_NAME']


async def make_admin(email: str):
    """Make a user admin by email"""
    client = AsyncIOMotorClient(mongo_url)
    db = client[db_name]
    
    result = await db.users.update_one(
        {"email": email},
        {"$set": {"role": "admin"}}
    )
    
    if result.matched_count > 0:
        print(f"✅ {email} is now an admin")
    else:
        print(f"❌ User with email {email} not found. They need to sign in first.")
    
    client.close()


async def remove_admin(email: str):
    """Remove admin role from a user"""
    client = AsyncIOMotorClient(mongo_url)
    db = client[db_name]
    
    result = await db.users.update_one(
        {"email": email},
        {"$set": {"role": "user"}}
    )
    
    if result.matched_count > 0:
        print(f"✅ {email} is now a regular user")
    else:
        print(f"❌ User with email {email} not found")
    
    client.close()


async def list_admins():
    """List all admin users"""
    client = AsyncIOMotorClient(mongo_url)
    db = client[db_name]
    
    admins = await db.users.find({"role": "admin"}, {"_id": 0}).to_list(100)
    
    if admins:
        print("\n📋 Admin Users:")
        for admin in admins:
            print(f"  - {admin['name']} ({admin['email']})")
    else:
        print("❌ No admin users found")
    
    client.close()


async def list_all_users():
    """List all users"""
    client = AsyncIOMotorClient(mongo_url)
    db = client[db_name]
    
    users = await db.users.find({}, {"_id": 0}).to_list(100)
    
    if users:
        print("\n👥 All Users:")
        for user in users:
            role_icon = "👑" if user['role'] == 'admin' else "👤"
            print(f"  {role_icon} {user['name']} ({user['email']}) - {user['role']}")
    else:
        print("❌ No users found")
    
    client.close()


async def main():
    if len(sys.argv) < 2:
        print("""
Usage:
  python manage_admins.py add <email>       - Make user admin
  python manage_admins.py remove <email>    - Remove admin role
  python manage_admins.py list              - List all admins
  python manage_admins.py list-all          - List all users

Examples:
  python manage_admins.py add john@example.com
  python manage_admins.py remove john@example.com
  python manage_admins.py list
  python manage_admins.py list-all
        """)
        return
    
    command = sys.argv[1].lower()
    
    if command == "add":
        if len(sys.argv) < 3:
            print("❌ Please provide an email address")
            return
        await make_admin(sys.argv[2])
    
    elif command == "remove":
        if len(sys.argv) < 3:
            print("❌ Please provide an email address")
            return
        await remove_admin(sys.argv[2])
    
    elif command == "list":
        await list_admins()
    
    elif command == "list-all":
        await list_all_users()
    
    else:
        print(f"❌ Unknown command: {command}")


if __name__ == "__main__":
    asyncio.run(main())
