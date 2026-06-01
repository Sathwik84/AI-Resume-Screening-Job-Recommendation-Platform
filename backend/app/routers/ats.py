import httpx
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import Any
from app.core.database import get_db
from app.routers.auth import get_current_user
from app.models import models
from app.schemas import schemas
from app.services.ai_service import ai_service
from app.core.config import settings

router = APIRouter(prefix="/ats", tags=["ATS Analysis"])

@router.post("/calculate-ats", response_model=schemas.ATSReportResponse)
async def calculate_ats(
    req: schemas.ATSCalculationRequest,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
) -> Any:
    """Compare candidate's active resume against a target job description and generate ATS metrics."""
    # 1. Fetch active resume
    resume = db.query(models.Resume).filter(models.Resume.user_id == current_user.id).first()
    if not resume:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You must upload a resume before calculating an ATS score compatibility report."
        )
        
    # 2. Fetch Job Description
    job = db.query(models.JobDescription).filter(models.JobDescription.id == req.job_description_id).first()
    if not job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="The specified job description ID does not exist."
        )
        
    # 3. Compile resume metadata & run ATS score matcher
    resume_metadata = {
        "name": resume.name,
        "skills": resume.skills or [],
        "experience": resume.experience or [],
        "education": resume.education or []
    }
    
    score_report = ai_service.calculate_ats_score(resume_metadata, job.description)
    
    # 4. Save/update ATS report in DB
    existing_report = db.query(models.ATSReport).filter(
        models.ATSReport.resume_id == resume.id,
        models.ATSReport.job_id == job.id
    ).first()
    
    if existing_report:
        db.delete(existing_report)
        db.commit()
        
    new_report = models.ATSReport(
        resume_id=resume.id,
        job_id=job.id,
        overall_score=score_report.get("overall_score", 0.0),
        breakdown=score_report.get("breakdown", {}),
        suggestions=score_report.get("suggestions", {})
    )
    db.add(new_report)
    
    # Update Job recommendation matching percentage based on this ATS calculation
    rec = db.query(models.Recommendation).filter(
        models.Recommendation.user_id == current_user.id,
        models.Recommendation.job_id == job.id
    ).first()
    
    if rec:
        rec.match_percentage = score_report.get("overall_score", 0.0)
    else:
        new_rec = models.Recommendation(
            user_id=current_user.id,
            job_id=job.id,
            match_percentage=score_report.get("overall_score", 0.0)
        )
        db.add(new_rec)
        
    db.commit()
    db.refresh(new_report)
    
    # Add activity notification
    ats_notif = models.Notification(
        user_id=current_user.id,
        message=f"Calculated ATS compatibility for '{job.title}' at {job.company}. Score: {new_report.overall_score}%."
    )
    db.add(ats_notif)
    db.commit()
    
    # 5. Dispatch n8n ATS Webhook if configured
    if settings.N8N_ATS_MONITORING_WEBHOOK:
        try:
            payload = {
                "user_id": current_user.id,
                "email": current_user.email,
                "job_title": job.title,
                "company": job.company,
                "ats_score": new_report.overall_score,
                "breakdown": new_report.breakdown,
                "suggestions": new_report.suggestions
            }
            async with httpx.AsyncClient() as client:
                await client.post(settings.N8N_ATS_MONITORING_WEBHOOK, json=payload, timeout=2.0)
        except Exception:
            pass
            
    return new_report

@router.get("/report/{job_id}", response_model=schemas.ATSReportResponse)
def get_ats_report(
    job_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
) -> Any:
    """Fetch existing ATS score report for a specific job description."""
    resume = db.query(models.Resume).filter(models.Resume.user_id == current_user.id).first()
    if not resume:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Upload resume to view compatibility reports."
        )
        
    report = db.query(models.ATSReport).filter(
        models.ATSReport.resume_id == resume.id,
        models.ATSReport.job_id == job_id
    ).first()
    
    if not report:
        raise HTTPException(
            status_code=status.HTTP_444_NOT_RESPONSE_CODE or status.HTTP_404_NOT_FOUND,
            detail="No ATS report has been compiled yet for this job."
        )
    return report
