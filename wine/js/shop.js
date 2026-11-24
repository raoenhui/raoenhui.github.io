'use strict';
const catalog = window.WineCatalog;
const shippingRules = window.WineShipping;
const byId = new Map(catalog.map(item => [item.id, item]));
const $ = selector => document.querySelector(selector);
const cartDialog = $('#cart');
const detailDialog = $('#product-detail');
const wxId = 'r670615769';
const storageKey = 'jiaoxiao-wine-cart-v1';
const money = amount => `¥${amount.toLocaleString('zh-CN')}`;
const icon = name => `<svg aria-hidden="true"><use href="#i-${name}"/></svg>`;
const provinceSet = new Set(shippingRules.groups.flatMap(group => group.provinces));
const series = ['全部', ...new Set(catalog.map(item => item.series))];
let activeSeries = '全部';
let opener;
let toastTimer;
const state = {cart:Object.create(null), method:'shipping', province:''};
// Keep contact and address details only in this tab's memory, never in localStorage.
const deliveryAddress = {region:'', recipient:'', phone:'', locality:'', street:''};
const addressFields = [
  {key:'region', label:'其他省／地区', autocomplete:'shipping address-level1', placeholder:'请填写实际省份或地区', max:40},
  {key:'recipient', label:'收件人', autocomplete:'shipping name', placeholder:'请输入收件人姓名', max:40},
  {key:'phone', label:'联系电话', autocomplete:'shipping tel', placeholder:'请输入手机号或座机', max:24, type:'tel'},
  {key:'locality', label:'市／区县', autocomplete:'shipping address-level2', placeholder:'如：苏州市吴中区；直辖市填区县', max:80},
  {key:'street', label:'详细地址', autocomplete:'shipping address-line1', placeholder:'街道、门牌号、小区、楼栋及房间号', max:180},
];

try {
  const saved = JSON.parse(localStorage.getItem(storageKey));
  if (saved) {
    state.method = saved.method === 'pickup' ? 'pickup' : 'shipping';
    state.province = provinceSet.has(saved.province) || saved.province === 'other' ? saved.province : '';
    for (const [id, qty] of Object.entries(saved.cart || {})) {
      if (byId.get(id)?.alumni != null && Number.isInteger(qty) && qty > 0 && qty <= 999) state.cart[id] = qty;
    }
  }
} catch { /* The shop still works when local storage is unavailable. */ }

function save() {
  try { localStorage.setItem(storageKey, JSON.stringify(state)); } catch { /* current tab still retains state */ }
}
// Every product is sold at the alumni price; the retail price is only a
// struck-through reference shown alongside it.
const priceName = () => '校友价';
const isBundle = item => item?.series === '套餐';
const isMerch = item => item?.series === '包装周边';
const priceLabel = item => isBundle(item) ? '套餐·校友价' : isMerch(item) ? '校友价' : null;
const effectivePrice = item => item.alumni;
const wasPrice = item => item.retail != null && item.retail > item.alumni
  ? `<s class="was" aria-label="零售价 ${money(item.retail)}">${money(item.retail)}</s>` : '';
