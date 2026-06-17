"use client"

import { createContext, useContext, useReducer, useEffect, useCallback, type ReactNode } from "react"

export type CartItem = {
  id: string
  product_id: string
  name: string
  price_clp: number
  image_url: string | null
  slug: string
  quantity: number
  stock: number
}

type CartState = {
  items: CartItem[]
  sessionId: string
  loaded: boolean
}

type CartAction =
  | { type: "SET_ITEMS"; items: CartItem[] }
  | { type: "ADD_ITEM"; item: CartItem }
  | { type: "UPDATE_QUANTITY"; productId: string; quantity: number }
  | { type: "REMOVE_ITEM"; productId: string }
  | { type: "SET_SESSION"; sessionId: string }
  | { type: "SET_LOADED"; loaded: boolean }

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "SET_ITEMS":
      return { ...state, items: action.items, loaded: true }
    case "ADD_ITEM": {
      const existing = state.items.find((i) => i.product_id === action.item.product_id)
      if (existing) {
        return {
          ...state,
          items: state.items.map((i) =>
            i.product_id === action.item.product_id
              ? { ...i, quantity: i.quantity + action.item.quantity }
              : i,
          ),
        }
      }
      return { ...state, items: [...state.items, action.item] }
    }
    case "UPDATE_QUANTITY":
      return {
        ...state,
        items: state.items.map((i) =>
          i.product_id === action.productId ? { ...i, quantity: action.quantity } : i,
        ),
      }
    case "REMOVE_ITEM":
      return { ...state, items: state.items.filter((i) => i.product_id !== action.productId) }
    case "SET_SESSION":
      return { ...state, sessionId: action.sessionId }
    case "SET_LOADED":
      return { ...state, loaded: action.loaded }
    default:
      return state
  }
}

type CartContextType = {
  items: CartItem[]
  itemCount: number
  total: number
  loaded: boolean
  addItem: (item: CartItem) => void
  updateQuantity: (productId: string, quantity: number) => void
  removeItem: (productId: string) => void
}

const CartContext = createContext<CartContextType | null>(null)

function getSessionId(): string {
  if (typeof window === "undefined") return ""
  let sid = localStorage.getItem("cart_sid")
  if (!sid) {
    sid = crypto.randomUUID()
    localStorage.setItem("cart_sid", sid)
  }
  return sid
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    sessionId: "",
    loaded: false,
  })

  useEffect(() => {
    const sid = getSessionId()
    dispatch({ type: "SET_SESSION", sessionId: sid })

    if (!sid) return

    fetch(`/api/cart?sessionId=${sid}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.items) dispatch({ type: "SET_ITEMS", items: data.items })
      })
      .catch(() => {})
  }, [])

  const addItem = useCallback(
    async (item: CartItem) => {
      dispatch({ type: "ADD_ITEM", item })
      await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: state.sessionId, productId: item.product_id, quantity: item.quantity }),
      })
    },
    [state.sessionId],
  )

  const updateQuantity = useCallback(
    async (productId: string, quantity: number) => {
      if (quantity < 1) {
        dispatch({ type: "REMOVE_ITEM", productId })
      } else {
        dispatch({ type: "UPDATE_QUANTITY", productId, quantity })
      }
      await fetch("/api/cart", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: state.sessionId, productId, quantity }),
      })
    },
    [state.sessionId],
  )

  const removeItem = useCallback(
    async (productId: string) => {
      dispatch({ type: "REMOVE_ITEM", productId })
      await fetch("/api/cart", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: state.sessionId, productId }),
      })
    },
    [state.sessionId],
  )

  const itemCount = state.items.reduce((sum, i) => sum + i.quantity, 0)
  const total = state.items.reduce((sum, i) => sum + i.price_clp * i.quantity, 0)

  return (
    <CartContext.Provider value={{ items: state.items, itemCount, total, loaded: state.loaded, addItem, updateQuantity, removeItem }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error("useCart must be used within a CartProvider")
  return ctx
}
