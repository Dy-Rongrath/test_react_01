import { useState, useEffect } from 'react';
import axios from 'axios';
import { Row, Col, Card, Spinner, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';

interface Product {
    _id: string;
    name: string;
    description: string;
    price: number;
    imageUrl: string;
}

const HomePage = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const { data } = await axios.get<Product[]>('http://localhost:5000/api/products');
                setProducts(data);
            } catch (err) {
                setError('Failed to fetch products.');
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    if (loading) return <Spinner animation="border" />;
    if (error) return <Alert variant="danger">{error}</Alert>;

    return (
        <Row>
            {products.map(product => (
                <Col key={product._id} sm={12} md={6} lg={4} xl={3} className="mb-4">
                    <Card className="h-100 shadow-sm">
                        <Link to={`/product/${product._id}`}>
                            <Card.Img variant="top" src={product.imageUrl} style={{ height: '200px', objectFit: 'cover' }} />
                        </Link>
                        <Card.Body className="d-flex flex-column">
                            <Card.Title as="div">
                                <Link to={`/product/${product._id}`} className="text-dark text-decoration-none">
                                    <strong>{product.name}</strong>
                                </Link>
                            </Card.Title>
                            <Card.Text as="h3" className="my-2">${product.price}</Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
            ))}
        </Row>
    );
};

export default HomePage;