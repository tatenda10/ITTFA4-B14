// src/components/Inventory.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BASE_URL } from '../../services/Api';

function Inventory() {
  const [inventory, setInventory] = useState([]);
  const [medicationName, setMedicationName] = useState('');
  const [stockLevel, setStockLevel] = useState('');
  const [expirationDate, setExpirationDate] = useState('');
  const [supplierName, setSupplierName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Define fetchInventory function
  const fetchInventory = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}/api/inventory`);
      setInventory(response.data);
      setError(null); // Clear previous errors if any
    } catch (err) {
      setError('Error fetching inventory items.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch inventory items from the API on component mount
  useEffect(() => {
    fetchInventory();
  }, []);

  // Function to handle adding a new item
  const handleAddItem = async (e) => {
    e.preventDefault();
    if (medicationName.trim() === '' || stockLevel.trim() === '' || expirationDate.trim() === '' || supplierName.trim() === '') {
      setError('Please fill in all fields.'); // Set an error message if fields are empty
      return;
    }

    const newItem = {
      medication_name: medicationName,
      stock_level: stockLevel,
      expiration_date: expirationDate,
      supplier_name: supplierName,
    };

    try {
      await axios.post(`${BASE_URL}/api/inventory`, newItem);
      fetchInventory(); // Refresh the inventory list after adding a new item
      setMedicationName(''); // Clear the form
      setStockLevel('');
      setExpirationDate('');
      setSupplierName('');
      setError(null); // Clear any previous errors
    } catch (err) {
      setError('Error adding new item.');
    }
  };

  // Function to handle deleting an item
  const handleDeleteItem = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/api/inventory/${id}`);
      fetchInventory(); // Refresh the inventory list after deleting an item
    } catch (err) {
      setError('Error deleting item.');
    }
  };

  return (
    <div className='ml-[20%] p-4'>
      <h1 className='text-2xl font-semibold mb-4'>Inventory Management</h1>

      {/* Display error message */}
      {error && <p className="text-red-500">{error}</p>}

      {/* Form to add new inventory items */}
      <form onSubmit={handleAddItem} className='mb-4'>
        <input
          type='text'
          value={medicationName}
          onChange={(e) => setMedicationName(e.target.value)}
          placeholder='Medication Name'
          className='p-2 border rounded mr-2'
        />
        <input
          type='number'
          value={stockLevel}
          onChange={(e) => setStockLevel(e.target.value)}
          placeholder='Stock Level'
          className='p-2 border rounded mr-2'
        />
        <input
          type='date'
          value={expirationDate}
          onChange={(e) => setExpirationDate(e.target.value)}
          className='p-2 border rounded mr-2'
        />
        <input
          type='text'
          value={supplierName}
          onChange={(e) => setSupplierName(e.target.value)}
          placeholder='Supplier Name'
          className='p-2 border rounded mr-2'
        />
        <button type='submit' className='bg-blue-500 text-white py-2 px-4 rounded'>
          Add Medication
        </button>
      </form>

      {/* Inventory List */}
      <div className='overflow-x-auto'>
        <table className='w-full border-collapse'>
          <thead>
            <tr className='bg-gray-200 text-left'>
              <th className='p-3'>Medication Name</th>
              <th className='p-3'>Stock Level</th>
              <th className='p-3'>Expiration Date</th>
              <th className='p-3'>Supplier Name</th>
              <th className='p-3'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {inventory.map((medication) => (
              <tr key={medication.medication_id} className='border-b'>
                <td className='p-3'>{medication.medication_name}</td>
                <td className='p-3'>{medication.stock_level}</td>
                <td className='p-3'>{medication.expiration_date}</td>
                <td className='p-3'>{medication.supplier_name}</td>
                <td className='p-3'>
                  <button
                    onClick={() => handleDeleteItem(medication.medication_id)}
                    className='bg-red-500 text-white py-2 px-4 rounded hover:bg-red-700'
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Loading indicator */}
      {loading && <p>Loading...</p>}
    </div>
  );
}

export default Inventory;
