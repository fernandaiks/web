// ----------------- Productos (puedes cambiar imágenes/nombres/precios) -----------------
const PRODUCTS = [
  { id:1, name:"Labial Mate", price:120, img:"img/prod1.jpg" },
  { id:2, name:"Base Líquida", price:250, img:"img/prod2.jpg" },
  { id:3, name:"Rímel Volumen", price:180, img:"img/prod3.jpg" },
  { id:4, name:"Rubor Rosado", price:150, img:"img/prod4.jpg" },
  { id:5, name:"Sombra Duo", price:220, img:"img/prod5.jpg" },
  { id:6, name:"Brochas Premium", price:300, img:"img/prod6.jpg" },
  { id:7, name:"Delineador Líquido", price:140, img:"img/prod7.jpg" },
  { id:8, name:"Iluminador", price:200, img:"img/prod8.jpg" },
  { id:9, name:"Corrector", price:160, img:"img/prod9.jpg" },
  { id:10, name:"Gloss Labial", price:110, img:"img/prod10.jpg" },
  { id:11, name:"Polvo Compacto", price:190, img:"img/prod11.jpg" },
  { id:12, name:"Kit de Cejas", price:170, img:"img/prod12.jpg" }
];

let cart = JSON.parse(localStorage.getItem('rb_cart') || '[]');

// Render galería
function renderGallery() {
  const gal = document.getElementById('galeria');
  if(!gal) return;
  gal.innerHTML = PRODUCTS.map(p => `
    <div class="producto" data-id="${p.id}">
      <img src="${p.img}" alt="${p.name}">
      <h3>${p.name}</h3>
      <p>$${p.price} MXN</p>
      <div style="margin-top:auto">
        <button class="btn add-btn">Agregar al carrito</button>
      </div>
    </div>
  `).join('');
  // agregar listeners
  document.querySelectorAll('.add-btn').forEach(btn=>{
    btn.addEventListener('click', (e)=>{
      const prodDiv = e.target.closest('.producto');
      const id = Number(prodDiv.dataset.id);
      addToCart(id);
    });
  });
}

// Carrito: añadir
function addToCart(id){
  const prod = PRODUCTS.find(p=>p.id===id);
  if(!prod) return;
  const existing = cart.find(i=>i.id===id);
  if(existing) existing.qty++;
  else cart.push({ id:prod.id, name:prod.name, price:prod.price, qty:1 });
  updateCartStorage();
  showCartCount();
  alert(`"${prod.name}" agregado al carrito ✅`);
}

// Mostrar contador
function showCartCount(){
  const count = cart.reduce((s,i)=>s+i.qty,0);
  const el = document.getElementById('cart-count');
  const el2 = document.getElementById('cart-count-2');
  if(el) el.textContent = count;
  if(el2) el2.textContent = count;
}

// Guardar en localStorage
function updateCartStorage(){
  localStorage.setItem('rb_cart', JSON.stringify(cart));
}

// Mostrar modal carrito
function openCartModal(){
  const modal = document.getElementById('cart-modal');
  if(!modal) return;
  const list = document.getElementById('cart-list');
  const total = document.getElementById('cart-total');
  list.innerHTML = '';
  let sum = 0;
  cart.forEach(item=>{
    const li = document.createElement('li');
    li.textContent = `${item.name} x${item.qty} — $${item.price * item.qty} MXN`;
    list.appendChild(li);
    sum += item.price * item.qty;
  });
  total.textContent = `Total: $${sum} MXN`;
  modal.style.display = 'flex';
}

// Cerrar modal
function closeCartModal(){
  const modal = document.getElementById('cart-modal');
  if(modal) modal.style.display = 'none';
}

// Finalizar compra (simulada)
function checkout(){
  if(cart.length===0){ alert('Tu carrito está vacío.'); return; }
  const order = { id: 'ORD' + Date.now(), items: cart, total: cart.reduce((s,i)=>s+i.qty*i.price,0) };
  localStorage.setItem('rb_last_order', JSON.stringify(order));
  cart = [];
  updateCartStorage();
  showCartCount();
  closeCartModal();
  alert('Compra realizada. Gracias ✨');
}

// Formulario de contacto (muestra confirmación)
function initContactForm(){
  const form = document.getElementById('contact-form');
  if(!form) return;
  form.addEventListener('submit', (e)=>{
    e.preventDefault();
    const name = document.getElementById('name').value.trim();
    const feedback = document.getElementById('contact-feedback');
    feedback.textContent = `Gracias ${name || ''}! ✨ Tu mensaje fue recibido.`;
    form.reset();
  });
}

// Listeners iniciales
document.addEventListener('DOMContentLoaded', ()=>{
  renderGallery();
  showCartCount();
  initContactForm();

  // abrir carrito desde header (dos botones posibles)
  const open = document.getElementById('open-cart');
  const open2 = document.getElementById('open-cart-2');
  const closeBtn = document.getElementById('close-cart');
  const checkoutBtn = document.getElementById('checkout-btn');

  if(open) open.addEventListener('click', (e)=>{ e.preventDefault(); openCartModal(); });
  if(open2) open2.addEventListener('click', (e)=>{ e.preventDefault(); openCartModal(); });
  if(closeBtn) closeBtn.addEventListener('click', closeCartModal);
  if(checkoutBtn) checkoutBtn.addEventListener('click', checkout);

  // cerrar modal si clic fuera
  const modal = document.getElementById('cart-modal');
  if(modal) modal.addEventListener('click', e=>{
    if(e.target === modal) closeCartModal();
  });
});
// Animar productos al hacer scroll
window.addEventListener('scroll', ()=>{
  const productos = document.querySelectorAll('.producto');
  const trigger = window.innerHeight * 0.9;
  productos.forEach(p=>{
    const top = p.getBoundingClientRect().top;
    if(top < trigger){
      p.style.opacity = '1';
      p.style.transform = 'translateY(0)';
      p.style.transition = 'all 0.6s ease-out';
    }
  });
});
