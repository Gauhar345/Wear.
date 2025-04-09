document.addEventListener('DOMContentLoaded', () => {
    // 1. Select DOM elements
    const cartIcon = document.querySelector(".cart-link");
    const cart = document.querySelector(".cart");
    const cartClose = document.querySelector("#cart-close");
    const cartContent = document.querySelector(".cart-content");
    const totalPriceElement = document.querySelector(".total-price");
    const cartBadge = document.querySelector(".cart-badge");
    const buyBtn = document.querySelector(".btn-buy");
    const arrowUp = document.getElementById('arrow-up');
    const emptyMsg = document.getElementById('empty-msg');
  
    // 2. Cart state
    let cartItems = JSON.parse(localStorage.getItem('cart')) || [];
  
    // 3. Event Listeners
    if (cartIcon) {
      cartIcon.addEventListener("click", toggleCart);
    }
    if (cartClose) {
      cartClose.addEventListener("click", toggleCart);
    }
    if (buyBtn) {
      buyBtn.addEventListener("click", completePurchase);
    }
    document.querySelectorAll(".btn-cart").forEach(button => {
      button.addEventListener("click", addToCart);
    });
  
    // Scroll-to-top button logic
    if (arrowUp) {
      // Show or hide arrow based on scroll position
      window.addEventListener('scroll', () => {
        if (window.scrollY > 200) {
          arrowUp.classList.add('show'); // or any class that makes it visible
        } else {
          arrowUp.classList.remove('show');
        }
      });
  
      // Scroll to top on click
      arrowUp.addEventListener('click', () => {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      });
    }
  
    // 4. Cart: Toggle Visibility
    function toggleCart() {
      if (cart) {
        cart.classList.toggle("active");
      }
    }
  
    // 5. Add Product to Cart
    function addToCart(event) {
      const productCard = event.target.closest(".clothes-card");
      const productId = productCard?.dataset?.id;
  
      if (!productId) {
        console.warn("Product ID not found.");
        return;
      }
  
      const priceText = productCard.querySelector(".price")?.textContent || "";
      const priceValue = parseFloat(priceText.replace("SAR", "").trim());
  
      const product = {
        id: productId,
        img: productCard.querySelector("img")?.src || "",
        title: productCard.querySelector(".product-title")?.textContent || "No Title",
        price: isNaN(priceValue) ? 0 : priceValue,
        quantity: 1
      };
  
      const existingItem = cartItems.find(item => item.id === productId);
      if (existingItem) {
        existingItem.quantity++;
      } else {
        cartItems.push(product);
      }
  
      updateCart();
      saveToLocalStorage();
    }
  
    // 6. Update Cart
    function updateCart() {
      updateCartDisplay();
      updateTotal();
      updateCartBadge();
    }
  
    // **Merged** updateCartDisplay function
    function updateCartDisplay() {
      // Clear previous content
      cartContent.innerHTML = '';
  
      // If cart is empty, show "empty" message
      if (cartItems.length === 0) {
        emptyMsg.classList.add('show');
        return;
      } else {
        emptyMsg.classList.remove('show');
      }
  
      // Otherwise, build cart items
      cartItems.forEach((item, index) => {
        const cartBox = document.createElement("div");
        cartBox.classList.add("cart-box");
  
        cartBox.innerHTML = `
          <img src="${item.img}" alt="${item.title}" class="cart-img">
          <div class="cart-details">
            <h2 class="cart-product-title">${item.title}</h2>
            <span class="cart-price">SAR ${(item.price || 0).toFixed(2)}</span>
            <div class="cart-quantity">
              <button class="quantity-btn decrement">-</button>
              <span class="number">${item.quantity}</span>
              <button class="quantity-btn increment">+</button>
            </div>
          </div>
          <i class="fa-regular fa-trash-can cart-remove"></i>
        `;
  
        // Event listeners for each cart item
        cartBox.querySelector(".cart-remove").addEventListener("click", () => removeCartItem(index));
        cartBox.querySelector(".decrement").addEventListener("click", () => adjustQuantity(index, -1));
        cartBox.querySelector(".increment").addEventListener("click", () => adjustQuantity(index, 1));
  
        cartContent.appendChild(cartBox);
      });
    }
  
    // 7. Adjust Quantity
    function adjustQuantity(index, change) {
      cartItems[index].quantity += change;
      if (cartItems[index].quantity < 1) {
        cartItems.splice(index, 1);
      }
      updateCart();
      saveToLocalStorage();
    }
  
    // 8. Remove Item
    function removeCartItem(index) {
      cartItems.splice(index, 1);
      updateCart();
      saveToLocalStorage();
    }
  
    // 9. Calculate Total
    function updateTotal() {
      const total = cartItems.reduce((sum, item) => {
        return sum + ((item.price || 0) * item.quantity);
      }, 0);
      totalPriceElement.textContent = `SAR ${total.toFixed(2)}`;
    }
  
    // 10. Badge
    function updateCartBadge() {
      const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
      cartBadge.textContent = totalItems;
      cartBadge.style.display = totalItems > 0 ? 'flex' : 'none';
    }
  
    // 11. Complete Purchase
    function completePurchase() {
      // Clear the cart
      cartItems = [];
      updateCart();
      saveToLocalStorage();
  
      // Show a confirmation message
      const confirmation = document.createElement("div");
      confirmation.className = "purchase-confirmation";
      confirmation.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <p>Thank you for your purchase!</p>
      `;
      document.body.appendChild(confirmation);
  
      setTimeout(() => {
        confirmation.remove();
        toggleCart();
      }, 3000);
    }
  
    // 12. Save Cart to LocalStorage
    function saveToLocalStorage() {
      localStorage.setItem('cart', JSON.stringify(cartItems));
    }
  
    // 13. Initial Setup
    updateCart();
  
    // 14. Cart position adjustment on screen size
   
  });