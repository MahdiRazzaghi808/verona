import React from "react"
// ant
import { Modal, Button, ConfigProvider } from "antd"
// redux
import { useSelector, useDispatch } from "react-redux";
import { putCommentsFromServer } from "../../../../redux/itemStore/comments";
import { themeDetail } from "../../../../redux/itemStore/theme";
import { authDetail } from "../../../../redux/itemStore/auth";
// alert
import Swal from "sweetalert2";
// axios
import { fetchFrom } from "../../../../services/axios";
// language
import { useTranslation } from 'react-i18next';
import { addToCart } from "../../../../helper/sweetAlert/seetAlert";



const ModalC = ({ open, data, lan }) => {
  const { isModalOpen, setIsModalOpen } = open;
  const { modalData, setModalData } = data;
  const theme = useSelector(themeDetail);
  const auth = useSelector(authDetail);
  const { t } = useTranslation();

  const dispatch = useDispatch()

  const arrLan = [
    { id: 1, title: "En", value: "en" },
    { id: 2, title: "Fa", value: "fa" },
    { id: 3, title: "It", value: "it" },
    { id: 3, title: "Ar", value: "ar" },
    { id: 3, title: "Zh", value: "zh" },
    { id: 4, title: t('remove'), value: "" },
  ]

  const handleOk = async () => {
    if (auth.userInfo.rol === 'VIEWER') {
      addToCart(t('panelAlertAlarm2'), (lan === 'fa' || lan === 'ar') ? true : false, theme)
    } else {
      setIsModalOpen(false);
      if (!modalData.data.show || modalData.language) {

        if (modalData.type === 'user') {
          const res = await fetchFrom({ method: 'put', url: `comments/${modalData.data.id}`, requestConfig: { show: modalData.data.show, language: modalData.language } });
          if (res.data.id) {
            modalData.getData()
          }

        } else {
          dispatch(putCommentsFromServer({ id: modalData.data.id, show: modalData.data.show, language: modalData.language }))
        }


      } else {
        Swal.fire({
          icon: "error",
          text: t('pAdminModalCommentsAlert'),
          confirmButtonText: t('okSwalBtn'),
          customClass: {
            popup: theme ? 'darkSwal' : 'lightSwal',

          }
        });
      }
    }
  }

  const handleCancel = () => {
    setIsModalOpen(false)
  }
  ///////////////////////////////////////////////////////
  const lightTheme = {
    colorBgBase: "#ecf0f3",
    colorTextBase: "#333333",
    colorBorder: "#333333",
  }

  const darkTheme = {
    colorBgBase: "#232a3b",
    colorTextBase: "#fff",
    colorBorder: "#fff",
    colorPrimaryBg: "#313a55",
  }

  return (
    <ConfigProvider
      theme={{
        token: theme ? darkTheme : lightTheme
      }}
    >
      <Modal
        title={t('pAdminModalComments')}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button key="comment1" type="primary"
            onClick={handleOk} >
            {t('userPanelSwalProfileSelectSubmitBtn')}
          </Button>,
        ]}
      >
        <div className='languageBtn'>
          {
            arrLan.map(item =>
              <button
                key={item.id}
                className={`${modalData.language === item.value ? "active" : ""}`}
                onClick={() => setModalData(prev => ({ ...prev, language: item.value }))}
              >
                {
                  item.title
                }
              </button>
            )
          }
        </div>
      </Modal>
    </ConfigProvider>
  )
}

export default ModalC
