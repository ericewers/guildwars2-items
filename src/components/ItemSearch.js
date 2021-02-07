import React, { useEffect, useRef, useReducer, useCallback } from 'react'
import { Search } from 'semantic-ui-react'
import jsonData from './../items.json'
import _ from 'lodash'

const ItemSearch = () => {

    const initialState = {
        loading: false,
        results: [],
        value: ''
    }

    const searchReducer = (state, action) => {
        switch (action.type) {
            case 'CLEAN_QUERY':
                return initialState
            case 'START_SEARCH':
                return { ...state, loading: true, value: action.query }
            case 'FINISH_SEARCH':
                return { ...state, loading: false, results: action.results }
            case 'UPDATE_SELECTION':
                return { ...state, value: action.selection }

            default:
                throw new Error()
        }
    }

    const [state, dispatch] = useReducer(searchReducer, initialState)
    const { loading, results, value } = state

    const timeoutRef = useRef()
    const handleSearchChange = useCallback((e, data) => {
        clearTimeout(timeoutRef.current)
        dispatch({ type: 'START_SEARCH', query: data.value })

        timeoutRef.current = setTimeout(() => {
            if (data.value.length === 0) {
                dispatch({ type: 'CLEAN_QUERY' })
                return
            }

            const re = new RegExp(_.escapeRegExp(data.value), 'i')
            const isMatch = (result) => {
                //return re.test(result.title = result.name)
                let results = []
                _.forEach(result, (r) => {
                    if (results.length === 50) return false
                    r.title = r.name
                    if (re.test(r.title)) results.push(r)
                })
                return results
            }

            dispatch({
                type: 'FINISH_SEARCH',
                // results: _.filter(jsonData, isMatch)
                results: isMatch(jsonData)
            })
        }, 300)
    }, [])

    useEffect(() => {
        return () => {
            clearTimeout(timeoutRef.current)
        }
    }, [])

    return (
        <Search
            fluid
            loading={loading}
            onResultSelect={(e, data) =>
                dispatch({ type: 'UPDATE_SELECTION', selection: data.result.title })
            }
            onSearchChange={handleSearchChange}
            placeholder="Search for items..."
            results={results}
            value={value}
        />
    )
}

export default ItemSearch
