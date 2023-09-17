import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { authDetail } from '../../redux/itemStore/auth'


function PUserPrivate({ children }) {
    const auth = useSelector(authDetail);
    const navigate = useNavigate()

    useEffect(() => {

        !auth.panel && !auth.isLogin && navigate('/singIn')

    }, [auth.panel])


    return (
        <>
            {
                auth.isLogin && <>{children}</>

            }
        </>
    )
}

export default PUserPrivate



