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
from fastapi import HTTPException
import requests
import uvicorn

# Load environment variables from .env file if present
# load_dotenv()


# Load environment variables from backend/.env
load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), ".env"))

# Access environment variables
SECRET_KEY = os.getenv("SECRET_KEY")
NEWSAPI_KEY = os.getenv("NEWSAPI_KEY")



# Database setup
DATABASE_URL = "sqlite:///./test.db"
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

NEWSAPI_KEY = os.getenv("NEWSAPI_KEY")
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
    transaction_type: str  # 'buy', 'sell', 'return'
    item_id: int
    quantity: int
    amount: int


@app.post("/process_transaction/")
async def process_transaction(transaction: TransactionCreate, db: Session = Depends(get_db)):
    # Retrieve the item based on item_id
    db_item = db.query(Item).filter(Item.id == transaction.item_id).first()
    if not db_item:
        raise HTTPException(status_code=404, detail="Item not found")
    
    # Process the transaction based on the type
    if transaction.transaction_type == "buy":
        db_item.quantity += transaction.quantity  # Increase the quantity of the item
        db_item.sale_price = transaction.amount  # Update the sale price (if necessary)
    elif transaction.transaction_type == "sell":
        if db_item.quantity < transaction.quantity:
            raise HTTPException(status_code=400, detail="Not enough stock to sell")
        db_item.quantity -= transaction.quantity  # Decrease the quantity of the item
        db_item.sale_price = transaction.amount  # Update the sale price (if necessary)
    elif transaction.transaction_type == "return":
        db_item.quantity += transaction.quantity  # Increase the quantity of the item
    else:
        raise HTTPException(status_code=400, detail="Invalid transaction type")

    # Create a transaction record
    db_transaction = Transaction(name=transaction.transaction_type, amount=transaction.amount)
    db.add(db_transaction)
    db.commit()
    db.refresh(db_transaction)

    db.commit()  # Commit the changes to the database
    return {"message": f"Transaction processed successfully: {transaction.transaction_type}"}


# Transaction Endpoints
from fastapi import Form

@app.post("/add_transaction/")
async def add_transaction(
    category_id: int = Form(...), 
    item_id: int = Form(...), 
    transaction_type: str = Form(...), 
    quantity: int = Form(...), 
    db: Session = Depends(get_db)
):
    # Your logic here
    item = db.query(Item).filter(Item.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")

    if transaction_type == "buy":
        item.quantity += quantity
        amount = item.cost * quantity
    elif transaction_type == "sell":
        if item.quantity < quantity:
            raise HTTPException(status_code=400, detail="Not enough stock to sell")
        item.quantity -= quantity
        amount = item.sale_price * quantity
    elif transaction_type == "return":
        item.quantity += quantity
        amount = item.sale_price * quantity
    else:
        raise HTTPException(status_code=400, detail="Invalid transaction type")

    db_transaction = Transaction(
        name=f"{transaction_type} {item.name}",
        amount=amount,
    )
    db.add(db_transaction)
    db.commit()
    db.refresh(db_transaction)

    # Commit changes for item as well
    db.commit()

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
async def view_transactions(request: Request, db: Session = Depends(get_db)):
    transactions = db.query(Transaction).all()
    return templates.TemplateResponse("transactions.html", {"request": request, "transactions": transactions})


@app.get("/view_inventory")
async def view_inventory(request: Request, db: Session = Depends(get_db)):
    categories = db.query(Category).all()
    return templates.TemplateResponse("inventory.html", {"request": request, "categories": categories})

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)

# NewsFeed Endpoint
@app.get("/fetch_stock_news/")
async def fetch_stock_news(stocks: str):
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




