from flask import Blueprint, request, jsonify
from app.models import db, Customer

customer_bp = Blueprint('customer', __name__)

# --- API 1: LẤY DANH SÁCH KHÁCH HÀNG ---
@customer_bp.route('/api/customers', methods=['GET'])
def get_customers():
    try:
        customers = Customer.query.order_by(Customer.CustomerID.desc()).all()
        data = [{
            "id": c.CustomerID,
            "name": c.Name,
            "phone": c.Phone,
            "address": c.Address
        } for c in customers]
        return jsonify(data), 200
    except Exception as e:
        return jsonify({"msg": str(e)}), 500

# --- API 2: THÊM KHÁCH HÀNG MỚI ---
@customer_bp.route('/api/customers', methods=['POST'])
def add_customer():
    try:
        data = request.get_json()
        if not data.get('name'):
            return jsonify({"msg": "Tên khách hàng là bắt buộc"}), 400

        new_customer = Customer(
            Name=data.get('name'),
            Phone=data.get('phone'),
            Address=data.get('address')
        )
        db.session.add(new_customer)
        db.session.commit()
        return jsonify({"msg": "Thêm khách hàng thành công", "id": new_customer.CustomerID}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"msg": str(e)}), 500

# --- API 3: TÌM KIẾM KHÁCH HÀNG ---
@customer_bp.route('/api/customers/search', methods=['GET'])
def search_customers():
    try:
        query_text = request.args.get('q', '').strip()
        if not query_text:
            return jsonify([]), 200

        # Tìm theo Tên HOẶC Số điện thoại
        customers = Customer.query.filter(
            (Customer.Name.ilike(f"%{query_text}%")) | 
            (Customer.Phone.ilike(f"%{query_text}%"))
        ).all()

        data = [{
            "id": c.CustomerID,
            "name": c.Name,
            "phone": c.Phone,
            "address": c.Address
        } for c in customers]
        return jsonify(data), 200
    except Exception as e:
        return jsonify({"msg": str(e)}), 500