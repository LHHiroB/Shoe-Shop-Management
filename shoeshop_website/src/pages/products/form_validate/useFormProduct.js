import { useState, useEffect } from "react";
const useFormProduct = (callback, product, setProduct, validate) => {
  const [errors, setErrors] = useState({});
  useEffect(() => {
    //Validate Success
    if (isSubmitting && Object.keys(errors).length === 0) {
      callback();
    }
  }, [errors]);
  const [isSubmitting, setIsSubmiting] = useState(false);
  const handleChange = (e) => {
    var { name, value } = e.target;

    if (
      name === "costPrice" ||
      name === "salePrice" ||
      name === "discount" ||
      name === "originPrice"
    ) {
      value = Math.floor(value);
    }

    if (name === "discount" && (value > 100 || value.length > 3)) {
      return;
    }
    if (e.target.validity.valid) {
      if (name === "costPrice")
        setProduct((prev) => {
          return {
            ...prev,
            [name]: value,
            salePrice: value - (prev.discount * value) / 100,
          };
        });
      else if (name === "discount")
        setProduct((prev) => {
          return {
            ...prev,
            [name]: value,
            salePrice: prev.costPrice - (value * prev.costPrice) / 100,
          };
        });
      else if (name === "salePrice")
        setProduct((prev) => {
          if (value <= prev.costPrice) {
            return {
              ...prev,
              [name]: value,
              discount: ((prev.costPrice - value) * 100) / prev.costPrice,
            };
          } else {
            return prev;
          }
        });
      else {
        setProduct((prev) => {
          return {
            ...prev,
            [name]: value,
          };
        });
      }
    }
  };

  const handleSubmit = (e) => {
    //check program whether have error or not, if have error then setError
    //if no error then submit form
    e.preventDefault();
    setIsSubmiting(true);
    //validate(values)
    setErrors(validate(product));
  };

  return { handleChange, handleSubmit, errors };
};
export default useFormProduct;