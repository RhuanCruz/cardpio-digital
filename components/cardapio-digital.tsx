"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronDown, ShoppingCart, X, Menu } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { DialogFooter } from "@/components/ui/dialog"

type CardapioDigitalComponentProps = {
  onNavigate: (path: string) => void
}

const menuItems = [
  {
    id: 1,
    name: "Marmita Fit",
    price: "R$ 15,90",
    description: "Frango grelhado, arroz integral, feijão e legumes",
    image: "/images/marmita.png",
    category: "Marmitas"
  },
  {
    id: 2,
    name: "Marmita Tradicional",
    price: "R$ 14,90",
    description: "Arroz, feijão, bife e salada",
    image: "/images/marmita.png",
    category: "Marmitas"
  },
  {
    id: 3,
    name: "X-Burger",
    price: "R$ 12,50",
    description: "Pão, hambúrguer, queijo, alface e tomate",
    image: "/images/lanche.png",
    category: "Lanches"
  },
  {
    id: 4,
    name: "X-Salada",
    price: "R$ 13,50",
    description: "Pão, hambúrguer, queijo, alface, tomate e maionese",
    image: "/images/lanche.png",
    category: "Lanches"
  },
  {
    id: 5,
    name: "Coxinha",
    price: "R$ 5,00",
    description: "Massa de batata recheada com frango",
    image: "/images/coxinha.png",
    category: "Salgados"
  },
  {
    id: 6,
    name: "Pastel de Carne",
    price: "R$ 6,00",
    description: "Massa crocante recheada com carne moída",
    image: "/images/pastel.png",
    category: "Salgados"
  },
  {
    id: 7,
    name: "Brigadeiro",
    price: "R$ 3,00",
    description: "Chocolate, leite condensado e granulado",
    image: "/images/brigadeiro.png",
    category: "Doces"
  },
  {
    id: 8,
    name: "Pudim",
    price: "R$ 5,00",
    description: "Leite condensado, leite e ovos",
    image: "/images/pudim.png",
    category: "Doces"
  },
  {
    id: 9,
    name: "Refrigerante",
    price: "R$ 5,00",
    description: "Lata 350ml",
    image: "/images/coca.png",
    category: "Bebidas"
  },
  {
    id: 10,
    name: "Suco Natural",
    price: "R$ 7,00",
    description: "Copo 300ml",
    image: "/images/suco.png",
    category: "Bebidas"
  },
]

const categories = ["Todos", "Marmitas", "Lanches", "Salgados", "Doces", "Bebidas"]

type CartItem = {
  item: typeof menuItems[0]
  quantity: number
  preference: string
}

