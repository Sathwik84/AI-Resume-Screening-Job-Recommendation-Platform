from pydantic import BaseModel, EmailStr
from typing import List, Optional, Dict, Any
from datetime import datetime

# --- Token Schemas ---
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

# --- User Schemas ---
class UserBase(BaseModel):
    email: EmailStr
    full_name: Optional[str] = None

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    summary: Optional[str] = None
    skills: Optional[List[str]] = None
    experience: Optional[List[Dict[str, Any]]] = None
    education: Optional[List[Dict[str, Any]]] = None
    projects: Optional[List[Dict[str, Any]]] = None
    achievements: Optional[List[str]] = None
    profile_strength: Optional[float] = None

class UserResponse(UserBase):
    id: int
    created_at: datetime
    summary: Optional[str] = None
    skills: Optional[List[str]] = None
    experience: Optional[List[Dict[str, Any]]] = None
    education: Optional[List[Dict[str, Any]]] = None
    projects: Optional[List[Dict[str, Any]]] = None
    achievements: Optional[List[str]] = None
    profile_strength: float

    class Config:
        from_attributes = True

# --- Resume Schemas ---
class ResumeBase(BaseModel):
    filename: str
    name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None

class ResumeResponse(ResumeBase):
    id: int
    user_id: int
    skills: Optional[List[str]] = None
    experience: Optional[List[Dict[str, Any]]] = None
    education: Optional[List[Dict[str, Any]]] = None
    created_at: datetime

    class Config:
        from_attributes = True

# --- Job Description Schemas ---
class JobDescriptionBase(BaseModel):
    title: str
    company: str
    location: str
    type: str # Internship, Full-Time
    workplace: str # Remote, Hybrid, Onsite
    description: str
    required_skills: Optional[List[str]] = None
    required_keywords: Optional[List[str]] = None
    salary: Optional[str] = None

class JobDescriptionCreate(JobDescriptionBase):
    pass

class JobDescriptionResponse(JobDescriptionBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

# --- ATS Report Schemas ---
class ATSBreakdown(BaseModel):
    skills: float
    keywords: float
    experience: float
    education: float

class ATSSuggestions(BaseModel):
    missing_skills: List[str]
    missing_keywords: List[str]
    improvements: List[str]

class ATSReportBase(BaseModel):
    overall_score: float
    breakdown: ATSBreakdown
    suggestions: ATSSuggestions

class ATSReportResponse(ATSReportBase):
    id: int
    resume_id: int
    job_id: int
    created_at: datetime

    class Config:
        from_attributes = True

class ATSCalculationRequest(BaseModel):
    job_description_id: int

# --- Recommendation Schemas ---
class RecommendationResponse(BaseModel):
    id: int
    job: JobDescriptionResponse
    match_percentage: float
    created_at: datetime

    class Config:
        from_attributes = True

# --- Application Schemas ---
class ApplicationCreate(BaseModel):
    job_id: int

class ApplicationStatusUpdate(BaseModel):
    status: str # Applied, Interviewing, Offered, Rejected

class ApplicationResponse(BaseModel):
    id: int
    user_id: int
    job: JobDescriptionResponse
    status: str
    match_percentage: float
    applied_at: datetime

    class Config:
        from_attributes = True

# --- Notification Schemas ---
class NotificationResponse(BaseModel):
    id: int
    message: str
    is_read: bool
    created_at: datetime

    class Config:
        from_attributes = True

# --- Dashboard Schemas ---
class DashboardStats(BaseModel):
    total_applications: int
    average_ats_score: float
    recommended_jobs_count: int
    skill_match_rate: float
    profile_strength: float
    ats_trends: List[Dict[str, Any]] # [{"date": "May 25", "score": 75}, ...]
    application_analytics: List[Dict[str, Any]] # [{"name": "Applied", "value": 5}, ...]
    skill_distribution: List[Dict[str, Any]] # [{"subject": "React", "A": 90, "fullMark": 100}, ...]
    recent_activities: List[Dict[str, Any]] # [{"id": 1, "type": "upload", "message": "Uploaded Resume...", "time": "2 hours ago"}]

# --- Resume Version Schemas ---
class ResumeVersionBase(BaseModel):
    version_name: str
    summary: Optional[str] = None
    skills: Optional[List[str]] = None
    experience: Optional[List[Dict[str, Any]]] = None
    projects: Optional[List[Dict[str, Any]]] = None
    overall_score: float

class ResumeVersionCreate(ResumeVersionBase):
    resume_id: int

class ResumeVersionResponse(ResumeVersionBase):
    id: int
    resume_id: int
    created_at: datetime

    class Config:
        from_attributes = True

