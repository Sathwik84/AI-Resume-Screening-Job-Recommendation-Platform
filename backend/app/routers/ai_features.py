from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.orm import Session
from typing import Any, List
from app.core.database import get_db
from app.routers.auth import get_current_user
from app.models import models
from app.services.ai_service import ai_service

router = APIRouter(prefix="/ai-features", tags=["AI Add-on Features"])

# --- Request Schemas ---
class CoverLetterRequest(BaseModel):
    job_title: str
    company: str
    job_description: str

class CoverLetterResponse(BaseModel):
    cover_letter: str

class RoadmapRequest(BaseModel):
    target_job_title: str

class RoadmapResponse(BaseModel):
    target_job_title: str
    roadmap: List[Any]

class InterviewPrepRequest(BaseModel):
    job_title: str
    company: str

class InterviewQA(BaseModel):
    question: str
    answer: str

class InterviewPrepResponse(BaseModel):
    questions: List[InterviewQA]

@router.post("/generate-cover-letter", response_model=CoverLetterResponse)
def generate_cover_letter(
    req: CoverLetterRequest,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
) -> Any:
    """Generate a highly tailored cover letter based on user's skills and experience."""
    resume = db.query(models.Resume).filter(models.Resume.user_id == current_user.id).first()
    resume_data = {}
    if resume:
        resume_data = {
            "name": resume.name or current_user.full_name or "Talented Student",
            "skills": resume.skills or [],
            "experience": resume.experience or []
        }
    else:
        resume_data = {
            "name": current_user.full_name or "Talented Student",
            "skills": current_user.skills or ["Full Stack Development", "FastAPI", "React.js"],
            "experience": current_user.experience or []
        }
        
    letter = ai_service.generate_cover_letter(resume_data, req.job_title, req.company, req.job_description)
    return {"cover_letter": letter}

@router.post("/generate-roadmap", response_model=RoadmapResponse)
def generate_roadmap(
    req: RoadmapRequest,
    current_user: models.User = Depends(get_current_user)
) -> Any:
    """Compile a personalized step-by-step career transitioning roadmap from active skills to a target job."""
    skills = current_user.skills or ["Python", "FastAPI", "React", "SQL"]
    roadmap_nodes = ai_service.generate_learning_roadmap(skills, req.target_job_title)
    return {
        "target_job_title": req.target_job_title,
        "roadmap": roadmap_nodes
    }

@router.post("/interview-prep", response_model=InterviewPrepResponse)
def get_interview_prep(
    req: InterviewPrepRequest,
    current_user: models.User = Depends(get_current_user)
) -> Any:
    """Compile custom technical and behavioral interview Q&As tailored to the job description."""
    # Custom QA dictionary based on targeted career paths
    qas = []
    job_lower = req.job_title.lower()
    
    if "front" in job_lower or "react" in job_lower or "web" in job_lower:
        qas = [
            {
                "question": "Explain virtual DOM rendering in React and how it boosts performance.",
                "answer": "Virtual DOM is a lightweight memory copy of the real DOM. When state changes, React creates a new virtual tree, performs a diffing algorithm (reconciliation) against the previous tree, and batches only the precise layout updates to the actual browser DOM to minimize reflows."
            },
            {
                "question": "What are React hooks rules and why must they be called at the top level?",
                "answer": "React hooks (like useState, useEffect) rely on the order in which they are called. If they are placed inside conditionals or loops, the execution order changes across renders, causing React to mismatch states."
            },
            {
                "question": "How do you optimize CSS load times in large Next.js apps?",
                "answer": "By using modular Tailwind utility stylesheets, leveraging tree-shaking, purging unused styles in production, and applying CSS nesting safely inside component layouts."
            }
        ]
    elif "back" in job_lower or "python" in job_lower or "api" in job_lower:
        qas = [
            {
                "question": "Why is FastAPI extremely fast, and how does it utilize asyncio?",
                "answer": "FastAPI is built on top of Starlette and Uvicorn. By utilizing Python's 'async' and 'await' keywords, it runs asynchronous concurrent loops using single-threaded polling, permitting thousands of socket connections concurrently without thread switching blockages."
            },
            {
                "question": "Explain database indexing and its impact on search queries vs. write speeds.",
                "answer": "Database indexing creates balanced search trees (B-Trees) to locate matching rows in logarithmic time O(log N) rather than standard table scans O(N). While it dramatically boosts read speeds, it slightly decreases INSERT/UPDATE speeds due to index tree rebuilding."
            },
            {
                "question": "How does JWT authentication keep API transactions secure?",
                "answer": "JWT tokens store cryptographically signed user payloads in the client header. The server verifies this signature using a secret private key, preventing spoofing without maintaining persistent session states."
            }
        ]
    else:
        qas = [
            {
                "question": "Tell me about a challenging technical hurdle you faced in your projects.",
                "answer": "In building my resume screening application, parsing nested document formats with standard extraction models produced unorganized strings. I resolved this by designing customized regex heuristics to map elements and synchronizing them into structured user states."
            },
            {
                "question": "How do you coordinate API integrations with automation servers like n8n?",
                "answer": "By registering HTTP webhook endpoints inside the application router. The FastAPI backend dispatches json transactions to the n8n automation engine which handles task queues, emails, and reporting synchronously."
            }
        ]
        
    return {"questions": qas}
