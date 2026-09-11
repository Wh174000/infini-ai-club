// 工具函数库

/**
 * 生成唯一订单号
 * @returns {string} 订单号
 */
function generateOrderId() {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substr(2, 6).toUpperCase();
  return `ORD${timestamp}${random}`;
}

/**
 * 格式化日期
 * @param {Date|string} date 
 * @returns {string} 格式化后的日期字符串
 */
function formatDate(date) {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hour = String(d.getHours()).padStart(2, '0');
  const minute = String(d.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day} ${hour}:${minute}`;
}

/**
 * 格式化价格
 * @param {number} price 
 * @returns {string} 格式化后的价格
 */
function formatPrice(price) {
  return `¥${price.toFixed(2)}`;
}

/**
 * 获取URL参数
 * @param {string} name 
 * @returns {string|null} 参数值
 */
function getUrlParam(name) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(name);
}

/**
 * 从URL获取推广码
 * @returns {string|null} 推广码
 */
function getAffiliateCode() {
  return getUrlParam('ref');
}

/**
 * 保存推广来源到localStorage
 * @param {string} code 
 */
function saveAffiliateSource(code) {
  if (code) {
    localStorage.setItem('affiliate_source', code);
    localStorage.setItem('affiliate_source_time', Date.now());
  }
}

/**
 * 获取推广来源
 * @returns {string|null} 推广来源
 */
function getAffiliateSource() {
  return localStorage.getItem('affiliate_source');
}

/**
 * 显示推广来源徽章
 * @param {HTMLElement} element 
 */
function showAffiliateBadge(element) {
  const source = getAffiliateSource();
  if (source && element) {
    element.style.display = 'block';
    element.querySelector('span').textContent = `🎯 ${AFFILIATE_CONFIG.tzb_name}推荐`;
  }
}

// ── API 调用封装 ───────────────────────────────────────────────────────────────

/**
 * 通用 fetch 封装，统一处理错误
 * @param {string} url
 * @param {Object} [options]
 * @returns {Promise<any>}
 */
async function apiFetch(url, options = {}) {
  const defaultHeaders = { 'Content-Type': 'application/json; charset=utf-8' };
  const resp = await fetch(url, {
    ...options,
    headers: { ...defaultHeaders, ...options.headers },
  });
  const data = await resp.json();
  if (data.code !== 0) {
    throw new Error(data.message || '接口异常');
  }
  return data.data;
}

/**
 * 创建订单（调用后端 API）
 * @param {Object} payload
 * @returns {Promise<Object>} 服务端返回的完整订单
 */
async function createOrder(payload) {
  return apiFetch('/api/orders', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

/**
 * 获取订单列表
 * @param {Object} params - { affiliate_code, limit, offset }
 * @returns {Promise<{total, offset, limit, orders}>}
 */
async function fetchOrders(params = {}) {
  const qs = new URLSearchParams();
  if (params.affiliate_code) qs.set('affiliate_code', params.affiliate_code);
  if (params.limit)          qs.set('limit',          params.limit);
  if (params.offset)        qs.set('offset',         params.offset);
  const suffix = qs.toString() ? '?' + qs.toString() : '';
  return apiFetch('/api/orders' + suffix);
}

/**
 * 获取订单统计
 * @param {string} [affiliateCode]
 * @returns {Promise<Object>}
 */
async function fetchOrderStats(affiliateCode) {
  const suffix = affiliateCode ? '?affiliate_code=' + encodeURIComponent(affiliateCode) : '';
  return apiFetch('/api/orders/stats' + suffix);
}

/**
 * 获取课程列表
 * @returns {Promise<Array>}
 */
async function fetchCourses() {
  return apiFetch('/api/courses');
}

// ── 旧版 localStorage 本地函数（保留兼容，逐步废弃） ───────────────────────────

/**
 * 导出订单CSV
 */
function exportOrdersCSV() {
  const orders = getOrders();
  if (orders.length === 0) {
    alert('暂无订单');
    return;
  }
  
  const headers = ['订单号', '课程名称', '价格', '推广码', '佣金比例', '佣金金额', '状态', '创建时间'];
  const rows = orders.map(o => [
    o.id,
    o.course_name,
    o.price,
    o.affiliate_code || '-',
    o.affiliate_rate,
    o.commission,
    o.status,
    formatDate(o.created_at)
  ]);
  
  const csvContent = [headers, ...rows]
    .map(row => row.map(cell => `"${cell}"`).join(','))
    .join('\n');
  
  const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `orders_${formatDate(new Date()).replace(/ /g, '_').replace(/:/g, '-')} .csv`;
  link.click();
}

/**
 * 计算佣金
 * @param {number} price 
 * @param {number} rate 
 * @returns {number} 佣金金额
 */
function calculateCommission(price, rate) {
  return parseFloat((price * rate).toFixed(2));
}

/**
 * 显示加载状态
 * @param {HTMLElement} element 
 */
function showLoading(element) {
  if (element) {
    element.innerHTML = '<div class="loading">加载中...</div>';
  }
}

/**
 * 隐藏加载状态
 * @param {HTMLElement} element 
 */
function hideLoading(element) {
  if (element && element.querySelector('.loading')) {
    element.innerHTML = '';
  }
}

/**
 * Toast提示
 * @param {string} message 
 * @param {string} type - success/error/info
 */
function showToast(message, type = 'info') {
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.classList.add('show');
  }, 10);
  
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// CSS注入（Toast样式）
const toastStyle = document.createElement('style');
toastStyle.textContent = `
  .toast {
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%) translateY(100px);
    padding: 12px 24px;
    border-radius: 8px;
    color: #fff;
    font-size: 14px;
    z-index: 9999;
    opacity: 0;
    transition: all 0.3s;
  }
  .toast.show {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
  .toast-success { background: #3f8065; }
  .toast-error { background: #a64d44; }
  .toast-info { background: #173d35; }
  .loading {
    text-align: center;
    padding: 40px;
    color: #718078;
  }
`;
document.head.appendChild(toastStyle);
