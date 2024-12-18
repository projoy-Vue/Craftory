// Get product ID from the URL query parameters
const productId = new URLSearchParams(window.location.search).get("id");
const productsUrl = "../data/products.json"; // Path to your products.json file

// Function to fetch and render product details
async function fetchProductDetails() {
  try {
    const response = await fetch(productsUrl); // Fetch all products from the JSON file
    const products = await response.json();

    // Find the current product based on the ID in the URL
    const product = products.find(p => p.id === parseInt(productId));

    if (!product) {
      document.querySelector('.product-details-container').innerHTML = "<p>Product not found.</p>";
      return;
    }

    // Populate product details dynamically
    document.getElementById("main-image").src = product.images[0];
    document.getElementById("product-title").textContent = product.title;
    document.getElementById("product-category").textContent = `Category: ${product.category}`;
    document.getElementById("product-price").textContent = `Price: $${product.price}`;
    document.getElementById("product-rating").textContent = `Rating: ${product.rating} stars`;
    document.getElementById("product-short-description").textContent = product.shortDescription;
    document.getElementById("detailed-description-text").textContent = product.description;

    // Fetch and render related products
    renderRelatedProducts(products, product.category);

    // Add event listener for "Add to Cart" button
    document.getElementById("add-to-cart").addEventListener("click", () => {
      addToCart(product);
    });

    // Populate carousel thumbnails (if any)
    const thumbnailsContainer = document.getElementById("carousel-thumbnails");
    product.images.forEach(image => {
      const img = document.createElement("img");
      img.src = image;
      img.alt = product.title;
      img.addEventListener("click", () => {
        document.getElementById("main-image").src = image;
      });
      thumbnailsContainer.appendChild(img);
    });

  } catch (error) {
    console.error("Error fetching product details:", error);
    document.querySelector('.product-details-container').innerHTML = "<p>Unable to load product details at the moment. Please try again later.</p>";
  }
}

// Fetch related products based on category
function renderRelatedProducts(allProducts, category) {
  // Filter products that belong to the same category but exclude the current product
  const relatedProducts = allProducts.filter(p => p.category === category && p.id !== parseInt(productId));

  // Limit to 10 products
  const productsToDisplay = relatedProducts.slice(0, 10);

  // Render the related products
  const relatedProductsContainer = document.getElementById("related-products-grid");
  relatedProductsContainer.innerHTML = productsToDisplay
    .map(
      (product) => `
        <div class="product-card">
          <img src="${product.images[0]}" alt="${product.title}">
          <h4>${product.title}</h4>
          <p>${product.shortDescription}</p>
          <p>$${product.price}</p>
          <a href="product.html?id=${product.id}" class="view-details">View Details</a>
          <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
        </div>`
    )
    .join("");
}

// Add to Cart functionality
function addToCart(product) {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const existingProduct = cart.find(item => item.id === product.id);

  if (existingProduct) {
    existingProduct.quantity++;
  } else {
    cart.push({
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.images[0],
      quantity: 1
    });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  alert(`${product.title} has been added to your cart!`);
}

// Fetch the product details when the page loads
fetchProductDetails();

// Add review submission functionality
document.getElementById("review-form").addEventListener("submit", event => {
  event.preventDefault(); // Prevent form from submitting normally

  const rating = document.getElementById("review-rating").value;
  const text = document.getElementById("review-text").value;
  const reviewsList = document.getElementById("reviews-list");

  // Validate the form
  if (!text.trim()) {
    alert("Please enter a review.");
    return;
  }

  // Add the new review dynamically to the reviews section
  const reviewCard = document.createElement("div");
  reviewCard.className = "review";
  reviewCard.innerHTML = `
    <p class="review-rating">${rating} Stars</p>
    <p class="review-text">${text}</p>
  `;
  reviewsList.appendChild(reviewCard);

  // Clear the review form fields after submission
  document.getElementById("review-text").value = "";
  document.getElementById("review-rating").value = "5"; // Reset rating to default 5
});
