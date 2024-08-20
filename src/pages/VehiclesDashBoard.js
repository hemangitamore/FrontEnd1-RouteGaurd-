import React, { useState, useEffect } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import Layout from "../components/Layout/Layout";

// Validation schema
const vehicleNumberPattern = /^[A-Z]{2,3}\d{2,4}(-\d{4})?$/;
const vehicleSchema = Yup.object().shape({
  vehicleNumber: Yup.string()
    .required("Vehicle number is required")
    .matches(
      vehicleNumberPattern,
      "Vehicle number must be in the format: XX12-1234 or XX1234"
    ),
  vehicleName: Yup.string()
    .required("Vehicle name is required")
    .min(2, "Vehicle name must be at least 2 characters long")
    .max(50, "Vehicle name cannot exceed 50 characters"),
  vehicleModelNumber: Yup.string()
    .required("Vehicle model number is required")
    .min(2, "Vehicle model number must be at least 2 characters long")
    .max(50, "Vehicle model number cannot exceed 50 characters"),
  puc: Yup.string()
    .required("PUC is required")
    .oneOf(["Valid", "Expired"], 'PUC must be either "Valid" or "Expired"'),
  accidentHistory: Yup.string().required("Accident history is required"),
  carryingCapacity: Yup.string()
    .required("Carrying capacity is required")
    .matches(/^[0-9]+kg$/, 'Carrying capacity must be a number followed by "kg"'),
});

