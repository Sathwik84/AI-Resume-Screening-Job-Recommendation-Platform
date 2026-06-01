import jwt
import hashlib
from datetime import datetime, timedelta
from typing import Union, Any, Optional
from app.core.config import settings

def get_password_hash(password: str) -> str:
    """Generate a secure salted SHA-256 hash for a password."""
    salt = "elevate_resume_salt_123"
    hashed = hashlib.sha256((password + salt).encode('utf-8')).hexdigest()
    return hashed

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a plain text password against a hashed one."""
    return get_password_hash(plain_password) == hashed_password

def create_access_token(subject: Union[str, Any], expires_delta: Optional[timedelta] = None) -> str:
    """Generate a secure JWT Access Token."""
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode = {"exp": expire, "sub": str(subject)}
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt

def decode_access_token(token: str) -> Optional[str]:
    """Decode a JWT Access Token and return the subject (e.g., user ID)."""
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        return payload.get("sub")
    except jwt.PyJWTError:
        return None
