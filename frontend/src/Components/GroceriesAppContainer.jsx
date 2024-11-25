import { useState, useEffect } from "react";
import CartContainer from "./CartContainer";
import ProductsContainer from "./ProductsContainer";
import NavBar from "./NavBar";
import axios from "axios";
import ProductsForm from "./ProductsForm";
// Main Function
export default function GroceriesAppContainer() {
  // States
  const [productQuantity, setProductQuantity] = useState([]);

  const [cartList, setCartList] = useState([]);
  const [productList, setProductList] = useState([]);
  const [formData, setFormData] = useState({
    productName: "",
    brand: "",
    image: "",
    price: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [postResponse, setPostResponse] = useState("");

  // useEffect to fetch products from DB
  useEffect(() => {
    handleProductsFromDB();
  }, [postResponse]);

  const initialQuantity = (prods) =>
    prods.map((prod) => ({ id: prod.id, quantity: 0 }));

  const handleProductsFromDB = async () => {
    try {
      const result = await axios
        .get("http://localhost:3000/products")
        .then((result) => {
          setProductList(result.data);
          setProductQuantity(initialQuantity(result.data));
        });
    } catch (error) {
      console.log(error.message);
    }
  };
  // Handling Adding to Quantity
  const handleAddQuantity = (productId, mode) => {
    if (mode === "cart") {
      const newCartList = cartList.map((product) => {
        if (product.id === productId) {
          return { ...product, quantity: product.quantity + 1 };
        }
        return product;
      });
      setCartList(newCartList);
    } else if (mode === "product") {
      const newProductQuantity = productQuantity.map((product) => {
        if (product.id === productId) {
          return { ...product, quantity: product.quantity + 1 };
        }
        return product;
      });
      setProductQuantity(newProductQuantity);
    }
  };

  const handleRemoveQuantity = (productId, mode) => {
    if (mode === "cart") {
      const newCartList = cartList.map((product) => {
        if (product.id === productId && product.quantity > 1) {
          return { ...product, quantity: product.quantity - 1 };
        }
        return product;
      });
      setCartList(newCartList);
    } else if (mode === "product") {
      const newProductQuantity = productQuantity.map((product) => {
        if (product.id === productId && product.quantity > 0) {
          return { ...product, quantity: product.quantity - 1 };
        }
        return product;
      });
      setProductQuantity(newProductQuantity);
    }
  };

  const handleAddToCart = (productId) => {
    const product = productList.find((product) => product.id === productId);
    const pQuantity = productQuantity.find(
      (product) => product.id === productId
    );
    const newCartList = [...cartList];
    const productInCart = newCartList.find(
      (product) => product.id === productId
    );
    if (productInCart) {
      productInCart.quantity += pQuantity.quantity;
    } else if (pQuantity.quantity === 0) {
      alert(`Please select quantity for ${product.productName}`);
    } else {
      newCartList.push({ ...product, quantity: pQuantity.quantity });
    }
    setCartList(newCartList);
  };

  const handleRemoveFromCart = (productId) => {
    const newCartList = cartList.filter((product) => product.id !== productId);
    setCartList(newCartList);
  };

  const handleClearCart = () => {
    setCartList([]);
  };

  // Handing the Editing when the Editing Button is pressed
  const handleEdit = (productId) => {
    const product = productList.find((product) => product._id === productId);
    setIsEditing(true);
    setFormData({
      productName: product.productName,
      brand: product.brand,
      image: product.image,
      price: product.price,
      _id: product._id,
    });
  };
  // Updating the Screen when Updated
  const handleOnchange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handing the Button for Adding and Editing a product
  const handleOnSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await handleUpdate(formData._id);
        setIsEditing(false);
        setFormData({ productName: "", brand: "", image: "", price: "" });
      } else {
        await axios.post("http://localhost:3000/add-products", formData);
        setPostResponse("Product added successfully");
        setFormData({ productName: "", brand: "", image: "", price: "" });
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  // Handling the Editing when a product is changed
  const handleUpdate = async (productId) => {
    try {
      await axios.patch(
        `http://localhost:3000/products/${productId}`,
        formData
      );
      setPostResponse("Product updated successfully");
    } catch (error) {
      console.log(error.message);
    }
  };

  // Handling the Deleteing from MongoDB
  const handleDelete = async (productId) => {
    try {
      await axios.delete(`http://localhost:3000/delete-product/${productId}`);
      setPostResponse("Product deleted successfully");
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div>
      <NavBar quantity={cartList.length} />
      <div className="GroceriesApp-Container">
        <ProductsContainer
          products={productList}
          handleAddQuantity={handleAddQuantity}
          handleRemoveQuantity={handleRemoveQuantity}
          handleAddToCart={handleAddToCart}
          productQuantity={productQuantity}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
        />
        <CartContainer
          cartList={cartList}
          handleRemoveFromCart={handleRemoveFromCart}
          handleAddQuantity={handleAddQuantity}
          handleRemoveQuantity={handleRemoveQuantity}
          handleClearCart={handleClearCart}
        />
        <ProductsForm
          formData={formData}
          handleOnChange={handleOnchange}
          handleOnSubmit={handleOnSubmit}
          isEditing={isEditing}
        />
      </div>
    </div>
  );
}
