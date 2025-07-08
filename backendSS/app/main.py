from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session, joinedload
from typing import List, Optional
import uvicorn
from sqlalchemy import or_
from app.database import get_db, engine
from app.models import Base, Product, Storehouse
from app.schemas import *
from app.auth import get_current_user, create_access_token, verify_password, get_password_hash
from app.email_service import send_inquiry_email
from app import crud
from dotenv import load_dotenv
import os

# Create tables
Base.metadata.create_all(bind=engine)
load_dotenv()

app = FastAPI(
    title="SamanSetu API",
    description="A comprehensive SamanSetu system with Owner and Buyer roles",
    version="1.0.0"
)


# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.getenv("FRONTEND_URL_TWO"), "http://localhost:5173", os.getenv("FRONTEND_URL")],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

security = HTTPBearer()

# Auth endpoints
@app.post("/owners/signup", response_model=UserResponse)
async def owner_signup(user: UserCreate, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )
    
    hashed_password = get_password_hash(user.password)
    db_user = crud.create_user(db, email=user.email, hashed_password=hashed_password, role="owner")
    return db_user

@app.post("/buyers/signup", response_model=UserResponse)
async def buyer_signup(user: UserCreate, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )
    
    hashed_password = get_password_hash(user.password)
    db_user = crud.create_user(db, email=user.email, hashed_password=hashed_password, role="buyer")
    return db_user

@app.post("/owners/login", response_model=Token)
async def owner_login(user: UserLogin, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_email(db, email=user.email)
    if not db_user or not verify_password(user.password, db_user.hashed_password) or db_user.role != "owner":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
    
    access_token = create_access_token(data={"sub": db_user.email, "role": db_user.role})
    return {"access_token": access_token, "token_type": "bearer", "user": db_user}

@app.post("/buyers/login", response_model=Token)
async def buyer_login(user: UserLogin, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_email(db, email=user.email)
    if not db_user or not verify_password(user.password, db_user.hashed_password) or db_user.role != "buyer":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
    
    access_token = create_access_token(data={"sub": db_user.email, "role": db_user.role})
    return {"access_token": access_token, "token_type": "bearer", "user": db_user}

# Owner endpoints
@app.get("/owners/{owner_id}/storehouses", response_model=List[StorehouseResponse])
async def get_owner_storehouses(
    owner_id: int,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user["role"] != "owner" or current_user["id"] != owner_id:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    return crud.get_storehouses_by_owner(db, owner_id=owner_id)

@app.post("/owners/{owner_id}/storehouses", response_model=StorehouseResponse)
async def create_storehouse(
    owner_id: int,
    storehouse: StorehouseCreate,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user["role"] != "owner" or current_user["id"] != owner_id:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    return crud.create_storehouse(db, storehouse=storehouse, owner_id=owner_id)

@app.get("/storehouses/{storehouse_id}/products", response_model=List[ProductResponse])
async def get_storehouse_products(
    storehouse_id: int,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user["role"] != "owner":
        raise HTTPException(status_code=403, detail="Not authorized")
    
    # Verify storehouse belongs to current user
    storehouse = crud.get_storehouse(db, storehouse_id=storehouse_id)
    if not storehouse or storehouse.owner_id != current_user["id"]:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    return crud.get_products_by_storehouse(db, storehouse_id=storehouse_id)

@app.post("/storehouses/{storehouse_id}/products", response_model=ProductResponse)
async def create_product(
    storehouse_id: int,
    product: ProductCreate,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user["role"] != "owner":
        raise HTTPException(status_code=403, detail="Not authorized")
    
    # Verify storehouse belongs to current user
    storehouse = crud.get_storehouse(db, storehouse_id=storehouse_id)
    if not storehouse or storehouse.owner_id != current_user["id"]:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    return crud.create_product(db, product=product, storehouse_id=storehouse_id, owner_id=current_user["id"])

@app.put("/products/{product_id}", response_model=ProductResponse)
async def update_product(
    product_id: int,
    product: ProductUpdate,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user["role"] != "owner":
        raise HTTPException(status_code=403, detail="Not authorized")
    
    # Verify product belongs to current user
    db_product = crud.get_product(db, product_id=product_id)
    if not db_product or db_product.owner_id != current_user["id"]:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    return crud.update_product(db, product_id=product_id, product=product)

@app.delete("/products/{product_id}")
async def delete_product(
    product_id: int,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user["role"] != "owner":
        raise HTTPException(status_code=403, detail="Not authorized")
    
    # Verify product belongs to current user
    db_product = crud.get_product(db, product_id=product_id)
    if not db_product or db_product.owner_id != current_user["id"]:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    crud.delete_product(db, product_id=product_id)
    return {"message": "Product deleted successfully"}

# Buyer endpoints
@app.get("/products", response_model=List[ProductWithOwnerResponse])
async def get_all_products(
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user["role"] != "buyer":
        raise HTTPException(status_code=403, detail="Not authorized")
    
    return crud.get_all_products_with_owner(db)

# Product search (for buyers and owners)
@app.get("/products/search", response_model=List[ProductWithOwnerResponse])
async def search_products(
    q: str,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # For buyers: return all matching products
    # For owners: return only their own matching products
    
    base_query = db.query(Product).options(
        joinedload(Product.owner),
        joinedload(Product.storehouse)
    ).filter(
        or_(
            Product.name.ilike(f"%{q}%"),
            Product.description.ilike(f"%{q}%")
        )
    )

    if current_user["role"] == "buyer":
        return base_query.all()
    elif current_user["role"] == "owner":
        return base_query.filter(Product.owner_id == current_user["id"]).all()
    else:
        raise HTTPException(status_code=403, detail="Invalid role")

# Storehouse search (for owners)
@app.get("/owners/{owner_id}/storehouses/search", response_model=List[StorehouseResponse])
async def search_storehouses(
    owner_id: int,
    q: str,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user["role"] != "owner" or current_user["id"] != owner_id:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    # Case-insensitive search by storehouse name or location
    return db.query(Storehouse).filter(
        Storehouse.owner_id == owner_id,
        or_(
            Storehouse.name.ilike(f"%{q}%"),
            Storehouse.location.ilike(f"%{q}%")
        )
    ).all()

@app.post("/products/{product_id}/inquiry")
async def send_product_inquiry(
    product_id: int,
    inquiry: InquiryCreate,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user["role"] != "buyer":
        raise HTTPException(status_code=403, detail="Not authorized")
    
    # Get product and owner details
    product = crud.get_product_with_owner(db, product_id=product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    # Create inquiry record
    db_inquiry = crud.create_inquiry(
        db, 
        inquiry=inquiry, 
        product_id=product_id, 
        buyer_id=current_user["id"]
    )
    
    # Send email
    try:
        await send_inquiry_email(
            to_email=product.owner.email,
            buyer_email=current_user["email"],
            product_name=product.name,
            message=inquiry.message,
            quantity=inquiry.quantity
        )
    except Exception as e:
        # Log error but don't fail the request
        print(f"Failed to send email: {e}")
    
    return {"message": "Inquiry sent successfully", "inquiry_id": db_inquiry.id}

@app.get("/")
async def root():
    return {"message": "Storage Management API is running"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)