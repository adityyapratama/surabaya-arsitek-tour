let destinations = [];
let tourPackages = [];
let ongoingEvts = [];
let upcomingEvts = [];

let wishlist=[],cart=[],orders=[],currentDetail=null,prevPage='explore';
let ticketQtys={dewasa:0,pelajar:0,anak:0};
let pendingCheckout=null;

// FUNGSI UNTUK MENGAMBIL DATA DARI DATABASE (API)
async function fetchData() {
  try {
    const [resDest, resTours, resEvents] = await Promise.all([
      fetch('http://localhost:3000/api/destinations'),
      fetch('http://localhost:3000/api/tours'),
      fetch('http://localhost:3000/api/events')
    ]);

    destinations = await resDest.json();
    tourPackages = await resTours.json();
    const allEvents = await resEvents.json();
    
    // Klasifikasikan event
    ongoingEvts = allEvents.filter(e => e.event_status === 'ongoing');
    upcomingEvts = allEvents.filter(e => e.event_status === 'upcoming');

    // Render ulang UI setelah data didapat
    renderHome();
    renderExplore();
    renderEvents();
    renderTours();
  } catch (err) {
    console.error('Gagal mengambil data dari API:', err);
    showToast('Koneksi ke server database gagal!');
  }
}

function showToast(msg){const t=document.getElementById('toast');t.textContent=msg;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),2500);}
function updateCartBadge(){document.getElementById('cart-count').textContent=cart.length;}

function renderHome(){
  document.getElementById('featured-cards').innerHTML=destinations.slice(0,5).map(d=>`
    <div class="card" onclick="openDetail(${d.id},'home')">
      <div class="card-img">${d.emoji}</div>
      <div class="card-body"><span class="tag">${d.tag}</span><div class="card-name">${d.name}</div>
      <div class="card-meta"><span>${(d.addr||'').split(',')[0]}</span><span class="star">${d.rating}</span></div></div>
    </div>`).join('');
  const allR=destinations.flatMap(d=>(d.reviews||[]).map(r=>({...r,spot:d.name}))).slice(0,3);
  document.getElementById('home-reviews').innerHTML=allR.map(r=>`
    <div class="review-card">
      <div class="review-user"><div class="avatar">${(r.u||'?')[0]}</div><div><div class="review-name">${r.u}</div><div class="review-spot">${r.spot}</div></div></div>
      <div class="review-stars">${r.s}</div><div class="review-text">${r.t}</div>
    </div>`).join('');
}

function renderExplore(type='all'){
  const list=type==='all'?destinations:destinations.filter(d=>d.type===type);
  document.getElementById('explore-list').innerHTML=list.map(d=>`
    <div class="explore-card" onclick="openDetail(${d.id},'explore')">
      <div class="explore-img">${d.emoji}</div>
      <div><div class="explore-name">${d.name}</div>
      <div class="explore-desc">${(d.description || '').substring(0,90)}…</div>
      <div class="explore-meta"><span class="tag">${d.tag}</span><span class="star">${d.rating}</span><span style="color:var(--text-muted)">${d.price}</span></div></div>
    </div>`).join('');
}

function renderEvents(){
  document.getElementById('ongoing-events').innerHTML=ongoingEvts.map(e=>`
    <div class="event-card">
      <div class="event-date-box"><div class="event-day">${e.day}</div><div class="event-mon">${e.month}</div></div>
      <div class="event-info"><div class="event-name">${e.name}</div><div class="event-detail">📍 ${e.venue}</div><div class="event-detail" style="margin-top:3px">${e.detail}</div></div>
      <div class="event-right"><span class="badge-live">Live now</span><div style="font-size:12px;color:var(--text-muted)">${e.price_label}</div>
      <button class="ticket-btn" onclick="addEventToCart(${e.price_num || 0},'${e.name.replace(/'/g,"\\'")}','${e.day} ${e.month}')">Beli Tiket</button></div>
    </div>`).join('');
  document.getElementById('upcoming-events').innerHTML=upcomingEvts.map(e=>`
    <div class="event-card">
      <div class="event-date-box"><div class="event-day">${e.day}</div><div class="event-mon">${e.month}</div></div>
      <div class="event-info"><div class="event-name">${e.name}</div><div class="event-detail">📍 ${e.venue}</div><div class="event-detail" style="margin-top:3px">${e.detail}</div></div>
      <div class="event-right"><span class="badge-soon">Coming soon</span><div style="font-size:12px;color:var(--text-muted)">${e.price_label}</div>
      <button class="remind-btn" onclick="showToast('Pengingat diaktifkan!')">Ingatkan saya</button></div>
    </div>`).join('');
}

