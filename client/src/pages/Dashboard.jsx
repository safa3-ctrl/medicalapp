import Layout from "../components/Layout";
import { useSelector } from "react-redux";
import BookAppointment from "./BookAppointment";
import Notifications from "./Notifications";

const Dashboard = () => {
  const { user } = useSelector((state) => state.user);

  return (
    <Layout className="bg-gray-200 text-primary">
      {user?.isAdmin ? (
        <div className=""><Notifications/></div>
      ) : user?.isDoctor ? (
        <div className="">
          <Notifications/>
        </div>
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center text-primary">
          <h1 className="text-xl font-semibold text-gray-700 mb-4">Book appointment</h1>
          <div className="w-5/12 mb-2 rounded overflow-hidden shadow-lg bg-white"><BookAppointment/></div>

        </div>
      )}
    </Layout>
  );
};

export default Dashboard;
