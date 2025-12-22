from flask import Blueprint, request, jsonify
from app.models import Account
from werkzeug.security import check_password_hash

login_bp = Blueprint("login", __name__)

@login_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()

    if not data:
        return jsonify({"msg": "Dữ liệu không hợp lệ"}), 400

    username = data.get("username")
    password = data.get("password")

    if not username or not password:
        return jsonify({"msg": "Thiếu username hoặc password"}), 400

    # Demo: hệ thống có 1 người dùng duy nhất là admin
    if username == "admin" and password == "123456":
        return jsonify({
            "msg": "Đăng nhập thành công",
            "role": "admin"
        }), 200

    # Tìm kiếm user dựa trên tên đăng nhập (demo)
    acc = Account.query.filter_by(username=username).first()

    if not acc or not check_password_hash(acc.password, password):
        return jsonify({"msg": "Sai username hoặc password"}), 401

    return jsonify({"msg": "Đăng nhập thành công",}), 200