import React, { useState } from "react"
// style
import styles from "./modalMenu.module.css"
// ant
import { Modal } from "antd"
// redux
import { useDispatch, useSelector } from "react-redux"
import { putFoodsFromServer } from "../../../../../redux/itemStore/foods"
import { themeDetail } from "../../../../../redux/itemStore/theme"
// alert
import Swal from "sweetalert2"
import { addToCart } from "../../../../../helper/sweetAlert/seetAlert"
// language
import { useTranslation } from 'react-i18next';
import i18n from "../../../../../i18n"
import { authDetail } from "../../../../../redux/itemStore/auth"


const ModalOrder = ({ open, data, foods }) => {
  const { isModalOpenMenu, setIsModalOpenMenu } = open;
  const { modalDataMenu, setModalDataMenu } = data;
  const dispatch = useDispatch()

  const theme = useSelector(themeDetail)
  const auth = useSelector(authDetail)
  const { t } = useTranslation();

  const handleOk = () => {
    setIsModalOpenMenu(false);
  }

  const handleCancel = () => {
    setIsModalOpenMenu(false)
  }


  const arrReduce = foods.reduce((prev, next) => {
    return ({ hot: prev.hot + (+next.hot), off: prev.off + (+next.off) })
  }, { hot: 0, off: 0 })




  const putFood = (type) => {
    if (auth.userInfo.rol === 'VIEWER') {
      addToCart(t('panelAlertAlarm2'), (i18n.language === 'fa' || i18n.language === 'ar') ? true : false, theme)
    } else {
      const menuData = { hot: false, off: false }

      if (type === 'off') {

        if (arrReduce.off === 2) {
          Swal.fire({
            icon: 'error',
            text: t('pAdminFoodsTwoSpecialAlert'),
            customClass: {
              popup: theme ? 'darkSwal' : 'lightSwal',

            }
          })
          return true
        } else {
          menuData.off = true;

        }


      } else if (type === 'hot') {
        if (arrReduce.hot === 12) {
          Swal.fire({
            icon: 'error',
            text: t('pAdminFoodsMaxHotAlert'),
            customClass: {
              popup: theme ? 'darkSwal' : 'lightSwal',

            }
          })
          return true
        } else {
          menuData.hot = true
        }
      } else {
        if (arrReduce.hot === 9) {
          Swal.fire({
            icon: 'error',
            text: t('pAdminFoodsMinHotAlert'),
            customClass: {
              popup: theme ? 'darkSwal' : 'lightSwal',

            }
          })
          return true
        }
      }

      const sendData = { ...modalDataMenu, ...menuData }
      dispatch(putFoodsFromServer(sendData))
      setIsModalOpenMenu(false);
    }
  }

  return (
    <>
      <Modal
        title=""
        open={isModalOpenMenu}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[]}
      >

        <div className={styles.wrapper}>
          <button className={`pBtn ${modalDataMenu.off ? styles.active : ''} ${modalDataMenu.offer ? "" : styles.deActive}`} disabled={modalDataMenu.offer ? false : true} onClick={() => putFood('off')}>{t('pAdminFoodsMenuSpecialOffer')}</button>
          <button className={`pBtn ${modalDataMenu.hot ? styles.active : ''} `} onClick={() => putFood('hot')}>{t('pAdminFoodsMenuHotMenu')}</button>
          <button className="pBtn" onClick={() => putFood('remove')}>{t('remove')}</button>
        </div>

      </Modal>
    </>
  )
}

export default ModalOrder
