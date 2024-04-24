import React, { useEffect, useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import Layout from "../../components/Layout";
import { showLoading, hideLoading } from "../../redux/alertsSlice";
import { toast } from "react-hot-toast";
import axios from "axios";
import moment from "moment"; // Ensure moment.js is installed

function DoctorAppointments() {
  const [appointments, setAppointments] = useState([]);
  const dispatch = useDispatch();

  // **Wrap handleError in useCallback to stabilize its reference:**
  const handleError = useCallback((error) => {
    console.error(error);
    toast.error("An error occurred. Please try again later.");
    dispatch(hideLoading()); // Hide loading indicator in case of errors
  }, [dispatch]);

  // **Include handleError in the dependency array of useEffect:**
  useEffect(() => {
    const getAppointmentsData = async () => {
      try {
        dispatch(showLoading());
        const response = await axios.get(
          "/api/doctor/get-appointments-by-doctor-id",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        dispatch(hideLoading());
        if (response.data.success) {
          setAppointments(response.data.data);
        } else {
          toast.error(response.data.message); // Handle API-specific errors
        }
      } catch (error) {
        handleError(error);
      }
    };

    getAppointmentsData();
  }, [dispatch, handleError]);

  // **Handle changing appointment status:**
  const changeAppointmentStatus = async (record, status) => {
    try {
      dispatch(showLoading());
      const response = await axios.post(
        "http://localhost:5000/api/doctor/change-appointment-status",
        { appointmentId: record._id, status: status },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(hideLoading());
      if (response.data.success) {
        toast.success(response.data.message);
        // Refresh data after successful status change
        setAppointments();
      } else {
        toast.error(response.data.message); // Handle API-specific errors
      }
    } catch (error) {
      handleError(error);
    }
  };

  // **Column definitions with date formatting and status display:**
  const columns = [
    {
      title: "ID",
      dataIndex: "_id",
      render: (text, record) => <td className="px-6 py-4 whitespace-nowrap">{text}</td>,
    },
    {
      title: "Patient Name",
      dataIndex: "patient.name", // Assuming nested patient object
      render: (text, record) => <td className="px-6 py-4 whitespace-nowrap">{text}</td>,
    },
    // ... Include any other relevant columns for your application
    {
      title: "Date",
      dataIndex: "date",
      render: (record) => (
        <td className="px-6 py-4 whitespace-nowrap">
          {moment(record.date).format("DD-MM-YYYY")}
        </td>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (text, record) => (
        <td className="px-6 py-4 whitespace-nowrap">
          {record.status === "PENDING" ? (
            <span className="bg-yellow-200 text-yellow-800 px-2 py-1 rounded-md">Pending</span>
          ) : record.status === "CONFIRMED" ? (
            <span className="bg-green-200 text-green-800 px-2 py-1 rounded-md">Confirmed</span>
          ) : (
            <span className="bg-red-200 text-red-800 px-2 py-1 rounded-md">Cancelled</span>
          )}
        </td>
      ),
    },
    {
      title: "Actions",
      dataIndex: "actions",
      render: (text, record) => (
        <td className="px-6 py-4 whitespace-nowrap text-right">
          <button
            className="px-4 py-2 text-sm font-medium text-white bg-[#252652] rounded-md hover:bg-[#32348d] focus:ring-4 focus:outline-none focus:ring-blue-300"
            onClick={() => changeAppointmentStatus(record, "PENDING")} // Example status change
          >
            Change Status
          </button>
        </td>
      ),
    },
  ];
  return (
    <Layout>
      <h1 className="text-2xl font-bold  mt-[12px] mb-[12px] ml-[12px] text-primary">Appointments</h1>
      <div className="w-full overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <head className="bg-gray-50">
            <tr>
              {columns.map((column) => (
                <th key={column.dataIndex} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {column.title}
                </th>
              ))}
            </tr>
          </head>
          <tbody className="bg-white divide-y divide-gray-200">
            {appointments.map((record) => (
              <tr key={record._id}>
                {columns.map((column) => column.render(record.name, record))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}

export default DoctorAppointments;
