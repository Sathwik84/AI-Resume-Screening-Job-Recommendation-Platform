from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import Any
from app.core.database import get_db
from app.routers.auth import get_current_user
from app.models import models
from app.schemas import schemas

router = APIRouter(prefix="/profile", tags=["User Profile"])

@router.get("/", response_model=schemas.UserResponse)
def get_profile(current_user: models.User = Depends(get_current_user)) -> Any:
    """Retrieve personal portfolio metadata and parsed metrics."""
    return current_user

@router.put("/", response_model=schemas.UserResponse)
def update_profile(
    profile_in: schemas.UserUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
) -> Any:
    """Update profile elements, recalculating system profile strength metric."""
    if profile_in.full_name is not None:
        current_user.full_name = profile_in.full_name
    if profile_in.summary is not None:
        current_user.summary = profile_in.summary
    if profile_in.skills is not None:
        current_user.skills = profile_in.skills
    if profile_in.experience is not None:
        current_user.experience = profile_in.experience
    if profile_in.education is not None:
        current_user.education = profile_in.education
    if profile_in.projects is not None:
        current_user.projects = profile_in.projects
    if profile_in.achievements is not None:
        current_user.achievements = profile_in.achievements
        
    # Recalculate profile strength based on completion of profile items
    skills_count = len(current_user.skills or [])
    exp_count = len(current_user.experience or [])
    edu_count = len(current_user.education or [])
    projects_count = len(current_user.projects or [])
    has_summary = 1 if current_user.summary and len(current_user.summary.strip()) > 10 else 0
    
    strength = 15.0  # base registration score
    strength += has_summary * 15.0
    strength += min(30.0, skills_count * 5.0)
    strength += min(20.0, exp_count * 10.0)
    strength += min(20.0, edu_count * 10.0)
    strength += min(10.0, projects_count * 5.0)
    
    current_user.profile_strength = round(min(100.0, strength), 1)
    
    db.commit()
    db.refresh(current_user)
    return current_user
