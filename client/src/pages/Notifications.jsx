import axios from "axios";
import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useSelector } from "react-redux";

function Notifications() {
  const { user } = useSelector((state) => state.user);
  const [activeTab, setActiveTab] = useState(0); 
  const [notifications,setNotifications] = useState([]);

  const markAllAsSeen = async () => {
    try {
      const response = await axios.post("http://localhost:5000/api/user/mark-all-notifications-as-seen", {
        userId: user._id,
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (response.data.success) {
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const deleteAll = async () => {
    try {
      const response = await axios.post("http://localhost:5000/api/user/delete-all-notifications", {
        userId: user._id,
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (response.data.success) {
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const getNotifications = async () => {
    try {
      return await axios.post(
        "http://localhost:5000/api/user/get-notifications-by-user",
        {
          userId: user._id,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
    } catch (e) {
      console.log(e)
    }
  };

  useEffect(() => {
    getNotifications().then(res =>setNotifications(res.data.data)).catch(e=> console.log(e))
  }, []);

  return (
    <>
      <h1 className="text-2xl font-bold mt-[12px] mb-[12px]  ml-[12px] text-primary ">
        Notifications
      </h1>
      <hr className="border-gray-200" />

      <div className="flex flex-col tabs">
        <div className="flex items-center justify-between py-4 border-b border-gray-200">
          <button
            type="button"
            className={`px-4 py-2 font-medium text-gray-500 ${
              activeTab === 0
                ? "text-primary border-b-2 border-primary"
                : ""
            }`}
            onClick={() => setActiveTab(0)}
          >
            Unseen
          </button>
          <button
            type="button"
            className={`px-4 py-2 font-medium text-gray-500 ${
              activeTab === 1
                ? "text-primary border-b-2b border-primary"
                : ""
            }`}
            onClick={() => setActiveTab(1)}
          >
            Seen
          </button>
        </div>

        <div className={`px-4 py-4 ${activeTab === 0 ? "" : "hidden"}`}>
          {/* Unseen notifications content */}
          <div className="flex justify-end mb-4">
            <h1
              className="text-primary cursor-pointer anchor"
              onClick={markAllAsSeen}
            >
              Mark all as seen
            </h1>
          </div>
          {notifications.map((notification) => (
            <>
            {
              notification.status !== 'seen' &&
            <div
              key={notification._id}
              className="bg-white p-4 rounded-lg shadow-md mb-4"
            >
              <div className="flex">
                <div className="text-gray-700 font-bold">{notification.title}: &nbsp;</div>
                <div className="text-gray-700">{notification.content}</div>
              </div>
            </div>
            }
            </>
          ))}
        </div>

        <div className={`px-4 py-4 ${activeTab === 1 ? "" : "hidden"}`}>
          {/* Seen notifications content */}
          <div className="flex justify-end mb-4">
            <h1
              className="text-primary cursor-pointer anchor"
              onClick={() => deleteAll().then(res => console.log(res)).catch(e => console.log(e))}
            >
              Delete all
            </h1>
          </div>
           {notifications.map((notification) => (
            <>
            {
              notification.status === 'seen' &&
            <div
              key={notification._id}
              className="bg-white p-4 rounded-lg shadow-md mb-4"
            >
              <div className="flex">
                <div className="text-gray-700 font-bold">{notification.title}: &nbsp;</div>
                <div className="text-gray-700">{notification.content}</div>
              </div>
            </div>
            }
            </>
          ))}
        </div>
        <Toaster/>
      </div>
    </>
  );
}

export default Notifications;
