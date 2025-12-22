from flask import Blueprint, request, jsonify
from app.models import Account

login_bp = Blueprint("login", __name__)

@login_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json(silent=True)

    if not data:
        return jsonify({"msg": "Dữ liệu không hợp lệ"}), 400

    username = data.get("username")
    password = data.get("password")

    if not username or not password:
        return jsonify({"msg": "Thiếu username hoặc password"}), 400

    # ADMIN
    if username == "admin" and password == "123456":
        return jsonify({
            "msg": "Đăng nhập thành công với quyền quản trị viên",
            "role": "admin"
        })

    # USER
    acc = Account.query.filter_by(username=username).first()

    if not acc or not acc.check_password(password):
        return jsonify({"msg": "Sai username hoặc password"}), 401

    return jsonify({
        "msg": "Đăng nhập thành công",
        "role": "user"
    })