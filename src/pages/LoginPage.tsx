import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Button, Row, Col, Alert } from 'react-bootstrap';
import api from '../api'; // Use our new api client
import { useAuth } from '../context/AuthContext';
import FormContainer from '../components/FormContainer';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);

    const navigate = useNavigate();
    const { auth, setAuth } = useAuth();

    useEffect(() => {
        if (auth?.user) {
            navigate('/');
        }
    }, [auth, navigate]);

    const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const { data } = await api.post('/auth/login', { email, password });
            if (data.success) {
                // The response from the API contains the user object and the initial accessToken
                setAuth({ user: data.data.user, accessToken: data.data.accessToken });
                navigate('/');
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'An error occurred');
        }
    };

    return (
        <FormContainer>
            <h1>Sign In</h1>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form onSubmit={submitHandler}>
                {/* Form fields remain the same */}
                <Form.Group controlId="email" className="my-3">
                    <Form.Label>Email Address</Form.Label>
                    <Form.Control type="email" placeholder="Enter email" value={email} onChange={(e) => setEmail(e.target.value)}></Form.Control>
                </Form.Group>
                <Form.Group controlId="password" className="my-3">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" placeholder="Enter password" value={password} onChange={(e) => setPassword(e.target.value)}></Form.Control>
                </Form.Group>
                <Button type="submit" variant="primary" className="mt-3">Sign In</Button>
            </Form>
            <Row className="py-3">
                <Col>New Customer? <Link to={'/register'}>Register</Link></Col>
            </Row>
        </FormContainer>
    );
};

export default LoginPage;