import React from 'react'
// router
import { Link, useNavigate } from 'react-router-dom';
//components
import Navbar from '../../components/navbar/Navbar'
import FoodCartItem from './FoodCartItem';
//style
import styles from "./cart.module.css"
// ant
import { DeleteOutlined } from '@ant-design/icons';
// redux
import { useSelector, useDispatch } from 'react-redux';
import { authDetail } from '../../redux/itemStore/auth';
import { cartDetail, clearAll } from '../../redux/itemStore/cart';
import { dollarDetail } from '../../redux/itemStore/dollar';
// language
import { useTranslation } from 'react-i18next';
import i18n from '../../i18n';
// alert
import Swal from 'sweetalert2';
// helper
import { cartSidebar } from '../../helper/price/priceShow';
import { sortProductsByCategory } from '../../helper/filterFoods/filterFoods';


function Cart() {

  const auth = useSelector(authDetail)
  const cart = useSelector(cartDetail);
  const dollar = useSelector(dollarDetail);
  // hooks
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { t } = useTranslation();


  const deleteAllHandler = async () => {

    const { isConfirmed } = await Swal.fire({
      title: t("cartSwalTitle"),
      text: t("cartSwalbody"),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: t("cartSwalConfirmBtn"),
      confirmButtonColor: '#ff3333',
      cancelButtonText: t("cartSwalCancelBtn"),
      customClass: {
        popup: 'darkSwal',
      }
    });
    isConfirmed && dispatch(clearAll(auth.userInfo.token))

  }

  const isExistAll = cart.cart.length && cart.cart.every(item => item.exist)

  const sidebarItem = [
    {
      id: 1,
      title: t("cartTotal"),
      value: cartSidebar(dollar, cart.summary.total, i18n.language)
    },
    {
      id: 2,
      title: t("cartDiscount"),
      value: cartSidebar(dollar, cart.summary.discount, i18n.language)
    },
    {
      id: 3,
      title: t("cartFinal"),
      value: cartSidebar(dollar, cart.summary.final, i18n.language)
    },
  ]



  return (
    <>

      <Navbar />
      <div className={styles.cart}>
        <div className='container'>
          <div className={styles.wrapper}>


            <div className={styles.cartBoxWrapper}>
              <div className={styles.cartBox}>

                {
                  cart.cart.length ?

                    sortProductsByCategory(cart.cart).map(item => <FoodCartItem key={item.foodId} {...item} />)
                    :
                    <div className={styles.cartEmpty}>
                      <span>{t("cartEmpty")}</span>

                      <Link to='/menus' className='btn'>{t("cartGoMenu")}</Link>
                    </div>
                }


              </div>

            </div>

            <div className={styles.sidebar}>

              {
                sidebarItem.map(v =>
                  <div className={styles.sidebarItem} key={v.id}>
                    <p>{v.title}</p>
                    <p>{v.value}</p>
                  </div>
                )
              }

              {
                cart.cart.length ?
                  <div className={`btn ${styles.clearBtn}`} onClick={deleteAllHandler}>
                    <span>{t("clearAllBtn")}</span>
                    <DeleteOutlined />
                  </div>
                  : ''
              }
              <button className={`btn ${(!cart.summary.total || !isExistAll) && 'btn-disabled'}`} onClick={() => !(!cart.summary.total || !isExistAll) && navigate('/order')}>{t("paymentBtn")}</button>

            </div>


          </div>
        </div>
      </div>
    </>

  )
}

export default Cart