import React, { useEffect, useState } from 'react'
import { BASE_URL } from '../configs/config';
import axios from 'axios';
import { PieChart } from '@mui/x-charts'
import _ from 'lodash';
import { Typography, Box } from '@mui/material';
import { months } from '../utils/months';

function Pie(props) {
    const { month, setError } = props;
    const [barData, setBarData] = useState([
        { id: 0, value: 10, label: 'series A' },
        { id: 1, value: 15, label: 'series B' },
        { id: 2, value: 20, label: 'series C' },
    ])

    useEffect(() => {
        getBarData();
    }, [month]);

    const getBarData = async () => {
        await axios.get(`${BASE_URL}/transactions/getPieDiagram?month=${month}`)
            .then(res => setBarData(res?.data?.pieData))
            .catch(err => setError(err))
    }
    return (
        <div>
            <Box flexGrow={1}>

                <Typography>Pie Chart Stats - {months[month - 1].option}</Typography>
                <PieChart
                    series={[
                        {
                            data:
                                barData.map((ele) => ({ ...ele, label: _.startCase(ele.label) }))
                            ,
                        },
                    ]}
                    width={500}
                    height={200}
                />
            </Box>
        </div>
    )
}

export default Pie