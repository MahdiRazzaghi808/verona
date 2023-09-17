import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import './App.css'
///////////////////////////////////////////////////
import IndexPage from "./pages/indexPage/IndexPage"
import Menus from "./pages/menus/Menus"
import Cart from './pages/cart/Cart'
import OrderPage from './pages/orderPage/OrderPage';
import Login from "./pages/login/Login";
import Register from './pages/register/Register';
////////////////////////////////////////////////////
import PUserPrivate from './pages/userPanel/PUserPrivate';
import Index from './pages/userPanel/Index';
import Info from './pages/userPanel/info/Info';
import Order from "./pages/userPanel/order/Order"
import OrderDetails from './pages/userPanel/orderDetails/OrderDetails';
import Comments from './pages/userPanel/comments/Comments';
import Discount from "./pages/userPanel/discount/Discount"
///////////////////////////////////////////////////////////
import PAdminPrivate from './pages/admin/PAdminPrivate';
import PAdminIndex from './pages/admin/PAdminIndex';
import Dashboard from './pages/admin/pages/dashboard/Dashboard';
import Orders from './pages/admin/pages/orders/Orders';
import Foods from './pages/admin/pages/foods/Foods';
import Users from './pages/admin/pages/users/Users';
import User from './pages/admin/pages/userInfo/User';
import PComments from './pages/admin/pages/comments/PComments';
import Discounts from './pages/admin/pages/discounts/Discounts';
///////////////////////////////////////////////////////////
import { useDispatch } from 'react-redux';
import { getUserInfoFromServer, authPanel } from './redux/itemStore/auth';
import { getCartFromServer } from './redux/itemStore/cart';
// import { getDollarPriceFromServer } from './redux/itemStore/dollar';
///////////////////////////////////////////////////////////
import { ToastContainer } from 'react-toastify';
///////////////////////////////////////////////////////////////////
import i18n from "./i18n";
////////////////////////////////////////////////////////////////////
import ScrollToTop from './components/scrollToTop/ScrollToTop';

function App() {

  const dispatch = useDispatch();
  //////////////////////
  const language = localStorage.getItem("language")

  language ? i18n.changeLanguage(language) : localStorage.setItem("language", "en")
  language === "fa" ? document.documentElement.dir = "rtl" : document.documentElement.dir = "ltr"
  /////////////////////

  useEffect(() => {

    const token = localStorage.getItem('token');

    token ? dispatch(getUserInfoFromServer(token)) : dispatch(authPanel())
    token && dispatch(getCartFromServer(token))
    // dispatch(getDollarPriceFromServer());

  }, []);




  return (
    <div>
      <Routes>


        <Route path="/userPanel/*" element={
          <PUserPrivate>
            <Index />
          </PUserPrivate>
        } >
          <Route path="info" element={<Info />} />
          <Route path="order" element={<Order />} />
          <Route path="orderDetails/:id" element={<OrderDetails />} />
          <Route path="comments" element={<Comments />} />
          <Route path="discount" element={<Discount />} />
          <Route path="*" element={<Navigate to="info" />} />
        </Route>

        <Route path="/pAdmin/*" element={
          <PAdminPrivate>
            <PAdminIndex />
          </PAdminPrivate>
        } >
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="orders" element={<Orders />} />
          <Route path="foods" element={<Foods />} />
          <Route path="users" element={<Users />} />
          <Route path="user/:id" element={<User />} />
          <Route path="comments" element={<PComments />} />
          <Route path="discounts" element={<Discounts />} />
          <Route path="*" element={<Navigate to="dashboard" />} />
        </Route>


        <Route path="/cart" element={<Cart />} />
        <Route path="/order" element={<OrderPage />} />
        <Route path="/menus" element={<Menus />} />
        <Route path="/singIn" element={<Login />} />
        <Route path="/singUp" element={<Register />} />
        <Route path='/' element={<IndexPage />} />
        <Route path='/*' element={<Navigate to="/" />} />

      </Routes>

      <ScrollToTop />

      <ToastContainer />
    </div>
  )
}

export default App
