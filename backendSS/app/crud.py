from sqlalchemy.orm import Session, joinedload
from app.models import User, Storehouse, Product, Inquiry
from app.schemas import *

# User CRUD
def get_user(db: Session, user_id: int):
    return db.query(User).filter(User.id == user_id).first()

def get_user_by_email(db: Session, email: str):
    return db.query(User).filter(User.email == email).first()

def create_user(db: Session, email: str, hashed_password: str, role: str):
    db_user = User(email=email, hashed_password=hashed_password, role=role)
    db.add(db_user) #staged in memory
    db.commit() #saves to the database
    db.refresh(db_user) #refreshes the instance with the latest data from the database
    return db_user

# Storehouse CRUD
def get_storehouse(db: Session, storehouse_id: int):
    return db.query(Storehouse).filter(Storehouse.id == storehouse_id).first()

def get_storehouses_by_owner(db: Session, owner_id: int):
    return db.query(Storehouse).filter(Storehouse.owner_id == owner_id).all()

def create_storehouse(db: Session, storehouse: StorehouseCreate, owner_id: int):
    db_storehouse = Storehouse(**storehouse.dict(), owner_id=owner_id)
    db.add(db_storehouse)
    db.commit()
    db.refresh(db_storehouse)
    return db_storehouse

# Product CRUD
def get_product(db: Session, product_id: int):
    return db.query(Product).filter(Product.id == product_id).first()

def get_product_with_owner(db: Session, product_id: int):
    return db.query(Product).options(
        joinedload(Product.owner),
        joinedload(Product.storehouse)
    ).filter(Product.id == product_id).first()

def get_products_by_storehouse(db: Session, storehouse_id: int):
    return db.query(Product).filter(Product.storehouse_id == storehouse_id).all()

def get_all_products_with_owner(db: Session):
    return db.query(Product).options(
        joinedload(Product.owner),
        joinedload(Product.storehouse)
    ).all()

def create_product(db: Session, product: ProductCreate, storehouse_id: int, owner_id: int):
    product_data = product.dict()
    product_data['revenue'] = product_data['quantity_sold'] * product_data['price_per_unit']
    
    db_product = Product(
        **product_data,
        storehouse_id=storehouse_id,
        owner_id=owner_id
    )
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product

def update_product(db: Session, product_id: int, product: ProductUpdate):
    db_product = db.query(Product).filter(Product.id == product_id).first()
    if not db_product:
        return None
    
    update_data = product.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_product, field, value)
    
    # Recalculate revenue
    db_product.revenue = db_product.quantity_sold * db_product.price_per_unit
    
    db.commit()
    db.refresh(db_product)
    return db_product

def delete_product(db: Session, product_id: int):
    db_product = db.query(Product).filter(Product.id == product_id).first()
    if db_product:
        db.delete(db_product)
        db.commit()
    return db_product

# Inquiry CRUD
def create_inquiry(db: Session, inquiry: InquiryCreate, product_id: int, buyer_id: int):
    db_inquiry = Inquiry(
        **inquiry.dict(),
        product_id=product_id,
        buyer_id=buyer_id
    )
    db.add(db_inquiry)
    db.commit()
    db.refresh(db_inquiry)
    return db_inquiry