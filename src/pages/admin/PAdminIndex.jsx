import React, { useState } from 'react'
// style
import styles from "./pAdminIndex.module.css"
// components
import Sidebar from "./components/sidebar/Sidebar"
import Header from "./components/header/Header"
// router
import { Outlet } from 'react-router-dom'
// ant
import { ConfigProvider } from "antd"
// language
import i18n from '../../i18n'




function PAdminIndex() {
  const [lan, seLan] = useState(i18n.language)


  return (

    <ConfigProvider

      direction={(lan === "fa" || lan === 'ar') ? "rtl" : "ltr"}
    >
      <div className={`${styles.pAdmin} PAdmin`}>
        <div className={styles.container}>
          <div className={styles.wrapper}>
            {/* sidebar */}
            <div className={styles.sidebar}>
              <Sidebar />
            </div>
            {/* main site  */}
            <div className={styles.main}>
              <Header setLan={seLan} />
              <Outlet context={{ lan }} />
              {/* <DarkMoodBtn />  */}

            </div>
          </div>
        </div>



      </div>
    </ConfigProvider>
  )
}

export default PAdminIndex