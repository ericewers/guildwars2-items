import React, { useState, useEffect } from 'react'
import './App.css'
import { Dimmer, Loader, Container, Segment, Pagination, Select, Button, Icon } from 'semantic-ui-react'
import axios from 'axios'
import ItemSearch from './components/ItemSearch'
import ItemDisplay from './components/ItemDisplay'

const App = () => {

  const [pageSize, setPageSize] = useState(50)
  const [apiInfo, setApiInfo] = useState({
    url: `https://api.guildwars2.com/v2/items?page=0`,
    currentPage: 1,
    pageTotal: 0,
    resultTotal: 0,
    data: [],
    isLoading: true
  })

  const [resultsPerPage] = useState([
    { key: 10, value: 10, text: '10 Results' },
    { key: 25, value: 25, text: '25 Results' },
    { key: 50, value: 50, text: '50 Results' },
    { key: 100, value: 100, text: '100 Results' },
    { key: 200, value: 200, text: '200 Results' }
  ])

  useEffect(() => {
    axios.get(apiInfo.url)
      .then(res => {
        setApiInfo(prevState => ({
          ...prevState,
          pageTotal: res.headers['x-page-total'],
          resultTotal: res.headers['x-result-total'],
          data: res.data,
          isLoading: false
        }))
      })
  }, [apiInfo.url])

  const onChangePage = (e, pageInfo) => {
    setApiInfo(prevState => ({
      ...prevState,
      currentPage: pageInfo.activePage,
      url: `https://api.guildwars2.com/v2/items?page=${(pageInfo.activePage - 1).toString()}&page_size=${pageSize}`,
    }))
  }

  const onChangeSelection = (e, selectInfo) => {
    setPageSize(selectInfo.value)
    setApiInfo(prevState => ({
      ...prevState,
      currentPage: 1,
      url: `https://api.guildwars2.com/v2/items?page=0&page_size=${selectInfo.value}`
    }))
  }

  const formatNumber = (num) => {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
  }

  return (
    <>

      <Container id="top" className="container" textAlign="center">

        <Dimmer active={apiInfo.isLoading} inverted page>
          <Loader>Loading Data</Loader>
        </Dimmer>

        <Segment padded color='teal'>
          <h2>Guild Wars 2 Items</h2>
          <Pagination
            activePage={apiInfo.currentPage}
            onPageChange={onChangePage}
            totalPages={apiInfo.pageTotal}
          />
          <ItemSearch />
        </Segment>

        <Segment padded color='teal'>
          <Select placeholder='Results Per Page' options={resultsPerPage} onChange={onChangeSelection} />
          <span className="itemCount">{formatNumber(apiInfo.resultTotal)} items</span>
          <ItemDisplay data={apiInfo.data} />
          <Button className="scrollUp" href="#top" circular color="teal" icon='chevron up' />
        </Segment>
        <p>Made with <Icon name='like' /> by Eric Ewers :)</p>

      </Container>

    </>
  )
}

export default App
