import React, { useEffect, useState } from "react";
import Product from "../Product/Product";

const AllProducts = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch("https://smart-deals-server-part2-indol.vercel.app/products")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
      });
  }, []);
  return (
    <div className="p-20 bg-gray-100">
      <h2 className="text-4xl font-bold text-center mt-6 mb-10">
        All <span className="text-primary">Product</span>
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mx-auto">
        {products.map((product) => (
          <Product key={product._id} product={product}></Product>
        ))}
      </div>
    </div>
  );
};

export default AllProducts;
