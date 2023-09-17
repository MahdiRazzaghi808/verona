import React, { useRef, useState } from 'react';
// swiper
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
// style
import 'swiper/css';
import 'swiper/css/pagination';
import './styles.css';
// language
import { useTranslation } from 'react-i18next';
import i18n from '../../i18n';

function HeaderSwiper() {
    const { t } = useTranslation()

    return (
        <>
            <Swiper
                dir='ltr'
                slidesPerView={1}
                spaceBetween={1200}
                rewind={true}
                pagination={{
                    clickable: true,
                }}
                autoplay={{
                    delay: 2500,
                    disableOnInteraction: false,
                }}
                modules={[Autoplay, Pagination]}
                className="mySwiper"
            >



                <SwiperSlide className={`${(i18n.language === 'fa' || i18n.language === 'ar') ? 'dirRight' : null} header__content`}  >
                    <h1>{t("headerTitle")}</h1>
                    <p>{t("headerBody")}</p>
                </SwiperSlide>

                <SwiperSlide className={`${(i18n.language === 'fa' || i18n.language === 'ar') ? 'dirRight' : null} header__content`}>
                    <h1>{t("headerTitle")}</h1>
                    <p>{t("headerBody")}</p>
                </SwiperSlide>

                <SwiperSlide className={`${(i18n.language === 'fa' || i18n.language === 'ar') ? 'dirRight' : null} header__content`}>
                    <h1>{t("headerTitle")}</h1>
                    <p>{t("headerBody")}</p>
                </SwiperSlide>


            </Swiper>

        </>
    )
}

export default HeaderSwiper