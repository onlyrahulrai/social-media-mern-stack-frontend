import React from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import {
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  Card,
  CardBody,
} from "reactstrap";
import { useAuthStore } from "../store/store";
import {useFormik} from "formik";
import {toast} from "react-hot-toast";
import { generateOTP } from "../helper/helper";
import { usernameValidate } from "../helper/validate";

const Reset = () => {
  const navigate = useNavigate();
  const {setUsername}  = useAuthStore()

  const formik = useFormik({
    initialValues:{
      username:""
    },
    validate:usernameValidate,
    validateOnBlur:false,
    validateOnChange:false,
    onSubmit:async (values) => {
      const resetPromise = generateOTP(values.username);

      toast.promise(resetPromise,{
        loading:"Checking...",
        success:<b>OTP send on your mail successfully</b>,
        error:<b>User isn't register</b>
      })
      
      resetPromise.then((result) => {
        setUsername(values.username);
        navigate('/verify-otp')
      })
    }
  })

  return (
    <React.Fragment>
      <div
        className="d-flex justify-content-center align-items-center shadow-lg"
        style={{ height: "100vh" }}
      >
        <Card style={{ width: "428px" }}>
          <CardBody>
            <h3 className="text-center py-3">Reset Password</h3>
            <Form onSubmit={formik.handleSubmit}>
              <FormGroup>
                <Label for="username">Username</Label>
                <Input
                  type="text"
                  name="username"
                  id="username"
                  placeholder="john"
                  {...formik.getFieldProps("username")}
                />
              </FormGroup>

              <div className="d-grid gap2">
                <Button
                  type="submit"
                  color="primary"
                >
                  Reset
                </Button>
              </div>

              <div className="line">
                <span className="line-text">Or</span>
              </div>

              <div className="text-center">
                <Link to="/login" className="text-decoration-none">
                  Back to login
                </Link>
              </div>
            </Form>
          </CardBody>
        </Card>
      </div>
    </React.Fragment>
  );
};

export default Reset;
