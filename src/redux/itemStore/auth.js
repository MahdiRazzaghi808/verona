import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchFrom } from '../../services/axios';



export const getUserInfoFromServer = createAsyncThunk(
    "auth/getUserInfoFromServer",
    async (id) => {
        return fetchFrom({ method: 'get', url: `users?token=${id}` })
    }
);



const authSlice = createSlice({
    name: 'auth',
    initialState: { isLogin: false, userInfo: {}, panel: true, pAdmin: true },
    reducers: {
        authLogin(state, action) {
            localStorage.setItem('token', action.payload.token)
            return {
                ...state,
                isLogin: true,
                userInfo: action.payload,
                pAdmin: (action.payload.rol === 'OWNER' || action.payload.rol === 'ADMIN' || action.payload.rol === 'VIEWER') ? false : true
            }
        },

        authLogout(state, action) {
            localStorage.removeItem('token');
            return { panel: false, pAdmin: true, isLogin: false, userInfo: {} }
        },

        authPanel(state, action) {
            return { ...state, panel: false }
        },
        authChange(state, action) {
            console.log(action.payload);
            return ({ ...state, userInfo: action.payload })
        }

    },


    extraReducers: (builder) => {



        builder.addCase(
            getUserInfoFromServer.fulfilled,
            (state, action) => {
                if (action.payload.data.length) {
                    return {
                        ...state,
                        isLogin: true,
                        userInfo: action.payload.data[0],
                        pAdmin: (action.payload.data[0].rol === 'OWNER' || action.payload.data[0].rol === 'ADMIN' || action.payload.data[0].rol === 'VIEWER') ? false : true

                    }
                } else {
                    return { ...state, isLogin: false, userInfo: [] }
                }
            }

        )



    },

});

export const authDetail = (state) => state.auth;

export const { authLogin, authLogout, authPanel, authAdmin, authChange } = authSlice.actions
export default authSlice.reducer;
