const products = [
  {id:1,name:'سرم آبرسان و شاداب‌کننده پوست',category:'skin',label:'مراقبت پوست',price:485000,image:'2.jpg',badge:'محبوب'},
  {id:2,name:'رژ لب مخملی رنگ رز',category:'makeup',label:'آرایشی',price:365000,image:'3.jpg',badge:'پرفروش'},
  {id:3,name:'ادو پرفیوم زنانه رایحه گل',category:'perfume',label:'عطر و ادکلن',price:1290000,image:'4.jpg',badge:'خاص'},
  {id:4,name:'سرم لطافت‌بخش پوست',category:'skin',label:'مراقبت پوست',price:520000,image:'2.jpg',badge:'جدید'},
  {id:5,name:'رژ لب و رژگونه هلویی',category:'makeup',label:'آرایشی',price:395000,image:'3.jpg',badge:'محبوب'},
  {id:6,name:'عطر زنانه رایحه ملایم',category:'perfume',label:'عطر و ادکلن',price:1390000,image:'4.jpg',badge:'جدید'},
  {id:7,name:'سرم مراقبت روزانه پوست',category:'skin',label:'مراقبت پوست',price:450000,image:'2.jpg',badge:'منتخب'},
  {id:8,name:'رژ لب کرمی رنگ طبیعی',category:'makeup',label:'آرایشی',price:345000,image:'3.jpg',badge:'منتخب'}
];
const fa = n => Number(n).toLocaleString('fa-IR');
let cart = {}; let likes = new Set();
try { cart = JSON.parse(localStorage.getItem('gisoo-cart') || '{}') || {}; likes = new Set(JSON.parse(localStorage.getItem('gisoo-likes') || '[]')); } catch(e) { cart = {}; likes = new Set(); }
let category = 'all', query = '';
const grid = document.getElementById('productGrid');
const toast = document.getElementById('toast'); let toastTimer;
function notify(text){toast.textContent=text;toast.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.classList.remove('show'),2600)}
function save(){try{localStorage.setItem('gisoo-cart',JSON.stringify(cart));localStorage.setItem('gisoo-likes',JSON.stringify([...likes]));}catch(e){}}
function renderProducts(){
  const shown=products.filter(p=>(category==='all'||p.category===category)&&(!query||(`${p.name} ${p.label}`).includes(query)));
  grid.innerHTML=shown.map(p=>`<article class="product"><div class="product-img"><img src="${p.image}" alt="تصویر نمونه ${p.name}" loading="lazy"><span class="badge">${p.badge}</span><button class="heart ${likes.has(p.id)?'liked':''}" data-like="${p.id}" aria-label="${likes.has(p.id)?'حذف از علاقه‌مندی‌ها':'افزودن به علاقه‌مندی‌ها'}">${likes.has(p.id)?'♥':'♡'}</button></div><div class="product-info"><small>${p.label}</small><h3>${p.name}</h3><div class="stars" aria-label="امتیاز نمایشی">★★★★★</div><div class="product-bottom"><span class="price">${fa(p.price)} <small>تومان</small></span><button class="add" data-add="${p.id}" aria-label="افزودن ${p.name} به سبد خرید">+</button></div></div></article>`).join('');
  document.getElementById('emptyResults').classList.toggle('hidden',shown.length>0);
  document.querySelectorAll('.tab').forEach(el=>el.classList.toggle('selected',el.dataset.filter===category));
}
function renderCart(){
  const items=products.filter(p=>Number(cart[p.id])>0);
  const count=items.reduce((n,p)=>n+Number(cart[p.id]),0), total=items.reduce((n,p)=>n+p.price*Number(cart[p.id]),0);
  document.getElementById('cartCount').textContent=fa(count);
  document.getElementById('cartTotal').textContent=fa(total)+' تومان';
  document.getElementById('cartItems').innerHTML=items.length?items.map(p=>`<div class="cart-item"><img src="${p.image}" alt=""><div class="cart-item-info"><b>${p.name}</b><small>${fa(p.price)} تومان</small></div><div class="qty"><button data-qty="${p.id}" data-delta="1" aria-label="افزودن یک عدد">+</button><span>${fa(cart[p.id])}</span><button data-qty="${p.id}" data-delta="-1" aria-label="کم کردن یک عدد">−</button></div></div>`).join(''):'<div class="cart-empty">♡<br>سبد خریدت هنوز خالیه.<br>بیا یه انتخاب قشنگ داشته باشیم!</div>';
}
document.addEventListener('click',e=>{
  const filter=e.target.closest('[data-filter]'); if(filter){category=filter.dataset.filter;query='';document.getElementById('searchInput').value='';renderProducts()}
  const add=e.target.closest('[data-add]');if(add){const id=add.dataset.add;cart[id]=(Number(cart[id])||0)+1;save();renderCart();notify('به سبد خرید نمایشی اضافه شد ♡')}
  const like=e.target.closest('[data-like]');if(like){const id=Number(like.dataset.like);likes.has(id)?likes.delete(id):likes.add(id);save();renderProducts();notify(likes.has(id)?'به علاقه‌مندی‌ها اضافه شد':'از علاقه‌مندی‌ها حذف شد')}
  const qty=e.target.closest('[data-qty]');if(qty){const id=qty.dataset.qty;cart[id]=(Number(cart[id])||0)+Number(qty.dataset.delta);if(cart[id]<=0)delete cart[id];save();renderCart()}
});
document.getElementById('searchForm').addEventListener('submit',e=>{e.preventDefault();query=document.getElementById('searchInput').value.trim();category='all';renderProducts();document.getElementById('products').scrollIntoView({behavior:'smooth'})});
function setCart(open){document.getElementById('cartPanel').classList.toggle('open',open);document.getElementById('cartPanel').setAttribute('aria-hidden',String(!open));document.getElementById('overlay').classList.toggle('hidden',!open);document.body.style.overflow=open?'hidden':'';if(open)document.getElementById('closeCart').focus();else document.getElementById('openCart').focus()}
document.getElementById('openCart').addEventListener('click',()=>setCart(true));document.getElementById('closeCart').addEventListener('click',()=>setCart(false));document.getElementById('overlay').addEventListener('click',()=>setCart(false));document.addEventListener('keydown',e=>{if(e.key==='Escape'&&document.getElementById('cartPanel').classList.contains('open'))setCart(false)});
document.getElementById('checkout').addEventListener('click',()=>notify('این سایت دمو است و امکان ثبت سفارش واقعی ندارد.'));
renderProducts();renderCart();
