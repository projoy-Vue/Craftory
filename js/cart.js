document.addEventListener("DOMContentLoaded", () => {
  const cartItemsContainer = document.getElementById("cart-items-container");
  const subtotalElement = document.getElementById("subtotal");
  const totalElement = document.getElementById("total");
  const shippingOptions = document.getElementById("shipping-options");
  const suggestedProductsContainer = document.getElementById("suggested-products");

  const TAX_RATE = 0.1; // 10% tax
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  let suggestedProducts = []; // Will be populated from products.json

  // Fetch suggested products from products.json
  async function fetchSuggestedProducts() {
    try {
      const response = await fetch("../data/products.json");
      if (!response.ok) throw new Error("Failed to fetch products");
      suggestedProducts = await response.json();
      renderSuggestedProducts();
    } catch (error) {
      console.error("Error fetching suggested products:", error);
    }
  }

  // Render the cart items
  function renderCart() {
    if (cart.length === 0) {
      cartItemsContainer.innerHTML = "<tr><td colspan='5'>Your cart is empty.</td></tr>";
      updateTotals();
      return;
    }

    cartItemsContainer.innerHTML = cart
      .map(
        (item) => `
        <tr>
          <td>
            <img src="${item.image}" alt="${item.title}">
            <span>${item.title}</span>
          </td>
          <td>$${item.price}</td>
          <td>
            <button class="btn-decrease" data-id="${item.id}">-</button>
            ${item.quantity || 1} <!-- Ensure quantity is always initialized -->
            <button class="btn-increase" data-id="${item.id}">+</button>
          </td>
          <td>$${(item.price * (item.quantity || 1)).toFixed(2)}</td>
          <td>
            <button class="btn-remove" data-id="${item.id}">x</button>
          </td>
        </tr>`
      )
      .join("");

    updateTotals();
  }

  // Update subtotal and total
  function updateTotals() {
    const subtotal = cart.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);
    const shipping = parseFloat(shippingOptions.value);
    const total = subtotal + shipping;

    subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
    totalElement.textContent = `$${total.toFixed(2)}`;
  }

  // Render suggested products
  function renderSuggestedProducts() {
     // Limit the products to the first 10
  const productsToDisplay = suggestedProducts.slice(0, 8);

    suggestedProductsContainer.innerHTML = productsToDisplay
      .map(
        (product) => `
        <div class="product-card">
          <img src="${product.image}" alt="${product.title}">
          <h4>${product.title}</h4>
          <p>${product.shortDescription}</p>
          <p>$${product.price}</p>
          <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
        </div>`
      )
      .join("");
  }

  // Handle cart item button clicks (Increase, Decrease, Remove)
  cartItemsContainer.addEventListener("click", (e) => {
    const id = parseInt(e.target.dataset.id);

    if (e.target.classList.contains("btn-increase")) {
      const item = cart.find((product) => product.id === id);
      if (item) item.quantity = (item.quantity || 1) + 1;
    } else if (e.target.classList.contains("btn-decrease")) {
      const item = cart.find((product) => product.id === id);
      if (item) {
        if (item.quantity > 1) item.quantity--;
        else cart = cart.filter((product) => product.id !== id); // Remove item if quantity is 0
      }
    } else if (e.target.classList.contains("btn-remove")) {
      cart = cart.filter((product) => product.id !== id); // Remove item from cart
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    renderCart();
  });

  // Add to cart from suggested products
  suggestedProductsContainer.addEventListener("click", (e) => {
    if (e.target.classList.contains("add-to-cart")) {
      const id = parseInt(e.target.dataset.id);
      const product = suggestedProducts.find((item) => item.id === id);

      const existingCartItem = cart.find((item) => item.id === id);
      if (existingCartItem) {
        existingCartItem.quantity = (existingCartItem.quantity || 1) + 1;
      } else {
        cart.push({ ...product, quantity: 1 }); // Initialize quantity to 1
      }

      localStorage.setItem("cart", JSON.stringify(cart));
      renderCart();
    }
  });

  // Update totals when shipping option changes
  shippingOptions.addEventListener("change", updateTotals);

  // Initialize cart and fetch suggested products
  renderCart();
  fetchSuggestedProducts();
});
