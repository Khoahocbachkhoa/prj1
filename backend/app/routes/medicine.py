from flask import Blueprint, request, jsonify
from app.models import db, Medicine, Supplier
from flask_jwt_extended import jwt_required

medicine_bp = Blueprint('medicine', __name__)

# Tìm kiếm thuốc
@medicine_bp.route('/api/medicines/search', methods=['GET'])
@jwt_required()
def search_medicines():
    try:
        # Lấy tên thuốc cần tìm kiếm
        query_text = request.args.get('q', '').strip() 
        
        if not query_text:
            return jsonify([]), 200

        # Tìm kiếm thuốc theo tên
        medicines = db.session.query(Medicine, Supplier)\
            .join(Supplier, Medicine.SupplierID == Supplier.SupplierID)\
            .filter(Medicine.Name.ilike(f"%{query_text}%"))\
            .all()

        results = []
        for med, sup in medicines:
            results.append({
                "id": med.MedicineID,
                "name": med.Name,
                "category": med.Category,
                "unit": med.Unit,
                "price": med.Price,
                "quantity": med.Quantity,
                "brand": sup.Name,
                "description": med.Description
            })
        
        return jsonify(results), 200

    except Exception as e:
        return jsonify({"msg": "Lỗi: " + str(e)}), 500

# Thêm loại thuốc mới
@medicine_bp.route('/api/medicines', methods=['POST'])
def add_new_medicine():
    try:
        data = request.get_json()
        
        # Kiểm tra sự hợp lệ của dữ liệu
        if not data.get('name') or not data.get('price') or not data.get('supplier_id'):
            return jsonify({"msg": "Vui lòng nhập đủ thông tin!"}), 400

        # Giả sử ID tự động tăng
        # ! Chưa kiếm tra trùng tên, trùng loại, demo đơn giản nhất
        new_med = Medicine(
            Name=data.get('name'),
            Category=data.get('category'),
            Unit=data.get('unit'),
            Price=float(data.get('price')),
            SupplierID=int(data.get('supplier_id')),
            Description=data.get('description'),
            Quantity=0
        )

        db.session.add(new_med)
        db.session.commit()

        return jsonify({"msg": "Thêm thuốc mới thành công!", "id": new_med.MedicineID}), 201

    except Exception as e:
        # Không thành công thì ta rollback
        db.session.rollback()
        return jsonify({"msg": "Lỗi thêm thuốc: " + str(e)}), 500