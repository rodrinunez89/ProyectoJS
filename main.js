
class Producto {
    constructor(params){
        this.nombre = params.nombre;
        this.categoria = params.categoria;
        this.precio = params.precio;
        this.stock = params.stock;
        this.id= params.id;
    }
}

let listaProductos = [];
let listaPedido = [];
const event = new Event('update');


const agregarProducto = (id) => {
    listaProductos.filter((producto) => {
        if(producto.id === id){
            guardarProducto(producto);
        }
    });
};

const guardarProducto = (producto) => {
    const productosLocal = loadProductos();
    productosLocal.push(producto);
    localStorage.setItem('productos', JSON.stringify(productosLocal));
    document.dispatchEvent(event);
};

const loadProductos = () => {
    return localStorage.getItem('productos') ? JSON.parse(localStorage.getItem('productos')) : [];;
};

const totalPrecio = () => {
    const productosLocal = loadProductos();
    let total = 0;
    productosLocal.forEach((producto) => {
        total+=producto.precio;
    })
    return total;
}

const updateList = () => {
    
    const productosLocal = loadProductos();
    const pedidoTitle = document.querySelector('.product-order .card-title');
    const pedidoList = document.querySelector('.product-order .product-list');
    
    if(productosLocal.length){
        pedidoTitle.innerHTML = `Pedido - Total: $${totalPrecio()}`;
        pedidoList.innerHTML = "";
        
        productosLocal.forEach((producto, i) => {
            const li = document.createElement("li");
                  li.innerHTML = `${producto.nombre} - $${producto.precio}`;
            pedidoList.append(li);
        })

    }
contadorNumero();
}


  


document.addEventListener("DOMContentLoaded", function (){
    const productos = document.querySelectorAll('.producto');
    const agregarBtns = document.querySelectorAll('.add-product');

    productos.forEach((producto) => {
        listaProductos.push(new Producto({
            nombre: producto.dataset.nombre,
            categoria: producto.dataset.categoria,
            precio:  parseInt(producto.dataset.precio),
            stock: parseInt(producto.dataset.stock),
            id: parseInt(producto.dataset.id),
            }
        ))
    });

    agregarBtns.forEach((btn) => {
        btn.addEventListener('click', (e)=>{
            e.stopPropagation();
            agregarProducto(parseInt(e.target.dataset.id));
           
        })
    });

    document.addEventListener('update', ()=>{
        updateList();
    });

    updateList();
});


