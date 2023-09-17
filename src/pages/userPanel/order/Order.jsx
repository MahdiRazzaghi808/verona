import React, { useEffect, useState } from 'react'
// router
import { Link } from "react-router-dom"
// style
import styles from "./order.module.css"
// ant
import { Space, Table, Tag, ConfigProvider } from "antd"
// language
import { useTranslation } from 'react-i18next';
import i18n from '../../../i18n'
// axios
import { fetchFrom } from '../../../services/axios'
// react icon
import { HiOutlineMinus } from 'react-icons/hi';


function Order() {
  const [order, setOrder] = useState([]);
  const { t } = useTranslation();

  useEffect(() => {
    getData()

  }, [])


  const columns = [
    {
      title: t("userPanelOrderColumnDate"),
      dataIndex: "date",
      key: "date",
      render: (_, { date }) => (
        <>
          {date[i18n.language]}

        </>
      )
    },

    {
      title: t("userPanelOrderColumnAddress"),
      dataIndex: "address",
      key: "address",
      render: (_, { address }) => (
        <div>
          {
            address ?
              <div>{address === "Restaurant😎" ? t("userPanelOrderColumnPlace") : address}</div>
              :
              <HiOutlineMinus />
          }

        </div>
      )
    },

    {
      title: t("userPanelOrderColumnStatus"),
      key: "status",
      dataIndex: "status",
      render: (_, { status }) => (

        <Tag color={status.length < 7 ? "red" : "green"} key={status}>
          {status.length < 7 ? t("userPanelOrderColumnCancel") : t("userPanelOrderColumnSuccess")}
        </Tag>
      )


    },
    {
      title: t('userPanelOrderColumnPriceBase'),
      dataIndex: "priceBase",
      key: "priceBase",

      render: (price, data) =>
        <div>
          <span>{price[i18n.language]}</span>
        </div>
    },

    {
      title: t('userPanelOrderColumnDiscount'),
      dataIndex: "percent",
      key: "percent",

      render: (percent, data) =>
        <div>
          <div>{percent ? <span className='offerActive'>{percent}%</span> : <HiOutlineMinus />}  </div>
        </div>
    },

    {
      title: t('userPanelOrderColumnPriceAfterDiscount'),
      dataIndex: "price",
      key: "price",

      render: (price, data) =>
        <div>
          <span>{price[i18n.language]}</span>
        </div>
    },

    {
      title: t("userPanelOrderColumnDetails"),
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Link to={`/userPanel/orderDetails/${record.id}`}>{t("userPanelOrderColumnDetailsBtn")}</Link>
        </Space>
      )
    }
  ]

  const getData = async () => {
    const res = await fetchFrom({ method: 'get', url: `order?token=${localStorage.getItem('token')}&_sort=id&_order=desc` })
    setOrder(res.data);
  }

  return (
    <ConfigProvider

      direction={(i18n.language === "fa" || i18n.language === "ar") ? "rtl" : "ltr"}
    >
      <div className={styles.order}>
        <h2>{t("userPanelOrderTitle")}</h2>

        <div className={styles.tableWrapper}>
          <Table columns={columns} dataSource={order} pagination={{ position: ['bottomCenter'] }}
            scroll={{ x: `30rem` }}

          />
        </div>

      </div>
    </ConfigProvider>
  )
}

export default Order