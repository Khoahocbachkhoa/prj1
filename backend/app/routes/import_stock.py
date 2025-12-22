from flask import Blueprint, request, jsonify
from app.models import db, ImportReceipt, ImportDetail, Medicine, Supplier
from datetime import datetime
from sqlalchemy import extract

import_bp = Blueprint('import_stock', __name__)

# --- API 1: TẠO PHIẾU NHẬP (Lưu + Cộng tồn kho) ---
@import_bp.route('/api/import-receipts', methods=['POST'])
def create_import_receipt():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"msg": "Dữ liệu không hợp lệ"}), 400

        # 1. Lấy dữ liệu an toàn (Tránh crash khi ép kiểu)
        supplier_id = data.get('supplier_id')
        medicine_id = data.get('medicine_id')
        qty_raw = data.get('quantity')
        price_raw = data.get('price')

        # Validate: Kiểm tra thiếu dữ liệu TRƯỚC khi ép kiểu số
        if not all([supplier_id, medicine_id, qty_raw, price_raw]):
             return jsonify({"msg": "Vui lòng điền đầy đủ thông tin (NCC, Thuốc, Số lượng, Giá)"}), 400

        # Ép kiểu an toàn
        quantity = int(qty_raw)
        import_price = float(price_raw)

        # 2. TẠO PHIẾU NHẬP (ImportReceipt)
        total_cost = quantity * import_price
        
        new_receipt = ImportReceipt(
            SupplierID=supplier_id,
            DateImported=datetime.now(),
            TotalCost=total_cost
        )
        db.session.add(new_receipt)
        db.session.flush() # Lấy ID phiếu ngay lập tức

        # 3. TẠO CHI TIẾT (ImportDetail)
        new_detail = ImportDetail(
            ReceiptID=new_receipt.ReceiptID,
            MedicineID=medicine_id,
            Quantity=quantity,
            ImportPrice=import_price
        )
        db.session.add(new_detail)

        # 4. CẬP NHẬT KHO (Medicine)
        medicine = Medicine.query.get(medicine_id)
        if medicine:
            medicine.Quantity += quantity # Cộng dồn tồn kho
        else:
            # Trường hợp hiếm: ID thuốc gửi lên không tồn tại
            db.session.rollback()
            return jsonify({"msg": "Không tìm thấy thuốc này trong hệ thống"}), 404
        
        # 5. LƯU TRANSACTION
        db.session.commit()

        return jsonify({
            "msg": "Nhập kho thành công!", 
            "receipt_id": new_receipt.ReceiptID,
            "new_qty": medicine.Quantity # Trả về số tồn mới để update giao diện nếu cần
        }), 201

    except ValueError:
        return jsonify({"msg": "Số lượng hoặc giá phải là số hợp lệ"}), 400
    except Exception as e:
        db.session.rollback()
        print("Lỗi Backend:", str(e)) # In ra terminal để debug
        return jsonify({"msg": "Lỗi hệ thống: " + str(e)}), 500
    
# --- API 2: LẤY DANH SÁCH LỊCH SỬ NHẬP ---
@import_bp.route('/api/import-receipts', methods=['GET'])
def get_import_history():
    try:
        # Lấy tham số filter từ URL
        month = request.args.get('month', type=int)
        year = request.args.get('year', type=int)

        # Join 4 bảng: Chi tiết -> Phiếu -> Thuốc -> NCC
        query = db.session.query(ImportDetail, ImportReceipt, Medicine, Supplier)\
            .join(ImportReceipt, ImportDetail.ReceiptID == ImportReceipt.ReceiptID)\
            .join(Medicine, ImportDetail.MedicineID == Medicine.MedicineID)\
            .join(Supplier, ImportReceipt.SupplierID == Supplier.SupplierID)

        # Lọc theo tháng/năm nếu có
        if month and year:
            query = query.filter(
                extract('month', ImportReceipt.DateImported) == month,
                extract('year', ImportReceipt.DateImported) == year
            )
        
        # Sắp xếp mới nhất lên đầu
        results = query.order_by(ImportReceipt.DateImported.desc()).all()

        data = []
        for detail, receipt, med, sup in results:
            data.append({
                "id": detail.ImportDetailID,
                "date": receipt.DateImported.strftime("%d/%m/%Y %H:%M"), # Thêm giờ phút cho chi tiết
                "name": med.Name,
                "brand": sup.Name,
                "qty": detail.Quantity,
                "price": detail.ImportPrice
            })
        
        return jsonify(data), 200

    except Exception as e:
        print("Lỗi Backend:", str(e))
        return jsonify({"msg": "Lỗi tải danh sách: " + str(e)}), 500