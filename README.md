# [IE104.P11.Group1] - ĐỒ ÁN XÂY DỰNG WEBSITE KINH DOANH SẢN PHẨM DÀNH CHO THÚ CƯNG PAWFECT PHẦN BACK_END

* Trường Đại học Công nghệ Thông tin, Đại học Quốc gia Thành phố Hồ Chí Minh (ĐHQG-HCM)
* Khoa: Khoa học và Kỹ thuật Thông tin (KH&KTTT)
* GVHD: ThS. Võ Tấn Khoa
* Nhóm sinh viên thực hiện: Nhóm 1

## FORM đóng góp ý kiến: [Form đóng góp ý kiến](https://forms.gle/VU4rxi5Z8cxpAJTA8)

## Danh sách thành viên
|STT | Họ tên | MSSV|Chức vụ|
|:---:|:-------------:|:-----:|:-----:|
|1. 	| Nguyễn Lê Thanh Huyền | 225220590| Nhóm trưởng |
|2. 	| Võ Văn Phi Thông		| 22521435 | Thành viên |
|3. 	| Nguyễn Ngọc Thanh Tuyền		|	22521631 | Thành viên |
|4.  | Võ Thị Phương Uyên | 22521645 | Thành viên |
|5. 	| Phạm Quang Vũ | 22521696 | Thành viên |

## Tính năng
|ID	|Tên tác nhân |	Mô tả tác nhân|
|:---:|:-------------:|:-----:|
|AC1	|Unauthenticated User (Khách vãng lai) |	Người sử dụng trang web không có tài khoản hoặc có tài khoản mà chưa đăng nhập, chỉ được thực hiện một số chức năng như xem sản phẩm, xem thông tin cửa hàng, các bài viết,...|
|AC2	|Authenticated User (Khách hàng) |	Người dùng có tài khoản (khách hàng) có thể thực hiện các chức năng mua sản phẩm, thêm giỏ hàng, thêm yêu thích, thay đổi thông tin cá nhân,...|
|AC3 |Staff (Nhân viên) | Nhân viên có tài khoản trong hệ thống. Tài khoản được cấp bởi quản trị viên. Sử dụng hệ thống để cập nhật đơn hàng, quản lý đánh giá sản phẩm, cập nhật trạng thái, quản lý bài viết,...|
|AC4 |Administrator | Là người dùng có quyền hạn cao nhất trong hệ thống. Quản trị viên có thể quản lý người dùng, quản lý đơn hàng, quản lý nhân viên, quản lý sản phẩm,…Quản trị viên đảm bảo hoạt động chung của hệ thống, bảo mật, và có quyền cấp phép và phân quyền cho các tài khoản khác trong hệ thống.|

|Mã chức năng	|	Tên chức năng	|	Tác nhân	| Hoàn thành |
|:---:|:-------------:|:-----:|:-----:|
||	UC1. QLBH	(Quản lý bán hàng)					||
|	UC1.01	|	Quản lý sản phẩm	|	Admin 	| 0%|
|	UC1.02	|	Tìm kiếm sản phẩm 	|	Unauthenticated User	| 100%|
|	UC1.03	|	Xem chi tiết sản phẩm	|	Unauthenticated User 	| 100%|
|	UC1.04	|	Thêm vào giỏ hàng	|	Authenticated User 	| 100%|
|	UC1.05	|	Xem giỏ hàng	|	Authenticated User 	| 100%|
|	UC1.06	|	Thêm sản phẩm vào yêu thích	|	Authenticated User 	| 100%|
|	UC1.07	|	Xem sản phẩm yêu thích	|	Authenticated User	| 100%|
|	UC1.08	|	Mua ngay sản phẩm	|	Authenticated User	| 0%|
|	UC1.09	|	Mua hàng	|	Authenticated User	| 100%|
|	UC1.10	|	Thanh toán	|	Authenticated User	| 100%|
|	UC1.11	|	Đánh giá sản phẩm	|	Authenticated User	| 100%|
|	UC1.12	|	Quản lý đánh giá	|	Staff, Admin	| 0%|
|	UC1.13	|	Xem sản phẩm	|	Unauthenticated User	| 100%|
||	UC2. QLKHO	 (Quản lý Kho)					||
  |	UC2.01	|	Thêm mặt hàng	|	Admin, Staff	| 0%|
