import React, { useState } from 'react'
// style
import styles from "./info.module.css"
import "../../../style/register.css"
// ant
import { UserOutlined, PhoneOutlined, LockOutlined, MailOutlined, EditOutlined } from '@ant-design/icons';
import { Divider } from 'antd';
// form
import { useFormik } from "formik";
import FormFormik from '../../../components/formik/FormFormik';
import * as Yup from "yup";
// axios
import { fetchFrom } from '../../../services/axios';
// alert
import Swal from 'sweetalert2';
// redux
import { useSelector, useDispatch } from 'react-redux';
import { authDetail, authLogin } from "../../../redux/itemStore/auth"
// language
import { useTranslation } from 'react-i18next';
// helper
import { profileClickHandler } from '../../../helper/profile/profileHandler';


function Info() {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const [selectedImageUrl, setSelectedImageUrl] = useState(null);
  const auth = useSelector(authDetail);



  const arr = [
    {
      id: 1,
      name: 'name',
      type: 'text',
      label: t("namedLabelAuth"),
      placeholder: t("namePlaceholderAuth"),
      prefix: <UserOutlined />
    },
    {
      id: 2,
      name: 'phone',
      type: 'text',
      label: t("phoneLabelAuth"),
      placeholder: '09112348576',
      prefix: <PhoneOutlined />
    },
    {
      id: 3,
      name: 'email',
      type: 'email',
      label: t("userPanelInfoEmailLabel"),
      placeholder: 'example@gamil.com',
      prefix: <MailOutlined />
    },
    {
      id: 4,
    },
    {
      id: 5,
      name: 'oldPassword',
      type: 'password',
      label: t("userPanelInfoOldPasswordLabel"),
      placeholder: '',
      prefix: <LockOutlined />
    },
    {
      id: 6,
      name: 'newPassword',
      type: 'password',
      label: t("userPanelInfoNewPasswordLabel"),
      placeholder: '',
      prefix: <LockOutlined />
    },
    {
      id: 7,
      name: 'confirmPassword',
      type: 'password',
      label: t("confirmPasswordLabelAuth"),
      placeholder: '',
      prefix: <LockOutlined />
    },

  ]

  const registerSchema = Yup.object().shape({
    name: Yup.string()
      .min(3, t("yupNameMinLength"))
      .max(20, t("yupNameMaxLength"))
      .required(t("yupNameRequired")),
    phone: Yup.string()
      .matches(/^[0-9]{11}$/, t("yupPhoneMatch"))
      .required(t("yupPhoneRequired")),
    email: Yup.string()
      .required(t("YupEmailRequired"))
      .matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, t("YupEmailMatch")),


    oldPassword: Yup.string()
      .min(6, t("YupOldPasswordMin"))

      .test('password', t("YupOldPasswordNotValid"), function (value) {
        if (!value || value.trim() === '') {
          return true;
        }
        if (value === auth.userInfo.password) {
          return true;
        }
      }),

    newPassword: Yup.string()
      .test('newPasswordRequired', t("YupNewPasswordAtOld"), function (value) {
        if (!value || value.trim() === '') {
          return true;
        }
        return this.parent.oldPassword !== undefined && this.parent.oldPassword !== null;
      })
      .test('newPasswordDifferent', t("YupNewPasswordDifferent"), function (value) {
        if (this.parent.oldPassword !== undefined && this.parent.oldPassword !== null) {
          return value !== this.parent.oldPassword;
        }
        return true;
      })
      .min(6, t("YupNewPasswordMin")),


    confirmPassword: Yup.string()
      .test('confirmPassword', t("yupConfirmPasswordRequired"), function (value) {
        if (!value || value.trim() === '') {
          return true;
        }
        return (value === form.values.newPassword);
      }),



  });

  const form = useFormik({
    initialValues: { name: auth.userInfo.name, phone: auth.userInfo.phone, email: auth.userInfo.email, oldPassword: '', newPassword: '', confirmPassword: '' },

    onSubmit: async (values, { setSubmitting, resetForm }) => {

      const pureFormData = { ...values };

      delete pureFormData.confirmPassword
      delete pureFormData.oldPassword
      delete pureFormData.newPassword


      values.newPassword && (pureFormData.password = values.newPassword);
      selectedImageUrl && (pureFormData.image = selectedImageUrl);

      const sendData = { ...auth.userInfo, ...pureFormData }

      const res = await fetchFrom({
        method: 'put',
        url: `/users/${auth.userInfo.id}`,
        requestConfig: { ...sendData }
      });



      Swal.fire({
        title: `${res.error === 400 ? t("registerSwalTitleError") : res.error === 999 ? t("alertConnectToNet") : t("authSwalTitleSuccess")}`,
        icon: `${res.error ? 'error' : 'success'}`,
        confirmButtonText: t("okSwalBtn"),
        customClass: {
          popup: 'darkSwal',
        }
      })
        .then(() => {
          if (res.error) {
            setSubmitting(false);
          } else {

            dispatch(authLogin(res.data))
            resetForm({ values: { ...values, oldPassword: '', newPassword: '', confirmPassword: '' } })
          }
        })

    },


    validationSchema: registerSchema,
  });

 

  return (
    <div className={styles.wrapper}>
      {
        auth.userInfo && (
          <form onSubmit={form.handleSubmit} className={styles.form}>
            <div className={styles.profile}>
              <img src={selectedImageUrl ? selectedImageUrl : auth.userInfo.image} alt="profile" />
              <p className={styles.profileBtn} onClick={() => profileClickHandler(t, setSelectedImageUrl, true)}>
                <EditOutlined />
              </p>
            </div>
            {
              arr.map(item => {
                if (item.id === 4) {
                  return (

                    <div key={item.id}>
                      <Divider className={styles.div}>{t("userPanelInfoChangePassword")}</Divider>
                    </div>
                  );
                }
                return <FormFormik key={item.id} {...item} form={form} />;
              })
            }

            <div className='buttonsWrapper'>
              <button
                type="submit"
                className={`${form.isSubmitting ? "btn-deActive" : ""} btn`}
                disabled={auth.userInfo.rol === 'VIEWER' ? true : form.isSubmitting}
              >
                {form.isSubmitting ? t("formLoadingBtn") : t("userPanelInfoUpdateBtn")}
              </button>
            </div>

          </form>
        )
      }
    </div >
  );

}

export default Info