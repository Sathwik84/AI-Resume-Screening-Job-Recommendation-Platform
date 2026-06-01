import os
from dotenv import load_dotenv

# Load .env file if it exists
load_dotenv()

class Settings:
    PROJECT_NAME: str = "AI Resume Screening & Job Recommendation Platform"
    VERSION: str = "1.0.0"
    
    # Security
    SECRET_KEY: str = os.getenv("SECRET_KEY", "supersecretjwtkeythatshouldbechangedinproduction12345")
    ALGORITHM: str = os.getenv("ALGORITHM", "HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "1440"))
    
    # Database
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./resume_platform.db")
    
    # AI Integrations
    GROQ_API_KEY: str = os.getenv("GROQ_API_KEY", "")
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    
    # n8n Integrations
    N8N_RESUME_UPLOAD_WEBHOOK: str = os.getenv("N8N_RESUME_UPLOAD_WEBHOOK", "")
    N8N_ATS_MONITORING_WEBHOOK: str = os.getenv("N8N_ATS_MONITORING_WEBHOOK", "")
    N8N_APPLICATION_WEBHOOK: str = os.getenv("N8N_APPLICATION_WEBHOOK", "")

settings = Settings()
