import React, { useState, useEffect } from 'react'
// axios
import { fetchFrom } from '../../services/axios';
// component
import OfferFood from './OfferFood';

function OfferFoods() {

    const [offerFoods, setOfferFoods] = useState([]);


    useEffect(() => {
        getData()
    }, []);



    const getData = async () => {
        const res = await fetchFrom({ method: 'get', url: `/foods?off=true` })
        setOfferFoods(res.data)
    }


    return (
        <div className={`off__wrapper ${!offerFoods.length ? 'off__wrapper--no' : ''}`}>
            {
                offerFoods.length ?
                    <>

                        {offerFoods.map(item => <OfferFood key={item.id} {...item} />)}

                    </>
                    :
                    ''


            }
        </div>
    )
}

export default OfferFoods