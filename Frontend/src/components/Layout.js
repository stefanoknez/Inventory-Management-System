import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import SideMenu from "./SideMenu";

function Layout() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
      <div className="md:h-16">
        <Header />
      </div>
      <div className="grid grid-cols-12">
        <div className="col-span-2 h-screen sticky top-0 hidden lg:flex">
          <SideMenu />
        </div>
        <div className="col-span-12 lg:col-span-10 px-4 py-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default Layout;