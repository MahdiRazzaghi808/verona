import React, { useState } from 'react'
// router
import { Link, useNavigate } from "react-router-dom"
// style
import styles from "./sidebar.module.css"
import styled from 'styled-components';
// logo
import logo from "../../../../assets/image/logo.svg"
// react router dom
import { NavLink } from 'react-router-dom';
// react icons
import { AiFillHome } from "react-icons/ai";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { HiUsers } from "react-icons/hi";
import { MdFastfood } from "react-icons/md";
import { BiSolidCommentDetail } from "react-icons/bi";
import { BiSolidDiscount } from "react-icons/bi";
import { FiMenu } from "react-icons/fi";
import { AiOutlineLogout } from "react-icons/ai";
// language
import { useTranslation } from 'react-i18next';
// redux
import { useDispatch, useSelector } from 'react-redux';
import { authLogout } from "../../../../redux/itemStore/auth"
import { cartLogout } from '../../../../redux/itemStore/cart';
import { commentsLogout } from '../../../../redux/itemStore/comments';
import { discountLogout } from '../../../../redux/itemStore/discount';
import { foodsLogout } from '../../../../redux/itemStore/foods';
import { orderLogout } from '../../../../redux/itemStore/orders';
import { usersLogout } from '../../../../redux/itemStore/users';
import { themeDetail } from '../../../../redux/itemStore/theme';
// alert
import Swal from 'sweetalert2';

const Div = styled.div`
      transition: all 0.3s linear;
      margin-bottom:2rem;
      height: ${({ open }) => open ? '0' : 'max-height:40rem'};
      overflow: hidden;

      @media (min-width: 768px) {
        min-height: 100vh;
        }
 `




const Sidebar = () => {
  // state for menu in mobile size
  const [open, setOpen] = useState(true)
  const { t } = useTranslation();
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const theme=useSelector(themeDetail)

  const sidebarMenu = [
    { id: 1, to: 'dashboard', menuItem: t("pAdminDashboard"), icon: AiFillHome },
    { id: 2, to: 'orders', menuItem: t("pAdminOrders"), icon: AiOutlineShoppingCart },
    { id: 3, to: 'foods', menuItem: t("pAdminFoods"), icon: MdFastfood },
    { id: 4, to: 'users', menuItem: t("pAdminUsers"), icon: HiUsers },
    { id: 5, to: 'comments', menuItem: t("pAdminComments"), icon: BiSolidCommentDetail },
    { id: 6, to: 'discounts', menuItem: t("pAdminDiscounts"), icon: BiSolidDiscount },

  ]

  ///////////////////////////////////////////////
  const logoutHandler = () => {
    Swal.fire({
      title: t("logoutSwalTitle"),
      text: t("logoutSwalBody"),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: t("logoutSwalBtn"),
      cancelButtonText: t("cartSwalCancelBtn"),
      customClass: {
        popup: theme ? 'darkSwal' : 'lightSwal',

    }
  }).then(result => {
      if (result.isConfirmed) {
          dispatch(authLogout());
          dispatch(cartLogout());
          dispatch(commentsLogout());
          dispatch(discountLogout());
          dispatch(foodsLogout());
          dispatch(orderLogout());
          dispatch(usersLogout());
          navigate('/')
      }
  })
  }


  return (

    <div className={styles.sidebar}>

      {/* header sidebar */}
      <div>

        <div className={styles.logoWrapper}>

          <div>
            <Link to="/">
              <img src={logo} alt="logo" />
              <span className={styles.title}>{t("logo")}</span>
            </Link>
          </div>

          <div onClick={() => setOpen(prev => !prev)}>
            <FiMenu />
          </div>

        </div>
        <div className={styles.line}></div>

      </div>
      {/* main sidebar */}
      <Div open={open}>
        <ul className={styles.pMenu}>

          {
            sidebarMenu.map(item =>

              <li key={item.id}>
                <NavLink to={item.to} className={({ isActive }) => isActive ? styles.active : ""} onClick={() => setOpen(true)}>
                  <span>{item.menuItem}</span>
                  <item.icon />
                </NavLink>
              </li>
            )
          }

          <li>
            <p onClick={logoutHandler}>
              <span>{t("userPanelLogout")}</span>
              <AiOutlineLogout />
            </p>
          </li>

        </ul>
      </Div>

    </div>

  )
}

export default Sidebar


