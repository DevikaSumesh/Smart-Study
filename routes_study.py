from fastapi import APIRouter, Depends, HTTPException
from services.rag_service import rag_service
from utils.auth import verify_token
import os

router = APIRouter(prefix="/api/study", tags=["Study Tools"])

@router.post("/flashcards")
async def get_flashcards(user_id: str = Depends(verify_token)):
    """Generate 8 Flashcards from uploaded documents"""
    cards = rag_service.generate_flashcards()
    if not cards:
        raise HTTPException(status_code=400, detail="No documents found or generation failed.")
    return cards

@router.get("/resources")
async def get_resources(user_id: str = Depends(verify_token)):
    """Get YouTube and Article recommendations"""
    resources = rag_service.recommend_resources()
    if not resources:
        raise HTTPException(status_code=400, detail="Could not find resources.")
    return resources
