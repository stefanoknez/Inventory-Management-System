import React, { useContext, useEffect, useState } from "react";
import Chart from "react-apexcharts";
import AuthContext from "../AuthContext";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

function Dashboard() {
  const [saleAmount, setSaleAmount] = useState("");
  const [purchaseAmount, setPurchaseAmount] = useState("");
  const [stores, setStores] = useState([]);
  const [products, setProducts] = useState([]);
  const [sales, setSales] = useState([]);

  const authContext = useContext(AuthContext);

  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  const getSalesByMonth = () => {
    const monthlySales = new Array(12).fill(0);
    sales.forEach((sale) => {
      const date = new Date(sale.SaleDate);
      const month = date.getMonth(); // 0-11
      monthlySales[month] += sale.TotalSaleAmount || 0;
    });
    return monthlySales;
  };

  const getSalesByProduct = () => {
    const productTotals = {};
    sales.forEach((sale) => {
      const productName = sale.ProductID?.name || "Unknown";
      productTotals[productName] = (productTotals[productName] || 0) + (sale.TotalSaleAmount || 0);
    });
    return productTotals;
  };

  const generateProductSalesChart = () => {
    const data = getSalesByProduct();
    const labels = Object.keys(data);
    const values = Object.values(data);
    return {
      labels,
      datasets: [
        {
          label: "Total Earned (€)",
          data: values,
          backgroundColor: [
            "#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF", "#FF9F40"
          ],
          borderWidth: 1,
        },
      ],
    };
  };

  useEffect(() => {
    fetchTotalSaleAmount();
    fetchTotalPurchaseAmount();
    fetchStoresData();
    fetchProductsData();
    fetchSalesData();
  }, []);

  const fetchTotalSaleAmount = () => {
    fetch(`http://localhost:4000/api/sales/get/${authContext.user}/totalsaleamount`)
      .then((res) => res.json())
      .then((data) => setSaleAmount(data.totalSaleAmount));
  };

  const fetchTotalPurchaseAmount = () => {
    fetch(`http://localhost:4000/api/purchase/get/${authContext.user}/totalpurchaseamount`)
      .then((res) => res.json())
      .then((data) => setPurchaseAmount(data.totalPurchaseAmount));
  };

  const fetchStoresData = () => {
    fetch(`http://localhost:4000/api/store/get/${authContext.user}`)
      .then((res) => res.json())
      .then((data) => setStores(data));
  };

  const fetchProductsData = () => {
    fetch(`http://localhost:4000/api/product/get/${authContext.user}`)
      .then((res) => res.json())
      .then((data) => setProducts(data));
  };

  const fetchSalesData = () => {
    fetch(`http://localhost:4000/api/sales/get/${authContext.user}`)
      .then((res) => res.json())
      .then((data) => setSales(data));
  };

  const barChartConfig = {
    options: {
      chart: { id: "sales-bar", foreColor: "#ccc" },
      xaxis: { categories: months },
      yaxis: {
        labels: {
          formatter: function (value) {
            return `€${value}`;
          },
        },
      },
      title: {
        text: "Monthly Sales in €",
        style: {
          fontSize: "16px",
          color: "#fff",
        },
      },
    },
    series: [
      {
        name: "Sales (€)",
        data: getSalesByMonth(),
      },
    ],
  };

  const topProducts = Object.entries(getSalesByProduct())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([name]) => name);

  return (
    <div className="w-full dark:bg-gray-900 bg-gray-100 px-4 py-6 text-gray-900 dark:text-white">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Sales", value: `€${saleAmount}`, color: "green" },
          { label: "Purchase", value: `€${purchaseAmount}`, color: "red" },
          { label: "Total Products", value: products.length, color: "blue" },
          { label: "Total Stores", value: stores.length, color: "purple" },
        ].map((item, idx) => (
          <article key={idx} className={`flex flex-col gap-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow`}>
            <div className={`inline-flex gap-2 self-end rounded bg-${item.color}-100 text-${item.color}-600 p-1`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
              </svg>
              <span className="text-xs font-medium">67.81%</span>
            </div>
            <div>
              <strong className="block text-sm font-medium text-gray-500 dark:text-gray-300">
                {item.label}
              </strong>
              <p><span className="text-2xl font-medium text-gray-900 dark:text-white">
                {item.value}
              </span></p>
            </div>
          </article>
        ))}
      </div>

      {/* Charts */}
      <div className="flex flex-col lg:flex-row justify-around items-center bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg py-8 mt-6 gap-6">
        <div>
          <Chart
            options={barChartConfig.options}
            series={barChartConfig.series}
            type="bar"
            width="500"
          />
        </div>
        <div>
          <Doughnut data={generateProductSalesChart()} />
        </div>
      </div>

      {/* AI Prediction */}
      <div className="mt-6 p-4 bg-white dark:bg-gray-800 rounded shadow">
        <h3 className="text-lg font-semibold dark:text-white mb-2">
          📊 Predicted Top Selling Products
        </h3>
        <ul className="list-decimal pl-6 text-sm text-gray-800 dark:text-gray-300">
          {topProducts.length > 0 ? (
            topProducts.map((product, idx) => (
              <li key={idx}>{product}</li>
            ))
          ) : (
            <li className="list-none">No sales data available.</li>
          )}
        </ul>
      </div>
    </div>
  );
}

export default Dashboard;