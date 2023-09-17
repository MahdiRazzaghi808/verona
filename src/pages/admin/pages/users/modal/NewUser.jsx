import React from "react"
// ant
import { Modal } from "antd"
import { UserOutlined, PhoneOutlined, LockOutlined } from '@ant-design/icons';
// from
import { useFormik } from "formik";
import FormFormik from '../../../../../components/formik/FormFormik';
import * as Yup from "yup";
// axios
import { fetchFrom } from '../../../../../services/axios';
// alert
import Swal from 'sweetalert2';
// redux
import { useDispatch, useSelector } from "react-redux";
import { postUser } from "../../../../../redux/itemStore/users";
import { themeDetail } from "../../../../../redux/itemStore/theme";
import { authDetail } from "../../../../../redux/itemStore/auth";
// language
import { useTranslation } from 'react-i18next';
// helper
import { setTime } from '../../../../../helper/setTime/setTime';




const ModalFood = ({ open }) => {
    const { isModalOpen, setIsModalOpen } = open;

    const { t } = useTranslation();
    const dispatch = useDispatch()

    const theme = useSelector(themeDetail);
    const auth = useSelector(authDetail);
    //////////////////////////////////////////////////////////////////////////////////////
    const handleOk = () => {
        setIsModalOpen(false);
    }

    const handleCancel = () => {
        setIsModalOpen(false)
    }
    /////////////////////////////////////////////////////////////////////////////////////////////////


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
            name: 'password',
            type: 'password',
            label: t("passwordLabelAuth"),
            placeholder: '',
            prefix: <LockOutlined />
        },
        {
            id: 4,
            name: 'confirmPassword',
            type: 'password',
            label: t("confirmPasswordLabelAuth"),
            placeholder: '',
            prefix: <LockOutlined />
        }
    ]

    const registerSchema = Yup.object().shape({
        name: Yup.string()
            .min(3, t("yupNameMinLength"))
            .max(20, t("yupNameMaxLength"))
            .required(t("yupNameRequired")),
        phone: Yup.string()
            .matches(/^[0-9]{11}$/, t("yupPhoneMatch"))
            .required(t("yupPhoneRequired")),
        password: Yup.string()
            .min(6, t("yupPasswordLength"))
            .required(t("yupPasswordRequired")),
        confirmPassword: Yup.string()
            .required(t("yupConfirmPasswordRequired"))
            .oneOf([Yup.ref('password'), null], t("yupConfirmPasswordOneOf")),

    });


    const form = useFormik({
        initialValues: { name: '', phone: "", password: '', confirmPassword: '' },

        onSubmit: async (values, { setSubmitting, resetForm }) => {

            const sendData = { ...values }
            /////////////////////////////////
            sendData.email = '';
            sendData.image = 'https://www.uplooder.net/img/image/14/648c07473ae117cb82f09b04241b7a34/h10.png';
            sendData.rol = 'USER';
            sendData.commentsCount = 0;
            sendData.totalBuy = 0;
            sendData.time = setTime();
            ////////////////////////////////
            delete sendData.confirmPassword
            delete sendData.rules
            ///////////////////////////////
            const res = await fetchFrom({
                method: 'post',
                url: `/users`,
                requestConfig: { ...sendData }
            })

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
                        console.log(res.data);
                        dispatch(postUser(res.data))
                        resetForm();
                        setIsModalOpen(false)

                    }
                })

        },


        validationSchema: registerSchema,
    });
    /////////////////////////////////////////////////////////////////////////////////////////////////
    return (
        <>
            <Modal
                title=""
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                footer={[]}
            >

                <div className=''>

                    <div className='newUserAlert'>
                        {t("singUp")}
                    </div>

                    <form onSubmit={form.handleSubmit} className='form'>
                        {
                            arr.map(item => <FormFormik key={item.id} {...item} form={form} />)

                        }

                        <div className='buttonsWrapper'>
                            <button
                                type="submit"
                                className={`${form.isSubmitting ? "btn-deActive" : ""} btn`}
                                disabled={auth.userInfo.rol === 'VIEWER' ? true : form.isSubmitting}
                            >
                                {form.isSubmitting ? t("formLoadingBtn") : t("formRegisterBtn")}
                            </button>

                        </div>

                    </form>

                </div>

            </Modal>
        </>
    )
}

export default ModalFood
