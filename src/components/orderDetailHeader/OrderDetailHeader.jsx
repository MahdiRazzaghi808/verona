import React from 'react'
// style
import styles from './orderDetailHeader.module.css'

function OrderDetailHeader({ title, value }) {
    return (
        <div className={styles.item}>
            <p>{title} :</p>
            {
                <p>{value}</p>
            }

        </div>
    )
}

export default OrderDetailHeader