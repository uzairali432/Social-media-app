import React, { useEffect, useState } from "react";
import axios from "axios";
import LeftSidebar from "../../components/home/LeftSidebar";

const Marketplace = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios
      .get(`https://pixabay.com/api/?key=${import.meta.env.VITE_PIXABAY_API_KEY}&q=shopping&image_type=photo&per_page=12`)
      .then((res) => {
        setProducts(res.data.hits);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className="flex bg-gray-100 min-h-screen">
      
      <LeftSidebar />

      <div className="flex-1 p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Today's Picks</h1>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700">
            + Create Listing
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl shadow hover:shadow-lg transition p-2 cursor-pointer"
            >
              <img
                src={item.webformatURL}
                alt={item.tags}
                className="rounded-lg h-48 w-full object-cover"
              />
              <div className="p-2">
                <h3 className="font-semibold text-gray-800 text-sm truncate">
                  {item.tags.split(",")[0] || "Product"}
                </h3>
                <p className="text-gray-600 text-xs mt-1">Rs {Math.floor(Math.random() * 20000) + 1000}</p>
                <p className="text-gray-500 text-xs">Karachi, Pakistan</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Marketplace;
