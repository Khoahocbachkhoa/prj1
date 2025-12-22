from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime

db = SQLAlchemy()

class Supplier(db.Model):
    __tablename__ = "suppliers"
    SupplierID = db.Column(db.Integer, primary_key=True)
    Name = db.Column(db.String(200), nullable=False)
    Address = db.Column(db.String(300))
    Phone = db.Column(db.String(50))

    medicines = db.relationship("Medicine", backref="supplier", lazy=True)
    import_receipts = db.relationship("ImportReceipt", backref="supplier", lazy=True)

class Medicine(db.Model):
    __tablename__ = "medicines"
    MedicineID = db.Column(db.Integer, primary_key=True)
    Name = db.Column(db.String(200), nullable=False)
    Category = db.Column(db.String(100))
    Unit = db.Column(db.String(50))
    Price = db.Column(db.Float, nullable=False)
    Quantity = db.Column(db.Integer, default=0)
    SupplierID = db.Column(db.Integer, db.ForeignKey("suppliers.SupplierID"))
    Description = db.Column(db.Text)

    invoice_details = db.relationship("InvoiceDetail", backref="medicine", lazy=True)
    import_details = db.relationship("ImportDetail", backref="medicine", lazy=True)

class Customer(db.Model):
    __tablename__ = "customers"
    CustomerID = db.Column(db.Integer, primary_key=True)
    Name = db.Column(db.String(200), nullable=False)
    Phone = db.Column(db.String(50))
    Address = db.Column(db.String(300))

    invoices = db.relationship("Invoice", backref="customer", lazy=True)

class Invoice(db.Model):
    __tablename__ = "invoices"
    InvoiceID = db.Column(db.Integer, primary_key=True)
    DateCreated = db.Column(db.DateTime, default=datetime.now)
    CustomerID = db.Column(db.Integer, db.ForeignKey("customers.CustomerID"))
    TotalAmount = db.Column(db.Float, default=0.0)

    invoice_details = db.relationship("InvoiceDetail", backref="invoice", lazy=True)

class InvoiceDetail(db.Model):
    __tablename__ = "invoice_details"
    InvoiceDetailID = db.Column(db.Integer, primary_key=True)
    InvoiceID = db.Column(db.Integer, db.ForeignKey("invoices.InvoiceID"))
    MedicineID = db.Column(db.Integer, db.ForeignKey("medicines.MedicineID"))
    Quantity = db.Column(db.Integer, nullable=False)
    UnitPrice = db.Column(db.Float, nullable=False)
    SubTotal = db.Column(db.Float, nullable=False)

class ImportReceipt(db.Model):
    __tablename__ = "import_receipts"
    ReceiptID = db.Column(db.Integer, primary_key=True)
    SupplierID = db.Column(db.Integer, db.ForeignKey("suppliers.SupplierID"))
    DateImported = db.Column(db.DateTime, default=datetime.now)
    TotalCost = db.Column(db.Float, default=0.0)

    import_details = db.relationship("ImportDetail", backref="import_receipt", lazy=True)

class ImportDetail(db.Model):
    __tablename__ = "import_details"
    ImportDetailID = db.Column(db.Integer, primary_key=True)
    ReceiptID = db.Column(db.Integer, db.ForeignKey("import_receipts.ReceiptID"))
    MedicineID = db.Column(db.Integer, db.ForeignKey("medicines.MedicineID"))
    Quantity = db.Column(db.Integer, nullable=False)
    ImportPrice = db.Column(db.Float, nullable=False)

class Account(db.Model):
    __tablename__ = "accounts"
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(100), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)