import React, { useEffect, useState } from 'react'
import { Table, Container, Col, Row, InputGroup, Button, Input } from 'reactstrap'
import { BASE_URL } from '../configs/config'
import axios from 'axios'
import { months } from '../utils/months';
import Statistics from './Statistics';
import Graph from './Graph';
import Pie from './Pie';
import moment from 'moment';
import _ from 'lodash'

function TransactionTable() {
    const [selectedMonth, setSelectedMonth] = useState(3);
    const [tableRows, setTableRows] = useState([]);
    const [error, setError] = useState('');
    const [searchValue, setSearchValue] = useState("")


    // useEffect(() => {
    //     getData()
    // }, [])

    useEffect(() => {
        getDataForMonth();
    }, [selectedMonth])

    const getDataForMonth = async () => {
        axios.get(`${BASE_URL}/transactions/searchWith?month=${selectedMonth}`,
            {
                headers: {
                    'Access-Control-Allow-Origin': 'https://roxiler-project.vercel.app'
                }
            }
        ).then((res) => {
            const resData = res?.data;
            setTableRows(resData?.transactions);
        }).catch((err) => {
            setError(err);
        })
    }
    const getData = async () => {
        const data = await axios.get(`${BASE_URL}/transactions/getAll`).then((res) => console.log(res.data)).catch((err) => {
            console.log(err)
        })
    }

    const getTransactionsWith = async () => {
        await axios.get(`${BASE_URL}/transactions/searchWith?month=${selectedMonth}&text=${searchValue}`)
            .then((res) => setTableRows(res?.data?.transactions))
            .catch(err => setError(err))
    }

    return (
        <div>
            <Row xs="4" className='m-2'>

                <Col className="">
                    <InputGroup>
                        <Input value={searchValue} onChange={(e) => setSearchValue(e.target.value)} />
                        <Button onClick={() => getTransactionsWith()}>
                            Search
                        </Button>
                    </InputGroup>
                </Col>

                <Col className="" sm={{
                    offset: 6,
                    order: 2,
                    size: 3
                }}>
                    <Input
                        bsSize="sm"
                        className="mb-3"
                        type="select"
                        value={selectedMonth}
                        onChange={(e) => setSelectedMonth(e.target.value)}
                    >
                        {months.map(m => <option value={m.value}>
                            {m.option}
                        </option>)}

                    </Input>
                </Col>
            </Row>
            <Container
                className="m-1"
                fluid
            >

                <Table bordered size='sm' className='p-0'>


                    <thead>
                        <tr className="table-primary">
                            <th >
                                Id
                            </th>
                            <th>
                                Title
                            </th>
                            <th>
                                Price
                            </th>
                            <th>
                                Description
                            </th>
                            <th>
                                Date Of Sale
                            </th>
                            <th>
                                Category
                            </th>
                            <th>
                                Sold
                            </th>
                            <th>
                                Image
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            tableRows.map((data) => (
                                <tr className="table-info">
                                    <th scope='row'>
                                        {data.id}
                                    </th>

                                    <th>
                                        {data.title}
                                    </th>
                                    <th>
                                        {data.price}
                                    </th>
                                    <th>
                                        {data.description}
                                    </th>
                                    <th>
                                        {moment(data.dateOfSale).format('Do MMM YYYY')}
                                    </th>
                                    <th>
                                        {_.startCase(data.category)}
                                    </th>
                                    <th>
                                        {data.sold ? "Yes" : "No"}
                                    </th>
                                    <th>
                                        <a href={data.image} target='_blank'> View
                                        </a>
                                    </th>
                                </tr>
                            ))
                        }
                    </tbody>
                </Table>
            </Container>
            <Statistics month={selectedMonth}
                setError={setError}
            />
            <Graph month={selectedMonth}
                setError={setError} />
            <Pie month={selectedMonth}
                setError={setError} />
        </div>
    )
}


export default TransactionTable