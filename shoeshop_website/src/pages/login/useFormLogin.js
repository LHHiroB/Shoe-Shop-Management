import { useState, useEffect } from "react";
const useFormLogin = (callback, validate) => {
  const [user, setUser] = useState({
    username: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  useEffect(() => {
    console.log(errors);

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
    console.log("handle Submit run");
    //check program whether have error or not, if have error then setError
    //if no error then submit form
    e.preventDefault();
    setIsSubmiting(true);
    //validate(values)
    setErrors(validate(user));
  };

  return { handleChange, handleSubmit, user, errors };
};
export default useFormLogin;
