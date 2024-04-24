import React from "react";
import { useSelector } from "react-redux";
import Layout from "../components/Layout";

function Profile() {
  
  const { user } = useSelector((state) => state.user);
  

  return (
    <Layout className="bg-gray-200">
      <div className="p-8 flex flex-col justify-center items-center">
      <h1 className="text-2xl font-bold mb-4 text-primary">Profile</h1>
      <div className="bg-white max-w-sm rounded overflow-hidden shadow-lg p-8 flex flex-col gap-4">
        <span>Name: {user.name}</span>
        <span>Email: {user.email}</span>
        <span>created at: {user.createdAt}</span>
      </div>
      </div>
    </Layout>
  );
}

export default Profile;
