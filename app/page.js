"use client";
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import RemoveIcon from '@mui/icons-material/Remove';
import {
  Box,
  Button,
  IconButton,
  Modal,
  Stack,
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

const style = {
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
};

export default function Home() {
  const [pantry, setPantry] = useState([]);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [itemName, setItemName] = useState("");

  const updatePantry = async () => {
    const snapshot = query(collection(firestore, "pantry"));
    const docs = await getDocs(snapshot);
    const pantryList = [];
    docs.forEach((doc) => {
      pantryList.push({ name: doc.id, ...doc.data() });
    });
    console.log(pantryList);
    setPantry(pantryList);
  };

  useEffect(() => {
    updatePantry();
  }, []);

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, "pantry"), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { count } = docSnap.data();
      await setDoc(docRef, { count: count + 1 });
    } else {
      await setDoc(docRef, { count: 1 });
    }
    await updatePantry();
  };

  const delItem = async (item) => {
    const docRef = doc(collection(firestore, "pantry"), item);
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

  const delAllItems = async (item) => {
    const docRef = doc(collection(firestore, "pantry"), item);
    await deleteDoc(docRef);
    await updatePantry();
  };

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      gap="10px"
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
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Add Item
          </Typography>
          <Box sx={{ width: '100%' }}>
            <TextField
              id="outlined-basic"
              label="Item"
              variant="outlined"
              fullWidth
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              sx={{ mb: { xs: 3, sm: 2 } }}
            />
            <Button
              variant="contained"
              onClick={() => {
                addItem(itemName);
                setItemName("");
                handleClose();
              }}
              sx={{ width: '100%', backgroundColor: "#936c82", color: "#fff" }}
            >
              Add
            </Button>
          </Box>
        </Box>
      </Modal>
      <Button
        variant="contained"
        onClick={handleOpen}
        sx={{ mt: 3, backgroundColor: "#936c82", color: "#fff" }}
      >
        Add Item
      </Button>
      <Box
        display="flex"
        flexDirection="column"
        border="2px solid #000"
        borderRadius={2}
        overflow="hidden"
        width="100%"
        maxWidth={{ xs: "100%", sm: "80%", md: "70%", lg: "60%" }}
        height="auto"
        maxHeight={{ xs: "400px", sm: "400px", md: "700px", lg: "700px" }}
        bgcolor="#ffffff"
      >
        <Box
          width="100%"
          height="60px"
          bgcolor="#936c82"
          borderBottom="2px solid #000"
          display="flex"
          justifyContent="center"
          alignItems="center"
          borderTopLeftRadius={2}
          borderTopRightRadius={2}
          px={2}
          position="sticky"
          top={0}
          zIndex={1}
        >
          <Typography
            variant="h5"
            color="#fff"
            textAlign="center"
            margin={0}
          >
            Pantry Items
          </Typography>
        </Box>
        <Box
          flex="1"
          overflow="auto"
          p={2}
        >
          <Stack
            width="100%"
            spacing={2}
          >
            {pantry.map(({ name, count }) => (
              <Box
                key={name}
                width="100%"
                minHeight="80px"
                display={"flex"}
                flexDirection="row"
                justifyContent={"space-between"}
                alignItems={"center"}
                bgcolor={"#f0f0f0"}
                paddingX={2}
                paddingY={1}
                borderRadius={0}
                border={"1px solid #ddd"}
                gap={1}
              >
                <Box
                  flex="2"
                  display="flex"
                  justifyContent={"flex-start"}
                  alignItems="center"
                >
                  <Typography
                    variant={"h6"}
                    color={"#000"}
                    textAlign={"left"}
                    width="auto"
                    whiteSpace="nowrap"
                  >
                    {name.charAt(0).toUpperCase() + name.slice(1)}
                  </Typography>
                </Box>
                <Box
                  flex="1"
                  display="flex"
                  justifyContent={"center"}
                  alignItems="center"
                >
                  <Typography variant={"body1"} color={"#555"}>
                    {count}
                  </Typography>
                </Box>
                <Box
                  flex="2"
                  display="flex"
                  justifyContent={"flex-end"}
                  alignItems="center"
                >
                  <IconButton
                    onClick={() => addItem(name)}
                    sx={{ marginRight: 1, color: "#0B6623" }}
                  >
                    <AddIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => delItem(name)}
                    sx={{ marginRight: 1, color: "#8B0000" }}
                  >
                    <RemoveIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => delAllItems(name)}
                    sx={{ color: "#8B0000" }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </Box>
            ))}
          </Stack>
        </Box>
      </Box>
    </Box>
  );
}
