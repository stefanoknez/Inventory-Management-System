import { Fragment, useContext, useEffect, useState } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { BellIcon } from "@heroicons/react/24/outline";
import AuthContext from "../AuthContext";
import { Link } from "react-router-dom";
import NotificationDropdown from "./NotificationDropdown";

const navigation = [
  { name: "Dashboard", href: "/", current: true },
  { name: "Inventory", href: "/inventory", current: false },
  { name: "Purchase Details", href: "/purchase-details", current: false },
  { name: "Sales", href: "/sales", current: false },
  { name: "Manage Store", href: "/manage-store", current: false },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Header() {
  const authContext = useContext(AuthContext);
  const localStorageData = JSON.parse(localStorage.getItem("user"));
  const [hasNotification, setHasNotification] = useState(false);

  useEffect(() => {
    fetch(`http://localhost:4000/api/product/low-stock/${authContext.user}`)
      .then((res) => res.json())
      .then((data) => {
        setHasNotification(data.length > 0);
      })
      .catch((err) => console.error(err));
  }, [authContext.user]);

  return (
    <div className="min-h-full">
      <Disclosure as="nav" className="bg-gray-800">
        {() => (
          <>
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="flex h-16 items-center justify-between">
                {/* Logo & Title */}
                <div className="flex items-center">
                  <div className="flex-shrink-0 flex gap-2 items-center">
                    <img
                      className="h-8 w-8"
                      src={require("../assets/logo.png")}
                      alt="Inventory Management System"
                    />
                    <span className="font-bold text-white italic">
                      Inventory Management
                    </span>
                  </div>
                </div>

                {/* Right: Notification + Profile */}
                <div className="hidden md:block">
                  <div className="ml-4 flex items-center md:ml-6">
                    {/* Notification */}
                    <Menu as="div" className="relative">
                      <Menu.Button className="relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none">
                        <BellIcon className="h-6 w-6" aria-hidden="true" />
                        {hasNotification && (
                          <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-red-600 border border-white"></span>
                        )}
                      </Menu.Button>
                      <Transition
                        as={Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                      >
                        <Menu.Items className="absolute right-0 mt-2 w-72 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                          <NotificationDropdown userId={authContext.user} />
                        </Menu.Items>
                      </Transition>
                    </Menu>

                    {/* Profile */}
                    <Menu as="div" className="relative ml-3">
                      <div>
                        <Menu.Button className="flex max-w-xs items-center rounded-full bg-gray-800 text-sm focus:outline-none">
                          <img
                            className="h-8 w-8 rounded-full"
                            src={localStorageData.imageUrl}
                            alt="profile"
                          />
                        </Menu.Button>
                      </div>
                      <Transition
                        as={Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                      >
                        <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                          <Menu.Item>
                            {({ active }) => (
                              <Link
                                to="/profile"
                                className={classNames(
                                  active ? "bg-gray-100" : "",
                                  "block px-4 py-2 text-sm text-gray-700"
                                )}
                              >
                                View Profile
                              </Link>
                            )}
                          </Menu.Item>
                          <Menu.Item>
                            {({ active }) => (
                              <Link
                                to="/login"
                                onClick={() => authContext.signout()}
                                className={classNames(
                                  active ? "bg-gray-100" : "",
                                  "block px-4 py-2 text-sm text-gray-700"
                                )}
                              >
                                Sign out
                              </Link>
                            )}
                          </Menu.Item>
                        </Menu.Items>
                      </Transition>
                    </Menu>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </Disclosure>
    </div>
  );
}