import React from 'react'
// ant
import { Tabs, ConfigProvider } from 'antd';
// components
import TimeFilter from '../filter/TimeFilter';
import ProducerTable from '../table/ProducerTable';
// redux
import { useSelector } from 'react-redux';
import { themeDetail } from '../../../../redux/itemStore/theme';


function Tab({ arr, filter, type }) {
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
            <Tabs

                defaultActiveKey="1"
                type="card"
                size="large"
                tabBarGutter={5}
                items={
                    arr.map((value, i) => {
                        const id = String(i + 1);
                        return {
                            label: value.title,
                            key: id,
                            children:
                                <div >
                                    <div className='filterWrapperFoods'>
                                        <TimeFilter {...filter} type={type} />
                                    </div>

                                    <ProducerTable {...value.value} />
                                </div>



                        }
                    })}
            />

        </ConfigProvider >
    )
}

export default Tab