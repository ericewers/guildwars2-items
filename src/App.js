import React, { Component } from 'react'
import './App.css'
import Items from './components/Items'
import * as data from './items.json'
import { Container, Pagination, Search } from 'semantic-ui-react'
import _ from 'lodash'

class App extends Component {

  constructor() {
    super()

    this.state = {
      totalItems: data.data.length,
      currentPage: 1,
      pageSize: 50,
      isLoading: false,
      searchResults: [],
      searchValue: '',
      maxResults: 20
    }

  }

  getPage = (e, { activePage }) => { 
    this.setState({ currentPage: activePage })
  }

  handleResultSelect = (e, { result }) => this.setState({ searchValue: result.name })

  handleSearchChange = (e, { value }) => {
    this.setState({ isLoading: true, searchValue: value })

    setTimeout(() => {
      if (this.state.searchValue.length < 1) return this.setState({ isLoading: false, searchResults: [], searchValue: '' })

      const re = new RegExp(_.escapeRegExp(this.state.searchValue), 'i')
      const isMatchWithLimit = (arr, maxCount) => {
        let results = []
        _.forEach(arr, (result) => {
            if (results.length === maxCount) return false
            result.title = result.name
            if (re.test(result.title)) results.push(result)
        })
        return results
    }

      this.setState({
        isLoading: false,
        searchResults: isMatchWithLimit(data.data, this.state.maxResults),
      })
    }, 300)
  }

  render() {

    return (
      <>

        <Container textAlign="center">
          <h2>Guild Wars 2 Items</h2>
        </Container>

        <Container textAlign="center">
          <Pagination
            activePage = { this.state.currentPage } 
            onPageChange = { this.getPage }
            totalPages = { Math.ceil(this.state.totalItems / this.state.pageSize) } 
          />
        </Container>

        <Container textAlign="center">
          <Search
              loading = { this.state.isLoading }
              onResultSelect = { this.handleResultSelect }
              onSearchChange = { _.debounce(this.handleSearchChange, 500, {
                leading: true,
              })}
              results = { this.state.searchResults }
              value = { this.state.searchValue }
              { ...this.props }
            />
          </Container>

        <div className="content">
          <Items data = { data.data } pageNumber = { this.state.currentPage } pageSize = { this.state.pageSize } />
        </div>

      </>
    )

  }

}

export default App
