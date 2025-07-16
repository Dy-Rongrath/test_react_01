import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Navbar, Nav, NavDropdown, Badge } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { useCart } from '../context/CartContext';

const Header = () => {
    const navigate = useNavigate();
    const { cartItems } = useCart();
    const userInfoFromStorage = localStorage.getItem('userInfo');
    const userInfo = userInfoFromStorage ? JSON.parse(userInfoFromStorage) : null;

    const logoutHandler = () => {
        localStorage.removeItem('userInfo');
        navigate('/login');
    };

    const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

    return (
        <header>
            <Navbar bg="dark" variant="dark" expand="lg" collapseOnSelect>
                <Container>
                    <LinkContainer to="/">
                        <Navbar.Brand>My E-Commerce Store</Navbar.Brand>
                    </LinkContainer>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="ms-auto">
                            <LinkContainer to="/cart">
                                <Nav.Link>
                                    <i className="fas fa-shopping-cart"></i> Cart
                                    {totalItems > 0 && (
                                        <Badge pill bg="success" style={{ marginLeft: '5px' }}>
                                            {totalItems}
                                        </Badge>
                                    )}
                                </Nav.Link>
                            </LinkContainer>
                            {userInfo ? (
                                <NavDropdown title={userInfo.name} id="username">
                                    <LinkContainer to="/profile">
                                        <NavDropdown.Item>Profile</NavDropdown.Item>
                                    </LinkContainer>
                                    <NavDropdown.Item onClick={logoutHandler}>
                                        Logout
                                    </NavDropdown.Item>
                                </NavDropdown>
                            ) : (
                                <LinkContainer to="/login">
                                    <Nav.Link>
                                        <i className="fas fa-user"></i> Sign In
                                    </Nav.Link>
                                </LinkContainer>
                            )}
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </header>
    );
};

export default Header;
