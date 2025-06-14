import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Dimensions, Image, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BarChart, PieChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get("window").width;

const DashboardScreen = () => {
  const [saleAmount, setSaleAmount] = useState(0);
  const [purchaseAmount, setPurchaseAmount] = useState(0);
  const [stores, setStores] = useState([]);
  const [products, setProducts] = useState([]);
  const [sales, setSales] = useState([]);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const json = await AsyncStorage.getItem("user");
      const parsed = JSON.parse(json);
      if (parsed?._id) setUserId(parsed._id);
    };
    fetchUser();
  }, []);

  useEffect(() => {
    if (!userId) return;

    fetch(`http://localhost:4000/api/sales/get/${userId}/totalsaleamount`)
      .then(res => res.json())
      .then(data => setSaleAmount(data.totalSaleAmount || 0));

    fetch(`http://localhost:4000/api/purchase/get/${userId}/totalpurchaseamount`)
      .then(res => res.json())
      .then(data => setPurchaseAmount(data.totalPurchaseAmount || 0));

    fetch(`http://localhost:4000/api/store/get/${userId}`)
      .then(res => res.json())
      .then(data => setStores(data || []));

    fetch(`http://localhost:4000/api/product/get/${userId}`)
      .then(res => res.json())
      .then(data => setProducts(data || []));

    fetch(`http://localhost:4000/api/sales/get/${userId}`)
      .then(res => res.json())
      .then(data => setSales(data || []));
  }, [userId]);

  const getSalesByMonth = () => {
    const months = Array(12).fill(0);
    sales.forEach((s) => {
      const m = new Date(s.SaleDate).getMonth();
      months[m] += s.TotalSaleAmount || 0;
    });
    return months;
  };

  const getSalesByProduct = () => {
    const map = {};
    sales.forEach((s) => {
      const name = s.ProductID?.name || "Unknown";
      map[name] = (map[name] || 0) + (s.TotalSaleAmount || 0);
    });
    return map;
  };

  const productData = Object.entries(getSalesByProduct())
    .map(([name, value], i) => ({
      name,
      sales: value,
      color: ["#f39c12", "#2980b9", "#27ae60", "#e74c3c", "#8e44ad"][i % 5],
      legendFontColor: "#7F7F7F",
      legendFontSize: 12
    }));

  const barData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: [{ data: getSalesByMonth() }]
  };

  const topProducts = Object.entries(getSalesByProduct())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([name]) => name);

  return (
    <ScrollView style={styles.container}>
      {/* Logo + Title */}
      <View style={styles.headerRow}>
        <Image source={require("../assets/images/logo.png")} style={styles.logo} />
        <Text style={styles.title}>Dashboard</Text>
      </View>

      {/* KPI cards */}
      <View style={styles.kpiWrapper}>
        {[
          { label: "💶 Sales", value: `€${saleAmount}` },
          { label: "🛒 Purchase", value: `€${purchaseAmount}` },
          { label: "📦 Products", value: products.length },
          { label: "🏪 Stores", value: stores.length }
        ].map((item, idx) => (
          <View key={idx} style={styles.kpiCard}>
            <Text style={styles.kpiLabel}>{item.label}</Text>
            <Text style={styles.kpiValue}>{item.value}</Text>
          </View>
        ))}
      </View>

      {/* Charts */}
      <Text style={styles.chartTitle}>📈 Monthly Sales (€)</Text>
      <BarChart
        data={barData}
        width={screenWidth - 40}
        height={220}
        chartConfig={chartConfig}
        fromZero
        barPercentage={0.6}
        style={styles.chart}
        showValuesOnTopOfBars={false}
      />

      <Text style={styles.chartTitle}>🧁 Sales by Product</Text>
      <View style={{ alignItems: 'center' }}>
        <PieChart
          data={productData}
          width={screenWidth - 60}
          height={220}
          chartConfig={chartConfig}
          accessor="sales"
          backgroundColor="transparent"
          paddingLeft="15"
          absolute
          style={styles.chart}
        />
      </View>

      {/* Top Products */}
      <View style={styles.predictionBox}>
        <Text style={styles.predictionTitle}>🧠 Predicted Top Selling Products</Text>
        {topProducts.length ? (
          topProducts.map((prod, idx) => (
            <Text key={idx} style={styles.predictionItem}>{`${idx + 1}. ${prod}`}</Text>
          ))
        ) : (
          <Text style={styles.predictionItem}>No sales data available</Text>
        )}
      </View>
    </ScrollView>
  );
};

const chartConfig = {
  backgroundColor: "#fff",
  backgroundGradientFrom: "#f2f2f2",
  backgroundGradientTo: "#fff",
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(49, 130, 206, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 20,
    paddingHorizontal: 16,
    backgroundColor: "#ffffff"
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20
  },
  logo: {
    width: 30,
    height: 30,
    marginRight: 8
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1a202c"
  },
  kpiWrapper: {
    marginBottom: 24
  },
  kpiCard: {
    backgroundColor: "#f1f5f9",
    borderRadius: 10,
    padding: 16,
    marginBottom: 12
  },
  kpiLabel: {
    fontSize: 14,
    color: "#4b5563"
  },
  kpiValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1f2937"
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    marginVertical: 8,
    color: "#1a202c"
  },
  chart: {
    borderRadius: 12,
    marginBottom: 20
  },
  predictionBox: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: "#f9fafb",
    marginBottom: 20,
    marginHorizontal: 4
  },
  predictionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8
  },
  predictionItem: {
    fontSize: 14,
    color: "#374151"
  }
});

export default DashboardScreen;