import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchFrom } from '../../services/axios';



export const getCartFromServer = createAsyncThunk(
    "cart/getCartFromServer",
    async (id) => {
        return fetchFrom({ method: 'get', url: `/carts/user?token=${id}` })
    }
);


export const createInCart = createAsyncThunk(
    "cart/createInCart",
    async (data) => {
        return fetchFrom({ method: 'put', url: `carts/update?token=${data[0]}&foodId=${data[1]}&changeAmount=1` })
    }
);

export const countPlus = createAsyncThunk(
    "cart/countPlus",
    async (data) => {
        return fetchFrom({ method: 'put', url: `carts/update?token=${data[0]}&foodId=${data[1]}&changeAmount=1` })
    }
);

export const countMinus = createAsyncThunk(
    "cart/countMinus",
    async (data) => {
        return fetchFrom({ method: 'put', url: `carts/update?token=${data[0]}&foodId=${data[1]}&changeAmount=-1` })
    }
);


export const removeFoodInCart = createAsyncThunk(
    "cart/removeFoodInCart",
    async (data) => {
        return fetchFrom({ method: 'put', url: `carts/update?token=${data[0]}&foodId=${data[1]}&changeAmount=-100` })
    }
);
export const clearAll = createAsyncThunk(
    "cart/clearAll",
    async (token) => {

        return fetchFrom({
            method: 'put', url: `carts/reset?token=${token}`
        })
    }
);



const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        cart: [],
        summary: {
            total: 0,
            discount: 0,
            final: 0
        }
    },
    reducers: {
        cartLogout(state, action) {
            return {
                cart: [],
                summary: {
                    total: 0,
                    discount: 0,
                    final: 0
                }
            }
        },


    },


    extraReducers: (builder) => {

        builder.addCase(
            getCartFromServer.fulfilled,
            (state, action) => {
                if (action.payload.data.cart && action.payload.data.cart.length) {
                    return action.payload.data
                } else {
                    return {
                        cart: [],
                        summary: {
                            total: 0,
                            discount: 0,
                            final: 0
                        }
                    }
                }

            }
        )

        builder.addCase(
            createInCart.fulfilled,
            (state, action) => (action.payload.data)
        )

        builder.addCase(
            countPlus.fulfilled,
            (state, action) => (action.payload.data)
        )

        builder.addCase(
            countMinus.fulfilled,
            (state, action) => (action.payload.data)
        )

        builder.addCase(
            removeFoodInCart.fulfilled,
            (state, action) => (action.payload.data)
        )

        builder.addCase(
            clearAll.fulfilled,
            (state, action) => (action.payload.data)
        )



    },

});

export const cartDetail = (state) => state.cart;
export const { cartLogout } = cartSlice.actions

export default cartSlice.reducer;
