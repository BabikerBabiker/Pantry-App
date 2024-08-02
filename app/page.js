"use client";
import AddIcon from "@mui/icons-material/Add";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import RemoveIcon from "@mui/icons-material/Remove";
import {
  Box,
  Button,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { firestore } from "../firebase";

const categories = [
  "Fruits & Vegetables",
  "Dairy & Eggs",
  "Meat & Seafood",
  "Grains & Pasta",
  "Canned Goods",
  "Snacks",
  "Beverages",
  "Condiments & Spices",
  "Baking Supplies",
  "Other",
];

export default function Home() {
  const [pantry, setPantry] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState("");
  const [itemCategory, setItemCategory] = useState("");
  const [itemQuantity, setItemQuantity] = useState(1);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("name");
  const [sortDirection, setSortDirection] = useState("asc");
  const [selectedCategory, setSelectedCategory] = useState("");

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const capitalizeWords = (str) =>
    str.replace(/\b\w/g, (char) => char.toUpperCase());

  const updatePantry = async () => {
    const snapshot = query(collection(firestore, "pantry"));
    const querySnapshot = await getDocs(snapshot);
    const pantryList = querySnapshot.docs.map((doc) => ({
      name: doc.id,
      ...doc.data(),
    }));

    const filteredPantry = pantryList.filter(
      (item) =>
        item.name.toLowerCase().includes(search.toLowerCase()) &&
        (selectedCategory === "" ||
          item.category === selectedCategory ||
          selectedCategory === "All")
    );

    filteredPantry.sort((a, b) => {
      const multiplier = sortDirection === "asc" ? 1 : -1;
      if (sort === "name") {
        return multiplier * a.name.localeCompare(b.name);
      } else if (sort === "quantity") {
        return multiplier * (b.count - a.count);
      } else if (sort === "category") {
        return multiplier * a.category.localeCompare(b.category);
      }
      return 0;
    });

    setPantry(filteredPantry);
  };

  useEffect(() => {
    updatePantry();
  }, [search, sort, sortDirection, selectedCategory]);

  const addItem = async (itemName, category, quantity) => {
    const capitalizedItemName = capitalizeWords(itemName);
    const docRef = doc(collection(firestore, "pantry"), capitalizedItemName);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      const newCount = (data.count || 0) + quantity;
      await setDoc(docRef, { count: newCount, category }, { merge: true });
    } else {
      await setDoc(docRef, { count: quantity, category });
    }
    await updatePantry();
  };

  const delItem = async (itemName) => {
    const docRef = doc(collection(firestore, "pantry"), itemName);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { count } = docSnap.data();
      if (count === 1) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { count: count - 1 });
      }
    }
    await updatePantry();
  };

  const delAllItems = async () => {
    const snapshot = await getDocs(collection(firestore, "pantry"));
    const deletePromises = snapshot.docs.map((doc) => deleteDoc(doc.ref));
    await Promise.all(deletePromises);
    await updatePantry();
  };

  const removeAll = async () => {
    try {
      const snapshot = await getDocs(collection(firestore, "pantry"));

      const deletePromises = snapshot.docs.map((doc) => deleteDoc(doc.ref));

      await Promise.all(deletePromises);

      await updatePantry();
    } catch (error) {
      console.error("Error deleting all items:", error);
    }
  };

  const handleSortChange = (event) => {
    const criterion = event.target.value;
    if (sort === criterion) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSort(criterion);
      setSortDirection("asc");
    }
  };

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      px={2}
      bgcolor="#f5f5f5"
      fontFamily="Arial, sans-serif"
    >
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "90vw",
            maxWidth: 400,
            bgcolor: "#ffffff",
            borderRadius: 2,
            boxShadow: 2,
            p: 4,
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Add Item
          </Typography>
          <TextField
            label="Item"
            variant="outlined"
            fullWidth
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Quantity"
            variant="outlined"
            fullWidth
            type="number"
            value={itemQuantity}
            onChange={(e) => setItemQuantity(Number(e.target.value))}
            sx={{ mb: 2 }}
          />
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id="category-label">Category</InputLabel>
            <Select
              labelId="category-label"
              value={itemCategory}
              onChange={(e) => setItemCategory(e.target.value)}
              label="Category"
            >
              {categories.map((category, index) => (
                <MenuItem key={index} value={category}>
                  {category}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button
            variant="contained"
            onClick={() => {
              addItem(itemName, itemCategory, itemQuantity);
              setItemName("");
              setItemCategory("");
              setItemQuantity(1);
              handleClose();
            }}
            sx={{ width: "100%", backgroundColor: "#1565C0", color: "#fff" }}
          >
            Add
          </Button>
        </Box>
      </Modal>

      <Box
        width="100%"
        maxWidth="1000px"
        display="flex"
        flexDirection="column"
        bgcolor="#ffffff"
        borderRadius={2}
        boxShadow={2}
        overflow="hidden"
        maxHeight={{ xs: "400px", sm: "400px" }}
        height="calc(100vh - 80px)"
        position="relative"
      >
        {}
        <Box
          position="sticky"
          top={0}
          bgcolor="#1565C0"
          py={2}
          display="flex"
          justifyContent="center"
          alignItems="center"
          boxShadow="0 2px 4px rgba(0,0,0,0.1)"
          zIndex={1000}
        >
          <Typography
            variant="h5"
            color="#fff"
            textAlign="center"
            sx={{
              fontSize: { xs: "1.2rem", sm: "1.4rem" },
              fontWeight: "bold",
            }}
          >
            Pantry
          </Typography>
        </Box>

        {}
        <Box
          display="flex"
          flexDirection="column"
          px={2}
          py={1}
          gap={1}
          bgcolor="#e0e0e0"
          overflow="auto"
          flex={1}
        >
          {}
          <Box
            display="flex"
            flexDirection={{ xs: "column", sm: "row" }}
            gap={1}
          >
            <TextField
              label="Search"
              variant="outlined"
              size="small"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              sx={{ width: "100%", mb: 1 }}
            />
            <FormControl variant="outlined" size="small" sx={{ width: "100%" }}>
              <InputLabel id="category-select-label">Category</InputLabel>
              <Select
                labelId="category-select-label"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                label="Category"
              >
                <MenuItem value="All">All</MenuItem>
                {categories.map((category, index) => (
                  <MenuItem key={index} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          {}
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography variant="subtitle2">Sort by:</Typography>
            <FormControl size="small" variant="outlined">
              <Select
                value={sort}
                onChange={handleSortChange}
                size="small"
                minWidth="800px"
                sx={{ minWidth: { xs: 220, sm: 400, md: 400, lg: 800 } }}
              >
                <MenuItem value="name">Name</MenuItem>
                <MenuItem value="quantity">Quantity</MenuItem>
              </Select>
            </FormControl>
            <IconButton
              onClick={() =>
                setSortDirection(sortDirection === "asc" ? "desc" : "asc")
              }
              sx={{ ml: 1 }}
            >
              {sortDirection === "asc" ? (
                <ArrowUpwardIcon />
              ) : (
                <ArrowDownwardIcon />
              )}
            </IconButton>
          </Box>

          {}
          {pantry.map((item) => (
            <Box
              key={item.name}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              p={1}
              bgcolor="#fff"
              borderRadius={1}
              boxShadow={1}
              sx={{ mb: 0 }}
            >
              <Typography variant="body1" sx={{ flex: 2 }}>
                {item.name}
              </Typography>
              <Typography variant="body2" sx={{ flex: 1, textAlign: "center" }}>
                {item.count} {item.count > 1 ? "units" : "unit"}
              </Typography>
              <Box
                sx={{ flex: 1, display: "flex", justifyContent: "flex-end" }}
                minHeight={"auto"}
              >
                <IconButton
                  size="small"
                  color="success"
                  onClick={() => addItem(item.name, item.category, 1)}
                >
                  <AddIcon />
                </IconButton>
                <IconButton
                  size="small"
                  color="error"
                  onClick={() => delItem(item.name)}
                >
                  <RemoveIcon />
                </IconButton>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>

      <Button
        variant="contained"
        color="success"
        onClick={handleOpen}
        sx={{
          position: "fixed",
          bottom: { xs: 40, sm: 150 },
          right: { xs: 15, sm: 215 },
          zIndex: 1000,
          display: { xs: "block", sm: "block" },
          width: { xs: "auto", sm: "150px" },
          fontSize: { xs: "0.75rem", sm: "1rem" },
          borderRadius: { xs: "4px", sm: "8px" },
        }}
      >
        Add Item
      </Button>

      <Button
        variant="contained"
        color="error"
        onClick={removeAll}
        sx={{
          position: "fixed",
          bottom: { xs: 40, sm: 150 },
          right: { xs: 273, sm: 1068 },
          zIndex: 1000,
          display: { xs: "block", sm: "block" },
          width: { xs: "auto", sm: "150px" },
          fontSize: { xs: "0.75rem", sm: "1rem" },
          borderRadius: { xs: "4px", sm: "8px" },
        }}
      >
        Delete All
      </Button>
    </Box>
  );
}