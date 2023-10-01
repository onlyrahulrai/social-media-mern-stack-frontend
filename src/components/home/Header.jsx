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
  ChatBubbleOvalLeftIcon,
} from "@heroicons/react/24/outline";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import axiosInstance from "../../api/base";
import { useAuthStore } from "../../store/store";
import useDebounceState from "../../hooks/useDebounceState";
import UserAvatar from "../common/UserAvatar";

function Header(args) {
  const [isOpen, setIsOpen] = useState(false);
  const { auth } = useAuthStore((state) => state);
  const [state, setState] = useDebounceState();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const toggle = () => setIsOpen(!isOpen);

  const logout = () => {
    Promise.resolve(localStorage.removeItem("authTokens"))
      .then(() => {
        axiosInstance.deauthorize();
        window.location.reload();
      })
  };

  const onChange = (e) =>
    setState((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));

  useEffect(() => {
    if (![...searchParams.keys()].length) {
      setState({})
    }
  }, [searchParams, setSearchParams])

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
                name="search"
                value={state?.search || ""}
                onChange={onChange}
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
              <NavItem className="mx-1" onClick={() => navigate("/chat")}>
                <ChatBubbleOvalLeftIcon
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
                  <UserAvatar user={auth} />
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
