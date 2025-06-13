// ✅ NotificationDropdown.js
import React, { useEffect, useState } from "react";

export default function NotificationDropdown({ userId }) {
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [dismissedIds, setDismissedIds] = useState(
    JSON.parse(localStorage.getItem("dismissedNotifications")) || []
  );

  useEffect(() => {
    fetch(`http://localhost:4000/api/product/low-stock/${userId}`)
      .then((res) => res.json())
      .then((data) => setLowStockProducts(data))
      .catch((err) => console.error(err));
  }, [userId]);

  const dismissNotification = (id) => {
    const updated = [...dismissedIds, id];
    setDismissedIds(updated);
    localStorage.setItem("dismissedNotifications", JSON.stringify(updated));
  };

  const filteredNotifications = lowStockProducts.filter(
    (item) => !dismissedIds.includes(item._id)
  );

  return (
    <div className="py-1">
      {filteredNotifications.length === 0 ? (
        <p className="px-4 py-2 text-sm text-gray-700">
          No low stock items.
        </p>
      ) : (
        filteredNotifications.map((product) => (
          <div
            key={product._id}
            className="px-4 py-2 text-sm text-gray-700 border-b flex justify-between items-center"
          >
            <span>{product.name} - Only {product.stock} left</span>
            <button
              onClick={() => dismissNotification(product._id)}
              className="text-red-500 text-xs ml-2 hover:underline"
            >
              ❌
            </button>
          </div>
        ))
      )}
    </div>
  );
}