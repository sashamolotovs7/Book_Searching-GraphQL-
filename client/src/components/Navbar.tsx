// src/components/Navbar.tsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Nav, Container, Modal, Tab } from 'react-bootstrap';
import SignUpForm from './SignupForm';
import LoginForm from './LoginForm';
import Auth from '../utils/auth';

const AppNavbar: React.FC = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container fluid>
          {/* Brand that links to the home page */}
          <Navbar.Brand as={Link} to="/">
            Google Books Search
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="navbar" />
          <Navbar.Collapse id="navbar" className="d-flex flex-row-reverse">
            <Nav className="ml-auto d-flex">
              {/* Link to the search books page */}
              <Nav.Link as={Link} to="/">
                Search For Books
              </Nav.Link>
              {/* Conditional rendering based on authentication status */}
              {Auth.loggedIn() ? (
                <>
                  <Nav.Link as={Link} to="/saved">
                    See Your Books
                  </Nav.Link>
                  <Nav.Link onClick={Auth.logout}>Logout</Nav.Link>
                </>
              ) : (
                <Nav.Link onClick={() => setShowModal(true)}>Login/Sign Up</Nav.Link>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Modal for Login/Signup */}
      <Modal size="lg" show={showModal} onHide={() => setShowModal(false)} aria-labelledby="signup-modal">
        <Tab.Container defaultActiveKey="login">
          <Modal.Header closeButton>
            <Modal.Title id="signup-modal">
              <Nav variant="pills">
                <Nav.Item>
                  <Nav.Link eventKey="login">Login</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="signup">Sign Up</Nav.Link>
                </Nav.Item>
              </Nav>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Tab.Content>
              <Tab.Pane eventKey="login">
                {/* Login Form Component */}
                <LoginForm handleModalClose={() => setShowModal(false)} />
              </Tab.Pane>
              <Tab.Pane eventKey="signup">
                {/* Signup Form Component */}
                <SignUpForm handleModalClose={() => setShowModal(false)} />
              </Tab.Pane>
            </Tab.Content>
          </Modal.Body>
        </Tab.Container>
      </Modal>
    </>
  );
};

export default AppNavbar;
