
class Producto {
    constructor(params){
        this.nombre = params.nombre;
        this.texto = params.texto;
        this.categoria = params.categoria;
        this.precio = params.precio;
        this.stock = params.stock;
        this.id = params.id;
        this.imagen = params.imagen;
    }
}

let listaProductos = [];
const evnt = new Event('update');

const agregarProducto = (id) => {
    listaProductos.filter((producto) => {
        if(producto.id === id){
            guardarProducto(producto);
            Swal.fire({
                title: 'Producto agregado',
                html: `Agregaste <strong>${producto.nombre}</strong> a tu pedido`,
                icon: 'success',
                confirmButtonColor: '#0055af',
              })
        }
    });
};

const guardarProducto = (producto) => {
    const productosLocal = loadProductos();
    productosLocal.push(producto);
    localStorage.setItem('productos', JSON.stringify(productosLocal));
    document.dispatchEvent(evnt);
};

const loadProductos = () => {
    return localStorage.getItem('productos') ? JSON.parse(localStorage.getItem('productos')) : [];
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
    
}

const construirProductos = () => {
    const containerProductos = document.querySelector(".main__content__productos");
    return productos = axios.get('./productos.json')
    .then(function (response) {
        if(response.data && response.data.productos && response.data.productos.length){
            response.data.productos.forEach((producto) => {
                listaProductos.push(
                    new Producto(
                        {
                            nombre: producto.nombre,
                            texto: producto.texto,
                            categoria: producto.categoria,
                            precio:  parseInt(producto.precio),
                            stock: parseInt(producto.stock),
                            id: parseInt(producto.id),
                            imagen: producto.imagen
                        }
                    )
                 )

                 const productoElement = templateProducto(producto);
                 containerProductos.append(productoElement);

            })
        }
    })
}

const templateProducto = (producto) => {
    const divTemp = document.createElement("div");
    divTemp.classList.add('card', 'main__content__card','mb-3','producto'); 
     divTemp.innerHTML = `
        <img src="${producto.imagen}" alt="repa${producto.id}">
        <div class="card-body">
        <h5 class="card-title">${producto.nombre}</h5>
        <p class="card-text"> 
        ${producto.texto}
        </p>
        <p>Precio: $${producto.precio}</p>
            <button type="button" class="btn btn-primary add-product" data-id="${producto.id}">Agregar</button>
        </div>
        `
  
  return divTemp;
}


document.addEventListener("DOMContentLoaded", function (){
    
    construirProductos().then(()=>{
        const agregarBtns = document.querySelectorAll('.add-product');
        agregarBtns.forEach((btn) => {
            btn.addEventListener('click', (e)=>{
                e.stopPropagation();
                agregarProducto(parseInt(e.target.dataset.id));
            })
        });
    }); 


    document.addEventListener('update', ()=>{
        updateList();
    });

    updateList();

   
});


