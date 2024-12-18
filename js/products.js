document.addEventListener('DOMContentLoaded', () => {
  const productGrid = document.getElementById('product-grid');
  const categoryFilter = document.getElementById('category');
  const priceRangeFilter = document.getElementById('price-range');
  const ratingFilter = document.getElementById('rating');
  const sortFilter = document.getElementById('sort');
  const prevButton = document.querySelector('.prev');
  const nextButton = document.querySelector('.next');
  let products = [];
  let currentPage = 1;
  const productsPerPage = 8;

  // Function to fetch products from JSON file
  async function fetchProducts() {
    try {
      const response = await fetch('../data/products.json'); // Adjust path as needed
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      products = await response.json();
      applyInitialFilters();
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  }

  // Apply initial filters (e.g., category from URL)
  function applyInitialFilters() {
    const urlParams = new URLSearchParams(window.location.search);
    const initialCategory = urlParams.get('category');

    if (initialCategory) {
      categoryFilter.value = initialCategory; // Set filter to initial category
    }

    renderProducts();
  }

  // Filter and render products
  function filterProducts() {
    let filteredProducts = [...products];
    const category = categoryFilter.value;
    const priceRange = priceRangeFilter.value;
    const rating = ratingFilter.value;
    const sortBy = sortFilter.value;

    // Filter by Category
    if (category !== 'all') {
      filteredProducts = filteredProducts.filter((product) => product.category === category);
    }

    // Filter by Price Range
    filteredProducts = filteredProducts.filter((product) => product.price <= priceRange);

    // Filter by Rating
    if (rating !== 'all') {
      filteredProducts = filteredProducts.filter((product) => product.rating >= rating);
    }

    // Sort Products
    if (sortBy === 'price-asc') {
      filteredProducts.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      filteredProducts.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      filteredProducts.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'newest') {
      filteredProducts.reverse();
    }

    return filteredProducts;
  }

  // Render products dynamically
  function renderProducts() {
    const filteredProducts = filterProducts();
    const startIndex = (currentPage - 1) * productsPerPage;
    const paginatedProducts = filteredProducts.slice(startIndex, startIndex + productsPerPage);

    productGrid.innerHTML = '';
    paginatedProducts.forEach((product) => {
      const productCard = document.createElement('div');
      productCard.classList.add('product-card');
      productCard.innerHTML = `
        <img src="${product.image}" alt="${product.title}">
        <h4>${product.title}</h4>
        <p>${product.shortDescription}</p>
        <p>$${product.price}</p>
        <p class="rating">⭐ ${product.rating}</p>
        <div class="buttons-align">
          <button class="view-product" onclick="viewProduct(${product.id})">View Product</button>
          <button class="add-to-cart" onclick="addToCart(${product.id})">Add to Cart</button>
        </div>
      `;
      productGrid.appendChild(productCard);
    });

    // Pagination controls
    prevButton.disabled = currentPage === 1;
    nextButton.disabled = currentPage * productsPerPage >= filteredProducts.length;
  }

  // View product function
  window.viewProduct = (productId) => {
    window.location.href = `product.html?id=${productId}`;
  };

  // Add to cart function
  window.addToCart = (productId) => {
    const product = products.find((item) => item.id === productId);

    if (!product) {
      console.error('Product not found:', productId);
      return;
    }

    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingProduct = cart.find((item) => item.id === productId);

    if (existingProduct) {
      existingProduct.quantity++;
    } else {
      cart.push({
        id: product.id,
        title: product.title,
        price: product.price,
        image: product.image,
        quantity: 1,
      });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    alert(`${product.title} has been added to your cart!`);
  };

  // Event listeners
  categoryFilter.addEventListener('change', renderProducts);
  priceRangeFilter.addEventListener('input', () => {
    document.getElementById('price-range-value').textContent = `$${priceRangeFilter.value}`;
    renderProducts();
  });
  ratingFilter.addEventListener('change', renderProducts);
  sortFilter.addEventListener('change', renderProducts);

  prevButton.addEventListener('click', () => {
    if (currentPage > 1) {
      currentPage--;
      renderProducts();
    }
  });

  nextButton.addEventListener('click', () => {
    currentPage++;
    renderProducts();
  });

  // Initialize
  fetchProducts();
});
