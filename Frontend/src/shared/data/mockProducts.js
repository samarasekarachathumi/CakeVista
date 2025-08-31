import { CATEGORY_GROUPS } from '../constants/catalog.js'

function makeProduct(i) {
  const id = `p${i + 1}`
  const basePrice = 2500 + i * 200
  const discountPrice = i % 2 === 0 ? basePrice - 300 : null
  const categories = i % 2 === 0
    ? [[ 'flavors', 'Chocolate' ], [ 'occasions', 'Birthday' ]]
    : [[ 'flavors', 'Vanilla' ], [ 'occasions', 'Anniversary' ]]
  return {
    id,
    name: `Cake ${i + 1}`,
    description: 'A delicious handcrafted cake you can customize.',
    basePrice,
    discountPrice,
    images: [
      `https://picsum.photos/seed/${id}-1/800/500`,
      `https://picsum.photos/seed/${id}-2/800/500`,
      `https://picsum.photos/seed/${id}-3/800/500`,
    ],
    availability: { stock: 10 + i, status: 'In Stock' },
    categories,
    customization: {
      size: [ { name: '1Lbs', price: -500 }, { name: '2Lbs', price: 0 }, { name: '3Lbs', price: 600 } ],
      flavor: [ { name: 'Chocolate', price: 0 }, { name: 'Vanilla', price: 0 }, { name: 'Strawberry', price: 300 } ],
      toppings: [ { name: 'Sprinkles', price: 150 }, { name: 'Chocolate Chips', price: 250 }, { name: 'Caramel Drizzle', price: 300 } ],
      color: [ { name: 'Red', price: 100 }, { name: 'Blue', price: 100 } ],
      customMessage: { isAvailable: true, price: 50 },
    },
  }
}

export const mockProducts = Array.from({ length: 12 }).map((_, i) => makeProduct(i))

export function getProductById(id) {
  return mockProducts.find((p) => p.id === id)
}


