import React, { useEffect, useState } from 'react';
// swiper
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper/modules';
// style
import './styles.css';
import 'swiper/css';
import 'swiper/css/navigation';
// axios
import { fetchFrom } from '../../services/axios';
// language
import i18n from '../../i18n';



function CommentsSwiper() {

    const [comments, setComments] = useState([])

    useEffect(() => {
        getData()
    }, []);


    const getData = async () => {
        const res = await fetchFrom({ method: 'get', url: `/comments?show=true` })
        setComments(res.data)
    }


    return (
        <>
            <Swiper
                slidesPerView={1}
                breakpoints={{
                    992: {
                        slidesPerView: 2,
                    },

                }}
                spaceBetween={30}
                loop={true}
                autoplay={{
                    delay: 2500,
                    disableOnInteraction: false,
                }}
                navigation={true}
                modules={[Autoplay, Navigation]}

                className="ourComments"
            >




                {
                    comments.filter(v => v.language === i18n.language).map(comment =>

                        <SwiperSlide key={comment.id} className="client__person">
                            <div className="client__person__detail">
                                <p className='pre1'>
                                    {comment.body}
                                </p>
                                <h6>{comment.name}</h6>
                            </div>
                            <div className="client__image">
                                <img src={comment.image} alt="userImage" />
                            </div>
                        </SwiperSlide>
                    )}


            </Swiper>

        </>
    )
}

export default CommentsSwiper