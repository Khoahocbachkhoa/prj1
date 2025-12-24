from flask import Blueprint, request, jsonify
from app.models import db, ImportReceipt, ImportDetail, Medicine, Supplier
from datetime import datetime
from sqlalchemy import extract
from flask_jwt_extended import jwt_required

import_bp = Blueprint('import_stock', __name__)

# Lưu và nhập kho thuốc
# Để đơn giản -> Mỗi hóa đơn chỉ nhập 1 loại thuốc 
@import_bp.route('/api/import-receipts', methods=['POST'])
@jwt_required()
def create_import_receipt():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"msg": "Dữ liệu không hợp lệ"}), 400

        supplier_id = data.get('supplier_id')
        medicine_id = data.get('medicine_id')
        qty_raw = data.get('quantity')
        price_raw = data.get('price')

        # Nếu thiếu trường dữ liệu
        if not all([supplier_id, medicine_id, qty_raw, price_raw]):
             return jsonify({"msg": "Vui lòng nhập đủ thông tin"}), 400

        quantity = int(qty_raw)
        import_price = float(price_raw)

        # Tạo phiếu nhập
        total_cost = quantity * import_price
        
        new_receipt = ImportReceipt(
            SupplierID=supplier_id,
            DateImported=datetime.now(),
            TotalCost=total_cost
        )
        db.session.add(new_receipt)
        db.session.flush() #Để giữ receiptID

        # Tạo chi tiết phiếu (Để đơn giản thì mỗi phiếu nhập 1 thuốc!)
        new_detail = ImportDetail(
            ReceiptID=new_receipt.ReceiptID,
            MedicineID=medicine_id,
            Quantity=quantity,
            ImportPrice=import_price
        )
        db.session.add(new_detail)

        # Cập nhật kho thuốc
        medicine = Medicine.query.get(medicine_id)
        if medicine:
            # Cộng vào tồn kho
            medicine.Quantity += quantity
        else:
            # Nếu ID không hợp lệ
            db.session.rollback()
            return jsonify({"msg": "Không tìm thấy thuốc này trong hệ thống"}), 404
        
        # commit transaction
        db.session.commit()

        return jsonify({
            "msg": "Nhập kho thành công!", 
            "receipt_id": new_receipt.ReceiptID,
            "new_qty": medicine.Quantity # Trả về số lượng mới
        }), 201

    except ValueError:
        return jsonify({"msg": "Trường dữ liệu không hợp lệ"}), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({"msg": "Lỗi hệ thống: " + str(e)}), 500
    
# Lấy danh sách lịch sử nhập
@import_bp.route('/api/import-receipts', methods=['GET'])
@jwt_required()
def get_import_history():
    try:
        # Lấy tham số tháng và năm để lọc
        month = request.args.get('month', type=int)
        year = request.args.get('year', type=int)

        # Lấy danh sách thuốc - ngày nhập - hãng - số lượng
        query = db.session.query(ImportDetail, ImportReceipt, Medicine, Supplier)\
            .join(ImportReceipt, ImportDetail.ReceiptID == ImportReceipt.ReceiptID)\
            .join(Medicine, ImportDetail.MedicineID == Medicine.MedicineID)\
            .join(Supplier, ImportReceipt.SupplierID == Supplier.SupplierID)

        # Lọc theo tháng, năm
        if month and year:
            query = query.filter(
                extract('month', ImportReceipt.DateImported) == month,
                extract('year', ImportReceipt.DateImported) == year
            )
        
        # Sắp xếp theo ngày nhập
        results = query.order_by(ImportReceipt.DateImported.desc()).all()

        data = []
        for detail, receipt, med, sup in results:
            data.append({
                "id": detail.ImportDetailID,
                "date": receipt.DateImported.strftime("%d/%m/%Y %H:%M"),
                "name": med.Name,
                "brand": sup.Name,
                "qty": detail.Quantity,
                "price": detail.ImportPrice
            })
        
        return jsonify(data), 200

    except Exception as e:
        return jsonify({"msg": "Err: " + str(e)}), 500