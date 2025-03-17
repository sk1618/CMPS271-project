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
import requests
import uvicorn

# Import our auth routes
from backend.auth_routes import router as auth_router
from backend.auth_utils import get_current_user

# Load environment variables from .env file if present
load_dotenv()

# Database setup
from backend.database import engine, SessionLocal, Base
NEWSAPI_KEY = os.getenv("NEWSAPI_KEY")

# Database Models imported from models.py
from backend.models import User

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
    bought_date = Column(String, default=datetime.now().strftime("%Y-%m-%d"))
    cost = Column(Integer, default=0)
    sale_price = Column(Integer, default=0)
    quantity = Column(Integer, default=1)  # New field for quantity

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

# Include the auth routes
app.include_router(auth_router)

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
    bought_date: str = datetime.now().strftime("%Y-%m-%d")
    cost: int = 0
    sale_price: int = 0
    quantity: int = 1  # Default value for quantity

class TransactionCreate(BaseModel):
    name: str
    amount: int


# Transaction Endpoints
@app.post("/add_transaction/")
async def add_transaction(
    transaction: TransactionCreate, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)  # Protect this endpoint
):
    db_transaction = Transaction(name=transaction.name, amount=transaction.amount)
    db.add(db_transaction)
    db.commit()
    db.refresh(db_transaction)
    return {"message": f"Transaction '{db_transaction.name}' added successfully!"}


@app.delete("/delete_transaction/{transaction_id}")
async def delete_transaction(
    transaction_id: int, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)  # Protect this endpoint
):
    db_transaction = db.query(Transaction).filter(Transaction.id == transaction_id).first()
    if db_transaction:
        db.delete(db_transaction)
        db.commit()
        return {"message": f"Transaction '{db_transaction.name}' deleted successfully!"}
    else:
        raise HTTPException(status_code=404, detail="Transaction not found.")


@app.get("/transactions/")
async def get_transactions(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)  # Protect this endpoint
):
    transactions = db.query(Transaction).all()
    return {"transactions": transactions}


# Category Endpoints
@app.post("/add_category/")
async def add_category(
    category: CategoryCreate, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)  # Protect this endpoint
):
    db_category = Category(name=category.name)
    db.add(db_category)
    db.commit()
    db.refresh(db_category)
    return {"message": f"Category '{db_category.name}' added successfully!"}


@app.get("/categories/")
async def get_categories(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)  # Protect this endpoint
):
    categories = db.query(Category).all()
    return {"categories": categories}


@app.get("/category/{category_id}")
async def get_category_items(
    category_id: int, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)  # Protect this endpoint
):
    category = db.query(Category).filter(Category.id == category_id).first()
    if category is None:
        raise HTTPException(status_code=404, detail="Category not found")
    items = db.query(Item).filter(Item.category_id == category_id).all()
    return {"category": category, "items": items}


@app.post("/add_item/")
async def add_item(
    item: ItemCreate, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)  # Protect this endpoint
):
    db_item = Item(
        name=item.name,
        category_id=item.category_id,
        bought_date=item.bought_date,
        cost=item.cost,
        sale_price=item.sale_price,
        quantity=item.quantity  # Save the quantity as well
    )
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return {"message": f"Item '{db_item.name}' added to category!"}

# Serve frontend templates
templates = Jinja2Templates(directory="frontend")


@app.get("/view_transactions")
async def view_transactions(
    request: Request, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)  # Protect this endpoint
):
    transactions = db.query(Transaction).all()
    return templates.TemplateResponse("transactions.html", {"request": request, "transactions": transactions})


@app.get("/view_inventory")
async def view_inventory(
    request: Request, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)  # Protect this endpoint
):
    categories = db.query(Category).all()
    return templates.TemplateResponse("inventory.html", {"request": request, "categories": categories})

# NewsFeed Endpoint
@app.get("/fetch_stock_news/")
async def fetch_stock_news(
    stocks: str,
    current_user: User = Depends(get_current_user)  # Protect this endpoint
):
    if not NEWSAPI_KEY:
        raise HTTPException(status_code=500, detail="NewsAPI key not configured.")

    api_url = f"https://newsapi.org/v2/everything?q={stocks}&apiKey={NEWSAPI_KEY}"

    try:
        response = requests.get(api_url)
        response.raise_for_status()  # Raise an exception for HTTP errors
        data = response.json()

        # Sort articles by publishedAt in descending order (most recent first)
        sorted_articles = sorted(data.get("articles", []), key=lambda x: x["publishedAt"], reverse=True)

        # Limit the news items to a maximum of 5
        max_news_items = 5
        limited_articles = sorted_articles[:max_news_items]

        return {"articles": limited_articles}
    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch news: {str(e)}")

# Define a route for the sign-in page
@app.get("/")
async def serve_login_page():
    # Redirect to the sign-in page
    return {"message": "Welcome to Finoria API. Please sign in at /login.html"}

# Start the application
import uvicorn
if __name__ == "__main__":
    uvicorn.run("backend.main:app", host="127.0.0.1", port=8000, reload=True)
