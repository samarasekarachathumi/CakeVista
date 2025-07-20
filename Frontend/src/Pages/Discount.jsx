import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { toast } from 'react-toastify';
// import { discountService } from '../../services/api/discountservice';

const Discount = () => {
  const [discounts, setDiscounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDiscount, setSelectedDiscount] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    value: 0,
    start_date: '',
    end_date: '',
    description: '',
    code: '',
    usage_limit: 0,
  });

  useEffect(() => {
    fetchDiscounts();
  }, []);

  const fetchDiscounts = async () => {
    try {
      setLoading(true);
      const data = await discountService.getDiscounts();
      setDiscounts(data);
    } catch (error) {
      toast.error('Failed to fetch discounts');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedDiscount) {
        await discountService.updateDiscount(selectedDiscount.id, formData);
        toast.success('Discount updated');
      } else {
        await discountService.createDiscount(formData);
        toast.success('Discount created');
      }
      setIsModalOpen(false);
      fetchDiscounts();
      resetForm();
    } catch (error) {
      toast.error('Failed to process');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this discount?')) {
      try {
        await discountService.deleteDiscount(id);
        toast.success('Deleted successfully');
        fetchDiscounts();
      } catch (error) {
        toast.error('Delete failed');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      value: 0,
      start_date: '',
      end_date: '',
      description: '',
      code: '',
      usage_limit: 0,
    });
    setSelectedDiscount(null);
  };

  return (
    <div className="p-4 max-w-xl mx-auto bg-white rounded shadow">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-lg font-bold">Discounts</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1 bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
        >
          <Plus size={16} /> Add
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <div className="space-y-3">
          {discounts.map((discount) => (
            <div key={discount.id} className="bg-gray-50 p-3 rounded shadow flex justify-between items-center">
              <div>
                <h3 className="font-medium text-md">{discount.name}</h3>
                <p className="text-xs text-gray-600">{discount.description}</p>
                <div className="mt-1 text-xs text-gray-600">
                  <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded">{discount.code}</span>
                  <span className="ml-2">{discount.value}% off</span>
                </div>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => {
                    setSelectedDiscount(discount);
                    setFormData(discount);
                    setIsModalOpen(true);
                  }}
                  className="p-1 text-gray-600 hover:text-green-500"
                >
                  <Edit size={16} />
                </button>
                <button
                  onClick={() => handleDelete(discount.id)}
                  className="p-1 text-gray-600 hover:text-red-600"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded p-4 w-full max-w-sm">
            <h2 className="text-lg font-bold mb-3">
              {selectedDiscount ? 'Edit Discount' : 'New Discount'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              {Object.keys(formData).map((key) => (
                <div key={key}>
                  <label className="block text-xs font-medium text-gray-700">
                    {key.replace('_', ' ').toUpperCase()}
                  </label>
                  <input
                    type={key.includes('date') ? 'datetime-local' : typeof formData[key] === 'number' ? 'number' : 'text'}
                    value={formData[key]}
                    onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                    className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 text-sm"
                    required
                  />
                </div>
              ))}
              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    resetForm();
                  }}
                  className="px-3 py-1 text-xs font-medium text-gray-700 bg-gray-100 rounded hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1 text-xs font-medium text-white bg-green-500 rounded hover:bg-green-600"
                >
                  {selectedDiscount ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Discount;