|	UC2.02	| Chỉnh sửa số lượng sản phẩm	|	Admin, Staff	| 0%|
|	UC2.03	|	Kiểm tra tồn kho	|	Admin, Staff	| 0%|
|	UC2.04	|	Xóa hàng tồn kho	|	Admin, Staff	| 0%|
||	UC3. QLKH (Quản lý khách hàng)					||
|	UC3.01	|	Đăng ký	|	Unauthenticated User	| 100%|
|	UC3.02	|	Đăng nhập	|	Unauthenticated User, Admin, Staff	| 100%|
|	UC3.03	|	Đổi mật khẩu	|	Unauthenticated User, Admin, Staff	| 100%|
|	UC3.04	|	Chỉnh sửa thông tin	|	Unauthenticated User, Admin, Staff	| 100%|
|	UC3.05	|	Xem thông tin	|	Unauthenticated User, Admin, Staff	| 100%|
|	UC3.06	|	Xóa tài khoản vi phạm	|	Admin, Staff	| 0%|
|	UC3.07	|	Quên mật khẩu	|	Unauthenticated User, Admin, Staff	| 100%|
||	UC4. QLDH (Quản lý đơn hàng)||
|	UC4.01	| Xác nhận đơn hàng	|	Staff, Admin	| 0%|
|	UC4.02	| Hủy đơn hàng	|	Authenticated User, Staff, Admin	| 0%|
|	UC4.03	|	Yêu cầu hoàn hàng	| Authenticated User | 0%|
|	UC4.04	| Xử lý hoàn hàng	|	Staff, Admin	| 0%|
|	UC4.05	|	Xem trạng thái đơn hàng	|	Authenticated User, Staff, Admin	| 100%|
|	UC4.06	|	Cập nhật tráng thái đơn hàng	|	Staff, Admin	| 0%|
||	UC5. QLDT (Quản lý doanh thu)||
|	UC5.01	|	Xem doanh thu	|	Admin	| 0%|
|	UC5.02	|	Xem lịch sử giao dịch |	Admin	| 0%|
||	UC6. QLNV (Quản lý nhân viên)||
|	UC5.01	|	Thêm nhân viên	|	Admin	| 0%|
|	UC6.02	|	Xóa nhân viên |	Admin	| 0%|
|	UC6.03	|	Sửa nhân viên	|	Admin	| 0%|
|	UC6.04	|	Xem thông tin nhân viên |	Staff, Admin	| 0%|
||	UC7. QLCH (Quản lý cửa hàng)||
|	UC5.01	|	Cập nhật thông tin cửa hàng	|	Admin	| 0%|
|	UC5.02	|	Cập nhật thông tin admin |	Admin	| 0%|

## Công nghệ sử dụng
* [Node.js] - Xử lý API, Back-end
* [React.js] - Font-end
* [Express] - Framework nằm trên chức năng máy chủ web của NodeJS
* [MongoDB Compass] - Cung cấp giao diện xem cơ sở dữ liệu MongoDB
* [MongoDB] - Hệ quản trị cơ sở dữ liệu phi quan hệ sử dụng để lưu trữ dữ liệu cho trang web
* [HTML-CSS-JS] - Bộ ba công nghệ web, hiện thức hóa giao diện, dùng thêm bản mở rộng SCSS

  
## Tổng hợp link các github
* [FE_USER](https://github.com/ptvmarch26/setup_react)
* [FE_ADMIN](https://github.com/ThanhTuynn/IE104_FE_Admin)
* [BE](https://github.com/FirstOne2308/Backend_ThuCung)
