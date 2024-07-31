import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import { Box, Button, Divider, FormControl, IconButton, InputBase, InputLabel, MenuItem, OutlinedInput, Select } from "@mui/material";
import { useState } from "react";

const NavBar = ({ onAdd, onSearch, onSort }) => {
  const [sortOption, setSortOption] = useState('');
  const [searchText, setSearchText] = useState('');

  const handleSortMenuClose = (option) => {
    setSortOption(option);
    onSort(option);
  };

  const handleSearch = () => {
    onSearch(searchText);
  };

  return (
    <Box
      width="100%"
      display="flex"
      flexDirection="column"
      alignItems="center"
      bgcolor="#936c82"
      color="#fff"
      p={2}
      borderBottom="2px solid #000"
      sx={{ position: 'relative', mb: 2 }}
    >
      <Box display="flex" width="100%" maxWidth="1000px" alignItems="center" justifyContent="space-between">
        <Button
          variant="contained"
          onClick={onAdd}
          startIcon={<AddIcon />}
          sx={{ backgroundColor: "#fff", color: "#936c82", '&:hover': { backgroundColor: "#f5f5f5" } }}
        >
          Add Item
        </Button>
        <Box display="flex" alignItems="center" gap={2}>
          <FormControl variant="outlined" sx={{ minWidth: 150 }}>
            <InputLabel>Sort</InputLabel>
            <Select
              value={sortOption}
              onChange={(e) => handleSortMenuClose(e.target.value)}
              input={<OutlinedInput label="Sort" />}
              sx={{ bgcolor: '#fff' }}
            >
              <MenuItem value="nameAsc">Name Ascending</MenuItem>
              <MenuItem value="nameDesc">Name Descending</MenuItem>
              <MenuItem value="quantityAsc">Quantity Ascending</MenuItem>
              <MenuItem value="quantityDesc">Quantity Descending</MenuItem>
            </Select>
          </FormControl>
          <Divider orientation="vertical" flexItem />
          <Box display="flex" alignItems="center" gap={1}>
            <InputBase
              placeholder="Search by item name"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              sx={{ bgcolor: "#fff", borderRadius: 1, padding: '2px 10px', width: 200 }}
            />
            <IconButton onClick={handleSearch} sx={{ backgroundColor: "#fff", color: "#936c82", '&:hover': { backgroundColor: "#f5f5f5" } }}>
              <SearchIcon />
            </IconButton>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default NavBar;