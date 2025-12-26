import os
from langchain_google_genai import GoogleGenerativeAIEmbeddings, ChatGoogleGenerativeAI
from langchain_community.vectorstores import FAISS
from langchain_community.document_loaders import PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.chains import RetrievalQA
from config import get_settings

settings = get_settings()

DEMO_MODE = settings.demo_mode

if not DEMO_MODE:
    # Initialize Gemini only if not in demo mode
    embeddings = GoogleGenerativeAIEmbeddings(
        model="models/embedding-001", 
        google_api_key=settings.gemini_api_key
    )
    llm = ChatGoogleGenerativeAI(
        model="gemini-1.5-flash", 
        google_api_key=settings.gemini_api_key, 
        temperature=0.3
    )
else:
    embeddings = None
    llm = None
    print("🎭 DEMO MODE ENABLED - No API calls will be made")

FAISS_INDEX_PATH = "faiss_index"

class RAGService:
    def __init__(self):
        self.vector_store = None
        self.demo_documents = {}  # Store uploaded docs in demo mode
        if not DEMO_MODE:
            self._load_existing_index()

    def _load_existing_index(self):
        """Loads existing FAISS index if available"""
        if os.path.exists(FAISS_INDEX_PATH):
            try:
                self.vector_store = FAISS.load_local(
                    FAISS_INDEX_PATH, 
                    embeddings, 
                    allow_dangerous_deserialization=True
                )
                print("✅ Loaded existing FAISS index")
            except Exception as e:
                print(f"⚠️  Could not load index: {e}")

    async def process_pdf(self, file_path: str, user_id: str) -> int:
        """Process PDF and add to vector store"""
        if DEMO_MODE:
            print(f"🎭 [DEMO MODE] Processing PDF: {file_path}")
            loader = PyPDFLoader(file_path)
            documents = loader.load()
            
            # Store document content for demo
            doc_key = f"{user_id}_{os.path.basename(file_path)}"
            self.demo_documents[doc_key] = documents
            
            # Simulate chunking (no embeddings)
            text_splitter = RecursiveCharacterTextSplitter(
                chunk_size=1000, 
                chunk_overlap=100
            )
            chunks = text_splitter.split_documents(documents)
            
            print(f"✅ [DEMO MODE] Processed {len(chunks)} chunks (no API used)")
            return len(chunks)
        
        # Real mode with API
        try:
            loader = PyPDFLoader(file_path)
            documents = loader.load()
            
            # Add user_id to metadata
            for doc in documents:
                doc.metadata["user_id"] = user_id
            
            # Split into chunks
            text_splitter = RecursiveCharacterTextSplitter(
                chunk_size=1000, 
                chunk_overlap=100
            )
            chunks = text_splitter.split_documents(documents)
            
            # Create or update vector store
            if self.vector_store is None:
                self.vector_store = FAISS.from_documents(chunks, embeddings)
            else:
                self.vector_store.add_documents(chunks)
                
            # Save to disk
            os.makedirs(FAISS_INDEX_PATH, exist_ok=True)
            self.vector_store.save_local(FAISS_INDEX_PATH)
            
            return len(chunks)
        except Exception as e:
            error_msg = str(e)
            if "quota" in error_msg.lower() or "429" in error_msg:
                raise Exception(
                    "API quota exceeded. Get a new API key at "
                    "https://aistudio.google.com/app/apikey or enable DEMO_MODE=true in .env"
                )
            raise e

    def get_answer(self, query: str, user_id: str) -> dict:
        """Get answer from RAG system"""
        if DEMO_MODE:
            if not self.demo_documents:
                return {
                    "answer": "[DEMO MODE] No documents uploaded yet. Please upload a PDF first.",
                    "sources": []
                }
            
            # Generate contextual demo response
            query_lower = query.lower()
            
            if any(word in query_lower for word in ["summarize", "summary", "overview"]):
                answer = "This document covers key concepts including fundamental principles, practical applications, and advanced techniques. The main topics are organized into clear sections with examples and detailed explanations."
            elif any(word in query_lower for word in ["main topic", "topics", "about"]):
                answer = "The main topics covered include: 1) Introduction and foundational concepts, 2) Core principles and definitions, 3) Practical applications and use cases, 4) Advanced techniques and methodologies, and 5) Conclusions with future directions."
            elif any(word in query_lower for word in ["key point", "important", "highlight"]):
                answer = "Key points include: understanding the theoretical framework, applying knowledge to real-world scenarios, recognizing patterns and relationships, developing analytical skills, and implementing best practices."
            elif any(word in query_lower for word in ["explain", "how", "what is"]):
                answer = "The concept is explained through a structured approach that begins with foundational definitions, builds upon core knowledge, and extends to complex applications. It includes practical examples and step-by-step guidance."
            else:
                answer = "Based on the uploaded document, this topic is discussed in detail with comprehensive explanations, relevant examples, and practical insights that help understand the subject matter thoroughly."
            
            sources = list(self.demo_documents.keys())
            
            return {
                "answer": f"[DEMO MODE] {answer}",
                "sources": [s.split('_', 1)[1] if '_' in s else s for s in sources[:1]]
            }
        
        # Real mode with API
        if not self.vector_store:
            return {
                "answer": "No documents uploaded yet. Please upload a PDF first.",
                "sources": []
            }
            
        try:
            # Create retrieval chain
            qa_chain = RetrievalQA.from_chain_type(
                llm=llm,
                chain_type="stuff",
                retriever=self.vector_store.as_retriever(
                    search_kwargs={"k": 3}
                ),
                return_source_documents=True
            )
            
            # Get answer
            result = qa_chain.invoke({"query": query})
            
            answer = result.get("result", "I don't know.")
            sources = [
                doc.metadata.get("source", "unknown") 
                for doc in result.get("source_documents", [])
            ]
            
            return {
                "answer": answer, 
                "sources": list(set(sources))
            }
        except Exception as e:
            error_msg = str(e)
            if "quota" in error_msg.lower() or "429" in error_msg:
                raise Exception(
                    "API quota exceeded. Get a new API key at "
                    "https://aistudio.google.com/app/apikey or enable DEMO_MODE=true in .env"
                )
            raise e

# Singleton instance
rag_service = RAGService()
