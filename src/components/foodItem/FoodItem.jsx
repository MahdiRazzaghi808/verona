import React from 'react'
// style
import styles from "./foodItem.module.css"
// language
import i18n from '../../i18n'
// ant
import { Typography } from 'antd';
const { Text } = Typography;

function FoodItem({ image, name, count, price, priceAfterOff, offer }) {
    return (
        <div className={styles.wrapper}>
            <img src={image} alt="food" />
            <p>{name[i18n.language]}</p>
            <p>{count}</p>
            <div className={`priceWrapper ${styles.priceCartWrapper}`}>
                {
                    offer ? <div className='discount'>
                        <p>%{offer}</p>
                        <Text delete className='priceDelete'>{price[i18n.language]}</Text>
                    </div>
                        :
                        ''
                }
                <div className='sumPrice'>{priceAfterOff[i18n.language]}</div>
            </div>
        </div>
    )
}

export default FoodItem