import os
from datetime import datetime, timedelta
from fastapi import FastAPI, Depends, HTTPException, Security, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.templating import Jinja2Templates
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from passlib.context import CryptContext
from pydantic import BaseModel
from sqlalchemy import create_engine, Column, Integer, String, ForeignKey,Float
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship, Session
from dotenv import load_dotenv
from fastapi import HTTPException
import requests
import uvicorn

# Import our auth routes
from auth_routes import router as auth_router
from auth_utils import get_current_user

# Load environment variables from .env file if present
# load_dotenv()


# Load environment variables from backend/.env
load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), ".env"))

# Access environment variables
SECRET_KEY = os.getenv("SECRET_KEY")
NEWSAPI_KEY = os.getenv("NEWSAPI_KEY")



# Database setup
from database import engine, SessionLocal, Base
NEWSAPI_KEY = os.getenv("NEWSAPI_KEY")

# Database Models imported from models.py
from models import User

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
    type = Column(String, index=True)
    item_id = Column(Integer, ForeignKey("items.id"))  # Foreign key to Item model
    budget_id = Column(Integer, ForeignKey("budgets.id"))  # Foreign key to Budget model
    quantity = Column(Integer)
    amount = Column(Integer)
    
    # Relationships with Item and Budget models
    item = relationship("Item")
    budget = relationship("Budget")


class Budget(Base):
    __tablename__ = 'budgets'
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    amount = Column(Float, default=0.0)
    parent_budget_id = Column(Integer, ForeignKey('budgets.id'), nullable=True)
    
    parent_budget = relationship("Budget", remote_side=[id], backref="sub_budgets")


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
    type: str  # 'buy', 'sell', 'return'
    item_id: int  # Use item_id instead of item_name (foreign key)
    quantity: int
    budget_id: int  # New field for budget_id
    amount: int





# Transaction Endpoints
from fastapi import Form

