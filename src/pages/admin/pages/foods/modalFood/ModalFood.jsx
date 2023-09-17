import React, { useState } from "react"
// styles
import styles from "./modalFood.module.css"
// ant
import { Modal, Input, InputNumber, Switch, Button, Select, Divider } from "antd"
import { Tabs } from "antd"
const { TextArea } = Input;
// react icons
import { BiSolidFoodMenu } from 'react-icons/bi';
import { AiOutlineUpload } from 'react-icons/ai';
import { FcInfo } from 'react-icons/fc';
// alert
import Swal from "sweetalert2";
import { addToCart, swalAlert } from "../../../../../helper/sweetAlert/seetAlert";
// language
import { useTranslation } from 'react-i18next';
// redux
import { useDispatch, useSelector } from "react-redux";
import { postFoodsFromServer, putFoodsFromServer, deleteFoodsFromServer } from "../../../../../redux/itemStore/foods";
import { themeDetail } from "../../../../../redux/itemStore/theme";
import { authDetail } from "../../../../../redux/itemStore/auth";



const categoryBox = {
    pizza: {
        "en": "pizza",
        "fa": "پیتزا",
        "it": "Pizza",
        "ar": "بيتزا",
        "zh": "比萨"
    },
    hamburger: {
        "en": "hamburger",
        "fa": "همبرگر",
        "it": "Hamburger",
        "ar": "همبرغر",
        "zh": "汉堡包"
    },
    friesSides: {
        "en": "friesSides",
        "fa": "غذاهای جانبی سیب‌زمینی سرخ‌کرده",
        "it": "Contorni di patatine fritte",
        "ar": "أطباق جانبية من البطاطس المقلية",
        "zh": "薯条配菜"

    },
    beverages: {
        "en": "Beverages",
        "fa": "نوشیدنی‌ها",
        "it": "Bevande",
        "ar": "مشروبات",
        "zh": "饮料"

    }
}


