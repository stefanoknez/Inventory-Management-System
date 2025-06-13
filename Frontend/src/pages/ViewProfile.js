import React, { useEffect, useState } from "react";

function ViewProfile() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    imageUrl: "",
  });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      setForm({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        imageUrl: user.imageUrl || "",
      });
    }
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setForm((prev) => ({ ...prev, imageUrl: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    localStorage.setItem("user", JSON.stringify(form));
    alert("Profile updated locally!");
    window.location.reload(); // da se promjene odraze u Header-u
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white dark:bg-gray-800 shadow rounded">
      <h2 className="text-xl font-bold mb-4 dark:text-white">My Profile</h2>

      <div className="flex flex-col items-center gap-3 mb-4">
        <img
          src={form.imageUrl}
          alt="Profile"
          className="w-24 h-24 rounded-full object-cover border"
        />
        <input type="file" accept="image/*" onChange={handleImageChange} />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium dark:text-white">First Name</label>
        <input
          name="firstName"
          value={form.firstName}
          onChange={handleChange}
          className="w-full p-2 border rounded mt-1 dark:bg-gray-700 dark:text-white"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium dark:text-white">Last Name</label>
        <input
          name="lastName"
          value={form.lastName}
          onChange={handleChange}
          className="w-full p-2 border rounded mt-1 dark:bg-gray-700 dark:text-white"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium dark:text-white">Email</label>
        <input
          name="email"
          value={form.email}
          onChange={handleChange}
          className="w-full p-2 border rounded mt-1 dark:bg-gray-700 dark:text-white"
        />
      </div>

      <div className="flex justify-end gap-4">
        <button
          onClick={handleSave}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Save Changes
        </button>
        <button
          onClick={() => window.history.back()}
          className="text-gray-600 dark:text-gray-300 hover:underline"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

export default ViewProfile;