const VehiclesDashBoard = () => {
  const [rowData, setRowData] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState(null);

  // Fetch JWT token from localStorage (ensure token is stored here after login)
  const token = localStorage.getItem("jwtToken");

  // Axios instance with JWT token
  const axiosInstance = axios.create({
    baseURL: "http://localhost:8080/api/vehicles", // Replace with your actual base URL
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  // Fetch all vehicles
  useEffect(() => {
    axiosInstance
      .get("/GetVehicles")
      .then((response) => {
        setRowData(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the vehicles!", error);
      });
  }, [axiosInstance]);

  // Handle form submission
  const handleSubmit = (values, { resetForm }) => {
    if (selectedVehicle) {
      // Update existing vehicle
      axiosInstance
        .put(`/${selectedVehicle.id}`, values)
        .then((response) => {
          setRowData((prevData) =>
            prevData.map((vehicle) =>
              vehicle.id === selectedVehicle.id ? response.data : vehicle
            )
          );
          setSelectedVehicle(null);
        })
        .catch((error) => {
          console.error("There was an error updating the vehicle!", error);
        });
    } else {
      // Add new vehicle
      axiosInstance
        .post("/addvehicle", values)
        .then((response) => {
          setRowData([...rowData, response.data]);
        })
        .catch((error) => {
          console.error("There was an error adding the vehicle!", error);
        });
    }
    resetForm();
  };

  // Handle edit
  const handleEdit = (vehicle) => {
    setSelectedVehicle(vehicle);
  };

  // Handle delete
  const handleDelete = (vehicle) => {
    if (window.confirm("Are you sure you want to delete this vehicle?")) {
      axiosInstance
        .delete(`/${vehicle.id}`)
        .then(() => {
          setRowData((prevData) =>
            prevData.filter((v) => v.id !== vehicle.id)
          );
        })
        .catch((error) => {
          console.error("There was an error deleting the vehicle!", error);
        });
    }
  };

  const columns = [
    { headerName: "Vehicle Number", field: "vehicleNumber", sortable: true, filter: true },
    { headerName: "Vehicle Name", field: "vehicleName", sortable: true, filter: true },
    { headerName: "Vehicle Model Number", field: "vehicleModelNumber", sortable: true, filter: true },
    { headerName: "PUC", field: "puc", sortable: true, filter: true },
    { headerName: "Accident History", field: "accidentHistory", sortable: true, filter: true },
    { headerName: "Carrying Capacity", field: "carryingCapacity", sortable: true, filter: true },
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

  return (
    <Layout>
      <div className="vehicle-details container">
        <h3>Vehicle Details</h3>
        {/* Form Card */}
        <div className="form-card">
          <h3>{selectedVehicle ? "Edit Vehicle" : "Add Vehicle"}</h3>
          <Formik
            initialValues={{
              vehicleNumber: selectedVehicle?.vehicleNumber || "",
              vehicleName: selectedVehicle?.vehicleName || "",
              vehicleModelNumber: selectedVehicle?.vehicleModelNumber || "",
              puc: selectedVehicle?.puc || "",
              accidentHistory: selectedVehicle?.accidentHistory || "",
              carryingCapacity: selectedVehicle?.carryingCapacity || "",
            }}
            validationSchema={vehicleSchema}
            onSubmit={handleSubmit}
            enableReinitialize
          >
            {({ errors, touched }) => (
              <Form>
                <div className="form-group">
                  <label htmlFor="vehicleNumber">Vehicle Number</label>
                  <Field name="vehicleNumber" className="form-control" />
                  {errors.vehicleNumber && touched.vehicleNumber ? (
                    <div className="error">{errors.vehicleNumber}</div>
                  ) : null}
                </div>
                <div className="form-group">
                  <label htmlFor="vehicleName">Vehicle Name</label>
                  <Field name="vehicleName" className="form-control" />
                  {errors.vehicleName && touched.vehicleName ? (
                    <div className="error">{errors.vehicleName}</div>
                  ) : null}
                </div>
                <div className="form-group">
                  <label htmlFor="vehicleModelNumber">Vehicle Model Number</label>
                  <Field name="vehicleModelNumber" className="form-control" />
                  {errors.vehicleModelNumber && touched.vehicleModelNumber ? (
                    <div className="error">{errors.vehicleModelNumber}</div>
                  ) : null}
                </div>
                <div className="form-group">
                  <label htmlFor="puc">PUC</label>
                  <Field name="puc" className="form-control" />
                  {errors.puc && touched.puc ? (
                    <div className="error">{errors.puc}</div>
                  ) : null}
                </div>
                <div className="form-group">
                  <label htmlFor="accidentHistory">Accident History</label>
                  <Field name="accidentHistory" className="form-control" />
                  {errors.accidentHistory && touched.accidentHistory ? (
                    <div className="error">{errors.accidentHistory}</div>
                  ) : null}
                </div>
                <div className="form-group">
                  <label htmlFor="carryingCapacity">Carrying Capacity</label>
                  <Field name="carryingCapacity" className="form-control" />
                  {errors.carryingCapacity && touched.carryingCapacity ? (
                    <div className="error">{errors.carryingCapacity}</div>
                  ) : null}
                </div>
                <div className="form-group d-flex justify-content-center">
                  <button type="submit" className="submit-button">
                    {selectedVehicle ? "Update Vehicle" : "Add Vehicle"}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
        {/* Table Card */}
        <div className="table-card">
          <div className="ag-theme-alpine" style={{ width: "100%", height: "100%" }}>
            <AgGridReact
              columnDefs={columns}
              rowData={rowData}
              domLayout="autoHeight"
              suppressRowClickSelection={true}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default VehiclesDashBoard;



















// import React, { useState, useEffect } from "react";
// import { Formik, Form, Field } from "formik";
// import * as Yup from "yup";
// import { addVehicle } from "../services/user-services"; // Make sure this service is defined
// import { AgGridReact } from "ag-grid-react";
// import "ag-grid-community/styles/ag-grid.css";
// import "ag-grid-community/styles/ag-theme-alpine.css";
// import Layout from "../components/Layout/Layout";
// //import './VehicleDetails.css';
// const vehicleNumberPattern = /^[A-Z]{2,3}\d{2,4}(-\d{4})?$/;
// const vehicleSchema = Yup.object().shape({
//   vehicleNumber: Yup.string()
//     .required("Vehicle number is required")
//     .matches(
//       vehicleNumberPattern,
//       "Vehicle number must be in the format: XX12-1234 or XX1234"
//     ),

//   vehicleName: Yup.string()
//     .required("Vehicle name is required")
//     .min(2, "Vehicle name must be at least 2 characters long")
//     .max(50, "Vehicle name cannot exceed 50 characters"),

//   vehicleModelNumber: Yup.string()
//     .required("Vehicle model number is required")
//     .min(2, "Vehicle model number must be at least 2 characters long")
//     .max(50, "Vehicle model number cannot exceed 50 characters"),

//   puc: Yup.string()
//     .required("PUC is required")
//     .oneOf(["Valid", "Expired"], 'PUC must be either "Valid" or "Expired"'),

//   accidentHistory: Yup.string().required("Accident history is required"),

//   carryingCapacity: Yup.string()
//     .required("Carrying capacity is required")
//     .matches(
//       /^[0-9]+kg$/,
//       'Carrying capacity must be a number followed by "kg"'
//     ),
// });

// const VehiclesDashBoard = () => {
//   const [rowData, setRowData] = useState([]);
//   const [selectedVehicle, setSelectedVehicle] = useState(null);
//   console.log(rowData, "row datas");
//   const columns = [
//     {
//       headerName: "Vehicle Number",
//       field: "vehicleNumber",
//       sortable: true,
//       filter: true,
//     },
//     {
//       headerName: "Vehicle Name",
//       field: "vehicleName",
//       sortable: true,
//       filter: true,
//     },
//     {
//       headerName: "Vehicle Model Number",
//       field: "vehicleModelNumber",
//       sortable: true,
//       filter: true,
//     },
//     { headerName: "PUC", field: "puc", sortable: true, filter: true },
//     {
//       headerName: "Accident History",
//       field: "accidentHistory",
//       sortable: true,
//       filter: true,
//     },
//     {
//       headerName: "Carrying Capacity",
//       field: "carryingCapacity",
//       sortable: true,
//       filter: true,
//     },
//     {
//       headerName: "Actions",
//       width: 200,
//       cellRenderer: (params) => {
//         return (
//           <div className="actions d-flex justify-content-start gap-3">
//             <i
//               className="bi bi-pencil-fill"
//               onClick={() => handleEdit(params.data)}
//             ></i>
//             <i
//               className="bi bi-trash3-fill"
//               onClick={() => handleDelete(params.data)}
//             ></i>
//           </div>
//         );
//       },
//     },
//   ];

//   useEffect(() => {
//     // Fetch vehicles from API (replace with actual API call)
//     setRowData([
//       {
//         vehicleNumber: "MH12AB1234",
//         vehicleName: "Tata Truck",
//         vehicleModelNumber: "T1234",
//         puc: "Valid",
//         accidentHistory: "None",
//         carryingCapacity: "1000kg",
//       },
//     ]);
//   }, []);

//   const handleSubmit = (values, { resetForm }) => {
//     if (selectedVehicle) {
//       setRowData((prevData) =>
//         prevData.map((vehicle) =>
//           vehicle.vehicleNumber === selectedVehicle.vehicleNumber
//             ? values
//             : vehicle
//         )
//       );
//       setSelectedVehicle(null);
//     } else {
      
//     }
//     resetForm();
//   };

//   const handleEdit = (vehicle) => {
//  setSelectedVehicle(vehicle);
//   };

//   const handleDelete = (vehicle) => {
//     if (window.confirm("Are you sure you want to delete this vehicle?")) {
//       setRowData((prevData) =>
//         prevData.filter((v) => v.vehicleNumber !== vehicle.vehicleNumber)
//       );
//     }
//   };

//   return (
//     <Layout>
//       {" "}
//       <div className="vehicle-details container">
//         <h3>Vehicle Details</h3>

//         {/* Form Card */}
//         <div className="form-card">
//           <h3>{selectedVehicle ? "Edit Vehicle" : "Add Vehicle"}</h3>
//           <Formik
//             initialValues={{
//               vehicleNumber: selectedVehicle?.vehicleNumber || "",
//               vehicleName: selectedVehicle?.vehicleName || "",
//               vehicleModelNumber: selectedVehicle?.vehicleModelNumber || "",
//               puc: selectedVehicle?.puc || "",
//               accidentHistory: selectedVehicle?.accidentHistory || "",
//               carryingCapacity: selectedVehicle?.carryingCapacity || "",
//             }}
//             validationSchema={vehicleSchema}
//             onSubmit={handleSubmit}
//             enableReinitialize
//           >
//             {({ errors, touched }) => (
//               <Form>
//                 <div className="form-group">
//                   <label htmlFor="vehicleNumber">Vehicle Number</label>
//                   <Field name="vehicleNumber" className="form-control" />
//                   {errors.vehicleNumber && touched.vehicleNumber ? (
//                     <div className="error">{errors.vehicleNumber}</div>
//                   ) : null}
//                 </div>
//                 <div className="form-group">
//                   <label htmlFor="vehicleName">Vehicle Name</label>
//                   <Field name="vehicleName" className="form-control" />
//                   {errors.vehicleName && touched.vehicleName ? (
//                     <div className="error">{errors.vehicleName}</div>
//                   ) : null}
//                 </div>
//                 <div className="form-group">
//                   <label htmlFor="vehicleModelNumber">
//                     Vehicle Model Number
//                   </label>
//                   <Field name="vehicleModelNumber" className="form-control" />
//                   {errors.vehicleModelNumber && touched.vehicleModelNumber ? (
//                     <div className="error">{errors.vehicleModelNumber}</div>
//                   ) : null}
//                 </div>
//                 <div className="form-group">
//                   <label htmlFor="puc">PUC</label>
//                   <Field name="puc" className="form-control" />
//                   {errors.puc && touched.puc ? (
//                     <div className="error">{errors.puc}</div>
//                   ) : null}
//                 </div>
//                 <div className="form-group">
//                   <label htmlFor="accidentHistory">Accident History</label>
//                   <Field name="accidentHistory" className="form-control" />
//                   {errors.accidentHistory && touched.accidentHistory ? (
//                     <div className="error">{errors.accidentHistory}</div>
//                   ) : null}
//                 </div>
//                 <div className="form-group">
//                   <label htmlFor="carryingCapacity">Carrying Capacity</label>
//                   <Field name="carryingCapacity" className="form-control" />
//                   {errors.carryingCapacity && touched.carryingCapacity ? (
//                     <div className="error">{errors.carryingCapacity}</div>
//                   ) : null}
//                 </div>
//                 <div className="form-group d-flex justify-content-center">
//                   <button type="submit" className="submit-button">
//                     {selectedVehicle ? "Update Vehicle" : "Add Vehicle"}
//                   </button>
//                 </div>
//               </Form>
//             )}
//           </Formik>
//         </div>

//         {/* Table Card */}
//         <div className="table-card">
//           <div
//             className="ag-theme-alpine"
//             style={{ width: "100%", height: "100%" }}
//           >
//             <AgGridReact
//               columnDefs={columns}
//               rowData={rowData}
//               domLayout="autoHeight"
//               suppressRowClickSelection={true}
//             />
//           </div>
//         </div>
//       </div>
//     </Layout>
//   );
// };

// export default VehiclesDashBoard;





// // Add new vehicle logic
      // addVehicle(values)
      //   .then((newVehicle) => {
      //     setRowData((prevData) => [...prevData, newVehicle]);
      //   })
      //   .catch((error) => {
      //     console.error("Error adding vehicle:", error);
      //     alert("Failed to add vehicle. Please try again.");
      //   });