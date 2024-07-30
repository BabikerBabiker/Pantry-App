"use client";
import {
  Box,
  Button,
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
  bgcolor: "white",
  borderRadius: 2,
  boxShadow: 24,
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
              sx={{ width: '100%' }}
            >
              Add
            </Button>
          </Box>
        </Box>
      </Modal>
      <Button variant="contained" onClick={handleOpen} sx={{ mt: 3 }}>
        Add Item
      </Button>
      <Box
        display="flex"
        flexDirection="column"
        border="2px solid #000"
        borderRadius={2}
        overflow="hidden"
        width="100%"
        maxWidth="800px"
        height="auto"
        maxHeight="800px"
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
                flexDirection={{ xs: 'column', sm: 'row' }}
                justifyContent={"space-between"}
                alignItems={"center"}
                bgcolor={"#f0f0f0"}
                paddingX={2}
                borderRadius={2}
                border={"1px solid #ddd"}
                gap={1}
              >
                <Box
                  flex="1"
                  display="flex"
                  justifyContent={{ xs: 'flex-start', sm: 'flex-start' }}
                  alignItems="center"
                >
                  <Typography
                    variant={"h6"}
                    color={"#000"}
                    textAlign={"left"}
                    width={{ xs: '100%', sm: 'auto' }}
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
                    Quantity: {count}
                  </Typography>
                </Box>
                <Button variant="contained" color="error" onClick={() => delItem(name)} sx={{ mt: { xs: 1, sm: 0 } }}>
                  Delete
                </Button>
              </Box>
            ))}
          </Stack>
        </Box>
      </Box>
    </Box>
  );
}