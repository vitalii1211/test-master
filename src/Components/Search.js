import React from 'react';
import TextField from "@mui/material/TextField";

function Search({ searchItem, setSearchItem }) {

    return (
        <TextField
            sx={{ mt: 3, mr: 2}}
            size="small"
            label="Найти..."
            value={searchItem}
            onChange={(e) => setSearchItem(e.target.value)}
        />
    );
}

export default Search;