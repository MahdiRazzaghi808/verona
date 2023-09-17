import { createSlice } from '@reduxjs/toolkit';


const themeSlice = createSlice({
    name: 'theme',
    initialState: JSON.parse(localStorage.getItem("theme")),
    reducers: {
        themePanel(state, action) {
            localStorage.setItem("theme", action.payload);
            return action.payload

        }
    },

});

export const themeDetail = (state) => state.theme;
export const { themePanel } = themeSlice.actions
export default themeSlice.reducer;
