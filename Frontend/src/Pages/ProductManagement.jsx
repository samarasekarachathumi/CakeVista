import React, { useState, useEffect } from 'react';

// Main CakeSellerDashboard component
const ProductManagement = () => {
  // States for products and form management
  const [products, setProducts] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch products on component mount (simulated)
  // useEffect(() => {
  //   // In a real app, this would be an API call
  //   const fetchProducts = async () => {
  //     // Simulate API delay
  //     await new Promise(resolve => setTimeout(resolve, 500));
      
  //     // Sample data
  //     const sampleProducts = [
  //       {
  //         id: 1,
  //         name: 'Chocolate Delight',
  //         description: 'Rich chocolate cake with chocolate ganache',
  //         price: 35.99,
  //         sizes: ['6"', '8"', '10"'],
  //         flavors: ['Chocolate', 'Dark Chocolate'],
  //         colors: ['Brown', 'Dark Brown'],
  //         imageUrls: ['https://placeholder.com/cakes/chocolate1.jpg'],
  //         additionalOptions: ['Birthday Message', 'Candles']
  //       },
  //       {
  //         id: 2,
  //         name: 'Vanilla Bean',
  //         description: 'Classic vanilla cake with vanilla bean frosting',
  //         price: 30.99,
  //         sizes: ['6"', '8"', '10"', '12"'],
  //         flavors: ['Vanilla', 'French Vanilla'],
  //         colors: ['White', 'Cream'],
  //         imageUrls: ['https://placeholder.com/cakes/vanilla1.jpg'],
  //         additionalOptions: ['Birthday Message', 'Sprinkles']
  //       }
  //     ];
      
  //     setProducts(sampleProducts);
  //   };
    
  //   fetchProducts();
  // }, []);

  // Filter products based on search term
  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Add a new product
  const handleAddProduct = (newProduct) => {
    // Generate a new ID (in a real app, the backend would handle this)
    const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
    
    const productToAdd = {
      ...newProduct,
      id: newId
    };
    
    setProducts([...products, productToAdd]);
    setShowAddForm(false);
  };

  // Update an existing product
  const handleUpdateProduct = (updatedProduct) => {
    setProducts(products.map(product => 
      product.id === updatedProduct.id ? updatedProduct : product
    ));
    setShowEditForm(false);
    setCurrentProduct(null);
  };

  // Delete a product
  const handleDeleteProduct = (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      setProducts(products.filter(product => product.id !== productId));
    }
  };

  // Open edit form for a product
  const openEditForm = (product) => {
    setCurrentProduct(product);
    setShowEditForm(true);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Cake Seller Dashboard</h1>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button 
            className="bg-[#E6A4B4] hover:bg-[#ce8395] text-white font-medium py-2 px-4 rounded-lg transition duration-200"
            onClick={() => setShowAddForm(true)}
          >
            Add New Cake
          </button>
        </div>
      </header>

      {/* Product listing */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Your Cake Products</h2>
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map(product => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onEdit={() => openEditForm(product)}
                onDelete={() => handleDeleteProduct(product.id)}
              />
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">
            {searchTerm ? 'No products match your search.' : 'No products yet. Add your first cake product!'}
          </p>
        )}
      </div>

      {/* Add product form modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-screen overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Add New Cake Product</h2>
              <ProductForm 
                onSubmit={handleAddProduct} 
                onCancel={() => setShowAddForm(false)} 
              />
            </div>
          </div>
        </div>
      )}

      {/* Edit product form modal */}
      {showEditForm && currentProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-screen overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Edit Cake Product</h2>
              <ProductForm 
                initialData={currentProduct}
                onSubmit={handleUpdateProduct} 
                onCancel={() => {
                  setShowEditForm(false);
                  setCurrentProduct(null);
                }} 
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Product Card Component
const ProductCard = ({ product, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 flex flex-col">
      <div className="h-48 bg-gray-200 relative">
        {product.imageUrls && product.imageUrls.length > 0 ? (
          <img 
            src={product.imageUrls[0]} 
            alt={product.name} 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            No Image Available
          </div>
        )}
      </div>
      
      <div className="p-4 flex-grow">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">{product.name}</h3>
        <p className="text-gray-600 mb-2 text-sm">{product.description}</p>
        <p className="text-blue-600 font-bold mb-4">${product.price.toFixed(2)}</p>
        
        <div className="space-y-3">
          <div>
            <h4 className="text-sm font-medium text-gray-700">Sizes:</h4>
            <div className="flex flex-wrap gap-1 mt-1">
              {product.sizes.map((size, index) => (
                <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                  {size}
                </span>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-gray-700">Flavors:</h4>
            <div className="flex flex-wrap gap-1 mt-1">
              {product.flavors.map((flavor, index) => (
                <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                  {flavor}
                </span>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-gray-700">Colors:</h4>
            <div className="flex flex-wrap gap-1 mt-1">
              {product.colors.map((color, index) => (
                <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                  {color}
                </span>
              ))}
            </div>
          </div>
          
          {product.additionalOptions && product.additionalOptions.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-700">Additional Options:</h4>
              <div className="flex flex-wrap gap-1 mt-1">
                {product.additionalOptions.map((option, index) => (
                  <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                    {option}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 flex justify-end space-x-2">
        <button 
          onClick={onEdit} 
          className="px-3 py-1 bg-[#E6A4B4] hover:bg-[#cf8b9c] text-white text-sm font-medium rounded transition duration-200"
        >
          Edit
        </button>
        <button 
          onClick={onDelete} 
          className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded transition duration-200"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

// Product Form Component for adding/editing products
const ProductForm = ({ initialData, onSubmit, onCancel }) => {
  const defaultProduct = {
    name: '',
    description: '',
    price: 0,
    sizes: [],
    flavors: [],
    colors: [],
    imageUrls: [],
    additionalOptions: []
  };

  const [formData, setFormData] = useState(initialData || defaultProduct);
  const [newSize, setNewSize] = useState('');
  const [newFlavor, setNewFlavor] = useState('');
  const [newColor, setNewColor] = useState('');
  const [newOption, setNewOption] = useState('');
  const [newImageUrl, setNewImageUrl] = useState('');

  // Handle basic input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'price' ? parseFloat(value) : value
    });
  };

  // Add a new size
  const addSize = () => {
    if (newSize.trim() && !formData.sizes.includes(newSize.trim())) {
      setFormData({
        ...formData,
        sizes: [...formData.sizes, newSize.trim()]
      });
      setNewSize('');
    }
  };

  // Remove a size
  const removeSize = (sizeToRemove) => {
    setFormData({
      ...formData,
      sizes: formData.sizes.filter(size => size !== sizeToRemove)
    });
  };

  // Add a new flavor
  const addFlavor = () => {
    if (newFlavor.trim() && !formData.flavors.includes(newFlavor.trim())) {
      setFormData({
        ...formData,
        flavors: [...formData.flavors, newFlavor.trim()]
      });
      setNewFlavor('');
    }
  };

  // Remove a flavor
  const removeFlavor = (flavorToRemove) => {
    setFormData({
      ...formData,
      flavors: formData.flavors.filter(flavor => flavor !== flavorToRemove)
    });
  };

  // Add a new color
  const addColor = () => {
    if (newColor.trim() && !formData.colors.includes(newColor.trim())) {
      setFormData({
        ...formData,
        colors: [...formData.colors, newColor.trim()]
      });
      setNewColor('');
    }
  };

  // Remove a color
  const removeColor = (colorToRemove) => {
    setFormData({
      ...formData,
      colors: formData.colors.filter(color => color !== colorToRemove)
    });
  };

  // Add a new additional option
  const addOption = () => {
    if (newOption.trim() && !formData.additionalOptions.includes(newOption.trim())) {
      setFormData({
        ...formData,
        additionalOptions: [...formData.additionalOptions, newOption.trim()]
      });
      setNewOption('');
    }
  };

  // Remove an additional option
  const removeOption = (optionToRemove) => {
    setFormData({
      ...formData,
      additionalOptions: formData.additionalOptions.filter(option => option !== optionToRemove)
    });
  };

  // Add a new image URL
  const addImageUrl = () => {
    if (newImageUrl.trim() && !formData.imageUrls.includes(newImageUrl.trim())) {
      setFormData({
        ...formData,
        imageUrls: [...formData.imageUrls, newImageUrl.trim()]
      });
      setNewImageUrl('');
    }
  };

  // Remove an image URL
  const removeImageUrl = (urlToRemove) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter(url => url !== urlToRemove)
    });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          Cake Name
        </label>
        <input
          id="name"
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          rows="3"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
          Price (Rs)
        </label>
        <input
          id="price"
          type="number"
          name="price"
          min="0"
          step="0.01"
          value={formData.price}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Images section */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Images
        </label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={newImageUrl}
            onChange={(e) => setNewImageUrl(e.target.value)}
            placeholder="Enter image URL"
            className="flex-grow px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button 
            type="button" 
            onClick={addImageUrl}
            className="bg-[#E6A4B4] hover:bg-[#b77484] text-white px-4 py-2 rounded-md transition duration-200"
          >
            Add
          </button>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {formData.imageUrls.map((url, index) => (
            <div key={index} className="bg-gray-100 rounded-full px-3 py-1 flex items-center text-sm">
              <span className="mr-1 truncate max-w-xs">{url}</span>
              <button 
                type="button" 
                onClick={() => removeImageUrl(url)}
                className="text-gray-500 hover:text-red-600 transition duration-200"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Sizes section */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Cake Sizes
        </label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={newSize}
            onChange={(e) => setNewSize(e.target.value)}
            placeholder='e.g. 500g", 1Kg", 1.5Kg'
            className="flex-grow px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button 
            type="button" 
            onClick={addSize}
            className="bg-[#E6A4B4] hover:bg-[#b77484] text-white px-4 py-2 rounded-md transition duration-200"
          >
            Add
          </button>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {formData.sizes.map((size, index) => (
            <div key={index} className="bg-gray-100 rounded-full px-3 py-1 flex items-center text-sm">
              <span className="mr-1">{size}</span>
              <button 
                type="button" 
                onClick={() => removeSize(size)}
                className="text-gray-500 hover:text-red-600 transition duration-200"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Flavors section */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Cake Flavors
        </label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={newFlavor}
            onChange={(e) => setNewFlavor(e.target.value)}
            placeholder="e.g. Chocolate, Vanilla, Strawberry"
            className="flex-grow px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button 
            type="button" 
            onClick={addFlavor}
            className="bg-[#E6A4B4] hover:bg-[#b77484] text-white px-4 py-2 rounded-md transition duration-200"
          >
            Add
          </button>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {formData.flavors.map((flavor, index) => (
            <div key={index} className="bg-gray-100 rounded-full px-3 py-1 flex items-center text-sm">
              <span className="mr-1">{flavor}</span>
              <button 
                type="button" 
                onClick={() => removeFlavor(flavor)}
                className="text-gray-500 hover:text-red-600 transition duration-200"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>

      

      {/* Additional options section */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Additional Options
        </label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={newOption}
            onChange={(e) => setNewOption(e.target.value)}
            placeholder=""
            className="flex-grow px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button 
            type="button" 
            onClick={addOption}
            className="bg-[#E6A4B4] hover:bg-[#b77484] text-white px-4 py-2 rounded-md transition duration-200"
          >
            Add
          </button>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {formData.additionalOptions.map((option, index) => (
            <div key={index} className="bg-gray-100 rounded-full px-3 py-1 flex items-center text-sm">
              <span className="mr-1">{option}</span>
              <button 
                type="button" 
                onClick={() => removeOption(option)}
                className="text-gray-500 hover:text-red-600 transition duration-200"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition duration-200"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-[#881f3a] hover:bg-[#b77484] text-white rounded-md transition duration-200"
        >
          {initialData ? 'Update Product' : 'Add Product'}
        </button>
      </div>
    </form>
  );
};

export default ProductManagement;