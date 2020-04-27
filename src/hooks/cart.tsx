import React, {
  createContext,
  useState,
  useCallback,
  useContext,
  useEffect,
} from 'react'

import AsyncStorage from '@react-native-community/async-storage'

interface Product {
  id: string
  title: string
  image_url: string
  price: number
  quantity: number
}

interface CartContext {
  products: Product[]
  addToCart(item: Product): void
  increment(id: string): void
  decrement(id: string): void
}

const CartContext = createContext<CartContext | null>(null)

const CartProvider: React.FC = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    async function loadProducts(): Promise<void> {
      // await AsyncStorage.removeItem('@GoStack11Desafio07:products')
      const prods = await AsyncStorage.getItem('@GoStack11Desafio07:products')

      if (prods) {
        setProducts(JSON.parse(prods))
      }
    }

    loadProducts()
  }, [])

  const addToCart = useCallback(
    async ({ id, title, image_url, price }) => {
      const productIndex = products.findIndex(prod => id === prod.id)

      const product = { id, title, image_url, price, quantity: 1 }

      if (productIndex < 0) {
        setProducts([...products, product])
      } else {
        const newProducts = products
        newProducts[productIndex].quantity += 1
        setProducts([...newProducts])
      }

      await AsyncStorage.setItem(
        '@GoStack11Desafio07:products',
        JSON.stringify(products),
      )

      console.log('1')
    },
    [products],
  )

  const increment = useCallback(
    async id => {
      const newProducts = products

      const productIndex = newProducts.findIndex(product => product.id === id)

      if (newProducts[productIndex].quantity) {
        newProducts[productIndex].quantity += 1
      }

      setProducts([...newProducts])

      await AsyncStorage.setItem(
        '@GoStack11Desafio07:products',
        JSON.stringify(products),
      )
    },
    [products],
  )

  const decrement = useCallback(
    async id => {
      const newProducts = products

      const productIndex = newProducts.findIndex(product => product.id === id)

      if (newProducts[productIndex].quantity > 1) {
        newProducts[productIndex].quantity -= 1
      } else {
        newProducts.splice(productIndex, 1)
      }

      setProducts([...newProducts])

      await AsyncStorage.setItem(
        '@GoStack11Desafio07:products',
        JSON.stringify(products),
      )
    },
    [products],
  )

  const value = React.useMemo(
    () => ({ addToCart, increment, decrement, products }),
    [products, addToCart, increment, decrement],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

function useCart(): CartContext {
  const context = useContext(CartContext)

  if (!context) {
    throw new Error(`useCart must be used within a CartProvider`)
  }

  return context
}

export { CartProvider, useCart }
