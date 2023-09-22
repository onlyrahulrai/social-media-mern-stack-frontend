import React, { useState } from "react";
import {
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  Card,
  CardBody,
  Row,
  Col,
} from "reactstrap";
import { useFormik } from "formik";
import { profileValidation } from "../helper/validate";
import { updateUser } from "../helper/helper";
import { toast } from "react-hot-toast";
import Avatar from "../assets/profile.png";
import { convertToBase64 } from "../helper/convert";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/store";
import { getImageUrl } from "../helper/common";

const Profile = () => {
  const [file, setFile] = useState(null);
  const [displayImage, setDisplayImage] = useState(null);
  const navigate = useNavigate();
  const { auth } = useAuthStore((state) => state);

  const formik = useFormik({
    initialValues: {
      firstName: auth?.firstName || "",
      lastName: auth?.lastName || "",
      mobile: auth?.mobile || "",
      address: auth?.address || "",
      username: auth?.username || "",
      email: auth?.email || "",
      bio: auth?.bio || "",
    },
    validate: profileValidation,
    validateOnBlur: false,
    validateOnChange: false,
    enableReinitialize: true,
    onSubmit: async (values) => {
      const formData = new FormData();

      formData.append("firstName", values?.firstName);
      formData.append("lastName", values?.lastName);
      formData.append("mobile", values?.mobile);
      formData.append("address", values?.address);
      formData.append("username", values?.username);
      formData.append("email", values?.email);
      formData.append("bio", values?.bio);

      if(file) {
        formData.append("profile", file);
      }

      const updatePromise = updateUser(formData);

      toast.promise(updatePromise, {
        loading: "Updating...",
        success: <b>Update Successfully</b>,
        error: <b>Could not Update!</b>,
      });
    },
  });

  const onUpload = (e) => {
    console.log(" Files  ", e.target.files[0]);
    Promise.resolve(setFile(e.target.files[0])).then(async () => {
      setDisplayImage(await convertToBase64(e.target.files[0]));
    });
  };

  return (
    <React.Fragment>
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "90vh" }}
      >
        <Card style={{ width: "428px" }} className="shadow-lg">
          <CardBody>
            <ArrowLeftIcon
              style={{ width: "1.5rem", height: "1.5rem" }}
              className="cursor-pointer"
              onClick={() => navigate(`/${auth?.username}`)}
            />
            <h3 className="text-center py-3">Update Profile </h3>
            <Form onSubmit={formik.handleSubmit}>
              <div className="w-100 d-flex justify-content-center my-3 cursor-pointer">

                <Label htmlFor="profile">
                  <img
                    src={
                      displayImage ? displayImage : auth?.profile ? getImageUrl(auth?.profile) : Avatar
                    }
                    alt="profile"
                    className="img-fluid object-fit"
                    width="98px"
                    height="98px"
                    style={{ borderRadius: "50%" }}
                  />
                </Label>
                <input
                  onChange={onUpload}
                  type="file"
                  id="profile"
                  name="profile"
                  hidden
                />
              </div>
              <Row>
                <Col md={6}>
                  <FormGroup>
                    <Label for="exampleEmail">First Name</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      placeholder="John"
                      type="text"
                      {...formik.getFieldProps("firstName")}
                    />
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    <Label for="examplePassword">Last Name</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      placeholder="Doe"
                      type="text"
                      {...formik.getFieldProps("lastName")}
                    />
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <FormGroup>
                    <Label for="username">Username</Label>
                    <Input
                      id="username"
                      name="username"
                      placeholder="john"
                      type="text"
                      {...formik.getFieldProps("username")}
                      disabled={auth?.username}
                    />
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    <Label for="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      placeholder="john@gmail.com"
                      type="email"
                      {...formik.getFieldProps("email")}
                      disabled={auth?.email}
                    />
                  </FormGroup>
                </Col>
              </Row>
              <FormGroup>
                <Label for="examplePassword">Mobile Number</Label>
                <Input
                  id="mobile"
                  name="mobile"
                  placeholder="+919648772088"
                  type="text"
                  {...formik.getFieldProps("mobile")}
                />
              </FormGroup>
              <FormGroup>
                <Label for="exampleAddress">Address</Label>
                <Input
                  id="exampleAddress"
                  name="address"
                  placeholder="1234 Main St"
                  {...formik.getFieldProps("address")}
                />
              </FormGroup>
              <FormGroup>
                <Label for="exampleAddress">Bio</Label>
                <Input
                  id="exampleAddress"
                  name="bio"
                  type="textarea"
                  placeholder="Write somthing about you..."
                  {...formik.getFieldProps("bio")}
                />
              </FormGroup>
              <div className="d-grid gap-2">
                <Button type="submit" color="danger">
                  Update
                </Button>
              </div>
            </Form>
          </CardBody>
        </Card>
      </div>
    </React.Fragment>
  );
};

export default Profile;