function thumb(item, compact = false) {
  if (!item.photo) return compact ? `<span class="cart-thumb">${icon('wine')}</span>` : `<span class="no-photo">${icon('wine')}暂无商品图</span>`;
  return `<img src="shop-assets/${item.id}.webp?v=13" alt="${compact ? '' : item.name}" width="440" height="540" ${compact ? '' : 'loading="lazy"'} decoding="async">`;
}
function renderProducts() {
  const query = $('#search').value.trim().replace(/\s+/g, ' ').toLowerCase().split(' ').filter(Boolean);
  const matches = catalog.filter(item => (activeSeries === '全部' || item.series === activeSeries) && query.every(word => `${item.series} ${item.name} ${item.style} ${item.note}`.toLowerCase().includes(word)));
  $('#result-count').textContent = `共 ${matches.length} 款 · 当前按${priceName()}计算`;
  $('#products').innerHTML = matches.map(item => {
    const price = effectivePrice(item);
    return `<article class="product">
      <button type="button" class="product-media" data-detail="${item.id}" aria-label="查看${item.series} ${item.name}详情" aria-haspopup="dialog"><span class="tag">${item.style}</span>${thumb(item)}<span class="detail-hint" aria-hidden="true">查看详情</span></button>
      <div class="product-body"><p class="series">${item.series}</p><h3>${item.name}</h3><p class="product-note">${item.note}</p>
      <div class="product-buy"><div class="price"><small>${priceLabel(item) ?? priceName()}</small>${wasPrice(item)}${money(price)}</div>
      <button type="button" class="add" data-add="${item.id}" aria-label="将${item.series} ${item.name}加入购物车">＋ 加入购物车</button></div></div></article>`;
  }).join('') || '<p class="empty">没有找到符合条件的酒款，试试其他关键词或系列。</p>';
}
function openProductDetail(item) {
  const [page, specs, description] = window.WineProductDetails[item.id] ?? [];
  $('#product-detail-series').textContent = `${item.series} · ${item.style}`;
  $('#product-detail-title').textContent = item.name;
  $('#product-detail-photo').innerHTML = thumb(item);
  const specText = $('#product-detail-specs');
  specText.textContent = specs || '';
  specText.hidden = !specs;
  $('#product-detail-description').textContent = description || item.note;
  const label = priceLabel(item) ?? priceName();
  $('#product-detail-price').textContent = item.retail > item.alumni
    ? `${label} ${money(item.alumni)}（零售价 ${money(item.retail)}）`
    : `${label} ${money(item.alumni)}`;
  detailDialog.showModal();
  detailDialog.scrollTop = 0;
}
function getOrder() {
  const lines = Object.entries(state.cart).map(([id, qty]) => ({item:byId.get(id),qty, price:effectivePrice(byId.get(id))}));
  const subtotal = lines.reduce((sum, {qty, price}) => sum + qty * price, 0);
  const items = lines.reduce((sum, {qty}) => sum + qty, 0);
  const {bottles, boxes} = shippingRules.countUnits(lines);
  return {lines, subtotal, items, bottles, boxes, ...shippingRules.quote(subtotal, bottles, boxes, state.method, state.province)};
}
function updateCount() {
  const {items} = getOrder();
  document.querySelectorAll('[data-count]').forEach(element => { element.textContent = items; });
  $('.floating-cart').hidden = items === 0;
}
function setQuantity(id, quantity, focusAction) {
  if (!byId.has(id) || effectivePrice(byId.get(id)) == null) return;
  if (quantity > 999) { feedback('此酒款最多可选 999 瓶。'); return; }
  if (quantity <= 0) delete state.cart[id];
  else state.cart[id] = quantity;
  if (!Object.keys(state.cart).length) for (const {key} of addressFields) deliveryAddress[key] = '';
  save(); updateCount();
  if (cartDialog.open) {
    const scroll = cartDialog.scrollTop;
    renderCart();
    cartDialog.scrollTop = scroll;
    if (focusAction) {
      (cartDialog.querySelector(`[data-id="${id}"][data-action="${focusAction}"]`) || cartDialog.querySelector('[data-action]') || $('.close')).focus({preventScroll:true});
    }
  }
}
function provinceOptions() {
  return '<option value="">请选择省级地区</option>' + shippingRules.groups.map(group =>
    `<optgroup label="首瓶 ${money(group.first)} · 每增一瓶 +${money(group.extra)}">${group.provinces.map(p => `<option ${p === state.province ? 'selected' : ''}>${p}</option>`).join('')}</optgroup>`
  ).join('') + `<option value="other" ${state.province === 'other' ? 'selected' : ''}>其他地区（请微信询价）</option>`;
}
function renderSummary(order = getOrder()) {
  const summary = $('#summary');
  if (!summary) return;
  const pending = order.total === null;
  $('#province-wrap').hidden = state.method === 'pickup';
  $('#province').disabled = state.method === 'pickup';
  $('#address-fields').hidden = state.method === 'pickup';
  $('#address-fields').disabled = state.method === 'pickup';
  $('.address-region').hidden = state.province !== 'other';
  $('[data-address=region]').disabled = state.province !== 'other';
  $('#quote-note').textContent = state.method === 'pickup' ? '自提地点：上海交通大学闵行校区，无快递费及包装费，请添加微信确认取货时间及地点。'
    : state.province === 'other' ? '此地区暂未提供运费，请添加微信确认是否可配送及费用。'
    : pending ? '选择收货省级地区后计算运费及总额。'
    : order.subtotal >= shippingRules.threshold ? '商品金额已满 ¥2,000，免运费。防破损包装费按件另计。'
    : `距离免运费还差 ${money(shippingRules.threshold - order.subtotal)}。`;
  summary.innerHTML = `<div><dt>商品小计（${priceName()}）</dt><dd>${money(order.subtotal)}</dd></div>
    <div><dt>顺丰运费${order.bottles ? `（${order.bottles} 瓶）` : ''}</dt><dd>${order.shipping === null ? '待确认' : money(order.shipping)}</dd></div>
    <div><dt>防破损包装费${(order.bottles || order.boxes) ? `（${order.bottles + order.boxes} 件 × ${money(shippingRules.packingFee)}）` : ''}</dt><dd>${order.packing === null ? '待确认' : money(order.packing)}</dd></div>
    <div class="total"><dt>订单总额</dt><dd class="${pending ? 'pending' : ''}">${pending ? '待确认运费后计算' : money(order.total)}</dd></div>`;
}
function renderCart() {
  const order = getOrder();
  $('#cart-body').innerHTML = order.lines.length ? `
    <div>${order.lines.map(({item,qty,price}) => `<article class="cart-line">${thumb(item, true)}<div><strong class="line-name">${item.series} · ${item.name}</strong><span class="line-meta">${wasPrice(item)}${money(price)} × ${qty} · ${money(qty * price)}</span></div><div class="stepper"><button type="button" data-id="${item.id}" data-action="minus" aria-label="减少${item.name}数量">−</button><span>${qty}</span><button type="button" data-id="${item.id}" data-action="plus" aria-label="增加${item.name}数量">＋</button><button type="button" class="remove" data-id="${item.id}" data-action="remove" aria-label="移除${item.name}">移除</button></div></article>`).join('')}</div>
    <div class="delivery-controls"><fieldset><legend>配送方式</legend><label><input type="radio" name="method" value="shipping" ${state.method === 'shipping' ? 'checked' : ''}> 顺丰快递</label><label><input type="radio" name="method" value="pickup" ${state.method === 'pickup' ? 'checked' : ''}> 闵行校区自提</label></fieldset>
    <label class="province" id="province-wrap" for="province">收货省份 <select id="province" autocomplete="shipping address-level1" required>${provinceOptions()}</select></label><p id="quote-note" class="quote-note" role="status"></p>
    <fieldset id="address-fields" class="address-fields"><legend>收货地址</legend>
      ${addressFields.map(field => `<label class="address-field address-${field.key}">${field.label}<input type="${field.type || 'text'}" data-address="${field.key}" autocomplete="${field.autocomplete}" placeholder="${field.placeholder}" maxlength="${field.max}" required aria-describedby="address-hint"></label>`).join('')}
      <p id="address-hint" class="quote-note address-hint">收货信息仅保留在当前页面，复制订单后由你自行发送给商家。</p>
    </fieldset></div><dl class="summary" id="summary" aria-live="polite"></dl>`
    : '<p class="empty">购物车还是空的，去挑几款喜欢的酒吧。</p>';
  $('#cart-footer').innerHTML = `<div class="contact"><div><strong>微信确认订单与付款</strong><p>微信号：<b>${wxId}</b> · 页面不收款</p></div><div class="contact-copy"><button type="button" class="secondary" data-copy-wechat>复制微信号</button>${order.items ? '<button type="button" class="primary" id="copy-order">复制订单明细</button>' : ''}</div></div><div class="wechat-card cart-wechat"><a class="wechat-qr" href="shop-assets/wechat-qr.png" target="_blank" rel="noopener" aria-label="查看微信二维码原图（新标签页）"><img src="shop-assets/wechat-qr.png" width="560" height="560" alt="微信联系二维码"></a><div><strong>微信扫一扫或长按识别</strong><p>${order.items ? '添加后将复制的订单明细发给商家。' : '添加后可咨询酒款、库存及购买方式。'}</p></div></div><div class="dialog-feedback" role="status"></div><textarea class="copy-fallback" aria-label="可手动复制的联系信息或订单明细" readonly hidden></textarea>`;
  cartDialog.querySelectorAll('[data-address]').forEach(input => { input.value = deliveryAddress[input.dataset.address]; });
  renderSummary(order);
}
function feedback(message) {
  if (cartDialog.open) { $('.dialog-feedback').textContent = message; return; }
  const toast = $('#toast');
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 3000);
}
async function copyText(text, type) {
  let copied = false;
  try { await navigator.clipboard.writeText(text); copied = true; } catch {
    const previous = document.activeElement;
    const field = document.createElement('textarea');
    field.value = text;
    field.readOnly = true;
    field.style.cssText = 'position:fixed;left:0;top:0;opacity:0';
    (cartDialog.open ? cartDialog : document.body).append(field);
    field.select();
    try { copied = document.execCommand('copy'); } catch { /* offer manual copy */ }
    field.remove();
    previous?.focus({preventScroll:true});
  }
  if (copied) {
    if (cartDialog.open) $('.copy-fallback').hidden = true;
    feedback(type === 'wx' ? '微信号已复制' : '订单明细已复制，请粘贴到微信发送。');
  } else if (cartDialog.open) {
    const fallback = $('.copy-fallback');
    fallback.value = text; fallback.hidden = false; fallback.select();
    feedback('自动复制不可用，请手动复制下方内容。');
  } else {
    feedback(`自动复制不可用，请手动添加微信：${wxId}`);
  }
}
function validateAddress() {
  if (state.method === 'pickup') return true;
  if (!state.province) { $('#province').focus(); feedback('请先选择收货省份。'); return false; }
  for (const {key, label} of addressFields) {
    if (key === 'region' && state.province !== 'other') continue;
    const input = cartDialog.querySelector(`[data-address="${key}"]`);
    const value = input.value.trim();
    deliveryAddress[key] = value;
    let error = value ? '' : `请填写${label}。`;
    if (key === 'phone' && value && !/^\+?\d{7,20}$/.test(value.replace(/[\s()（）-]/g, ''))) {
      error = '请输入有效的联系电话，例如手机号或带区号的座机。';
    }
    input.setCustomValidity(error);
    if (error) { input.focus(); input.reportValidity(); return false; }
  }
  return true;
}
function orderText() {
  const order = getOrder();
  const method = state.method === 'pickup' ? '闵行校区自提' : `顺丰快递（${provinceSet.has(state.province) ? state.province : state.province === 'other' ? '其他地区' : '收货地区未选'}）`;
  return [ `订购咨询（${priceName()}）`, ...order.lines.map(({item, qty, price}) => `${item.series} · ${item.name} × ${qty}：${money(qty * price)}`), `配送：${method}`, ...(state.method === 'shipping' ? [`收件人：${deliveryAddress.recipient}`, `联系电话：${deliveryAddress.phone}`, `收货地址：${state.province === 'other' ? deliveryAddress.region : state.province} ${deliveryAddress.locality} ${deliveryAddress.street}`] : []), `商品小计：${money(order.subtotal)}`, ...(state.method === 'pickup' ? [] : [`顺丰运费（${order.bottles} 瓶）：${order.shipping === null ? '待确认' : money(order.shipping)}`, `防破损包装费（${order.bottles + order.boxes} 件 × ${money(shippingRules.packingFee)}）：${order.packing === null ? '待确认' : money(order.packing)}`]), `订单总额：${order.total === null ? '待确认运费后计算' : money(order.total)}`, '请帮忙确认库存、价格和付款方式，谢谢！' ].join('\n');
}

