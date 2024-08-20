import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
//import './TripDetails.css';
import Layout from '../components/Layout/Layout';

const tripSchema = Yup.object().shape({
    tripName: Yup.string()
        .required('Trip name is required'),
    destination: Yup.string()
        .required('Destination is required'),
    startDate: Yup.date()
        .min(new Date(), 'Start date cannot be in the past')
        .required('Start date is required'),
    endDate: Yup.date()
        .min(Yup.ref('startDate'), 'End date must be later than start date')
        .required('End date is required'),
    distance: Yup.number()
        .positive('Distance must be a positive number')
        .required('Distance is required'),
    status: Yup.string()
        .required('Status is required'),
    driver: Yup.number()
        .required('Driver is required'),
    vehicle: Yup.number()
        .required('Vehicle is required'),
});

const TripDetails = () => {
    const [rowData, setRowData] = useState([]);
    const [selectedTrip, setSelectedTrip] = useState(null);
    const [drivers, setDrivers] = useState([]);
    const [vehicles, setVehicles] = useState([]);
    const token = localStorage.getItem('jwtToken');

    useEffect(() => {
        // Fetch trips from API
        axios.get('http://localhost:8080/api/trips/getTrips', {
            headers: { 'Authorization': `Bearer ${token}` }
        })
            .then(response => setRowData(response.data))
            .catch(error => console.error('Error fetching trip data:', error));

        // Fetch drivers from API
        axios.get('http://localhost:8080/api/drivers/getDrivers', {
            headers: { 'Authorization': `Bearer ${token}` }
        })
            .then(response => setDrivers(response.data))
            .catch(error => console.error('Error fetching drivers:', error));

        // Fetch vehicles from API
        axios.get('http://localhost:8080/api/vehicles/GetVehicles', {
            headers: { 'Authorization': `Bearer ${token}` }
        })
            .then(response => setVehicles(response.data))
            .catch(error => console.error('Error fetching vehicles:', error));
    }, [token]);

    const columns = [
        { headerName: 'Trip Name', field: 'tripName', sortable: true, filter: true },
        { headerName: 'Destination', field: 'destination', sortable: true, filter: true },
        { headerName: 'Start Date', field: 'startDate', sortable: true, filter: true },
        { headerName: 'End Date', field: 'endDate', sortable: true, filter: true },
        { headerName: 'Distance', field: 'distance', sortable: true, filter: true },
        { headerName: 'Status', field: 'status', sortable: true, filter: true },
        { headerName: 'Driver', field: 'driverName', sortable: true, filter: true },
        { headerName: 'Vehicle', field: 'vehicleName', sortable: true, filter: true },
        {
            headerName: "Actions",
            width: 200,
            cellRenderer: (params) => {
                return (
                    <div className="actions d-flex justify-content-start gap-3">
                        <i
                            className="bi bi-pencil-fill"
                            onClick={() => handleEdit(params.data)}
                        ></i>
                        <i
                            className="bi bi-trash3-fill"
                            onClick={() => handleDelete(params.data)}
                        ></i>
                    </div>
                );
            },
        },
    ];

    const handleSubmit = (values, { resetForm }) => {
        if (selectedTrip) {
            // Update trip
            axios.put(`http://localhost:8080/api/trips/${selectedTrip.id}`, values, {
                headers: { 'Authorization': `Bearer ${token}` }
            })
                .then(response => {
                    setRowData(prevData =>
                        prevData.map(trip => trip.id === response.data.id ? response.data : trip)
                    );
                    setSelectedTrip(null);
                })
                .catch(error => console.error('Error updating trip:', error));
        } else {
            // Add new trip
            axios.post('http://localhost:8080/api/trips/postTrip', values, {
                headers: { 'Authorization': `Bearer ${token}` }
            })
                .then(response => setRowData(prevData => [...prevData, response.data]))
                .catch(error => console.error('Error adding trip:', error));
        }
        resetForm();
    };

    const handleEdit = (trip) => {
        setSelectedTrip(trip);
    };

    const handleDelete = (trip) => {
        if (window.confirm('Are you sure you want to delete this trip?')) {
            axios.delete(`http://localhost:8080/api/trips/${trip.id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            })
                .then(() => {
                    setRowData(prevData => prevData.filter(t => t.id !== trip.id));
                })
                .catch(error => console.error('Error deleting trip:', error));
        }
    };

    return (
        <Layout>
            <div className="trip-details">
                <h2>Trip Details</h2>

                {/* Form Card */}
                <div className="form-card">
                    <h3>{selectedTrip ? 'Edit Trip' : 'Add Trip'}</h3>
                    <Formik
                        initialValues={{
                            tripName: selectedTrip?.tripName || '',
                            destination: selectedTrip?.destination || '',
                            startDate: selectedTrip?.startDate || '',
                            endDate: selectedTrip?.endDate || '',
                            distance: selectedTrip?.distance || '',
                            status: selectedTrip?.status || '',
                            driver: selectedTrip?.driver?.id || '',
                            vehicle: selectedTrip?.vehicle?.id || '',
                        }}
                        validationSchema={tripSchema}
                        onSubmit={handleSubmit}
                        enableReinitialize
                    >
                        {({ setFieldValue }) => (
                            <Form>
                                <div className="form-group">
                                    <label htmlFor="tripName">Trip Name</label>
                                    <Field
                                        name="tripName"
                                        id="tripName"
                                        className="form-control"
                                    />
                                    <ErrorMessage name="tripName" component="div" className="error" />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="destination">Destination</label>
                                    <Field
                                        name="destination"
                                        id="destination"
                                        className="form-control"
                                    />
                                    <ErrorMessage name="destination" component="div" className="error" />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="startDate">Start Date</label>
                                    <Field
                                        name="startDate"
                                        id="startDate"
                                        type="date"
                                        className="form-control"
                                    />
                                    <ErrorMessage name="startDate" component="div" className="error" />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="endDate">End Date</label>
                                    <Field
                                        name="endDate"
                                        id="endDate"
                                        type="date"
                                        className="form-control"
                                    />
                                    <ErrorMessage name="endDate" component="div" className="error" />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="distance">Distance</label>
                                    <Field
                                        name="distance"
                                        id="distance"
                                        type="number"
                                        className="form-control"
                                    />
                                    <ErrorMessage name="distance" component="div" className="error" />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="status">Status</label>
                                    <Field
                                        name="status"
                                        id="status"
                                        className="form-control"
                                    />
                                    <ErrorMessage name="status" component="div" className="error" />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="driver">Driver</label>
                                    <Field
                                        as="select"
                                        name="driver"
                                        id="driver"
                                        className="form-control"
                                    >
                                        <option value="">Select Driver</option>
                                        {drivers.map(driver => (
                                            <option key={driver.id} value={driver.id}>
                                                {driver.driverName} {/* Assuming driver has a 'driverName' field */}
                                            </option>
                                        ))}
                                    </Field>
                                    <ErrorMessage name="driver" component="div" className="error" />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="vehicle">Vehicle</label>
                                    <Field
                                        as="select"
                                        name="vehicle"
                                        id="vehicle"
                                        className="form-control"
                                    >
                                        <option value="">Select Vehicle</option>
                                        {vehicles.map(vehicle => (
                                            <option key={vehicle.id} value={vehicle.id}>
                                                {vehicle.vehicleName} {/* Assuming vehicle has a 'vehicleName' field */}
                                            </option>
                                        ))}
                                    </Field>
                                    <ErrorMessage name="vehicle" component="div" className="error" />
                                </div>
                                <button type="submit" className="btn btn-primary">
                                    {selectedTrip ? 'Update Trip' : 'Add Trip'}
                                </button>
                            </Form>
                        )}
                    </Formik>
                </div>

                {/* AG Grid */}
                <div className="ag-theme-alpine" style={{ height: 400, width: '100%' }}>
                    <AgGridReact
                        rowData={rowData}
                        columnDefs={columns}
                        rowSelection="single"
                    />
                </div>
            </div>
        </Layout>
    );
};

export default TripDetails;







// import React, { useState, useEffect } from 'react';
// import { Formik, Form, Field, ErrorMessage } from 'formik';
// import * as Yup from 'yup';
// import axios from 'axios';
// import { AgGridReact } from 'ag-grid-react';
// import 'ag-grid-community/styles/ag-grid.css';
// import 'ag-grid-community/styles/ag-theme-alpine.css';
// //import './TripDetails.css';
// import Layout from '../components/Layout/Layout';

// const tripSchema = Yup.object().shape({
//     // Define validation schema for the trip entity
//     tripName: Yup.string()
//         .required('Trip name is required'),
//     destination: Yup.string()
//         .required('Destination is required'),
//     startDate: Yup.date()
//         .min(new Date(), 'Start date cannot be in the past')
//         .required('Start date is required'),
//     endDate: Yup.date()
//         .min(Yup.ref('startDate'), 'End date must be later than start date')
//         .required('End date is required'),
//     distance: Yup.number()
//         .positive('Distance must be a positive number')
//         .required('Distance is required'),
//     status: Yup.string()
//         .required('Status is required')
// });

// const TripDetails = () => {
//     const [rowData, setRowData] = useState([]);
//     const [selectedTrip, setSelectedTrip] = useState(null);

//     // Retrieve JWT token
//     const token = localStorage.getItem('jwtToken');

//     useEffect(() => {
//         // Fetch trips from API using Axios with JWT token
//         axios.get('http://localhost:8080/api/trips/getTrips', {
//             headers: {
//                 'Authorization': `Bearer ${token}`
//             }
//         })
//             .then(response => setRowData(response.data))
//             .catch(error => console.error('Error fetching trip data:', error));
//     }, [token]);

//     const columns = [
//         { headerName: 'Trip Name', field: 'tripName', sortable: true, filter: true },
//         { headerName: 'Destination', field: 'destination', sortable: true, filter: true },
//         { headerName: 'Start Date', field: 'startDate', sortable: true, filter: true },
//         { headerName: 'End Date', field: 'endDate', sortable: true, filter: true },
//         { headerName: 'Distance', field: 'distance', sortable: true, filter: true },
//         { headerName: 'Status', field: 'status', sortable: true, filter: true },
//         {
//             headerName: "Actions",
//             width: 200,
//             cellRenderer: (params) => {
//                 return (
//                     <div className="actions d-flex justify-content-start gap-3">
//                         <i
//                             className="bi bi-pencil-fill"
//                             onClick={() => handleEdit(params.data)}
//                         ></i>
//                         <i
//                             className="bi bi-trash3-fill"
//                             onClick={() => handleDelete(params.data)}
//                         ></i>
//                     </div>
//                 );
//             },
//         },
//     ];

//     const handleSubmit = (values, { resetForm }) => {
//         if (selectedTrip) {
//             // Update trip using Axios with JWT token
//             axios.put(`http://localhost:8080/api/trips/${selectedTrip.id}`, values, {
//                 headers: {
//                     'Authorization': `Bearer ${token}`
//                 }
//             })
//                 .then(response => {
//                     setRowData((prevData) =>
//                         prevData.map((trip) =>
//                             trip.id === response.data.id ? response.data : trip
//                         )
//                     );
//                     setSelectedTrip(null);
//                 })
//                 .catch(error => console.error('Error updating trip:', error));
//         } else {
//             // Add new trip using Axios with JWT token
//             axios.post('http://localhost:8080/api/trips/postTrip', values, {
//                 headers: {
//                     'Authorization': `Bearer ${token}`
//                 }
//             })
//                 .then(response => setRowData((prevData) => [...prevData, response.data]))
//                 .catch(error => console.error('Error adding trip:', error));
//         }
//         resetForm();
//     };

//     const handleEdit = (trip) => {
//         setSelectedTrip(trip);
//     };

//     const handleDelete = (trip) => {
//         if (window.confirm('Are you sure you want to delete this trip?')) {
//             axios.delete(`http://localhost:8080/api/trips/${trip.id}`, {
//                 headers: {
//                     'Authorization': `Bearer ${token}`
//                 }
//             })
//                 .then(() => {
//                     setRowData((prevData) =>
//                         prevData.filter((t) => t.id !== trip.id)
//                     );
//                 })
//                 .catch(error => console.error('Error deleting trip:', error));
//         }
//     };

//     return (
//         <Layout>
//             <div className="trip-details">
//                 <h2>Trip Details</h2>

//                 {/* Form Card */}
//                 <div className="form-card">
//                     <h3>{selectedTrip ? 'Edit Trip' : 'Add Trip'}</h3>
//                     <Formik
//                         initialValues={{
//                             tripName: selectedTrip?.tripName || '',
//                             destination: selectedTrip?.destination || '',
//                             startDate: selectedTrip?.startDate || '',
//                             endDate: selectedTrip?.endDate || '',
//                             distance: selectedTrip?.distance || '',
//                             status: selectedTrip?.status || '',
//                         }}
//                         validationSchema={tripSchema}
//                         onSubmit={handleSubmit}
//                         enableReinitialize
//                     >
//                         {() => (
//                             <Form>
//                                 <div className="form-group">
//                                     <label htmlFor="tripName">Trip Name</label>
//                                     <Field
//                                         name="tripName"
//                                         id="tripName"
//                                         className="form-control"
//                                     />
//                                     <ErrorMessage name="tripName" component="div" className="error" />
//                                 </div>
//                                 <div className="form-group">
//                                     <label htmlFor="destination">Destination</label>
//                                     <Field
//                                         name="destination"
//                                         id="destination"
//                                         className="form-control"
//                                     />
//                                     <ErrorMessage name="destination" component="div" className="error" />
//                                 </div>
//                                 <div className="form-group">
//                                     <label htmlFor="startDate">Start Date</label>
//                                     <Field
//                                         name="startDate"
//                                         id="startDate"
//                                         type="date"
//                                         className="form-control"
//                                     />
//                                     <ErrorMessage name="startDate" component="div" className="error" />
//                                 </div>
//                                 <div className="form-group">
//                                     <label htmlFor="endDate">End Date</label>
//                                     <Field
//                                         name="endDate"
//                                         id="endDate"
//                                         type="date"
//                                         className="form-control"
//                                     />
//                                     <ErrorMessage name="endDate" component="div" className="error" />
//                                 </div>
//                                 <div className="form-group">
//                                     <label htmlFor="distance">Distance</label>
//                                     <Field
//                                         name="distance"
//                                         id="distance"
//                                         type="number"
//                                         className="form-control"
//                                     />
//                                     <ErrorMessage name="distance" component="div" className="error" />
//                                 </div>
//                                 <div className="form-group">
//                                     <label htmlFor="status">Status</label>
//                                     <Field
//                                         name="status"
//                                         id="status"
//                                         className="form-control"
//                                     />
//                                     <ErrorMessage name="status" component="div" className="error" />
//                                 </div>
//                                 <div className="form-group d-flex justify-content-center">
//                                     <button type="submit" className="submit-button">
//                                         {selectedTrip ? 'Update Trip' : 'Add Trip'}
//                                     </button>
//                                 </div>
//                             </Form>
//                         )}
//                     </Formik>
//                 </div>

//                 {/* Table Card */}
//                 <div className="table-card">
//                     <div
//                         className="ag-theme-alpine"
//                         style={{ height: 400, width: '100%' }}
//                     >
//                         <AgGridReact
//                             columnDefs={columns}
//                             rowData={rowData}
//                             domLayout="autoHeight"
//                             suppressRowClickSelection={true}
//                         />
//                     </div>
//                 </div>
//             </div>
//         </Layout>
//     );
// };

// export default TripDetails;
