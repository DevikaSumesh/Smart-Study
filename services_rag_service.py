import os
import time
import shutil
import json
from typing import List
from langchain_google_genai import GoogleGenerativeAIEmbeddings, ChatGoogleGenerativeAI
from langchain_community.vectorstores import FAISS
from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain.chains import RetrievalQA
from config import get_settings

settings = get_settings()
DEMO_MODE = settings.demo_mode

# --- CONFIGURATION ---
CHAT_MODEL = "gemini-flash-latest"
EMBEDDING_MODEL = "models/text-embedding-004"

if not DEMO_MODE:
    embeddings = GoogleGenerativeAIEmbeddings(
        model=EMBEDDING_MODEL, 
        google_api_key=settings.gemini_api_key
    )
    llm = ChatGoogleGenerativeAI(
        model=CHAT_MODEL, 
        google_api_key=settings.gemini_api_key, 
        temperature=0.3
    )
else:
    embeddings = None
    llm = None

FAISS_INDEX_PATH = "faiss_index"

class RAGService:
    def __init__(self):
        self.vector_store = None
        if not DEMO_MODE:
            self._load_existing_index()

    def _load_existing_index(self):
        """Attempts to load the database from disk on startup"""
        if os.path.exists(FAISS_INDEX_PATH):
            try:
                self.vector_store = FAISS.load_local(
                    FAISS_INDEX_PATH, 
                    embeddings, 
                    allow_dangerous_deserialization=True
                )
                print("✅ Loaded existing FAISS index")
            except Exception as e:
                print(f"⚠️ Could not load index: {e}")

    def clear_memory(self):
        """Wipes the database for a fresh start (used before batch uploads)"""
        print("🧹 Clearing old document memory...")
        self.vector_store = None
        if os.path.exists(FAISS_INDEX_PATH):
            try:
                shutil.rmtree(FAISS_INDEX_PATH)
                print("✅ Old database deleted.")
            except Exception as e:
                print(f"⚠️ Error deleting old DB: {e}")

    async def process_file(self, file_path: str, user_id: str) -> int:
        """Adds a SINGLE file to the existing database"""
        if DEMO_MODE: return 5

        try:
            loader = PyPDFLoader(file_path)
            documents = loader.load()
            
            for doc in documents:
                doc.metadata["user_id"] = user_id
            
            text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=100)
            chunks = text_splitter.split_documents(documents)
            
            print(f"Processing {len(chunks)} chunks from {os.path.basename(file_path)}...")

            # Add to Vector Store
            for i, chunk in enumerate(chunks):
                if self.vector_store is None:
                    self.vector_store = FAISS.from_documents([chunk], embeddings)
                else:
                    self.vector_store.add_documents([chunk])
                
                # Save periodically
                if i % 5 == 0:
                    self.vector_store.save_local(FAISS_INDEX_PATH)
                    time.sleep(2) 

            # Final save
            self.vector_store.save_local(FAISS_INDEX_PATH)
            return len(chunks)

        except Exception as e:
            print(f"❌ Error processing PDF: {e}")
            raise e

    def get_answer(self, query: str, user_id: str) -> dict:
        """Ask a question to the current documents"""
        if DEMO_MODE: return {"answer": "[DEMO] Answer.", "sources": []}
        if not self.vector_store: return {"answer": "No documents uploaded.", "sources": []}
            
        qa_chain = RetrievalQA.from_chain_type(
            llm=llm,
            chain_type="stuff",
            retriever=self.vector_store.as_retriever(search_kwargs={"k": 5}),
            return_source_documents=True
        )
        
        try:
            result = qa_chain.invoke({"query": query})
            answer = result.get("result", "I don't know.")
            sources = [doc.metadata.get("source", "unknown") for doc in result.get("source_documents", [])]
            return {"answer": answer, "sources": list(set(sources))}
        except Exception as e:
            print(f"Chat Error: {e}")
            return {"answer": "Error connecting to AI. Please try again.", "sources": []}

    # --- NEW STUDY FEATURES (Flashcards & Resources Only) ---

    def generate_flashcards(self) -> List[dict]:
        """Generates Flashcards based on document content"""
        if not self.vector_store: return []
        
        # 1. Retrieve broad context
        retriever = self.vector_store.as_retriever(search_kwargs={"k": 10})
        docs = retriever.invoke("Important definitions, key concepts, and exam questions")
        context_text = "\n\n".join([d.page_content for d in docs])

        # 2. Prompt Gemini
        prompt = f"""
        Based on the text below, generate 8 study flashcards.
        Format strictly as a JSON list of objects with keys 'front' and 'back'.
        Do not include markdown code blocks (like ```json). Just the raw JSON.
        
        TEXT:
        {context_text[:3000]}
        """
        
        response = llm.invoke(prompt)
        content = response.content.strip().replace("```json", "").replace("```", "")
        
        try:
            return json.loads(content)
        except:
            return [{"front": "Error", "back": "Could not generate flashcards."}]

    def recommend_resources(self) -> List[dict]:
        """Suggests Search Queries for YouTube and Articles"""
        if not self.vector_store: return []

        retriever = self.vector_store.as_retriever(search_kwargs={"k": 5})
        docs = retriever.invoke("Core topics and technical terms")
        context_text = "\n\n".join([d.page_content for d in docs])

        prompt = f"""
        Identify 3 key complex topics from the text. 
        For each topic, provide:
        1. A YouTube search query.
        2. A Google Article search query.
        
        Format strictly as a JSON list with keys: 'topic', 'youtube_query', 'article_query'.
        Do not include markdown code blocks.
        
        TEXT:
        {context_text[:2000]}
        """
        
        response = llm.invoke(prompt)
        content = response.content.strip().replace("```json", "").replace("```", "")
        
        try:
            topics = json.loads(content)
            # Add clickable links
            for t in topics:
                t['youtube_link'] = f"[https://www.youtube.com/results?search_query=](https://www.youtube.com/results?search_query=){t['youtube_query'].replace(' ', '+')}"
                t['article_link'] = f"[https://www.google.com/search?q=](https://www.google.com/search?q=){t['article_query'].replace(' ', '+')}"
            return topics
        except:
            return []

rag_service = RAGService()
