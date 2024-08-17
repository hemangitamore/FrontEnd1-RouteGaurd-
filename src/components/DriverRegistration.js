import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { registerDriver } from '../services/user-services';
import 'bootstrap/dist/css/bootstrap.min.css';

const DriverRegistration = () => {
    const [rowData, setRowData] = React.useState([]);

    // Validation schema using Yup
    const validationSchema = Yup.object().shape({
        phoneNumber: Yup.string()
            .required('Phone Number is required')
            .matches(/^[0-9]{10}$/, 'Phone Number must be exactly 10 digits'),
        adharNumber: Yup.string()
            .required('Aadhar Number is required')
            .matches(/^[0-9]{12}$/, 'Aadhar Number must be exactly 12 digits'),
        panNumber: Yup.string()
            .required('PAN Number is required')
            .matches(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, 'Invalid PAN Number format'),
        driverName: Yup.string()
            .required('Driver Name is required')
            .matches(/^[a-zA-Z\s]+$/, 'Driver Name must contain only letters and spaces'),
        dob: Yup.date()
            .required('Date of Birth is required')
            .max(new Date(), 'Date of Birth cannot be in the future'),
        address: Yup.string().required('Address is required'),
        nationality: Yup.string().required('Nationality is required'),
    });

    const handleSubmit = async (values, { resetForm }) => {
        try {
            const data = await registerDriver(values);
            console.log('Driver registered successfully:', data);
            alert('Driver registered successfully!');

            setRowData([...rowData, values]);

            resetForm();
        } catch (error) {
            console.error('There was an error registering the driver:', error);
            alert('There was an error registering the driver. Please try again.');
        }
    };

    const columnDefs = [
        { headerName: 'Phone Number', field: 'phoneNumber' },
        { headerName: 'Aadhar Number', field: 'adharNumber' },
        { headerName: 'PAN Number', field: 'panNumber' },
        { headerName: 'Driver Name', field: 'driverName' },
        { headerName: 'Date of Birth', field: 'dob' },
        { headerName: 'Address', field: 'address' },
        { headerName: 'Nationality', field: 'nationality' },
    ];

    return (
        <div className="container mt-4">
            <div className="card">
                <div className="card-header">
                    <h2>Driver Registration</h2>
                </div>
                <div className="card-body">
                    <Formik
                        initialValues={{
                            phoneNumber: '',
                            adharNumber: '',
                            panNumber: '',
                            driverName: '',
                            dob: '',
                            address: '',
                            nationality: '',
                            createdBy: 'admin',
                            modifiedBy: 'admin',
                        }}
                        validationSchema={validationSchema}
                        onSubmit={handleSubmit}
                    >
                        {({ isSubmitting }) => (
                            <Form>
                                <div className="mb-3">
                                    <label className="form-label">Phone Number:</label>
                                    <Field type="text" name="phoneNumber" className="form-control" />
                                    <ErrorMessage name="phoneNumber" component="div" className="text-danger" />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Aadhar Number:</label>
                                    <Field type="text" name="adharNumber" className="form-control" />
                                    <ErrorMessage name="adharNumber" component="div" className="text-danger" />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">PAN Number:</label>
                                    <Field type="text" name="panNumber" className="form-control" />
                                    <ErrorMessage name="panNumber" component="div" className="text-danger" />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Driver Name:</label>
                                    <Field type="text" name="driverName" className="form-control" />
                                    <ErrorMessage name="driverName" component="div" className="text-danger" />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Date of Birth:</label>
                                    <Field type="date" name="dob" className="form-control" />
                                    <ErrorMessage name="dob" component="div" className="text-danger" />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Address:</label>
                                    <Field type="text" name="address" className="form-control" />
                                    <ErrorMessage name="address" component="div" className="text-danger" />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Nationality:</label>
                                    <Field type="text" name="nationality" className="form-control" />
                                    <ErrorMessage name="nationality" component="div" className="text-danger" />
                                </div>
                                <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                                    Register Driver
                                </button>
                            </Form>
                        )}
                    </Formik>
                </div>
            </div>
          
        </div>
    );
};

export default DriverRegistration;
