from flask import Blueprint, jsonify
from app.models import Medicine, Supplier
from flask_jwt_extended import jwt_required

# Lấy danh sách thuốc và các nhà cung cấp cho form nhập thuốc

# Tạo Blueprint tên là 'common'
common_bp = Blueprint('common', __name__)

# --- API 1: Lấy danh sách thuốc (Cho Dropdown chọn thuốc) ---
@common_bp.route('/api/options/medicines', methods=['GET'])
@jwt_required() # Khóa route nếu chưa xác thực được người dùng
def get_medicine_options():
    try:
        # Lấy tất cả thuốc trong DB
        medicines = Medicine.query.all()
        
        # Chuyển đổi sang list dictionary để trả về JSON
        # Ta lấy thêm Unit và Price để khi chọn thuốc thì tự điền đơn vị và giá gợi ý
        result = [
            {
                "id": m.MedicineID,
                "name": m.Name,
                "unit": m.Unit,
                "price": m.Price
            } 
            for m in medicines
        ]
        return jsonify(result), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# --- API 2: Lấy danh sách nhà cung cấp (Cho Dropdown chọn NCC) ---
@common_bp.route('/api/options/suppliers', methods=['GET'])
@jwt_required()
def get_supplier_options():
    try:
        suppliers = Supplier.query.all()
        
        result = [
            {
                "id": s.SupplierID,
                "name": s.Name
            } 
            for s in suppliers
        ]
        return jsonify(result), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500