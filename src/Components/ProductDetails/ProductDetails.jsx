import React, { use, useEffect, useRef, useState } from "react";
import { Link, useLoaderData } from "react-router";
import { AuthContext } from "../../context/AuthContext";
import Swal from "sweetalert2";
import axios from "axios";

const ProductDetails = () => {
  const { _id: productId } = useLoaderData();
  const [bids, setBids] = useState([]);
  const bidModalRef = useRef(null);
  const { user } = use(AuthContext);
  const product = useLoaderData();

  useEffect(() => {
    axios
      .get(
        `https://smart-deals-server-part2-indol.vercel.app/products/bids/${productId}`,
      )
      .then((data) => {
        console.log("after axios get", data);
      });
  }, [productId]);

  // useEffect(() => {
  //   fetch(`https://smart-deals-server-part2-indol.vercel.app/products/bids/${productId}`, {
  //     headers: {
  //       authorization: `Bearer ${user.accessToken}`,
  //     },
  //   })
  //     .then((res) => res.json())
  //     .then((data) => {
  //       console.log("bids for the product: ", data);
  //       data.sort((a, b) => parseInt(a.bid_price) - parseInt(b.bid_price));
  //       setBids(data);
  //     });
  // }, [productId, user]);

  const handleBidModalOpen = () => {
    bidModalRef.current.showModal();
  };

  const handleBidSubmit = (e) => {
    e.preventDefault();
    const name = e.target.name.value;
    const email = e.target.email.value;
    const bid = e.target.bid.value;
    console.log(productId, name, email, bid);

    const newBid = {
      product: productId,
      buyer_name: name,
      buyer_email: email,
      buyer_image: user.photoURL,
      bid_price: bid,
      status: "pending",
    };

    fetch("https://smart-deals-server-part2-indol.vercel.app/bids", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(newBid),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.insertedId) {
          bidModalRef.current.close();
          Swal.fire({
            title: "Your Bids Has Been Placed",
            icon: "success",
          });
          newBid._id = data.insertedId;
          const newBids = [...bids, newBid];
          newBids.sort((a, b) => parseInt(a.bid_price) - parseInt(b.bid_price));
          setBids(newBids);
        }
      });
  };

  return (
    <div className="bg-gray-100">
      {/* product info */}
      <div className="grid grid-cols-2 gap-6 py-4 w-11/12 mx-auto">
        <div className="pt-12">
          <img
            className="flex items-center rounded-lg h-[60%] w-full object-cover bg-center bg-cover"
            src={product.image}
            alt=""
          />
          {/* card  */}
          <div className="bg-white p-4 mt-6 rounded-md">
            <h2 class="text-[#0D1B3E] text-xl font-bold mb-6">
              Product Description
            </h2>

            <div class="flex justify-between items-center mb-3 text-sm">
              <p>
                <span class="text-[#7E57C2] font-medium">Condition :</span>
                <span class="text-[#0D1B3E] font-bold">
                  {product.condition}
                </span>
              </p>
              <p>
                <span class="text-[#7E57C2] font-medium">Usage Time :</span>
                <span class="text-[#0D1B3E] font-bold">{product.usage}</span>
              </p>
            </div>

            <hr class="border-t border-gray-300 mb-5" />

            <div class="text-gray-400 text-[13px] leading-relaxed space-y-4">
              <p>{product.description}</p>
            </div>
          </div>
        </div>

        <div className="pt-6">
          <div class="max-w-6xl mx-auto p-4 md:p-8 min-h-screen font-sans text-[#0D1B3E]">
            <div class="flex items-center gap-2 mb-6 cursor-pointer hover:opacity-70 transition-all">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="2.5"
                stroke="currentColor"
                class="w-4 h-4"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
                />
              </svg>
              <Link to={"/allProducts"} class="font-bold text-sm">
                Back To Products
              </Link>
            </div>

            <div class="mb-8">
              <h1 class="text-3xl md:text-5xl font-bold mb-4">
                {product.title}
              </h1>{" "}
              <span class="bg-[#E9E1FF] text-[#7E57C2] px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wide">
                {product.category}{" "}
              </span>
            </div>

            <div class="grid gap-6">
              <div class="lg:col-span-5 space-y-5">
                <div class="bg-white p-6 rounded-lg shadow-md">
                  <h3 class="text-[#4CAF50] text-3xl font-bold mb-1">
                    $ {product.price_min} - {product.price_max}
                  </h3>{" "}
                  <p class="text-gray-500 text-sm font-medium">
                    Price starts from
                  </p>
                </div>

                <div class="bg-white p-6 rounded-lg shadow-md ">
                  <h3 class="text-xl font-bold mb-6">Product Details</h3>
                  <div class="space-y-3 text-[15px]">
                    <p>
                      <span class="font-bold">Product ID:</span>{" "}
                      <span class="text-gray-600 ml-1">{product._id}</span>
                    </p>{" "}
                    <p>
                      <span class="font-bold">Posted:</span>{" "}
                      <span class="text-gray-600 ml-1">
                        {product.created_at}
                      </span>
                    </p>{" "}
                  </div>
                </div>

                <div class="bg-white p-6 rounded-lg shadow-md ">
                  <h3 class="text-xl font-bold mb-6">Seller Information</h3>

                  <div class="flex items-center gap-4 mb-6">
                    <div class="w-14 h-14 rounded-full bg-gray-200 overflow-hidden">
                      <img
                        src={product.seller_image}
                        alt="Seller"
                        class="w-full h-full object-cover"
                      />{" "}
                    </div>
                    <div>
                      <h4 class="font-bold text-lg">{product.seller_name}</h4>{" "}
                      <p class="text-gray-400 text-xs">{product.email}</p>{" "}
                    </div>
                  </div>

                  <div class="space-y-4 text-[15px]">
                    <p>
                      <span class="font-bold">Location:</span>{" "}
                      <span class="text-gray-600 ml-1">{product.location}</span>
                    </p>{" "}
                    <p>
                      <span class="font-bold">Contact:</span>{" "}
                      <span class="text-gray-600 ml-1">
                        {product.seller_contact}
                      </span>
                    </p>
                    <div class="flex items-center">
                      <span class="font-bold mr-3">Status:</span>
                      <span class="bg-[#FFC107] text-[#0D1B3E] text-[10px] font-extrabold px-3 py-1 rounded-full uppercase">
                        {product.status}
                      </span>
                    </div>
                  </div>
                </div>
                {/* button */}
                <button
                  onClick={handleBidModalOpen}
                  className="btn btn-primary w-full "
                >
                  I Want To Buy This Product
                </button>
              </div>
            </div>
          </div>

          {/* Modal */}
          <dialog
            ref={bidModalRef}
            className="modal modal-bottom sm:modal-middle"
          >
            <div className="modal-box">
              <h3 className="font-bold text-lg">
                Give Seller Your Offered Price
              </h3>

              <form onSubmit={handleBidSubmit}>
                <fieldset className="fieldset">
                  {/* name */}
                  <label className="label">Buyer Name</label>
                  <input
                    type="text"
                    className="input w-full"
                    name="name"
                    defaultValue={user?.displayName}
                    readOnly
                  />
                  {/* email */}
                  <label className="label">Buyer Email</label>
                  <input
                    type="email "
                    className="input w-full"
                    name="email"
                    defaultValue={user?.email}
                    readOnly
                  />
                  {/* place your price */}
                  <label className="label">Place Your Price</label>
                  <input type="text" className="input w-full" name="bid" />

                  <button className="btn btn-primary mt-4">Submit Bid</button>
                </fieldset>
              </form>

              <div className="modal-action">
                <form method="dialog">
                  {/* if there is a button in form, it will close the modal */}
                  <button className="btn">Close</button>
                </form>
              </div>
            </div>
          </dialog>
        </div>
      </div>

      {/* bids for the products */}
      <div className="w-11/12 mx-auto">
        <h2 className="text-4xl font-bold pt-16 pb-10">
          {" "}
          Bids For This Products:{" "}
          <span className="text-primary">{bids.length}</span>
        </h2>

        <div className="overflow-x-auto">
          <table className="table">
            {/* head */}
            <thead>
              <tr className="bg-gray-200">
                <th>SL No.</th>
                <th>Buyer Name</th>
                <th>Buyer Email</th>
                <th>Bid Price</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {/* row 1 */}
              {bids.map((bid, index) => (
                <tr>
                  <th>{index + 1}</th>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="avatar">
                        <div className="mask mask-squircle h-12 w-12">
                          <img
                            src="https://img.daisyui.com/images/profile/demo/2@94.webp"
                            alt="Avatar Tailwind CSS Component"
                          />
                        </div>
                      </div>
                      <div>
                        <div className="font-bold">{bid.buyer_name}</div>
                        <div className="text-sm opacity-50">United States</div>
                      </div>
                    </div>
                  </td>
                  <td>{bid.buyer_email}</td>
                  <td>$ {bid.bid_price}</td>
                  <th>
                    <button className="btn btn-ghost btn-xs">details</button>
                  </th>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
