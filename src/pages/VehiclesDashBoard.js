import React, { useState, useEffect } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { addVehicle } from '../services/user-services'; // Make sure this service is defined
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
//import './VehicleDetails.css';

const vehicleSchema = Yup.object().shape({
    vehicleNumber: Yup.string().required('Vehicle number is required'),
    vehicleName: Yup.string().required('Vehicle name is required'),
    vehicleModelNumber: Yup.string().required('Vehicle model number is required'),
    puc: Yup.string().required('PUC is required'),
    accidentHistory: Yup.string().required('Accident history is required'),
    carryingCapacity: Yup.string().required('Carrying capacity is required'),
});

const VehicleDetails = () => {
    const [rowData, setRowData] = useState([]);
    const [selectedVehicle, setSelectedVehicle] = useState(null);

    const columns = [
        { headerName: 'Vehicle Number', field: 'vehicleNumber', sortable: true, filter: true },
        { headerName: 'Vehicle Name', field: 'vehicleName', sortable: true, filter: true },
        { headerName: 'Vehicle Model Number', field: 'vehicleModelNumber', sortable: true, filter: true },
        { headerName: 'PUC', field: 'puc', sortable: true, filter: true },
        { headerName: 'Accident History', field: 'accidentHistory', sortable: true, filter: true },
        { headerName: 'Carrying Capacity', field: 'carryingCapacity', sortable: true, filter: true },
        {
            headerName: 'Actions',
            field: 'actions',
            width: 200,
            cellRendererFramework: (params) => (
                <span className="actions">
                    <button onClick={() => handleEdit(params.data)}>Edit</button>
                    <button onClick={() => handleDelete(params.data)}>Delete</button>
                </span>
            ),
        },
    ];

    useEffect(() => {
        // Fetch vehicles from API (replace with actual API call)
        setRowData([
            {
                vehicleNumber: 'MH12AB1234',
                vehicleName: 'Tata Truck',
                vehicleModelNumber: 'T1234',
                puc: 'Valid',
                accidentHistory: 'None',
                carryingCapacity: '1000kg',
            },
        ]);
    }, []);

    const handleSubmit = (values, { resetForm }) => {
        if (selectedVehicle) {
            // Edit existing vehicle logic
            setRowData((prevData) =>
                prevData.map((vehicle) =>
                    vehicle.vehicleNumber === selectedVehicle.vehicleNumber ? values : vehicle
                )
            );
            setSelectedVehicle(null);
        } else {
            // Add new vehicle logic
            addVehicle(values)
                .then((newVehicle) => {
                    setRowData((prevData) => [...prevData, newVehicle]);
                })
                .catch((error) => {
                    console.error('Error adding vehicle:', error);
                    alert('Failed to add vehicle. Please try again.');
                });
        }
        resetForm();
    };

    const handleEdit = (vehicle) => {
        setSelectedVehicle(vehicle);
    };

    const handleDelete = (vehicle) => {
        if (window.confirm('Are you sure you want to delete this vehicle?')) {
            setRowData((prevData) =>
                prevData.filter((v) => v.vehicleNumber !== vehicle.vehicleNumber)
            );
        }
    };

    return (
        <div className="vehicle-details">
            <h2>Vehicle Details</h2>

            {/* Form Card */}
            <div className="form-card">
                <h3>{selectedVehicle ? 'Edit Vehicle' : 'Add Vehicle'}</h3>
                <Formik
                    initialValues={{
                        vehicleNumber: selectedVehicle?.vehicleNumber || '',
                        vehicleName: selectedVehicle?.vehicleName || '',
                        vehicleModelNumber: selectedVehicle?.vehicleModelNumber || '',
                        puc: selectedVehicle?.puc || '',
                        accidentHistory: selectedVehicle?.accidentHistory || '',
                        carryingCapacity: selectedVehicle?.carryingCapacity || '',
                    }}
                    validationSchema={vehicleSchema}
                    onSubmit={handleSubmit}
                    enableReinitialize
                >
                    {({ errors, touched }) => (
                        <Form>
                            <div className="form-group">
                                <label>Vehicle Number</label>
                                <Field name="vehicleNumber" />
                                {errors.vehicleNumber && touched.vehicleNumber ? (
                                    <div className="error">{errors.vehicleNumber}</div>
                                ) : null}
                            </div>
                            <div className="form-group">
                                <label>Vehicle Name</label>
                                <Field name="vehicleName" />
                                {errors.vehicleName && touched.vehicleName ? (
                                    <div className="error">{errors.vehicleName}</div>
                                ) : null}
                            </div>
                            <div className="form-group">
                                <label>Vehicle Model Number</label>
                                <Field name="vehicleModelNumber" />
                                {errors.vehicleModelNumber && touched.vehicleModelNumber ? (
                                    <div className="error">{errors.vehicleModelNumber}</div>
                                ) : null}
                            </div>
                            <div className="form-group">
                                <label>PUC</label>
                                <Field name="puc" />
                                {errors.puc && touched.puc ? (
                                    <div className="error">{errors.puc}</div>
                                ) : null}
                            </div>
                            <div className="form-group">
                                <label>Accident History</label>
                                <Field name="accidentHistory" />
                                {errors.accidentHistory && touched.accidentHistory ? (
                                    <div className="error">{errors.accidentHistory}</div>
                                ) : null}
                            </div>
                            <div className="form-group">
                                <label>Carrying Capacity</label>
                                <Field name="carryingCapacity" />
                                {errors.carryingCapacity && touched.carryingCapacity ? (
                                    <div className="error">{errors.carryingCapacity}</div>
                                ) : null}
                            </div>
                            <div className="form-group">
                                <button type="submit" className="submit-button">
                                    {selectedVehicle ? 'Update Vehicle' : 'Add Vehicle'}
                                </button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>

            {/* Table Card */}
            <div className="table-card">
                <div
                    className="ag-theme-alpine"
                    style={{ height: 400, width: '100%' }}
                >
                    <AgGridReact
                        columnDefs={columns}
                        rowData={rowData}
                        domLayout="autoHeight"
                        suppressRowClickSelection={true}
                    />
                </div>
            </div>
        </div>
    );
};

export default VehicleDetails;

