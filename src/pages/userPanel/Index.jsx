import React from 'react'
// router
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
// style
import styles from './index.module.css'
// ant
import { UserOutlined, FileDoneOutlined, CommentOutlined, PercentageOutlined, LogoutOutlined } from '@ant-design/icons';
// components
import Navbar from '../../components/navbar/Navbar';
// redux
import { useDispatch } from 'react-redux';
import { authLogout } from "../../redux/itemStore/auth"
import { cartLogout } from '../../redux/itemStore/cart';
import { commentsLogout } from '../../redux/itemStore/comments';
import { discountLogout } from '../../redux/itemStore/discount';
import { foodsLogout } from '../../redux/itemStore/foods';
import { orderLogout } from '../../redux/itemStore/orders';
import { usersLogout } from '../../redux/itemStore/users';
// alert
import Swal from 'sweetalert2';
// language
import { useTranslation } from 'react-i18next';


function Index() {
    // hooks
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { t } = useTranslation();

    const logoutClickHandler = () => {

        Swal.fire({
            title: t("logoutSwalTitle"),
            text: t("logoutSwalBody"),
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: t("logoutSwalBtn"),
            cancelButtonText: t("cartSwalCancelBtn"),
            customClass: {
                popup: 'darkSwal',
            }
        }).then(result => {
            if (result.isConfirmed) {
                dispatch(authLogout());
                dispatch(cartLogout());
                dispatch(commentsLogout());
                dispatch(discountLogout());
                dispatch(foodsLogout());
                dispatch(orderLogout());
                dispatch(usersLogout());
                navigate('/')
            }
        })

    }

    const nav = [
        {
            id: 1,
            link: 'info',
            title: t("userPanelInfo"),
            icon: UserOutlined
        },
        {
            id: 2,
            link: 'order',
            title: t("userPanelOrder"),
            icon: FileDoneOutlined
        },
        {
            id: 3,
            link: 'comments',
            title: t("userPanelComments"),
            icon: CommentOutlined
        },
        {
            id: 4,
            link: 'discount',
            title: t("userPanelDiscount"),
            icon: PercentageOutlined
        },
    ]

 
    return (
        <>
            <Navbar />
            <div className={styles.userPanel}>
                <div className="container">
                    <div className={styles.wrapper}>


                        <div className={styles.sidebar}>
                            <nav >
                                {
                                    nav.map(v =>
                                        <NavLink key={v.id} className={({ isActive }) => isActive ? `${styles.active}` : ""} to={v.link}><v.icon /> <span>{v.title}</span></NavLink>

                                    )
                                }

                                <p onClick={logoutClickHandler}><LogoutOutlined /> <span>{t("userPanelLogout")}</span></p>
                            </nav>
                        </div>

                        <div className={styles.main}>
                            <Outlet />

                        </div>


                    </div>
                </div>
            </div>
        </>
    )
}



export default Index