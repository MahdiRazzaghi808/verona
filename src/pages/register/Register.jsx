import React from 'react'
// router
import { Link, useNavigate } from 'react-router-dom'
// ant
import { UserOutlined, PhoneOutlined, LockOutlined } from '@ant-design/icons';
//form
import { useFormik } from "formik";
import FormFormik from '../../components/formik/FormFormik';
import * as Yup from "yup";
// axios
import { fetchFrom } from '../../services/axios';
// styles
import styled from 'styled-components'
import "../../style/register.css"
import "../../style/text.css"
// alert
import Swal from 'sweetalert2';
// redux
import { useDispatch } from "react-redux";
import { authLogin } from "../../redux/itemStore/auth"
import { getCartFromServer } from '../../redux/itemStore/cart';
// language
import { useTranslation } from 'react-i18next';
// helper
import { setTime } from '../../helper/setTime/setTime';

const Div = styled.div`
width: 100%;
height: 100%;
padding: 5rem 0;
background: url("https://s6.uupload.ir/files/edward-franklin-nb_q-m3cdzg-unsplash_jmbl.jpg");
background-size: cover;
background-repeat: no-repeat;
background-position: bottom center;
display: flex;
flex-direction: column;
align-items: center;
justify-content: center;
`


const Register = () => {
  // hooks
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useTranslation();




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
    },
    {
      id: 5,
      name: 'rules',
      type: 'checkBox',
      label: t("rulesLabelAuth"),
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
    rules: Yup.bool()
      .oneOf([true], t("yupRulesOneOf"))
  });

  const form = useFormik({
    initialValues: { name: '', phone: "", password: '', confirmPassword: '', rules: false },

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
          popup: 'darkSwal',
        }
      })
        .then(() => {
          if (res.error) {
            setSubmitting(false);
          } else {
            dispatch(authLogin(res.data))
            dispatch(getCartFromServer(res.data.token))


            resetForm();
            navigate('/userPanel/info');
          }
        })
    },

    validationSchema: registerSchema,
  });

  return (

    <Div>
      <div className="container">

        <Link to='/' className='loginLogo'>
          <p aria-label="CodePen">
            <span data-text="V">V</span>
            <span data-text="E">E</span>
            <span data-text="R">R</span>
            <span data-text="O">O</span>
            <span data-text="N">N</span>
            <span data-text="A">A</span>
          </p>

        </Link>

        <div className='formWrapper'>

          <div className='register__title'>
            {t("singUp")}
          </div>

          <form onSubmit={form.handleSubmit} className='form'>
            {
              arr.map(item => <FormFormik key={item.id} {...item} form={form} />)

            }

            <div className='buttonsWrapper'>

              <Link to='/singIn'>
                {t("singIn")}
              </Link>

              <button
                type="submit"
                className={`${form.isSubmitting ? "btn-deActive" : ""} btn`}
                disabled={form.isSubmitting}
              >
                {form.isSubmitting ? t("formLoadingBtn") : t("formRegisterBtn")}
              </button>

            </div>



          </form>
        </div>

      </div>
    </Div>
  )
}


export default Register