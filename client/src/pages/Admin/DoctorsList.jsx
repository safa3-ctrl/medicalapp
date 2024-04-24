import { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import axios from "axios";
import moment from "moment";

const DoctorsList = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading,setLoading] = useState(false);

  const deleteDoctor = async (doctorId) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/admin/delete-doctor",
        {
          doctorId
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.data.success) {
        setDoctors(response.data.data);
        setLoading(prev => !prev);
      } else {
        setUsers(response.data.data);
      }
    } catch (e) {
      console.log(error);
    }
  };

  useEffect(() => {
    const getDoctorsData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/admin/get-all-doctors",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (response.data.success) {
          setDoctors(response.data.data);
        } else {
          setUsers(response.data.data);
        }
      } catch (error) {
        console.log(error);
      }
    };

    getDoctorsData();
  }, [loading]);

  return (
    <Layout>
      <div className="p-8">
        <h3 className="page-header text-2xl font-bold ml-2 mb-8 text-primary">
          Doctors List:
        </h3>

        <div className="flex flex-col">
          {/* Removed unnecessary nested divs */}
          <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
              <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        name
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        phone number
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Website
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Specialite
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {doctors.map((doctor) => (
                      <tr key={doctor._id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {doctor.firsName} {doctor.lastName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {doctor.phoneNumber}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {doctor.website}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {doctor.specialization}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            className="bg-red-500 text-white p-4"
                            onClick={() => {
                              console.log("Blocking user:", doctor._id);
                              deleteDoctor(doctor._id)
                            }}
                          >
                            Block
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DoctorsList;
