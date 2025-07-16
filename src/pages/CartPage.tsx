import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Row, Col, ListGroup, Image, Button, Card, Alert, Form } from 'react-bootstrap';
import { useCart } from '../context/CartContext';

const CartPage = () => {
    const navigate = useNavigate();
    const { cartItems, updateQuantity, removeFromCart } = useCart();

    const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
    const totalPrice = cartItems.reduce((acc, item) => acc + item.quantity * item.price, 0).toFixed(2);

    const checkoutHandler = () => {
        // Later, this will redirect to a shipping/payment page
        navigate('/login?redirect=/shipping');
    };

    return (
        <Row>
            <Col md={8}>
                <h1>Shopping Cart</h1>
                {cartItems.length === 0 ? (
                    <Alert variant="info">
                        Your cart is empty <Link to="/">Go Back</Link>
                    </Alert>
                ) : (
                    <ListGroup variant="flush">
                        {cartItems.map(item => (
                            <ListGroup.Item key={item._id}>
                                <Row className="align-items-center">
                                    <Col md={2}>
                                        <Image src={item.imageUrl} alt={item.name} fluid rounded />
                                    </Col>
                                    <Col md={3}>
                                        <Link to={`/product/${item._id}`}>{item.name}</Link>
                                    </Col>
                                    <Col md={2}>${item.price}</Col>
                                    <Col md={2}>
                                        <Form.Control
                                            as="select"
                                            value={item.quantity}
                                            onChange={(e) => updateQuantity(item._id, Number(e.target.value))}
                                        >
                                            {[...Array(item.stock).keys()].map((x) => (
                                                <option key={x + 1} value={x + 1}>
                                                    {x + 1}
                                                </option>
                                            ))}
                                        </Form.Control>
                                    </Col>
                                    <Col md={2}>
                                        <Button
                                            type="button"
                                            variant="light"
                                            onClick={() => removeFromCart(item._id)}
                                        >
                                            <i className="fas fa-trash"></i>
                                        </Button>
                                    </Col>
                                </Row>
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                )}
            </Col>
            <Col md={4}>
                <Card>
                    <ListGroup variant="flush">
                        <ListGroup.Item>
                            <h2>Subtotal ({totalItems}) items</h2>
                            ${totalPrice}
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <Button
                                type="button"
                                className="w-100"
                                disabled={cartItems.length === 0}
                                onClick={checkoutHandler}
                            >
                                Proceed To Checkout
                            </Button>
                        </ListGroup.Item>
                    </ListGroup>
                </Card>
            </Col>
        </Row>
    );
};

export default CartPage;