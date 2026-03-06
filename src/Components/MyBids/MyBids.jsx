import React, { use, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import Swal from "sweetalert2";

const MyBids = () => {
  const { user } = use(AuthContext);
  const [bids, setBids] = useState([]);

  // console.log("access token", user.accessToken);

  useEffect(() => {
    if (user?.email) {
      fetch(`http://localhost:3000/bids?email=${user.email}`, {
        headers: {
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          if (Array.isArray(data)) {
            setBids(data);
          } else {
            setBids([]); // fallback to empty array
          }
          // setBids(data);
        });
    }
  }, [user]);

  // useEffect(() => {
  //   if (user?.email) {
  //     fetch(`http://localhost:3000/bids?email=${user.email}`, {
  //       headers: {
  //         authorization: `Bearer ${user.accessToken}`
  //       }
  //     })
  //       .then((res) => res.json())
  //       .then((data) => {
  //         console.log(data);

  //         setBids(data);
  //       });
  //   }
  // }, [user]);

  const handleDeleteBid = (_id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(`http://localhost:3000/bids/${_id}`, {
          method: "DELETE",
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.deletedCount) {
              Swal.fire({
                title: "Deleted!",
                text: "Your bids has been deleted.",
                icon: "success",
              });

              // show the delete immediate in ui
              const remainingBids = bids.filter((bid) => bid._id !== _id);
              setBids(remainingBids);
            }
          });
      }
    });
  };

  return (
    <div>
      <h3 className="text-center text-3xl font-bold mt-10 mb-5">
        My Bits: <span className="text-primary">{bids.length}</span>
      </h3>

      <div className="overflow-x-auto w-11/12 mx-auto">
        <table className="table">
          {/* head */}
          <thead className="bg-gray-200">
            <tr>
              <th>SL No.</th>
              <th>Product</th>
              <th>Seller</th>
              <th>Bid Price</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {bids.map((bid, index) => (
              <tr key={bid._id}>
                <td>{index + 1}</td>

                <td>
                  <div className="flex items-center gap-3">
                    <div className="avatar">
                      <div className="mask mask-squircle h-12 w-12">
                        <img
                          src="https://img.daisyui.com/images/profile/demo/5@94.webp"
                          alt="Avatar Tailwind CSS Component"
                        />
                      </div>
                    </div>
                    <div>
                      <div className="font-bold">{bid.buyer_name}</div>
                    </div>
                  </div>
                </td>

                <td>{bid.buyer_email}</td>

                <td>${bid.bid_price}</td>

                {bid.status === "pending" ? (
                  <div className="badge badge-warning pb-1 mt-6">
                    {bid.status}
                  </div>
                ) : (
                  <div className="badge badge-success pb-1 mt-6">
                    {bid.status}
                  </div>
                )}

                <th>
                  <button
                    onClick={() => handleDeleteBid(bid._id)}
                    className="btn btn-outline btn-xs text-[#FF3D00]"
                  >
                    Remove Bid
                  </button>
                </th>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyBids;