const ModalFood = ({ open, data, lan, foods }) => {
    const { isModalOpen, setIsModalOpen } = open;
    const { modalData, setModalData } = data;
    ///////////////////////////////////////////////////
    const { t } = useTranslation()
    const dispatch = useDispatch()
    const theme = useSelector(themeDetail)
    const auth = useSelector(authDetail)
    ////////////////////////////////////////////////
    const [imageFood, setImageFood] = useState(modalData.data.image)
    const [nameFood, setNameFood] = useState(modalData.data.name)
    const [dicFood, setDicFood] = useState(modalData.data.dic)
    const [categoryFood, setCategoryFood] = useState(modalData.data.category)
    const [priceFood, setPriceFood] = useState(modalData.data.price);
    const [offerFood, setOfferFood] = useState(modalData.data.offer ? modalData.data.offer : 0);
    ////////////////////////////////////////////////////////
    const [offFlag, setOffFlag] = useState(!!modalData.data.offer);
    const [percentAfter, setPercentAfter] = useState((100 - modalData.data.offer) * priceFood / 100);
    /////////////////////////////////////////////////////////////////////////////
    const handleCancel = () => {
        setIsModalOpen(false)
    }


    const arrReduce = foods.reduce((prev, next) => {
        return ({ hot: prev.hot + (+next.hot), off: prev.off + (+next.off) })
    }, { hot: 0, off: 0 })




    const deleteHandler = (id) => {
        if (auth.userInfo.rol === 'VIEWER') {
            addToCart(t('panelAlertAlarm2'), (lan === 'fa' || lan === 'ar') ? true : false, theme)
        } else {

            swalAlert('warning', '', t('deleteSwalComponents'), t('deleteSwalComponentsYes'), t('deleteSwalComponentsNo'), theme, (result) => {
                if (result.isConfirmed) {

                    if (arrReduce.hot === 9 && modalData.data.hot) {
                        Swal.fire({
                            icon: 'error',
                            text: t('pAdminFoodsMinHotAlert'),
                            customClass: {
                                popup: theme ? 'darkSwal' : 'lightSwal',

                            }
                        })
                        return true
                    }

                    dispatch(deleteFoodsFromServer(id))
                    setIsModalOpen(false);
                }
            })

        }
    }

    const putHandler = (type) => {
        if (auth.userInfo.rol === 'VIEWER') {
            addToCart(t('panelAlertAlarm2'), (lan === 'fa' || lan === 'ar') ? true : false, theme)
        } else {
            if (type === 'archive' && modalData.data.hot) {
                if (arrReduce.hot === 9) {
                    Swal.fire({
                        icon: 'error',
                        text: t('pAdminFoodsMinHotAlert'),
                        customClass: {
                            popup: theme ? 'darkSwal' : 'lightSwal',

                        }
                    })
                    return true
                }
            }

            const sendData = {
                ...modalData.data,
                image: imageFood ? imageFood : modalData.data.image,
                name: nameFood,
                dic: dicFood,
                category: categoryFood,
                price: (+priceFood).toFixed(2),
                offer: offFlag ? (+offerFood).toFixed(1) : '',
                archive: type === 'archive' ? true : false,
                hot: type === 'archive' ? false : modalData.data.hot,
                off: (type === 'archive' || !offFlag) ? false : modalData.data.off
            }
            dispatch(putFoodsFromServer(sendData));
            setIsModalOpen(false);
            (type === 'archive') ? addToCart(t('pAdminFoodsAddToArchivedAlert'), (lan === 'fa' || lan === 'ar') ? true : false, theme) : addToCart(t('pAdminFoodsAddToMenuAlert'), (lan === 'fa' || lan === 'ar') ? true : false, theme)


        }
    }

    const postHandler = (type) => {
        if (auth.userInfo.rol === 'VIEWER') {
            addToCart(t('panelAlertAlarm2'), (lan === 'fa' || lan === 'ar') ? true : false, theme)
        } else {
            const sendData = {
                ...modalData.data,
                image: imageFood ? imageFood : modalData.data.image,
                name: nameFood,
                dic: dicFood,
                category: categoryFood,
                price: (+priceFood).toFixed(2),
                offer: (offFlag && +offerFood) ? (+offerFood).toFixed(1) : '',
                exist: modalData.type === 'new' ? type === 'show' ? true : false : modalData.data.exist,

                archive: type === 'archive' ? true : false,
            }
            dispatch(postFoodsFromServer(sendData));
            setIsModalOpen(false);

            (type === 'archive') ? addToCart(t('pAdminFoodsAddToArchivedAlert')) : addToCart(t('pAdminFoodsAddToMenuAlert'), (lan === 'fa' || lan === 'ar') ? true : false, theme)
        }
    }



    const validateHandler = () => {

        if (priceFood === 0) {
            return true;
        }



        for (const lang in nameFood) {
            if (nameFood[lang].trim().length < 2) {
                return true;
            }
        }

        for (const lang in dicFood) {
            if (dicFood[lang].trim().length < 10) {
                return true;
            }
        }



        return false;
    }


    /////////////////////////////////////////////////////////////////////////////
    const imageHandler = () => {
        Swal.fire({
            title: t("userPanelSwalProfileSelectCustomTitle"),
            input: 'url',
            inputPlaceholder: t("userPanelSwalProfileSelectCustomInputPlaceholder"),
            showCancelButton: true,
            confirmButtonText: t('userPanelSwalProfileSelectSubmitBtn'),
            cancelButtonText: t('pAdminTableStatuscancel'),
            customClass: {
                popup: theme ? 'darkSwal' : 'lightSwal',

            }
        }).then((result) => setImageFood(result.value));
    }

    const nameChangeHandler = (v, lan) => {
        setNameFood(prev => ({ ...prev, [lan]: v }))

    }
    const dicChangeHandler = (v, lan) => {
        setDicFood(prev => ({ ...prev, [lan]: v }))
    }
    const categoryHandler = (v) => {
        setCategoryFood(categoryBox[v])
    }

    //////////////////////////////////////////////////////////////////////////

    const percentAfterHandler = e => {
        setPercentAfter(e);
        setOfferFood(100 - (100 * e / priceFood))
    }

    const offerHandler = e => {
        setOfferFood(e);
        setPercentAfter((100 - e) * priceFood / 100)

    }

    const priceHandler = e => {
        setPriceFood(e);
        setPercentAfter((100 - offerFood) * e / 100)
    }

    const switchHandler = e => {
        setOffFlag(e);
    }

    ////////////////////////////////////////////////////////////////////////////////////
    const ht = (lan, pName, pDic) => {
        return (
            <div className={styles.dicWrapper}>
                <Input value={nameFood[lan]} onChange={(e) => nameChangeHandler(e.target.value, lan)} size="large" placeholder={pName} prefix={<BiSolidFoodMenu />} />
                <TextArea
                    showCount
                    maxLength={100}
                    value={dicFood[lan]}
                    style={{ height: 120, resize: 'none' }}
                    onChange={(e) => dicChangeHandler(e.target.value, lan)}
                    placeholder={pDic}
                />
            </div>
        )
    }

    const tabItems = [
        {
            key: "1",
            label: "En",
            children: ht('en', "food name", "food dic")
        },
        {
            key: "2",
            label: "Fa",
            children: ht('fa', "اسم غذا", "توضیحات غذا")

        },
        {
            key: "3",
            label: "It",
            children: ht('it', "nome del cibo", "cibo dic")
        },
        {
            key: "4",
            label: "Ar",
            children: ht('ar', "اسم الطعام", "الغذاء ديك")
        },
        {
            key: "5",
            label: "Zh",
            children: ht('zh', "食物名称", "食品迪克")
        }
    ]
    ////////////////////////////////////////////////////////////////////////////////////


    return (
        <>

            <Modal
                open={isModalOpen}
                onCancel={handleCancel}

                footer={[

                    <Button key="order" type="primary" danger onClick={() => deleteHandler(modalData.data.id)}
                        style={{ display: modalData.type === 'new' ? 'none' : 'viable' }}>
                        {t('pAdminTableDelete')}
                    </Button>,

                    <Button key="order1" type="primary"
                        onClick={() => modalData.type === 'new' ? postHandler('archive') : putHandler('archive')}>
                        {t('pAdminFoodsMenuArchive')}
                    </Button>,

                    <Button key="order2" type="primary" disabled={validateHandler()}
                        onClick={() => modalData.type === 'new' ? postHandler('show') : putHandler('show')} >
                        {t('pAdminFoodsShowMenuBtn')}
                    </Button>,
                ]}
            >
                <div className={styles.wrapper}>
                    <div className={styles.imageWrapper}>
                        <img src={imageFood ? imageFood : modalData.data.image} alt="food image" />
                        <AiOutlineUpload onClick={imageHandler} />
                    </div>

                    <div className={styles.tabWrapper}>
                        <h3>{t('pAdminFoodsDescription')}</h3>
                        <Tabs defaultActiveKey="1" items={tabItems} />
                    </div>



                    <div className={styles.category}>
                        <Divider orientation="left" orientationMargin="0">{t('pAdminFoodsCategories')}</Divider>

                        <Select
                            value={categoryFood[lan]}
                            style={{ width: '100%' }}
                            onChange={categoryHandler}
                            options={[
                                { value: 'hamburger', label: t("productsBurger") },
                                { value: 'pizza', label: t("productsPizza") },
                                { value: 'friesSides', label: t("productsFriesSides") },
                                { value: 'beverages', label: t("productsBeverages") },
                            ]}
                        />
                    </div>


                    <div className={styles.price}>

                        <Divider orientation="left" orientationMargin="0">{t('pAdminFoodsPriceSection')}</Divider>



                        <div className={styles.priceWrapper}>

                            <div className={styles.firstRow}>
                                <div className={styles.inputs}>
                                    <p>{t('pAdminTablePrice')}</p>
                                    <InputNumber
                                        value={priceFood}
                                        min={0}
                                        step={0.01}
                                        formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                        parser={value => value.replace(/\$\s?|(,*)/g, "")}
                                        onChange={priceHandler}
                                        style={{ width: '100%' }}
                                    />
                                </div>
                                <Switch checkedChildren={t('On')} unCheckedChildren={t('Off')} checked={offFlag} onChange={switchHandler} />
                            </div>

                            <div className={styles.secondRow}>

                                <div className={styles.inputs}>
                                    <p>{t('pAdminTablePercent')}</p>

                                    <InputNumber
                                        value={offerFood}
                                        min={0}
                                        max={100}
                                        step={0.1}
                                        formatter={value => `${value}%`}
                                        parser={value => value.replace("%", "")}
                                        onChange={offerHandler}
                                        disabled={offFlag ? false : true}
                                        style={{ width: '100%' }}
                                    />
                                </div>
                                <div className={styles.inputs}>
                                    <p>{t('pAdminFoodsPriceAfterPercent')}</p>

                                    <InputNumber
                                        value={percentAfter}
                                        min={0}
                                        max={priceFood}
                                        step={0.01}
                                        formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                        parser={value => value.replace(/\$\s?|(,*)/g, "")}
                                        onChange={percentAfterHandler}
                                        disabled={offFlag ? false : true}
                                        style={{ width: '100%' }}
                                    />
                                </div>



                            </div>
                        </div>
                    </div>


                    <div className={styles.alertInfo}>

                        <div>
                            <FcInfo />
                            <div>
                                {validateHandler() ? <span className={styles.error}>{t('pAdminFoodsUnsuccessAlert')}</span> : <span className={styles.ok}>{t('pAdminFoodsSuccessAlert')}</span>}
                            </div>
                        </div>

                    </div>

                </div>
            </Modal>
        </>
    )
}

export default ModalFood
