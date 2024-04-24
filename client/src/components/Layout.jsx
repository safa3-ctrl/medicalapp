import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

function Layout({ children,className="" }) {
  const [collapsed, setCollapsed] = useState(false);
  const { user } = useSelector((state) => state.user);
  const [sidebarLinks,setSidebarLinks] = useState([]);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const menuItems =
    user?.isAdmin === true
      ? [
          { name: "Home", path: "/dashboard", icon: "ri-home-line" },
          { name: "Users", path: "/admin/userslist", icon: "ri-user-line" },
          {
            name: "Doctors",
            path: "/admin/doctorslist",
            icon: "ri-user-star-line",
          },
          { name: "Profile", path: "/profile", icon: "ri-user-line" },
        ]
      : user?.isDoctor === true
      ? [
          { name: "Home", path: "/dashboard", icon: "ri-home-line" },
          {
            name: "Appointments",
            path: "/doctor/appointments",
            icon: "ri-file-list-line",
          },
          {
            name: "Profile",
            path: `/profile`,
            icon: "ri-user-line",
          },
        ]
      : [
          { name: "Home", path: "/dashboard", icon: "ri-home-line" },
          {
            name: "Appointments",
            path: "/appointments",
            icon: "ri-file-list-line",
          },
          {
            name: "Apply Doctor",
            path: "/apply-doctor",
            icon: "ri-hospital-line",
          },
        ];
        setSidebarLinks(menuItems)
  },[user])
  


  return (
    <div className={`main flex min-h-screen ${className}`}>
      {/* Sidebar */}
      <div
        className={`flex-none bg-primary shadow-md md:flex md:flex-col w-64 ${
          collapsed ? "w-0" : ""
        }`}
      >
        {/* Sidebar header with logo and role */}
        <div className="py-4 px-6 text-white">
          <h1 className="text-2xl font-bold">Logo</h1>
        </div>

        {/* Sidebar navigation links */}
        <nav className="mt-4 px-4 pt-2 space-y-2 text-white">
          {sidebarLinks.map((menu) => (
            <Link
              key={menu.path}
              to={menu.path}
              className={`block py-2 px-4 text-left hover:bg-primary ${
                location.pathname === menu.path && "bg-primary"
              }`}
            >
              <i className={`text-xl mr-2 ${menu.icon}`} /> {menu.name}
            </Link>
          ))}
          <Link
            to="/login"
            className="block py-2 px-4 text-left hover:bg-primary"
            onClick={() => {
              localStorage.clear();
              navigate("/login");
            }}
          >
            <i className="text-xl mr-2 ri-logout-circle-line" /> Logout
          </Link>
        </nav>
      </div>

      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header with toggle button, notifications, and user name */}
        <header className="flex items-center justify-between p-4 bg-white shadow-md border-b border-gray-200">
          {collapsed ? (
            <i
              className="ri-menu-2-fill text-2xl cursor-pointer"
              onClick={() => setCollapsed(false)}
            ></i>
          ) : (
            <i
              className="ri-close-fill text-2xl cursor-pointer"
              onClick={() => setCollapsed(true)}
            ></i>
          )}

          {/* Notifications and user name */}
          <div className="flex items-center">
            <div
              className={`relative inline-block cursor-pointer ${
                user?.unseenNotifications.length > 0
                  ? "bg-red-500 text-white"
                  : ""
              }`}
              onClick={() => navigate("/notifications")}
            >
              <i className="ri-notification-line px-3 text-xl"></i>
              {user?.unseenNotifications.length > 0 && (
                <span className="absolute top-0 right-0 p-1 text-xs font-bold rounded-full bg-white">
                  {user?.unseenNotifications.length}
                </span>
              )}
            </div>

            <span className="anchor mx-2 text-primary">{user?.name}</span>
          </div>
        </header>

        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}

export default Layout;