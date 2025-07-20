import React, { useState, useEffect } from "react";

const CustomerManagement= () => {
  const [customers, setCustomers] = useState([]);

  // Dummy data (Replace this with actual API call)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("https://your-backend-api.com/customers");
        const data = await response.json();
        setCustomers(data);
      } catch (error) {
        console.error("Error fetching customers:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="p-4 bg-white shadow rounded-lg">
      <h2 className="text-xl font-bold mb-4">Customer List</h2>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Name</th>
            <th className="border p-2">Email</th>
            <th className="border p-2">Phone Number</th>
          </tr>
        </thead>
        <tbody>
          {customers.length > 0 ? (
            customers.map((customer) => (
              <tr key={customer.id} className="text-center border">
                <td className="border p-2">{customer.name}</td>
                <td className="border p-2">{customer.email}</td>
                <td className="border p-2">{customer.phone}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="text-center p-4">No Customers Found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CustomerManagement;
