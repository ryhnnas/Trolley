import toast from 'react-hot-toast';

export const getCart = () => {
    return JSON.parse(localStorage.getItem('cart')) || [];
};

export const saveCart = (cart) => {
    localStorage.setItem('cart', JSON.stringify(cart));
};

export const updateQuantity = (productId, quantity) => {
    const cart = getCart();
    const productIndex = cart.findIndex(item => item.id === productId);
    if (productIndex > -1) {
        cart[productIndex].quantity = quantity;
    }
    return cart;
};

export const addToCart = (product, quantityToAdd) => {
    const cart = getCart();
    const existingProductIndex = cart.findIndex(item => item.id === product.id);

    if (existingProductIndex > -1) {
        cart[existingProductIndex].quantity += quantityToAdd;
    } else {
        cart.push({ ...product, quantity: quantityToAdd });
    }

    saveCart(cart);
    toast.success(`${quantityToAdd}x ${product.name} ditambahkan ke keranjang!`);
    window.dispatchEvent(new Event('cartUpdated'));
};

export const removeFromCart = (productId) => {
    const cart = getCart();
    const updatedCart = cart.filter(item => item.id !== productId);
    toast.error('Item dihapus dari keranjang!');
    return updatedCart;
};