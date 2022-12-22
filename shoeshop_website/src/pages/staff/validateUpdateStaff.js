import formatDate from "../../utils/formatDate";
export default function validateUpdateStaff(staff) {
  let errors = {};

  if (!staff.email) {
    errors.email = "Email là bắt buộc";
  } else if (!/\S+@\S+\.\S+/.test(staff.email)) {
    errors.email = "Email không hợp lệ";
  }
  if (!staff.fullname) {
    errors.fullname = "Họ tên là bắt buộc";
  } else if (!/^[A-Za-z]+/.test(staff.username.trim())) {
    errors.username = "Nhập vào tên hợp lệ";
  }
  if (!staff.phone) {
    errors.phone = "Số điện thoại là bắt buộc";
  }
  if (!staff.address) {
    errors.address = "Địa chỉ là bắt buộc";
  }
  var date_regex =
    /(0[1-9]|[12][0-9]|3[01])[- /.](0[1-9]|1[012])[- /.](19|20)\d\d/;
  const date = formatDate(staff.birthday);
  if (!date_regex.test(date)) {
    console.log(formatDate(staff.birthday));
    errors.birthday = "Ngày không hợp lệ";
  }
  return errors;
}