import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux';
import { authDetail } from '../../redux/itemStore/auth';
export default function PAdminPrivate({ children }) {
  const auth = useSelector(authDetail);

  const navigate = useNavigate()

  useEffect(() => {

    !auth.panel && !auth.isLogin && navigate('/singIn')

    auth.isLogin && auth.pAdmin && (auth.userInfo.rol !== 'OWNER' || auth.userInfo.rol !== 'ADMIN' || auth.userInfo.rol !== 'VIEWER') && navigate('/singIn')

  }, [auth.panel, auth.pAdmin, auth.isLogin])


  return (
    <>
      {
        (auth.userInfo.rol === 'OWNER' || auth.userInfo.rol === 'ADMIN' || auth.userInfo.rol === 'VIEWER') && <>{children}</>
      }
    </>
  )
}
