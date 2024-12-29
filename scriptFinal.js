// Existing code remains unchanged
let productosData;//Declaro una variable para guardar la data de los productos con let para inicializarlo mas tarde
let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
/*Esto crea un carrito en el localStorage para guardar los items que agrego a este, si no hay items en el carrito(por lo cual es false) 
el default de la variable carrito es un array vacio */


fetch('https://fakestoreapi.com/products?limit=3') //Traigo solo 3 productos ya que eso requeria la consigna.
    .then(res => res.json())
    .then(json => {
        productosData = json;  
        crearArticulos(productosData);//Creo las tarjetas de productos con la funcion de la linea 21 crearArticulos
        actualizarCarrito()//Muestra el carrito
    })
    .catch(error => {
        console.error('Error al obtener los datos de fakestoreAPI');
    });



function crearArticulos(productos) {
    const Categoria = document.getElementById('div-de-productos');

    productos.forEach(producto => {
        const tarjeta = document.createElement('article'); //Crea un elemento HTML article ya que esto es mas preciso para describir una tarjeta de producto.
        tarjeta.className = 'tarjeta-de-producto';
        
        const img = document.createElement('img'); //Agrega la imagen
        /*img.innerHTML = `src="${product.image}" alt="${product.title}" width=250 height=350`
        Aqui intente hacerlo funcionar con .innerHTML y un template literal pero no pude, por lo cual use otro metodo*/
        img.src = producto.image;
        img.alt = producto.title;
        img.width = 250;
        img.height = 350;
        tarjeta.appendChild(img);

        const title = document.createElement('h2');//Agrega el title
        title.innerHTML = `${producto.title}`;
        tarjeta.appendChild(title);

        const price = document.createElement('p'); //Agrega el precio
        price.innerHTML = `$${producto.price}`;
        price.className = 'Numero-De-Precio';
        tarjeta.appendChild(price);

        const button = document.createElement('button');  //Crea boton para agregar al carrito al hacer click
        button.innerHTML = '<img src="carrito-de-compras.png" alt="Un simbolo de carrito de compras">';
        button.onclick = () => {
            agregarACarrito(producto);
        };
        tarjeta.appendChild(button);

        Categoria.appendChild(tarjeta);//Esto agrega la tarjeta de producto a el <div> con el id="div-de-productos"
    });
}

function agregarACarrito(producto) {
    carrito.push(producto);
    localStorage.setItem('carrito', JSON.stringify(carrito)); //Esto lo guarda en el local storage con JSON.stringify() ya que el local storage solo acepta strings
    actualizarCarrito()
}

function quitarDeCarrito(productoid) {
    carrito = carrito.filter(asd123 => asd123.id !== productoid); /*Esto utiliza filter para devolver un nuevo array con una arrow function
    si el id del producto testeado es distinto al id de los productos en el carrito este se agrega al nuevo array de carrito, si el ID existe en el array se filtra y no aparece en el nuevo array
    creado por el metodo filter*/
    localStorage.setItem('carrito', JSON.stringify(carrito)); //guarda el nuevo carrito en el local storage
    actualizarCarrito();
}

function actualizarCarrito() {
    const carritoItems = document.getElementById('carrito-items');
    const carritoTotal = document.getElementById('carrito-total');
    const productosEnCarrito = document.getElementById('productos-en-carrito');
    carritoItems.innerHTML = ''; 

    let total = 0;
    let cantidades = {};

    carrito.forEach(producto => {
        if (cantidades[producto.id]) { 
            cantidades[producto.id].cantidad++; //si el producto ya existe y tiene la propiedad "cantidad" le suma el valor de 1
        } else {
            cantidades[producto.id] = { ...producto, cantidad: 1 }; //esto crea una nueva propiedad llamada cantidad y setea el valor el 1
        }
    });

    for (let productId in cantidades) {
        const producto = cantidades[productId];
        const li = document.createElement('li');
        li.className = 'carrito-item';
        li.innerHTML = `
            <span class="carrito-font-size">
                ${producto.title}
                <img src="${producto.image}" width=45 height=45 alt="${producto.title}"> 
                <button onclick="quitarDeCarrito(${producto.id});"> <img src="basura-32px.png"> </button> 
                <button onclick="sumarProducto(${producto.id});"> + </button>
                <button onclick="restarProducto(${producto.id});"> - </button>
                Cantidad: ${producto.cantidad}
                <br> 
                $${producto.price}
            </span>
        `;
        carritoItems.appendChild(li);
        total += producto.price * producto.cantidad;
    }

    //Muestra el valor total de los productos 
    carritoTotal.textContent = `Total: $${total.toFixed(2)}`; //Utilizo .toFixed(2) para siempre mostrar 2 decimales.

    const itemsTotales = carrito.length; //Muestra cuantos productos hay en total
    let productosTotales = `Productos totales: ${itemsTotales}<br>`; 

    productosEnCarrito.innerHTML = productosTotales;

    if (total === 0) {  //Esto muestra un texto con una imagen de un carrito si el carrito esta vacio.
        carritoTotal.innerHTML = ` 
        <p> 
            <img src="carrito-de-compras-vacio.png" alt="Un carrito de compras vacio">
            <br>
            <span id="carro-vacio">Tu carrito esta vacio! </span>
            <br>
            <span id="aun-no-tienes-articulos">Aun no tienes articulos en tu carrito de compras.</span>
        </p>
        `;
        
        productosEnCarrito.textContent = ''; //Esto saca el texto si el carrito esta vacio.
    }
}

//Uso .find para buscar el id de un producto en el carrito, si lo encuentra
function sumarProducto(productoid) {
    const producto = carrito.find(asd123 => asd123.id === productoid);
    agregarACarrito(producto);
}

function restarProducto(productoid) {
    const index = carrito.findIndex(asd123 => asd123.id === productoid);
    if (index !== -1) {
        carrito.splice(index, 1);
        localStorage.setItem('carrito', JSON.stringify(carrito));
        actualizarCarrito();
    }
}
