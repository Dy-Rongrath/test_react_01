import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Row, Col, Image, ListGroup, Card, Button, Spinner, Alert, Form } from 'react-bootstrap';
import { useCart } from '../context/CartContext';

interface Product {
    _id: string;
    name: string;
    description: string;
    price: number;
    imageUrl: string;
    stock: number;
}

const ProductPage = () => {
    const { id: productId } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [product, setProduct] = useState<Product | null>(null);
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const { addToCart } = useCart();

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const { data } = await axios.get<Product>(`http://localhost:5000/api/products/${productId}`);
                setProduct(data);
            } catch (err) {
                setError('Product not found.');
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [productId]);

    const addToCartHandler = () => {
        if (product) {
            addToCart(product, quantity);
            navigate('/cart');
        }
    };

    if (loading) return <Spinner animation="border" />;
    if (error || !product) return <Alert variant="danger">{error || 'Product not found'}</Alert>;

    return (
        <>
            <Link className="btn btn-light my-3" to="/">
                Go Back
            </Link>
            <Row>
                <Col md={5}>
                    <Image src={product.imageUrl} alt={product.name} fluid />
                </Col>
                <Col md={4}>
                    <ListGroup variant="flush">
                        <ListGroup.Item>
                            <h3>{product.name}</h3>
                        </ListGroup.Item>
                        <ListGroup.Item>Price: ${product.price}</ListGroup.Item>
                        <ListGroup.Item>Description: {product.description}</ListGroup.Item>
                    </ListGroup>
                </Col>
                <Col md={3}>
                    <Card>
                        <ListGroup variant="flush">
                            <ListGroup.Item>
                                <Row>
                                    <Col>Price:</Col>
                                    <Col><strong>${product.price}</strong></Col>
                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col>Status:</Col>
                                    <Col>{product.stock > 0 ? 'In Stock' : 'Out Of Stock'}</Col>
                                </Row>
                            </ListGroup.Item>

                            {product.stock > 0 && (
                                <ListGroup.Item>
                                    <Row>
                                        <Col>Qty</Col>
                                        <Col>
                                            <Form.Control
                                                as="select"
                                                value={quantity}
                                                onChange={(e) => setQuantity(Number(e.target.value))}
                                            >
                                                {[...Array(product.stock).keys()].map((x) => (
                                                    <option key={x + 1} value={x + 1}>
                                                        {x + 1}
                                                    </option>
                                                ))}
                                            </Form.Control>
                                        </Col>
                                    </Row>
                                </ListGroup.Item>
                            )}

                            <ListGroup.Item>
                                <Button
                                    className="w-100"
                                    type="button"
                                    disabled={product.stock === 0}
                                    onClick={addToCartHandler}
                                >
                                    Add To Cart
                                </Button>
                            </ListGroup.Item>
                        </ListGroup>
                    </Card>
                </Col>
            </Row>
        </>
    );
};

export default ProductPage;