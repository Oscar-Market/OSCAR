
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ShoppingCart, Filter, Star, Cpu, Zap, Award, Heart, Plus, Minus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Toaster } from '@/components/ui/toaster';
import { toast } from '@/components/ui/use-toast';

const processors = [
  {
    id: 1,
    name: "Intel Core i9-13900K",
    brand: "Intel",
    price: 589,
    originalPrice: 649,
    cores: 24,
    threads: 32,
    baseFreq: "3.0 GHz",
    boostFreq: "5.8 GHz",
    socket: "LGA1700",
    rating: 4.8,
    reviews: 1247,
    category: "high-end",
    features: ["Overclocking", "DDR5", "PCIe 5.0"],
    description: "El procesador más potente de Intel para gaming y creación de contenido"
  },
  {
    id: 2,
    name: "AMD Ryzen 9 7950X",
    brand: "AMD",
    price: 699,
    originalPrice: 799,
    cores: 16,
    threads: 32,
    baseFreq: "4.5 GHz",
    boostFreq: "5.7 GHz",
    socket: "AM5",
    rating: 4.9,
    reviews: 892,
    category: "high-end",
    features: ["Zen 4", "DDR5", "PCIe 5.0"],
    description: "Rendimiento excepcional para workstations y gaming extremo"
  },
  {
    id: 3,
    name: "Intel Core i7-13700K",
    brand: "Intel",
    price: 409,
    originalPrice: 459,
    cores: 16,
    threads: 24,
    baseFreq: "3.4 GHz",
    boostFreq: "5.4 GHz",
    socket: "LGA1700",
    rating: 4.7,
    reviews: 2156,
    category: "mid-range",
    features: ["Overclocking", "DDR5", "PCIe 5.0"],
    description: "Equilibrio perfecto entre rendimiento y precio"
  },
  {
    id: 4,
    name: "AMD Ryzen 7 7800X3D",
    brand: "AMD",
    price: 449,
    originalPrice: 499,
    cores: 8,
    threads: 16,
    baseFreq: "4.2 GHz",
    boostFreq: "5.0 GHz",
    socket: "AM5",
    rating: 4.9,
    reviews: 1834,
    category: "gaming",
    features: ["3D V-Cache", "Gaming Optimized", "DDR5"],
    description: "El mejor procesador para gaming con tecnología 3D V-Cache"
  },
  {
    id: 5,
    name: "Intel Core i5-13600K",
    brand: "Intel",
    price: 319,
    originalPrice: 359,
    cores: 14,
    threads: 20,
    baseFreq: "3.5 GHz",
    boostFreq: "5.1 GHz",
    socket: "LGA1700",
    rating: 4.6,
    reviews: 3421,
    category: "mid-range",
    features: ["Overclocking", "DDR5", "Value"],
    description: "Excelente opción para gaming y productividad"
  },
  {
    id: 6,
    name: "AMD Ryzen 5 7600X",
    brand: "AMD",
    price: 299,
    originalPrice: 329,
    cores: 6,
    threads: 12,
    baseFreq: "4.7 GHz",
    boostFreq: "5.3 GHz",
    socket: "AM5",
    rating: 4.5,
    reviews: 1567,
    category: "budget",
    features: ["Zen 4", "DDR5", "Efficient"],
    description: "Rendimiento sólido para gaming 1080p y 1440p"
  }
];

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const savedCart = localStorage.getItem('processorCart');
    const savedFavorites = localStorage.getItem('processorFavorites');
    
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('processorCart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('processorFavorites', JSON.stringify(favorites));
  }, [favorites]);

  const filteredProcessors = processors
    .filter(processor => 
      processor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      processor.brand.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(processor => selectedBrand === 'all' || processor.brand === selectedBrand)
    .filter(processor => selectedCategory === 'all' || processor.category === selectedCategory)
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        case 'name':
        default:
          return a.name.localeCompare(b.name);
      }
    });

  const addToCart = (processor) => {
    const existingItem = cart.find(item => item.id === processor.id);
    if (existingItem) {
      setCart(cart.map(item => 
        item.id === processor.id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { ...processor, quantity: 1 }]);
    }
    toast({
      title: "¡Agregado al carrito!",
      description: `${processor.name} se añadió correctamente`,
    });
  };

  const removeFromCart = (processorId) => {
    setCart(cart.filter(item => item.id !== processorId));
    toast({
      title: "Producto eliminado",
      description: "El producto se eliminó del carrito",
    });
  };

  const updateQuantity = (processorId, newQuantity) => {
    if (newQuantity === 0) {
      removeFromCart(processorId);
      return;
    }
    setCart(cart.map(item => 
      item.id === processorId 
        ? { ...item, quantity: newQuantity }
        : item
    ));
  };

  const toggleFavorite = (processorId) => {
    if (favorites.includes(processorId)) {
      setFavorites(favorites.filter(id => id !== processorId));
      toast({
        title: "Eliminado de favoritos",
        description: "El producto se eliminó de tus favoritos",
      });
    } else {
      setFavorites([...favorites, processorId]);
      toast({
        title: "¡Agregado a favoritos!",
        description: "El producto se añadió a tus favoritos",
      });
    }
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <motion.header 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="sticky top-0 z-50 bg-black/20 backdrop-blur-lg border-b border-white/10"
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <motion.div 
              className="flex items-center space-x-3"
              whileHover={{ scale: 1.05 }}
            >
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Cpu className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">ProcessorHub</h1>
                <p className="text-sm text-gray-300">Tu tienda de procesadores</p>
              </div>
            </motion.div>

            <div className="flex items-center space-x-4">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowCart(true)}
                className="relative p-3 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
              >
                <ShoppingCart className="w-6 h-6 text-white" />
                {getTotalItems() > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold"
                  >
                    {getTotalItems()}
                  </motion.span>
                )}
              </motion.button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative py-20 overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center">
            <motion.h2 
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-5xl md:text-7xl font-bold text-white mb-6"
            >
              Procesadores de
              <span className="text-gradient block">Última Generación</span>
            </motion.h2>
            <motion.p 
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto"
            >
              Descubre el poder de los procesadores más avanzados del mercado. Intel y AMD al mejor precio.
            </motion.p>
            
            {/* Search Bar */}
            <motion.div 
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="max-w-2xl mx-auto relative"
            >
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Buscar procesadores..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </motion.div>
          </div>
        </div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-blue-500/20 rounded-full floating"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-purple-500/20 rounded-full floating" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-pink-500/20 rounded-full floating" style={{ animationDelay: '2s' }}></div>
      </motion.section>

      {/* Filters */}
      <motion.section 
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="container mx-auto px-4 py-8"
      >
        <div className="flex flex-wrap gap-4 items-center justify-between mb-8">
          <Button
            onClick={() => setShowFilters(!showFilters)}
            variant="outline"
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            <Filter className="w-4 h-4 mr-2" />
            Filtros
          </Button>
          
          <div className="flex flex-wrap gap-4">
            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Todas las marcas</option>
              <option value="Intel">Intel</option>
              <option value="AMD">AMD</option>
            </select>
            
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Todas las categorías</option>
              <option value="high-end">Gama Alta</option>
              <option value="mid-range">Gama Media</option>
              <option value="gaming">Gaming</option>
              <option value="budget">Económicos</option>
            </select>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="name">Ordenar por nombre</option>
              <option value="price-low">Precio: menor a mayor</option>
              <option value="price-high">Precio: mayor a menor</option>
              <option value="rating">Mejor valorados</option>
            </select>
          </div>
        </div>
      </motion.section>

      {/* Products Grid */}
      <section className="container mx-auto px-4 py-8">
        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence>
            {filteredProcessors.map((processor, index) => (
              <motion.div
                key={processor.id}
                layout
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ delay: index * 0.1 }}
                className="group relative"
              >
                <div className="gradient-card rounded-2xl p-6 hover-lift glow-effect">
                  {/* Discount Badge */}
                  {processor.originalPrice > processor.price && (
                    <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold z-10">
                      -{Math.round(((processor.originalPrice - processor.price) / processor.originalPrice) * 100)}%
                    </div>
                  )}
                  
                  {/* Favorite Button */}
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => toggleFavorite(processor.id)}
                    className="absolute top-4 right-4 p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors z-10"
                  >
                    <Heart 
                      className={`w-5 h-5 ${favorites.includes(processor.id) ? 'text-red-500 fill-current' : 'text-white'}`} 
                    />
                  </motion.button>

                  {/* Processor Image */}
                  <div className="relative mb-6 h-48 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl flex items-center justify-center overflow-hidden">
                    <img  
                      className="w-32 h-32 object-contain"
                      alt={`${processor.name} processor`}
                     src="https://images.unsplash.com/photo-1694444070793-13db645409f4" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  </div>

                  {/* Brand Badge */}
                  <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold mb-3 ${
                    processor.brand === 'Intel' 
                      ? 'bg-blue-500/20 text-blue-300' 
                      : 'bg-red-500/20 text-red-300'
                  }`}>
                    <Cpu className="w-3 h-3 mr-1" />
                    {processor.brand}
                  </div>

                  {/* Product Info */}
                  <h3 className="text-xl font-bold text-white mb-2">{processor.name}</h3>
                  <p className="text-gray-300 text-sm mb-4">{processor.description}</p>

                  {/* Specs */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-white/5 rounded-lg p-3">
                      <p className="text-xs text-gray-400">Núcleos/Hilos</p>
                      <p className="text-white font-bold">{processor.cores}/{processor.threads}</p>
                    </div>
                    <div className="bg-white/5 rounded-lg p-3">
                      <p className="text-xs text-gray-400">Frecuencia</p>
                      <p className="text-white font-bold">{processor.boostFreq}</p>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {processor.features.slice(0, 2).map((feature, idx) => (
                      <span 
                        key={idx}
                        className="px-2 py-1 bg-purple-500/20 text-purple-300 text-xs rounded-full"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>

                  {/* Rating */}
                  <div className="flex items-center mb-4">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-4 h-4 ${i < Math.floor(processor.rating) ? 'text-yellow-400 fill-current' : 'text-gray-600'}`} 
                        />
                      ))}
                    </div>
                    <span className="text-white ml-2 text-sm">{processor.rating}</span>
                    <span className="text-gray-400 ml-1 text-sm">({processor.reviews})</span>
                  </div>

                  {/* Price */}
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      {processor.originalPrice > processor.price && (
                        <span className="text-gray-400 line-through text-sm">${processor.originalPrice}</span>
                      )}
                      <span className="text-2xl font-bold text-white ml-2">${processor.price}</span>
                    </div>
                  </div>

                  {/* Add to Cart Button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => addToCart(processor)}
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-xl font-bold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 flex items-center justify-center space-x-2"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    <span>Agregar al Carrito</span>
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredProcessors.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-white mb-2">No se encontraron procesadores</h3>
            <p className="text-gray-400">Intenta ajustar tus filtros de búsqueda</p>
          </motion.div>
        )}
      </section>

      {/* Shopping Cart Modal */}
      <AnimatePresence>
        {showCart && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowCart(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gray-900 rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Carrito de Compras</h2>
                <button
                  onClick={() => setShowCart(false)}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors"
                >
                  <X className="w-6 h-6 text-white" />
                </button>
              </div>

              {cart.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingCart className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400 text-lg">Tu carrito está vacío</p>
                </div>
              ) : (
                <>
                  <div className="space-y-4 mb-6">
                    {cart.map((item) => (
                      <motion.div
                        key={item.id}
                        layout
                        className="flex items-center space-x-4 bg-white/5 rounded-xl p-4"
                      >
                        <div className="w-16 h-16 bg-gray-800 rounded-lg flex items-center justify-center">
                          <Cpu className="w-8 h-8 text-gray-400" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-white font-bold">{item.name}</h3>
                          <p className="text-gray-400 text-sm">${item.price} c/u</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-1 hover:bg-white/10 rounded-full transition-colors"
                          >
                            <Minus className="w-4 h-4 text-white" />
                          </button>
                          <span className="text-white font-bold w-8 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-1 hover:bg-white/10 rounded-full transition-colors"
                          >
                            <Plus className="w-4 h-4 text-white" />
                          </button>
                        </div>
                        <div className="text-right">
                          <p className="text-white font-bold">${item.price * item.quantity}</p>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-red-400 hover:text-red-300 text-sm"
                          >
                            Eliminar
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  <div className="border-t border-white/10 pt-6">
                    <div className="flex items-center justify-between mb-6">
                      <span className="text-xl text-white">Total:</span>
                      <span className="text-2xl font-bold text-white">${getTotalPrice()}</span>
                    </div>
                    <Button className="w-full bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white py-3 text-lg font-bold">
                      Proceder al Pago
                    </Button>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="bg-black/20 backdrop-blur-lg border-t border-white/10 mt-20">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Cpu className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold text-white">ProcessorHub</span>
              </div>
              <p className="text-gray-400">Tu tienda de confianza para procesadores de última generación.</p>
            </div>
            
            <div>
              <span className="text-white font-bold mb-4 block">Productos</span>
              <div className="space-y-2">
                <p className="text-gray-400 hover:text-white cursor-pointer transition-colors">Procesadores Intel</p>
                <p className="text-gray-400 hover:text-white cursor-pointer transition-colors">Procesadores AMD</p>
                <p className="text-gray-400 hover:text-white cursor-pointer transition-colors">Gaming</p>
                <p className="text-gray-400 hover:text-white cursor-pointer transition-colors">Workstation</p>
              </div>
            </div>
            
            <div>
              <span className="text-white font-bold mb-4 block">Soporte</span>
              <div className="space-y-2">
                <p className="text-gray-400 hover:text-white cursor-pointer transition-colors">Centro de Ayuda</p>
                <p className="text-gray-400 hover:text-white cursor-pointer transition-colors">Garantías</p>
                <p className="text-gray-400 hover:text-white cursor-pointer transition-colors">Devoluciones</p>
                <p className="text-gray-400 hover:text-white cursor-pointer transition-colors">Contacto</p>
              </div>
            </div>
            
            <div>
              <span className="text-white font-bold mb-4 block">Empresa</span>
              <div className="space-y-2">
                <p className="text-gray-400 hover:text-white cursor-pointer transition-colors">Sobre Nosotros</p>
                <p className="text-gray-400 hover:text-white cursor-pointer transition-colors">Términos</p>
                <p className="text-gray-400 hover:text-white cursor-pointer transition-colors">Privacidad</p>
                <p className="text-gray-400 hover:text-white cursor-pointer transition-colors">Blog</p>
              </div>
            </div>
          </div>
          
          <div className="border-t border-white/10 mt-8 pt-8 text-center">
            <p className="text-gray-400">© 2024 ProcessorHub. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>

      <Toaster />
    </div>
  );
}

export default App;
