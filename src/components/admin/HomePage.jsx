import { ProductData } from "@/context/ProductContext";
import Loading from "../Loading";
import Cookies from "js-cookie";
import ProductCard from "../ProductCard";
import { Loader2 } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "../ui/pagination";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { server } from "@/main";

const HomePage = () => {
  const {
    products,
    page,
    setPage,
    fetchProducts,
    loading,
    totalPages,
    categories,
    setCategories,
  } = ProductData();

  const nextPage = () => {
    setPage(page + 1);
  };

  const prevPage = () => {
    setPage(page - 1);
  };

  const [open, setOpen] = useState(false);
  const [creating, setCreating] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    price: "",
    stock: "",
    images: null,
  });

  const [newCategory, setNewCategory] = useState("");

  const addCategory = () => {
    if (!newCategory.trim()) return;

    const categoryExists = categories.some(
      (cat) => cat.toLowerCase() === newCategory.toLowerCase(),
    );

    if (categoryExists) {
      return toast.error("Category already exists");
    }

    setCategories((prev) => [...prev, newCategory]);

    toast.success("Category added");

    setNewCategory("");
  };

  const deleteCategory = (categoryToDelete) => {
    const confirmDelete = window.confirm(
      `Delete ${categoryToDelete} category?`,
    );

    if (!confirmDelete) return;

    setCategories((prev) => prev.filter((cat) => cat !== categoryToDelete));

    if (formData.category === categoryToDelete) {
      setFormData((prev) => ({
        ...prev,
        category: "",
      }));
    }

    toast.success("Category deleted");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, images: e.target.files }));
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!formData.images || formData.images.length === 0) {
      return toast.error("Please select images");
    }

    setCreating(true);

    const form = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      if (key === "images") {
        for (let i = 0; i < value.length; i++) {
          form.append("files", value[i]);
        }
      } else {
        form.append(key, value);
      }
    });

    try {
      const { data } = await axios.post(`${server}/api/product/new`, form, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      });

      toast.success(data.message);
      setOpen(false);
      setFormData({
        title: "",
        description: "",
        category: "",
        price: "",
        stock: "",
        images: null,
      });
      fetchProducts();
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Something went wrong");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between">
        <h2 className="text-2xl font-bold">All Products</h2>

        <Button onClick={() => setOpen(true)} className="mb-4">
          Add Product
        </Button>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger />
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Product</DialogTitle>
              <DialogDescription>
                Fill all product details to create a new product.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={submitHandler} className="space-y-4">
              <Input
                name="title"
                placeholder="Product Title"
                value={formData.title}
                onChange={handleChange}
                required
              />
              <Input
                name="description"
                placeholder="Product description"
                value={formData.description}
                onChange={handleChange}
                required
              />
              <div className="flex flex-col sm:flex-row gap-2">
                <Input
                  placeholder="Add New Category"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="flex-1"
                />

                <Button
                  type="button"
                  onClick={addCategory}
                  disabled={!newCategory.trim()}
                  className="sm:w-auto w-full"
                >
                  Add Category
                </Button>
              </div>

              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="">Select Category</option>

                {categories.map((e) => {
                  return (
                    <option value={e} key={e}>
                      {e}
                    </option>
                  );
                })}
              </select>

              {formData.category && (
                <div className="flex justify-end">
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => deleteCategory(formData.category)}
                  >
                    Delete Selected Category
                  </Button>
                </div>
              )}
              <Input
                name="price"
                placeholder="Product price"
                value={formData.price}
                onChange={handleChange}
                required
              />
              <Input
                name="stock"
                placeholder="Product stock"
                value={formData.stock}
                onChange={handleChange}
                required
              />
              <Input
                type="file"
                name="images"
                multiple
                accept="image/*"
                onChange={handleFileChange}
                required
                className="
    h-10
    cursor-pointer
    border             
    file:mr-4
    file:h-8
    file:rounded-md
   
    file:bg-primary
    file:px-4
    file:text-sm
    file:font-medium
    file:text-primary-foreground

    hover:file:bg-primary/90   
    active:file:scale-95

    file:transition-all
    file:duration-200
  "
              />
              <Button type="submit" className="w-full">
                {creating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating Product...
                  </>
                ) : (
                  "Create Product"
                )}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      {loading ? (
        <Loading />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products && products.length > 0 ? (
            products.map((e) => {
              return <ProductCard product={e} key={e._id} latest={"no"} />;
            })
          ) : (
            <p>No Products Yet</p>
          )}
        </div>
      )}

      <div className="mt-10 mb-2">
        <Pagination>
          <PaginationContent>
            {page !== 1 && (
              <PaginationItem className="cursor-pointer" onClick={prevPage}>
                <PaginationPrevious />
              </PaginationItem>
            )}

            {page !== totalPages && (
              <PaginationItem className="cursor-pointer" onClick={nextPage}>
                <PaginationNext />
              </PaginationItem>
            )}
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
};

export default HomePage;
