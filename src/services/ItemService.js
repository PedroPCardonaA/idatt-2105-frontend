import axios from 'axios'
import { useUserStore } from '@/stores/UserStore.js'

const apiClient = axios.create({
  baseURL: 'http://localhost:8080/api/',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  }
})

/**
 * Posts a new item to the database
 * @param {*} item An object containing all information about the item
 * @returns The id of the newly created item
 */
export async function postUserItem(item) {
  try {
    const response = await apiClient.post('itemListing/post', item, {
      headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + useUserStore().userToken
      }
  })
    return response
  } catch (error) {
    throw new Error('There was an error while posting a new item: ' + error)
  }
}

export async function addItemCategory(itemId, category) {
  let categoryExists = false

  //Check if category exists
  try {
    const response = await apiClient.get('categories/', {
      headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + useUserStore().userToken
      }
  })
    for (let i = 0; i < response.data.length; i++) {
      if (response.data[i].categoryName == category) {
        categoryExists = true
      }
    }
  } catch (error) {
    throw new Error('There was an error while posting a new item: ' + error)
  }

  //If category does not exist, create it
  if (!categoryExists) {
    try {
      const response = await apiClient.post('categories/', {
        categoryName: category
      }, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + useUserStore().userToken
        }
    })
    } catch (error) {
      //Then the category does exist
    }
  }

  //Add category to item
  try {
    const response = await apiClient.post('itemsCategories/post', {
      itemId: itemId,
      categoryName: category
    }, {
      headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + useUserStore().userToken
      }
  })
    return response
  } catch (error) {
    throw new Error('There was an error while posting a new item: ' + error)
  }
}

/**
 * Fetches all items from the database
 * @param {*} filter  An object containing the filter parameters
 * @returns An array of items
 */
export async function fetchAllItems(filter) {
  if (filter === undefined) {
    filter = {}
  }

  if (filter.size === undefined) {
    filter.size = 6
  }

  if (filter.sortBy === undefined) {
    filter.sortBy = 'visits'
  }

  if (filter.page === undefined) {
    filter.page = 0
  }

  if (filter.order === undefined) {
    filter.order = 'desc'
  }

  if (filter.minPrice === undefined) {
    filter.minPrice = 0
  }

  if (filter.maxPrice === undefined) {
    filter.maxPrice = 1000000
  }

  if (filter.category === undefined) {
    filter.category = ''
  } else if (filter.category == '') {
    filter.category = ''
  } else {
    try {
        const response = await apiClient.get('itemListing/category?size=' + filter.size + '&sortBy=' + filter.sortBy + '&page=' + filter.page + '&order=' + filter.order + '&minPrice=' + filter.minPrice + '&maxPrice=' + filter.maxPrice + '&category=' + filter.category)
        return response
    } catch (error) {
        throw new Error('There was an error while getting all items: ' + error)
    }
  }

  try {
    const response = await apiClient.get('itemListing/?size=' + filter.size + '&sortBy=' + filter.sortBy + '&page=' + filter.page + '&order=' + filter.order + '&minPrice=' + filter.minPrice + '&maxPrice=' + filter.maxPrice)
    return response
  } catch (error) {
    throw new Error('There was an error while getting all items: ' + error)
  }
}

/**
 * Fetches all items with a specific category
 * @param {*} category The category of the items
 * @returns An array of items
 */
export async function fetchAllItemsByCategory(category) {
  try {
    const response = await apiClient.get('itemListing/category?size=6&category=' + category)
    return response
  } catch (error) {
    throw new Error('There was an error while getting all items: ' + error)
  }
}

/**
 * Fetches all items belonging to a specific user
 * @param {*} ownerName The username of the owner
 * @returns An array of items
 */
export async function fetchItemsByOwner(ownerName) {
  try {
    const response = await apiClient.get('itemListing/owner?username=' + ownerName + '&size=1000')
    return response
  } catch (error) {
    throw new Error('There was an error while getting all items belonging to the user: ' + error)
  }
}

/**
 * Fetches all information about a specific item
 * @param {*} itemId  The id of the item
 * @returns An object containing all information about the item
  */
export async function fetchItemById(itemId) {
  try {
    const response = await apiClient.get('itemListing/item/' + itemId)
    return response
  } catch (error) {
    throw new Error('There was an error while getting all items belonging to the user: ' + error)
  }
}

/**
 * Adds a visit to an item
 * @param {*} itemId  The id of the item
 */
export async function addVisitById(itemId) {
  try {
    const response = await apiClient.put('listings/visits/' + itemId)
    return response
  } catch (error) {
    throw new Error('There was an error while adding a visit to the item: ' + error)
  }
}

/**
 * Fetches all categories from an item
 * @param {*} itemId  The id of the item
 * @returns  An array of categories
 */
export async function fetchItemCategories(itemId) {
  try {
    const response = await apiClient.get('itemsCategories/categories/' + itemId)
    return response
  } catch (error) {
    throw new Error('There was an error while getting all item categories: ' + error)
  }
}
