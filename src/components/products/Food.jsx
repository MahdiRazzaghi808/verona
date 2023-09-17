import React, { useState } from 'react';
// spring
import { useSpring, animated } from 'react-spring';
// components
import CountInCart from '../countInCart/CountInCart';
// ant
import { ShoppingCartOutlined } from '@ant-design/icons';
import { Typography } from 'antd';
// redux
import { useSelector, useDispatch } from 'react-redux';
import { cartDetail } from '../../redux/itemStore/cart';
import { authDetail } from "../../redux/itemStore/auth"
import { createInCart } from "../../redux/itemStore/cart";
import { dollarDetail } from '../../redux/itemStore/dollar';
// router
import { useNavigate } from 'react-router-dom';
// helper
import { addToCart, loginAlert } from "../../helper/sweetAlert/seetAlert"
import { cartSidebar, foodsP } from '../../helper/price/priceShow';
// language
import { useTranslation } from 'react-i18next';
import i18n from "../../i18n"
//////////////////////////////////////////////////////////////
import 'react-toastify/dist/ReactToastify.css';

const { Text } = Typography;

function Food({ dic, exist, id, image, name, offer, price }) {
  const cart = useSelector(cartDetail);
  const dollar = useSelector(dollarDetail);
  const auth = useSelector(authDetail);
  const dispatch = useDispatch();
  const token = localStorage.getItem('token');
  const isCart = cart.cart.length && cart.cart.find(item => item.foodId === id);
  const navigate = useNavigate();
  ///////////////////////////////////////////
  const { t } = useTranslation();
  ///////////////////////////
  const [active, setActive] = useState(false);

  const springProps = useSpring({
    opacity: active ? 1 : 0.95,
    transform: active ? 'scale(1.05)' : 'scale(1)',
  });

  const addToCartHandler = () => {
    if (auth.isLogin) {
      dispatch(createInCart([token, id]));
      addToCart(t("foodToastTitle"), (i18n.language === 'fa' || i18n.language === 'ar') ? true : false, false)


    } else {

      loginAlert(t("foodSwalTitle"), t("foodSwalText"), t("foodSwalLoginBtn"), t("foodSwalCloseBtn"))

        .then((result) => {
          if (result.isConfirmed) {
            navigate('/singIn');
          }
        });
    }
  }

  return (

    <animated.div
      className={`product ${active ? 'active' : ''}`}
      style={springProps}
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
    >
      {(offer && exist) ? <div className='showOffFlag'>%{offer}</div> : ''}

      <div className="product__image">
        <img src={image} alt="food" />
      </div>

      <div className="product__content">
        <h5>{name[i18n.language]}</h5>
        <p className='pre1'>{dic[i18n.language]}</p>

        <div className={`product__sell ${offer && 'product__sell--off'}`}>
          {exist ? (
            <>
              <div className='priceWrapper'>
                <div className='sumPrice'>
                  {offer ? (
                    <sup className='discount'>
                      <Text delete className='priceDelete'>{cartSidebar(dollar, price, i18n.language)}</Text>
                    </sup>
                  ) : ''}
                  <span>{foodsP(dollar, price, i18n.language, offer)}</span>
                </div>
              </div>

              {isCart ? (
                <CountInCart foodId={id} count={isCart.count} exist={isCart.exist} />
              ) : (
                <div onClick={addToCartHandler}>
                  <ShoppingCartOutlined />
                </div>
              )}
            </>
          ) : (
            <>
              <span className='notExistText'>{t("failureFood")}</span>
              <div className='notExistBtn'>
                <ShoppingCartOutlined />
              </div>
            </>
          )}
        </div>
      </div>
    </animated.div>
  );
}

export default Food;
