export default function validateUser(values) {
    let errors = {};
  
    if (!values.username.trim()) {
      errors.username = "Tài khoản là bắt buộc";
    } else if (!/^[A-Za-z]+/.test(values.username.trim())) {
      errors.username = "Nhập vào tên hợp lệ";
    }
  
    if (!values.password) {
      errors.password = "Mật khẩu là bắt buộc";
    } else if (values.password.length < 6) {
      errors.password = "Mật khẩu ít nhất là 6 kí tự";
    }
  
    return errors;
  }
  