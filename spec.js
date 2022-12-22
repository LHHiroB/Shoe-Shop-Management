var spec =
{
    swagger: "2.0",    // Phiên bản Swagger UI
    info: {
        description:
            "Các thông tin mô tả về dự án và API",
        version: "1.0",    // Phiên bản API
        title: "Shoe Shop Management"
    },
    host: "localhost:5000",    // Server và port deploy API
    basePath: "/api",       // Đường dẫn tới API

    tags: [    // Danh sách các nhóm API: users, customers, orders, products, ...
        {
            name: "users",                                   // Tên nhóm API
            description: "Các API về tài khoản người dùng",    // Mô tả về nhóm API
        },
        {
            name: "customers",                                   // Tên nhóm API
            description: "Các API về tài khoản khách hàng",    // Mô tả về nhóm API
        },
        {
            name: "orders",                                   // Tên nhóm API
            description: "Các API về đơn hàng",    // Mô tả về nhóm API
        },
        {
            name: "products",                                   // Tên nhóm API
            description: "Các API về sản phẩm",    // Mô tả về nhóm API
        },
    ],
    schemes: ["http"],    // Sử dụng scheme gì? HTTP, HTTPS?
    paths: {
//Users 
        "/users/": {    // Đường dẫn. Kết hợp với host và basePath sẽ thành localhost:3000/api/users/login
            post: {        // Phương thức gửi request: get, post, put, delete
                tags: ["users"],
                summary: "Tài khoản users",
                description: "",
                operationId: "",
                consumes: ["multipart/form-data"],    // Loại dữ liệu gửi đi
                produces: ["application/json"],       // Loại dữ liệu trả về
                parameters: [               // Các tham số

                ],
                responses: {
                },
                security: [
                    
                ]
            }
        },
        "/users/login": {    // Đường dẫn. Kết hợp với host và basePath sẽ thành localhost:3000/api/users/login
            post: {        // Phương thức gửi request: get, post, put, delete
                tags: ["users"],
                summary: "Đăng nhập tài khoản users",
                description: "",
                operationId: "LoginUser",
                consumes: ["multipart/form-data"],    // Loại dữ liệu gửi đi
                produces: ["application/json"],       // Loại dữ liệu trả về
                parameters: [               // Các tham số
                    {
                        "in": "username",      // Tham số được gửi lên từ form
                        "name": "Tài khoản",    // Tên tham số
                        "required": "true",    // Tham số là bắt buộc
                        "schema": {
                            "type": "string"   // Loại dữ liệu của tham số là chuỗi
                        },
                        "description": "Nhập username cho tài khoản users"
                    },
                    {
                        "in": "password",
                        "name": "Mật khẩu",
                        "required": "true",
                        "schema": {
                            "type": "string"
                        },
                        "description": "Nhập password cho tài khoản users"
                    }
                ],
                responses: {
                    422: {
                        description: "Rất tiếc, mật khẩu của bạn không đúng. Vui lòng kiểm tra lại mật khẩu."
                    },
                    400: {
                        description: "Vui lòng nhập tài khoản"
                    },
                    200: {
                        description: ""
                    },
                },
                security: [
                    
                ]
            }
        },
        "/users/ChangePass": {    
            post: {        
                tags: ["users"],
                summary: "Thay đổi mật khẩu tài khoản users",
                description: "",
                operationId: "ChangePasswordUser",
                consumes: ["multipart/form-data"],    
                produces: ["application/json"],       
                parameters: [               
                    {
                        "in": "username",      
                        "name": "Tài khoản",    
                        "required": "true",    
                        "schema": {
                            "type": "string"   
                        },
                        "description": "Nhập username cho tài khoản users muốn thay đổi mật khẩu"
                    },
                    {
                        "in": "password",
                        "name": "Mật khẩu",
                        "required": "true",
                        "schema": {
                            "type": "string"
                        },
                        "description": "Nhập password cũ của tài khoản users"
                    }
                ],
                responses: {
                    422: {
                        description: "Rất tiếc, mật khẩu của bạn không đúng. Vui lòng kiểm tra lại mật khẩu."
                    },
                    200: {
                        description: ""
                    },
                },
                security: [
                    
                ]
            }
        },
        "/users/getInfo/:id": {   
            get: {        
                tags: ["users"],
                summary: "Lấy thông tin tài khoản users theo ID",
                description: "",
                operationId: "GetInfoUser",
                consumes: ["multipart/form-data"],    
                produces: ["application/json"],       
                parameters: [               
                    {
                        "in": "ObjectID",      
                        "name": "ID User ",    
                        "required": "true",    
                        "schema": {
                            "type": "string"   
                        },
                        "description": "Nhập ID cho tài khoản users muốn lấy thông tin"
                    }
                ],
                responses: {
                    400: {
                        description: "Error"
                    },
                    422: {
                        description: "Info not found"
                    },
                    200: {
                        description: ""
                    },
                },
                security: [
                    
                ]
            }
        },
        "/users/getUserByPosition/": {   
            get: {        
                tags: ["users"],
                summary: "Lọc thông tin tài khoản users theo chức vụ",
                description: "",
                operationId: "getUserByPosition",
                consumes: ["multipart/form-data"],    
                produces: ["application/json"],       
                parameters: [               
                    
                ],
                responses: {
                    
                },
                security: [
                    
                ]
            }
        },
        "/users/register": {   
            get: {        
                tags: ["users"],
                summary: "Đăng kí tài khoản users",
                description: "",
                operationId: "Register",
                consumes: ["multipart/form-data"],    
                produces: ["application/json"],       
                parameters: [               
                    {
                        "in": "fullname",      
                        "name": "Tên đầy đủ",    
                        "required": "true",    
                        "schema": {
                            "type": "string"   
                        },
                        "description": "Nhập tên đầy đủ của users"
                    },
                    {
                        "in": "username",      
                        "name": "Tài khoản",    
                        "required": "true",    
                        "unique": "true",
                        "schema": {
                            "type": "string"   
                        },
                        "description": "Nhập username"
                    },
                    {
                        "in": "password",      
                        "name": "Mật khẩu",    
                        "required": "true",    
                        "schema": {
                            "type": "string"   
                        },
                        "description": "Nhập password"
                    },
                    {
                        "in": "phone",      
                        "name": "SĐT",    
                        "required": "true",    
                        "unique": "true",
                        "schema": {
                            "type": "string"   
                        },
                        "description": "Nhập số điện thoại"
                    },
                    {
                        "in": "address",      
                        "name": "Địa chỉ",    
                        "required": "true",    
                        "schema": {
                            "type": "string"   
                        },
                        "description": "Nhập địa chỉ cư trú"
                    },
                    {
                        "in": "email",      
                        "name": "Email",    
                        "required": "true",    
                        "schema": {
                            "type": "string"   
                        },
                        "description": "Nhập email"
                    },
                    {
                        "in": "gender",      
                        "name": "Giới tính",    
                        "required": "true",    
                        "schema": {
                            "type": "string"   
                        },
                        "description": "Chọn giới tính"
                    },
                    {
                        "in": "imageURL",      
                        "name": "Hình ảnh",    
                        "required": "true",    
                        "schema": {
                            "type": "string"   
                        },
                        "description": "Thêm hình ảnh users"
                    },
                    {
                        "in": "positon",      
                        "name": "Chức vụ",    
                        "required": "true",    
                        "schema": {
                            "type": "string"   
                        },
                        "description": "Chọn chức vụ"
                    },
                    {
                        "in": "birthdate",      
                        "name": "Ngày sinh",    
                        "required": "true",    
                        "schema": {
                            "type": "Date"   
                        },
                        "description": "Chọn ngày/tháng/năm sinh"
                    }
                ],
                responses: {
                    
                },
                security: [
                    
                ]
            }
        },
        "/users/updateUser/:id": {   
            get: {        
                tags: ["users"],
                summary: "Cập nhật thông tin tài khoản users theo ID",
                description: "",
                operationId: "updateUser",
                consumes: ["multipart/form-data"],    
                produces: ["application/json"],       
                parameters: [               
                    {
                        "in": "ObjectID",      
                        "name": "ID User",    
                        "required": "true",    
                        "schema": {
                            "type": "string"   
                        },
                        "description": "Nhập ID cho tài khoản users muốn cập nhật"
                    },
                    {
                        "in": "fullname",      
                        "name": "Tên đầy đủ",    
                        "required": "true",    
                        "schema": {
                            "type": "string"   
                        },
                        "description": "Nhập tên đầy đủ của users"
                    },
                    {
                        "in": "username",      
                        "name": "Tài khoản",    
                        "required": "true",    
                        "unique": "true",
                        "schema": {
                            "type": "string"   
                        },
                        "description": "Nhập username"
                    },
                    {
                        "in": "password",      
                        "name": "Mật khẩu",    
                        "required": "true",    
                        "schema": {
                            "type": "string"   
                        },
                        "description": "Nhập password"
                    },
                    {
                        "in": "phone",      
                        "name": "SĐT",    
                        "required": "true",    
                        "unique": "true",
                        "schema": {
                            "type": "string"   
                        },
                        "description": "Nhập số điện thoại"
                    },
                    {
                        "in": "address",      
                        "name": "Địa chỉ",    
                        "required": "true",    
                        "schema": {
                            "type": "string"   
                        },
                        "description": "Nhập địa chỉ cư trú"
                    },
                    {
                        "in": "email",      
                        "name": "Email",    
                        "required": "true",    
                        "schema": {
                            "type": "string"   
                        },
                        "description": "Nhập email"
                    },
                    {
                        "in": "position",      
                        "name": "Chức vụ",    
                        "required": "true",    
                        "schema": {
                            "type": "string"   
                        },
                        "description": "Chọn chức vụ"
                    },
                    {
                        "in": "gender",      
                        "name": "Giới tính",    
                        "required": "true",    
                        "schema": {
                            "type": "string"   
                        },
                        "description": "Chọn giới tính"
                    },
                    {
                        "in": "imageURL",      
                        "name": "Hình ảnh",    
                        "required": "true",    
                        "schema": {
                            "type": "string"   
                        },
                        "description": "Thêm hình ảnh users"
                    },
                    {
                        "in": "birthdate",      
                        "name": "Ngày sinh",    
                        "required": "true",    
                        "schema": {
                            "type": "Date"   
                        },
                        "description": "Chọn ngày/tháng/năm sinh"
                    }
                ],
                responses: {
                    
                },
                security: [
                    
                ]
            }
        },
        "/users/filterUser/": {   
            get: {        
                tags: ["users"],
                summary: "Lọc tài khoản users theo Tên, SĐT, hoặc Chức vụ",
                description: "",
                operationId: "filterUser",
                consumes: ["multipart/form-data"],    
                produces: ["application/json"],       
                parameters: [               
                    {
                        "in": "fullname",      
                        "name": "Tên đầy đủ",    
                        "required": "true",    
                        "schema": {
                            "type": "string"   
                        },
                        "description": "Nhập tên đầy đủ của users"
                    },
                    {
                        "in": "phone",      
                        "name": "SĐT",    
                        "required": "true",    
                        "unique": "true",
                        "schema": {
                            "type": "string"   
                        },
                        "description": "Nhập số điện thoại"
                    },
                    {
                        "in": "position",      
                        "name": "Chức vụ",    
                        "required": "true",    
                        "schema": {
                            "type": "string"   
                        },
                        "description": "Chọn chức vụ"
                    }
                ],
                responses: {
                    
                },
                security: [
                    
                ]
            }
        },
        "/users/find": {   
            get: {        
                tags: ["users"],
                summary: "Tìm User theo ID hoặc tên",
                description: "",
                operationId: "find",
                consumes: ["multipart/form-data"],    
                produces: ["application/json"],       
                parameters: [               
                    {
                        "in": "ObjectID",      
                        "name": "IDuser",    
                        "required": "true",    
                        "schema": {
                            "type": "string"   
                        },
                        "description": "Nhập ID users muốn tìm kiếm"
                    },
                    {
                        "in": "fullname",      
                        "name": "Tên",    
                        "required": "true",    
                        "schema": {
                            "type": "string"   
                        },
                        "description": "Nhập tên users muốn tìm kiếm"
                    }
                ],
                responses: {
                    
                },
                security: [
                    
                ]
            }
        },
        "/users/deleteOnebyId/:id": {   
            delete: {        
                tags: ["users"],
                summary: "Tìm User muốn xóa theo ID",
                description: "",
                operationId: "Delete",
                consumes: ["multipart/form-data"],    
                produces: ["application/json"],       
                parameters: [               
                    {
                        "in": "ObjectID",      
                        "name": "ID User",    
                        "required": "true",    
                        "schema": {
                            "type": "string"   
                        },
                        "description": "Nhập ID users muốn muốn xóa"
                    }
                ],
                responses: {
                    
                },
                security: [
                    
                ]
            }
        },
//Customers
        "/customers/list": {    
            get: {        
                tags: ["customers"],
                summary: "Danh sách khách hàng",
                description: "",
                operationId: "listCustomer",
                consumes: ["multipart/form-data"],    
                produces: ["application/json"],       
                parameters: [               
                    
                ],
                responses: {
                    
                },
                security: [
                    
                ]
            }
        },
        "/customers/create": {    
            post: {        
                tags: ["customers"],
                summary: "Tạo mới tài khoản khách hàng",
                description: "",
                operationId: "create",
                consumes: ["multipart/form-data"],    
                produces: ["application/json"],       
                parameters: [               
                    {
                        "in": "name",      
                        "name": "Tên khách hàng",    
                        "required": "true",    
                        "schema": {
                            "type": "string"   
                        },
                        "description": "Nhập tên khách hàng"
                    },
                    {
                        "in": "phone",      
                        "name": "SĐT",    
                        "required": "true",    
                        "unique": "true",
                        "schema": {
                            "type": "string"   
                        },
                        "description": "Nhập số điện thoại"
                    },
                    {
                        "in": "address",      
                        "name": "Địa chỉ",    
                        "required": "true",    
                        "schema": {
                            "type": "string"   
                        },
                        "description": "Nhập địa chỉ cư trú"
                    },
                    {
                        "in": "email",      
                        "name": "Email",    
                        "required": "true",    
                        "schema": {
                            "type": "string"   
                        },
                        "description": "Nhập email"
                    },
                    {
                        "in": "point",      
                        "name": "Tích điểm",    
                        "required": "true",    
                        "schema": {
                            "type": "Number"   
                        },
                        "description": "Số điểm tích được"
                    },
                    {
                        "in": "gender",      
                        "name": "Giới tính",    
                        "required": "true",    
                        "schema": {
                            "type": "string"   
                        },
                        "description": "Chọn giới tính"
                    }
                ],
                responses: {
                    
                },
                security: [
                    
                ]
            }
        },
        "/customers/getTopCustomerByPoint/:limit": {    
            get: {        
                tags: ["customers"],
                summary: "Khách hàng có tích điểm cao nhất",
                description: "",
                operationId: "getTopCustomerByPoint",
                consumes: ["multipart/form-data"],    
                produces: ["application/json"],       
                parameters: [               
                    {
                        "in": "point",      
                        "name": "Tích điểm",    
                        "required": "true",    
                        "schema": {
                            "type": "Number"   
                        },
                        "description": "Số điểm tích được"
                    }
                ],
                responses: {
                    200: {

                    },
                    500: {
                        description: "Lỗi server"
                    }
                },
                security: [
                    
                ]
            }
        },
//Orders
        "/orders/list": {    
            get: {        
                tags: ["orders"],
                summary: "Danh sách hóa đơn",
                description: "",
                operationId: "listOrder",
                consumes: ["multipart/form-data"],    
                produces: ["application/json"],       
                parameters: [               
                
                ],
                responses: {
                    200: {
                        
                    },
                    500: {
                        description: "Bad server"
                    }
                },
                security: [
                    
                ]
            }
        },
        "/orders/:id": {    
            get: {        
                tags: ["orders"],
                summary: "Tìm kiếm hóa đơn theo ID",
                description: "",
                operationId: "id",
                consumes: ["multipart/form-data"],    
                produces: ["application/json"],       
                parameters: [               
                
                ],
                responses: {
                    200: {
                        
                    },
                    500: {
                        description: "Lỗi server"
                    }
                },
                security: [
                    
                ]
            }
        },
        "/orders/create": {    
            post: {        
                tags: ["orders"],
                summary: "Tạo hóa đơn mới",
                description: "",
                operationId: "create",
                consumes: ["multipart/form-data"],    
                produces: ["application/json"],       
                parameters: [               
                    {
                        "in": "userID",      
                        "name": "ID User",    
                        "required": "true",    
                        "schema": {
                            "type": "string"   
                        },
                        "description": "ID nhân viên tạo hóa đơn"
                    },
                    {
                        "in": "customerID",      
                        "name": "ID Customer",    
                        "required": "true",    
                        "schema": {
                            "type": "string"   
                        },
                        "description": "ID khách hàng mua hóa đơn"
                    },
                    {
                        "in": "subTotal",      
                        "name": "Tổng sản phẩm",    
                        "required": "true",    
                        "schema": {
                            "type": "Number"   
                        },
                        "description": "Các sản phẩm/số lượng khách hàng đã mua"
                    },
                    {
                        "in": "discount",      
                        "name": "Ưu đãi",    
                        "required": "true",    
                        "schema": {
                            "type": "Number"   
                        },
                        "description": "Ưu đãi: Giá được giảm"
                    },
                    {
                        "in": "orderTotal",      
                        "name": "Tổng sản phẩm",    
                        "required": "true",    
                        "schema": {
                            "type": "Number"   
                        },
                        "description": "Các sản phẩm/số lượng khách hàng đã mua"
                    }
                ],
                responses: {
                    
                },
                security: [
                    
                ]
            }
        },
        "/orders/product/add": {    
            post: {        
                tags: ["orders"],
                summary: "Thêm sản phẩm vào hóa đơn",
                description: "",
                operationId: "add",
                consumes: ["multipart/form-data"],    
                produces: ["application/json"],       
                parameters: [               
                    
                ],
                responses: {
                    
                },
                security: [
                    
                ]
            }
        },
        "/orders/": {    
            post: {        
                tags: ["orders"],
                summary: "Hóa đơn đã thanh toán",
                description: "",
                operationId: "orderscomplete",
                consumes: ["multipart/form-data"],    
                produces: ["application/json"],       
                parameters: [               
                    {
                        "in": "user",      
                        "name": "Nhân viên",    
                        "required": "true",    
                        "schema": {
                            "type": "string"   
                        },
                        "description": "Nhân viên tạo hóa đơn"
                    },
                    {
                        "in": "customer",      
                        "name": "Khách hàng",    
                        "required": "true",    
                        "schema": {
                            "type": "string"   
                        },
                        "description": "Khách hàng mua hóa đơn"
                    },
                    {
                        "in": "subTotal",      
                        "name": "Tổng sản phẩm",    
                        "required": "true",    
                        "schema": {
                            "type": "Number"   
                        },
                        "description": "Các sản phẩm/số lượng khách hàng đã mua"
                    },
                    {
                        "in": "discount",      
                        "name": "Ưu đãi",    
                        "required": "true",    
                        "schema": {
                            "type": "Number"   
                        },
                        "description": "Ưu đãi: Giá được giảm"
                    },
                    {
                        "in": "orderTotal",      
                        "name": "Tổng sản phẩm",    
                        "required": "true",    
                        "schema": {
                            "type": "Number"   
                        },
                        "description": "Các sản phẩm/số lượng khách hàng đã mua"
                    },
                    {
                        "in": "status",      
                        "name": "Tình trạng",    
                        "required": "true",    
                        "schema": {
                            "type": "string"   
                        },
                        "description": "Đã thanh toán"
                    }
                ],
                responses: {
                    
                },
                security: [
                    
                ]
            }
        },
        "/orders/revenue/revenueToday": {    
            get: {        
                tags: ["orders"],
                summary: "Doanh thu shop trong ngày",
                description: "",
                operationId: "revenueToday",
                consumes: ["multipart/form-data"],    
                produces: ["application/json"],       
                parameters: [               
                    
                ],
                responses: {
                    
                },
                security: [
                    
                ]
            }
        },
        "/orders/revenue/getTopProductByRevenue/:limit": {    
            get: {        
                tags: ["orders"],
                summary: "Top sản phẩm doanh thu cao",
                description: "",
                operationId: "getTopProductByRevenue",
                consumes: ["multipart/form-data"],    
                produces: ["application/json"],       
                parameters: [               
                    
                ],
                responses: {
                    
                },
                security: [
                    
                ]
            }
        },
        "/orders/revenue/getTopProductByQuantity/:number": {    
            get: {        
                tags: ["orders"],
                summary: "Top sản phẩm bán chạy",
                description: "",
                operationId: "getTopProductByQuantity",
                consumes: ["multipart/form-data"],    
                produces: ["application/json"],       
                parameters: [               
                    
                ],
                responses: {
                    
                },
                security: [
                    
                ]
            }
        },
        "/orders/revenue/getExpensiveToday": {    
            get: {        
                tags: ["orders"],
                summary: "Sản phẩm đắt hàng",
                description: "",
                operationId: "getExpensiveToday",
                consumes: ["multipart/form-data"],    
                produces: ["application/json"],       
                parameters: [               
                    
                ],
                responses: {
                    
                },
                security: [
                    
                ]
            }
        },
        "/orders/revenue/getCountOrderToday": {    
            get: {        
                tags: ["orders"],
                summary: "Tổng số đơn đặt hàng",
                description: "",
                operationId: "getCountOrderToday",
                consumes: ["multipart/form-data"],    
                produces: ["application/json"],       
                parameters: [               
                    
                ],
                responses: {
                    
                },
                security: [
                    
                ]
            }
        },
        "/orders/revenue/updateOrder": {    
            get: {        
                tags: ["orders"],
                summary: "Cập nhật đơn đặt hàng",
                description: "",
                operationId: "updateOrder",
                consumes: ["multipart/form-data"],    
                produces: ["application/json"],       
                parameters: [               
                    
                ],
                responses: {
                    
                },
                security: [
                    
                ]
            }
        },
        "/orders/revenue/getTotalCustomerByThisWeek": {    
            get: {        
                tags: ["orders"],
                summary: "Tổng số khách hàng trong tuần",
                description: "",
                operationId: "getTotalCustomerByThisWeek",
                consumes: ["multipart/form-data"],    
                produces: ["application/json"],       
                parameters: [               
                    
                ],
                responses: {
                    
                },
                security: [
                    
                ]
            }
        },
        "/orders/revenue/getTotalCustomerByLastWeek": {    
            get: {        
                tags: ["orders"],
                summary: "Tổng số khách hàng trong tuần trước",
                description: "",
                operationId: "getTotalCustomerByLastWeek",
                consumes: ["multipart/form-data"],    
                produces: ["application/json"],       
                parameters: [               
                    
                ],
                responses: {
                    
                },
                security: [
                    
                ]
            }
        },
//Products
        "/products/listCategory": {    
            get: {        
                tags: ["products"],
                summary: "Danh mục sản phẩm",
                description: "",
                operationId: "listCatogory",
                consumes: ["multipart/form-data"],    
                produces: ["application/json"],       
                parameters: [               
                    {
                        "in": "name",      
                        "name": "Tên danh mục sản phẩm",    
                        "required": "true",    
                        "schema": {
                            "type": "string"   
                        },
                        "description": "Nhập tên danh mục sản phẩm"
                    }
                ],
                responses: {
                    200: {
                        
                    },
                    500: {
                        description: "Bad server"
                    }
                },
                security: [
                    
                ]
            }
        },
        "/products/getAllCategories": {    
            get: {        
                tags: ["products"],
                summary: "Toàn bộ danh sách danh mục sản phẩm",
                description: "",
                operationId: "getAllCategories",
                consumes: ["multipart/form-data"],    
                produces: ["application/json"],       
                parameters: [               
                    
                ],
                responses: {
                    200: {
                        
                    },
                    500: {
                        description: "Bad server"
                    }
                },
                security: [
                    
                ]
            }
        },
        "/products/find": {    
            post: {        
                tags: ["products"],
                summary: "Danh mục sản phẩm",
                description: "",
                operationId: "find",
                consumes: ["multipart/form-data"],    
                produces: ["application/json"],       
                parameters: [               
                    {
                        "in": "name",      
                        "name": "Tên tìm kiếm",    
                        "required": "true",    
                        "schema": {
                            "type": "string"   
                        },
                        "description": "Nhập tên tìm kiếm"
                    },
                    {
                        "in": "ObjectId",      
                        "name": "ID tìm kiếm",    
                        "required": "true",    
                        "schema": {
                            "type": "string"   
                        },
                        "description": "Nhập ID tìm kiếm"
                    }
                ],
                responses: {
                    
                },
                security: [
                    
                ]
            }
        },
        "/products/productByCategory/": {    
            get: {        
                tags: ["products"],
                summary: "Tất cả sản phẩm trong danh mục sản phẩm",
                description: "",
                operationId: "productByCategory",
                consumes: ["multipart/form-data"],    
                produces: ["application/json"],       
                parameters: [               
                    {
                        "in": "name",      
                        "name": "Tên danh mục sản phẩm",    
                        "required": "true",    
                        "schema": {
                            "type": "string"   
                        },
                        "description": "Nhập tên danh mục sản phẩm"
                    }
                ],
                responses: {
                    200: {
                        
                    },
                    500: {
                        description: "Bad server"
                    }
                },
                security: [
                    
                ]
            }
        },
        "/products/listProduct": {    
            get: {        
                tags: ["products"],
                summary: "Danh sách sản phẩm",
                description: "",
                operationId: "listProduct",
                consumes: ["multipart/form-data"],    
                produces: ["application/json"],       
                parameters: [               
                    
                ],
                responses: {
                    200: {
                        
                    },
                    500: {
                        description: "Bad server"
                    }
                },
                security: [
                    
                ]
            }
        },
        "/products/import": {    
            post: {        
                tags: ["products"],
                summary: "Nhập khẩu",
                description: "",
                operationId: "import",
                consumes: ["multipart/form-data"],    
                produces: ["application/json"],       
                parameters: [               
                    
                ],
                responses: {
                    200: {
                        description: "Import dữ liệu thành công"
                    },
                    500: {
                        description: "File không có dữ liệu hoặc không đúng định dạng!"
                    }
                },
                security: [
                    
                ]
            }
        },
        "/products/img/updates": {    
            post: {        
                tags: ["products"],
                summary: "Cập nhật hình ảnh",
                description: "",
                operationId: "imageupdate",
                consumes: ["multipart/form-data"],    
                produces: ["application/json"],       
                parameters: [               
                    
                ],
                responses: {
                    
                },
                security: [
                    
                ]
            }
        },
        "/products/deleteSomebyId": {    
            delete: {        
                tags: ["products"],
                summary: "Xóa một số sản phẩm bằng ID",
                description: "",
                operationId: "deleteSomebyId",
                consumes: ["multipart/form-data"],    
                produces: ["application/json"],       
                parameters: [               
                    {
                        "in": "ObjectId",      
                        "name": "ID muốn xóa",    
                        "required": "true",    
                        "schema": {
                            "type": "string"   
                        },
                        "description": "Nhập ID muốn xóa"
                    }
                ],
                responses: {
                    
                },
                security: [
                    
                ]
            }
        },
        "/products/deleteOnebyId/:id": {    
            delete: {        
                tags: ["products"],
                summary: "Xóa một sản phẩm bằng ID",
                description: "",
                operationId: "deleteOnebyId",
                consumes: ["multipart/form-data"],    
                produces: ["application/json"],       
                parameters: [               
                    {
                        "in": "ObjectId",      
                        "name": "ID muốn xóa",    
                        "required": "true",    
                        "schema": {
                            "type": "string"   
                        },
                        "description": "Nhập ID muốn xóa"
                    }
                ],
                responses: {
                    
                },
                security: [
                    
                ]
            }
        },
        "/products/add": {    
            post: {        
                tags: ["products"],
                summary: "Thêm sản phẩm",
                description: "",
                operationId: "add",
                consumes: ["multipart/form-data"],    
                produces: ["application/json"],       
                parameters: [               
                    {
                        "in": "name",      
                        "name": "Tên sản phẩm",    
                        "required": "true",    
                        "schema": {
                            "type": "string"   
                        },
                        "description": "Nhập tên sản phẩm muốn thêm"
                    },
                    {
                        "in": "salePrice",      
                        "name": "Giá bán",    
                        "required": "true",    
                        "schema": {
                            "type": "Number"   
                        },
                        "description": "Nhập giá sản phẩm muốn thêm"
                    },
                    {
                        "in": "discount",      
                        "name": "Ưu đãi",    
                        "required": "true",    
                        "schema": {
                            "type": "Number"   
                        },
                        "description": "Nhập ưu đãi sản phẩm muốn thêm"
                    },
                    {
                        "in": "imageDisplay",      
                        "name": "Hình ảnh sản phẩm",    
                        "required": "true",    
                        "schema": {
                            "type": "string"   
                        },
                        "description": "Thêm hình ảnh sản phẩm"
                    }
                ],
                responses: {
                    
                },
                security: [
                    
                ]
            }
        },
        "/products/updateProduct/:id": {    
            put: {        
                tags: ["products"],
                summary: "Cập nhật sản phẩm",
                description: "",
                operationId: "updateProduct",
                consumes: ["multipart/form-data"],    
                produces: ["application/json"],       
                parameters: [  
                    {
                        "in": "ObjectId",      
                        "name": "ID sản phẩm muốn cập nhật",    
                        "required": "true",    
                        "schema": {
                            "type": "string"   
                        },
                        "description": "Nhập ID sản phẩm muốn cập nhật"
                    },
                    {
                        "in": "imageDisplay",      
                        "name": "Thay đổi hình ảnh sản phẩm",    
                        "required": "true",    
                        "schema": {
                            "type": "string"   
                        },
                        "description": "Thay đổi hình ảnh sản phẩm"
                    },             
                    {
                        "in": "name",      
                        "name": "Tên sản phẩm cập nhật",    
                        "required": "true",    
                        "schema": {
                            "type": "string"   
                        },
                        "description": "Nhập tên sản phẩm cập nhật"
                    },
                    {
                        "in": "salePrice",      
                        "name": "Giá bán mới",    
                        "required": "true",    
                        "schema": {
                            "type": "Number"   
                        },
                        "description": "Nhập giá sản phẩm mới"
                    },
                    {
                        "in": "discount",      
                        "name": "Ưu đãi mới",    
                        "required": "true",    
                        "schema": {
                            "type": "Number"   
                        },
                        "description": "Nhập ưu đãi sản phẩm mới"
                    },
                    
                ],
                responses: {
                    
                },
                security: [
                    
                ]
            }
        },
    },     
    securityDefinitions: {    // Thông tin về api key sử dụng để thực hiện request
        api_key: {
            type: "apiKey",      // Thuộc loại api key xác thực
            name: "api_key",     // Tên trường chứa api key xác thực
            in: "header",        // API key được để trong phần header của request
        }
    },
    definitions: {            // Thông tin các đối tượng sẽ trả về
        users: {                 // Tên đối tượng
            type: "object",         // Loại đối tượng là object
            properties: {           // Các thuộc tính của đối tượng
                fullname: {
                    type: "string"
                  },
                  username: {
                    type: "string"
                  },
                  password: {
                    type: "string"
                  },
                  phone: {
                    type: "string"
                  },
                  address: {
                    type: "string"
                  },
                  email: {
                    type: "string"
                  },
                  gender: {
                    type: "string"
                  },
                  imageUrl: {
                    type: "string"
                  },
                  position: {
                    type: "string"
                  },
                  birthday: {
                    type: "Date",
                    default: "Date.now",
                  }       
            }
        },
        customers: {                 
            type: "object",         
            properties: {           
                name: {
                    type: "string"
                  },
                  phone: {
                    type: "string"
                  },
                  address: {
                    type: "string"
                  },
                  email: {
                    type: "string"
                  },
                  gender: {
                    type: "string"
                  },
                  point: {
                    type: "Number",
                  },
                  listOrders: [
                    {
                      type: "mongoose.Schema.Types.ObjectId",
                      ref: "Order",
                    },
                  ],
            }
        },
        orders: {                 
            type: "object",         
            properties: {           
                user: {
                    type: "mongoose.Schema.Types.ObjectId",
                    ref: "User",
                  },
                  customer: {
                    type: "mongoose.Schema.Types.ObjectId",
                    ref: "Customer",
                  },
                  dateOrder: {
                    type: "Date",
                    default: "new Date()",
                  },
                  subTotal: {
                    type: "Number",
                  },
                  discount: {
                    type: "Number",
                  },
                  orderTotal: {
                    type: "Number",
                  },
                  orderDetails: [
                    {
                      type: "mongoose.Schema.Types.ObjectId",
                      ref: "OrderDetail",
                    },
                  ],
                  status: {
                    type: "string",
                    default: "Chưa thanh toán",
                  },
                  totalReturnPrice: {
                    type: "Number",
                  }
            }
        },
        products: {                 
            type: "object",         
            properties: {     
                namecategory: {
                    type: "string"
                  },
                  categoryId: {
                    type: "mongoose.Schema.Types.ObjectId",
                    ref: "Category",
                  },
                  name: {
                    type: "string"
                  },
                  originPrice: {
                    type: "Number",
                  },
                  costPrice: {
                    type: "Number",
                  },
                  discount: {
                    type: "Number",
                  },
                  salePrice: {
                    type: "Number",
                  },
                  imageDisplay: {
                    type: "string"
                  },
                  options: [
                    {
                      size: {
                        type: "string"
                      },
                      quantity: {
                        type: "Number",
                      },
                    },
                  ],
            }
        }
    }
};
