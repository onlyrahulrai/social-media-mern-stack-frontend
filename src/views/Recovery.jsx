import React from "react";
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
import { resetPasswordValidation } from "../helper/validate";
import {useAuthStore} from "../store/store"
import { resetPassword } from "../helper/helper";
import { toast } from "react-hot-toast";
import {useNavigate} from "react-router-dom"

const Recovery = () => {
  const {username} = useAuthStore((state) => state.auth)
  const navigate = useNavigate()

  const formik = useFormik({
    initialValues:{
      password:"",
      confirm_password:"",
      username
    },
    validate:resetPasswordValidation,
    validateOnBlur:false,
    validateOnChange:false,
    onSubmit:async (values) => {
      const {confirm_password,...rest} = values; 
      const recoveryPromise = resetPassword(rest)

      toast.promise(recoveryPromise,{
        loading:"Checking...",
        success:<b>Reset Successfully...</b>,
        error:<b>Couldn't reset the password</b>
      })

      recoveryPromise.then((result) => {
        navigate('/login')
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
            <h3 className="text-center py-3">Recover Password </h3>
            <Form onSubmit={formik.handleSubmit}>
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
              <FormGroup>
                <Label for="password">Confirm Password</Label>
                <Input
                  type="password"
                  name="confirm_password"
                  placeholder="********"
                  required
                  {...formik.getFieldProps("confirm_password")}
                />
              </FormGroup>

              <div className="d-grid gap-2">
                <Button type="submit" color="primary">
                  Recover
                </Button>
              </div>
            </Form>
          </CardBody>
        </Card>
      </div>
    </React.Fragment>
  );
};

export default Recovery;
