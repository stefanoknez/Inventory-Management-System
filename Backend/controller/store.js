const Store = require("../models/store");

// Add Store
const addStore = async (req, res) => {
    console.log(req.body)
  const addStore = await new Store({
    userID : req.body.userId,
    name: req.body.name,
    category: req.body.category,
    address: req.body.address,
    city: req.body.city,
    image: req.body.image
  });

  addStore.save().then((result) => {
      res.status(200).send(result);
    })
    .catch((err) => {
      res.status(402).send(err);
    });
};

// Get All Stores
const getAllStores = async (req, res) => {
  try {
    console.log("📥 Requested userID:", req.params.userID); // <--- dodatak

    const findAllStores = await Store.find({ userID: req.params.userID }).sort({ _id: -1 });

    console.log("📤 Found stores:", findAllStores.length); // <--- dodatak
    res.json(findAllStores);
  } catch (error) {
    console.error("❌ Error fetching stores:", error);
    res.status(500).json({ message: "Server error while fetching stores" });
  }
};

const deleteStore = async (req, res) => {
  try {
    const result = await Store.deleteOne({ _id: req.params.id });
    res.status(200).json({ message: "Store deleted", result });
  } catch (error) {
    console.error("Error deleting store:", error);
    res.status(500).json({ message: "Failed to delete store" });
  }
};


module.exports = { addStore, getAllStores, deleteStore };
