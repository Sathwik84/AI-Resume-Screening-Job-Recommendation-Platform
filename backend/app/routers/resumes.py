import httpx
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, status
from sqlalchemy.orm import Session
from typing import Any
from app.core.database import get_db
from app.routers.auth import get_current_user
from app.models import models
from app.schemas import schemas
from app.services.ai_service import ai_service
from app.core.config import settings

router = APIRouter(prefix="/resumes", tags=["Resumes"])

@router.post("/upload-resume", response_model=schemas.ResumeResponse)
async def upload_resume(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
) -> Any:
    """Upload a PDF or Word document, run LLM layout extraction, and sync user profile details."""
    # Validate extension
    filename = file.filename
    ext = filename.split(".")[-1].lower()
    if ext not in ["pdf", "docx", "doc"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Unsupported file format. Please upload a PDF or DOCX file."
        )
        
    # Read file
    content = await file.read()
    
    # 1. Parse text from binary
    extracted_text = ai_service.extract_text_from_file(content, filename)
    if not extracted_text:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Failed to extract textual content from the uploaded file."
        )
        
    # 2. Extract structured metadata using LLM or Local Rule engine
    parsed_data = ai_service.parse_resume(extracted_text)
    
    # 3. Synchronize parsed details into User profile automatically
    current_user.full_name = parsed_data.get("name") or current_user.full_name
    current_user.skills = parsed_data.get("skills") or current_user.skills or []
    current_user.experience = parsed_data.get("experience") or current_user.experience or []
    current_user.education = parsed_data.get("education") or current_user.education or []
    
    # Calculate visual profile strength 
    skills_count = len(parsed_data.get("skills", []))
    exp_count = len(parsed_data.get("experience", []))
    edu_count = len(parsed_data.get("education", []))
    strength = min(100.0, 30.0 + (skills_count * 4.0) + (exp_count * 12.0) + (edu_count * 10.0))
    current_user.profile_strength = round(strength, 1)
    
    # 4. Save resume records in DB
    # Delete existing resume to preserve single-resume uploads for student portfolio
    old_resume = db.query(models.Resume).filter(models.Resume.user_id == current_user.id).first()
    if old_resume:
        db.delete(old_resume)
        db.commit()
        
    new_resume = models.Resume(
        user_id=current_user.id,
        filename=filename,
        name=parsed_data.get("name"),
        email=parsed_data.get("email"),
        phone=parsed_data.get("phone"),
        skills=parsed_data.get("skills", []),
        experience=parsed_data.get("experience", []),
        education=parsed_data.get("education", []),
        parsed_text=extracted_text
    )
    db.add(new_resume)
    db.commit()
    db.refresh(new_resume)
    
    # Add application log activity and notification
    activity_notif = models.Notification(
        user_id=current_user.id,
        message=f"Resume '{filename}' uploaded and parsed. Detected {skills_count} skills. Profile strength is {current_user.profile_strength}%."
    )
    db.add(activity_notif)
    db.commit()
    
    # 5. Dispatch n8n Automation Webhook if configured
    if settings.N8N_RESUME_UPLOAD_WEBHOOK:
        try:
            payload = {
                "user_id": current_user.id,
                "email": current_user.email,
                "name": current_user.full_name,
                "filename": filename,
                "skills": parsed_data.get("skills", []),
                "experience": parsed_data.get("experience", []),
                "education": parsed_data.get("education", [])
            }
            # Execute non-blocking webhook request
            async with httpx.AsyncClient() as client:
                await client.post(settings.N8N_RESUME_UPLOAD_WEBHOOK, json=payload, timeout=2.0)
        except Exception:
            # Prevent webhook failure from blocking user upload
            pass
            
    return new_resume

@router.get("/my-resume", response_model=schemas.ResumeResponse)
def get_my_resume(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
) -> Any:
    """Retrieve active uploaded resume data for user."""
    resume = db.query(models.Resume).filter(models.Resume.user_id == current_user.id).first()
    if not resume:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No resume has been uploaded yet for this account."
        )
    return resume
