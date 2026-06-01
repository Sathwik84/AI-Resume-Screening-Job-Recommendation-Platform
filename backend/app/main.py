from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from app.core.database import engine, Base, SessionLocal
from app.models import models
from app.routers import auth, resumes, ats, jobs, profile, dashboard, ai_features, tailor
from app.core.security import get_password_hash

# Create database tables automatically
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="AI Resume Screening & Job Recommendation Platform API",
    description="FastAPI Backend for parsing resumes, screening ATS compatibility, recommending jobs, and managing applications.",
    version="1.0.0"
)

# Enable CORS (Cross-Origin Resource Sharing)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict this to specific front-end domains
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register Routers under standard '/api' prefix
app.include_router(auth.router, prefix="/api")
app.include_router(resumes.router, prefix="/api")
app.include_router(ats.router, prefix="/api")
app.include_router(jobs.router, prefix="/api")
app.include_router(profile.router, prefix="/api")
app.include_router(dashboard.router, prefix="/api")
app.include_router(ai_features.router, prefix="/api")
app.include_router(tailor.router, prefix="/api")

@app.get("/")
def read_root():
    return {
        "status": "healthy",
        "service": "AI Resume Screening & Job Recommendation Platform API",
        "version": "1.0.0"
    }

# --- Database Seeding Hook ---
@app.on_event("startup")
def seed_database():
    db = SessionLocal()
    try:
        # Check if database has already been seeded with jobs
        job_count = db.query(models.JobDescription).count()
        if job_count == 0:
            print("Database empty. Seeding initial job descriptions and skills...")
            
            # 1. Seed Skills catalog
            initial_skills = [
                models.Skill(name="React.js", category="Technical"),
                models.Skill(name="FastAPI", category="Technical"),
                models.Skill(name="Python", category="Technical"),
                models.Skill(name="Tailwind CSS", category="Technical"),
                models.Skill(name="SQL", category="Technical"),
                models.Skill(name="PostgreSQL", category="Technical"),
                models.Skill(name="Docker", category="Tool"),
                models.Skill(name="Kubernetes", category="Tool"),
                models.Skill(name="JWT Authentication", category="Security"),
                models.Skill(name="n8n Workflows", category="Automation"),
                models.Skill(name="TypeScript", category="Technical"),
                models.Skill(name="Git & GitHub", category="Tool"),
                models.Skill(name="AWS Cloud", category="Tool"),
                models.Skill(name="System Design", category="Technical"),
                models.Skill(name="Communication", category="Soft"),
                models.Skill(name="Problem Solving", category="Soft")
            ]
            db.add_all(initial_skills)
            db.commit()

            # 2. Seed Job Descriptions
            initial_jobs = [
                models.JobDescription(
                    title="Full Stack Developer (React & FastAPI)",
                    company="Vercel",
                    location="San Francisco, CA",
                    type="Full-Time",
                    workplace="Remote",
                    description=(
                        "We are looking for a passionate Full Stack Developer to build our next-generation visual editing interfaces. "
                        "You will work closely with design and engineering teams to deploy highly responsive layouts.\n\n"
                        "Requirements:\n"
                        "- Expert knowledge of React.js, Next.js, and CSS modules like Tailwind CSS.\n"
                        "- Hands-on backend skills writing RESTful APIs in Python with FastAPI.\n"
                        "- Experience designing optimized SQL tables and PostgreSQL schemas.\n"
                        "- Passion for micro-animations and aesthetic design consistency."
                    ),
                    required_skills=["React.js", "FastAPI", "Python", "Tailwind CSS", "SQL", "TypeScript"],
                    required_keywords=["REST APIs", "State Management", "JWT Auth", "PostgreSQL schema", "Framer Motion"],
                    salary="$110,000 - $135,000"
                ),
                models.JobDescription(
                    title="Software Engineering Intern",
                    company="Notion",
                    location="New York, NY",
                    type="Internship",
                    workplace="Hybrid",
                    description=(
                        "Join the core product database team at Notion. As an intern, you will contribute directly to user-facing workspace features "
                        "and build APIs that scale backend workflows.\n\n"
                        "Requirements:\n"
                        "- Proficient in Python, Java, or Node.js.\n"
                        "- Good understanding of SQL databases, indexing, and object-relational mapping (ORMs).\n"
                        "- Familiarity with container tools like Docker.\n"
                        "- Strong algorithmic problem-solving skills."
                    ),
                    required_skills=["Python", "SQL", "Docker", "Git & GitHub", "Problem Solving"],
                    required_keywords=["Database Indexing", "ORM models", "Docker containers", "RESTful routing"],
                    salary="$45 - $55 / hour"
                ),
                models.JobDescription(
                    title="DevOps & Cloud Intern",
                    company="Linear",
                    location="Remote",
                    type="Internship",
                    workplace="Remote",
                    description=(
                        "Help us automate our deployment pipelines and scale our AWS infrastructure. "
                        "You will learn about container orchestration and establish developer experience improvements.\n\n"
                        "Requirements:\n"
                        "- Basic understanding of Linux environments and command lines.\n"
                        "- Exposure to Docker containerization and Kubernetes orchestration.\n"
                        "- Knowledge of basic AWS cloud solutions (S3, EC2).\n"
                        "- Familiarity with Git workflows and CI/CD pipelines."
                    ),
                    required_skills=["Docker", "Kubernetes", "AWS Cloud", "Git & GitHub"],
                    required_keywords=["Kubernetes orchestration", "CI/CD automation", "Dockerization", "YAML pipelines"],
                    salary="$40 - $48 / hour"
                ),
                models.JobDescription(
                    title="Frontend Developer",
                    company="Stripe",
                    location="Seattle, WA",
                    type="Full-Time",
                    workplace="Hybrid",
                    description=(
                        "Stripe is building the infrastructure of the internet. We are searching for an exceptional Frontend Engineer to craft "
                        "our gorgeous developer billing dashboards.\n\n"
                        "Requirements:\n"
                        "- High proficiency in TypeScript, React.js, and CSS animations.\n"
                        "- Dedication to semantic HTML, accessibility, and high performance.\n"
                        "- Experience with data charting libraries like Recharts or D3.js.\n"
                        "- Outstanding eye for detail and design polish."
                    ),
                    required_skills=["React.js", "TypeScript", "Tailwind CSS", "Git & GitHub", "Communication"],
                    required_keywords=["Accessibility support", "Recharts dashboard", "Component optimization", "TypeScript typing"],
                    salary="$125,000 - $155,000"
                ),
                models.JobDescription(
                    title="Workflow Automation Specialist",
                    company="n8n",
                    location="Berlin, DE",
                    type="Full-Time",
                    workplace="Onsite",
                    description=(
                        "Help our users construct complex automated business flows. You will design, build, and document robust workflow models "
                        "using integrations across databases, webhooks, and AI nodes.\n\n"
                        "Requirements:\n"
                        "- Experience writing custom Javascript logic or Python scripts.\n"
                        "- Mastery over REST API integrations, JSON formatting, and webhook listeners.\n"
                        "- Hands-on knowledge of n8n, Zapier, or similar automation orchestrations.\n"
                        "- Strong analytical mindset."
                    ),
                    required_skills=["n8n Workflows", "Python", "SQL", "Git & GitHub"],
                    required_keywords=["Webhook endpoints", "n8n automation", "REST API integration", "JSON payloads"],
                    salary="€65,000 - €80,000"
                )
            ]
            db.add_all(initial_jobs)
            db.commit()
            
            # 3. Seed Default Test User Sathwik Kumar
            hashed_pwd = get_password_hash("password123")
            default_user = models.User(
                email="sathwik@iare.edu.in",
                hashed_password=hashed_pwd,
                full_name="Sathwik Kumar",
                summary="Ambitious Software Engineering student at IARE. Experienced in building full-stack products using React, Python, and automated pipelines.",
                skills=["React.js", "FastAPI", "Python", "SQL", "Tailwind CSS", "n8n Workflows"],
                experience=[
                    {
                        "role": "Full Stack Engineering Intern",
                        "company": "CloudVentures",
                        "duration": "June 2025 - Aug 2025",
                        "description": "Designed high-speed dashboards and automated notification systems saving 10hrs/week in manual recruiter operations."
                    }
                ],
                education=[
                    {
                        "degree": "B.Tech in Computer Science",
                        "school": "Institute of Aeronautical Research (IARE)",
                        "year": "2027"
                    }
                ],
                projects=[
                    {
                        "name": "AI Resume Screen Engine",
                        "description": "A platform screening ATS compatibility scoring using local-side heuristics."
                    }
                ],
                achievements=["Won IARE Hackathon 2025", "AWS Certified Developer"],
                profile_strength=78.0
            )
            db.add(default_user)
            db.commit()
            
            # Seed default welcome notification
            welcome_notif = models.Notification(
                user_id=default_user.id,
                message="Welcome Sathwik to ElevateResume! Your pre-seeded portfolio profile is active."
            )
            db.add(welcome_notif)
            db.commit()
            print("Initial seeder execution finished successfully!")
            
    except Exception as e:
        print(f"Error seeding database: {str(e)}")
        db.rollback()
    finally:
        db.close()