function renderTours(){
  document.getElementById('tour-grid').innerHTML=tourPackages.map(t=>`
    <div class="tour-card ${t.featured?'featured':''}">
      <div class="tour-img">${t.emoji}${t.badge?`<span class="tour-badge">${t.badge}</span>`:''}</div>
      <div class="tour-body">
        <div class="tour-name">${t.name}</div>
        <div class="tour-desc">${t.description}</div>
        <div class="tour-features">${(t.features||[]).map(f=>`<div class="tour-feat">${f}</div>`).join('')}</div>
        <div class="tour-footer">
          <div><div class="tour-price">${t.priceLabel}</div><div class="tour-price-sub">${t.unit}</div></div>
          <button class="buy-tour-btn" onclick="addTourToCart('${t.id}')">Pesan Sekarang</button>
        </div>
      </div>
    </div>`).join('');
}

function renderWishlist(){
  const g=document.getElementById('wishlist-grid');
  if(!wishlist.length){g.innerHTML='<div class="empty-state">Belum ada yang tersimpan.<br>Klik ♡ Simpan di halaman destinasi manapun.</div>';return;}
  g.innerHTML=wishlist.map(d=>`
    <div class="wish-card">
      <div class="wish-img">${d.emoji}</div>
      <div class="wish-body"><div class="wish-name">${d.name}</div><div class="wish-cat">${d.tag} · ${d.addr.split(',')[0]}</div>
      <div class="wish-actions">
        <button class="wish-btn" onclick="openDetail(${d.id},'wishlist')">Lihat</button>
        <button class="wish-btn remove" onclick="removeWishlist(${d.id})">Hapus</button>
      </div></div>
    </div>`).join('');
}

function renderCart(){
  const cl=document.getElementById('cart-list');
  if(!cart.length){
    cl.innerHTML='<div class="empty-state" style="margin-bottom:1rem;">Keranjang kosong. Tambahkan tiket atau paket tur!</div>';
    document.getElementById('cart-summary-box').innerHTML='';return;
  }
  cl.innerHTML=cart.map((item,i)=>`
    <div class="cart-item">
      <div class="cart-emoji">${item.emoji}</div>
      <div class="cart-item-info"><div class="cart-item-name">${item.name}</div><div class="cart-item-sub">${item.sub}</div></div>
      <div class="cart-item-price">${item.priceLabel}</div>
      <button class="cart-remove" onclick="removeCart(${i})">✕</button>
    </div>`).join('');
  const total=cart.reduce((s,i)=>s+i.priceNum,0);
  document.getElementById('cart-summary-box').innerHTML=`
    <div class="cart-summary">
      <div class="cart-row"><span style="color:var(--text-muted)">Subtotal (${cart.length} item)</span><span>Rp ${total.toLocaleString('id-ID')}</span></div>
      <div class="cart-row"><span style="color:var(--text-muted)">Biaya layanan</span><span>Rp 5.000</span></div>
      <div class="cart-total-row"><span>Total</span><span style="color:var(--green-700)">Rp ${(total+5000).toLocaleString('id-ID')}</span></div>
      <button class="checkout-btn" style="margin-top:1rem" onclick="openCartCheckout()">Bayar Sekarang →</button>
    </div>`;
}

function renderOrders(){
  const el=document.getElementById('order-history');
  if(!orders.length){el.innerHTML='<div class="empty-state" style="grid-column:unset;border:none;background:var(--gray-50);">Belum ada pesanan.</div>';return;}
  el.innerHTML=orders.map(o=>`
    <div class="order-item">
      <div class="order-emoji">${o.emoji}</div>
      <div class="order-info"><div class="order-name">${o.name}</div><div class="order-meta">${o.sub}</div></div>
      <span class="badge-paid">Lunas</span>
      <div class="order-price">${o.priceLabel}</div>
    </div>`).join('');
}

// TICKET WIDGET
function renderTicketBox(d){
  ticketQtys={dewasa:0,pelajar:0,anak:0};
  if(d.priceNum===0){document.getElementById('ticket-box').style.display='none';return;}
  document.getElementById('ticket-box').style.display='block';
  const types=[
    {key:'dewasa',label:'Dewasa',sub:'Usia 17+',price:d.priceNum},
    {key:'pelajar',label:'Pelajar / Mahasiswa',sub:'Dengan kartu pelajar',price:Math.round(d.priceNum*0.75)},
    {key:'anak',label:'Anak-anak',sub:'Usia 5–16 tahun',price:Math.round(d.priceNum*0.5)}
  ];
  window._ticketTypes=types;
  document.getElementById('ticket-rows').innerHTML=types.map(tp=>`
    <div class="ticket-row">
      <div class="ticket-type">${tp.label}<div class="ticket-type-sub">${tp.sub}</div></div>
      <div class="ticket-price-label">Rp ${tp.price.toLocaleString('id-ID')}</div>
      <div class="ticket-qty">
        <button class="qty-btn" onclick="changeQty('${tp.key}',-1)">−</button>
        <span class="qty-num" id="qty-${tp.key}">0</span>
        <button class="qty-btn" onclick="changeQty('${tp.key}',1)">+</button>
      </div>
    </div>`).join('');
  updateTicketTotal();
}

