import React, { useEffect, useState } from 'react'
// component
import ProducerTable from '../../../components/table/ProducerTable';
import ModalC from '../../../components/modal/ModalC';
// alert
import Swal from 'sweetalert2';
// axios
import { fetchFrom } from '../../../../../services/axios';
import { addToCart, swalAlert } from '../../../../../helper/sweetAlert/seetAlert';
// redux
import { useSelector } from 'react-redux';
import { themeDetail } from '../../../../../redux/itemStore/theme';
import { authDetail } from '../../../../../redux/itemStore/auth';
// language
import { useTranslation } from 'react-i18next';
import i18n from '../../../../../i18n';

function UserComments({ token, getDataInfo }) {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [modalData, setModalData] = useState({ data: {}, language: "" });

    const [comments, setComments] = useState([]);
    const theme = useSelector(themeDetail)
    const auth = useSelector(authDetail)
    const { t } = useTranslation();

    useEffect(() => {
        getData();

    }, [])
    ///////////////////////////////////////////////

    const getData = async () => {
        const res = await fetchFrom({ method: 'get', url: `/comments?token=${token}` });
        setComments(res.data)
    }

    const showCommentHandler = (body) => {
        Swal.fire({
            text: body,
            confirmButtonText: t('okSwalBtn'),
            customClass: {
                popup: theme ? 'darkSwal' : 'lightSwal',

            }

        });
    }

    const changeLanguageHandler = (data, language) => {
        setModalData({ data, language, type: 'user', getData });
        setIsModalOpen(true);
    }

    const showCommentToSite = async (data) => {
        if (auth.userInfo.rol === 'VIEWER') {
            addToCart(t('panelAlertAlarm2'), (i18n.language === 'fa' || i18n.language === 'ar') ? true : false, theme)
        } else {

            if (data.language) {
                const res = await fetchFrom({ method: 'put', url: `comments/${data.id}`, requestConfig: { show: true, language: data.language } });
                if (res.data.id) {
                    getData()
                }
            } else {
                Swal.fire({
                    icon: "error",
                    text: t('pAdminCommentsShowToSiteAlertText'),
                    confirmButtonText: t('okSwalBtn'),
                    customClass: {
                        popup: theme ? 'darkSwal' : 'lightSwal',

                    }
                });
            }
        }
    }

    const offCommentToSite = async (data) => {
        if (auth.userInfo.rol === 'VIEWER') {
            addToCart(t('panelAlertAlarm2'), (i18n.language === 'fa' || i18n.language === 'ar') ? true : false, theme)
        } else {
            const res = await fetchFrom({ method: 'put', url: `comments/${data.id}`, requestConfig: { show: false, language: data.language } });
            if (res.data.id) {
                getData()
            }
        }
    }

    const deleteHandler = (id) => {
        if (auth.userInfo.rol === 'VIEWER') {
            addToCart(t('panelAlertAlarm2'), (i18n.language === 'fa' || i18n.language === 'ar') ? true : false, theme)
        } else {
            swalAlert('warning', '', t('deleteSwalComponents'), t('deleteSwalComponentsYes'), t('deleteSwalComponentsNo'), theme, async (result) => {
                if (result.isConfirmed) {
                    const res = await fetchFrom({ method: 'delete', url: `comments/${id}` })
                    if (res.data.deletedId) {
                        getData();
                        getDataInfo()
                    }
                }
            })
        }
    }

    //////////////////////////////////////////////////////////////////////////////////////////

    const columns = [
        {
            title: t('pAdminTableBodyComments'),
            dataIndex: "body",
            key: "body",
            render: (body) =>
                <div>
                    <button className='pBtn' onClick={() => showCommentHandler(body)}>{t('pAdminCommentsAllCommentsShowBody')}</button>
                </div>
        },

        {
            title: t('pAdminTableLanguage'),
            dataIndex: "language",
            key: "language",
            filters: [
                {
                    text: "En",
                    value: "en"
                },
                {
                    text: "Fa",
                    value: "fa"
                },
                {
                    text: "It",
                    value: "it"
                },
                {
                    text: "Ar",
                    value: "ar"
                },
                {
                    text: "Zh",
                    value: "zh"
                },
                {
                    text: t('pAdminTableNoLanguage'),
                    value: "?"
                },
            ],
            onFilter: (value, record) => (!record.language ? '?' : record.language).indexOf(value) === 0,
            render: (language, data) =>
                <div>
                    <button className='pBtn' onClick={() => changeLanguageHandler(data, language ? language : "?")}>{language ? language : "?"} </button>
                </div>
        },

        {
            title: t('pAdminTableAction'),
            dataIndex: "show",
            key: "show",
            render: (show, data) =>
                <div className='buttonWrapper'>

                    {!show ?
                        <button className='pBtn'
                            onClick={() => showCommentToSite(data)}>{t('pAdminTableShow')}</button>
                        :
                        <button className='pBtn'
                            onClick={() => offCommentToSite(data)}>{t('pAdminTableOff')}</button>
                    }

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

    ////////////////////////////////////////////////////////////////////////////////////////////


    return (
        <div className='pAdminWrapper' >
            <ProducerTable col={columns} data={comments} width={30} />

            {isModalOpen ? <ModalC open={{ isModalOpen, setIsModalOpen }} data={{ modalData, setModalData }} /> : ''}
        </div >
    )
}

export default UserComments