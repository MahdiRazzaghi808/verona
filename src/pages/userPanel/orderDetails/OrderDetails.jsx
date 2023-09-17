import React, { useEffect, useState } from 'react'
// router
import { useParams } from 'react-router-dom';
//  styles
import styles from "./orderDetails.module.css"
// ant
import { Divider } from 'antd';
// language
import { useTranslation } from 'react-i18next';
import i18n from '../../../i18n';
// components
import FoodItem from '../../../components/foodItem/FoodItem';
import OrderDetailHeader from '../../../components/orderDetailHeader/OrderDetailHeader';
// axios
import { fetchFrom } from '../../../services/axios';


function OrderDetails() {
  const { id } = useParams();
  const { t } = useTranslation();

  const [data, setData] = useState({})


  useEffect(() => {
    getData()

  }, [])


  let headerItem = []

  const getData = async () => {
    const res = await fetchFrom({ method: 'get', url: `order/${id}` });
    setData(res.data);
  }

  if (data.status) {
    const { date, price, status, address } = data;
    headerItem = [
      [t("userPanelOrderColumnDate"), i18n.language === 'fa' ? date.fa : date.en],
      [address === "Restaurant😎" ? t("userPanelOrderColumnPriceBase") : t("userPanelOrderColumnPricePost"), price[i18n.language]],
      [t("userPanelOrderColumnStatus"), status.length < 7 ? t("userPanelOrderColumnCancel") : t("userPanelOrderColumnSuccess")],
      [t("userPanelOrderColumnAddress"), address === "Restaurant😎" ? t("userPanelOrderColumnPlace") : address]]
  }

  

  return (
    <div className={styles.orderDetails}>
      <h2>{t("userPanelOrderDetailsTitle")}</h2>

      <div className={styles.headerItem}>
        {
          headerItem.map((item, index) => <OrderDetailHeader key={index} title={item[0]} value={item[1]} />)
        }
      </div>
        <div className={styles.cartTitle}>
          <Divider className={styles.div}>{t("userPanelOrderDetailsCartDetails")}</Divider>
        </div>
      <div className={styles.foods}>
        {
          data.cart && data.cart.map((food, index) =>
            <FoodItem key={index} {...food} />
          )
        }
      </div>


    </div>
  )
}

export default OrderDetails