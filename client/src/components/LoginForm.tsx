import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { useMutation } from '@apollo/client';
import { LOGIN_USER } from '../utils/mutations';
import Auth from '../utils/auth';

interface LoginFormProps {
  handleModalClose: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ handleModalClose }) => {
  const [userFormData, setUserFormData] = useState({ email: '', password: '' });
  const [validated, setValidated] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  const [login, { error }] = useMutation(LOGIN_USER);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setUserFormData({ ...userFormData, [name]: value });
  };

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;

    if (form.checkValidity() === false) {
      event.stopPropagation();
    } else {
      try {
        const { data } = await login({
          variables: { ...userFormData },
        });

        if (data?.login?.token) {
          Auth.login(data.login.token);
          handleModalClose();
        } else {
          setShowAlert(true);
        }
      } catch (err) {
        console.error('Login error:', err);
        setShowAlert(true);
      }
    }

    setValidated(true);
    setUserFormData({
      email: '',
      password: '',
    });
  };

  return (
    <>
      <Form noValidate validated={validated} onSubmit={handleFormSubmit}>
        {showAlert && (
          <Alert dismissible onClose={() => setShowAlert(false)} show={showAlert} variant="danger">
            Something went wrong with your login credentials!
          </Alert>
        )}

        <Form.Group className="mb-3">
          <Form.Label htmlFor="login-email">Email</Form.Label>
          <Form.Control
            type="email"
            placeholder="Your email"
            name="email"
            id="login-email"
            onChange={handleInputChange}
            value={userFormData.email}
            required
          />
          <Form.Control.Feedback type="invalid">Email is required!</Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label htmlFor="login-password">Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Your password"
            name="password"
            id="login-password"
            onChange={handleInputChange}
            value={userFormData.password}
            required
          />
          <Form.Control.Feedback type="invalid">Password is required!</Form.Control.Feedback>
        </Form.Group>

        <Button disabled={!(userFormData.email && userFormData.password)} type="submit" variant="success">
          Submit
        </Button>

        {error && (
          <div className="text-danger mt-3">
            Login failed. Please check your credentials.
          </div>
        )}
      </Form>
    </>
  );
};

export default LoginForm;
