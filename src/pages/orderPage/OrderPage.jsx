import React, { useState } from 'react'
// router
import { Link, useNavigate } from "react-router-dom"
//style
import styles from "./orderPage.module.css"
// ant
import { Collapse, Divider, Typography, Input, Form } from "antd"
import { EnvironmentOutlined, ShopOutlined, CheckOutlined, PercentageOutlined, ShoppingCartOutlined } from '@ant-design/icons';
const { Text } = Typography;
// redux
import { useSelector, useDispatch } from 'react-redux';
import { cartDetail, clearAll } from '../../redux/itemStore/cart';
import { authDetail } from '../../redux/itemStore/auth';
import { dollarDetail } from '../../redux/itemStore/dollar';
// language
import { useTranslation } from 'react-i18next';
import i18n from '../../i18n';
// alert
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// helper
import { mDate, setTime } from '../../helper/setTime/setTime';
import { generateRandomCode } from '../../helper/randomCode/generateRandomCode';
import { cartBaseP, cartP, orderSidebar, orderSidebarFinal } from '../../helper/price/priceShow';
// axios
import { fetchFrom } from '../../services/axios';


function OrderPage() {
    const { t } = useTranslation();

    //// Collapse value
    const arr = [
        <div className={styles.collapseItemWrapper}>
            <EnvironmentOutlined style={{ fontSize: '1.2rem' }} />
            <div className={styles.collapseText}>
                <p>{t("orderPageCollapseTitleOne")}</p>
                <p>{t("orderPageCollapseBodyOne")}</p>
            </div>
        </div>,
        <div className={styles.collapseItemWrapper}>
            <ShopOutlined style={{ fontSize: '1.2rem' }} />
            <div className={styles.collapseText}>
                <p>{t("orderPageCollapseTitleTwo")}</p>
                <p>{t("orderPageCollapseBodyTwo")}</p>
            </div>
        </div>
    ]
    ////////////////////////////////////////////////////
    // hooks
    const dispatch = useDispatch()
    const navigate = useNavigate()
    //  state
    const [itemShow, setItemShow] = useState(0);
    const [address, setAddress] = useState('');
    const [open, setOpen] = useState([]);
    const [errorDiscount, setErrorDiscount] = useState(false);
    const [input, setInput] = useState('');
    const [discount, serDiscount] = useState({ percent: 0 })
    // redux
    const cart = useSelector(cartDetail)
    const auth = useSelector(authDetail);
    const dollar = useSelector(dollarDetail);



    const onChange = key => {
        open.length ? setOpen([]) : setOpen(['1'])
    }

    const changeHandler = (id) => {
        setItemShow(id)
        setOpen([])
    }

    const items = [
        {
            key: "1",
            label: arr[itemShow],
            children:
                <div className={styles.collapse}>

                    <div onClick={(e) => changeHandler(0)} className={styles.collapseItem}>
                        {arr[0]}
                        {itemShow === 0 && <CheckOutlined style={{ fontSize: '1.2rem' }} />}
                    </div>

                    <div className={styles.div}></div>

                    <div onClick={(e) => changeHandler(1)} className={styles.collapseItem}>
                        {arr[1]}
                        {itemShow === 1 && <CheckOutlined style={{ fontSize: '1.2rem' }} />}
                    </div>

                </div>
        },
    ];

    const discountHandler = async () => {
        const res = await fetchFrom({ method: 'get', url: `/checkDiscount?code=${input}&token=${localStorage.getItem('token')}` });
        if (res.data.isValid) {
            serDiscount(res.data.discount);
            toast.success(`A ${res.data.discount.percent}% discount code has been applied :)`, {
                position: 'top-left',
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            })
        } else {
            setErrorDiscount(true);
            serDiscount({ percent: 0 });
        }


    }


    const addressHandler = event => {
        setAddress(event.target.value)
    }

    ////////////////////////////////////////////////
    const cancelHandler = async () => {
        const res = await fetchFrom({ method: 'post', url: '/order', requestConfig: { ...orderData('cancel') } })
        if (res.data.id) {
            Swal.fire({
                text: t("orderPageCancelAlertTitle"),
                icon: 'info',
                confirmButtonText: t("okSwalBtn"),
                customClass: {
                    popup: 'darkSwal',
                }
            }).then(() => {
                dispatch(clearAll(auth.userInfo.token))
                navigate('/')
            })
        }

    }

    const payHandler = async () => {
        if (address.length > 5 || itemShow === 1) {
            const res = await fetchFrom({ method: 'post', url: '/order', requestConfig: { ...orderData('success') } })
            if (res.data.id) {

                Swal.fire({
                    text: t("orderPageSuccessAlertTitle"),
                    icon: 'success',
                    confirmButtonText: t("okSwalBtn"),
                    customClass: {
                        popup: 'darkSwal',
                    }
                }).then(() => {
                    dispatch(clearAll(auth.userInfo.token))
                    navigate('/')
                })
            }
        } else {
            Swal.fire({
                text: t("orderPageErrorAlertTitle"),
                icon: 'error',
                confirmButtonText: t("okSwalBtn"),
                customClass: {
                    popup: 'darkSwal',
                }
            });

        }
    }
    ////////////////////////////////////////////////////////
    const addPriceHandler = (cart) => {
        const outArr = cart.map(item => {
            const newItem = { ...item }
            const { price, offer, count } = item

            newItem.price = {
                en: cartBaseP(dollar, count, price, 'en'),
                fa: cartBaseP(dollar, count, price, 'fa'),
                it: cartBaseP(dollar, count, price, 'it'),
                ar: cartBaseP(dollar, count, price, 'ar'),
                zh: cartBaseP(dollar, count, price, 'zh'),
            }


            if (offer) {
                newItem.priceAfterOff = {
                    en: cartP(dollar, count, price, 'en', offer),
                    fa: cartP(dollar, count, price, 'fa', offer),
                    it: cartP(dollar, count, price, 'it', offer),
                    ar: cartP(dollar, count, price, 'ar', offer),
                    zh: cartP(dollar, count, price, 'zh', offer),
                }
            } else {
                newItem.priceAfterOff = newItem.price
            }

            return newItem
        })
        return outArr

    }
    ////////////////////////////////////////////////////////

    const orderData = (type) => {



        const data = {
            key: generateRandomCode(32),
            token: auth.userInfo.token,
            date: mDate(setTime()),
            time: setTime(),
            userId: auth.userInfo.id,
            name: auth.userInfo.name,
            phone: auth.userInfo.phone,
            done: false,
            discountCode: type === 'success' ? discount.discountCode : '',
            percent: type === 'success' ? +discount.percent : '',
            address: itemShow === 0 ? address : 'Restaurant😎',
            status: type === 'success' ? "successful" : "cancel",
            price: {
                fa: orderSidebarFinal(dollar, cart.summary.final, cart.summary.total, +discount.percent, itemShow, 'fa'),
                faT: orderSidebarFinal(dollar, cart.summary.final, cart.summary.total, +discount.percent, itemShow, 'fa', 'faT'),
                en: orderSidebarFinal(dollar, cart.summary.final, cart.summary.total, +discount.percent, itemShow, 'en'),
                it: orderSidebarFinal(dollar, cart.summary.final, cart.summary.total, +discount.percent, itemShow, 'it'),
                ar: orderSidebarFinal(dollar, cart.summary.final, cart.summary.total, +discount.percent, itemShow, 'ar'),
                zh: orderSidebarFinal(dollar, cart.summary.final, cart.summary.total, +discount.percent, itemShow, 'zh'),
            },
            priceBase: {
                fa: orderSidebarFinal(dollar, cart.summary.final, cart.summary.total, 0, itemShow, 'fa'),
                en: orderSidebarFinal(dollar, cart.summary.final, cart.summary.total, 0, itemShow, 'en'),
                it: orderSidebarFinal(dollar, cart.summary.final, cart.summary.total, 0, itemShow, 'it'),
                ar: orderSidebarFinal(dollar, cart.summary.final, cart.summary.total, 0, itemShow, 'ar'),
                zh: orderSidebarFinal(dollar, cart.summary.final, cart.summary.total, 0, itemShow, 'zh'),
            },
            cart: addPriceHandler(cart.cart)
        }


        return data
    }

    return (

        <div className={styles.wrapper}>
            <div className='container'>
                <div className={styles.orderPage}>

                    <div className={styles.header}>
                        <h2>{t("orderPageTitle")}</h2>
                        <Link to='/cart'>{t("orderPageBack")} <ShoppingCartOutlined /></Link>
                    </div>


                    <div className={styles.address}>

                        <Divider className={styles.divider} orientation="left" style={{ width: "300px" }}>{t("orderPageReceive")}</Divider>
                        <p className={styles.titleM}>{t("orderPageReceive")} </p>

                        <Collapse size="large" items={items} defaultActiveKey={[]} activeKey={open} onChange={onChange} />
                        {
                            itemShow === 0

                                ?
                                <div>
                                    <Input size='large' placeholder={t("orderPageInputAddress")} prefix={<EnvironmentOutlined />} value={address} onChange={addressHandler} maxLength={35} />
                                </div>
                                :
                                ""
                        }

                    </div>
                    {/* ///////////////////////////// */}
                    <div className={styles.div}></div>
                    {/* ///////////////////////////// */}

                    <div className={styles.discountWrapper}>

                        <Divider className={styles.divider} orientation="left" style={{ width: "300px" }}>{t("orderPageDiscount")}</Divider>
                        <p className={styles.titleM}>{t("orderPageDiscount")}</p>
                        <div className={styles.discount}>
                            <Form.Item
                                label=""
                                validateStatus={!errorDiscount ? 'success' : 'error'}
                                help={!errorDiscount ? '' : t("orderPageDiscountError")}
                            >
                                <Input value={input} onChange={(e) => setInput(e.target.value)} placeholder={t("orderPageDiscountPlaceholder")} prefix={<PercentageOutlined />} size='large' />
                            </Form.Item>
                            <button className='btn' onClick={discountHandler}>{t("orderPageDiscountBtn")}</button>
                        </div>

                    </div>
                    {/* ///////////////////////////// */}
                    <div className={styles.div}></div>
                    {/* ///////////////////////////// */}
                    <div className={styles.detailsWrapper}>
                        <Divider className={styles.divider} orientation="left">{t("orderPageDetails")}</Divider>
                        <p className={styles.titleM}>{t("orderPageDetails")}</p>

                        <div className={styles.details}>



                            <div>
                                <p>{t("orderPageSidebarShippingCost")}</p>
                                <p>{cart.summary.total < 50 ? orderSidebar(dollar, itemShow, i18n.language) : t('free')} </p>
                            </div>

                            <div>
                                <p>{t("orderPageSidebarDiscount")}</p>
                                <p>{+discount.percent}%</p>
                            </div>

                            <div>
                                <p>{t("orderPageSidebarFinalPrice")}</p>
                                <div className={`priceWrapper ${styles.priceCartWrapper}`}>
                                    {
                                        +discount.percent ? <div className='discount'>
                                            <Text delete className='priceDelete'>{orderSidebarFinal(dollar, cart.summary.final, cart.summary.total, 0, itemShow, i18n.language)}</Text>
                                        </div>
                                            : ''
                                    }
                                    <div className=''>{orderSidebarFinal(dollar, cart.summary.final, cart.summary.total, +discount.percent, itemShow, i18n.language)}</div>

                                </div>
                            </div>

                        </div>

                    </div>


                    <div className={styles.buttons}>
                        <button className='btn' onClick={payHandler}>{t("orderPagePaymentPageBtn")}</button>
                        <button className='btn' onClick={cancelHandler}>{t("orderPageCancelBtn")}</button>
                    </div>


                </div>
            </div>
        </div >
    )
}

export default OrderPage