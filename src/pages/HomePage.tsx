import { useState, useEffect } from 'react';
import axios from 'axios';
import { Row, Col, Card, Spinner, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';

interface Product {
    _id: string;
    name: string;
    description: string;
    price: number;
    imageUrl?: string;
    imageUrls?: {
        original?: string;
        standard?: string;
        thumbnail?: string;
    };
}

const HomePage = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);


    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/products');
                // Handle API response with data.products
                const productsData = response.data?.data?.products;
                if (Array.isArray(productsData)) {
                    setProducts(productsData);
                } else {
                    setProducts([]);
                    setError('Invalid data format received from server.');
                }
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
            {Array.isArray(products) && products.length > 0 ? (
                products.map(product => {
                    // Prefer imageUrl, then imageUrls.standard, then imageUrls.original, then imageUrls.thumbnail
                    let imgSrc = product.imageUrl;
                    if (!imgSrc && product.imageUrls) {
                        imgSrc = product.imageUrls.standard || product.imageUrls.original || product.imageUrls.thumbnail;
                    }
                    return (
                        <Col key={product._id} sm={12} md={6} lg={4} xl={3} className="mb-4">
                            <Card className="h-100 shadow-sm">
                                <Link to={`/product/${product._id}`}>
                                    <Card.Img variant="top" src={imgSrc} style={{ height: '200px', objectFit: 'cover' }} />
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
                    );
                })
            ) : (
                <Col>
                    <Alert variant="info">No products found.</Alert>
                </Col>
            )}
        </Row>
    );
};

export default HomePage;