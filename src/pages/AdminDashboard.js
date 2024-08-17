// src/pages/AdminDashboard.js
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, Button } from 'react-bootstrap';

const AdminDashboard = () => {
    return (
        <div style={{ maxWidth: '800px', margin: 'auto', padding: '20px' }}>
            <h1>Admin Dashboard</h1>
            <div className="d-flex flex-column">
                <Card className="mb-3">
                    <Card.Body>
                        <Card.Title>Manage Vehicles</Card.Title>
                        <Card.Text>
                            View, add, update, and delete vehicle details.
                        </Card.Text>
                        <Link to="/VehiclesDashBoard">
                            <Button variant="primary">Manage Vehicles</Button>
                        </Link>
                    </Card.Body>
                </Card>
                <Card className="mb-3">
                    <Card.Body>
                        <Card.Title>Manage Drivers</Card.Title>
                        <Card.Text>
                            View, add, update, and delete driver details.
                        </Card.Text>
                        <Link to="/TripDashBoard">
                            <Button variant="primary">Manage Drivers</Button>
                        </Link>
                    </Card.Body>
                </Card>
                <Card className="mb-3">
                    <Card.Body>
                        <Card.Title>Manage Trips</Card.Title>
                        <Card.Text>
                            View, add, update, and delete trip details.
                        </Card.Text>
                        <Link to="/trips">
                            <Button variant="primary">Manage Trips</Button>
                        </Link>
                    </Card.Body>
                </Card>
            </div>
        </div>
    );
};

export default AdminDashboard;
