import Loading from "@/components/Loading.jsx";
import { Button } from "@/components/ui/button.jsx";
import { server } from "@/main";
import Cookies from "js-cookie";
import axios from "axios";
import { Trash, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog.jsx";
import { Input } from "@/components/ui/input.jsx";

const Checkout = () => {
  const [address, setAddress] = useState([]);
  const [loading, setLoading] = useState(true);

  const [updating, setUpdating] = useState(false);

  async function fetchAddress(showLoader = false) {
    if (showLoader) setLoading(true);
    try {
      const { data } = await axios.get(`${server}/api/address/all`, {
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      });

      setAddress(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  const [editingAddressId, setEditingAddressId] = useState(null);

const fetchPincodeDetails = async (
  pin,
  isEdit = false
) => {

  if (pin.length !== 6) return;

  try {

    const { data } = await axios.get(
      `${server}/api/address/pincode/${pin}`
    );

    if (isEdit) {

      setEditAddress((prev) => ({
        ...prev,
        city: data.city,
        state: data.state,
      }));

    } else {

      setNewAddress((prev) => ({
        ...prev,
        city: data.city,
        state: data.state,
      }));
    }

  } catch (error) {

    console.log(error);

  }
};
  const [editAddress, setEditAddress] = useState({
  firstName: "",
  lastName: "",

  phone: "",

  address1: "",
  address2: "",

  landmark: "",

  city: "",
  state: "",

  pincode: "",

  type: "Home",
});
  const [newAddress, setNewAddress] = useState({
  firstName: "",
  lastName: "",

  phone: "",

  address1: "",
  address2: "",

  landmark: "",

  city: "",
  state: "",

  pincode: "",

  type: "Home",
});

  const handleAddAddress = async () => {
    try {
      const { data } = await axios.post(`${server}/api/address/new`,
      newAddress,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        },
      );

      if (data.message) {

      toast.success(data.message);
    
      await fetchAddress();
    
      setNewAddress({
        firstName: "",
        lastName: "",
    
        phone: "",
    
        address1: "",
        address2: "",
    
        landmark: "",
    
        city: "",
        state: "",
    
        pincode: "",
    
        type: "Home",
      });
    
      setModalOpen(false);
    }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const handleEditAddress = async () => {
    setUpdating(true);

    try {
      const { data } = await axios.put(`${server}/api/address/${editingAddressId}`,
      editAddress,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        },
      );

      toast.success(data.message);

      await fetchAddress();

      setEditModalOpen(false);

      setEditingAddressId(null);
    } catch (error) {
      toast.error(error.response?.data?.message || "Update failed");
    } finally {
      setUpdating(false);
    }
  };

  useEffect(() => {
    fetchAddress(true);
  }, []);

  const deleteHandler = async (id) => {
    if (confirm("Are you sure, you want to delete this address ")) {
      try {
        const { data } = await axios.delete(`${server}/api/address/${id}`, {
          headers: {
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        });

        toast.success(data.message);
        await fetchAddress();
      } catch (error) {
        toast.error(error.response.data.message);
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 min-h-[60vh]">
      <h1 className="text-3xl font-bold mb-6 text-center">Checkout</h1>
      {loading ? (
        <Loading />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {address && address.length > 0 ? (
            address.map((e) => (
              <div
            key={e._id}
            className="
            border rounded-2xl p-5
            bg-background
            hover:shadow-xl
            hover:border-primary
            transition-all duration-300
            space-y-4
            "
          >
          
            <div className="flex items-start justify-between gap-4">
          
              <div className="space-y-1">
          
                <div className="flex items-center gap-2">
          
                  <h3 className="font-bold text-lg">
                    {e.firstName} {e.lastName}
                  </h3>
          
                  <span
                    className="
                    text-xs px-3 py-1 rounded-full
                    bg-primary text-primary-foreground
                    "
                  >
                    {e.type}
                  </span>
          
                </div>
          
                <p className="text-sm text-muted-foreground">
                  +91 {e.phone}
                </p>
          
              </div>
          
              <div className="flex gap-2">
          
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
          
                    setEditingAddressId(e._id);
          
                    setEditAddress({
                      firstName: e.firstName || "",
                      lastName: e.lastName || "",
          
                      phone: e.phone || "",
          
                      address1: e.address1 || "",
                      address2: e.address2 || "",
          
                      landmark: e.landmark || "",
          
                      city: e.city || "",
                      state: e.state || "",
          
                      pincode: e.pincode || "",
          
                      type: e.type || "Home",
                    });
          
                    setEditModalOpen(true);
                  }}
                >
                  Edit
                </Button>
          
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => deleteHandler(e._id)}
                >
                  <Trash className="w-4 h-4" />
                </Button>
          
              </div>
            </div>
          
            <div className="text-sm leading-6 text-muted-foreground">
          
              <p>{e.address1}</p>
          
              {e.address2 && (
                <p>{e.address2}</p>
              )}
          
              {e.landmark && (
                <p>Landmark: {e.landmark}</p>
              )}
          
              <p>
                {e.city}, {e.state} - {e.pincode}
              </p>
          
              <p>{e.country}</p>
          
            </div>
          
            <Link to={`/payment/${e._id}`}>
              <Button className="w-full rounded-xl">
                Deliver Here
              </Button>
            </Link>

          </div>
            ))
          ) : (
            <p>No Address Found</p>
          )}
        </div>
      )}

      <Button
        className="mt-6"
        variant="outline"
        onClick={() => setModalOpen(true)}
      >
        Add New Address
      </Button>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Address</DialogTitle>
            <DialogDescription> Add your delivery address details. </DialogDescription>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <Input
              placeholder="First Name"
              value={newAddress.firstName}
              onChange={(e) =>
                setNewAddress({
                  ...newAddress,
                  firstName: e.target.value,
                })
              }
            />
          
            <Input
              placeholder="Last Name"
              value={newAddress.lastName}
              onChange={(e) =>
                setNewAddress({
                  ...newAddress,
                  lastName: e.target.value,
                })
              }
            />
          
            <Input
              type="number"
              placeholder="Phone Number"
              value={newAddress.phone}
              onChange={(e) =>
                setNewAddress({
                  ...newAddress,
                  phone: e.target.value,
                })
              }
            />
          
            <select
              value={newAddress.type}
              onChange={(e) =>
                setNewAddress({
                  ...newAddress,
                  type: e.target.value,
                })
              }
              className="
              border rounded-md px-3 py-2
              bg-background
              "
            >
              <option value="Home">Home</option>
              <option value="Office">Office</option>
              <option value="Other">Other</option>
            </select>
          
            <Input
              placeholder="Address Line 1"
              className="md:col-span-2"
              value={newAddress.address1}
              onChange={(e) =>
                setNewAddress({
                  ...newAddress,
                  address1: e.target.value,
                })
              }
            />
          
            <Input
              placeholder="Address Line 2"
              className="md:col-span-2"
              value={newAddress.address2}
              onChange={(e) =>
                setNewAddress({
                  ...newAddress,
                  address2: e.target.value,
                })
              }
            />
          
            <Input
              placeholder="Landmark"
              className="md:col-span-2"
              value={newAddress.landmark}
              onChange={(e) =>
                setNewAddress({
                  ...newAddress,
                  landmark: e.target.value,
                })
              }
            />
          
            <Input
              type="number"
              placeholder="Pincode"
              value={newAddress.pincode}
              onChange={(e) => {
          
                setNewAddress({
                  ...newAddress,
                  pincode: e.target.value,
                });
          
                fetchPincodeDetails(e.target.value);
              }}
            />
          
            <Input
  placeholder="City"
  value={newAddress.city}
  onChange={(e) =>
    setNewAddress({
      ...newAddress,
      city: e.target.value,
    })
  }
/>
          
            <Input
  placeholder="State"
  value={newAddress.state}
  onChange={(e) =>
    setNewAddress({
      ...newAddress,
      state: e.target.value,
    })
  }
/>
          
          </div>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModalOpen(false)}>
              Close
            </Button>
            <Button variant="outline" onClick={handleAddAddress}>
              Add Address
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogDescription> Update your delivery address. </DialogDescription>
            <DialogTitle>Edit Address</DialogTitle>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <Input
              placeholder="First Name"
              value={editAddress.firstName}
              onChange={(e) =>
                setEditAddress({
                  ...editAddress,
                  firstName: e.target.value,
                })
              }
            />
          
            <Input
              placeholder="Last Name"
              value={editAddress.lastName}
              onChange={(e) =>
                setEditAddress({
                  ...editAddress,
                  lastName: e.target.value,
                })
              }
            />
          
            <Input
              type="number"
              placeholder="Phone Number"
              value={editAddress.phone}
              onChange={(e) =>
                setEditAddress({
                  ...editAddress,
                  phone: e.target.value,
                })
              }
            />
          
            <select
              value={editAddress.type}
              onChange={(e) =>
                setEditAddress({
                  ...editAddress,
                  type: e.target.value,
                })
              }
              className="
              border rounded-md px-3 py-2
              bg-background
              "
            >
              <option value="Home">Home</option>
              <option value="Office">Office</option>
              <option value="Other">Other</option>
            </select>
          
            <Input
              placeholder="Address Line 1"
              className="md:col-span-2"
              value={editAddress.address1}
              onChange={(e) =>
                setEditAddress({
                  ...editAddress,
                  address1: e.target.value,
                })
              }
            />
          
            <Input
              placeholder="Address Line 2"
              className="md:col-span-2"
              value={editAddress.address2}
              onChange={(e) =>
                setEditAddress({
                  ...editAddress,
                  address2: e.target.value,
                })
              }
            />
          
            <Input
              placeholder="Landmark"
              className="md:col-span-2"
              value={editAddress.landmark}
              onChange={(e) =>
                setEditAddress({
                  ...editAddress,
                  landmark: e.target.value,
                })
              }
            />
          
            <Input
              type="number"
              placeholder="Pincode"
              value={editAddress.pincode}
              onChange={(e) => {
          
                setEditAddress({
                  ...editAddress,
                  pincode: e.target.value,
                });
          
                fetchPincodeDetails(
                  e.target.value,
                  true
                );
              }}
            />
          
           <Input
  placeholder="City"
  value={newAddress.city}
  onChange={(e) =>
    setNewAddress({
      ...newAddress,
      city: e.target.value,
    })
  }
/>
          
            <Input
  placeholder="State"
  value={newAddress.state}
  onChange={(e) =>
    setNewAddress({
      ...newAddress,
      state: e.target.value,
    })
  }
/>
          
          </div>
          </DialogHeader>

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditModalOpen(false)}>
              Cancel
            </Button>

            <Button onClick={handleEditAddress} disabled={updating}>
              {updating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Checkout;
