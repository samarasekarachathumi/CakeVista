import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [items, setItems] = useState([])

  useEffect(() => {
    const raw = localStorage.getItem('cv_cart')
    if (raw) {
      try {
        setItems(JSON.parse(raw))
      } catch {
        localStorage.removeItem('cv_cart')
      }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('cv_cart', JSON.stringify(items))
  }, [items])

  const addItem = (item, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === item.id)
      if (existing) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + quantity } : i
        )
      }
      return [...prev, { ...item, quantity }]
    })
  }

  const removeItem = (itemId) => {
    setItems((prev) => prev.filter((i) => i.id !== itemId))
  }

  const updateQuantity = (itemId, quantity) => {
    setItems((prev) => prev.map((i) => (i.id === itemId ? { ...i, quantity } : i)))
  }

  const clear = () => setItems([])

  const total = useMemo(
    () => items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    [items]
  )

  const value = useMemo(
    () => ({ items, addItem, removeItem, updateQuantity, clear, total }),
    [items, total]
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}


