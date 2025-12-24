+========================================================================+
| _____  _                                                               |
||  __ \| |                                                              |
|| |__) | |__   __ _ _ __ _ __ ___   __ _  ___ _   _    __ _ _ __  _ __  |
||  ___/| '_ \ / _` | '__| '_ ` _ \ / _` |/ __| | | |  / _` | '_ \| '_ \ |
|| |    | | | | (_| | |  | | | | | | (_| | (__| |_| | | (_| | |_) | |_) ||
||_|    |_| |_|\__,_|_|  |_| |_| |_|\__,_|\___|\__, |  \__,_| .__/| .__/ |
|                                               __/ |       | |   | |    |
|                                              |___/        |_|   |_|    |
+========================================================================+
# Pharmacy app
Ứng dụng quản lý tiệm thuốc đơn giản với các chức năng chính: 
    + quản lý kho
    + quản lý hóa đơn
    + quản lý khách hàng
    + thống kê báo cáo

Công nghệ sử dụng:
    FE: React + Vite
    BE: Flask + SQLite + Sqlalchemy

# Cách chạy ứng dụng

# Backend:
Yêu cầu : nodejs, python, pip
Điều hướng tới thư mục frontend
Tạo môi trường : python -m venv venv
Kích hoạt môi trường ảo: venv\Scripts\activate (window) hoặc source venv/bin/activate (linux)
Cài các gói cần thiết : pip install -r requirements.txt
Khởi tạo server : python run.py
(Tùy chọn) Khởi tạo seed để hiển thị dữ liệu mẫu : python seed.py

# Frontend:
Yêu cầu : nodejs
Cài các gói cần thiết : npm i
Khởi tạo ứng dụng : npm run dev