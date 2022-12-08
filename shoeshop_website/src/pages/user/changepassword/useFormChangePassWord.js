import { useState, useEffect } from "react";
const useFormChangePassWord = (callback, user, setUser, validate) => {
  const [errors, setErrors] = useState({});
  useEffect(() => {
    //Validate Success
    if (isSubmitting && Object.keys(errors).length === 0) {
      callback();
    }
  }, [errors]);
  const [isSubmitting, setIsSubmiting] = useState(false);
  const handleChange = (e) => {
    const { name, value } = e.target;

    setUser((prev) => {
      return { ...prev, [name]: value };
    });
  };

  const handleSubmit = (e) => {
    //check program whether have error or not, if have error then setError
    //if no error then submit form
    e.preventDefault();
    setIsSubmiting(true);
    //validate(values)
    setErrors(validate(user));
  };

  return { handleChange, handleSubmit, errors };
};
export default useFormChangePassWord;
