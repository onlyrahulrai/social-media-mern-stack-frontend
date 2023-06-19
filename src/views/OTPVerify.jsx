import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  FormText,
  Card,
  CardBody,
} from "reactstrap";
import { useAuthStore } from "../store/store";
import { generateOTP, verifyOTP } from "../helper/helper";
import { toast } from "react-hot-toast";


const OTPVerify = () => {
  const navigate = useNavigate();
  const {username} = useAuthStore((state) => state.auth);

  const [countDown, setCountDown] = useState(15);

  useEffect(() => {
    let interval = setInterval(() => {
      setCountDown((prevState) => {
        if (prevState === 1) {
          clearInterval(interval);
        }
        return prevState - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formik = useFormik({
    initialValues:{
      code:"",
      username
    },
    validateOnBlur:false,
    validateOnChange:false,
    onSubmit:async (values) => {

      let otpVerifyPromise = verifyOTP(values)

      toast.promise(otpVerifyPromise,{
        loading:"Checking...",
        success:"Verify Successfully!",
        error:"Wrong OTP! Check email again!"
      })

      otpVerifyPromise.then((result) => {
        navigate('/recovery')
      })
    }
  })

  const resendOTP = () => {
    let sendPromise = generateOTP(username);

    toast.promise(sendPromise, {
      loading: "Sending...",
      success: <b>OTP has been send to your email</b>,
      error: <b>Could not Send it</b>,
    });
  };

  return (
    <React.Fragment>
      <div
        className="d-flex justify-content-center align-items-center shadow-lg"
        style={{ height: "100vh" }}
      >
        <Card style={{ width: "428px" }}>
          <CardBody>
            <h3 className="text-center py-3">Verify OTP</h3>
            <Form onSubmit={formik.handleSubmit}>
              <FormGroup>
                <Label for="email">OTP</Label>
                <Input
                  type="text"
                  name="code"
                  placeholder="123456"
                  id="code"
                  required
                  {...formik.getFieldProps("code")}
                />
                <FormText>
                  Please enter 6 digits OTP sent to your email address.
                </FormText>
                <div className="d-flex justify-content-between my-1">
                  <div>
                    {countDown > 0 ? (
                      <span className="text-secondary text-sm">
                        Remaining time: {countDown} seconds
                      </span>
                    ) : (
                      <span className="text-secondary">
                        Time's up! Please resend the OTP.
                      </span>
                    )}
                  </div>
                  {countDown <= 0 && (
                    <span className="cursor-pointer text-warning" onClick={resendOTP}>
                      Resend OTP
                    </span>
                  )}
                </div>
              </FormGroup>

              <div className="d-grid gap2">
                <Button
                  type="submit"
                  color="primary"
                >
                  Verify OTP
                </Button>
              </div>
            </Form>
          </CardBody>
        </Card>
      </div>
    </React.Fragment>
  );
};

export default OTPVerify;
