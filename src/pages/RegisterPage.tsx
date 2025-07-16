import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Button, Row, Col, Alert } from 'react-bootstrap';
import axios from 'axios';
import FormContainer from '../components/FormContainer';

const RegisterPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const navigate = useNavigate();

    // A simple check for login status
    const userInfo = localStorage.getItem('userInfo');

    useEffect(() => {
        if (userInfo) {
            navigate('/'); // If logged in, redirect to home
        }
    }, [navigate, userInfo]);

    const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setMessage('Passwords do not match');
        } else {
            setMessage(null);
            try {
                const config = {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                };
                const { data } = await axios.post(
                    'http://localhost:5000/api/auth/register',
                    { name, email, password },
                    config
                );
                localStorage.setItem('userInfo', JSON.stringify(data));
                navigate('/');
            } catch (err: any) {
                setError(err.response?.data?.message || 'An error occurred');
            }
        }
    };

    return (
        <FormContainer>
            <h1>Sign Up</h1>
            {message && <Alert variant="danger">{message}</Alert>}
            {error && <Alert variant="danger">{error}</Alert>}
            <Form onSubmit={submitHandler}>
                <Form.Group controlId="name" className="my-3">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    ></Form.Control>
                </Form.Group>

                <Form.Group controlId="email" className="my-3">
                    <Form.Label>Email Address</Form.Label>
                    <Form.Control
                        type="email"
                        placeholder="Enter email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    ></Form.Control>
                </Form.Group>

                <Form.Group controlId="password" className="my-3">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type="password"
                        placeholder="Enter password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    ></Form.Control>
                </Form.Group>

                <Form.Group controlId="confirmPassword" className="my-3">
                    <Form.Label>Confirm Password</Form.Label>
                    <Form.Control
                        type="password"
                        placeholder="Confirm password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    ></Form.Control>
                </Form.Group>

                <Button type="submit" variant="primary" className="mt-3">
                    Register
                </Button>
            </Form>

            <Row className="py-3">
                <Col>
                    Have an Account? <Link to={'/login'}>Login</Link>
                </Col>
            </Row>
        </FormContainer>
    );
};

export default RegisterPage;