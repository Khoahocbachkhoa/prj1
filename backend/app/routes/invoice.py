from flask import Blueprint, request, jsonify
from app.models import db, Invoice, InvoiceDetail, Medicine, Customer
from datetime import datetime, timedelta
from sqlalchemy import extract, func

invoice_bp = Blueprint('invoice', __name__)

# --- API 1: TẠO HÓA ĐƠN MỚI (BÁN HÀNG) ---
@invoice_bp.route('/api/invoices', methods=['POST'])
def create_invoice():
    try:
        data = request.get_json()
        customer_id = data.get('customer_id')
        details = data.get('details') # Danh sách thuốc: [{medicine_id: 1, quantity: 2}, ...]

        if not details:
            return jsonify({"msg": "Chưa chọn thuốc nào để bán"}), 400

        # 1. Tạo Hóa đơn (Ban đầu TotalAmount = 0, sẽ cộng dồn sau)
        new_invoice = Invoice(
            CustomerID=customer_id if customer_id else None, # Khách lẻ có thể null
            DateCreated=datetime.now(),
            TotalAmount=0
        )
        db.session.add(new_invoice)
        db.session.flush() # Để lấy InvoiceID

        grand_total = 0

        # 2. Xử lý từng thuốc trong chi tiết
        for item in details:
            med_id = int(item.get('medicine_id'))
            qty = int(item.get('quantity'))

            # Lấy thông tin thuốc để check tồn kho và lấy giá
            medicine = Medicine.query.get(med_id)
            if not medicine:
                raise Exception(f"Thuốc ID {med_id} không tồn tại")
            
            if medicine.Quantity < qty:
                raise Exception(f"Thuốc '{medicine.Name}' không đủ tồn kho (Còn: {medicine.Quantity})")

            # Trừ tồn kho
            medicine.Quantity -= qty
            
            # Tính tiền
            current_price = medicine.Price
            sub_total = current_price * qty
            grand_total += sub_total

            # Tạo chi tiết hóa đơn
            new_detail = InvoiceDetail(
                InvoiceID=new_invoice.InvoiceID,
                MedicineID=med_id,
                Quantity=qty,
                UnitPrice=current_price, # Lưu giá tại thời điểm bán
                SubTotal=sub_total
            )
            db.session.add(new_detail)

        # 3. Cập nhật tổng tiền hóa đơn
        new_invoice.TotalAmount = grand_total
        db.session.commit()

        return jsonify({"msg": "Tạo hóa đơn thành công!", "id": new_invoice.InvoiceID}), 201

    except Exception as e:
        db.session.rollback() # Hoàn tác nếu lỗi (để tránh trừ kho sai)
        return jsonify({"msg": str(e)}), 400

# --- API 2: LẤY DANH SÁCH HÓA ĐƠN (CÓ LỌC) ---
@invoice_bp.route('/api/invoices', methods=['GET'])
def get_invoices():
    try:
        filter_type = request.args.get('filter', 'all') # today, week, month, all
        search_query = request.args.get('q', '').strip()

        query = db.session.query(Invoice, Customer).outerjoin(Customer, Invoice.CustomerID == Customer.CustomerID)

        today = datetime.now()

        # 1. Xử lý Lọc theo thời gian
        if filter_type == 'today':
            query = query.filter(func.date(Invoice.DateCreated) == today.date())
        elif filter_type == 'week':
            start_week = today - timedelta(days=today.weekday())
            query = query.filter(Invoice.DateCreated >= start_week.date())
        elif filter_type == 'month':
            query = query.filter(extract('month', Invoice.DateCreated) == today.month)
            query = query.filter(extract('year', Invoice.DateCreated) == today.year)

        # 2. Xử lý Tìm kiếm (Theo ID hóa đơn hoặc Tên khách)
        if search_query:
            if search_query.isdigit():
                query = query.filter(Invoice.InvoiceID == int(search_query))
            else:
                query = query.filter(Customer.Name.ilike(f"%{search_query}%"))

        # Sắp xếp mới nhất lên đầu
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