import axios from "axios";
import moment from "moment";
import React, { useCallback, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";
import Layout from "../components/Layout";

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const { user } = useSelector((state) => state.user);

  const getAppointmentsData = async () => {
    try {
      return await axios.post(
        "http://localhost:5000/api/user/get-appointments-by-user-id",
        { 
            userId: user._id,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
    } catch (error) {
      toast.error("An error occurred while fetching appointments.");
    }
  }

  const getDoctorsInfo = async () => {
    try {
      return await axios.get(
        "http://localhost:5000/api/user/get-all-doctors",
      );
    } catch (error) {
      toast.error("An error occurred while fetching appointments.");
    } 
  }

  useEffect(() => {
    getAppointmentsData()
      .then((res) => setAppointments(res.data.data[0]))
      .catch((e) => console.log(e));

    getDoctorsInfo().then(res => setDoctors(res.data.data)).catch(e => console.log(e))
  }, [user]);



  // Colonnes du tableau avec des fonctions de rendu pour formater les données
  const columns = [
    {
      title: "Id",
      dataIndex: "_id",
      render: (text, record) => <span>{text}</span>,
    },
    {
      title: "Téléphone",
      dataIndex: "phoneNumber",
      render: (text, record) => {
        const doctor = doctors?.find(doctor => doctor._id == text);
        return (<span>{doctor?.phoneNumber}</span>)
      }
    },
    {
      title: "Name",
      dataIndex: "name",
      render: (text, record) => {
        const doctor = doctors?.find(doctor => doctor._id == text);
        return (<span>{`${doctor?.firstName} ${doctor?.lastName}`}</span>)
      }
    },
    {
      title: "Date",
      dataIndex: "date",
      render: (text, record) => (
        <span>
          {moment(record.date).format("DD-MM-YYYY")}{" "}
        </span>
      ),
    },
    {
      title: "Time",
      dataIndex: "time",
      render: (text, record) => (
        <span>
          {moment(record.time).format("HH:mm")}
        </span>
      ),
    },
   
  ];

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-4 mt-4 ml-[12px] text-primary">
        Appointments
      </h1>
      <hr className="my-4" />
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column) => (
              <th
                key={column.dataIndex}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {column.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {appointments.map((record) => (
            <tr key={record._id}>
              {columns.map((column) => (
                
                <td key={column.dataIndex} className="px-6 py-4 whitespace-nowrap">
                  {column.render(record.doctorId, record)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </Layout>
  );
};

export default Appointments;
