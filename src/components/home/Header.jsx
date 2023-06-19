import React, { useState } from "react";
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
  HeartIcon,
  BellIcon,
} from "@heroicons/react/24/outline";
import Avatar from "../../assets/profile.png";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../../api/base";
import { useAuthStore } from "../../store/store";

function Example(args) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const { profile, username } = useAuthStore((state) => state.auth);
  const navigate = useNavigate();

  const toggle = () => setIsOpen(!isOpen);

  const logout = () => {
    Promise.resolve(localStorage.removeItem("authTokens")).then(() => {
      axiosInstance.deauthorize();
      window.location.reload();
    });
  };


  return (
    <div id="header">
      <Navbar {...args} expand="lg" container="xl">
        <Link to="/" className="navbar-brand">
          <div className="relative cursor-pointer">
            <h3 style={{ fontFamily: "cursive" }}>Toksi</h3>
          </div>
        </Link>
        <NavbarToggler onClick={toggle} />
        <Collapse isOpen={isOpen} navbar>
          <Nav className="mx-auto" navbar>
            <NavItem>
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
            <NavItem className="mx-1" onClick={() => navigate("/")}>
              <HomeIcon
                style={{ width: "1.5rem", height: "1.5rem" }}
                className="cursor-pointer"
              />
            </NavItem>
            {true ? (
              <>
                <NavItem className="mx-1">
                  <div className="relative">
                    <PencilSquareIcon
                      style={{ width: "1.5rem", height: "1.5rem" }}
                      className="cursor-pointer"
                      onClick={() => navigate("/posts/create")}
                    />
                  </div>
                </NavItem>
                <NavItem className="mx-1">
                  <BellIcon style={{ width: "1.5rem", height: "1.5rem" }} />
                </NavItem>
                <NavItem className="mx-1 cursor-pointer" onClick={() =>  navigate(`/${username}/friends/?tab=1`)}>
                  <UserGroupIcon
                    style={{ width: "1.5rem", height: "1.5rem" }}
                  />
                </NavItem>

                <UncontrolledDropdown nav inNavbar>
                  <DropdownToggle nav caret>
                    <img
                      src={profile || Avatar}
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
                        to={`/${username}`}
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
              <NavItem className="mx-1">
                <button>Sign In</button>
              </NavItem>
            )}
          </Nav>
        </Collapse>
      </Navbar>
    </div>
  );
}

export default Example;
