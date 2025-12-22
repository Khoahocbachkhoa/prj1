from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token

# Chú ý : Phiên bản này là demo, ta chỉ tính duy nhất 1 role là admin
login_bp = Blueprint("login", __name__)

@login_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()

    if not data:
        return jsonify({"msg": "Dữ liệu không hợp lệ"}), 400

    username = data.get("username")
    password = data.get("password")

    if username != "admin" or password != "123456":
        return jsonify({"msg": "Sai username hoặc password"}), 401

    token = create_access_token(identity="admin")

    return jsonify({
        "msg": "Đăng nhập admin thành công",
        "access_token": token
    }), 200