$('#filters').innerHTML = series.map((value, index) => `<button type="button" data-series="${value}" aria-pressed="${index === 0}">${value}</button>`).join('');
$('#filters').addEventListener('click', event => {
  const button = event.target.closest('[data-series]');
  if (!button) return;
  activeSeries = button.dataset.series;
  $('#filters').querySelectorAll('button').forEach(el => el.setAttribute('aria-pressed', String(el === button)));
  renderProducts();
});
$('#search').addEventListener('input', renderProducts);
$('#products').addEventListener('click', event => {
  const detail = event.target.closest('[data-detail]');
  if (detail) {
    openProductDetail(byId.get(detail.dataset.detail));
    return;
  }
  const button = event.target.closest('[data-add]');
  if (!button || button.disabled) return;
  const id = button.dataset.add;
  if ((state.cart[id] || 0) === 999) { feedback('此酒款最多可选 999 瓶。'); return; }
  setQuantity(id, (state.cart[id] || 0) + 1);
  feedback(`已加入购物车：${byId.get(id).name}`);
});
document.addEventListener('click', event => {
  const trigger = event.target.closest('[data-open-cart]');
  if (trigger && !cartDialog.open) {
    opener = trigger; renderCart(); cartDialog.showModal(); cartDialog.scrollTop = 0;
  }
  if (event.target.closest('[data-copy-wechat]')) void copyText(wxId, 'wx');
});
cartDialog.addEventListener('click', event => {
  const button = event.target.closest('[data-action]');
  if (button) {
    const {id, action} = button.dataset;
    const qty = state.cart[id];
    setQuantity(id, action === 'remove' ? 0 : qty + (action === 'plus' ? 1 : -1), action);
  }
  if (event.target.closest('#copy-order') && validateAddress()) void copyText(orderText(), 'order');
  if (event.target === cartDialog) {
    const rect = cartDialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) cartDialog.close();
  }
});
cartDialog.addEventListener('input', event => {
  const {address} = event.target.dataset;
  if (!address) return;
  deliveryAddress[address] = event.target.value;
  event.target.setCustomValidity('');
  $('.dialog-feedback').textContent = '';
  $('.copy-fallback').hidden = true;
});
cartDialog.addEventListener('change', event => {
  if (event.target.name === 'method') state.method = event.target.value;
  else if (event.target.id === 'province') state.province = event.target.value;
  else return;
  $('.dialog-feedback').textContent = '';
  $('.copy-fallback').hidden = true;
  save(); renderSummary();
});
cartDialog.addEventListener('close', () => (opener && !opener.hidden ? opener : $('.cart-open')).focus({preventScroll:true}));
renderProducts(); updateCount();
