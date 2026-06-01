from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Text, Float, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
from app.core.database import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Extended Profile
    summary = Column(Text, nullable=True)
    skills = Column(JSON, nullable=True) # User-curated skills array
    experience = Column(JSON, nullable=True) # User-curated experience list
    education = Column(JSON, nullable=True) # User-curated education list
    projects = Column(JSON, nullable=True) # Projects list
    achievements = Column(JSON, nullable=True) # Achievements list
    profile_strength = Column(Float, default=10.0) # Strength metric 0-100
    
    # Relationships
    resumes = relationship("Resume", back_populates="user", cascade="all, delete-orphan")
    applications = relationship("Application", back_populates="user", cascade="all, delete-orphan")
    recommendations = relationship("Recommendation", back_populates="user", cascade="all, delete-orphan")
    notifications = relationship("Notification", back_populates="user", cascade="all, delete-orphan")

class Resume(Base):
    __tablename__ = "resumes"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    filename = Column(String, nullable=False)
    
    # Parsed Details
    name = Column(String, nullable=True)
    email = Column(String, nullable=True)
    phone = Column(String, nullable=True)
    skills = Column(JSON, nullable=True) # List of extracted skills
    experience = Column(JSON, nullable=True) # Parsed experience chronological history
    education = Column(JSON, nullable=True) # Parsed education details
    parsed_text = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    user = relationship("User", back_populates="resumes")
    ats_reports = relationship("ATSReport", back_populates="resume", cascade="all, delete-orphan")
    versions = relationship("ResumeVersion", back_populates="resume", cascade="all, delete-orphan")

class Skill(Base):
    __tablename__ = "skills"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True, nullable=False)
    category = Column(String, default="Technical") # Technical, Soft, Tool

class JobDescription(Base):
    __tablename__ = "job_descriptions"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False, index=True)
    company = Column(String, nullable=False, index=True)
    location = Column(String, nullable=False)
    type = Column(String, default="Full-Time") # Internship, Full-Time
    workplace = Column(String, default="Remote") # Remote, Hybrid, Onsite
    description = Column(Text, nullable=False)
    required_skills = Column(JSON, nullable=True) # Array of skills required
    required_keywords = Column(JSON, nullable=True) # Keyword checklist
    salary = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    ats_reports = relationship("ATSReport", back_populates="job", cascade="all, delete-orphan")
    applications = relationship("Application", back_populates="job", cascade="all, delete-orphan")
    recommendations = relationship("Recommendation", back_populates="job", cascade="all, delete-orphan")

class ATSReport(Base):
    __tablename__ = "ats_reports"
    
    id = Column(Integer, primary_key=True, index=True)
    resume_id = Column(Integer, ForeignKey("resumes.id", ondelete="CASCADE"), nullable=False)
    job_id = Column(Integer, ForeignKey("job_descriptions.id", ondelete="CASCADE"), nullable=False)
    
    overall_score = Column(Float, nullable=False)
    breakdown = Column(JSON, nullable=False) # e.g. {"skills": 80, "keywords": 70, "experience": 90, "education": 85}
    suggestions = Column(JSON, nullable=True) # e.g. {"missing_skills": [], "improvements": []}
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    resume = relationship("Resume", back_populates="ats_reports")
    job = relationship("JobDescription", back_populates="ats_reports")

class Recommendation(Base):
    __tablename__ = "recommendations"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    job_id = Column(Integer, ForeignKey("job_descriptions.id", ondelete="CASCADE"), nullable=False)
    match_percentage = Column(Float, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    user = relationship("User", back_populates="recommendations")
    job = relationship("JobDescription", back_populates="recommendations")

class Application(Base):
    __tablename__ = "applications"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    job_id = Column(Integer, ForeignKey("job_descriptions.id", ondelete="CASCADE"), nullable=False)
    status = Column(String, default="Applied") # Applied, Interviewing, Offered, Rejected
    match_percentage = Column(Float, default=0.0)
    applied_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    user = relationship("User", back_populates="applications")
    job = relationship("JobDescription", back_populates="applications")

class Notification(Base):
    __tablename__ = "notifications"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    message = Column(String, nullable=False)
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    user = relationship("User", back_populates="notifications")

class ResumeVersion(Base):
    __tablename__ = "resume_versions"
    
    id = Column(Integer, primary_key=True, index=True)
    resume_id = Column(Integer, ForeignKey("resumes.id", ondelete="CASCADE"), nullable=False)
    version_name = Column(String, nullable=False)
    
    summary = Column(Text, nullable=True)
    skills = Column(JSON, nullable=True)
    experience = Column(JSON, nullable=True)
    projects = Column(JSON, nullable=True)
    overall_score = Column(Float, default=0.0)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    resume = relationship("Resume", back_populates="versions")

