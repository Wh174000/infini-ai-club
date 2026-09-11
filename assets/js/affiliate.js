/**
 * 推广追踪模块
 * 负责识别和推广来源记录
 */

class AffiliateTracker {
  constructor() {
    this.storageKey = 'affiliate_source';
    this.timeKey = 'affiliate_source_time';
    this.init();
  }

  /**
   * 初始化：从URL读取推广码并保存
   */
  init() {
    const code = this.getCodeFromUrl();
    if (code) {
      this.save(code);
      this.showBadge();
    }
  }

  /**
   * 从URL获取推广码
   * @returns {string|null}
   */
  getCodeFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get('ref') || null;
  }

  /**
   * 保存推广来源
   * @param {string} code 
   */
  save(code) {
    localStorage.setItem(this.storageKey, code);
    localStorage.setItem(this.timeKey, Date.now());
  }

  /**
   * 获取当前推广来源
   * @returns {string|null}
   */
  getSource() {
    return localStorage.getItem(this.storageKey);
  }

  /**
   * 显示推广来源徽章
   */
  showBadge() {
    const badge = document.getElementById('affiliate-badge');
    if (!badge) return;
    
    const source = this.getSource();
    if (source) {
      badge.style.display = 'block';
      const span = badge.querySelector('span');
      span.textContent = `🎯 ${AFFILIATE_CONFIG.tzb_name}推荐`;
    }
  }

  /**
   * 重置推广来源（用于测试）
   */
  reset() {
    localStorage.removeItem(this.storageKey);
    localStorage.removeItem(this.timeKey);
    window.location.reload();
  }
}

// 初始化
const affiliateTracker = new AffiliateTracker();

// 导出到全局
window.affiliateTracker = affiliateTracker;

// 监听URL变化（SPA场景）
window.addEventListener('popstate', () => {
  affiliateTracker.init();
});
