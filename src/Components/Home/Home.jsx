import React from "react";
import Hero from "./Hero";
import LatestProducts from "../LatestProducts/LatestProducts";

const latestProductPromise = fetch(
  "https://smart-deals-server-part2-indol.vercel.app/latest-products",
).then((res) => res.json());
const Home = () => {
  return (
    <div>
      {/* Hero section */}
      <Hero></Hero>
      {/* Latest Products */}
      <LatestProducts
        latestProductPromise={latestProductPromise}
      ></LatestProducts>
    </div>
  );
};

export default Home;
