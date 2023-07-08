import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  Card,
  CardBody,
} from "reactstrap";
import { loginValidate } from "../helper/validate";
import { useFormik } from "formik";
import { loginUser } from "../helper/helper";
import { toast } from "react-hot-toast";
import { useAuthStore } from "../store/store";
import axiosInstance from "../api/base";

const Login = () => {
  const {setAuth} = useAuthStore((state) => state);

  const formik = useFormik({
    initialValues: {
      username: "john",
      password: "john@1234",
    },
    validate: loginValidate,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: (values) => {
      let loginPromise = loginUser({
        username: values.username,
        password: values.password,
      });

      toast.promise(loginPromise, {
        loading: "Checking...",
        success: <b>Login Successfully...</b>,
        error: <b>Password Not Match!</b>,
      });

      loginPromise.then((res) => {
        let { access,refresh,...rest } = res.data;
 
        const setToken = Promise.resolve(localStorage.setItem("authTokens", JSON.stringify({access,refresh})))
        
        const setAuthorization = Promise.resolve(axiosInstance.authorize())

        Promise.all([setToken,setAuthorization])
        .then(() => {

          setAuth(rest)

          // navigate(location?.state ? `/${location?.state?.pathname}` : "/")
        })
      });
    },
  });

  return (
    <React.Fragment>
      <div
        className="d-flex justify-content-center align-items-center shadow-lg"
        style={{ height: "100vh" }}
      >
        <Card style={{ width: "428px" }}>
          <CardBody>
            <h3 className="text-center py-3">Login </h3>
            <Form onSubmit={formik.handleSubmit}>
              <FormGroup>
                <Label for="email">Username</Label>
                <Input
                  type="text"
                  name="username"
                  placeholder="john"
                  id="username"
                  required
                  {...formik.getFieldProps("username")}
                />
              </FormGroup>
              <FormGroup>
                <Label for="password">Password</Label>
                <Input
                  type="password"
                  name="password"
                  placeholder="********"
                  id="password"
                  required
                  {...formik.getFieldProps("password")}
                />
              </FormGroup>

              <div className="d-flex justify-content-between">
                <Button type="submit" color="primary">
                  Login
                </Button>

                <Link to="/reset" className="text-decoration-none">
                  Reset Password
                </Link>
              </div>

              <div className="line">
                <span className="line-text">Or</span>
              </div>

              <div className="text-center">
                Need an account?{" "}
                <Link to="/register" className="text-decoration-none">
                  Register
                </Link>
              </div>
            </Form>
          </CardBody>
        </Card>
      </div>
    </React.Fragment>
  );
};

export default Login;
