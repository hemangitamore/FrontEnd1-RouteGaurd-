// src/pages/AdminDashboard.js
import React from "react";
import { Link } from "react-router-dom";
import { Card, Button } from "react-bootstrap";
import Layout from "../components/Layout/Layout";

const AdminDashboard = () => {
  return (
    <Layout>
      <div style={{ maxWidth: "800px", margin: "auto", padding: "20px" }}>
        <h3 >Admin Dashboard</h3>
        <div className="d-flex flex-row gap-5">
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Manage Vehicles</Card.Title>
              <Card.Text>
                View, add, update, and delete vehicle details.
              </Card.Text>
              <div className="d-flex justify-content-start">
                <Link to="/vehicles-dashBoard">
                  <Button variant="primary">Manage Vehicles</Button>
                </Link>{" "}
              </div>
            </Card.Body>
          </Card>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Manage Drivers</Card.Title>
              <Card.Text>
                View, add, update, and delete driver details.
              </Card.Text>
              <div className="d-flex justify-content-start">
              <Link to="/driver-details">
                <Button variant="primary">Manage Drivers</Button>
              </Link> </div>
            </Card.Body>
          </Card>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Manage Trips</Card.Title>
              <Card.Text>View, add, update, and delete trip details.</Card.Text>
              <div className="d-flex justify-content-start">
              <Link to="/trips">
                <Button variant="primary">Manage Trips</Button>
              </Link>
              </div>
            </Card.Body>
          </Card>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Manage Customers</Card.Title>
              <Card.Text>View, add, update, and delete trip details.</Card.Text>
              <div className="d-flex justify-content-start">
              <Link to="/CustomerDetails">
                <Button variant="primary">Manage Customers</Button>
              </Link>
              </div>
            </Card.Body>
          </Card>
          
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
