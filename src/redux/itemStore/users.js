import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchFrom } from '../../services/axios';

export const getUsersFromServer = createAsyncThunk(
    "users/getUsersFromServer",
    async () => {
        return fetchFrom({ method: 'get', url: `users` })
    }
);

export const postUsersFromServer = createAsyncThunk(
    "users/postUsersFromServer",
    async (data) => {
        return fetchFrom({ method: 'post', url: `users`, requestConfig: { ...data } })
    }
);

export const putUsersFromServer = createAsyncThunk(
    "users/putUsersFromServer",
    async (data) => {
        return fetchFrom({ method: 'put', url: `users/${data.id}`, requestConfig: { ...data } })
    }
);

export const deleteUsersFromServer = createAsyncThunk(
    "users/deleteUsersFromServer",
    async (id) => {
        return fetchFrom({ method: 'delete', url: `users/${id}` })
    }
);



const usersSlice = createSlice({
    name: 'users',
    initialState: [],
    reducers: {
        postUser(state, action) {
            state.push(action.payload)
        },

        usersLogout(state, action) {
            return []
        },

    },


    extraReducers: (builder) => {



        builder.addCase(
            getUsersFromServer.fulfilled,
            (state, action) => {
                const sortedComments = action.payload.data.sort((a, b) => b.id - a.id);
                return sortedComments
            }

        );

        builder.addCase(
            putUsersFromServer.fulfilled,
            (state, action) => {
                const index = state.findIndex(v => v.id === action.payload.data.id);
                state[index] = action.payload.data
            }

        );

        builder.addCase(
            deleteUsersFromServer.fulfilled,
            (state, action) => {
                const index = state.findIndex(v => v.id === action.payload.data.deletedId);
                index !== -1 && state.splice(index, 1)
            }

        );
        builder.addCase(
            postUsersFromServer.fulfilled,
            (state, action) => {
                return [action.payload.data, ...state];
            }

        );





    },

});

export const usersDetail = (state) => state.users;
export const { postUser, usersLogout } = usersSlice.actions

export default usersSlice.reducer;
