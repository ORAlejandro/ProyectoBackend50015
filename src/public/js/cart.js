class FunctionsCart {
    deleteProduct(cartId, productId) {
        fetch(`/api/carts/${cartId}/product/${productId}`, {
            method: 'DELETE'
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error("Failed: No se pudo eliminar el producto del carrito");
                }
                location.reload();
            })
            .catch(error => {
                console.error("Error en deleteProduct: ", error);
            });
    }

    clearCart(cartId) {
        fetch(`/api/carts/${cartId}`, {
            method: 'DELETE'
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error("Failed: Error al intentar vaciar el carrito");
                }
                location.reload();
            })
            .catch(error => {
                console.error("Error en clearCart: ", error);
            });
    }
}

module.exports = FunctionsCart;