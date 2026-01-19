from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId
from config import get_settings
import certifi

settings = get_settings()

client = AsyncIOMotorClient(
    settings.mongodb_uri,
    tlsCAFile=certifi.where(),  # Use certifi for SSL certificates
    serverSelectionTimeoutMS=5000,  # 5 second timeout
    connectTimeoutMS=10000  # 10 second connection timeout
)

database = client.smartstudy

# Collections
users_collection = database.get_collection("users")
chat_messages_collection = database.get_collection("chat_messages")
documents_collection = database.get_collection("documents")

async def test_connection():
    """Test MongoDB connection"""
    try:
        await client.admin.command('ping')
        print(" MongoDB connection successful!")
        return True
    except Exception as e:
        print(f" MongoDB connection failed: {e}")
        return False
