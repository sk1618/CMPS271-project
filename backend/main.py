import os
from datetime import datetime, timedelta
from fastapi import FastAPI, Depends, HTTPException, Security, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.templating import Jinja2Templates
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from passlib.context import CryptContext
from pydantic import BaseModel
from sqlalchemy import create_engine, Column, Integer, String, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship, Session
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

# Category model
class Category(Base):
    __tablename__ = "categories"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)

    items = relationship("Item", back_populates="category")


# Item model
class Item(Base):
    __tablename__ = "items"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    category_id = Column(Integer, ForeignKey("categories.id"))

    category = relationship("Category", back_populates="items")


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

# Dependency to get the database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Pydantic models for request validation
class CategoryCreate(BaseModel):
    name: str

class ItemCreate(BaseModel):
    name: str
    category_id: int

class TransactionCreate(BaseModel):
    name: str
    amount: int


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


# Category Endpoints
@app.post("/add_category/")
async def add_category(category: CategoryCreate, db: Session = Depends(get_db)):
    db_category = Category(name=category.name)
    db.add(db_category)
    db.commit()
    db.refresh(db_category)
    return {"message": f"Category '{db_category.name}' added successfully!"}


@app.get("/categories/")
async def get_categories(db: Session = Depends(get_db)):
    categories = db.query(Category).all()
    return {"categories": categories}


@app.get("/category/{category_id}")
async def get_category_items(category_id: int, db: Session = Depends(get_db)):
    category = db.query(Category).filter(Category.id == category_id).first()
    if category is None:
        raise HTTPException(status_code=404, detail="Category not found")
    items = db.query(Item).filter(Item.category_id == category_id).all()
    return {"category": category, "items": items}


@app.post("/add_item/")
async def add_item(item: ItemCreate, db: Session = Depends(get_db)):
    db_item = Item(name=item.name, category_id=item.category_id)
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return {"message": f"Item '{db_item.name}' added to category!"}


# Serve frontend templates
templates = Jinja2Templates(directory="frontend")


@app.get("/view_transactions")
async def view_transactions(request: Request, db: Session = Depends(get_db)):
    transactions = db.query(Transaction).all()
    return templates.TemplateResponse("transactions.html", {"request": request, "transactions": transactions})


@app.get("/view_inventory")
async def view_inventory(request: Request, db: Session = Depends(get_db)):
    categories = db.query(Category).all()
    return templates.TemplateResponse("inventory.html", {"request": request, "categories": categories})

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
@app.post("/signup")
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    # 1) Check if a user with the same username or email already exists
    existing_username = db.query(User).filter(User.username == user.username).first()
    if existing_username:
        raise HTTPException(status_code=400, detail="Username already registered.")
    
    existing_email = db.query(User).filter(User.email == user.email).first()
    if existing_email:
        raise HTTPException(status_code=400, detail="Email already registered.")

    # 2) Hash the user’s password
    hashed_password = get_password_hash(user.password)

    # 3) Create the User DB object
    db_user = User(
        username=user.username,
        email=user.email,
        password_hash=hashed_password
    )

    # 4) Save to DB
    db.add(db_user)
    db.commit()
    db.refresh(db_user)

    return {"message": "User created successfully"}
#           SIGN IN
@app.post("/login")
def login_user(login_data: UserLogin, db: Session = Depends(get_db)):
    # 1) Get user by username
    user = db.query(User).filter(User.username == login_data.username).first()

    if not user:
        raise HTTPException(status_code=401, detail="Invalid username or password.")
    
    # 2) Verify password
    if not verify_password(login_data.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid username or password.")

    # 3) If successful, you might want to return a token or just success
    return {"message": "Login successful!"}
