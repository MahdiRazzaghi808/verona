import React, { useEffect, useState } from 'react'
// router
import { useNavigate, useParams, useOutletContext } from 'react-router-dom';
// style
import styles from "./userInfo.module.css"
//axios
import { fetchFrom } from '../../../../services/axios';
// redux
import { useDispatch, useSelector } from 'react-redux';
import { deleteUsersFromServer } from "../../../../redux/itemStore/users"
import { dollarDetail } from '../../../../redux/itemStore/dollar';
import { themeDetail } from '../../../../redux/itemStore/theme';
import { authDetail } from '../../../../redux/itemStore/auth';
// language
import { useTranslation } from 'react-i18next';
import i18n from '../../../../i18n';
// components
import Info from './info/Info';
import DiscountUser from './discount/DiscountUser';
import CartUser from './cartUser/CartUser';
import UserComments from './comments/UserComments';
import Orders from '../orders/Orders';
// ant
import { DownOutlined, UpOutlined } from '@ant-design/icons';
// helper
import { cartSidebar } from "../../../../helper/price/priceShow"
import { addToCart, swalAlert } from '../../../../helper/sweetAlert/seetAlert';





function User() {
    const dispatch = useDispatch();
    const navigate = useNavigate()

    const { id } = useParams();
    const { t } = useTranslation();
    ///////////////
    const dollar = useSelector(dollarDetail)
    const theme = useSelector(themeDetail)
    const auth = useSelector(authDetail)
    const { lan } = useOutletContext();
    //////////////////////////////////////////////////////
    const [userInfo, setUserInfo] = useState(null);

    const [flags, setFlags] = useState({
        discount: { open: false, load: 0 },
        cart: { open: false, load: 0 },
        comments: { open: false, load: 0 },
        order: { open: false, load: 0 }
    })

    //////////////////////////////////////////////////////



    useEffect(() => {
        getData()

    }, []);

    const getData = async () => {
        const res = await fetchFrom({ method: 'get', url: `/users/${id}` });
        !res.error && setUserInfo(res.data);
    }



    const deleteHandler = () => {
        swalAlert('warning', '', t('deleteSwalComponents'), t('deleteSwalComponentsYes'), t('deleteSwalComponentsNo'), theme, async (result) => {
            if (result.isConfirmed) {
                if (auth.userInfo.rol === 'VIEWER') {
                    addToCart(t('panelAlertAlarm2'), (i18n.language === 'fa' || i18n.language === 'ar') ? true : false, theme)
                } else {
                    dispatch(deleteUsersFromServer(userInfo.id));
                    navigate('/pAdmin/users')
                }
            }
        })
    }
    /////////////////////////////////////////////////////////////////////////////////////////  

    const arr = [

        {
            id: 1,
            title: t('userPanelDiscountTitle'),
            subTitle: '',
            value: 'discount',
            comment: DiscountUser
        },
        {
            id: 2,
            title: t('cart'),
            subTitle: '',
            value: 'cart',
            comment: CartUser
        },
        {
            id: 3,
            title: t('userPanelComments'),
            subTitle: `${userInfo && userInfo.commentsCount} ${t('pAdminUserComment')}`,
            value: 'comments',
            comment: UserComments
        },
        {
            id: 4,
            title: t('pAdminTableTotalBuy'),
            subTitle: userInfo ? userInfo.totalBuy : 0,
            value: 'order',
            comment: Orders
        },

    ]

    /////////////////////////////////////////////////////////////////////////////////////////  
    const validate = () => {
        if (auth.userInfo.rol === 'VIEWER' || (auth.userInfo.rol === 'ADMIN' && (userInfo.rol === 'ADMIN' || userInfo.rol === 'OWNER') && auth.userInfo.token !== userInfo.token)) {
            return true

        }
        return false
    }



    return (
        <div className={styles.wrapper}>
            {userInfo && (

                <>

                    < Info userInfo={userInfo} />


                    <div className={styles.allComponentsWrapper}>

                        {arr.map((item, index) =>

                            <div key={item.id} className={styles.allComponents}>
                                <div className={styles.title}>
                                    <h3>{item.title}</h3>
                                    <p>{index === 3 ? cartSidebar(dollar, item.subTitle, lan) : item.subTitle}</p>
                                </div>

                                <button className={`${styles.flagBtn} btn`} onClick={() => setFlags(prev => ({ ...prev, [item.value]: { open: !prev[item.value].open, load: 1 }, }))}>
                                    {flags[item.value].open ? <UpOutlined /> : <DownOutlined />}
                                </button>

                                <div className={`${styles.commentsWrapper} ${flags[item.value].open ? `${styles.showComment}` : ''}`}>
                                    {(flags[item.value].load) ? <item.comment token={userInfo.token} type={'user'} userInfo={userInfo} getDataInfo={getData} /> : ''}
                                </div>
                            </div>
                        )}
                    </div>

                    {
                        (!validate() && userInfo.rol !== 'OWNER') ? <button button className='btn-cancel' onClick={deleteHandler}>{t('pAdminUserDeleteBrn')}</button> : ''
                    }

                </>
            )
            }
        </div >
    )

}

export default User