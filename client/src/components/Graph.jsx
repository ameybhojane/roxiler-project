import React, { useEffect, useState } from 'react'
import { BarChart } from '@mui/x-charts'
import { BASE_URL } from '../configs/config';
import axios from 'axios';
import { isEmpty } from 'lodash';
import { months } from '../utils/months';
import { Box, Typography } from '@mui/material';




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
      <Box flexGrow={1}>

        <Typography >Bar Chart Stats - {months[month - 1].option}</Typography>
        <BarChart
          series={[
            { data: Object.values(barData) }
          ]
          }
          height={400}
          xAxis={[{
            data: Object.keys(barData),
            scaleType: 'band',
            label: 'Prices'
          }]}
          yAxis={[
            {
              label: 'No of Items',
            },
          ]}
          margin={{ top: 10, bottom: 60, left: 60, right: 10 }}
        />
      </Box>
    </div>
  )
}

export default Graph