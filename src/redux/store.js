import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./itemStore/auth"
import cartReducer from "./itemStore/cart"
import dollarReducer from "./itemStore/dollar";
////////////////////////////////////////////////
import themeReducer from "./itemStore/theme"
import commentsReducer from "./itemStore/comments"
import ordersReducer from "./itemStore/orders"
import foodsReducer from "./itemStore/foods"
import usersReducer from "./itemStore/users"
import discountReducer from "./itemStore/discount"

export const store = configureStore({
    reducer: {
        auth: authReducer,
        cart: cartReducer,
        dollar: dollarReducer,
        /////////////////////////////
        theme: themeReducer,
        comments: commentsReducer,
        orders: ordersReducer,
        foods: foodsReducer,
        users: usersReducer,
        discount: discountReducer,

    }

})