function changeQty(key,delta){
  ticketQtys[key]=Math.max(0,(ticketQtys[key]||0)+delta);
  document.getElementById('qty-'+key).textContent=ticketQtys[key];
  updateTicketTotal();
}

function updateTicketTotal(){
  const types=window._ticketTypes||[];
  let total=0;
  types.forEach(tp=>{total+=(ticketQtys[tp.key]||0)*tp.price;});
  document.getElementById('ticket-total').textContent='Rp '+total.toLocaleString('id-ID');
}

function openTicketCheckout(){
  const types=window._ticketTypes||[];
  let total=0,rows='',hasAny=false;
  types.forEach(tp=>{
    const q=ticketQtys[tp.key]||0;
    if(q>0){total+=q*tp.price;rows+=`<div class="modal-row"><span class="modal-row-label">${tp.label} x${q}</span><span class="modal-row-val">Rp ${(q*tp.price).toLocaleString('id-ID')}</span></div>`;hasAny=true;}
  });
  if(!hasAny){showToast('Pilih minimal 1 tiket terlebih dahulu!');return;}
  rows+=`<div class="modal-row"><span class="modal-row-label" style="font-weight:500">Total</span><span class="modal-row-val" style="color:var(--green-700)">Rp ${total.toLocaleString('id-ID')}</span></div>`;
  document.getElementById('modal-title').textContent='Konfirmasi Tiket — '+currentDetail.name;
  document.getElementById('modal-sub').textContent='Periksa detail pesanan sebelum membayar.';
  document.getElementById('modal-details').innerHTML=rows;
  pendingCheckout={type:'ticket',dest:currentDetail,total};
  document.getElementById('checkout-modal').classList.add('open');
}

function openCartCheckout(){
  const total=cart.reduce((s,i)=>s+i.priceNum,0)+5000;
  const rows=cart.map(i=>`<div class="modal-row"><span class="modal-row-label">${i.name}</span><span class="modal-row-val">${i.priceLabel}</span></div>`).join('')+
    `<div class="modal-row"><span class="modal-row-label" style="font-weight:500">Total</span><span class="modal-row-val" style="color:var(--green-700)">Rp ${total.toLocaleString('id-ID')}</span></div>`;
  document.getElementById('modal-title').textContent='Konfirmasi Pembayaran';
  document.getElementById('modal-sub').textContent='Kamu akan membayar '+cart.length+' item dalam keranjang.';
  document.getElementById('modal-details').innerHTML=rows;
  pendingCheckout={type:'cart',total,cartItems:[...cart]};
  document.getElementById('checkout-modal').classList.add('open');
}

function confirmPurchase(){
  if(!pendingCheckout)return;
  if(pendingCheckout.type==='ticket'){
    orders.push({emoji:pendingCheckout.dest.emoji,name:pendingCheckout.dest.name,sub:'Tiket masuk · '+new Date().toLocaleDateString('id-ID'),priceLabel:'Rp '+pendingCheckout.total.toLocaleString('id-ID'),priceNum:pendingCheckout.total});
    ticketQtys={dewasa:0,pelajar:0,anak:0};
    if(window._ticketTypes)window._ticketTypes.forEach(tp=>{const el=document.getElementById('qty-'+tp.key);if(el)el.textContent='0';});
    updateTicketTotal();
  } else if(pendingCheckout.type==='cart'){
    pendingCheckout.cartItems.forEach(item=>{orders.push({emoji:item.emoji,name:item.name,sub:item.sub+' · '+new Date().toLocaleDateString('id-ID'),priceLabel:item.priceLabel,priceNum:item.priceNum});});
    cart=[];updateCartBadge();renderCart();
  } else if(pendingCheckout.type==='tour'){
    orders.push({emoji:pendingCheckout.emoji,name:pendingCheckout.name,sub:'Paket Tur · '+new Date().toLocaleDateString('id-ID'),priceLabel:'Rp '+pendingCheckout.total.toLocaleString('id-ID'),priceNum:pendingCheckout.total});
  }
  renderOrders();
  closeModal('checkout-modal');
  document.getElementById('success-modal').classList.add('open');
  pendingCheckout=null;
}

