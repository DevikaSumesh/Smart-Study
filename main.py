from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import auth, chat
from database import test_connection

app = FastAPI(
    title="SmartStudy RAG Chatbot API",
    description="AI-Powered Study Assistant with RAG",
    version="1.0.0"
)

# CORS - Allow frontend to connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change to specific URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router)
app.include_router(chat.router)

@app.on_event("startup")
async def startup_event():
    print("🚀 Starting SmartStudy API...")
    await test_connection()

@app.get("/")
async def root():
    return {
        "message": "SmartStudy RAG Chatbot API",
        "status": "running",
        "docs": "/docs"
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
