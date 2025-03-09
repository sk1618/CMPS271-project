import os
from datetime import datetime, timedelta

from fastapi import FastAPI, Depends, HTTPException, Security, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.templating import Jinja2Templates
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from passlib.context import CryptContext
from pydantic import BaseModel
from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from dotenv import load_dotenv
import uvicorn

# Load environment variables from .env file if present
load_dotenv()

# Database setup
DATABASE_URL = "sqlite:///./test.db"
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Database Models

# User model (for authentication)
class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    password_hash = Column(String)

# Item model (example)
class Item(Base):
    __tablename__ = "items"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)

# Transaction model
class Transaction(Base):
    __tablename__ = "transactions"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    amount = Column(Integer)

# Create all tables
Base.metadata.create_all(bind=engine)

# FastAPI instance
app = FastAPI()

# Set up Jinja2Templates to look in the "frontend" folder
templates = Jinja2Templates(directory="frontend")

# CORS Middleware (allow all origins for development)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, restrict to specific domains
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Authentication configuration
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
SECRET_KEY = os.getenv("SECRET_KEY", "fallback-secret-key")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

# Dependency to get the database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Utility functions for JWT
def create_access_token(data: dict, expires_delta: timedelta):
    to_encode = data.copy()
    expire = datetime.utcnow() + expires_delta
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def get_current_user(token: str = Security(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        return username
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

# Pydantic models for request validation
class UserCreate(BaseModel):
    username: str
    email: str
    password: str

class UserLogin(BaseModel):
    username: str  # For login via email, adjust accordingly
    password: str

class TransactionCreate(BaseModel):
    name: str
    amount: int

class ItemCreate(BaseModel):
    name: str

# Authentication Endpoints
@app.post("/signup/")
def signup(user: UserCreate, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(
        (User.username == user.username) | (User.email == user.email)
    ).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Username or email already exists")
    hashed_password = pwd_context.hash(user.password)
    new_user = User(username=user.username, email=user.email, password_hash=hashed_password)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return {"message": "User created successfully"}

@app.post("/login/")
def login(user: UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.username).first()  # Login with email
    if not db_user or not pwd_context.verify(user.password, db_user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": db_user.email}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/protected/")
def protected_route(username: str = Depends(get_current_user)):
    return {"message": f"Welcome {username}, you have accessed a protected route!"}

# Item Endpoint
@app.post("/add_item/")
async def add_item(item: ItemCreate, db: Session = Depends(get_db)):
    db_item = Item(name=item.name)
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return {"message": f"Item '{db_item.name}' added successfully!"}

# Transaction Endpoints
@app.post("/add_transaction/")
async def add_transaction(transaction: TransactionCreate, db: Session = Depends(get_db)):
    db_transaction = Transaction(name=transaction.name, amount=transaction.amount)
    db.add(db_transaction)
    db.commit()
    db.refresh(db_transaction)
    return {"message": f"Transaction '{db_transaction.name}' added successfully!"}

@app.delete("/delete_transaction/{transaction_id}")
async def delete_transaction(transaction_id: int, db: Session = Depends(get_db)):
    db_transaction = db.query(Transaction).filter(Transaction.id == transaction_id).first()
    if db_transaction:
        db.delete(db_transaction)
        db.commit()
        return {"message": f"Transaction '{db_transaction.name}' deleted successfully!"}
    else:
        raise HTTPException(status_code=404, detail="Transaction not found.")

@app.get("/transactions/")
async def get_transactions(db: Session = Depends(get_db)):
    transactions = db.query(Transaction).all()
    return {"transactions": transactions}

# Endpoint to render the transactions page from the "frontend" folder
@app.get("/view_transactions")
async def view_transactions(request: Request, db: Session = Depends(get_db)):
    transactions = db.query(Transaction).all()
    return templates.TemplateResponse("transactions.html", {"request": request, "transactions": transactions})

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)
