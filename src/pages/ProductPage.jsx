import Loading from "@/components/Loading";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { cartData } from "@/context/CartContext";
import { ProductData } from "@/context/ProductContext";
import { UserData } from "@/context/UserContext";
import { server } from "@/main";
import Cookies from "js-cookie";
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { Edit, Loader2, X } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const ProductPage = () => {
  const { fetchProduct, product, relatedProduct, loading, categories } =
    ProductData();

  const { addToCart } = cartData();
  const { id } = useParams();

  const { isAuth, user } = UserData();

  useEffect(() => {
    fetchProduct(id);
  }, [id]);

  const addToCartHandler = () => {
    addToCart(id);
  };

  const [show, setShow] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [stock, setStock] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");

  const [btnLoading, setBtnLoading] = useState(false);

  const updateHandler = () => {
    setShow(!show);
    setCategory(product.category);
    setTitle(product.title);
    setDescription(product.description);
    setStock(product.stock);
    setPrice(product.price);
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setBtnLoading(true);

    try {
      const { data } = await axios.put(
        `${server}/api/product/${id}`,
        { title, description, price, stock, category },
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        },
      );

      toast.success(data.message);
      fetchProduct(id);
      setShow(false);
      setBtnLoading(false);
    } catch (error) {
      toast.error(error.response.data.message);
      setBtnLoading(false);
    }
  };

  const [updatedImages, setUpdatedImages] = useState(null);

  const handleSubmitImage = async (e) => {
    e.preventDefault();

    if (!updatedImages || updatedImages.length === 0) {
      return toast.error("Please select new images");
    }

    setBtnLoading(true);

    const formData = new FormData();

    for (let i = 0; i < updatedImages.length; i++) {
      formData.append("files", updatedImages[i]);
    }

    try {
      const { data } = await axios.post(
        `${server}/api/product/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("token")}`,
            "Content-Type": "multipart/form-data",
          },
        },
      );

      toast.success(data.message);

      fetchProduct(id);

      setUpdatedImages(null);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to update images");
    } finally {
      setBtnLoading(false);
    }
  };

  return (
    <div>
      {loading ? (
        <Loading />
      ) : (
        <div className="container mx-auto px-4 py-8">
          {user && user.role === "admin" && (
            <div className="w-75 md:w-112.5 m-auto mb-5">
              <Button onClick={updateHandler}>{show ? <X /> : <Edit />}</Button>
              {show && (
                <div className="space-y-4">
                  <div>
                    <Label>Title</Label>
                    <Input
                      placeholder="Product Title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <Label>Description</Label>
                    <Input
                      placeholder="Product description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <Label>Category</Label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      required
                      className="w-full p-2 border rounded-md dark:bg-gray-900 dark:text-white"
                    >
                      {categories.map((e) => (
                        <option value={e} key={e}>
                          {e}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <Label>Price</Label>
                    <Input
                      placeholder="Product Price"
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <Label>Stock</Label>
                    <Input
                      placeholder="Product Stock"
                      type="number"
                      value={stock}
                      onChange={(e) => setStock(e.target.value)}
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={btnLoading}
                    onClick={submitHandler}
                  >
                    {btnLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Updating Product...
                      </>
                    ) : (
                      "Update Product"
                    )}
                  </Button>
                </div>
              )}
            </div>
          )}
          {product && (
            <div className="flex flex-col lg:flex-row items-start gap-14">
              <div className="w-72.5 md:w-162.5">
                <Carousel>
                  <CarouselContent>
                    {product.images &&
                      product.images.map((image, index) => (
                        <CarouselItem key={index}>
                          <img
                            src={image.url}
                            alt={`Product ${index + 1}`}
                            className="w-ful rounded-md object-cover"
                          />
                        </CarouselItem>
                      ))}
                  </CarouselContent>
                  <CarouselPrevious />
                  <CarouselNext />
                </Carousel>

                {user && user.role === "admin" && (
                  <form
                    onSubmit={handleSubmitImage}
                    className="flex flex-col gap-4"
                  >
                    <div>
                      <Label className="mb-4 mt-4">Upload New Images:</Label>
                      <input
                        type="file"
                        name="files"
                        id="files"
                        multiple
                        accept="image/*"
                        onChange={(e) => setUpdatedImages(e.target.files)}
                        className="
    
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
                    </div>
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={btnLoading}
                    >
                      {btnLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Updating Images...
                        </>
                      ) : (
                        "Update Images"
                      )}
                    </Button>
                  </form>
                )}
              </div>

              <div className="w-full lg-w-1/2 space-y-4">
                <h1 className="text-2xl font-bold">{product.title}</h1>
                <p className="text-lg">{product.description}</p>
                <p className="text-xl font-semibold">₹ {product.price}</p>
                {isAuth ? (
                  <>
                    {product.stock <= 0 ? (
                      <p className="text-red-600 text-2xl">Out of Stock</p>
                    ) : (
                      <Button
                        onClick={addToCartHandler}
                        className="cursor-pointer"
                      >
                        Add To Cart
                      </Button>
                    )}
                  </>
                ) : (
                  <p className="text-blue-500">
                    Please Login to add something in cart
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {relatedProduct?.length > 0 && (
        <>
          {loading ? (
            <Loading />
          ) : (
            <div className="mt-12">
              <h2 className="text-xl font-bold px-4">Related Products</h2>
              <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                {relatedProduct.map((e) => (
                  <ProductCard key={e._id} product={e} />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ProductPage;
