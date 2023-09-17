import React, { useEffect, useState } from 'react'
// style
import styles from "./discount.module.css"
// language
import { useTranslation } from 'react-i18next';
// axios
import { fetchFrom } from '../../../services/axios';
// alert
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// copy
import copy from 'copy-to-clipboard';


function Discount() {
  const { t } = useTranslation();
  const [discount, setDiscount] = useState([])


  useEffect(() => {
    getData()

  }, [])

  const getData = async () => {
    const res = await fetchFrom({ method: 'get', url: `/discount?token=${localStorage.getItem('token')}` })
    const sortedComments = res.data.sort((a, b) => b.id - a.id);

    setDiscount(sortedComments.filter(v => +v.countUse))
  }


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

  return (
    <div className={styles.discount}>
      <h3>{t('userPanelDiscountTitle')}</h3>

      {

        discount.length ?

          <div className={styles.discountsWrapper}>
            {
              discount.map(item =>

                <div className={styles.discountItem} key={item.id}>

                  <div>
                    <button className='btn' onClick={() => copyToClipboard(item.discountCode)}>{item.discountCode}</button>
                  </div>

                  <div className={styles.discountDic}>
                    <p>{item.percent}%</p>
                    <p>{`${t('userPanelDiscountCanUse')} ${item.countUse}`}</p>
                  </div>

                </div>

              )

            }
          </div>
          :
          <div className={styles.main}>
            {t("userPanelDiscountAlert")}
          </div>


      }

    </div>
  )
}

export default Discount