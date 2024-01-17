const socket = io();

socket.on("productos", (data) => {
    renderProductos(data);
}); 

const renderProductos = (productos) => {
    const contenedorProductos = document.getElementById("contenedorProductos");
    contenedorProductos.innerHTML = "";


    productos.forEach(item => {
        const card = document.createElement("div");
        card.classList.add("cardEach");
        card.innerHTML = `
                <p>Id ${item.id} </p>
                <p>Titulo ${item.title} </p>
                <p>Precio ${item.price} </p>
                <button class="btnStyle"> Eliminar </button>
        
        `;
        contenedorProductos.appendChild(card);

        card.querySelector("button").addEventListener("click", () => {
            eliminarProducto(item.id);
        });
    });
}

const eliminarProducto = (id) => {
    socket.emit("eliminarProducto", id);
}

document.getElementById("btnEnviar").addEventListener("click", () => {
    agregarProducto();
});

const agregarProducto = () => {
    const producto = {
        title: document.getElementById("title").value,
        description: document.getElementById("description").value,
        price: document.getElementById("price").value,
        thumbnail: document.getElementById("thumbnail").value,
        code: document.getElementById("code").value,
        stock: document.getElementById("stock").value,
        category: document.getElementById("category").value,
        status: document.getElementById("status").value === "true"
    };
    
    socket.emit("agregarProducto", producto);
};