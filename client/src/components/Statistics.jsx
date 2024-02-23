import React, { useEffect, useState } from 'react'
import { Card, CardBody, CardHeader, Container, Row, Col } from 'reactstrap'
import { months } from '../utils/months'
import axios from 'axios';
import { BASE_URL } from '../configs/config';

function Statistics(props) {
  const { month, setError } = props
  const [salesStatistics, setSalesStatistics] = useState({})

  useEffect(() => {
    getStatistics();
  }, [month]);

  const getStatistics = async () => {
    await axios.get(`${BASE_URL}/transactions/getStatistics?month=${month}`)
      .then(res => setSalesStatistics(res?.data))
      .catch(err => setError(err))
  }

  return (
    <div>
      <Container>
        <Row xs="4">
          <Col>
            <Card>
              <CardHeader>
                Statistics {months[month - 1].option}
              </CardHeader>
              <CardBody>
                <p>Total Sales - {salesStatistics?.totalSales}</p>
                <p>Items Sold - {salesStatistics?.itemsSold}</p>
                <p>Items Unsold - {salesStatistics?.itemsUnsold}</p>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default Statistics 