function goToOrders(){
  showPage('account',document.querySelectorAll('.nav-link')[5]);
  showAcct('orders',document.querySelectorAll('.acct-menu')[1]);
}

function closeModal(id){document.getElementById(id).classList.remove('open');}

function addEventToCart(priceNum,name,date){
  cart.push({name,sub:'Event · '+date,emoji:'🎪',priceNum,priceLabel:'Rp '+priceNum.toLocaleString('id-ID')});
  updateCartBadge();showToast(name+' ditambahkan ke keranjang!');
}

function addTourToCart(id){
  const t=tourPackages.find(x=>x.id===id);
  pendingCheckout={type:'tour',name:t.name,emoji:t.emoji,total:t.price};
  const rows=`<div class="modal-row"><span class="modal-row-label">${t.name}</span><span class="modal-row-val">${t.priceLabel}</span></div>
    <div class="modal-row"><span class="modal-row-label">${t.unit}</span><span class="modal-row-val" style="color:var(--green-700)">${t.priceLabel}</span></div>`;
  document.getElementById('modal-title').textContent='Pesan Paket Tur';
  document.getElementById('modal-sub').textContent=t.name+' — konfirmasi pemesanan kamu.';
  document.getElementById('modal-details').innerHTML=rows;
  document.getElementById('checkout-modal').classList.add('open');
}

function removeCart(i){cart.splice(i,1);updateCartBadge();renderCart();}

function openDetail(id,from){
  prevPage=from||'explore';
  const d=destinations.find(x=>x.id===id);
  currentDetail=d;
  document.getElementById('d-emoji').textContent=d.emoji;
  document.getElementById('d-tag').textContent=d.tag;
  document.getElementById('d-name').textContent=d.name;
  document.getElementById('d-addr').textContent='📍 '+d.addr;
  document.getElementById('d-price').textContent=d.price;
  document.getElementById('d-hours').textContent=d.hours;
  document.getElementById('d-rating').textContent=d.rating;
  document.getElementById('d-desc').textContent=d.description;
  document.getElementById('d-transport').innerHTML=(d.transport||[]).map(t=>`<div class="transport-item"><span>${t}</span><span style="color:var(--green-600)">→</span></div>`).join('');
  document.getElementById('d-reviews').innerHTML=(d.reviews||[]).map(r=>`
    <div class="detail-review-card">
      <div style="display:flex;align-items:center;gap:9px;margin-bottom:7px;"><div class="avatar">${(r.u||'?')[0]}</div><div><div style="font-size:13px;font-weight:500">${r.u}</div><div style="font-size:12px;color:var(--amber-600)">${r.s}</div></div></div>
      <div style="font-size:13px;color:var(--text-muted)">${r.t}</div>
    </div>`).join('');
  renderTicketBox(d);
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
  document.getElementById('detail').classList.add('active');
  window.scrollTo(0,0);
}

function closeDetail(){
  document.getElementById('detail').classList.remove('active');
  document.getElementById('page-'+prevPage).classList.add('active');
  const pages=['home','explore','events','tours','wishlist','account'];
  document.querySelectorAll('.nav-link').forEach((l,i)=>{l.classList.toggle('active',pages[i]===prevPage);});
  window.scrollTo(0,0);
}

function addToWishlist(){
  if(!currentDetail)return;
  if(wishlist.find(x=>x.id===currentDetail.id)){showToast('Sudah ada di wishlist!');return;}
  wishlist.push(currentDetail);showToast(currentDetail.name+' disimpan ke wishlist ♡');
}

function removeWishlist(id){wishlist=wishlist.filter(x=>x.id!==id);renderWishlist();}

function showPage(name,el){
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
  document.getElementById('detail').classList.remove('active');
  document.getElementById('page-'+name).classList.add('active');
  document.querySelectorAll('.nav-link').forEach(l=>l.classList.remove('active'));
  if(el)el.classList.add('active');
  if(name==='wishlist')renderWishlist();
  if(name==='cart')renderCart();
  window.scrollTo(0,0);
}

function filterExplore(type,el){
  document.querySelectorAll('.filter-btn').forEach(b=>b.classList.remove('active'));
  el.classList.add('active');renderExplore(type);
}

function showAcct(name,el){
  document.querySelectorAll('.account-section').forEach(s=>s.classList.remove('active'));
  document.getElementById('acct-'+name).classList.add('active');
  document.querySelectorAll('.acct-menu').forEach(m=>m.classList.remove('active'));
  el.classList.add('active');
}

// Inisialisasi awal UI
fetchData();