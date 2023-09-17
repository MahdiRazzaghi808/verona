import React, { useMemo, useState } from 'react'
// style
import styles from './header.module.css'
// image
import avatar from "../../../../assets/image/register/bg.jpg"
// icons
import { BsSunFill } from 'react-icons/bs';
import { BsFillMoonFill } from 'react-icons/bs';
// ant
import { Select, Switch, ConfigProvider, Tooltip } from 'antd';
// redux
import { useDispatch, useSelector } from 'react-redux';
import { themeDetail, themePanel } from '../../../../redux/itemStore/theme';
import { authDetail } from "../../../../redux/itemStore/auth"
// language
import i18n from '../../../../i18n';
import { useTranslation } from 'react-i18next';
// router
import { useLocation } from 'react-router-dom';


function Header({ setLan }) {
  const dispatch = useDispatch();
  const auth = useSelector(authDetail);
  const theme = useSelector(themeDetail);
  const [arrow, setArrow] = useState("Show")
  const { t } = useTranslation()


  const location = useLocation();
  const pathName = location.pathname;
  const parts = pathName.split('/');
  parts.shift();
  parts.shift();

  theme ? document.documentElement.classList.add("dark-mood") : document.documentElement.classList.remove("dark-mood")




  const themeHandler = (e) => {
    dispatch(themePanel(e))
    e ? document.documentElement.classList.add("dark-mood") : document.documentElement.classList.remove("dark-mood")
  }


  const handleChange = (value) => {

    localStorage.setItem("language", value)
    i18n.changeLanguage(value);
    setLan(value);
    (i18n.language === "fa" || i18n.language === 'ar') ? document.documentElement.dir = "rtl" : document.documentElement.dir = "ltr"
  };


  const mergedArrow = useMemo(() => {
    if (arrow === "Hide") {
      return false
    }

    if (arrow === "Show") {
      return true
    }

    return {
      pointAtCenter: true
    }
  }, [arrow])



  const darkTheme = {
    colorBgBase: "#232a3b",
    colorTextBase: "#fff",
    colorBorder: "#fff",
    colorPrimaryBg: "#313a55",
  }

  return (

    <ConfigProvider
      theme={{
        token: theme ? darkTheme : {}
      }}
      direction={i18n.language === 'fa' ? "rtl" : "ltr"}
    >
      <div className={styles.header}>

        <div className={styles.headerRight}>
          <p>{t('pAdminHeaderTitle')} /
            <span> {t(`${parts[0]}PAdmin`)} </span>
          </p>
        </div>


        <div className={styles.headerLeft}>

          <div className={styles.icons}>


            <Switch className={styles.checkBox} onChange={themeHandler} checked={theme} checkedChildren={<BsFillMoonFill className={styles.moon} />} unCheckedChildren={<BsSunFill className={styles.sun} />} defaultChecked />


            <Select
              defaultValue={`${localStorage.getItem("language")}`}
              style={{ width: 80 }}
              onChange={handleChange}
              options={[
                { value: 'en', label: 'En' },
                { value: 'fa', label: 'Fa' },
                { value: 'it', label: 'It' },
                { value: 'ar', label: 'Ar' },
                { value: 'zh', label: 'Zh' },
              ]}
            />


          </div>

          <div className={styles.avatar}>
            <Tooltip placement="bottom" title={auth.isLogin ? auth.userInfo.name : ''} arrow={mergedArrow} color={'#e69c00'}>
              <img src={auth.isLogin ? auth.userInfo.image : avatar} alt="avatar" />
            </Tooltip>
          </div>

        </div>

      </div>

      <div className={styles.line}></div>
    </ConfigProvider>
  )
}

export default Header