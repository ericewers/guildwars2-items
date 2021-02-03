import React, { useState, useEffect } from 'react'
import './App.css'
import Items from './components/Items'
import { Container, Pagination, Button } from 'semantic-ui-react'
import axios from 'axios'

const App = () => {

  const [pageSize,] = useState(50)
  const [apiInfo, setApiInfo] = useState({
    url: `https://api.guildwars2.com/v2/items?page=0&page_size=${pageSize}`,
    pageTotal: 0,
    data: []
  })

  useEffect(() => {
    axios.get(apiInfo.url).then(response => {
      setApiInfo(prevState => ({
        ...prevState,
        pageTotal: response.headers['x-page-total'],
        data: response.data
      }))
    })
  }, [apiInfo.url])

  const onChange = (e, pageInfo) => {
    setApiInfo(prevState => ({
      ...prevState,
      url: `https://api.guildwars2.com/v2/items?page=${(pageInfo.activePage - 1).toString()}&page_size=${pageSize}`
    }))
  }

  return (
    <>

      <Container className="container" fluid textAlign="center">

        <h2 id="top">Guild Wars 2 Items</h2>

        <Pagination
          onPageChange={onChange}
          totalPages={apiInfo.pageTotal}
        />

        <Items data={apiInfo.data} />

        <Button className="scrollUp" href="#top" circular icon='arrow alternate circle up outline' />

      </Container>

    </>
  )
}

export default App
