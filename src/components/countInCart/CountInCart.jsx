import React from 'react'
// style
import styles from "./countInCart.module.css"
// ant
import { DeleteOutlined, PlusOutlined, MinusOutlined } from '@ant-design/icons';
// redux
import { useDispatch } from 'react-redux';
import { countPlus, countMinus, removeFoodInCart } from "../../redux/itemStore/cart";

function CountInCart({ count, foodId, exist }) {

    const dispatch = useDispatch()
    const token = localStorage.getItem('token')

    return (
        <div className={styles.countWrapper}>
            {+count === 1 || !exist ? <DeleteOutlined onClick={() => dispatch(removeFoodInCart([token, foodId]))} /> : <MinusOutlined onClick={() => dispatch(countMinus([token, foodId]))} />}
            <p>{count}</p>
            <PlusOutlined onClick={() => exist && dispatch(countPlus([token, foodId]))} />
        </div>
    )
}

export default CountInCart