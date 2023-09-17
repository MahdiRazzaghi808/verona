import React, { useEffect, useState } from 'react'
// router
import { Link, useOutletContext } from 'react-router-dom';
// redux
import { useDispatch, useSelector } from 'react-redux';
import { usersDetail, getUsersFromServer } from '../../../../redux/itemStore/users';
import { themeDetail } from '../../../../redux/itemStore/theme';
import { dollarDetail } from '../../../../redux/itemStore/dollar';
// react icons
import { HiOutlineMinus } from 'react-icons/hi';
import { TbSettings } from 'react-icons/tb';
// ant
import { Space, Input, Button, ConfigProvider } from "antd"
import { SearchOutlined } from '@ant-design/icons';
// components
import ProducerTable from "../../components/table/ProducerTable"
// modal
import NewUser from "./modal/NewUser"
// helper
import { mDate } from '../../../../helper/setTime/setTime';
import { cartSidebar } from "../../../../helper/price/priceShow"
// language
import { useTranslation } from 'react-i18next';





function Users() {
  const { lan } = useOutletContext();
  const dispatch = useDispatch();
  const { t } = useTranslation()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalData, setModalData] = useState([]);

  const users = useSelector(usersDetail)
  const theme = useSelector(themeDetail);
  const dollar = useSelector(dollarDetail)


  useEffect(() => {
    dispatch(getUsersFromServer())

  }, [])
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////
  const newUserHandler = () => {
    setIsModalOpen(true)
  }

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////

  const handleReset = (clearFilters, confirm) => {
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

      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes(value.toLowerCase()),
  })

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
  const columns = [
    {
      title: t('pAdminTableProfile'),
      dataIndex: "image",
      key: "image",
      render: (_, { image }) => (
        <div className='profile'>
          <img src={image} alt="profile" />
        </div>
      )

    },

    {
      title: t('pAdminTableName'),
      dataIndex: "name",
      key: "name",
      ...getColumnSearchProps('name'),

    },

    {
      title: t('pAdminTableRol'),
      dataIndex: "rol",
      key: "rol",
      filters: [
        {
          text: t('pAdminTableRolOWNER'),
          value: "OWNER"
        },
        {
          text: t('pAdminTableRolADMIN'),
          value: "ADMIN"
        },
        {
          text: t('pAdminTableRolVIEWER'),
          value: "VIEWER"
        },
        {
          text: t('pAdminTableRolUSER'),
          value: "USER"
        },
      ],
      onFilter: (value, record) => record.rol.indexOf(value) === 0,
      render: (v) => (
        <div>
          <span>{t(`pAdminTableRol${v}`)}</span>
        </div>
      )
    },

    {
      title: t('pAdminTablePhone'),
      dataIndex: "phone",
      key: "phone",
      ...getColumnSearchProps('phone'),

    },

    {
      title: t('pAdminTableEmail'),
      dataIndex: "email",
      key: "email",
      ...getColumnSearchProps('email'),

      render: (v) => (
        <div>
          <span>{v ? v : <HiOutlineMinus />}</span>
        </div>
      )
    },

    {
      title: t('pAdminTableCommentCount'),
      dataIndex: "commentsCount",
      key: "commentsCount",
      sorter: (a, b) => a.commentsCount - b.commentsCount,

      render: (v) => (
        <div>
          <span>{v}</span>
        </div>
      )
    },
    {
      title: t('pAdminTableTotalBuy'),
      dataIndex: "totalBuy",
      key: "totalBuy",
      sorter: (a, b) => a.totalBuy - b.totalBuy,


      render: (v) => (
        <div>
          <span>{cartSidebar(dollar, v, lan)}</span>
        </div>
      )
    },

    {
      title: t('pAdminTableRegisterDate'),
      dataIndex: "time",
      key: "time",
      sorter: (a, b) => a.time - b.time,

      render: (v) => (
        <div>
          <span>{mDate(v)[lan]}</span>
        </div>
      )

    },

    {
      title: t('pAdminTableTotalSetting'),
      dataIndex: "",
      key: "y",
      render: (done, data) =>
        <div className='foodInfo'>
          <Link to={`/pAdmin/user/${data.id}`}>
            <TbSettings />
          </Link>
        </div>
    },

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
        <h2>{t('dashboardInformationUsers')}</h2>
        <button className='btn' onClick={newUserHandler}>{t('pAdminUsersNewBtn')}</button>
      </div>

      <div>

        <ProducerTable col={columns} data={users} width={55} />
      </div>

      <ConfigProvider
        theme={{
          token: theme ? darkTheme : lightTheme
        }}
      >

        {isModalOpen ? <NewUser open={{ isModalOpen, setIsModalOpen }} data={{ modalData, setModalData }} lan={lan} /> : ''}

      </ConfigProvider>

    </div >
  )
}

export default Users