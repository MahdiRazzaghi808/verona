import React from 'react'
// style
import styles from "./dashboard.module.css"
// ant
import { ConfigProvider } from 'antd'
// components
import ShowInformation from './Show-information/ShowInformation'
import Step from './step/Step'
import CalendarD from './calendar/CalendarD'
import LineChart from './charts/lineChart/LineChart'
// redux
import { useSelector } from 'react-redux';
import { themeDetail } from '../../../../redux/itemStore/theme';
// language
import { useTranslation } from 'react-i18next';

function Dashboard() {
  const { t } = useTranslation()
  const theme = useSelector(themeDetail);





  const darkTheme = {
    colorBgBase: "#232a3b",
    colorTextBase: "#fff"
  }
  return (

    <ConfigProvider
      theme={{
        token: theme ? darkTheme : {}
      }}

    >

      <div className={styles.wrapper}>

        <h3>{t("dashboardTitle")}</h3>

        <ShowInformation />

        <div className={styles.step}>
          <h4>{t("dashboardTimeLineTitle")}</h4>
          <Step />

        </div>



        <div className={styles.date}>
          <h4>{t("dashboardDateTitle")}</h4>
          <div>
            <CalendarD />
          </div>
        </div>


        <div className={styles.lineChart}>
          <h4>{t("dashboardChartTitle")}</h4>
          <div>
            <LineChart />
          </div>

        </div>





      </div>
    </ConfigProvider>
  )
}

export default Dashboard