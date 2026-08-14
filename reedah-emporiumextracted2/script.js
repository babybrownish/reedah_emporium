const products=[
  {name:'Lip Oil',price:2000,desc:'Lightweight moisture + shine.',kind:'oil'},
  {name:'Lip Scrub',price:1500,desc:'Gentle care for soft lips.',kind:'scrub'},
  {name:'Lip Liner',price:1750,desc:'Define and shape your lips.',kind:'liner'},
  {name:'Lip Balm',price:1000,desc:'Simple everyday hydration.',kind:'balm'}
];

const shadeImages={
  Clear:'images/lip-gloss-clear.jpg',
  Nude:'images/lip-gloss-nude.jpg',
  Brown:'images/lip-gloss-brown.jpg',
  Pink:'images/lip-gloss-pink.jpg',
  Berry:'images/lip-gloss-berry.jpg'
};

let selectedShade='Clear';
let cart=[];
const naira=n=>`₦${n.toLocaleString()}`;

function selectShade(shade){
  selectedShade=shade;
  document.getElementById('shadeSelect').value=shade;
  document.getElementById('selectedShade').textContent=shade;
  document.getElementById('shadeImage').src=shadeImages[shade];
  document.querySelectorAll('.thumb').forEach(btn=>{
    btn.classList.toggle('active',btn.dataset.image===shadeImages[shade]);
  });
}

function addGlossToCart(){
  const p={name:"Reedah's Emporium — Lip Gloss",price:3000,desc:"Glossy, juicy everyday shine.",shade:selectedShade};
  addItem(p);
}

function addItem(p){
  const key=p.name+(p.shade||'');
  const existing=cart.find(x=>x.key===key);
  if(existing) existing.qty++;
  else cart.push({...p,key,qty:1});
  renderCart();
  openCart();
}

function renderCart(){
  document.getElementById('cartCount').textContent=cart.reduce((s,x)=>s+x.qty,0);
  document.getElementById('cartItems').innerHTML=cart.length
    ? cart.map((x,i)=>`<div class="cart-row"><div><strong>${x.name}</strong>${x.shade?`<small>Shade: ${x.shade}</small>`:''}<small>Qty: ${x.qty}</small></div><div>${naira(x.price*x.qty)}<br><button onclick="removeItem(${i})" style="border:0;background:none;color:#a35f75;cursor:pointer">Remove</button></div></div>`).join('')
    : '<p style="color:#76666c;padding:30px 0">Your bag is empty.</p>';
  document.getElementById('cartTotal').textContent=naira(cart.reduce((s,x)=>s+x.price*x.qty,0));
}

function removeItem(i){cart.splice(i,1);renderCart()}
function openCart(){document.getElementById('cart').classList.add('open');document.getElementById('overlay').classList.add('open')}
function closeCart(){document.getElementById('cart').classList.remove('open');document.getElementById('overlay').classList.remove('open')}

function checkout(){
  if(!cart.length)return;
  document.getElementById('checkoutTotal').textContent=naira(cart.reduce((s,x)=>s+x.price*x.qty,0));
  document.getElementById('checkoutModal').classList.add('open');
  document.getElementById('checkoutModal').setAttribute('aria-hidden','false');
}

function closeCheckout(){
  document.getElementById('checkoutModal').classList.remove('open');
  document.getElementById('checkoutModal').setAttribute('aria-hidden','true');
}

function toggleAddress(){
  const delivery=document.getElementById('fulfilment').value==='Delivery';
  document.getElementById('addressWrap').style.display=delivery?'grid':'none';
}

function sendOrderToWhatsApp(){
  const name=document.getElementById('customerName').value.trim();
  const phone=document.getElementById('customerPhone').value.trim();
  const fulfilment=document.getElementById('fulfilment').value;
  const address=document.getElementById('customerAddress').value.trim();
  const time=document.getElementById('orderTime').value.trim();
  const payment=document.getElementById('payment').value;
  if(!name||!phone){alert('Please enter your name and phone number.');return}
  if(fulfilment==='Delivery'&&!address){alert('Please enter your delivery address.');return}
  const lines=cart.map(x=>`• ${x.qty} × ${x.name}${x.shade?` — Shade: ${x.shade}`:''} — ${naira(x.price*x.qty)}`).join('\n');
  const total=naira(cart.reduce((s,x)=>s+x.price*x.qty,0));
  const msg=`Hi Reedah's! 💕\n\nI'd like to place an order.\n\nORDER\n${lines}\n\nTotal: ${total}\n\nCUSTOMER DETAILS\nName: ${name}\nPhone: ${phone}\nFulfilment: ${fulfilment}\n${fulfilment==='Delivery'?`Address: ${address}\n`:''}Preferred time: ${time||'Not specified'}\nPayment: ${payment}\n\nPlease confirm my order and the next steps. Thank you!`;
  window.open(`https://wa.me/2348121757186?text=${encodeURIComponent(msg)}`,'_blank');
}

products.forEach((p,i)=>{
  document.getElementById('products').insertAdjacentHTML('beforeend',
    `<article class="card">
      <div class="visual"><div class="tube"><div>Reedah's<br><span>${p.name.toUpperCase()}</span></div></div></div>
      <div class="card-body"><h3>${p.name}</h3><div class="price">${naira(p.price)}</div><p>${p.desc}</p>
      <button class="add" onclick="addItem({...products[${i}]})">Add to bag</button></div>
    </article>`
  );
});

renderCart();
toggleAddress();
