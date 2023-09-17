import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';


// export const getDollarPriceFromServer = createAsyncThunk(
//     "dollar/getDollarPriceFromServer",
//     async () => {
//         const res = await fetch("https://v6.exchangerate-api.com/v6/290b8280fe74add763d7f1bb/latest/USD");
//         return res.json()
//     }
// );




const dollarSlice = createSlice({
    name: 'dollar',
    initialState: { en: 1, fa: 42, it: 0.93, ar: 3.67, zh: 7.31 },
    reducers: {},


    extraReducers: (builder) => {


        // builder.addCase(
        //     getDollarPriceFromServer.fulfilled,
        //     (state, action) => ({
        //         en: 1,
        //         fa: action.payload.conversion_rates.IRR / 1000,
        //         it: action.payload.conversion_rates.EUR,
        //         ar: action.payload.conversion_rates.AED,
        //        zh: action.payload.conversion_rates.CNY,
        //     })
        // )

    },

});

export const dollarDetail = (state) => state.dollar;

export default dollarSlice.reducer;
