import formatDate from "../../../utils/formatDate";
export default function validateProduct(product) {
  let errors = {};

  if (!product.name?.trim()) {
    errors.name = "Sản phẩm không được trống";
  }
  if (product.originPrice <= 0) {
    errors.originPrice = "Giá nhập hàng phải lớn hơn 0";
  }
  if (product.costPrice <= 0) {
    errors.costPrice = "Giá vốn phải lớn hơn 0";
  }
  if (product.salePrice <= 0) {
    errors.salePrice = "Giá bán phải lớn hơn 0";
  }

  if (product.discount < 0) {
    errors.color = "Khuyến mãi phải lớn hơn 0";
  }

  return errors;
}