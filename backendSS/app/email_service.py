from fastapi_mail import FastMail, MessageSchema, ConnectionConfig, MessageType
from pydantic import EmailStr
import os
from dotenv import load_dotenv

load_dotenv()

conf = ConnectionConfig(
    MAIL_USERNAME=os.getenv("MAIL_USERNAME"),
    MAIL_PASSWORD=os.getenv("MAIL_PASSWORD"),
    MAIL_FROM=os.getenv("MAIL_FROM"),
    MAIL_PORT=int(os.getenv("MAIL_PORT", 587)),
    MAIL_SERVER=os.getenv("MAIL_SERVER"),
    MAIL_FROM_NAME=os.getenv("MAIL_FROM_NAME", "Storage Management"),
    MAIL_STARTTLS=True,
    MAIL_SSL_TLS=False,
    USE_CREDENTIALS=True,
    VALIDATE_CERTS=True
)

async def send_inquiry_email(
    to_email: EmailStr,
    buyer_email: EmailStr,
    product_name: str,
    message: str,
    quantity: int
):
    html_content = f"""
    <html>
        <body>
            <h2>New Product Inquiry</h2>
            <p><strong>Product:</strong> {product_name}</p>
            <p><strong>Buyer Email:</strong> {buyer_email}</p>
            <p><strong>Requested Quantity:</strong> {quantity}</p>
            <p><strong>Message:</strong></p>
            <p>{message}</p>
            <hr>
            <p>Please respond directly to the buyer's email address.</p>
            <p><em>This email was sent from the Storage Management System.</em></p>
        </body>
    </html>
    """
    
    message_schema = MessageSchema(
        subject=f"Product Inquiry: {product_name}",
        recipients=[to_email],
        body=html_content,
        subtype=MessageType.html
    )
    
    fm = FastMail(conf)
    await fm.send_message(message_schema)