export function CardapioDigitalComponent({ onNavigate }: CardapioDigitalComponentProps) {
  const [selectedCategory, setSelectedCategory] = useState("Todos")
  const [cart, setCart] = useState<CartItem[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isAddToCartDialogOpen, setIsAddToCartDialogOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<typeof menuItems[0] | null>(null)
  const [preference, setPreference] = useState("")
  const [orders, setOrders] = useState<Array<{ id: string, items: CartItem[], total: number, status: 'pendente' | 'preparando' | 'pronto', tableNumber: string, createdAt: number }>>([])
  const [tableNumber, setTableNumber] = useState("")
  const [isFinalizingOrder, setIsFinalizingOrder] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    const savedOrders = localStorage.getItem('orders')
    if (savedOrders) {
      setOrders(JSON.parse(savedOrders))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('orders', JSON.stringify(orders))
  }, [orders])

  const filteredCategories = selectedCategory === "Todos"
    ? categories.slice(1)
    : [selectedCategory]

  const openAddToCartDialog = (item: typeof menuItems[0]) => {
    setSelectedItem(item)
    setPreference("")
    setIsAddToCartDialogOpen(true)
  }

  const addToCart = () => {
    if (!selectedItem) return

    setCart(currentCart => {
      const existingItem = currentCart.find(cartItem => cartItem.item.id === selectedItem.id)
      if (existingItem) {
        return currentCart.map(cartItem =>
          cartItem.item.id === selectedItem.id
            ? { ...cartItem, quantity: cartItem.quantity + 1, preference: preference || cartItem.preference }
            : cartItem
        )
      } else {
        return [...currentCart, { item: selectedItem, quantity: 1, preference }]
      }
    })

    setIsAddToCartDialogOpen(false)
    setSelectedItem(null)
    setPreference("")
  }

  const totalItems = cart.reduce((total, item) => total + item.quantity, 0)
  const totalPrice = cart.reduce((total, { item, quantity }) => total + parseFloat(item.price.replace('R$ ', '').replace(',', '.')) * quantity, 0)

  const removeFromCart = (itemId: number) => {
    setCart(currentCart => currentCart.filter(cartItem => cartItem.item.id !== itemId))
  }

  const openFinalizeOrderDialog = () => {
    if (cart.length === 0) {
      alert('Seu carrinho está vazio!')
      return
    }
    setIsFinalizingOrder(true)
  }

  const finalizePedido = () => {
    if (!tableNumber) {
      alert('Por favor, informe o número da mesa.')
      return
    }

    const newOrder = {
      id: Date.now().toString(),
      items: [...cart],
      total: totalPrice,
      status: 'pendente' as const,
      tableNumber: tableNumber,
      createdAt: Date.now() // Adicionando o timestamp de criação
    }

    setOrders(prevOrders => [...prevOrders, newOrder])
    setCart([])
    setIsCartOpen(false)
    setIsFinalizingOrder(false)
    setTableNumber("")
    alert('Pedido finalizado com sucesso!')
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="sticky top-0 z-50 bg-white shadow-md w-full">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl md:text-2xl font-bold">Cardápio Digital</h1>
            <div className="flex items-center space-x-2 md:space-x-4">
              <Dialog open={isCartOpen} onOpenChange={setIsCartOpen}>
                <DialogTrigger asChild>
                  <div className="relative cursor-pointer">
                    <ShoppingCart className="h-6 w-6" />
                    {totalItems > 0 && (
                      <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                        {totalItems}
                      </span>
                    )}
                  </div>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Seu Carrinho</DialogTitle>
                  </DialogHeader>
                  <div className="mt-4">
                    {cart.length === 0 ? (
                      <p>Seu carrinho está vazio.</p>
                    ) : (
                      <>
                        {cart.map(({ item, quantity, preference }) => (
                          <div key={item.id} className="flex flex-col mb-4 pb-4 border-b">
                            <div className="flex justify-between items-center">
                              <span>{item.name} x {quantity}</span>
                              <div className="flex items-center">
                                <span className="mr-2">R$ {(parseFloat(item.price.replace('R$ ', '').replace(',', '.')) * quantity).toFixed(2)}</span>
                                <Button variant="ghost" size="sm" onClick={() => removeFromCart(item.id)}>
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                            {preference && (
                              <span className="text-sm text-gray-600 mt-1">Preferência: {preference}</span>
                            )}
                          </div>
                        ))}
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <div className="flex justify-between items-center font-bold">
                            <span>Total:</span>
                            <span>R$ {totalPrice.toFixed(2)}</span>
                          </div>
                        </div>
                        <Button className="w-full mt-4" onClick={openFinalizeOrderDialog}>Finalizar Pedido</Button>
                      </>
                    )}
                  </div>
                </DialogContent>
              </Dialog>
              <Button className="hidden md:block" onClick={() => onNavigate('/gerenciar-pedidos')}>
                Gerenciar Pedidos
              </Button>
              <Button variant="ghost" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                <Menu className="h-6 w-6" />
              </Button>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full md:w-[200px] justify-between">
                  {selectedCategory}
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-full md:w-[200px]">
                {categories.map((category) => (
                  <DropdownMenuItem 
                    key={category}
                    onSelect={() => setSelectedCategory(category)}
                  >
                    {category}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          {isMenuOpen && (
            <div className="mt-4 md:hidden">
              <Button className="w-full" onClick={() => {
                onNavigate('/gerenciar-pedidos')
                setIsMenuOpen(false)
              }}>
                Gerenciar Pedidos
              </Button>
            </div>
          )}
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">
        {filteredCategories.map((category) => (
          <section key={category} className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">{category}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {menuItems
                .filter(item => item.category === category)
                .map((item) => (
                  <Card key={item.id} className="overflow-hidden">
                    <CardHeader className="p-0">
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={400}
                        height={300}
                        quality={90}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="w-full h-48 object-cover"
                      />
                    </CardHeader>
                    <CardContent className="p-4">
                      <CardTitle className="flex justify-between items-center mb-2">
                        <span>{item.name}</span>
                        <span className="text-green-600 font-bold">{item.price}</span>
                      </CardTitle>
                      <p className="text-gray-600 text-sm">{item.description}</p>
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full" onClick={() => openAddToCartDialog(item)}>
                        Adicionar ao Carrinho
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
            </div>
          </section>
        ))}
      </main>

      {/* Novo Diálogo para Adicionar ao Carrinho */}
      <Dialog open={isAddToCartDialogOpen} onOpenChange={setIsAddToCartDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar ao Carrinho</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <Label htmlFor="preference">Alguma preferência?</Label>
            <Input
              id="preference"
              value={preference}
              onChange={(e) => setPreference(e.target.value)}
              placeholder="Ex: Sem cebola, bem passado, etc."
            />
          </div>
          <DialogFooter>
            <Button onClick={addToCart}>Adicionar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Novo Diálogo para Finalizar Pedido */}
      <Dialog open={isFinalizingOrder} onOpenChange={setIsFinalizingOrder}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Finalizar Pedido</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <Label htmlFor="tableNumber">Número da Mesa</Label>
            <Input
              id="tableNumber"
              value={tableNumber}
              onChange={(e) => setTableNumber(e.target.value)}
              placeholder="Informe o número da mesa"
            />
          </div>
          <DialogFooter>
            <Button onClick={finalizePedido}>Confirmar Pedido</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
