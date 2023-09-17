import React from "react"
import { Table,ConfigProvider } from "antd"
// redux
import { useSelector } from 'react-redux';
import { themeDetail } from '../../../../redux/itemStore/theme';

const ProducerTable = ({ col, data, width }) => {
    const theme = useSelector(themeDetail);


    const darkTheme = {
        colorBgBase: "#232a3b",
        colorTextBase: "#fff",
        colorPrimaryBg: "#313a55",

    }

    return (
        <ConfigProvider
            theme={{
                token: theme ? darkTheme : {}
            }}

        >
            <div className="producerTable">
                <Table
                    columns={col}
                    dataSource={data}
                    scroll={{ x: `${width}rem` }}
                    pagination={{
                        position: ['bottomCenter'],
                        pageSize: 20,

                    }}
                    rowKey={(record) => record.id}
                />
            </div>
        </ConfigProvider>
    )
}
export default ProducerTable
