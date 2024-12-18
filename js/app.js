// app.js
// Featured Products Section
document.addEventListener('DOMContentLoaded', async () => {
  const carouselTrack = document.querySelector('.carousel-track');

  // Fetch and store products
  async function fetchProducts() {
      try {
          const response = await fetch('../data/products.json'); // Adjust the path if needed
          if (!response.ok) throw new Error('Failed to fetch products.');
          const products = await response.json();
          return products;
      } catch (error) {
          console.error(error);
          return [];
      }
  }

  /**
   * Populate the carousel with product cards from the products.json file.
   * 
   * @async
   * @returns {Promise<void>}
   */
  async function populateCarousel() {
      // Fetch the featured products from the products.json file
      const featuredProducts = await fetchProducts();

      // Loop through each product and create a product card
      featuredProducts.forEach(product => {
          const productCard = document.createElement('div');
          productCard.classList.add('product-card');

          // Create the product card HTML template
          productCard.innerHTML = `
              <img src="${product.image}" alt="${product.title}" class="product-image">
              <h3 class="product-title">${product.title}</h3>
              <p class="product-description">${product.shortDescription}</p>
              <p class="product-rating">⭐ ${product.rating}</p>
              <p class="product-price">$${product.price}</p>
              <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
          `;

          // Append the product card to the carousel track
          carouselTrack.appendChild(productCard);
      });
  }

  /**
   * Add-to-Cart Functionality
   * @param {number} productId Unique ID of the product to add to the cart
   * @param {object[]} products Array of product objects from the products.json file
   * @return {void}
   */
  function addToCart(productId, products) {
      // Retrieve cart from localStorage or initialize it
      // If the cart doesn't exist, create an empty array
      const cart = JSON.parse(localStorage.getItem('cart')) || [];

      // Find the product details by ID
      const product = products.find(p => p.id === parseInt(productId));
      if (!product) {
          alert('Product not found!');
          return;
      }

      // Check if the product already exists in the cart
      const existingProduct = cart.find(item => item.id === product.id);
      if (existingProduct) {
          // Increment quantity if the product already exists
          existingProduct.quantity += 1;
      } else {
          // Add new product with quantity 1
          cart.push({
              id: product.id,
              title: product.title,
              price: product.price,
              image: product.image,
              quantity: 1
          });
      }

      // Save updated cart to localStorage
      // Convert the cart array back to JSON and save it to localStorage
      localStorage.setItem('cart', JSON.stringify(cart));
      alert(`${product.title} has been added to your cart!`);
  }

  // Carousel navigation
  const prevButton = document.querySelector('.carousel-control.prev');
  const nextButton = document.querySelector('.carousel-control.next');
  let currentIndex = 0;

  const updateCarousel = () => {
      const productCards = document.querySelectorAll('.product-card');
      const trackWidth = carouselTrack.scrollWidth / productCards.length;
      carouselTrack.style.transform = `translateX(-${currentIndex * trackWidth}px)`;
  };

  prevButton.addEventListener('click', () => {
      if (currentIndex > 0) {
          currentIndex--;
          updateCarousel();
      }
  });

  nextButton.addEventListener('click', () => {
      const productCards = document.querySelectorAll('.product-card');
      if (currentIndex < productCards.length - 1) {
          currentIndex++;
          updateCarousel();
      }
  });

  // Handle Add-to-Cart clicks
  carouselTrack.addEventListener('click', async (e) => {
      if (e.target.classList.contains('add-to-cart-btn')) {
          const productId = e.target.dataset.id;
          const products = await fetchProducts(); // Ensure you fetch the products
          addToCart(productId, products);
      }
  });

  // Initialize carousel with fetched products
  await populateCarousel();
});
// Categories Section
document.addEventListener('DOMContentLoaded', () => {
  const categoriesGrid = document.querySelector('.categories-grid');

  const categories = [
    { id: 1, category: "Pottery", name: "Pottery", image: "https://via.placeholder.com/300x180?text=Pottery" },
    { id: 2, name: "Jewelry", image: "https://via.placeholder.com/300x180?text=Jewelry" },
    { id: 3, name: "Home Decor", image: "https://via.placeholder.com/300x180?text=Home+Decor" },
    { id: 4, name: "Knitted Items", image: "https://via.placeholder.com/300x180?text=Knitted+Items" },
    { id: 5, name: "Textiles", image: "https://via.placeholder.com/300x180?text=Textiles"  },
    { id: 6, name: "Ceramics", image: "https://via.placeholder.com/300x180?text=Ceramics" },
    { id: 7, name: "Glassware", image: "https://via.placeholder.com/300x180?text=Glassware" },
    { id: 8, name: "Woodworking", image: "https://via.placeholder.com/300x180?text=Woodworking" },
   // { id: 9, name: "Artisanal Crafts", image: "https://via.placeholder.com/300x180?text=Artisanal+Crafts" },
  ];

  categories.forEach((category) => {
    const categoryCard = document.createElement('div');
    categoryCard.classList.add('category-card');
    categoryCard.innerHTML = `
      <img src="${category.image}" alt="${category.name}" />
      <h3 class="category-title">${category.name}</h3>
      <button type="button" class="view-category-btn" data-id="${category.id}">View Products</button>
    `;
    categoriesGrid.appendChild(categoryCard);
  });

  categoriesGrid.addEventListener('click', (e) => {
    if (e.target.classList.contains('view-category-btn')) {
      const categoryId = e.target.dataset.id;
      window.location.href = `products.html?id=${categoryId}`;
    }
  });
});


