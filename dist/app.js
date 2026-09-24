'use strict';
(() => {
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const colors = {mocha: {label: 'Mocha', variants: {S: '48933769576637', M: '48933769543869', L: '48933769511101'}}, black: {label: 'Jet Black', variants: {S: '48933769478333', M: '48933769445565', L: '48933769412797'}}};
  const photos = ['front', 'three-quarter', 'back', 'detail-closeup', 'snow'];
  const photoDescriptions = ['Front view', 'Three-quarter view', 'Back view', 'Quilting and collar detail', 'Styled for a snowy day'];
  const money = amount => new Intl.NumberFormat('en-US', {style: 'currency', currency: 'USD'}).format(amount / 100);
  const state = {color: 'mocha', size: null, quantity: 1, image: 0};
  const price = 6900;
  const storageKey = 'vale-lark-bag-v1';
  const variants = Object.fromEntries(Object.entries(colors).flatMap(([color, data]) => Object.entries(data.variants).map(([size, id]) => [id, {color, size}])));
  let bag = [];
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey) || '[]');
    if (Array.isArray(saved)) bag = saved.filter(line => line && Object.hasOwn(variants, line.id) && Number.isInteger(line.quantity) && line.quantity > 0 && line.quantity <= 99).map(({id, quantity}) => ({id, quantity}));
  } catch { /* Shopping still works when browser storage is unavailable. */ }
  const photoPath = (color, index, thumb = false) => `assets/${index === 4 ? 'outdoor' : 'studio'}_${color}_${photos[index]}${color === 'mocha' && index === 0 ? '-v2' : ''}${thumb ? '-thumb' : ''}.webp${color === 'mocha' && index === 0 ? '?v=20260924-102350' : ''}`;
  const checkoutURL = lines => `https://valeandlark.com/cart/${lines.map(line => `${line.id}:${line.quantity}`).join(',')}?currency=USD`;
  const chosenVariant = () => state.size ? colors[state.color].variants[state.size] : null;
  function showPhoto(index) {
    state.image = (index + photos.length) % photos.length;
    const description = `${photoDescriptions[state.image]} of the ${colors[state.color].label} Short Funnel-Neck Puffer Jacket`;
    $('#main-image').src = photoPath(state.color, state.image);
    $('#main-image').alt = description;
    $('#zoom-image').src = photoPath(state.color, state.image);
    $('#zoom-image').alt = description;
    $('.image-counter').textContent = `0${state.image + 1} / 05`;
    $('#zoom-counter').textContent = `${state.image + 1} / 5`;
    $('.gallery-caption').hidden = state.image !== 0;
    $('.gallery-tag').hidden = state.image === 3;
    $$('.thumbnail').forEach((button, i) => {button.classList.toggle('selected', i === state.image); button.setAttribute('aria-pressed', String(i === state.image));});
  }
  function renderSelection() {
    $$('.swatch').forEach(button => {const active = button.dataset.color === state.color; button.classList.toggle('active', active); button.setAttribute('aria-pressed', String(active));});
    $('.selected-color').textContent = colors[state.color].label;
    $('.selected-size').textContent = state.size || 'Select your size';
    $$('.size-options button').forEach(button => {const active = button.dataset.size === state.size; button.classList.toggle('active', active); button.setAttribute('aria-pressed', String(active));});
    $('#quantity').textContent = state.quantity;
    $('#quantity-less').disabled = state.quantity <= 1;
    $('#quantity-more').disabled = state.quantity >= 99;
    $('#add-to-bag>span').textContent = `— ${money(price * state.quantity)}`;
    $('.sticky-selection').textContent = `${colors[state.color].label}${state.size ? ` / ${state.size}` : ''} · ${money(price)}`;
    $('.sticky-shop .button').childNodes[0].textContent = state.size ? 'Shop this puffer ' : 'Choose my size ';
    $$('.thumbnail img').forEach((img, i) => {img.src = photoPath(state.color, i, true);});
    showPhoto(state.image);
  }
  function selectColor(color) {if (!Object.hasOwn(colors, color)) return; state.color = color; state.image = 0; renderSelection();}
  function requireSize() {
    if (state.size) return true;
    $('#size-error').hidden = false;
    $('.size-field').scrollIntoView({behavior: 'smooth', block: 'center'});
    $('.size-options button').focus({preventScroll: true});
    return false;
  }
  function openDialog(dialog) {if (!dialog.open) dialog.showModal(); document.body.classList.add('dialog-open');}
  $$('dialog').forEach(dialog => {
    $('.close-dialog', dialog).addEventListener('click', () => dialog.close());
    dialog.addEventListener('close', () => {if (!$$('dialog[open]').length) document.body.classList.remove('dialog-open');});
    dialog.addEventListener('click', event => {const rect = dialog.getBoundingClientRect(); if (event.target === dialog && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom)) dialog.close();});
  });
  $$('.swatch').forEach(button => button.addEventListener('click', () => selectColor(button.dataset.color)));
  $$('.size-options button').forEach(button => button.addEventListener('click', () => {state.size = button.dataset.size; $('#size-error').hidden = true; renderSelection();}));
  $('#quantity-less').addEventListener('click', () => {state.quantity = Math.max(1, state.quantity - 1); renderSelection();});
  $('#quantity-more').addEventListener('click', () => {state.quantity = Math.min(99, state.quantity + 1); renderSelection();});
  $$('.thumbnail').forEach(button => button.addEventListener('click', () => showPhoto(Number(button.dataset.image))));
  $('.thumbnails').addEventListener('keydown', event => {if (!['ArrowRight', 'ArrowLeft'].includes(event.key)) return; event.preventDefault(); showPhoto(state.image + (event.key === 'ArrowRight' ? 1 : -1)); $$('.thumbnail')[state.image].focus();});
  $('.image-zoom').addEventListener('click', () => openDialog($('#zoom-dialog')));
  $('#zoom-previous').addEventListener('click', () => showPhoto(state.image - 1));
  $('#zoom-next').addEventListener('click', () => showPhoto(state.image + 1));
  $('#zoom-dialog').addEventListener('keydown', event => {if (event.key === 'ArrowLeft') showPhoto(state.image - 1); if (event.key === 'ArrowRight') showPhoto(state.image + 1);});
  let touchStart = null;
  $('.gallery-stage').addEventListener('touchstart', event => {touchStart = [event.changedTouches[0].clientX, event.changedTouches[0].clientY];}, {passive: true});
  $('.gallery-stage').addEventListener('touchend', event => {if (!touchStart) return; const dx = event.changedTouches[0].clientX - touchStart[0]; const dy = event.changedTouches[0].clientY - touchStart[1]; if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) showPhoto(state.image + (dx < 0 ? 1 : -1)); touchStart = null;}, {passive: true});
  function renderBag() {
    const count = bag.reduce((sum, line) => sum + line.quantity, 0);
    $('.bag-count').textContent = count;
    $('.bag-total-count').textContent = ` (${count})`;
    $('.bag-button').setAttribute('aria-label', `Open shopping bag, ${count} ${count === 1 ? 'item' : 'items'}`);
    $('.bag-summary').hidden = !bag.length;
    if (!bag.length) {
      $('#bag-items').innerHTML = '<div class="empty-bag"><svg><use href="#i-bag"/></svg><h3>Room for a good layer.</h3><p>Your bag is empty. Your next favorite jacket is waiting.</p><button class="button button-primary" id="keep-shopping">Explore the puffer <svg><use href="#i-arrow"/></svg></button></div>';
      $('#keep-shopping').addEventListener('click', () => {$('#bag-dialog').close(); $('#product').scrollIntoView({behavior: 'smooth'});});
      $('#checkout-link').removeAttribute('href');
    } else {
      $('#bag-items').innerHTML = bag.map(line => {const variant = variants[line.id]; const label = colors[variant.color].label; return `<article class="bag-line"><img src="${photoPath(variant.color, 0, true)}" alt="${label} puffer jacket" width="240" height="300"><div><h3>The Everyday Puffer</h3><p>${label} / ${variant.size}</p><strong>${money(price * line.quantity)}</strong><div class="bag-line-controls"><div class="quantity-control"><button data-bag-action="decrease" data-id="${line.id}" aria-label="Decrease ${label} size ${variant.size} quantity" ${line.quantity <= 1 ? 'disabled' : ''}><svg><use href="#i-minus"/></svg></button><output aria-label="${label} size ${variant.size} quantity">${line.quantity}</output><button data-bag-action="increase" data-id="${line.id}" aria-label="Increase ${label} size ${variant.size} quantity" ${line.quantity >= 99 ? 'disabled' : ''}><svg><use href="#i-plus"/></svg></button></div><button class="bag-remove" data-bag-action="remove" data-id="${line.id}" aria-label="Remove ${label} size ${variant.size} from bag">Remove</button></div></div></article>`;}).join('');
      $('#checkout-link').href = checkoutURL(bag);
    }
    $('#bag-subtotal').textContent = money(count * price);
  }
  function persistBag() {try {localStorage.setItem(storageKey, JSON.stringify(bag));} catch {} renderBag();}
  $('#bag-items').addEventListener('click', event => {
    const button = event.target.closest('[data-bag-action]'); if (!button) return;
    const line = bag.find(item => item.id === button.dataset.id); if (!line) return;
    const action = button.dataset.bagAction;
    if (action === 'remove') bag = bag.filter(item => item.id !== line.id);
    if (action === 'increase') line.quantity = Math.min(99, line.quantity + 1);
    if (action === 'decrease') line.quantity = Math.max(1, line.quantity - 1);
    persistBag(); $('#cart-status').textContent = action === 'remove' ? 'Item removed from your bag.' : `Quantity updated to ${line.quantity}.`;
    const nextControl = $(`[data-bag-action="${action}"][data-id="${line.id}"]`);
    if (nextControl && !nextControl.disabled) nextControl.focus(); else $('.close-dialog', $('#bag-dialog')).focus();
  });
  $('.bag-button').addEventListener('click', () => {renderBag(); openDialog($('#bag-dialog'));});
  $('#product-form').addEventListener('submit', event => {
    event.preventDefault(); if (!requireSize()) return;
    const id = chosenVariant(); const existing = bag.find(line => line.id === id);
    if (existing) existing.quantity = Math.min(99, existing.quantity + state.quantity); else bag.push({id, quantity: state.quantity});
    persistBag(); $('#cart-status').textContent = `${colors[state.color].label}, size ${state.size}, added to your bag.`; openDialog($('#bag-dialog'));
  });
  $('#buy-now').addEventListener('click', () => {if (requireSize()) window.location.assign(checkoutURL([{id: chosenVariant(), quantity: state.quantity}]));});
  $$('.size-guide-link, .size-guide-link-inline').forEach(button => button.addEventListener('click', () => openDialog($('#size-dialog'))));
  const measurements = {in: [[21.7,18.1,45.7,25.6],[22.0,18.5,47.2,26.0],[22.4,18.9,48.8,26.4]], cm: [[55,46,116,65],[56,47,120,66],[57,48,124,67]]};
  function renderSizeChart(unit) {
    $('#size-table').innerHTML = measurements[unit].map((row, i) => `<tr><th scope="row">${['S','M','L'][i]}</th>${row.map(value => `<td>${unit === 'in' ? value.toFixed(1) : value}</td>`).join('')}</tr>`).join('');
    $$('.unit-toggle button').forEach(button => {const active = button.dataset.unit === unit; button.classList.toggle('active', active); button.setAttribute('aria-pressed', String(active));});
    $('.size-dialog caption').textContent = `Puffer jacket garment measurements in ${unit === 'in' ? 'inches' : 'centimeters'}`;
  }
  $$('.unit-toggle button').forEach(button => button.addEventListener('click', () => renderSizeChart(button.dataset.unit)));
  $$('[data-shop-color]').forEach(button => button.addEventListener('click', () => {selectColor(button.dataset.shopColor); $('#product').scrollIntoView({behavior: 'smooth'});}));
  $('.mobile-menu').addEventListener('click', () => {const expanded = $('.mobile-menu').getAttribute('aria-expanded') === 'true'; $('.mobile-menu').setAttribute('aria-expanded', String(!expanded)); $('#mobile-nav').hidden = expanded;});
  $$('#mobile-nav a').forEach(link => link.addEventListener('click', () => {$('#mobile-nav').hidden = true; $('.mobile-menu').setAttribute('aria-expanded', 'false');}));
  const stickyObserver = new IntersectionObserver(entries => {const entry = entries[0]; $('.sticky-shop').hidden = entry.isIntersecting || entry.boundingClientRect.bottom > 0;}, {threshold: 0});
  stickyObserver.observe($('#product-form'));
  $('#year').textContent = new Date().getFullYear();
  renderSelection(); renderBag(); renderSizeChart('in');
  // Progressive enhancement: agents configure the same controls as shoppers.
  const context = document.modelContext;
  if (context?.registerTool) {
    const lifecycle = new AbortController();
    const register = tool => {try {Promise.resolve(context.registerTool(tool, {signal: lifecycle.signal})).catch(() => {});} catch {}};
    const selected = () => ({color: colors[state.color].label, size: state.size, quantity: state.quantity, priceUSD: price / 100, variantId: chosenVariant(), checkoutURL: chosenVariant() ? checkoutURL([{id: chosenVariant(), quantity: state.quantity}]) : null});
    register({name: 'get_puffer_selection', title: 'Read selected jacket', description: 'Read the current puffer color, size, quantity and Shopify checkout URL. Does not place an order or navigate.', inputSchema: {type: 'object', properties: {}, additionalProperties: false}, annotations: {readOnlyHint: true, untrustedContentHint: false}, execute: () => selected()});
    register({name: 'configure_puffer_selection', title: 'Choose jacket options', description: 'Set the visible color, size and quantity selectors. Does not add to bag, navigate, or place an order.', inputSchema: {type: 'object', properties: {color: {type: 'string', enum: ['mocha','black']}, size: {type: 'string', enum: ['S','M','L']}, quantity: {type: 'integer', minimum: 1, maximum: 99}}, required: ['color','size'], additionalProperties: false}, annotations: {readOnlyHint: false, untrustedContentHint: false}, execute: input => {if (!input || !Object.hasOwn(colors, input.color) || !['S','M','L'].includes(input.size) || (input.quantity !== undefined && (!Number.isInteger(input.quantity) || input.quantity < 1 || input.quantity > 99)) || Object.keys(input).some(key => !['color','size','quantity'].includes(key))) throw new Error('Choose mocha or black, a size S/M/L, and a quantity from 1 to 99.'); state.color = input.color; state.size = input.size; state.quantity = input.quantity ?? 1; state.image = 0; $('#size-error').hidden = true; renderSelection(); return selected();}});
    window.addEventListener('pagehide', () => lifecycle.abort(), {once: true});
  }
})();
