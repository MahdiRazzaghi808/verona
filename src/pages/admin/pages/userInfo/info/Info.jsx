import React, { useEffect, useState } from 'react'
// style
import styles from "./info.module.css";
// ant
import { UserOutlined, PhoneOutlined, LockOutlined, MailOutlined, EditOutlined } from '@ant-design/icons';
import { Select } from "antd"
// form
import { useFormik } from "formik";
import FormFormik from '../../../../../components/formik/FormFormik';
import * as Yup from "yup";
// axios
import { fetchFrom } from '../../../../../services/axios';
// alert
import Swal from 'sweetalert2';
// language
import { useTranslation } from 'react-i18next';
// router
import { useOutletContext } from "react-router-dom";
// helper
import { mDate } from '../../../../../helper/setTime/setTime';
import { profileClickHandler } from '../../../../../helper/profile/profileHandler';
// redux
import { useSelector, useDispatch } from 'react-redux';
import { themeDetail } from '../../../../../redux/itemStore/theme';
import { authDetail, authChange } from '../../../../../redux/itemStore/auth';



function Info({ userInfo }) {
    const { lan } = useOutletContext();
    const { t } = useTranslation();

    const [selectedImageUrl, setSelectedImageUrl] = useState(null);
    const [selectedRol, setSelectedRol] = useState(userInfo.rol);

    const theme = useSelector(themeDetail)
    const auth = useSelector(authDetail)
    const dispatch = useDispatch()
    /////////////////////////////////////////////
    const handleChange = (value) => {
        setSelectedRol(value)
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////

    const validate = () => {
        if (auth.userInfo.rol === 'VIEWER' || (auth.userInfo.rol === 'ADMIN' && (userInfo.rol === 'ADMIN' || userInfo.rol === 'OWNER') && auth.userInfo.token !== userInfo.token)) {
            return true

        }
        return false
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////

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
            name: 'password',
            type: 'password',
            label: t("passwordLabelAuth"),
            placeholder: '',
            prefix: <LockOutlined />
        }

    ];

    validate() && arr.pop()

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


        password: Yup.string()
            .required(t("yupPasswordRequired"))
            .min(6, t("yupPasswordLength")),




    });


    const form = useFormik({
        initialValues: { name: userInfo.name, phone: userInfo.phone, email: userInfo.email, password: userInfo.password },

        onSubmit: async (values, { setSubmitting, resetForm }) => {

            const pureFormData = { ...values };

            selectedImageUrl && (pureFormData.image = selectedImageUrl);
            pureFormData.rol = selectedRol

            const sendData = { ...userInfo, ...pureFormData }




            const res = await fetchFrom({
                method: 'put',
                url: `/users/${userInfo.id}`,
                requestConfig: { ...sendData }
            });
            Swal.fire({
                title: `${res.error === 400 ? t("registerSwalTitleError") : res.error === 999 ? t("alertConnectToNet") : t("authSwalTitleSuccess")}`,
                icon: `${res.error ? 'error' : 'success'}`,
                confirmButtonText: t("okSwalBtn"),
                customClass: {
                    popup: theme ? 'darkSwal' : 'lightSwal',

                }
            })
                .then(() => {
                    if (res.error) {
                        setSubmitting(false);
                    } else {
                        if (auth.userInfo.token === res.data.token) {
                            dispatch(authChange(res.data))
                        }
                    }
                })
        },


        validationSchema: registerSchema,
    });
    ////////////////////////////////////////////////////////////////////////////////////////////////

    const ownerRol = [
        { value: "OWNER", label: t('pAdminTableRolOWNER'), disabled: true },
        { value: "ADMIN", label: t('pAdminTableRolADMIN') },
        { value: "VIEWER", label: t('pAdminTableRolVIEWER') },
        { value: "USER", label: t('pAdminTableRolUSER') }
    ];

    const adminRol = [
        { value: "VIEWER", label: t('pAdminTableRolVIEWER') },
        { value: "USER", label: t('pAdminTableRolUSER') }
    ];





    return (

        <form onSubmit={form.handleSubmit} className={styles.form}>
            <div className={styles.profile}>
                <img src={selectedImageUrl ? selectedImageUrl : userInfo.image} alt="profile" />
                <p className={styles.profileBtn} onClick={() => profileClickHandler(t, setSelectedImageUrl, theme)}>
                    <EditOutlined />
                </p>
            </div>

            <div className={styles.inputs}>

                <div className={styles.rol}>
                    <p>{t('pAdminUserJoin')} :</p>
                    <p className={styles.date}>
                        <span>{mDate(userInfo.time)[lan]}</span>
                    </p>
                </div>

                {
                    arr.map(item => {
                        return <FormFormik key={item.id} {...item} form={form} />;
                    })
                }

                <div className={styles.rol}>
                    <p>{t('pAdminUserChangeRol')}</p>
                    <Select
                        value={selectedRol}
                        style={{ width: '100%' }}
                        onChange={handleChange}
                        size={'large'}
                        disabled={(selectedRol === 'OWNER' || (auth.userInfo.rol === 'ADMIN' && selectedRol === 'ADMIN')) ? true : false}
                        options={auth.userInfo.rol === 'ADMIN' ? adminRol : ownerRol}
                    />
                </div>


            </div>

            <div className={styles.buttonWrapper}>
                <button
                    type="submit"
                    className={`${form.isSubmitting ? "btn-deActive" : ""} btn`}
                    disabled={validate() ? true : form.isSubmitting}
                >
                    {form.isSubmitting ? t("formLoadingBtn") : t("userPanelInfoUpdateBtn")}
                </button>


            </div>
        </form>

    )
}

export default Info