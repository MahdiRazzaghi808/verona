import React from 'react';
import { data } from '../../../../../../helper/chartData/chartData';
import { Line } from '@ant-design/plots';

const LineChart = () => {


    
    const COLOR_PLATE_10 = [
        '#5B8FF9',
        // '#5AD8A6',
        // '#5D7092',
        '#F6BD16',
        '#E8684A',
        '#6DC8EC',
        '#9270CA',
        '#FF9D4D',
        '#269A99',
        '#FF99C3',
    ];
    const config = {
        data,
        xField: 'year',
        yField: 'value',
        seriesField: 'category',
        yAxis: {
            label: {
                formatter: (v) => `${v}`.replace(/\d{1,3}(?=(\d{3})+$)/g, (s) => `${s},`),
            },
        },
        color: COLOR_PLATE_10,
        point: {
            style: ({ year }) => {
                return {
                    r: Number(year) % 4 ? 0 : 3, 
                };
            },
        },
    };

    return <Line {...config} />

};


export default LineChart