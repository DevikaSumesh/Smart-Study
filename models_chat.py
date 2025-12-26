from pydantic import BaseModel
from typing import List, Optional


class ChatRequest(BaseModel):
    question: str


class ChatResponse(BaseModel):
    answer: str
    sources: List[str] = []


class DocumentInfo(BaseModel):
    filename: str
    chunks: int
