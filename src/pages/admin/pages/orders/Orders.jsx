import React, { useEffect, useState } from 'react'
// components
import Tab from '../../components/tab/Tab';
// redux
import { useDispatch, useSelector } from 'react-redux';
import { ordersDetail, getOrdersFromServer, putOrdersFromServer, deleteOrdersFromServer } from '../../../../redux/itemStore/orders';
import { themeDetail } from '../../../../redux/itemStore/theme';
// helper
import { setTime } from '../../../../helper/setTime/setTime';
// router
import { Link, useOutletContext } from "react-router-dom";
// react icons
import { FcCancel } from 'react-icons/fc';
import { MdDoneAll } from 'react-icons/md';
import { HiOutlineMinus } from 'react-icons/hi';
// modal
import ModalOrder from './modal/ModalOrder';
// axios
import { fetchFrom } from '../../../../services/axios';
// ant
import { ConfigProvider } from "antd"
import { addToCart, swalAlert } from '../../../../helper/sweetAlert/seetAlert';
// language
import { useTranslation } from 'react-i18next';
import { authDetail } from '../../../../redux/itemStore/auth';

function Orders({ type, token }) {
  const { lan } = useOutletContext();
  const { t } = useTranslation();

  const dispatch = useDispatch();

  const [showFilter, setShowFilter] = useState(9693406720007);
  const [isModalOpen, setIsModalOpen] = useState(false)

  const [modalData, setModalData] = useState([]);
  const [userOrder, setUserOrder] = useState([]);

  const orders = useSelector(ordersDetail);
  const theme = useSelector(themeDetail);
  const auth = useSelector(authDetail);





  const deleteHandler = (id) => {
    if (auth.userInfo.rol === 'VIEWER') {
      addToCart(t('panelAlertAlarm2'), (lan === 'fa' || lan === 'ar') ? true : false, theme)
    } else {

      swalAlert('warning', '', t('deleteSwalComponents'), t('deleteSwalComponentsYes'), t('deleteSwalComponentsNo'), theme, async (result) => {
        if (result.isConfirmed) {
          if (type === 'user') {
            const res = await fetchFrom({ method: 'delete', url: `order/${id}` })
            !res.error && getData()
          } else {
            dispatch(deleteOrdersFromServer(id))

          }
        }
      })
    }
  }

  const showCartHandler = (data) => {
    setModalData(data);
    setIsModalOpen(true);
  }




  useEffect(() => {
    if (type === 'user') {
      getData()
    } else {
      dispatch(getOrdersFromServer())

    }

  }, []);



  const getData = async () => {
    const res = await fetchFrom({ method: 'get', url: `order?token=${token}&_sort=id&_order=desc` })
    setUserOrder(res.data)

  }


  const ticHandler = async (data) => {
    if (auth.userInfo.rol === 'VIEWER') {
      addToCart(t('panelAlertAlarm2'), (lan === 'fa' || lan === 'ar') ? true : false, theme)
    } else {

      if (type === 'user') {
        const res = await fetchFrom({ method: 'put', url: `order/${data.id}`, requestConfig: { done: true } })
        !res.error && getData()
        !res.error && addToCart(t('pAdminOrdersDonSu'), (lan === 'fa' || lan === 'ar') ? true : false, theme)
      } else {
        dispatch(putOrdersFromServer(data.id))
        addToCart(t('pAdminOrdersDonSu'), (lan === 'fa' || lan === 'ar') ? true : false, theme)

      }

    }

  }


  ////////////////////////////////////////////////////////////////////////////////////////////

  const columns = [
    {
      title: t('pAdminTableNO'),
      dataIndex: "",
      key: "x",
      render: (v, { image }, i) => (
        <span >{i + 1}</span>
      )

    },


    {
      title: t('pAdminTableStatus'), dataIndex: "status", key: "status",
      render: (v) => (
        <div>
          <span className={`statusFlag ${v !== 'cancel' ? 'active' : ""}`}>{t(`pAdminTableStatus${v}`)}</span>
        </div>

      )
    },


    {
      title: t('cart'), dataIndex: "cart", key: "cart",
      render: (v, data) => (
        <div>
          <button className='pBtn' onClick={() => showCartHandler(data.cart)}>
            {t('pAdminTableShowCart')}
          </button>

        </div>
      )
    },

    {
      title: t('namedLabelAuth'),
      dataIndex: "name",
      key: "name",

      render: (name, data) =>
        <div>
          <Link to={`/pAdmin/user/${data.userId}`}>{name}</Link>
        </div>
    },

    {
      title: t('userPanelOrderColumnAddress'),
      dataIndex: "address",
      key: "address",
      render: (address) =>
        <div>
          <span>{address ? address === "Restaurant😎" ? t("userPanelOrderColumnPlace") : address : <HiOutlineMinus />}</span>
        </div>
    },



    {
      title: t('pAdminTableBasePrice'),
      dataIndex: "priceBase",
      key: "priceBase",

      render: (price, data) =>
        <div>
          <span>{price[lan]}</span>
        </div>
    },



    {
      title: t('pAdminTableDiscount'),
      dataIndex: "percent",
      key: "percent",

      render: (percent, data) =>
        <div>
          <div>{percent ? <span className='offerActive'>{percent}%</span> : <HiOutlineMinus />}  </div>
        </div>
    },

    {
      title: t('pAdminTablePrice'),
      dataIndex: "price",
      key: "price",

      render: (price, data) =>
        <div>
          <span>{price[lan]}</span>
        </div>
    },




    {
      title: t('pAdminTableDate'), dataIndex: "", key: "u",
      render: (_, data) => (
        <span>{data.date[lan]}</span>
      )
    },

    {
      title: t('pAdminTableAction'),
      dataIndex: "done",
      key: "done",
      render: (done, data) =>
        <div className='buttonWrapper'>

          {
            data.status === "cancel" ?
              <FcCancel />
              :
              !done ?
                <button className='pBtn'
                  onClick={() => ticHandler(data)}>{t('pAdminTableDone')}</button>
                :
                <MdDoneAll className='tic' />
          }

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


  const columns1 = [
    {
      title: t('pAdminTableNO'),
      dataIndex: "",
      key: "x",
      render: (v, { image }, i) => (
        <span >{i + 1}</span>
      )

    },
    {
      title: t('pAdminTableStatus'), dataIndex: "status", key: "status",
      render: (v) => (
        <div>
          <span className={`statusFlag ${v !== 'cancel' ? 'active' : ""}`}>{t(`pAdminTableStatus${v}`)}</span>
        </div>

      )
    },


    {
      title: t('cart'), dataIndex: "cart", key: "cart",
      render: (v, data) => (
        <div>
          <button className='pBtn' onClick={() => showCartHandler(data.cart)}>
            {t('pAdminTableShowCart')}
          </button>

        </div>
      )
    },



    {
      title: t('userPanelOrderColumnAddress'),
      dataIndex: "address",
      key: "address",
      render: (address) =>
        <div>
          <span>{address ? address === "Restaurant😎" ? t("userPanelOrderColumnPlace") : address : <HiOutlineMinus />}</span>
        </div>
    },


    {
      title: t('pAdminTableBasePrice'),
      dataIndex: "priceBase",
      key: "priceBase",

      render: (price, data) =>
        <div>
          <span>{price[lan]}</span>
        </div>
    },



    {
      title: t('pAdminTableDiscount'),
      dataIndex: "percent",
      key: "percent",

      render: (percent, data) =>
        <div>
          <div>{percent ? <span className='offerActive'>{percent}%</span> : <HiOutlineMinus />}  </div>
        </div>
    },

    {
      title: t('pAdminTablePrice'),
      dataIndex: "price",
      key: "price",

      render: (price, data) =>
        <div>
          <span>{price[lan]}</span>
        </div>
    },




    {
      title: t('pAdminTableDate'), dataIndex: "", key: "u",
      render: (_, data) => (
        <span>{data.date[lan]}</span>
      )
    },

    {
      title: t('pAdminTableAction'),
      dataIndex: "done",
      key: "done",
      render: (done, data) =>
        <div className='buttonWrapper'>

          {
            data.status === "cancel" ?
              <FcCancel />
              :
              !done ?
                <button className='pBtn'
                  onClick={() => ticHandler(data)}>{t('pAdminTableDone')}</button>
                :
                <MdDoneAll className='tic' />
          }

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
      title: t('pAdminOrdersAllM'),
      value: {
        col: type === 'user' ? columns1 : columns,
        data: (type === 'user' ? userOrder : orders).filter(v => setTime() - v.time < showFilter),
        width: 65
      },

    },
    {
      title: t('pAdminOrdersActiveM'),
      value: {
        col: type === 'user' ? columns1 : columns,
        data: (type === 'user' ? userOrder : orders).filter(v => (setTime() - v.time < showFilter) && v.status !== 'cancel' && !v.done),
        width: 65,

      },

    },
    {
      title: t('pAdminOrdersDoneM'),
      value: {
        col: type === 'user' ? columns1 : columns,
        data: (type === 'user' ? userOrder : orders).filter(v => (setTime() - v.time < showFilter) && v.status !== 'cancel' && v.done),
        width: 65
      },

    },
    {
      title: t('pAdminOrdersCancelM'),
      value: {
        col: type === 'user' ? columns1 : columns,
        data: (type === 'user' ? userOrder : orders).filter(v => (setTime() - v.time < showFilter) && v.status === 'cancel'),
        width: 65
      },

    }

  ]
  ////////////////////////////////////////////////////////////////////////////////////////////

  const lightTheme = {
    colorBgBase: "#ecf0f3",
    colorTextBase: "#333333",
    colorBorder: "#333333",
  }

  const darkTheme = {
    colorBgBase: "#232a3b",
    colorTextBase: "#fff",
    colorBorder: "#fff",
    colorPrimaryBg: "#313a55",
  }


  return (
    <div className='pAdminWrapper' >
      {type !== 'user' ? <h2>{t('pAdminOrders')}</h2> : ''}
      <Tab arr={arr} filter={{ showFilter, setShowFilter }} type={"time"} />

      <ConfigProvider
        theme={{
          token: theme ? darkTheme : lightTheme
        }}
      >
        {isModalOpen ? <ModalOrder open={{ isModalOpen, setIsModalOpen }} data={{ modalData, setModalData }} /> : ""}

      </ConfigProvider>

    </div >
  )
}

export default Orders