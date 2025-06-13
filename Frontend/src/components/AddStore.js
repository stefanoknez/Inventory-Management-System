import { Fragment, useRef, useState, useContext } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { PlusIcon } from "@heroicons/react/24/outline";
import UploadImage from "./UploadImage";
import AuthContext from "../AuthContext";

export default function AddStore({ handlePageUpdate }) {
  const authContext = useContext(AuthContext);
  const [form, setForm] = useState({
    userId: authContext.user,
    name: "",
    category: "Electronics",
    address: "",
    city: "",
    image: "",
  });

  const [open, setOpen] = useState(true);
  const cancelButtonRef = useRef(null);

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const uploadImage = async (image) => {
    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset", "inventoryapp");

    await fetch("https://api.cloudinary.com/v1_1/ddhayhptm/image/upload", {
      method: "POST",
      body: data,
    })
      .then((res) => res.json())
      .then((data) => {
        setForm({ ...form, image: data.url });
        alert("Store Image Successfully Uploaded");
      })
      .catch((error) => console.log(error));
  };

  const addProduct = () => {
    fetch("http://localhost:4000/api/store/add", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(form),
    })
      .then((res) => res.json())
      .then(() => {
        alert("STORE ADDED");
        handlePageUpdate();
        setOpen(false);
      })
      .catch((err) => console.log(err));
  };

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        initialFocus={cancelButtonRef}
        onClose={setOpen}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 text-left shadow-xl transition-all sm:w-full sm:max-w-lg">
                <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6">
                  <Dialog.Title className="text-lg font-semibold text-gray-900 dark:text-white">
                    Store Information
                  </Dialog.Title>
                  <form className="grid gap-4 mb-4 sm:grid-cols-2">
                    <div>
                      <label className="block mb-2 text-sm font-medium dark:text-white">Name</label>
                      <input
                        name="name"
                        value={form.name}
                        onChange={handleInputChange}
                        className="input dark:bg-gray-700 dark:text-white"
                        placeholder="Enter Store Name"
                      />
                    </div>
                    <div>
                      <label className="block mb-2 text-sm font-medium dark:text-white">City</label>
                      <input
                        name="city"
                        value={form.city}
                        onChange={handleInputChange}
                        className="input dark:bg-gray-700 dark:text-white"
                        placeholder="Enter City Name"
                      />
                    </div>
                    <div>
                      <label className="block mb-2 text-sm font-medium dark:text-white">Category</label>
                      <select
                        name="category"
                        value={form.category}
                        onChange={handleInputChange}
                        className="input dark:bg-gray-700 dark:text-white"
                      >
                        <option value="Electronics">Electronics</option>
                        <option value="Groceries">Groceries</option>
                        <option value="Wholesale">Wholesale</option>
                        <option value="SuperMart">SuperMart</option>
                        <option value="Phones">Phones</option>
                      </select>
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block mb-2 text-sm font-medium dark:text-white">Address</label>
                      <textarea
                        name="address"
                        value={form.address}
                        onChange={handleInputChange}
                        className="input dark:bg-gray-700 dark:text-white"
                        placeholder="Write address..."
                        rows="3"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <UploadImage uploadImage={uploadImage} />
                    </div>
                  </form>
                </div>
                <div className="bg-gray-50 dark:bg-gray-900 px-4 py-3 sm:flex sm:justify-end gap-2">
                  <button onClick={addProduct} className="btn-primary">
                    Add Store
                  </button>
                  <button
                    onClick={() => setOpen(false)}
                    ref={cancelButtonRef}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}