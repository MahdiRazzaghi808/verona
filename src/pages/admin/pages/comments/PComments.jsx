import React, { useEffect, useState } from 'react'
// components
import Tab from '../../components/tab/Tab';
import ModalC from '../../components/modal/ModalC';
// redux
import { useDispatch, useSelector } from 'react-redux';
import { commentsDetail, getCommentsFromServer, putCommentsFromServer, deleteCommentsFromServer } from '../../../../redux/itemStore/comments';
import { themeDetail } from '../../../../redux/itemStore/theme';
// helper
import { setTime } from '../../../../helper/setTime/setTime';
// alert
import Swal from 'sweetalert2';
import { addToCart, swalAlert } from '../../../../helper/sweetAlert/seetAlert';
// language
import i18n from "../../../../i18n"
import { useTranslation } from 'react-i18next';
// router
import { Link } from "react-router-dom"
import { authDetail } from '../../../../redux/itemStore/auth';


function PComments() {
  // hooks
  const dispatch = useDispatch();
  const { t } = useTranslation();
  // state
  const [showFilter, setShowFilter] = useState(9693406720007);
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalData, setModalData] = useState({ data: {}, language: "" });
  // redux
  const comments = useSelector(commentsDetail)
  const theme = useSelector(themeDetail);
  const auth = useSelector(authDetail);

  useEffect(() => {
    dispatch(getCommentsFromServer())

  }, [])


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
    setModalData({ data, language });
    setIsModalOpen(true);
  }

  const deleteHandler = (id) => {
    if (auth.userInfo.rol === 'VIEWER') {
      addToCart(t('panelAlertAlarm2'), (i18n.language === 'fa' || i18n.language === 'ar') ? true : false, theme)
    } else {
      swalAlert('warning', '', t('deleteSwalComponents'), t('deleteSwalComponentsYes'), t('deleteSwalComponentsNo'), theme, (result) => {
        if (result.isConfirmed) {
          dispatch(deleteCommentsFromServer(id))
        }
      }, true);
    }
  }

  const showCommentToSite = (data) => {
    if (auth.userInfo.rol === 'VIEWER') {
      addToCart(t('panelAlertAlarm2'), (i18n.language === 'fa' || i18n.language === 'ar') ? true : false, theme)
    } else {

      if (auth.userInfo.rol === 'VIEWER') {
        addToCart(t('panelAlertAlarm2'), (i18n.language === 'fa' || i18n.language === 'ar') ? true : false, theme)
      } else {

        if (data.language) {
          dispatch(putCommentsFromServer({ id: data.id, show: true, language: data.language }))
          addToCart(t('pAdminCommentsShowToSiteAlert'), (i18n.language === 'fa' || i18n.language === 'ar') ? true : false, theme)
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
  }

  const offCommentToSite = (data) => {

    dispatch(putCommentsFromServer({ id: data.id, show: false, language: data.language }));
    addToCart(t('pAdminCommentsOffToSiteAlert'), (i18n.language === 'fa' || i18n.language === 'ar') ? true : false, theme)

  }







  ////////////////////////////////////////////////////////////////////////////////////////////

  const columns = [
    {
      title: t('pAdminTableProfile'),
      dataIndex: "image",
      key: "image",
      render: (_, { image }) => (
        <div className='profile'>
          <img src={image} alt="profile" />
        </div>
      )

    },
    {
      title: t('pAdminTableName'), dataIndex: "name", key: "name", render: (v, data) => (
        <div >
          <Link to={`/pAdmin/user/${data.userId}`}>{v}</Link>
        </div>
      )
    },



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

  const arr = [
    {
      title: t('pAdminCommentsAllComments'),
      value: {
        col: columns,
        data: comments.filter(v => setTime() - v.time < showFilter),
        width: 55
      },

    },
    {
      title: t('pAdminCommentsAllCommentsShow'),
      value: {
        col: columns,
        data: comments.filter(v => (setTime() - v.time < showFilter) && v.show),
        width: 55,

      },

    },
    {
      title: t('pAdminCommentsAllCommentsOff'),
      value: {
        col: columns,
        data: comments.filter(v => (setTime() - v.time < showFilter) && !v.show),
        width: 55
      },

    }

  ]
  ////////////////////////////////////////////////////////////////////////////////////////////



  return (
    <div className='pAdminWrapper' >
      <h2>{t('userPanelComments')}</h2>
      <Tab arr={arr} filter={{ showFilter, setShowFilter }} type={"time"} />
      {isModalOpen ? <ModalC open={{ isModalOpen, setIsModalOpen }} data={{ modalData, setModalData }} lan={i18n.language} /> : ''}
    </div >
  )
}

export default PComments