"use client";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
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
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("name");
  const [sortDirection, setSortDirection] = useState("asc");
  const [selectedCategory, setSelectedCategory] = useState("");

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

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

  const addItem = async (itemName, category) => {
    const docRef = doc(collection(firestore, "pantry"), itemName);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      const newCount = (data.count || 0) + 1;
      await setDoc(docRef, { count: newCount, category }, { merge: true });
    } else {
      await setDoc(docRef, { count: 1, category });
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

  const delAllItems = async (itemName) => {
    const docRef = doc(collection(firestore, "pantry"), itemName);
    await deleteDoc(docRef);
    await updatePantry();
  };

  const handleSortChange = (event) => {
    const criterion = event.target.value;
    if (criterion === "category") {
      setSelectedCategory("");
    } else {
      setSelectedCategory("");
    }
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
              addItem(itemName, itemCategory);
              setItemName("");
              setItemCategory("");
              handleClose();
            }}
            sx={{ width: "100%", backgroundColor: "#936c82", color: "#fff" }}
          >
            Add
          </Button>
        </Box>
      </Modal>

      <Box
        display="flex"
        flexDirection="column"
        border="2px solid #000"
        borderRadius={2}
        overflow="hidden"
        width="100%"
        maxWidth={{ xs: "100%", sm: "80%", md: "70%", lg: "60%" }}
        height="auto"
        maxHeight={{ xs: "450px", sm: "450px", md: "700px", lg: "700px" }}
        bgcolor="#ffffff"
        sx={{ boxShadow: 2 }}
      >
        <Box
          width="100%"
          height="auto"
          bgcolor="#936c82"
          borderBottom="2px solid #000"
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          borderTopLeftRadius={2}
          borderTopRightRadius={2}
          px={2}
          py={1}
          position="sticky"
          top={0}
          zIndex={1}
          gap={1}
        >
          <Typography
            variant="h5"
            color="#fff"
            textAlign="center"
            sx={{ fontSize: { xs: "1.2rem", sm: "1.5rem" } }}
          >
            Pantry
          </Typography>
          <Box
            display="flex"
            flexDirection="row"
            flexWrap="wrap"
            gap={1}
            justifyContent="center"
            alignItems="center"
            width="100%"
          >
            <Button
              variant="contained"
              onClick={handleOpen}
              sx={{
                backgroundColor: "#4caf50",
                color: "#fff",
                flex: "1 1 auto",
                minWidth: 100,
              }}
            >
              Add Item
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={() => {
                pantry.forEach((item) => delAllItems(item.name));
              }}
              sx={{
                backgroundColor: "#f44336",
                color: "#fff",
                flex: "1 1 auto",
                minWidth: 100,
              }}
            >
              Delete All
            </Button>
            <TextField
              label="Search"
              variant="outlined"
              size="small"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              sx={{
                flex: "1 1 auto",
                maxWidth: 200,
                backgroundColor: "#ffffff",
              }}
            />
            <FormControl
              size="small"
              sx={{
                flex: "1 1 auto",
                maxWidth: 200,
                backgroundColor: "#ffffff",
              }}
            >
              <InputLabel>Sort By</InputLabel>
              <Select
                value={sort}
                onChange={handleSortChange}
                label="Sort By"
                sx={{ backgroundColor: "#ffffff" }}
              >
                <MenuItem value="name">Name</MenuItem>
                <MenuItem value="quantity">Quantity</MenuItem>
              </Select>
            </FormControl>
            <FormControl
              size="small"
              sx={{
                flex: "1 1 auto",
                maxWidth: 200,
                backgroundColor: "#ffffff",
              }}
            >
              <InputLabel>Category</InputLabel>
              <Select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                label="Category"
                sx={{ backgroundColor: "#ffffff" }}
              >
                <MenuItem value="">All</MenuItem>
                {categories.map((category, index) => (
                  <MenuItem key={index} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </Box>

        <Box width="100%" maxHeight="calc(100vh - 200px)" overflow="auto" p={2}>
          {pantry.map((item) => (
            <Box
              key={item.name}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              borderBottom="1px solid #ddd"
              p={2}
              sx={{ ":last-child": { borderBottom: "none" } }}
            >
              <Typography
                variant="body1"
                flex={1}
                noWrap
                sx={{ textTransform: "capitalize" }}
              >
                {item.name}
              </Typography>
              <Typography variant="body1" flex={1} textAlign="center">
                {item.count}
              </Typography>
              <Box display="flex" alignItems="center" gap={1}>
                <IconButton
                  onClick={() => addItem(item.name, item.category)}
                  color="success"
                >
                  <AddIcon />
                </IconButton>
                <IconButton onClick={() => delItem(item.name)} color="error">
                  <RemoveIcon />
                </IconButton>
                <IconButton
                  onClick={() => delAllItems(item.name)}
                  color="error"
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}