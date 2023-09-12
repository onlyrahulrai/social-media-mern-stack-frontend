import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  Card,
  CardBody,
} from "reactstrap";
import {useFormik} from "formik";
import { registerValidate } from "../helper/validate";
import { registerUser } from "../helper/helper";
import { toast } from "react-hot-toast";
import { useAuthStore } from "../store/store";

const Register = () => {
  const navigate = useNavigate();
  const {setAuth} = useAuthStore((state) => state);

  const formik = useFormik({
    initialValues:{
      firstName:"",
      lastName:"",
      username:"",
      email:"",
      password:""
    },
    validate:registerValidate,
    validateOnBlur:false,
    validateOnChange:false,
    onSubmit:async (values) => {
      let registerPromise = registerUser(values);

      toast.promise(registerPromise,{
        loading:"Creating...",
        success:<b>Register Successfully...!</b>,
        error:<b>Could Not Register</b>
      })

      registerPromise
      .then(({access,refresh,...rest}) => {
        setAuth(rest)
        localStorage.setItem('authTokens',JSON.stringify({access,refresh}))
        return navigate("/")
      })
    }
  })

  return (
    <React.Fragment>
      <div
        className="d-flex justify-content-center align-items-center shadow-lg"
        style={{ minHeight: "100vh" }}
      >
        <Card style={{ width: "428px" }}>
          <CardBody>
            <h3 className="text-center py-3">Register </h3>
            <Form onSubmit={formik.handleSubmit}>
              <FormGroup>
                <Label for="username">Firstname</Label>
                <Input
                  type="text"
                  name="firstName"
                  placeholder="John"
                  id="firstname"
                  {...formik.getFieldProps("firstName")}
                  required
                />
              </FormGroup>
              <FormGroup>
                <Label for="lastname">Lastname</Label>
                <Input
                  type="text"
                  name="lastname"
                  placeholder="Doe"
                  id="lastname"
                  {...formik.getFieldProps("lastName")}
                  required
                />
              </FormGroup>
              <FormGroup>
                <Label for="username">Username</Label>
                <Input
                  type="text"
                  name="username"
                  placeholder="john"
                  id="username"
                  {...formik.getFieldProps("username")}
                  required
                />
              </FormGroup>
              <FormGroup>
                <Label for="email">Email</Label>
                <Input
                  type="email"
                  name="email"
                  placeholder="john@gmail.com"
                  id="email"
                  {...formik.getFieldProps("email")}
                  required
                />
              </FormGroup>
              <FormGroup>
                <Label for="password">Password</Label>
                <Input
                  type="password"
                  name="password"
                  placeholder="********"
                  id="password"
                  {...formik.getFieldProps("password")}
                  required
                />
              </FormGroup>

              <div className="d-grid gap-2">
                <Button type="submit" color="primary btn-block ">
                  Sign up
                </Button>
              </div>

              <div className="line">
                <span className="line-text">Or</span>
              </div>

              <div className="text-center">
                Already have an account?{" "}
                <Link to="/login" className="text-decoration-none">
                  Login
                </Link>
              </div>
            </Form>
          </CardBody>
        </Card>
      </div>
    </React.Fragment>
  );
};

export default Register;