@app.post("/add_transaction/")
async def add_transaction(
    category_id: int = Form(...), 
    ftype: str = Form(...), 
    fitem_id: int = Form(...),  # Changed to item_id
    fquantity: int = Form(...),
    fbudget_id: int = Form(...),  # New field for budget_id
    db: Session = Depends(get_db)
):
    # Retrieve item based on item_id (fitem_id in form data)
    item = db.query(Item).filter(Item.id == fitem_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")

    # Retrieve budget based on budget_id (fbudget_id in form data)
    budget = db.query(Budget).filter(Budget.id == fbudget_id).first()
    if not budget:
        raise HTTPException(status_code=404, detail="Budget not found")

    # Process the transaction based on its type
    if ftype == "buy":
        item.quantity += fquantity
        amount = item.cost * fquantity * -1
        budget.amount += amount  # Deduct from the budget
    elif ftype == "sell":
        if item.quantity < fquantity:
            raise HTTPException(status_code=400, detail="Not enough stock to sell")
        item.quantity -= fquantity
        amount = item.sale_price * fquantity
        budget.amount += amount  # Add to the budget
    elif ftype == "return":
        item.quantity += fquantity
        amount = item.sale_price * fquantity
        budget.amount += amount  # Add to the budget
    else:
        raise HTTPException(status_code=400, detail="Invalid transaction type")

    # Create the transaction record
    db_transaction = Transaction(
        type=ftype,
        item_id=item.id,  # Store the item_id as foreign key
        budget_id= fbudget_id,  # Store the budget_id as foreign key
        quantity=fquantity,
        amount=amount,
    )
    db.add(db_transaction)
    db.commit()
    db.refresh(db_transaction)

    # Commit changes for item as well
    db.commit()
    db.refresh(budget)

    return {"message": f"Transaction '{db_transaction.type}' added successfully!"}


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

class SubBudgetCreate(BaseModel):
    name: str

# Create the main budget if needed and return the main budget
def create_main_budget_if_needed(db: Session):
    main_budget = db.query(Budget).filter(Budget.parent_budget_id == None).first()
    if not main_budget:
        new_budget = Budget(name="Main Budget", amount=0.0, parent_budget_id=0)
        db.add(new_budget)
        db.commit()
        db.refresh(new_budget)
        return new_budget
    return main_budget

# Endpoint to create sub-budgets under a specific parent budget
@app.post("/create_sub_budget/{parent_budget_id}")
async def create_sub_budget(parent_budget_id: int, sub_budget_data: SubBudgetCreate, db: Session = Depends(get_db)):
    try:
        # Find the parent budget
        parent_budget = db.query(Budget).filter(Budget.id == parent_budget_id).first()
        if not parent_budget:
            raise HTTPException(status_code=404, detail="Parent budget not found")
        
        # Create the sub-budget
        sub_budget = Budget(name=sub_budget_data.name, amount=0.0, parent_budget_id=parent_budget_id)
        db.add(sub_budget)
        db.commit()
        db.refresh(sub_budget)
        
        return sub_budget
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

# Endpoint to start the process (create the main budget if needed)
@app.post("/start/")
async def start(db: Session = Depends(get_db)):
    main_budget = create_main_budget_if_needed(db)
    return main_budget  # Return the main budget so the frontend can display it

# Endpoint to get budgets (sub-budgets for a specific parent)
from typing import Optional  # Import Optional for type hinting

@app.get("/budgets/")
async def get_budgets(parent_id: Optional[int] = None, db: Session = Depends(get_db)):
    try:
        if parent_id == 0:
            budgets = db.query(Budget).filter(Budget.parent_budget_id.is_(0)).all()
        else:
            budgets = db.query(Budget).filter(Budget.parent_budget_id == parent_id).all()

        # Ensure that the amount is always displayed as 0.00 if not set
        for budget in budgets:
            if budget.amount is None:
                budget.amount = 0.0  # Default to 0.0 if None

        return {"budgets": budgets}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/get_all_budgets/")
async def get_all_budgets(db: Session = Depends(get_db)):
    try:
        # Fetch all budgets without any filtering
        budgets = db.query(Budget).all()

        # Ensure that the amount is always displayed as 0.00 if not set
        for budget in budgets:
            if budget.amount is None:
                budget.amount = 0.0  # Default to 0.0 if None

        return {"budgets": budgets}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


class BudgetAmountUpdate(BaseModel):
    amount: float

@app.post("/add_budget_amount/{budget_id}")
async def add_budget_amount(budget_id: int, amount_data: BudgetAmountUpdate, db: Session = Depends(get_db)):
    if amount_data.amount <= 0:
        raise HTTPException(status_code=400, detail="Amount must be positive")
    
    budget = db.query(Budget).filter(Budget.id == budget_id).first()
    if not budget:
        raise HTTPException(status_code=404, detail="Budget not found")
    
    if budget.parent_budget_id == 0:
        # Main budget: Just add the amount
        budget.amount += amount_data.amount
    else:
        # Sub-budget: Deduct from parent and add to sub-budget
        parent_budget = db.query(Budget).filter(Budget.id == budget.parent_budget_id).first()
        if not parent_budget:
            raise HTTPException(status_code=404, detail="Parent budget not found")
        if parent_budget.amount < amount_data.amount:
            raise HTTPException(status_code=400, detail="Not enough funds in parent budget")
        
        parent_budget.amount -= amount_data.amount
        budget.amount += amount_data.amount

    db.commit()  # Commit changes to the database
    db.refresh(budget)  # Refresh to get the updated value
    
    return {"message": "Amount added successfully", "budget": budget}  # Return updated budget


@app.post("/remove_budget_amount/{budget_id}")
async def remove_budget_amount(budget_id: int, amount_data: BudgetAmountUpdate, db: Session = Depends(get_db)):
    if amount_data.amount <= 0:
        raise HTTPException(status_code=400, detail="Amount must be positive")
    
    budget = db.query(Budget).filter(Budget.id == budget_id).first()
    if not budget:
        raise HTTPException(status_code=404, detail="Budget not found")
    
    if budget.amount < amount_data.amount:
        raise HTTPException(status_code=400, detail="Not enough funds in budget")
    
    if budget.parent_budget_id == 0:
        # Main budget: Just remove the amount
        budget.amount -= amount_data.amount
    else:
        # Sub-budget: Return amount to parent
        parent_budget = db.query(Budget).filter(Budget.id == budget.parent_budget_id).first()
        if not parent_budget:
            raise HTTPException(status_code=404, detail="Parent budget not found")
        
        budget.amount -= amount_data.amount
        parent_budget.amount += amount_data.amount

    db.commit()
    db.refresh(budget)
    
    return {"message": "Amount removed successfully", "budget": budget}

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)

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




