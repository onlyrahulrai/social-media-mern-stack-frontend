import dayjs from "dayjs";
import toast from "react-hot-toast";
import jwt_decode from "jwt-decode";
import { authenticate } from "./helper";

export const usernameValidate = async (values) => {
  const errors = usernameVerify({}, values);

  if (values.username) {
    const { status } = await authenticate(values.username);

    if (status !== 200) {
      errors.exist = toast.error("User does not exist...!");
    }
  }

  return errors;
};

export const passwordValidate = (values) => {
  const errors = passwordVerify({}, values);

  return errors;
};

export const loginValidate = (values) => {
  let errors = usernameValidate(values);
  passwordVerify(errors, values);
  return errors;
};

export const registerValidate = (values) => {
  let errors = usernameVerify({}, values);
  emailVerify(errors, values);
  passwordVerify(errors, values);

  return errors;
};

export const profileValidation = (values) => {
  const errors = usernameValidate(values);
  emailVerify(errors, values);

  return errors;
};

export const resetPasswordValidation = (values) => {
  const errors = passwordVerify({}, values);

  if (values.password !== values.confirm_password) {
    errors.exist = toast.error("Password not match...!");
  }
};

/** ************************************************* */
// Validate Password
export const passwordVerify = (errors = {}, values) => {
  const specialChars = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;

  if (!values.password) {
    errors.password = toast.error("Password Required...");
  } else if (values.password.includes(" ")) {
    errors.password = toast.error("Wrong Password...!");
  } else if (values.password.length < 4) {
    errors.password = toast.error(
      "Password must be more than 4 characters long"
    );
  } else if (!specialChars.test(values.password)) {
    errors.password = toast.error("Password must have special character");
  }

  return errors;
};

// Validate username
export const usernameVerify = (errors = {}, values) => {
  if (!values.username) {
    errors.username = toast.error("Username Required...!");
  } else if (values.username.includes(" ")) {
    errors.username = toast.error("Invalid Username...!");
  }

  return errors;
};

// validate email
export const emailVerify = (errors = {}, values) => {
  if (!values.email) {
    errors.email = toast.error("Email Required!");
  } else if (values.email.includes(" ")) {
    errors.email = toast.error("Wrong Email...!");
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
    errors.email = toast.error("Invalid email address...!");
  }

  return errors;
};

export const isAuthTokenExpired = (token) => {
  const decoded = jwt_decode(token);
  return dayjs.unix(decoded.exp).diff(dayjs()) < 1;
};
