from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

# User schemas
class UserBase(BaseModel):
    email: EmailStr

class UserCreate(UserBase):
    password: str

class UserLogin(UserBase):
    password: str

class UserResponse(UserBase):
    id: int
    role: str
    created_at: datetime
    
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse

# Storehouse schemas
class StorehouseBase(BaseModel):
    name: str
    description: Optional[str] = None
    location: Optional[str] = None

class StorehouseCreate(StorehouseBase):
    pass

class StorehouseResponse(StorehouseBase):
    id: int
    owner_id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

# Product schemas
class ProductBase(BaseModel):
    name: str
    total_quantity: int
    quantity_sold: int = 0
    price_per_unit: float
    description: Optional[str] = None

class ProductCreate(ProductBase):
    pass

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    total_quantity: Optional[int] = None
    quantity_sold: Optional[int] = None
    price_per_unit: Optional[float] = None
    description: Optional[str] = None

class ProductResponse(ProductBase):
    id: int
    revenue: float
    storehouse_id: int
    owner_id: int
    created_at: datetime
    updated_at: datetime
    available_quantity: int
    
    class Config:
        from_attributes = True

class ProductWithOwnerResponse(ProductResponse):
    owner: UserResponse
    storehouse: StorehouseResponse
    
    class Config:
        from_attributes = True

# Inquiry schemas
class InquiryBase(BaseModel):
    message: str
    quantity: int

class InquiryCreate(InquiryBase):
    pass

class InquiryResponse(InquiryBase):
    id: int
    product_id: int
    buyer_id: int
    created_at: datetime
    
    class Config:
        from_attributes = True