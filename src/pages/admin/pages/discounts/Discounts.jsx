import React, { useEffect, useState } from 'react'
// components
import Tab from '../../components/tab/Tab';
// redux
import { useDispatch, useSelector } from 'react-redux';
import { discountDetail, getDiscountFromServer, postDiscountFromServer, deleteDiscountFromServer } from '../../../../redux/itemStore/discount';
import { themeDetail } from '../../../../redux/itemStore/theme';
import { authDetail } from '../../../../redux/itemStore/auth';

// alert
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// copy
import copy from 'copy-to-clipboard';
// router
import { Link } from 'react-router-dom';
// helper
import { generateRandomCode } from "../../../../helper/randomCode/generateRandomCode"
import { handleCreateClick } from '../../../../helper/discountInputs/discountInputs';
import { addToCart, swalAlert } from '../../../../helper/sweetAlert/seetAlert';
// language
import { useTranslation } from 'react-i18next';
import i18n from "../../../../i18n"

function Discounts() {
  const dispatch = useDispatch()
  const discount = useSelector(discountDetail);
  const theme = useSelector(themeDetail);
  const auth = useSelector(authDetail);
  // state
  const [showFilter, setShowFilter] = useState('all');
  const { t } = useTranslation();



  useEffect(() => {
    dispatch(getDiscountFromServer())

  }, [])
  //////////////////////////////////////////////////////////////////////////////////////////////


  const copyToClipboard = (discountCode) => {
    copy(discountCode);
    toast.success(t('userPanelDiscountAlertCopy'), {
      position: 'top-left',
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    })

  };

  const sendData = (input1, input2) => {
    dispatch(postDiscountFromServer({ countUse: input1, percent: input2, discountCode: generateRandomCode(7), token: '' }))
  }

  const deleteHandler = (id) => {
    if (auth.userInfo.rol === 'VIEWER') {
      addToCart(t('panelAlertAlarm2'), (i18n.language === 'fa' || i18n.language === 'ar') ? true : false, theme)
    } else {
      swalAlert('warning', '', t('deleteSwalComponents'), t('deleteSwalComponentsYes'), t('deleteSwalComponentsNo'), theme, async (result) => {
        if (result.isConfirmed) {
          dispatch(deleteDiscountFromServer(id))
        }
      })
    }
  }


  ////////////////////////////////////////////////////////////////////////////////////////////

  const columns = [


    {
      title: t('pAdminTablePercent'),
      dataIndex: "percent",
      key: "percent",
      render: (percent) =>
        <div>
          <span>{percent}%</span>
        </div>
    },

    {
      title: t("userPanelDiscountTitle"),
      dataIndex: "discountCode",
      key: "discountCode",
      render: (discountCode) =>
        <div>
          <button className='pBtn' onClick={() => copyToClipboard(discountCode)}>{discountCode}</button>
        </div>
    },

    {
      title: t('pAdminTableUseCount'),
      dataIndex: "countUse",
      key: "countUse",
      render: (countUse) =>
        <div>
          <span className={`${+countUse ? '' : 'expiredDiscount'}`}>{+countUse ? +countUse : t('pAdminDiscountExpired')}</span>
        </div>
    },

    {
      title: t('pAdminTableDelete'),
      dataIndex: "",
      key: "z",
      render: (id, data) =>
        <div>
          <button className='btn-cancel' onClick={() => deleteHandler(data.id)}>{t('pAdminTableDelete')}</button>
        </div>

    }
  ]


  const columns1 = [

    {
      title: t('pAdminTableProfile'),
      dataIndex: "image",
      key: "image",
      render: (_, { image }) => (
        <div className='profile'>
          <img src={image} alt="profile" />
        </div>
      )

    },
    {
      title: t('pAdminTableName'), dataIndex: "name", key: "name",
      render: (v, data) => (
        <div>
          <Link to={`/pAdmin/user/${data.userId}`}>{v}</Link>
        </div>
      )
    },


    {
      title: t('pAdminTablePercent'),
      dataIndex: "percent",
      key: "percent",
      render: (percent) =>
        <div>
          <span>{percent}%</span>
        </div>
    },

    {
      title: t('userPanelDiscountTitle'),
      dataIndex: "discountCode",
      key: "discountCode",
      render: (discountCode) =>
        <div>
          <button className='pBtn' onClick={() => copyToClipboard(discountCode)}>{discountCode}</button>
        </div>
    },

    {
      title: t('pAdminTableUseCount'),
      dataIndex: "countUse",
      key: "countUse",
      render: (countUse) =>
        <div>
          <span className={`${+countUse ? '' : 'expiredDiscount'}`}>{+countUse ? +countUse : 'expired'}</span>
        </div>
    },

    {
      title: t('pAdminTableDelete'),
      dataIndex: "",
      key: "x",
      render: (_, data) =>
        <div >
          <button className='btn-cancel' onClick={() => deleteHandler(data.id)}>{t('pAdminTableDelete')}</button>
        </div>

    }
  ]

  const arr = [
    {
      title: t('pAdminDiscountGeneral'),
      value: {
        col: columns,
        data: discount.filter(v => {
          if (!v.token) {

            if (showFilter === 'all') {
              return v
            } else if (showFilter === 'active') {
              if (+v.countUse) {
                return v
              }
            } else {
              if (!+v.countUse) {
                return v
              }
            }

          }

        }),
        width: 55
      },

    },
    {
      title: t('pAdminDiscountSpecific'),
      value: {
        col: columns1,
        data: discount.filter(v => {
          if (v.token) {

            if (showFilter === 'all') {
              return v
            } else if (showFilter === 'active') {
              if (+v.countUse) {
                return v
              }
            } else {
              if (!+v.countUse) {
                return v
              }
            }

          }
        }),
        width: 55,

      },

    },


  ]
  ////////////////////////////////////////////////////////////////////////////////////////////




  return (
    <div className='pAdminWrapper' >
      <div className='foodTitleWrapper'>
        <h2>{t('pAdminDiscounts')}</h2>
        <button className='btn' onClick={() => handleCreateClick(t, auth, i18n.language, sendData, theme, t('pAdminDiscountAlertMessage'), t('pAdminDiscountCountUse'), t('pAdminDiscountPercentsUse'), t('pAdminDiscountCreator'), t('pAdminTableStatuscancel'), t('pAdminDiscountTitleAlert'))}>{t('pAdminDiscountNewBtn')}</button>
      </div>
      <Tab arr={arr} filter={{ showFilter, setShowFilter }} type={"discount"} />
    </div >
  )
}

export default Discounts