import React, { useState, useEffect, useContext } from "react";
import AddSale from "../components/AddSale";
import AuthContext from "../AuthContext";

function Sales() {
  const [showSaleModal, setShowSaleModal] = useState(false);
  const [sales, setAllSalesData] = useState([]);
  const [products, setAllProducts] = useState([]);
  const [stores, setAllStores] = useState([]);
  const [updatePage, setUpdatePage] = useState(true);

  const authContext = useContext(AuthContext);

  useEffect(() => {
    fetchSalesData();
    fetchProductsData();
    fetchStoresData();
  }, [updatePage]);

  const fetchSalesData = () => {
    fetch(`http://localhost:4000/api/sales/get/${authContext.user}`)
      .then((response) => response.json())
      .then((data) => {
        setAllSalesData(data);
      })
      .catch((err) => console.log(err));
  };

  const fetchProductsData = () => {
    fetch(`http://localhost:4000/api/product/get/${authContext.user}`)
      .then((response) => response.json())
      .then((data) => {
        setAllProducts(data);
      })
      .catch((err) => console.log(err));
  };

  const fetchStoresData = () => {
    fetch(`http://localhost:4000/api/store/get/${authContext.user}`)
      .then((response) => response.json())
      .then((data) => {
        setAllStores(data);
      });
  };

  const addSaleModalSetting = () => {
    setShowSaleModal(!showSaleModal);
  };

  const handlePageUpdate = () => {
    setUpdatePage(!updatePage);
  };

  return (
    <div className="col-span-12 lg:col-span-10 flex justify-center">
      <div className="flex flex-col gap-5 w-11/12">
        {showSaleModal && (
          <AddSale
            addSaleModalSetting={addSaleModalSetting}
            products={products}
            stores={stores}
            handlePageUpdate={handlePageUpdate}
            authContext={authContext}
          />
        )}
        <div className="overflow-x-auto rounded-lg border bg-white border-gray-200 dark:bg-gray-800 dark:border-gray-700">
          <div className="flex justify-between pt-5 pb-3 px-3">
            <div className="flex gap-4 justify-center items-center">
              <span className="font-bold text-gray-800 dark:text-white">Sales</span>
            </div>
            <div className="flex gap-4">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold p-2 text-xs rounded"
                onClick={addSaleModalSetting}
              >
                Add Sales
              </button>
            </div>
          </div>
          <table className="min-w-full divide-y-2 divide-gray-200 dark:divide-gray-700 text-sm">
            <thead>
              <tr>
                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900 dark:text-white">Product Name</th>
                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900 dark:text-white">Store Name</th>
                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900 dark:text-white">Stock Sold</th>
                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900 dark:text-white">Sales Date</th>
                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900 dark:text-white">Total Sale Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {sales.map((element) => (
                <tr key={element._id}>
                  <td className="whitespace-nowrap px-4 py-2 text-gray-900 dark:text-white">{element.ProductID?.name}</td>
                  <td className="whitespace-nowrap px-4 py-2 text-gray-700 dark:text-gray-300">{element.StoreID?.name}</td>
                  <td className="whitespace-nowrap px-4 py-2 text-gray-700 dark:text-gray-300">{element.StockSold}</td>
                  <td className="whitespace-nowrap px-4 py-2 text-gray-700 dark:text-gray-300">{element.SaleDate}</td>
                  <td className="whitespace-nowrap px-4 py-2 text-gray-700 dark:text-gray-300">${element.TotalSaleAmount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Sales;