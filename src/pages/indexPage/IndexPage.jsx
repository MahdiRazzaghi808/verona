import React from 'react'
// styles
import "../../style/template.css"
//components
import Navbar from '../../components/navbar/Navbar'
import Products from '../../components/products/Products'
import HeaderSwiper from '../../components/swiper/HeaderSwiper'
import CommentsSwiper from '../../components/swiper/CommentsSwiper'
import Footer from '../../components/footer/Footer'
import OfferFoods from '../../components/offerFoods/OfferFoods'
//image
import about from "../../assets/image/about-img.png"
// language
import { useTranslation } from 'react-i18next';



function IndexPage() {
    const { t } = useTranslation();


    return (
        <>
            <Navbar />

            <div className="header">
                <div className="container">
                    <HeaderSwiper />
                </div>
            </div>

            <section className="off">
                <div className="container">
                    <OfferFoods />
                </div>
            </section>


            <Products />

            <section className="about">
                <div className="container">
                    <div className="about__wrapper">

                        <div className="about__content">
                            <h2>{t("aboutTitle")}</h2>
                            <p>{t("aboutBody")}</p>
                        </div>

                        <div className="about__image">
                            <img src={about} alt="about us" />
                        </div>


                    </div>
                </div>
            </section>

            <section className="client">
                <div className="container">
                    <div className="client__wrapper">
                        <h2>{t("commentsTitle")}</h2>
                        <CommentsSwiper />
                    </div>
                </div>
            </section>


            <Footer />

        </>
    )
}

export default IndexPage