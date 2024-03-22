import axios from 'axios'

const apiClient = axios.create({
  baseURL: 'http://localhost:8080/api/listings',
  withCredentials: false,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  }
})

//Fetches all listings from the database
export async function fetchListingsFromCategory(categoryName) {
  try {
    const response = await apiClient.get('/category/' + categoryName)
    console.log(response)
    return response
  } catch (error) {
    throw new Error('There was an error while fetching the requested category: ' + error)
  }
}

export async function fetchListing(listingId) {
  try {
    const response = await apiClient.get('/listing/' + listingId)
    return response
  } catch (error) {
    throw new Error('There was an error while fetching the requested listing: ' + error)
  }
}
