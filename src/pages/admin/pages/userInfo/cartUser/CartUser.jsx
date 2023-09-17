import React, { useEffect, useState } from 'react'
// styles
import styles from "./cartUser.module.css"
// language
import { useTranslation } from 'react-i18next';
// axios
import { fetchFrom } from '../../../../../services/axios';
// components
import ProducerTable from '../../../components/table/ProducerTable';
import TimeFilter from '../../../components/filter/TimeFilter';
// ant
import { Space, Input, Button, ConfigProvider } from "antd"
import { SearchOutlined, DeleteOutlined, PlusOutlined, MinusOutlined } from '@ant-design/icons';
// router
import { useOutletContext } from "react-router-dom";
// modal
import CartModal from './modal/CartModal';
// redux
import { useSelector } from 'react-redux';
import { themeDetail } from '../../../../../redux/itemStore/theme';
import { dollarDetail } from '../../../../../redux/itemStore/dollar';
import { authDetail } from '../../../../../redux/itemStore/auth';

// helper
import { cartSidebar, cartP } from "../../../../../helper/price/priceShow"
import i18n from "../../../../../i18n"
import { addToCart } from '../../../../../helper/sweetAlert/seetAlert';
import { sortProductsByCategory } from '../../../../../helper/filterFoods/filterFoods';


function CartUser({ token }) {
        const { lan } = useOutletContext();
        const theme = useSelector(themeDetail);
        const auth = useSelector(authDetail);


        const [showFilter, setShowFilter] = useState('all');
        const [isModalOpen, setIsModalOpen] = useState(false)
        const [modalData, setModalData] = useState([]);
        const [cart, setCart] = useState(null);

        const { t } = useTranslation();
        const dollar = useSelector(dollarDetail)


        ///////////////////////////////////////////////////////////////////////////////////////////////
        useEffect(() => {
            getData()

        }, [])
        const getData = async () => {
            // cart
            const res = await fetchFrom({ method: 'get', url: `/carts/user?token=${token}` })
            setCart(res.data)
            // foods
            const res2 = await fetchFrom({ method: 'get', url: `/foods` })
            const sortedProducts = sortProductsByCategory(res2.data);
            setModalData(sortedProducts.filter(v => !v.archive && v.exist));
        }

        const putHandler = async (id, num) => {
            if (auth.userInfo.rol === 'VIEWER') {
                addToCart(t('panelAlertAlarm2'), (i18n.language === 'fa' || i18n.language === 'ar') ? true : false, theme)
            } else {
                const res = await fetchFrom({ method: 'put', url: `carts/update?token=${token}&foodId=${id}&changeAmount=${num}` })
                !res.error && setCart(res.data)
            }
        }


        /////////////////////////////////////////////////////////////////////////////////////////////////
        const handleReset = (clearFilters) => {
            clearFilters();

        };

        const handleSearch = (selectedKeys, confirm, dataIndex) => {
            confirm();
        };

        const getColumnSearchProps = (dataIndex) => ({
            filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
                <div style={{ padding: 8 }}>
                    <Input
                        placeholder={`Search ${dataIndex}`}
                        value={selectedKeys[0]}
                        onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                        onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        style={{ marginBottom: 8, display: 'block' }}
                    />
                    <Space>
                        <Button
                            type="primary"
                            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                            icon={<SearchOutlined />}
                            size="small"
                            style={{ width: 90 }}
                        >
                            Search
                        </Button>
                        <Button
                            onClick={() => handleReset(clearFilters)}
                            size="small"
                            style={{ width: 90 }}
                        >
                            Reset
                        </Button>
                    </Space>
                </div>
            ),
            filterIcon: (filtered) => (
                <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
            ),
            onFilter: (value, record) =>

                record[dataIndex][lan]
                    .toString()
                    .toLowerCase()
                    .includes(value.toLowerCase()),
        })

        //////////////////////////////////////////////////////////////////////////////////////////

        const columns = [

            {
                title: t('pAdminTableFoodImage'),
                dataIndex: "image",
                key: "image",

                render: (_, { image }) => (
                    <div className='profile'>
                        <img src={image} alt="profile" />
                    </div>
                )

            },
            {
                title: t('pAdminTableName'), dataIndex: "name", key: "name",
                ...getColumnSearchProps('name'),

                render: (v) => (
                    <div>
                        <span>{v[lan]}</span>
                    </div>

                )
            },
            {
                title: t('pAdminTableAction'),
                dataIndex: "count",
                key: "count",
                render: (count, data) =>
                    <div className='buttonWrapper'>
                        <div className={styles.countWrapper}>
                            {+count === 1 || !data.exist ? <DeleteOutlined onClick={() => putHandler(data.foodId, -1)} /> : <MinusOutlined onClick={() => putHandler(data.foodId, -1)} />}
                            <p>{count}</p>
                            <PlusOutlined onClick={() => putHandler(data.foodId, +1)} />
                        </div>

                    </div>
            },
            {
                title: t("pAdminTableBasePrice"),
                dataIndex: "price",
                key: "price",
                render: (price, data) =>
                    <div className='buttonWrapper'>
                        <span>{cartSidebar(dollar, price, lan)}</span>

                    </div>
            },

            {
                title: t('pAdminTableDiscount'),
                dataIndex: "offer",
                key: "offer",
                render: (offer, data) =>
                    <div className='buttonWrapper'>
                        <span>{offer ? offer : 0}%</span>

                    </div>
            },

            {
                title: t('pAdminTableTotalPrice'),
                dataIndex: "price",
                key: "price",
                render: (price, data) =>
                    <div className='buttonWrapper'>
                        <span>{cartP(dollar, data.count, price, lan, data.offer)}</span>

                    </div>
            },


        ]

        ////////////////////////////////////////////////////////////////////////////////////////////
        const darkTheme = {
            colorBgBase: "#232a3b",
            colorTextBase: "#fff"
        }



        return (

            <div className='pAdminWrapper' >
                <div className={styles.cartBoxWrapper}>
                    <div className={styles.header}>
                        <TimeFilter showFilter={showFilter} setShowFilter={setShowFilter} type={'foods'} />

                        <div className={styles.secondHeader}>
                            <p>{t('pAdminTableTotalPrice')} :  {(cart && cart.cart.length) ? cartSidebar(dollar, cart.summary.final, lan) : cartSidebar(dollar, 0, lan)}</p>
                            <button className='btn' onClick={() => setIsModalOpen(true)}>{t('pAdminFoodsBtnNew')}</button>
                        </div>

                    </div>

                    {
                        (cart && cart.cart.length) ?



                            <ProducerTable col={columns} data={cart.cart.filter(v => {
                                if (showFilter === 'all') {
                                    return v
                                } else if (v.category.en === showFilter) {
                                    return v
                                }
                            })}
                                width={30}


                            />

                            :

                            <ProducerTable col={columns} />

                    }


                </div>

                <ConfigProvider
                    theme={{
                        token: theme ? darkTheme : {}
                    }}

                >

                    {isModalOpen ? <CartModal token={token} open={{ isModalOpen, setIsModalOpen }} data={{ modalData, setModalData }} cartData={{ cart: cart.cart, setCart }} /> : ''}
                </ConfigProvider>

            </div>
        )
    }

export default CartUser