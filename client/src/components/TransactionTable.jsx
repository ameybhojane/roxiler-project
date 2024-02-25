import React, { useEffect, useState } from 'react'
import { Table, Container, Col, Row, InputGroup, Button, Input, Pagination, PaginationItem, PaginationLink, Dropdown, DropdownItem, DropdownToggle, DropdownMenu } from 'reactstrap'
import { BASE_URL } from '../configs/config'
import axios from 'axios'
import { months } from '../utils/months';
import Statistics from './Statistics';
import Graph from './Graph';
import Pie from './Pie';
import moment from 'moment';
import _, { toInteger } from 'lodash'

function TransactionTable() {
    const [selectedMonth, setSelectedMonth] = useState(3);
    const [tableRows, setTableRows] = useState([]);
    const [error, setError] = useState('');
    const [searchValue, setSearchValue] = useState("");
    const [currPage, setCurrPage] = useState(1);
    const [noOfPages, setNoOfPages] = useState(1);
    const [recordPerPage, setRecordPerPage] = useState(3)
    const [dropdownOpen, setDropdownOpen] = useState(false);

    useEffect(() => {
        setCurrPage(1);
        setSearchValue("")
        getDataForMonth();
    }, [selectedMonth])

    useEffect(() => {
        getDataForMonth();
    }, [currPage, recordPerPage])

    const getDataForMonth = async () => {
        await axios.get(`${BASE_URL}/transactions/searchWith?month=${selectedMonth}&page=${currPage}&limit=${recordPerPage}&text=${searchValue}`,
            {
                headers: {
                    'Access-Control-Allow-Origin': 'https://roxiler-project.vercel.app'
                }
            }
        ).then((res) => {
            const resData = res?.data;
            setTableRows(resData?.transactions);
            const totalCount = (resData?.totalCount);
            let pages = 1; // Initialize to a default positive value
            if (recordPerPage > 0) {
                pages = toInteger(totalCount / recordPerPage) + (totalCount % recordPerPage > 0 ? 1 : 0);
            } pages = pages <= 0 ? 1 : pages
            setNoOfPages(pages)
        }).catch((err) => {
            setError(err);
        })
    }

    const paginationArr = new Array(noOfPages).fill(0)

    return (
        <div>
            <Row xs="4" className='m-2'>

                <Col className="">
                    <InputGroup>
                        <Input value={searchValue} onChange={(e) => setSearchValue(e.target.value)} />
                        <Button onClick={() => { getDataForMonth(); setCurrPage(1) }}>
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
                        onChange={(e) => { setSearchValue(""); setSelectedMonth(e.target.value) }}
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
                <Row>
                    <Col className='col-6'>
                        <Pagination>
                            <PaginationItem onClick={() => setCurrPage(1)}>
                                <PaginationLink
                                    first
                                />
                            </PaginationItem>
                            <PaginationItem onClick={() => setCurrPage(currPage - 1)}>
                                <PaginationLink
                                    previous
                                />
                            </PaginationItem>
                            {paginationArr && paginationArr.map((x, i) => (
                                <PaginationItem active={(currPage == i + 1)}>
                                    <PaginationLink onClick={() => setCurrPage(i + 1)}>
                                        {i + 1}
                                    </PaginationLink>
                                </PaginationItem>
                            ))}

                            <PaginationItem >
                                <PaginationLink next onClick={() => setCurrPage(currPage + 1)} />
                            </PaginationItem>
                            <PaginationItem>
                                <PaginationLink onClick={() => setCurrPage(noOfPages)}
                                    last
                                />
                            </PaginationItem>
                        </Pagination>

                    </Col>
                    <Col sm={{
                        offset: 9,
                        // order: 2,
                        size: 3
                    }}>
                        <Dropdown isOpen={dropdownOpen}
                            toggle={() => setDropdownOpen((prevState) => !prevState)}
                            name={'dropdown'}
                            value={recordPerPage}
                        >
                            <DropdownToggle caret
                            >Per Page</DropdownToggle>
                            <DropdownMenu>
                                {Array.apply(null, Array(5)).map((x, i) =>
                                (<DropdownItem
                                    active={i + 1 === recordPerPage}
                                    onClick={() => { setRecordPerPage(i + 1); setCurrPage(1); }}
                                    value={i + 1}
                                // disabled={i + 1 > totalCount}
                                >
                                    {i + 1}
                                </DropdownItem>)
                                )}
                            </DropdownMenu>
                        </Dropdown>
                    </Col>
                </Row>
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