// New Arrivals Section
document.addEventListener('DOMContentLoaded', async () => {
  const newArrivalsGrid = document.querySelector('.new-arrivals-grid');

  // Function to fetch new arrivals data
  async function fetchNewArrivals() {
    try {
      const response = await fetch('../data/products.json'); // Adjust the path if needed
      if (!response.ok) throw new Error('Failed to fetch new arrivals.');
      const products = await response.json();
      return products;
    } catch (error) {
      console.error(error);
      return [];
    }
  }
 
  // Function to populate the New Arrivals section
  async function populateNewArrivals() {
    const newArrivals = await fetchNewArrivals();
    const productsToDisplay = newArrivals.slice(0, 8);

    newArrivalsGrid.innerHTML = productsToDisplay.map((product) => `
      <div class="new-arrival-card">
        <img src="${product.image}" alt="${product.title}" class="new-arrival-image">
        <h3 class="new-arrival-title">${product.title}</h3>
        <p class="new-arrival-description">${product.shortDescription}</p>
        <p class="new-arrival-price">$${product.price}</p>
        <button class="view-product-btn" data-id="${product.id}">View Product</button>
      </div>
    `).join('');
  }
 
  // Add functionality to View Product buttons
  newArrivalsGrid.addEventListener('click', (e) => {
    if (e.target.classList.contains('view-product-btn')) {
      const productId = e.target.dataset.id;
      alert(`Viewing details for product ID: ${productId}`);
      // Replace with actual navigation or product details logic
      window.location.href = `product.html?id=${productId}`;
    }
  });

  // Initialize New Arrivals section
  await populateNewArrivals();
});

// Customer Reviews Section
document.addEventListener('DOMContentLoaded', async () => {
  const reviewsGrid = document.querySelector('.reviews-grid');

  // Function to fetch customer reviews data
  async function fetchCustomerReviews() {
    try {
      const response = await fetch('../data/reviews.json'); // Adjust the path if needed
      if (!response.ok) throw new Error('Failed to fetch customer reviews.');
      const reviews = await response.json();
      return reviews;
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  // Function to populate the Customer Reviews section
  async function populateCustomerReviews() {
    const reviews = await fetchCustomerReviews();

    reviews.forEach(review => {
      const reviewCard = document.createElement('div');
      reviewCard.classList.add('review-card');

      reviewCard.innerHTML = `
        <img src="${review.avatar}" alt="${review.name}" class="review-avatar">
        <h3 class="review-name">${review.name}</h3>
        <p class="review-text">${review.text}</p>
      `;

      reviewsGrid.appendChild(reviewCard);
    });
  }

  // Initialize Customer Reviews section
  await populateCustomerReviews();
});

document.querySelectorAll("img").forEach((img) => {
  img.loading = "lazy";
  console.log(img);
});
