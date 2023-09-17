import React from 'react'
// ant
import { GithubOutlined, TwitterOutlined, LinkedinOutlined, InstagramOutlined, EnvironmentOutlined, PhoneOutlined, MailOutlined } from '@ant-design/icons'
// language
import { useTranslation } from 'react-i18next';

function Footer() {
    const { t } = useTranslation();

    return (

        <footer className="footer">
            <div className="container">
                <div className="footer__wrapper flex-column-center">

                    <div className="footer__first-row flex-column-center">

                        <div className="footer__call flex-column-center">
                            <h4>{t("contactUs")}</h4>
                            <div className="footer__contact flex-column-center">
                                <a href="http://maps.google.com/?q=1200 Pennsylvania Ave SE, Washington, District of Columbia, 20003">
                                    <EnvironmentOutlined />
                                    <span>{t("location")}</span>
                                </a>

                                <a href="tel:098920801032">
                                    <PhoneOutlined />
                                    <span>{t("call")}</span>
                                </a>
                                <a href="mailto:mahdi_razzaghi@yahoo.com">
                                    <MailOutlined />
                                    <span>mahdi_razzaghi@yahoo.com</span>
                                </a>
                            </div>
                        </div>

                        <div className="footer__social flex-column-center">
                            <h4>{t("footerSocialTitle")}</h4>
                            <p>{t("footerSocialBody")}</p>
                            <div className="footer__social-main">
                                <a href="https://github.com/MahdiRazzaghi808">
                                    <GithubOutlined />
                                </a>
                                <a href="#">
                                    <TwitterOutlined />
                                </a>
                                <a href="https://www.linkedin.com/in/mahdi-razzaghi-961965244">
                                    <LinkedinOutlined />
                                </a>
                                <a href="https://instagram.com/mahdi_razzaghi0101?igshid=YmMyMTA2M2Y=">
                                    <InstagramOutlined />
                                </a>
                            </div>
                        </div>

                        <div className="footer__open flex-column-center">

                            <h4>
                                {t("footerOpenTitle")}
                            </h4>
                            <p>
                                {t("footerOpenDay")}
                            </p>
                            <p>
                                {t("footerOpenHour")}
                            </p>

                        </div>
                    </div>
                    <div className="flex-column-center">
                        <p>{t("footerEndLabel")}</p>
                    </div>

                </div>
            </div>
        </footer>
    )
}

export default Footer