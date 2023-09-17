import React, { useEffect, useState } from 'react'
// component
import ProducerTable from '../../../components/table/ProducerTable'
// style
import styles from "./discountUser.module.css"
// axios
import { fetchFrom } from "../../../../../services/axios"
// alert
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// copy
import copy from 'copy-to-clipboard';
// helper
import { handleCreateClick } from '../../../../../helper/discountInputs/discountInputs';
import { generateRandomCode } from '../../../../../helper/randomCode/generateRandomCode';
import { addToCart } from '../../../../../helper/sweetAlert/seetAlert';
// redux
import { useSelector } from 'react-redux';
import { themeDetail } from '../../../../../redux/itemStore/theme';
import { authDetail } from '../../../../../redux/itemStore/auth';

// language
import i18n from '../../../../../i18n';
import { useTranslation } from 'react-i18next';

function DiscountUser({ token, userInfo }) {

    const [discount, setDiscount] = useState([]);
    const theme = useSelector(themeDetail)
    const auth = useSelector(authDetail)
    const { t } = useTranslation();



    useEffect(() => {
        getData()

    }, [])

    //////////////////////////////////////////////

    const getData = async () => {
        const res = await fetchFrom({ method: 'get', url: `/discount?token=${token}` });
        !res.error && setDiscount(res.data)
    }


    const copyToClipboard = (discountCode) => {
        copy(discountCode); // Copy discount code to clipboard
        toast.success(t('userPanelDiscountAlertCopy'), {
            position: 'top-left',
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        })

    };


    const sendData = async (input1, input2) => {
        const res = await fetchFrom({
            method: 'post', url: '/discount',
            requestConfig: { countUse: input1, percent: input2, discountCode: generateRandomCode(7), token, name: userInfo.name, userId: userInfo.id, image: userInfo.image }
        })

        !res.error && getData()
        !res.error && addToCart(t('pAdminDiscountAlertSuccess'), (i18n.language === 'fa' || i18n.language === 'ar') ? true : false, theme)

    }

    const deleteHandler = async (id) => {
        if (auth.userInfo.rol === 'VIEWER') {
            addToCart(t('panelAlertAlarm2'), (i18n.language === 'fa' || i18n.language === 'ar') ? true : false, theme)
        } else {
            const res = await fetchFrom({ method: 'delete', url: `/discount/${id}` });
            !res.error && getData()
        }
    }

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
    const columns = [


        {
            title: t('pAdminTablePercent'),
            dataIndex: "percent",
            key: "percent",
            render: (percent) =>
                <div>
                    <span>{percent}%</span>
                </div>
        },

        {
            title: t('userPanelDiscountTitle'),
            dataIndex: "discountCode",
            key: "discountCode",
            render: (discountCode) =>
                <div>
                    <button className='pBtn' onClick={() => copyToClipboard(discountCode)}>{discountCode}</button>
                </div>
        },

        {
            title: t('pAdminTableUseCount'),
            dataIndex: "countUse",
            key: "countUse",
            render: (countUse) =>
                <div>
                    <span>{+countUse ? +countUse : t('pAdminDiscountExpired')}</span>
                </div>
        },

        {
            title: t('pAdminTableDelete'),
            dataIndex: "",
            key: "x",
            render: (_, data) =>
                <div >
                    <button className='btn-cancel' onClick={() => deleteHandler(data.id)}>{t('pAdminTableDelete')}</button>
                </div>

        }
    ]
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////

    return (
        <div className={styles.wrapper}>

            <div className={styles.header}>
                <button className='btn' onClick={() => handleCreateClick(t, auth, i18n.language, sendData, theme, t('pAdminDiscountAlertMessage'), t('pAdminDiscountCountUse'), t('pAdminDiscountPercentsUse'), t('pAdminDiscountCreator'), t('pAdminTableStatuscancel'), t('pAdminDiscountTitleAlert'))}>{t('pAdminDiscountNewBtn')}</button>
            </div>


            <ProducerTable col={columns} data={discount} width={20} />



        </div>
    )
}

export default DiscountUser