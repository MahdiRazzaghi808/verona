import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchFrom } from '../../services/axios';

export const getOrdersFromServer = createAsyncThunk(
    "orders/getOrdersFromServer",
    async () => {
        return fetchFrom({ method: 'get', url: `order` })
    }
);
export const putOrdersFromServer = createAsyncThunk(
    "orders/putOrdersFromServer",
    async (id) => {
        return fetchFrom({ method: 'put', url: `order/${id}`, requestConfig: { done: true } })
    }
);
export const deleteOrdersFromServer = createAsyncThunk(
    "orders/deleteOrdersFromServer",
    async (id) => {
        return fetchFrom({ method: 'delete', url: `order/${id}` })
    }
);



const ordersSlice = createSlice({
    name: 'orders',
    initialState: [],
    reducers: {
        orderLogout(state, action) {
            return []
        },
    },


    extraReducers: (builder) => {



        builder.addCase(
            getOrdersFromServer.fulfilled,
            (state, action) => {
                const sortedComments = action.payload.data.sort((a, b) => b.id - a.id);
                return sortedComments
            }

        );

        builder.addCase(
            putOrdersFromServer.fulfilled,
            (state, action) => {
                const index = state.findIndex(v => v.id === action.payload.data.id);
                state[index] = action.payload.data
            }

        );

        builder.addCase(
            deleteOrdersFromServer.fulfilled,
            (state, action) => {
                const index = state.findIndex(v => v.id === action.payload.data.deletedId);
                state.splice(index, 1)
            }

        );





    },

});

export const ordersDetail = (state) => state.orders;
export const { orderLogout } = ordersSlice.actions

export default ordersSlice.reducer;
