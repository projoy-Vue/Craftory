
/**
 * Asynchronously loads an HTML component from a file and injects it into the DOM.
 * Additionally, sets up a search input listener if the 'header' element is loaded.
 * 
 * @param {string} elementId - The ID of the element to inject the component into.
 * @param {string} filePath - The path to the HTML file containing the component.
 */
const loadComponent = async (elementId, filePath) => {
  try {
    // Fetch the HTML content from the specified file path
    const response = await fetch(filePath);
    const content = await response.text();
    
    // Inject the fetched content into the DOM element with the given ID
    document.getElementById(elementId).innerHTML = content;
  } catch (error) {
    // Log an error message if the fetch operation fails
    console.error('Error loading component:', error);
  }

  // If the loaded component is the header, set up a search input event listener
  if (elementId === 'header') {
      /** Search Bar Functionality **/
      const searchInput = document.getElementById('search');
      const searchResults = document.getElementById('search-results');
    
      // Fake product data for search suggestions
      const products = [ 
        { name: "Handmade Ceramic Vase", id: 1 },
        { name: "Woven Basket", id: 2 },
        { name: "Wooden Cutting Board", id: 3 },
        { name: "Knitted Wool Scarf", id: 4 },
        { name: "Handcrafted Jewelry", id: 5 }
      ];
    
      // Handle search input
      searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        searchResults.innerHTML = ''; // Clear previous results
    
        if (query.length > 0) {
          const filteredProducts = products.filter(product =>
            product.name.toLowerCase().includes(query)
          );
    
          filteredProducts.forEach(product => {
            const li = document.createElement('li');
            li.textContent = product.name;
            li.onclick = () => {
              window.location.href = `product.html?id=${product.id}`; // Redirect to product page
            };
            searchResults.appendChild(li);
          });
    
          searchResults.style.display = 'block'; // Show results
        } else {
          searchResults.style.display = 'none'; // Hide results if input is empty
        }
      });
    
      // Hide search results when clicked outside
      document.addEventListener('click', (e) => {
        if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
          searchResults.style.display = 'none';
        }
      });
    
      /** Cart Functionality **/
      const cartCount = document.getElementById('cart-count');
      const addToCartButtons = document.querySelectorAll('.add-to-cart');
      let cartItems = 0;
    
      // Handle Add-to-Cart button clicks
      addToCartButtons.forEach(button => {
        button.addEventListener('click', () => {
          cartItems++;
          cartCount.textContent = cartItems;
          //alert('Item added to cart!');
        });
      });
    
      /** Login Functionality **/
      // Hamburger menu toggle for mobile screens
      const hamburgerMenu = document.getElementById('hamburger-menu');
      const navContainer = document.querySelector('.nav-container');
    
      hamburgerMenu.addEventListener('click', () => {
        navContainer.classList.toggle('active');
        console.log(navContainer);
      
      });
  }

  // If the loaded component is the footer, set up newsletter functionality
  if (elementId === 'footer') {
    const newsletterForm = document.getElementById('newsletter-form');
    
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const emailInput = newsletterForm.querySelector('input[type="email"]');
      const email = emailInput.value.trim();
    
      if (validateEmail(email)) {
        alert(`Thank you for subscribing with ${email}!`);
        newsletterForm.reset();
      } else {
        alert('Please enter a valid email address.');
      }
    });
    
    // Email validation function
    function validateEmail(email) {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailPattern.test(email);
    }
  }
};

// Load header and footer dynamically on page load
document.addEventListener('DOMContentLoaded', () => {
  loadComponent('header', '../components/navbar.html');
  loadComponent('footer', '../components/footer.html');
  
});
