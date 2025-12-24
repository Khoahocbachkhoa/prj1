from flask import Blueprint, request, jsonify
from app.models import db, Invoice, InvoiceDetail, Medicine, Customer
from datetime import datetime, timedelta
from sqlalchemy import extract, func
from flask_jwt_extended import jwt_required

invoice_bp = Blueprint('invoice', __name__)

# Tạo một hóa đơn mới
@invoice_bp.route('/api/invoices', methods=['POST'])
@jwt_required()
def create_invoice():
    try:
        data = request.get_json()
        customer_id = data.get('customer_id')
        details = data.get('details')

        if not details:
            return jsonify({"msg": "Chọn ít nhất 1 thuốc để bán"}), 400

        # Tạo một hóa đơn mới
        new_invoice = Invoice(
            CustomerID=customer_id if customer_id else None, # Khách vãng lai thì để là null
            DateCreated=datetime.now(),
            TotalAmount=0
        )
        db.session.add(new_invoice)
        db.session.flush()

        grand_total = 0

        # Xử lý từng loại thuốc trong hóa đơn
        for item in details:
            med_id = int(item.get('medicine_id'))
            qty = int(item.get('quantity'))

            # Kiểm tra tồn kho và tồn tại
            medicine = Medicine.query.get(med_id)
            if not medicine:
                raise Exception(f"Thuốc ID {med_id} không tồn tại")
            
            if medicine.Quantity < qty:
                raise Exception(f"Thuốc '{medicine.Name}' không đủ tồn kho (Trong kho: {medicine.Quantity})")

            medicine.Quantity -= qty # Trừ tồn kho
            
            current_price = medicine.Price
            sub_total = current_price * qty
            grand_total += sub_total

            # Lưu chi tiết hóa đơn
            new_detail = InvoiceDetail(
                InvoiceID=new_invoice.InvoiceID,
                MedicineID=med_id,
                Quantity=qty,
                UnitPrice=current_price,
                SubTotal=sub_total
            )
            db.session.add(new_detail)

        # Cập nhật tổng tiền hóa đơn và commit vào db
        new_invoice.TotalAmount = grand_total
        db.session.commit()

        return jsonify({"msg": "Thành công!", "id": new_invoice.InvoiceID}), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"msg": str(e)}), 400

# Lấy danh sách hóa đơn
@invoice_bp.route('/api/invoices', methods=['GET'])
@jwt_required()
def get_invoices():
    try:
        # Kiểu lọc (ngày, tháng, năm) nếu ko có thì mặc định là lấy hết
        filter_type = request.args.get('filter', 'all')
        # Chứa mã hóa đơn hoặc tên khách cần tìm
        search_query = request.args.get('q', '').strip()

        query = db.session.query(Invoice, Customer).outerjoin(Customer, Invoice.CustomerID == Customer.CustomerID)

        today = datetime.now()

        # Xử lý lọc 
        if filter_type == 'today':
            query = query.filter(func.date(Invoice.DateCreated) == today.date())
        elif filter_type == 'week':
            start_week = today - timedelta(days=today.weekday())
            query = query.filter(Invoice.DateCreated >= start_week.date())
        elif filter_type == 'month':
            query = query.filter(extract('month', Invoice.DateCreated) == today.month)
            query = query.filter(extract('year', Invoice.DateCreated) == today.year)

        # Xử lý tìm kiếm hóa đơn
        if search_query:
            if search_query.isdigit():
                query = query.filter(Invoice.InvoiceID == int(search_query))
            else:
                query = query.filter(Customer.Name.ilike(f"%{search_query}%"))

        results = query.order_by(Invoice.DateCreated.desc()).all()

        data = []
        for inv, cus in results:
            data.append({
                "id": inv.InvoiceID,
                "date": inv.DateCreated.strftime("%d/%m/%Y %H:%M"),
                "customer_name": cus.Name if cus else "Khách lẻ",
                "total": inv.TotalAmount
            })

        return jsonify(data), 200

    except Exception as e:
        return jsonify({"msg": str(e)}), 500