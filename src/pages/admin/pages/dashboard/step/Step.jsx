import React from 'react'
import { Steps } from "antd"
import { useTranslation } from 'react-i18next';



function Step() {
    const { t } = useTranslation()


    

    return (
        <Steps
            current={1}
            items={[
                {
                    title: t("timeLineTitleFinish"),
                    description:t("timeLineDescription1")
                },
                {
                    title: t("timeLineTitleProgress"),
                    description:t("timeLineDescription2")
                },
                {
                    title: t("timeLineTitleWaiting"),
                    description:t("timeLineDescription3")
                },
                {
                    title: t("timeLineTitleWaiting"),
                    description:t("timeLineDescription4")
                }
            ]}
        />
    )
}

export default Step