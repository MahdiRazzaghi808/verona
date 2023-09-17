import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchFrom } from '../../services/axios';



export const getDiscountFromServer = createAsyncThunk(
    "discount/getDiscountFromServer",
    async () => {
        return fetchFrom({ method: 'get', url: `discount` })
    }
);

export const postDiscountFromServer = createAsyncThunk(
    "discount/postDiscountFromServer",
    async (data) => {
        console.log(data);
        return fetchFrom({ method: 'post', url: `discount`, requestConfig: data })
    }
);


export const deleteDiscountFromServer = createAsyncThunk(
    "discount/deleteDiscountFromServer",
    async (id) => {
        return fetchFrom({ method: 'delete', url: `discount/${id}` })
    }
);



const discountSlice = createSlice({
    name: 'discount',
    initialState: [],
    reducers: {
        discountLogout(state, action) {
            return []
        },
    },


    extraReducers: (builder) => {



        builder.addCase(
            getDiscountFromServer.fulfilled,
            (state, action) => {
                const sortedComments = action.payload.data.sort((a, b) => b.id - a.id);
                return sortedComments
            }

        );

        builder.addCase(
            postDiscountFromServer.fulfilled,
            (state, action) => {
                return [action.payload.data, ...state];
            }
        );

        builder.addCase(
            deleteDiscountFromServer.fulfilled,
            (state, action) => {
                const index = state.findIndex(v => v.id === action.payload.data.deletedId);
                state.splice(index, 1)
            }

        );





    },

});

export const discountDetail = (state) => state.discount;
export const { discountLogout } = discountSlice.actions

export default discountSlice.reducer;
