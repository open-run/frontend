import { useState, useEffect } from 'react'
import Fuse from 'fuse.js'

export default function useFushSearch<T>(list: T[], key: keyof T extends string ? keyof T : never) {
  const [search, setSearch] = useState('')
  const [filteredList, setFilteredList] = useState(list)

  const fuseOptions = {
    keys: [key],
    threshold: 0.4,
    ignoreLocation: true,
    minMatchCharLength: 1,
  }

  useEffect(() => {
    if (!search.trim()) {
      setFilteredList(list)
      return
    }

    const fuse = new Fuse(list, fuseOptions)
    const results = fuse.search(search)
    setFilteredList(results.map((result) => result.item))
  }, [list, search])

  return { search, setSearch, filteredList }
}
