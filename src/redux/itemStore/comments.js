import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchFrom } from '../../services/axios';

export const getCommentsFromServer = createAsyncThunk(
    "comments/getCommentsFromServer",
    async () => {
        return fetchFrom({ method: 'get', url: `comments` })
    }
);
export const putCommentsFromServer = createAsyncThunk(
    "comments/putCommentsFromServer",
    async (data) => {
        return fetchFrom({ method: 'put', url: `comments/${data.id}`, requestConfig: { show: data.show, language: data.language } })
    }
);
export const deleteCommentsFromServer = createAsyncThunk(
    "comments/deleteCommentsFromServer",
    async (id) => {
        return fetchFrom({ method: 'delete', url: `comments/${id}` })
    }
);



const commentsSlice = createSlice({
    name: 'comments',
    initialState: [],
    reducers: {

        commentsLogout(state, action) {
            return []
        },
    },


    extraReducers: (builder) => {



        builder.addCase(
            getCommentsFromServer.fulfilled,
            (state, action) => {
                const sortedComments = action.payload.data.sort((a, b) => b.id - a.id);
                return sortedComments
            }

        );

        builder.addCase(
            putCommentsFromServer.fulfilled,
            (state, action) => {
                const index = state.findIndex(v => v.id === action.payload.data.id);
                state[index] = action.payload.data
            }

        );

        builder.addCase(
            deleteCommentsFromServer.fulfilled,
            (state, action) => {
                const index = state.findIndex(v => v.id === action.payload.data.deletedId);
                state.splice(index, 1)
            }

        );





    },

});

export const commentsDetail = (state) => state.comments;
export const { commentsLogout } = commentsSlice.actions

export default commentsSlice.reducer;
