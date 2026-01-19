from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import auth, chat, study
from database import test_connection

app = FastAPI(
    title="SmartStudy AI Copilot",
    description="RAG Chatbot + Flashcards + Study Resources",
    version="2.0.0"
)

# CORS - Allow frontend to connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router)
app.include_router(chat.router)
app.include_router(study.router)

@app.on_event("startup")
async def startup_event():
    print("🚀 Starting SmartStudy V2...")
    await test_connection()

@app.get("/")
async def root():
    return {
        "message": "SmartStudy RAG Chatbot API V2",
        "status": "running",
        "docs": "/docs"
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
