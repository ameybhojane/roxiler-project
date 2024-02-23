import React, { useEffect, useState } from 'react'
import { BarChart } from '@mui/x-charts'
import { BASE_URL } from '../configs/config';
import axios from 'axios';
import { isEmpty } from 'lodash';




function Graph(props) {
  const { month, setError } = props;
  const [barData, setBarData] = useState({ 0: 0 })

  useEffect(() => {
    getBarData();
  }, [month]);

  const getBarData = async () => {
    await axios.get(`${BASE_URL}/transactions/getBarChart?month=${month}`)
      .then(res => setBarData(res?.data?.barData))
      .catch(err => setError(err))
  }
  return (
    <div>
      <BarChart
        series={[
          { data: Object.values(barData) }
        ]
        }
        height={290}
        xAxis={[{
          data: Object.keys(barData)
          , scaleType: 'band'
        }]}
        margin={{ top: 10, bottom: 30, left: 40, right: 10 }}
      />
    </div>
  )
}

export default Graph