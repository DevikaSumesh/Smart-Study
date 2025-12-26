import os
import shutil
from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from models.chat import ChatRequest, ChatResponse, DocumentInfo
from services.rag_service import rag_service
from utils.auth import verify_token
from database import chat_messages_collection, documents_collection
from datetime import datetime

router = APIRouter(prefix="/api/chat", tags=["Chat"])

@router.post("/upload", response_model=DocumentInfo)
async def upload_document(
    file: UploadFile = File(...),
    user_id: str = Depends(verify_token)
):
    """Upload PDF and process it"""
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files allowed")
    
    # Save temporarily
    temp_path = f"temp_{user_id}_{file.filename}"
    with open(temp_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    try:
        # Process PDF
        num_chunks = await rag_service.process_pdf(temp_path, user_id)
        
        # Save to database
        doc_info = {
            "user_id": user_id,
            "filename": file.filename,
            "chunks": num_chunks,
            "uploaded_at": datetime.utcnow()
        }
        await documents_collection.insert_one(doc_info)
        
        # Cleanup
        os.remove(temp_path)
        
        return DocumentInfo(
            filename=file.filename,
            chunks=num_chunks
        )
    except Exception as e:
        if os.path.exists(temp_path):
            os.remove(temp_path)
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/message", response_model=ChatResponse)
async def chat_message(
    request: ChatRequest,
    user_id: str = Depends(verify_token)
):
    """Ask a question"""
    response = rag_service.get_answer(request.question, user_id)
    
    # Save to chat history
    chat_entry = {
        "user_id": user_id,
        "question": request.question,
        "answer": response["answer"],
        "sources": response["sources"],
        "timestamp": datetime.utcnow()
    }
    await chat_messages_collection.insert_one(chat_entry)
    
    return ChatResponse(
        answer=response["answer"],
        sources=response["sources"]
    )

@router.get("/history")
async def get_chat_history(user_id: str = Depends(verify_token)):
    """Get chat history"""
    messages = await chat_messages_collection.find(
        {"user_id": user_id}
    ).sort("timestamp", -1).limit(50).to_list(50)
    
    return [{
        "question": msg["question"],
        "answer": msg["answer"],
        "sources": msg.get("sources", []),
        "timestamp": msg["timestamp"]
    } for msg in messages]

@router.get("/documents")
async def get_documents(user_id: str = Depends(verify_token)):
    """Get uploaded documents"""
    docs = await documents_collection.find(
        {"user_id": user_id}
    ).sort("uploaded_at", -1).to_list(100)
    
    return [{
        "filename": doc["filename"],
        "chunks": doc["chunks"],
        "uploaded_at": doc["uploaded_at"]
    } for doc in docs]

@router.delete("/clear")
async def clear_history(user_id: str = Depends(verify_token)):
    """Clear chat history"""
    result = await chat_messages_collection.delete_many({"user_id": user_id})
    return {"deleted": result.deleted_count}
