import { fetchItemCategories } from '@/services/ItemService.js'

// Converts the data from the database into a format that can be used by the image gallery
export default function imageListFormat(imageList) {
  if (!imageList.length === 0) return []

  let imageArray = []
  for (let i = 0; i < imageList.length; i++) {
    if (
      imageList[i].minPrice === undefined ||
      imageList[i].maxPrice === undefined ||
      imageList[i].listingId === undefined ||
      imageList[i].publicationTime === null
    ) {
      let img = {
        filename: `http://localhost:8080/api/source/${imageList[i].itemId}`,
        alt: imageList[i].itemName,
        title: imageList[i].itemName,
        price: 'Not listed',
        link: 'nft?id=' + imageList[i].itemId,
        itemId: imageList[i].itemId
      }
      imageArray.push(img)
    } else {
      let img = {
        filename: `http://localhost:8080/api/source/${imageList[i].itemId}`,
        alt: imageList[i].itemName,
        title: imageList[i].itemName,
        price: imageList[i].maxPrice,
        link: 'nft?id=' + imageList[i].itemId,
        itemId: imageList[i].itemId
      }
      imageArray.push(img)
    }
  }
  return imageArray
}

export async function imageTableFormat(imageList) {
  let items = imageList
  var nftArray = []
  for (let i = 0; i < items.length; i++) {
    let categories = []
    const itemCategories = await fetchItemCategories(items[i].itemId)
    for (let j = 0; j < itemCategories.data.length; j++) {
      categories.push(itemCategories.data[j].categoryName)
    }

    if (
      items[i].minPrice === undefined ||
      items[i].maxPrice === undefined ||
      items[i].listingId === undefined ||
      items[i].publicationTime === null
    ) {
      let nft = {
        title: items[i].itemName,
        description: items[i].description,
        image: `http://localhost:8080/api/source/${items[i].itemId}`,
        listed: 'Not listed',
        bidPrice: '0',
        buyPrice: '0',
        categories: categories,
        id: items[i].itemId
      }
      nftArray.push(nft)
    } else {
      let nft = {
        title: items[i].itemName,
        description: items[i].description,
        image: `http://localhost:8080/api/source/${items[i].itemId}`,
        listed: items[i].publicationTime.slice(0, 10),
        bidPrice: items[i].minPrice,
        buyPrice: items[i].maxPrice,
        categories: categories,
        id: items[i].itemId
      }
      nftArray.push(nft)
    }
  }
  return nftArray
}
