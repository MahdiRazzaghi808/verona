import React, { useState } from 'react'
// router
import { Link, useNavigate } from 'react-router-dom'
//style
import "../../style/register.css"
// ant
import { PhoneOutlined, LockOutlined } from '@ant-design/icons';
// redux
import { useDispatch } from "react-redux";
import { authLogin } from "../../redux/itemStore/auth"
import { getCartFromServer } from '../../redux/itemStore/cart';
// language
import { useTranslation } from 'react-i18next';
// alert
import Swal from 'sweetalert2';
// form
import { useFormik } from "formik";
import FormFormik from '../../components/formik/FormFormik';
import * as Yup from "yup";
// helper
import Captcha from '../../helper/captcha/Captcha';
// axios
import { fetchFrom } from '../../services/axios';



const SingIn = () => {
  // hooks
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // state
  const [captchaValue, setCaptchaValue] = useState()

  const { t } = useTranslation();


  const arr = [
    {
      id: 1,
      name: 'phone',
      type: 'text',
      label: t("phoneLabelAuth"),
      placeholder: '09112348576',
      prefix: <PhoneOutlined />
    },
    {
      id: 2,
      name: 'password',
      type: 'password',
      label: t("passwordLabelAuth"),
      placeholder: '',
      prefix: <LockOutlined />
    }
  ]






  const registerSchema = Yup.object().shape({
    phone: Yup.string()
      .matches(/^[0-9]{11}$/, t("yupPhoneMatch"))
      .required(t("yupPhoneRequired")),
    password: Yup.string()
      .min(6, t("yupPasswordLength"))
      .required(t("yupPasswordRequired")),

    captcha: Yup.string()
      .required(t("yupCaptchaRequired"))
      .matches(captchaValue, t("yupPasswordMatch"))
  });


  const form = useFormik({
    initialValues: { phone: "", password: '', captcha: "" },

    onSubmit: async (values, { setSubmitting, resetForm }) => {

      const res = await fetchFrom({
        method: 'get',
        url: `users?phone=${values.phone}`,
      })


      if (res.data.length > 0) {
        const user = res.data[0];
        const userFlag = user.password === values.password;

        if (userFlag && (user.rol === "VIEWER")) {
          Swal.fire({
            text: t("panelAlertAlarm"),
            icon: 'info',
            confirmButtonText: t("okSwalBtn"),
            customClass: {
              popup: 'darkSwal',
            }
          })
            .then(() => {
              if (userFlag) {
                dispatch(authLogin(res.data[0]))
                dispatch(getCartFromServer(res.data[0].token))
                resetForm();
                navigate('/');
              }
            })


        } else {
          Swal.fire({
            title: `${userFlag ? t("authSwalTitleSuccess") : t("loginSwalTitlePasswordWrong")}`,
            icon: `${userFlag ? 'success' : 'error'}`,
            confirmButtonText: t("okSwalBtn"),
            customClass: {
              popup: 'darkSwal',
            }
          })
            .then(() => {
              if (userFlag) {
                dispatch(authLogin(res.data[0]))
                dispatch(getCartFromServer(res.data[0].token))
                resetForm();
                navigate('/userPanel/info');

              } else {
                setSubmitting(false);
              }
            })
        }


      } else {
        Swal.fire({
          title: t("loginSwalTitleNoRegister"),
          icon: 'error',
          confirmButtonText: t("okSwalBtn"),
          customClass: {
            popup: 'darkSwal',
          }
        })
      }

      resetForm({ values: { ...values, captcha: '' } })

    },


    validationSchema: registerSchema,
  });




  return (

    <div className='wrapper'>
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
            {t("singIn")}
          </div>


          <form onSubmit={form.handleSubmit} className='form'>

            {
              arr.map(item => <FormFormik key={item.id} {...item} form={form} />)
            }

            <Captcha form={form} captchaValue={captchaValue} setCaptchaValue={setCaptchaValue} />



            <div className='buttonsWrapper'>

              <Link to='/singUp'>
                {t("singUp")}
              </Link>

              <button
                type="submit"
                className={`${form.isSubmitting ? "btn-deActive" : ""} btn`}
                disabled={form.isSubmitting}
              >
                {form.isSubmitting ? t("formLoadingBtn") : t("formLoginBtn")}
              </button>

            </div>

          </form>
        </div>

      </div>
    </div>
  )
}

export default SingIn