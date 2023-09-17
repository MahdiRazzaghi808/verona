import React from 'react'
//components
import CountInCart from '../../components/countInCart/CountInCart';
//style
import styles from './foodCartItem.module.css'
// ant
import { Typography } from 'antd';
const { Text } = Typography;
// redux
import { useSelector } from 'react-redux';
import { dollarDetail } from '../../redux/itemStore/dollar';
// language
import { useTranslation } from 'react-i18next';
import i18n from '../../i18n';
// helper
import { cartP } from '../../helper/price/priceShow';

function FoodCartItem({ foodId, name, image, category, count, price, offer, exist, }) {
    
    const dollar = useSelector(dollarDetail)

    const { t } = useTranslation();


    return (
        <div className={styles.wrapper}>
            <div className={styles.foodTitle}>
                <img src={image} alt="food" />
                <div className={styles.foodInfo}>
                    <h3>{name[i18n.language]}</h3>
                    <h5>{category[i18n.language]}</h5>
                </div>

                {
                    !exist &&
                    <div className={`notExistText ${styles.error}`}>
                        {t("failureFood")}
                    </div>
                }

            </div>

            <div className={`${styles.foodDetails} ${offer && 'product__sell--off'}`}>
                <CountInCart count={count} foodId={foodId} exist={exist} className={styles.countInCart} />

                <div className={`priceWrapper ${styles.priceCartWrapper}`}>
                    {
                        offer && <div className='discount'>
                            <p>%{offer}</p>
                            <Text delete className='priceDelete'>{cartP(dollar, count, price, i18n.language, 0)}</Text>
                        </div>
                    }
                    <div className='sumPrice'>{cartP(dollar, count, price, i18n.language, offer)} </div>

                </div>
            </div>
        </div>
    )
}

export default FoodCartItem