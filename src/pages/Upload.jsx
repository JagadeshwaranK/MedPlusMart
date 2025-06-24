import React from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { AiOutlineCloudUpload } from 'react-icons/ai';

const Upload = () => {
  return (
    <Container className="mt-md-5">
      <Row className="upload">
        <Col md={7} className="mt-5">
          <h4 className="fw-bold">Upload your prescription to start ordering</h4>
          <p>Please ensure that the prescription is valid and contains doctor, patient and medicine details.</p>
          <Form>
            <Form.Group controlId="formFile" className="mb-3">
              <Form.Label>Upload Prescription</Form.Label>
              <Form.Control type="file" />
            </Form.Group>
            <Button variant="primary" type="submit">
              <AiOutlineCloudUpload /> Upload
            </Button>
          </Form>
          <hr className='mt-md-5' />
          <div className='mt-md-5'>
            <h5>Pharmacist call <span className="text-success">Free</span></h5>
            <p>Our pharmacist will call to confirm the medicines in your prescription</p>
          </div>
        </Col>
        <Col md={5} className="align-center">
          <img src="/src/assets/logo.jpeg" alt="Prescription Image" className="img-fluid" />
        </Col>
      </Row>
    </Container>
  );
};

export default Upload;