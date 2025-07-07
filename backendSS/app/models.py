from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from datetime import datetime

Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(String, nullable=False)  # "owner" or "buyer"
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    storehouses = relationship("Storehouse", back_populates="owner")
    products = relationship("Product", back_populates="owner")
    inquiries = relationship("Inquiry", back_populates="buyer")

class Storehouse(Base):
    __tablename__ = "storehouses"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(Text)
    location = Column(String)
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    owner = relationship("User", back_populates="storehouses")
    products = relationship("Product", back_populates="storehouse")

class Product(Base):
    __tablename__ = "products"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    total_quantity = Column(Integer, nullable=False, default=0)
    quantity_sold = Column(Integer, nullable=False, default=0)
    price_per_unit = Column(Float, nullable=False)
    revenue = Column(Float, nullable=False, default=0.0)
    description = Column(Text)
    storehouse_id = Column(Integer, ForeignKey("storehouses.id"), nullable=False)
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    storehouse = relationship("Storehouse", back_populates="products")
    owner = relationship("User", back_populates="products")
    inquiries = relationship("Inquiry", back_populates="product")
    
    @property
    def available_quantity(self):
        return self.total_quantity - self.quantity_sold

class Inquiry(Base):
    __tablename__ = "inquiries"
    
    id = Column(Integer, primary_key=True, index=True)
    message = Column(Text, nullable=False)
    quantity = Column(Integer, nullable=False)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    buyer_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    product = relationship("Product", back_populates="inquiries")
    buyer = relationship("User", back_populates="inquiries")