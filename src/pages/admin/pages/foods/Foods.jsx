import React, { useEffect, useState } from 'react'
// router
import { useOutletContext } from "react-router-dom";
// components
import Tab from '../../components/tab/Tab';
// redux
import { useDispatch, useSelector } from 'react-redux';
import { foodsDetail, getFoodsFromServer, putFoodsFromServer } from '../../../../redux/itemStore/foods';
import { themeDetail } from '../../../../redux/itemStore/theme';
import { dollarDetail } from '../../../../redux/itemStore/dollar';
// react icons
import { HiOutlineMinus } from 'react-icons/hi';
import { TbSettings } from 'react-icons/tb';
import { BiSolidFoodMenu } from 'react-icons/bi';
// ant
import { Space, Input, Button, ConfigProvider } from "antd"
import { SearchOutlined } from '@ant-design/icons';
// modal
import ModalFood from './modalFood/ModalFood';
import ModalMenu from "./modalFood/ModalMenu"
// helper
import { cartSidebar, foodsP } from "../../../../helper/price/priceShow"
import { addToCart } from '../../../../helper/sweetAlert/seetAlert';
// language
import { useTranslation } from 'react-i18next';
import i18n from '../../../../i18n';
import { authDetail } from '../../../../redux/itemStore/auth';

