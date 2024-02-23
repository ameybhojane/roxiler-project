import React, { useEffect, useState } from 'react'
import { BASE_URL } from '../configs/config';
import axios from 'axios';
import { PieChart } from '@mui/x-charts'

function Pie(props) {
    const { month, setError } = props;
    const [barData, setBarData] = useState({ 0: 0 })

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
            <PieChart
                series={[
                    {
                        data:
                            barData
                        ,
                    },
                ]}
                width={400}
                height={200}
            />
        </div>
    )
}

export default Pie