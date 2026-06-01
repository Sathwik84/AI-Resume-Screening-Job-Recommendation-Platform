import httpx
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import Any, List, Optional
from app.core.database import get_db
from app.routers.auth import get_current_user
from app.models import models
from app.schemas import schemas
from app.core.config import settings

router = APIRouter(prefix="/jobs", tags=["Jobs & Applications"])

@router.get("/", response_model=List[schemas.JobDescriptionResponse])
def get_jobs(
    search: Optional[str] = Query(None, description="Search by job title or company"),
    type: Optional[str] = Query(None, description="Filter by Internship or Full-Time"),
    workplace: Optional[str] = Query(None, description="Filter by Remote, Hybrid, or Onsite"),
    db: Session = Depends(get_db)
) -> Any:
    """Retrieve job openings catalog with robust query parameters."""
    query = db.query(models.JobDescription)
    
    if search:
        query = query.filter(
            (models.JobDescription.title.ilike(f"%{search}%")) |
            (models.JobDescription.company.ilike(f"%{search}%"))
        )
        
    if type:
        query = query.filter(models.JobDescription.type.ilike(type))
        
    if workplace:
        query = query.filter(models.JobDescription.workplace.ilike(workplace))
        
    return query.order_by(models.JobDescription.created_at.desc()).all()

@router.get("/recommendations", response_model=List[schemas.RecommendationResponse])
def get_job_recommendations(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
) -> Any:
    """Retrieve custom job recommendations computed using skill overlap matching algorithms."""
    # Fetch user skills
    user_skills = [s.lower() for s in (current_user.skills or [])]
    jobs = db.query(models.JobDescription).all()
    
    recommendations = []
    
    for job in jobs:
        # Check if recommendation already calculated in database
        rec_db = db.query(models.Recommendation).filter(
            models.Recommendation.user_id == current_user.id,
            models.Recommendation.job_id == job.id
        ).first()
        
        if rec_db:
            recommendations.append(rec_db)
            continue
            
        # Calculate dynamic fallback match score by comparing skill tags
        job_skills = [s.lower() for s in (job.required_skills or [])]
        match_percentage = 40.0 # base mock match
        
        if job_skills and user_skills:
            intersection = set(user_skills).intersection(set(job_skills))
            skill_match_factor = (len(intersection) / len(job_skills)) * 50.0
            match_percentage = min(100.0, 40.0 + skill_match_factor)
            
        # Limit precision
        match_percentage = round(match_percentage, 1)
        
        # Save cache recommendation
        new_rec = models.Recommendation(
            user_id=current_user.id,
            job_id=job.id,
            match_percentage=match_percentage
        )
        db.add(new_rec)
        db.commit()
        db.refresh(new_rec)
        recommendations.append(new_rec)
        
    # Sort recommendations by match percentage
    recommendations.sort(key=lambda x: x.match_percentage, reverse=True)
    return recommendations

@router.get("/applications", response_model=List[schemas.ApplicationResponse])
def get_applications(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
) -> Any:
    """Retrieve all submitted job applications for the student."""
    return db.query(models.Application).filter(models.Application.user_id == current_user.id).all()

@router.post("/apply", response_model=schemas.ApplicationResponse)
async def apply_to_job(
    req: schemas.ApplicationCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
) -> Any:
    """Record a new job application and trigger the tracking automations workflow."""
    # Check if job exists
    job = db.query(models.JobDescription).filter(models.JobDescription.id == req.job_id).first()
    if not job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="The target job ID does not exist."
        )
        
    # Check if already applied
    existing_app = db.query(models.Application).filter(
        models.Application.user_id == current_user.id,
        models.Application.job_id == job.id
    ).first()
    
    if existing_app:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You have already submitted an application for this position."
        )
        
    # Find match percentage from recommendation cache
    rec = db.query(models.Recommendation).filter(
        models.Recommendation.user_id == current_user.id,
        models.Recommendation.job_id == job.id
    ).first()
    match_pct = rec.match_percentage if rec else 65.0
    
    new_app = models.Application(
        user_id=current_user.id,
        job_id=job.id,
        status="Applied",
        match_percentage=match_pct
    )
    db.add(new_app)
    db.commit()
    db.refresh(new_app)
    
    # Send application notification
    app_notif = models.Notification(
        user_id=current_user.id,
        message=f"Applied to '{job.title}' at {job.company}. Dynamic skill match is {match_pct}%."
    )
    db.add(app_notif)
    db.commit()
    
    # Dispatch n8n tracker webhook
    if settings.N8N_APPLICATION_WEBHOOK:
        try:
            payload = {
                "application_id": new_app.id,
                "user_id": current_user.id,
                "email": current_user.email,
                "job_title": job.title,
                "company": job.company,
                "status": "Applied",
                "match_percentage": match_pct
            }
            async with httpx.AsyncClient() as client:
                await client.post(settings.N8N_APPLICATION_WEBHOOK, json=payload, timeout=2.0)
        except Exception:
            pass
            
    return new_app

@router.put("/applications/{app_id}", response_model=schemas.ApplicationResponse)
def update_application_status(
    app_id: int,
    status_update: schemas.ApplicationStatusUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
) -> Any:
    """Update job application workflow state (Applied, Interviewing, Offered, Rejected)."""
    app = db.query(models.Application).filter(
        models.Application.id == app_id,
        models.Application.user_id == current_user.id
    ).first()
    
    if not app:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="The requested application record could not be found."
        )
        
    app.status = status_update.status
    db.commit()
    db.refresh(app)
    
    # Notify user on status update
    status_notif = models.Notification(
        user_id=current_user.id,
        message=f"Your application status for '{app.job.title}' at {app.job.company} updated to: {app.status}."
    )
    db.add(status_notif)
    db.commit()
    
    return app
