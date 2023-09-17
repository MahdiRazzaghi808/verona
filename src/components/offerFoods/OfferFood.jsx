import React from 'react'
// router
import { useNavigate } from 'react-router-dom';
// ant
import { ShoppingCartOutlined } from '@ant-design/icons';
// redux
import { useDispatch, useSelector } from 'react-redux';
import { createInCart } from '../../redux/itemStore/cart';
import { authDetail } from '../../redux/itemStore/auth';
import { cartDetail } from '../../redux/itemStore/cart';
// alert
import { addToCart, loginAlert } from '../../helper/sweetAlert/seetAlert';
import 'react-toastify/dist/ReactToastify.css';
// language
import { useTranslation } from 'react-i18next';
import i18n from '../../i18n';


function OfferFood({ image, name, offer, id }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { t } = useTranslation();

    const auth = useSelector(authDetail);
    const cart = useSelector(cartDetail);




    const addToCartHandler = (foodId) => {
        if (auth.isLogin) {
            addToCart(t("foodToastTitle"), (i18n.language === 'fa' || i18n.language === 'ar') ? true : false, false)
            dispatch(createInCart([auth.userInfo.token, foodId]))
        } else {
            loginAlert(t("foodSwalTitle"), t("foodSwalText"), t("foodSwalLoginBtn"), t("foodSwalCloseBtn"))
                .then((result) => {
                    if (result.isConfirmed) {
                        navigate('/singIn')
                    }
                });
        }
    }


    const isCart = cart.cart.length && cart.cart.find(item => item.foodId === id)



    return (
        <div className="off__product">
            <div className="off__product__image">
                <img src={image} alt="food" />
            </div>

            <div className="off__product__wrapper">

                <h5 className="off__product__name">{name[i18n.language]}</h5>

                <h6 className="off__product__discount">
                    <span>%{+offer}</span>
                    <span>{t("offerOff")}</span>

                </h6>

                <div className="off__button__wrapper">



                    {
                        isCart ?
                            <button className='btn goCart' onClick={() => navigate('/cart')}>
                                {t("offerGoCart")}
                            </button>
                            :
                            <button className="btn" onClick={() => addToCartHandler(id)}>
                                <span>{t("offerBtn")}</span>
                                <ShoppingCartOutlined />
                            </button>

                    }



                </div>

            </div>
        </div>
    )
}

export default OfferFood