/**
 * 主应用逻辑
 */

document.addEventListener('DOMContentLoaded', () => {
  renderCourses();
  initNavigation();
});

/**
 * 渲染课程列表
 */
function renderCourses() {
  const grid = document.getElementById('courses-grid');
  if (!grid) return;

  const courses = COURSES_CONFIG;
  const affiliateCode = affiliateTracker.getSource();

  grid.innerHTML = courses.map(course => `
    <div class="course-card" data-id="${course.id}">
      <img class="course-cover" src="${course.cover_image}" alt="${course.name}">
      <div class="course-content">
        <div class="course-tags">
          ${course.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
        </div>
        <h3 class="course-name">${course.name}</h3>
        <p class="course-desc">${course.description}</p>
        <div class="course-footer">
          <div class="course-price">
            ¥${course.price}
            ${course.original_price > course.price ? `<span>¥${course.original_price}</span>` : ''}
          </div>
          <a href="buy.html?id=${course.id}" class="btn-buy">立即购买</a>
        </div>
        ${affiliateCode ? `<div class="affiliate-info">通州小兵专属推荐</div>` : ''}
      </div>
    </div>
  `).join('');
}

/**
 * 初始化导航
 */
function initNavigation() {
  // 平滑滚动
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  // 移动端菜单（如需要）
  // ...
}

/**
 * 课程点击事件（卡片整体可点击）
 */
document.addEventListener('click', (e) => {
  const card = e.target.closest('.course-card');
  if (card && !e.target.classList.contains('btn-buy')) {
    const courseId = card.dataset.id;
    window.location.href = `buy.html?id=${courseId}`;
  }
});
