import React, { useEffect, useState } from "react";
import {
  Collapse,
  Navbar,
  NavbarToggler,
  Nav,
  NavItem,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
} from "reactstrap";
import {
  HomeIcon,
  PencilSquareIcon,
  UserGroupIcon,
  BellIcon,
} from "@heroicons/react/24/outline";
import Avatar from "../../assets/profile.png";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../../api/base";
import { useAuthStore } from "../../store/store";
import { getImageUrl } from "../../helper/common";

function Header(args) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const { auth } = useAuthStore((state) => state);
  const navigate = useNavigate();

  const toggle = () => setIsOpen(!isOpen);

  const logout = () => {
    Promise.resolve(localStorage.removeItem("authTokens")).then(() => {
      axiosInstance.deauthorize();
      window.location.reload();
    });
  };

  return (
    <Navbar
      {...args}
      expand="lg"
      container="xl"
      className="shadow-sm sticky-top bg-light mb-4"
      id="header"
    >
      <Link to="/" className="navbar-brand">
        <div className="relative cursor-pointer">
          <h3 style={{ fontFamily: "cursive" }}>Toksi</h3>
        </div>
      </Link>
      <NavbarToggler onClick={toggle} />
      <Collapse isOpen={isOpen} navbar>
        <Nav className="mx-auto" navbar>
          <NavItem style={{ marginLeft: "72px" }}>
            <div className="input-group">
              <input
                className="form-control border rounded-pill"
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search..."
              />
            </div>
          </NavItem>
        </Nav>
        <Nav navbar className="d-flex align-items-center ml-auto">
          {auth ? (
            <>
              <NavItem className="mx-1" onClick={() => navigate("/")}>
                <HomeIcon
                  style={{ width: "1.5rem", height: "1.5rem" }}
                  className="cursor-pointer"
                />
              </NavItem>
              <NavItem className="mx-1">
                <div className="position-relative">
                  <PencilSquareIcon
                    style={{ width: "1.5rem", height: "1.5rem" }}
                    className="cursor-pointer"
                    onClick={() => navigate("/posts/create")}
                  />
                </div>
              </NavItem>
              <NavItem
                className="mx-1 position-relative cursor-pointer"
                onClick={() => navigate("/notifications")}
              >
                <BellIcon style={{ width: "1.5rem", height: "1.5rem" }} />

                {auth?.countOfNotification ? (
                  <span
                    className="rounded-circle bg-danger position-absolute d-flex align-items-center justify-content-center text-white"
                    style={{
                      width: "24px",
                      height: "24px",
                      top: "-12px",
                      left: "12px",
                    }}
                  >
                    {auth?.countOfNotification}
                  </span>
                ) : null}
              </NavItem>
              <NavItem
                className="mx-1 cursor-pointer"
                onClick={() => navigate(`/${auth?.username}/friends/?tab=1`)}
              >
                <UserGroupIcon style={{ width: "1.5rem", height: "1.5rem" }} />
              </NavItem>

              <UncontrolledDropdown nav inNavbar>
                <DropdownToggle nav caret>
                  <img
                    src={auth?.profile ? getImageUrl(auth?.profile) : Avatar}
                    alt=""
                    className="cursor-pointer"
                    style={{
                      width: "1.5rem",
                      height: "1.5rem",
                      borderRadius: "50%",
                    }}
                  />
                </DropdownToggle>
                <DropdownMenu>
                  <DropdownItem>
                    <Link
                      to={`/${auth?.username}`}
                      replace
                      className="text-decoration-none text-dark"
                    >
                      Profile
                    </Link>
                  </DropdownItem>
                  <DropdownItem onClick={logout}>Logout</DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>
            </>
          ) : (
            <>
              <NavItem className="mx-1">
                <Link
                  to="/register"
                  className="text-decoration-none btn btn-outline-primary"
                >
                  Register
                </Link>
              </NavItem>
              <NavItem className="mx-1">
                <Link
                  to="/login"
                  className="text-decoration-none btn btn-outline-primary"
                >
                  Login
                </Link>
              </NavItem>
            </>
          )}
        </Nav>
      </Collapse>
    </Navbar>
  );
}

export default Header;