function Foods() {
  const { lan } = useOutletContext();
  const dispatch = useDispatch();
  // state
  const [showFilter, setShowFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalData, setModalData] = useState([]);
  //////
  const [isModalOpenMenu, setIsModalOpenMenu] = useState(false)
  const [modalDataMenu, setModalDataMenu] = useState([]);
  //////
  const foods = useSelector(foodsDetail);
  const theme = useSelector(themeDetail);
  const auth = useSelector(authDetail);
  /////////// 
  const dollar = useSelector(dollarDetail)
  const { t } = useTranslation()

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////

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

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////


  const settingHandler = (data) => {
    setModalData({ data, type: 'update' });
    setIsModalOpen(true);
  }


  const newFoodHandler = (data) => {
    const initialValue = {
      name: {
        en: '',
        fa: '',
        it: ''
      },
      image: 'https://www.uplooder.net/img/image/30/a458812000281b95f16eb1e5fa3792c6/order-food-svgrepo-com.svg',
      category: {
        en: "hamburger",
        fa: "همبرگر",
        it: "Hamburger"
      },
      price: '0',
      dic: {
        en: '',
        fa: '',
        it: ''
      },
      exist: true,
      hot: false,
      off: false,
      archive: false,
      offer: ''
    }

    setModalData({ data: initialValue, type: 'new' });
    setIsModalOpen(true);
  }




  useEffect(() => {
    dispatch(getFoodsFromServer())

  }, [])


  ////////////////////////////////////////////////////////////////////////////////////////////
  const availableHandler = (data) => {
    if (auth.userInfo.rol === 'VIEWER') {
      addToCart(t('panelAlertAlarm2'), (i18n.language === 'fa' || i18n.language === 'ar') ? true : false, theme)
    } else {
      const sendData = { ...data, exist: !data.exist }
      dispatch(putFoodsFromServer(sendData));
      sendData.exist ? addToCart(t('pAdminFoodsAlertExisting'), (lan === 'fa' || lan === 'ar') ? true : false, theme) : addToCart(t('pAdminFoodsAlertUnavailable'), (lan === 'fa' || lan === 'ar') ? true : false, theme)
    }
  }

  const menuHandler = (data) => {
    setIsModalOpenMenu(true)
    setModalDataMenu(data)
  }


  ////////////////////////////////////////////////////////////////////////////////////////////

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
      title: t('pAdminTableBasePrice'), dataIndex: "price", key: "price",
      render: (v) => (
        <div>
          <span>{cartSidebar(dollar, v, lan)}</span>
        </div>
      )
    },

    {
      title: t('pAdminTableDiscount'),
      dataIndex: "offer",
      key: "offer",
      render: (offer) =>
        <div>
          <span className={`${offer ? 'offerActive' : 'offerFalse'}`}>{offer ? `${offer}%` : <HiOutlineMinus />}</span>
        </div>
    },


    {
      title: "Price", dataIndex: "price", key: "price",
      sorter: (a, b) => (a.price * (100 - a.offer) / 100) - (b.price * (100 - b.offer) / 100),

      render: (v, data) => (
        <div>
          <span>{foodsP(dollar, v, lan, data.offer)}</span>
        </div>
      )
    },


    {
      title: t('pAdminTableMenuType'), dataIndex: "", key: "z",
      render: (_, data) => (

        <span>{data.hot ? t('pAdminTableMenuTypeHot') : data.off ? t('pAdminTableMenuTypeSpecialOffer') : t('pAdminTableMenuTypeNormal')}</span>
      )
    },









    {
      title: t('pAdminTableStatus'), dataIndex: "exist", key: "exist",
      render: (exist, data) => (
        <div className='buttonWrapper'>
          <button className={`pBtn ${exist ? 'pBtn-active ' : 'btn-cancel'}`}
            onClick={() => availableHandler(data)}

          >{exist ? t('pAdminTableAvailableBtn') : t('pAdminTableUnavailableBtn')}</button>
        </div>

      )
    },

    {
      title: t('pAdminTableAddToMenu'), dataIndex: "", key: "",
      render: (_, data) => (
        <div className='buttonWrapper foodBtn'>
          <BiSolidFoodMenu onClick={() => menuHandler(data)} />
        </div>

      )
    },

    {
      title: t('pAdminTableTotalSetting'),
      dataIndex: "",
      key: "y",
      render: (done, data) =>
        <div className='foodInfo'>
          <TbSettings onClick={() => settingHandler(data)} />
        </div>
    },

  ]

  const columns1 = [
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
      title: t('pAdminTableBasePrice'), dataIndex: "price", key: "price",
      render: (v) => (
        <div>
          <span>{cartSidebar(dollar, v, lan)}</span>
        </div>
      )
    },



    {
      title: t('pAdminTableDiscount'),
      dataIndex: "offer",
      key: "offer",
      render: (offer) =>
        <div>
          <span className={`${offer ? 'offerActive' : 'offerFalse'}`}>{offer ? `${offer}%` : <HiOutlineMinus />}</span>
        </div>
    },

    {
      title: t('pAdminTablePrice'), dataIndex: "price", key: "price",
      sorter: (a, b) => (a.price * (100 - a.offer) / 100) - (b.price * (100 - b.offer) / 100),

      render: (v, data) => (
        <div>
          <span>{foodsP(dollar, v, lan, data.offer)}</span>
        </div>
      )
    },



    {
      title: t('pAdminTableTotalSetting'),
      dataIndex: "",
      key: "y",
      render: (done, data) =>
        <div className='foodInfo'>
          <TbSettings onClick={() => settingHandler(data)} />
        </div>
    },

  ]


  const arr = [
    {
      title: t('pAdminFoodsMenuAll'),
      value: {
        col: columns,
        data: foods.filter(v => {
          if (!v.archive) {
            if (showFilter === 'all') {
              return v
            } else if (v.category.en === showFilter) {
              return v
            }
          }

        }),
        width: 65
      },

    },
    {
      title: t('pAdminFoodsMenuAvailable'),
      value: {
        col: columns,
        data: foods.filter(v => {
          if (v.exist && !v.archive) {
            if (showFilter === 'all') {
              return v
            } else if (v.category.en === showFilter) {
              return v
            }
          }

        }),
        width: 65,

      },

    },
    {
      title: t('pAdminFoodsMenuNoCooking'),
      value: {
        col: columns,
        data: foods.filter(v => {
          if (!v.exist && !v.archive) {
            if (showFilter === 'all') {
              return v
            } else if (v.category.en === showFilter) {
              return v
            }
          }

        }),
        width: 65
      },

    },
    {
      title: t('pAdminFoodsMenuSpecialOffer'),
      value: {
        col: columns,
        data: foods.filter(v => {
          if (v.off && !v.archive) {
            if (showFilter === 'all') {
              return v
            } else if (v.category.en === showFilter) {
              return v
            }
          }

        }),

        width: 65
      },

    },
    {
      title: t('pAdminFoodsMenuHotMenu'),
      value: {
        col: columns,
        data: foods.filter(v => {
          if (v.hot && !v.archive) {
            if (showFilter === 'all') {
              return v
            } else if (v.category.en === showFilter) {
              return v
            }
          }

        }),


        width: 65
      },

    },
    {
      title: t('pAdminFoodsMenuArchive'),
      value: {
        col: columns1,
        data: foods.filter(v => {
          if (v.archive) {
            if (showFilter === 'all') {
              return v
            } else if (v.category.en === showFilter) {
              return v
            }
          }

        }),

        width: 65
      },

    }

  ]
  ////////////////////////////////////////////////////////////////////////////////////////////

  const lightTheme = {
    colorBgBase: "#ecf0f3",
    colorTextBase: "#333333",
    colorBorder: "#333333",
  }
  const darkTheme = {
    colorBgBase: "#232a3b",
    colorTextBase: "#fff",
    colorBorder: "#fff",
    colorPrimaryBg: "#313a55",
  }

  return (
    <div className='pAdminWrapper' >
      <div className='foodTitleWrapper'>
        <h2>{t('pAdminFoods')}</h2>
        <button className='btn' onClick={newFoodHandler}>{t('pAdminFoodsBtnNew')}</button>
      </div>
      <Tab arr={arr} filter={{ showFilter, setShowFilter }} type={"foods"} />


      <ConfigProvider
        theme={{
          token: theme ? darkTheme : lightTheme
        }}
      >
        {isModalOpen ? <ModalFood open={{ isModalOpen, setIsModalOpen }} data={{ modalData, setModalData }} lan={lan} foods={foods} /> : ''}
        {isModalOpenMenu ? <ModalMenu open={{ isModalOpenMenu, setIsModalOpenMenu }} data={{ modalDataMenu, setModalDataMenu }} foods={foods} lan={lan} /> : ''}
      </ConfigProvider>

    </div >
  )
}

export default Foods