from flask import Blueprint, request, jsonify
from app.models import db, Medicine, Supplier

medicine_bp = Blueprint('medicine', __name__)

# --- API 1: TÌM KIẾM THUỐC ---
@medicine_bp.route('/api/medicines/search', methods=['GET'])
def search_medicines():
    try:
        query_text = request.args.get('q', '').strip()
        
        if not query_text:
            return jsonify([]), 200

        # Tìm kiếm thuốc có tên chứa từ khóa (ILIKE cho không phân biệt hoa thường)
        # Kết nối với bảng Supplier để lấy tên hãng
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
                "quantity": med.Quantity, # Số lượng tồn hiện tại
                "brand": sup.Name,
                "description": med.Description
            })
        
        return jsonify(results), 200

    except Exception as e:
        return jsonify({"msg": "Lỗi tìm kiếm: " + str(e)}), 500

# --- API 2: THÊM LOẠI THUỐC MỚI ---
@medicine_bp.route('/api/medicines', methods=['POST'])
def add_new_medicine():
    try:
        data = request.get_json()
        
        # Validate cơ bản
        if not data.get('name') or not data.get('price') or not data.get('supplier_id'):
            return jsonify({"msg": "Tên, Giá và Nhà cung cấp là bắt buộc!"}), 400

        # Tạo đối tượng thuốc mới (Số lượng ban đầu = 0)
        new_med = Medicine(
            Name=data.get('name'),
            Category=data.get('category'),
            Unit=data.get('unit'),
            Price=float(data.get('price')),
            SupplierID=int(data.get('supplier_id')),
            Description=data.get('description'),
            Quantity=0 # Thuốc mới khai báo thì kho chưa có
        )

        db.session.add(new_med)
        db.session.commit()

        return jsonify({"msg": "Thêm thuốc mới thành công!", "id": new_med.MedicineID}), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"msg": "Lỗi thêm thuốc: " + str(e)}), 500