import React from 'react';
import { NavLink } from 'react-router-dom';
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css'; // Ensure Bootstrap CSS is imported

const NavLinks = () => {
  return (
    <Navbar bg="light" expand="lg" className="shadow-sm">
      <Navbar.Brand as={NavLink} to="/" className="font-weight-bold">RouteGaurd</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="ml-auto">
          <Nav.Link as={NavLink} exact to="/" activeClassName="active">
            Home
          </Nav.Link>
          <Nav.Link as={NavLink} to="/about" activeClassName="active">
            About
          </Nav.Link>
          <Nav.Link as={NavLink} to="/service" activeClassName="active">
            Services
          </Nav.Link>
         
          <Nav.Link as={NavLink} to="/contact" activeClassName="active">
            Contact
          </Nav.Link>
          
          <NavDropdown title="Login" id="Login-dropdown">
            <NavDropdown.Item as={NavLink} to="/superAdmin/login">
              SuperAdminLogin
            </NavDropdown.Item>
            <NavDropdown.Item as={NavLink} to="/Admin/login">
              AdminLogin
            </NavDropdown.Item>
          </NavDropdown>

          

          <NavDropdown title="Registration" id="registration-dropdown">
            <NavDropdown.Item as={NavLink} to="/customer/register">
              Customer Registration
            </NavDropdown.Item>
            <NavDropdown.Item as={NavLink} to="/driver/register">
              Driver Registration
            </NavDropdown.Item>
          </NavDropdown>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default NavLinks;


