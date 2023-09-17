import React, { useEffect, useState } from 'react'
// style
import styles from "./showInformation.module.css"
// component
import DetailItem from "./detailItem/DetailItem"
// icons
import { FaUserFriends } from 'react-icons/fa';
import { FaCommentAlt } from 'react-icons/fa';
import { BsCartCheckFill } from 'react-icons/bs';
import { AiFillDollarCircle } from 'react-icons/ai';
// language
import { useTranslation } from 'react-i18next';
// axios
import { fetchFrom } from '../../../../../services/axios';
// router 
import { useOutletContext } from 'react-router-dom';
// redux
import { useSelector } from 'react-redux';
import { dollarDetail } from '../../../../../redux/itemStore/dollar';
// helper
import { cartSidebar } from "../../../../../helper/price/priceShow"



function ShowInformation() {
    const { t } = useTranslation()
    const [data, setData] = useState({})

    const dollar = useSelector(dollarDetail)
    const { lan } = useOutletContext();

    useEffect(() => {
        getData()

    }, [])

    const getData = async () => {
        const res = await fetchFrom({ method: 'get', url: '/dashboard' })
        setData(res.data)
    }



    // detail items
    const detailsItem = [
        { id: 1, title: t("dashboardInformationUsers"), number: data.users, icon: FaUserFriends, percent: 33, color: "#3160d8" },
        { id: 2, title: t("dashboardInformationComments"), number: data.comments, icon: FaCommentAlt, percent: -2, color: "#f78b00" },
        { id: 3, title: t("dashboardInformationOrder"), number: data.order, icon: BsCartCheckFill, percent: 12, color: "#fbc500" },
        { id: 4, title: t("dashboardInformationSales"), number: data.price ? cartSidebar(dollar, data.price, lan) : 0, icon: AiFillDollarCircle, percent: 22, color: "#91c714" },
    ]

    return (
        <div className={styles.detailsWrapper}>
            {
                detailsItem.map(item => <DetailItem key={item.id} data={item} />)
            }
        </div>
    )
}

export default ShowInformation