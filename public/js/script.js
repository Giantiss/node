function addToCart(foodId, title, price) {
    fetch('/add-to-cart', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ foodId, title, price })
    })
    .then(response => {
        if (response.ok) {
            // Handle success
            console.log('Item added to cart');

            //update the UI to reflect the added item
            const cartItemsCount = document.getElementById('cart-count');
            cartItemsCount.innerText = parseInt(cartItemsCount.innerText) + 1;
        } else {
            // Handle errors
            console.error('Failed to add item to cart');
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}


function removeFromCart(index) {
    fetch(`/remove-item/${index}`, {
        method: 'POST'
    })
    .then(response => {
        if (response.ok) {
            // Handle success
            console.log('Item removed from cart');

            //update the UI to reflect the removed item
            const cartItemsCount = document.getElementById('cart-count');
            cartItemsCount.innerText = parseInt(cartItemsCount.innerText) - 1;

            //reflect the changes without reloading
            const cartItem = document.getElementById(`cart-item-${index}`);
            cartItem.remove();
        } else {
            // Handle errors
            console.error('Failed to remove item from cart');
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}