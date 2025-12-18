"""Seed database with initial data"""
from motor.motor_asyncio import AsyncIOMotorClient
import asyncio
from datetime import datetime, timezone
import uuid
import os
from dotenv import load_dotenv
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
db_name = os.environ['DB_NAME']


async def seed_database():
    client = AsyncIOMotorClient(mongo_url)
    db = client[db_name]
    
    print("Seeding database...")
    
    # Clear existing data
    await db.plans.delete_many({})
    await db.features.delete_many({})
    await db.faqs.delete_many({})
    await db.site_content.delete_many({})
    print("✓ Cleared existing data")
    
    # Seed Plans
    plans = [
        {
            "plan_id": f"plan_{uuid.uuid4().hex[:12]}",
            "name": "Starter",
            "description": "Perfect for small communities",
            "price": 5.99,
            "ram": "2GB",
            "storage": "10GB SSD",
            "slots": "10 Players",
            "cpu": "1 vCore",
            "backups": "Daily",
            "support": "Email",
            "featured": False,
            "order": 1,
            "created_at": datetime.now(timezone.utc)
        },
        {
            "plan_id": f"plan_{uuid.uuid4().hex[:12]}",
            "name": "Professional",
            "description": "Best for growing servers",
            "price": 14.99,
            "ram": "4GB",
            "storage": "25GB SSD",
            "slots": "50 Players",
            "cpu": "2 vCores",
            "backups": "Twice Daily",
            "support": "24/7 Priority",
            "featured": True,
            "order": 2,
            "created_at": datetime.now(timezone.utc)
        },
        {
            "plan_id": f"plan_{uuid.uuid4().hex[:12]}",
            "name": "Enterprise",
            "description": "Maximum performance",
            "price": 29.99,
            "ram": "8GB",
            "storage": "50GB NVMe",
            "slots": "Unlimited",
            "cpu": "4 vCores",
            "backups": "Hourly",
            "support": "24/7 Premium",
            "featured": False,
            "order": 3,
            "created_at": datetime.now(timezone.utc)
        }
    ]
    await db.plans.insert_many(plans)
    print(f"✓ Seeded {len(plans)} plans")
    
    # Seed Features
    features = [
        {
            "feature_id": f"feature_{uuid.uuid4().hex[:12]}",
            "icon": "Zap",
            "title": "Instant Setup",
            "description": "Your server is ready in under 60 seconds. No waiting, just gaming.",
            "order": 1,
            "created_at": datetime.now(timezone.utc)
        },
        {
            "feature_id": f"feature_{uuid.uuid4().hex[:12]}",
            "icon": "Shield",
            "title": "DDoS Protection",
            "description": "Enterprise-grade protection keeps your server online 24/7.",
            "order": 2,
            "created_at": datetime.now(timezone.utc)
        },
        {
            "feature_id": f"feature_{uuid.uuid4().hex[:12]}",
            "icon": "Database",
            "title": "SSD Storage",
            "description": "Lightning-fast NVMe SSDs for the best performance.",
            "order": 3,
            "created_at": datetime.now(timezone.utc)
        },
        {
            "feature_id": f"feature_{uuid.uuid4().hex[:12]}",
            "icon": "Globe",
            "title": "Global Network",
            "description": "Low-latency servers in multiple locations worldwide.",
            "order": 4,
            "created_at": datetime.now(timezone.utc)
        },
        {
            "feature_id": f"feature_{uuid.uuid4().hex[:12]}",
            "icon": "Clock",
            "title": "Automatic Backups",
            "description": "Your world is safe with automated daily backups.",
            "order": 5,
            "created_at": datetime.now(timezone.utc)
        },
        {
            "feature_id": f"feature_{uuid.uuid4().hex[:12]}",
            "icon": "Headphones",
            "title": "24/7 Support",
            "description": "Expert support team ready to help anytime you need.",
            "order": 6,
            "created_at": datetime.now(timezone.utc)
        }
    ]
    await db.features.insert_many(features)
    print(f"✓ Seeded {len(features)} features")
    
    # Seed FAQs
    faqs = [
        {
            "faq_id": f"faq_{uuid.uuid4().hex[:12]}",
            "question": "How quickly can I get my server started?",
            "answer": "Your Minecraft server will be ready in less than 60 seconds after purchase. Just select your plan, and you're good to go!",
            "order": 1,
            "created_at": datetime.now(timezone.utc)
        },
        {
            "faq_id": f"faq_{uuid.uuid4().hex[:12]}",
            "question": "Can I upgrade or downgrade my plan?",
            "answer": "Absolutely! You can upgrade or downgrade your plan at any time from your dashboard. Changes take effect immediately.",
            "order": 2,
            "created_at": datetime.now(timezone.utc)
        },
        {
            "faq_id": f"faq_{uuid.uuid4().hex[:12]}",
            "question": "Do you support modded servers?",
            "answer": "Yes! We support all major mod loaders including Forge, Fabric, and Paper. You have full FTP access to customize your server.",
            "order": 3,
            "created_at": datetime.now(timezone.utc)
        },
        {
            "faq_id": f"faq_{uuid.uuid4().hex[:12]}",
            "question": "What about backups?",
            "answer": "All plans include automatic backups. Higher tier plans get more frequent backups. You can also create manual backups anytime.",
            "order": 4,
            "created_at": datetime.now(timezone.utc)
        },
        {
            "faq_id": f"faq_{uuid.uuid4().hex[:12]}",
            "question": "Is there a refund policy?",
            "answer": "Yes, we offer a 7-day money-back guarantee. If you're not satisfied, contact us for a full refund.",
            "order": 5,
            "created_at": datetime.now(timezone.utc)
        }
    ]
    await db.faqs.insert_many(faqs)
    print(f"✓ Seeded {len(faqs)} FAQs")
    
    # Seed Site Content
    site_content = [
        {
            "key": "hero_title",
            "value": "Build Your Dream",
            "updated_at": datetime.now(timezone.utc)
        },
        {
            "key": "hero_subtitle",
            "value": "Minecraft World",
            "updated_at": datetime.now(timezone.utc)
        },
        {
            "key": "hero_description",
            "value": "Lightning-fast servers with 99.9% uptime. Start in 60 seconds with enterprise-grade DDoS protection.",
            "updated_at": datetime.now(timezone.utc)
        }
    ]
    await db.site_content.insert_many(site_content)
    print(f"✓ Seeded {len(site_content)} site content items")
    
    print("\n✅ Database seeded successfully!")
    client.close()


if __name__ == "__main__":
    asyncio.run(seed_database())
