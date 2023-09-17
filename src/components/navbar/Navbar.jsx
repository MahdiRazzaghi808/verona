import React, { useState, useEffect } from 'react';
// style
import '../../style/template.css'
import styled from 'styled-components'
// router
import { useLocation, NavLink, useNavigate } from 'react-router-dom';
// redux
import { useSelector } from 'react-redux';
import { authDetail } from '../../redux/itemStore/auth';
// ant
import { UserOutlined } from '@ant-design/icons'
import { Select } from 'antd';
// language
import { useTranslation } from 'react-i18next';
import i18n from "../../i18n";
// helper
import { swalAlert } from "../../helper/sweetAlert/seetAlert"


const Div = styled.div`
cursor: pointer;
display:none;
z-index:999;
    div{
    width: 32px;
    height: 0.2rem;
    background-color: #fff;
    border-radius: 0.5rem;
    transform-origin:5px;
    transition: all 0.2s linear;

    &:nth-child(1) {
        transform:${(props) => props.open ? "rotate(45deg)" : "rotate(0)"};
               
        }

    &:nth-child(2) {
        margin: 0.25rem 0;
        transform:${(props) => props.open ? "translateX(-100%)" : "translateX(0)"};
        opacity:${(props) => props.open ? 0 : 1}
        }


    &:nth-child(3) {
        transform:${(props) => props.open ? "rotate(-45deg)" : "rotate(0)"};
              
        }
    }

    

    @media (max-width: 992px){
        display:flex;
        flex-direction: column;
    }

`

function Navbar() {
    const { t } = useTranslation();
    const navigate = useNavigate()

    const [open, setOpen] = useState(false);
    const auth = useSelector(authDetail);

    const clickHandler = () => {
        setOpen(!open)
    }



    const location = useLocation();
    const pathName = location.pathname;
    const parts = pathName.split('/');
    parts.shift();



    const handleChange = (value) => {
        localStorage.setItem("language", value)
        i18n.changeLanguage(value);
        (i18n.language === "fa" || i18n.language === "ar") ? document.documentElement.dir = "rtl" : document.documentElement.dir = "ltr"

    };

    const pAdminHandler = () => {
        if ((auth.userInfo.rol === 'OWNER' || auth.userInfo.rol === 'ADMIN' || auth.userInfo.rol === 'VIEWER')) {
            navigate('/pAdmin')
        } else {
            swalAlert('warning', '', t('panelAdminLoginAlertText'), t("foodSwalLoginBtn"), t("foodSwalCloseBtn"), true, async (result) => {
                if (result.isConfirmed) {
                    navigate('/singIn')
                }
            }
            )

        }

    }


    
    const handleScroll = () => {
        const scrollTop = window.scrollY;

        const navbar = document.querySelector('.navbarWrapper1');
        const header = document.querySelector('.header');


        if (navbar && header) {
            const navbarRect = navbar.getBoundingClientRect();
            const headerRect = header.getBoundingClientRect();


            if (scrollTop > 5 && navbarRect.top < headerRect.bottom) {
                navbar.classList.remove('navbar-sticky1');
                navbar.classList.add('navbar-sticky');
            } else if (scrollTop > navbarRect.top >= headerRect.bottom) {
                navbar.classList.remove('navbar-sticky');
                navbar.classList.add('navbar-sticky1');
            } else {
                navbar.classList.remove('navbar-sticky');
                navbar.classList.remove('navbar-sticky1');
            }
        }
    };




    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        }
    }, []);


    return (
        <div className={parts[0] ? 'navbarWrapper' : 'navbarWrapper1'}>
            <div className="container">
                <div className="navbar">
                    <div className="logo">
                        <NavLink to='/'>{t("logo")}</NavLink>
                    </div>

                    <div className={`nav ${open ? 'nav--active' : ''}`}>


                        <div className='close-flag'></div>


                        <ul className="nav__menu">
                            <li><NavLink className={({ isActive }) => isActive ? "active" : ""} to='/'>{t("home")}</NavLink></li>
                            <li><NavLink className={({ isActive }) => isActive ? "active" : ""} to="/menus">{t("menu")}</NavLink></li>
                            <li><NavLink className={({ isActive }) => isActive ? "active" : ""} to="/cart">{t("cart")}</NavLink></li>
                            <li>
                                <a onClick={pAdminHandler} className='tooltip foodBtn'>
                                    {t("adminPanel")} <span className="tooltiptext">{t("trial")}</span>
                                </a>
                            </li>
                        </ul>

                        <div className="nav__link">
                            {
                                auth.isLogin ?
                                    <NavLink to='/userPanel/info' className="btn nav-btn">
                                        <UserOutlined />
                                        <span>{auth.userInfo.name}</span>

                                    </NavLink>

                                    :
                                    <NavLink to='/singIn' className="btn">{t("navRegisterBtn")}</NavLink>
                            }



                            <Select
                            className='languageSelect'
                                defaultValue={`${localStorage.getItem("language")}`}
                                style={{ width: 80 }}
                                onChange={handleChange}
                                options={[
                                    { value: 'en', label: 'En' },
                                    { value: 'fa', label: 'Fa' },
                                    { value: 'it', label: 'It' },
                                    { value: 'ar', label: 'Ar' },
                                    { value: 'zh', label: 'Zh' },
                                ]}
                            />


                        </div>




                    </div>





                    <Div open={open} onClick={clickHandler} className="close-btnRtl">
                        <div></div>
                        <div></div>
                        <div></div>
                    </Div>



                </div>
            </div>
        </div>
    )
}

export default Navbar