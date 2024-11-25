export default function ProductsForm({
  isEditing,
  formData,
  handleOnChange,
  handleOnSubmit,
}) {
  return (
    <div>
      <h2> Product Form </h2>
      <form onSubmit={handleOnSubmit}>
        <div>
          <input
            type="text"
            name="productName"
            value={formData.productName}
            onChange={handleOnChange}
            placeholder="productName"
          />
        </div>
        <div>
          <input
            type="text"
            name="brand"
            value={formData.brand}
            onChange={handleOnChange}
            placeholder="Brand"
          />
        </div>
        <div>
          <input
            type="text"
            name="image"
            value={formData.image}
            onChange={handleOnChange}
            placeholder="Image URL"
          />
        </div>
        <div>
          <input
            type="text"
            name="price"
            value={formData.price}
            onChange={handleOnChange}
            placeholder="price"
          />
        </div>
        <button type="submit">
          {isEditing ? "Update Product" : "Add Product"}
        </button>
      </form>
    </div>
  );
}
