import React, { useState, useEffect, useContext } from "react";
import AddStore from "../components/AddStore";
import AuthContext from "../AuthContext";

function Store() {
  const [showModal, setShowModal] = useState(false);
  const [stores, setAllStores] = useState([]);
  const authContext = useContext(AuthContext);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    fetch(`http://localhost:4000/api/store/get/${authContext.user}`)
      .then((res) => res.json())
      .then((data) => setAllStores(data))
      .catch((err) => console.log(err));
  };

  const modalSetting = () => {
    setShowModal(!showModal);
  };

  const handlePageUpdate = () => {
    fetchData();
  };

  const deleteStore = (storeId) => {
    if (window.confirm("Are you sure you want to delete this store?")) {
      fetch(`http://localhost:4000/api/store/delete/${storeId}`, {
        method: "DELETE",
      })
        .then((res) => res.json())
        .then(() => {
          alert("Store deleted");
          fetchData();
        })
        .catch((err) => console.log(err));
    }
  };

  return (
    <div className="col-span-12 lg:col-span-10 flex justify-center dark:bg-gray-900">
      <div className="flex flex-col gap-5 w-11/12">
        <div className="flex justify-between items-center">
          <span className="font-bold text-xl dark:text-white">Manage Store</span>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 text-sm rounded"
            onClick={modalSetting}
          >
            Add Store
          </button>
        </div>

        {showModal && <AddStore handlePageUpdate={handlePageUpdate} />}

        <div className="grid md:grid-cols-2 gap-4">
          {stores.map((store) => (
            <div
              key={store._id}
              className="bg-white dark:bg-gray-800 shadow rounded p-4"
            >
              <img
                src={store.image}
                alt="store"
                className="h-60 w-full object-cover rounded"
              />
              <div className="pt-2">
                <h2 className="font-bold text-lg dark:text-white">{store.name}</h2>
                <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                  <img
                    src={require("../assets/location-icon.png")}
                    alt="location-icon"
                    className="h-5 w-5"
                  />
                  <span>{store.address}, {store.city}</span>
                </div>
                <button
                  onClick={() => deleteStore(store._id)}
                  className="mt-2 bg-red-500 hover:bg-red-700 text-white text-xs font-semibold py-1 px-3 rounded"
                >
                  Delete Store
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Store;