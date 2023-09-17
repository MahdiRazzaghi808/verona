import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchFrom } from '../../services/axios';

export const getFoodsFromServer = createAsyncThunk(
    "foods/getFoodsFromServer",
    async () => {
        return fetchFrom({ method: 'get', url: `foods` })
    }
);

export const postFoodsFromServer = createAsyncThunk(
    "foods/postFoodsFromServer",
    async (data) => {
        return fetchFrom({ method: 'post', url: `foods`, requestConfig: { ...data } })
    }
);

export const putFoodsFromServer = createAsyncThunk(
    "foods/putFoodsFromServer",
    async (data) => {
        return fetchFrom({ method: 'put', url: `foods/${data.id}`, requestConfig: { ...data } })
    }
);

export const deleteFoodsFromServer = createAsyncThunk(
    "foods/deleteFoodsFromServer",
    async (id) => {
        return fetchFrom({ method: 'delete', url: `foods/${id}` })
    }
);



const foodsSlice = createSlice({
    name: 'foods',
    initialState: [],
    reducers: {
        foodsLogout(state, action) {
            return []
        },
    },


    extraReducers: (builder) => {



        builder.addCase(
            getFoodsFromServer.fulfilled,
            (state, action) => {
                const sortedComments = action.payload.data.sort((a, b) => b.id - a.id);
                return sortedComments
            }

        );

        builder.addCase(
            putFoodsFromServer.fulfilled,
            (state, action) => {
                const index = state.findIndex(v => v.id === action.payload.data.id);
                state[index] = action.payload.data
            }

        );

        builder.addCase(
            deleteFoodsFromServer.fulfilled,
            (state, action) => {
                const index = state.findIndex(v => v.id === action.payload.data.deletedId);
                index !== -1 && state.splice(index, 1)
            }

        );
        builder.addCase(
            postFoodsFromServer.fulfilled,
            (state, action) => {
                return [action.payload.data, ...state]
            }

        );





    },

});

export const foodsDetail = (state) => state.foods;
export const { foodsLogout } = foodsSlice.actions

export default foodsSlice.reducer;
