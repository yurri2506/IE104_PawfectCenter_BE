# [IE104.P11.Group1] - PROJECT: WEBSITE FOR SELLING PET PRODUCTS - **PAWFECT** (FRONTEND FOR USERS)

* University of Information Technology, VNU-HCM  
* Faculty: Information Science and Engineering  
* Instructor: Ths. Võ Tấn Khoa  
* Student Group: Group 1

## 📢 Feedback Form: [Submit your feedback here](https://forms.gle/VU4rxi5Z8cxpAJTA8)

## 👥 Team Members

| No. | Full Name | Student ID | Role |
|:---:|:-----------------------------:|:--------:|:------------:|
| 1.  | Nguyễn Lê Thanh Huyền        | 225220590 | Leader      |
| 2.  | Võ Văn Phi Thông             | 22521435  | Member      |
| 3.  | Nguyễn Ngọc Thanh Tuyền      | 22521631  | Member      |
| 4.  | Võ Thị Phương Uyên           | 22521645  | Member      |
| 5.  | Phạm Quang Vũ                | 22521696  | Member      |

## 🌟 Actors Description

| ID   | Actor Name            | Description |
|:----:|------------------------|-------------|
| AC1  | Unauthenticated User  | A visitor who browses the website without logging in. Can only view products, store information, and blog posts. |
| AC2  | Authenticated User    | A customer with an account who can purchase products, add to cart or wishlist, and edit personal information. |
| AC3  | Staff                 | A staff member with an account issued by the admin. Can manage orders, handle reviews, update statuses, and manage posts. |
| AC4  | Administrator         | The highest authority. Can manage users, orders, staff, products, security, and assign roles. |

## ✅ Features & Completion Status

### UC1. Sales Management

| Code    | Feature                            | Actor              | Status |
|---------|------------------------------------|---------------------|--------|
| UC1.01  | Manage Products                    | Admin               | 100%   |
| UC1.02  | Search Products                    | Unauthenticated User| 100%   |
| UC1.03  | View Product Details               | Unauthenticated User| 100%   |
| UC1.04  | Add to Cart                        | Authenticated User  | 100%   |
| UC1.05  | View Cart                          | Authenticated User  | 100%   |
| UC1.06  | Add to Wishlist                    | Authenticated User  | 100%   |
| UC1.07  | View Wishlist                      | Authenticated User  | 100%   |
| UC1.08  | Buy Now                            | Authenticated User  | 100%   |
| UC1.09  | Place Order                        | Authenticated User  | 100%   |
| UC1.10  | Checkout                           | Authenticated User  | 100%   |
| UC1.11  | Review Products                    | Authenticated User  | 100%   |
| UC1.12  | Manage Reviews                     | Staff, Admin        | 100%   |
| UC1.13  | View Products                      | Unauthenticated User| 100%   |

### UC2. Inventory Management

| Code    | Feature                            | Actor              | Status |
|---------|------------------------------------|---------------------|--------|
| UC2.01  | Add New Product                    | Admin, Staff        | 100%   |
| UC2.02  | Edit Product Quantity              | Admin, Staff        | 100%   |
| UC2.03  | Check Inventory                    | Admin, Staff        | 100%   |
| UC2.04  | Delete Inventory Items             | Admin, Staff        | 100%   |

### UC3. Customer Management

| Code    | Feature                            | Actor                             | Status |
|---------|------------------------------------|-----------------------------------|--------|
| UC3.01  | Register                           | Unauthenticated User              | 100%   |
| UC3.02  | Login                              | Unauthenticated, Admin, Staff     | 100%   |
| UC3.03  | Change Password                    | Unauthenticated, Admin, Staff     | 100%   |
| UC3.04  | Edit Profile                       | Unauthenticated, Admin, Staff     | 100%   |
| UC3.05  | View Profile                       | Unauthenticated, Admin, Staff     | 100%   |
| UC3.06  | Delete Violating Accounts          | Admin, Staff                      | 100%   |
| UC3.07  | Forgot Password                    | Unauthenticated, Admin, Staff     | 100%   |

### UC4. Order Management

| Code    | Feature                            | Actor                             | Status |
|---------|------------------------------------|-----------------------------------|--------|
| UC4.01  | Confirm Orders                     | Staff, Admin                      | 100%   |
| UC4.02  | Cancel Orders                      | Authenticated, Staff, Admin       | 100%   |
| UC4.03  | Request Return                     | Authenticated User                | 0%     |
| UC4.04  | Process Return                     | Staff, Admin                      | 0%     |
| UC4.05  | View Order Status                  | Authenticated, Staff, Admin       | 100%   |
| UC4.06  | Update Order Status                | Staff, Admin                      | 100%   |

### UC5. Revenue Management

| Code    | Feature                            | Actor              | Status |
|---------|------------------------------------|---------------------|--------|
| UC5.01  | View Revenue                       | Admin               | 50%    |
| UC5.02  | View Transaction History           | Admin               | 50%    |

### UC6. Staff Management

| Code    | Feature                            | Actor              | Status |
|---------|------------------------------------|---------------------|--------|
| UC6.01  | Add Staff                          | Admin               | 100%   |
| UC6.02  | Remove Staff                       | Admin               | 0%     |
| UC6.03  | Edit Staff                         | Admin               | 100%   |
| UC6.04  | View Staff Information             | Staff, Admin        | 100%   |

### UC7. Store Information Management

| Code    | Feature                            | Actor              | Status |
|---------|------------------------------------|---------------------|--------|
| UC7.01  | Update Store Info                  | Admin               | 100%   |
| UC7.02  | Update Admin Info                  | Admin               | 100%   |

## 🧰 Technologies Used

- [Node.js] – Backend & API handling  
- [React.js] – Frontend framework  
- [Express.js] – Web framework for Node.js  
- [MongoDB Compass] – GUI for MongoDB database  
- [MongoDB] – NoSQL database used for storing site data  
- [HTML-CSS-JS] – Core web technologies (includes SCSS extension for styling)

## 🛠 Installation Guide

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) (version 16+ recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [MongoDB](https://www.mongodb.com/) running locally or hosted (e.g. MongoDB Atlas)

---

### 1. Install the necessary applications as required 
### 2. Clone the repositories

```bash
# Frontend for Users
git clone https://github.com/ptvmarch26/setup_react.git

# Frontend for Admin
git clone https://github.com/ThanhTuynn/IE104_FE_Admin.git

# Backend
git clone https://github.com/FirstOne2308/Backend_ThuCung.git
```
### 3. Run npm install to download the necessary packages for the application
### 4. Add [.env](https://docs.google.com/document/d/1erLAsHdnt3dNjXRLS7huo5bF3y4j8wOBqGT6nTeseu4/edit?tab=t.0) to the backend folder
### 5. Run npm start in the terminal of each folder
### 6. Open the website with the following accounts:
- User: (clone the code for FE_User and BE)
  - Phone number: 0123456789
  - Password: 123456789
- Admin: (clone the code for FE_Admin and BE)
  - Username: admin123
  - Password: admin12345
