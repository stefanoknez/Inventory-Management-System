import React, { useState, useEffect, useContext } from "react";
import AddProduct from "../components/AddProduct";
import UpdateProduct from "../components/UpdateProduct";
import AuthContext from "../AuthContext";

function Inventory() {
  const [showProductModal, setShowProductModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [updateProduct, setUpdateProduct] = useState([]);
  const [products, setAllProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState();
  const [updatePage, setUpdatePage] = useState(true);
  const [stores, setAllStores] = useState([]);

  const authContext = useContext(AuthContext);

  useEffect(() => {
    fetchProductsData();
    fetchSalesData();
  }, [updatePage]);

  const fetchProductsData = () => {
    fetch(`http://localhost:4000/api/product/get/${authContext.user}`)
      .then((response) => response.json())
      .then((data) => {
        setAllProducts(data);
      })
      .catch((err) => console.log(err));
  };

  const fetchSearchData = () => {
    fetch(`http://localhost:4000/api/product/search?searchTerm=${searchTerm}`)
      .then((response) => response.json())
      .then((data) => {
        setAllProducts(data);
      })
      .catch((err) => console.log(err));
  };

  const fetchSalesData = () => {
    fetch(`http://localhost:4000/api/store/get/${authContext.user}`)
      .then((response) => response.json())
      .then((data) => {
        setAllStores(data);
      });
  };

  const addProductModalSetting = () => {
    setShowProductModal(!showProductModal);
  };

  const updateProductModalSetting = (selectedProductData) => {
    setUpdateProduct(selectedProductData);
    setShowUpdateModal(!showUpdateModal);
  };

  const deleteItem = (id) => {
    fetch(`http://localhost:4000/api/product/delete/${id}`)
      .then((response) => response.json())
      .then(() => {
        setUpdatePage(!updatePage);
      });
  };

  const handlePageUpdate = () => {
    setUpdatePage(!updatePage);
  };

  const handleSearchTerm = (e) => {
    setSearchTerm(e.target.value);
    fetchSearchData();
  };

  return (
    <div className="col-span-12 lg:col-span-10 flex justify-center bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white py-6 px-4">
      <div className="flex flex-col gap-5 w-11/12">
        <div className="bg-white dark:bg-gray-800 rounded p-3">
          <span className="font-semibold px-4">Overall Inventory</span>
          <div className="flex flex-col md:flex-row justify-center items-center">
            <div className="flex flex-col p-10 w-full md:w-3/12">
              <span className="font-semibold text-blue-600 text-base">Total Products</span>
              <span className="font-semibold text-gray-600 dark:text-gray-300 text-base">{products.length}</span>
              <span className="font-thin text-gray-400 text-xs">Last 7 days</span>
            </div>
            <div className="flex flex-col gap-3 p-10 w-full md:w-3/12 sm:border-y-2 md:border-x-2 md:border-y-0">
              <span className="font-semibold text-yellow-600 text-base">Stores</span>
              <div className="flex gap-8">
                <div className="flex flex-col">
                  <span className="font-semibold text-gray-600 dark:text-gray-300 text-base">{stores.length}</span>
                  <span className="font-thin text-gray-400 text-xs">Last 7 days</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold text-gray-600 dark:text-gray-300 text-base">$2000</span>
                  <span className="font-thin text-gray-400 text-xs">Revenue</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-3 p-10 w-full md:w-3/12 sm:border-y-2 md:border-x-2 md:border-y-0">
              <span className="font-semibold text-purple-600 text-base">Top Selling</span>
              <div className="flex gap-8">
                <div className="flex flex-col">
                  <span className="font-semibold text-gray-600 dark:text-gray-300 text-base">5</span>
                  <span className="font-thin text-gray-400 text-xs">Last 7 days</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold text-gray-600 dark:text-gray-300 text-base">$1500</span>
                  <span className="font-thin text-gray-400 text-xs">Cost</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-3 p-10 w-full md:w-3/12 border-y-2 md:border-x-2 md:border-y-0">
              <span className="font-semibold text-red-600 text-base">Low Stocks</span>
              <div className="flex gap-8">
                <div className="flex flex-col">
                  <span className="font-semibold text-gray-600 dark:text-gray-300 text-base">12</span>
                  <span className="font-thin text-gray-400 text-xs">Ordered</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold text-gray-600 dark:text-gray-300 text-base">2</span>
                  <span className="font-thin text-gray-400 text-xs">Not in Stock</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {showProductModal && (
          <AddProduct
            addProductModalSetting={addProductModalSetting}
            handlePageUpdate={handlePageUpdate}
          />
        )}
        {showUpdateModal && (
          <UpdateProduct
            updateProductData={updateProduct}
            updateModalSetting={updateProductModalSetting}
          />
        )}

        <div className="overflow-x-auto rounded-lg border bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <div className="flex justify-between pt-5 pb-3 px-3">
            <div className="flex gap-4 justify-center items-center">
              <span className="font-bold">Products</span>
              <div className="flex justify-center items-center px-2 border-2 rounded-md">
                <img alt="search-icon" className="w-5 h-5" src={require("../assets/search-icon.png")} />
                <input
                  className="border-none outline-none focus:border-none text-xs bg-transparent text-gray-900 dark:text-white"
                  type="text"
                  placeholder="Search here"
                  value={searchTerm}
                  onChange={handleSearchTerm}
                />
              </div>
            </div>
            <div className="flex gap-4">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold p-2 text-xs rounded"
                onClick={addProductModalSetting}
              >
                Add Product
              </button>
            </div>
          </div>
          <table className="min-w-full divide-y-2 divide-gray-200 dark:divide-gray-700 text-sm">
            <thead>
              <tr>
                {["Products", "Manufacturer", "Stock", "Description", "Availibility", "More"].map((title, index) => (
                  <th key={index} className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900 dark:text-white">
                    {title}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {products.map((element) => (
                <tr key={element._id}>
                  <td className="whitespace-nowrap px-4 py-2 text-gray-900 dark:text-white">{element.name}</td>
                  <td className="whitespace-nowrap px-4 py-2 text-gray-700 dark:text-gray-300">{element.manufacturer}</td>
                  <td className="whitespace-nowrap px-4 py-2 text-gray-700 dark:text-gray-300">{element.stock}</td>
                  <td className="whitespace-nowrap px-4 py-2 text-gray-700 dark:text-gray-300">{element.description}</td>
                  <td className="whitespace-nowrap px-4 py-2 text-gray-700 dark:text-gray-300">
                    {element.stock > 0 ? "In Stock" : "Not in Stock"}
                  </td>
                  <td className="whitespace-nowrap px-4 py-2 text-gray-700 dark:text-gray-300">
                    <span
                      className="text-green-700 dark:text-green-400 cursor-pointer"
                      onClick={() => updateProductModalSetting(element)}
                    >
                      Edit
                    </span>
                    <span
                      className="text-red-600 dark:text-red-400 px-2 cursor-pointer"
                      onClick={() => deleteItem(element._id)}
                    >
                      Delete
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Inventory;