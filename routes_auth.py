from fastapi import APIRouter, HTTPException, Depends
from models.user import UserCreate, UserLogin, Token
from utils.auth import get_password_hash, verify_password, create_access_token, verify_token
from database import users_collection
from datetime import datetime
from bson import ObjectId

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

@router.post("/signup", response_model=Token)
async def signup(user: UserCreate):
    # Check if user exists
    existing_user = await users_collection.find_one({"email": user.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Create user
    user_dict = {
        "email": user.email,
        "password": get_password_hash(user.password),
        "name": user.name,
        "created_at": datetime.utcnow()
    }
    
    result = await users_collection.insert_one(user_dict)
    
    # Create token
    access_token = create_access_token(data={"sub": str(result.inserted_id)})
    
    return Token(access_token=access_token, token_type="bearer")

@router.post("/login", response_model=Token)
async def login(user: UserLogin):
    # Find user
    db_user = await users_collection.find_one({"email": user.email})
    if not db_user or not verify_password(user.password, db_user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    # Create token
    access_token = create_access_token(data={"sub": str(db_user["_id"])})
    
    return Token(access_token=access_token, token_type="bearer")

@router.get("/me")
async def get_current_user(user_id: str = Depends(verify_token)):
    user = await users_collection.find_one({"_id": ObjectId(user_id)})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return {
        "id": str(user["_id"]),
        "email": user["email"],
        "name": user["name"]
    }
