import React, { useState } from 'react';
import axios from 'axios';
import { Form, Button, Alert, Spinner } from 'react-bootstrap';
import FormContainer from '../components/FormContainer';

const ProductEditPage = () => {
    // State for the form fields
    const [name, setName] = useState('');
    const [price, setPrice] = useState(0);
    const [image, setImage] = useState(''); // This will hold the URL of the uploaded image
    const [description, setDescription] = useState('');

    // State for the upload process
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);

    const uploadFileHandler = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('image', file);
        setUploading(true);
        setUploadError(null);

        try {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            };

            const { data } = await axios.post('/api/upload', formData, config);

            // Set the image state to the path returned from the backend
            setImage(data.image);
            setUploading(false);
        } catch (error) {
            console.error(error);
            setUploadError('Image upload failed. Please try again.');
            setUploading(false);
        }
    };

    const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // Here you would call your API to create or update the product
        // using the 'name', 'price', 'description', and 'image' state values.
        console.log({ name, price, description, image });
        alert('Check the console for the product data to be submitted!');
    };

    return (
        <FormContainer>
            <h1>Edit Product</h1>
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

                {/* Other form fields like price, description, etc. go here */}

                <Form.Group controlId="image" className="my-3">
                    <Form.Label>Image</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter image url"
                        value={image}
                        onChange={(e) => setImage(e.target.value)}
                    ></Form.Control>
                    <Form.Control
                        type="file"
                        onChange={uploadFileHandler}
                    />
                    {uploading && <Spinner animation="border" size="sm" />}
                    {uploadError && <Alert variant="danger" className="mt-2">{uploadError}</Alert>}
                </Form.Group>

                <Button type="submit" variant="primary" className="mt-3">
                    Update Product
                </Button>
            </Form>
        </FormContainer>
    );
};

export default ProductEditPage;