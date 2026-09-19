// ===== 我的待辦清單 =====
// 純前端實作，不使用任何框架或套件。資料存在瀏覽器的 localStorage。

const STORAGE_KEY = 'workshop-todos';
const FILTER_KEY = 'workshop-filter';

// 取得畫面上會用到的元素
const form = document.getElementById('todo-form');
const input = document.getElementById('todo-input');
const list = document.getElementById('todo-list');
const emptyState = document.getElementById('empty-state');
const remainingCount = document.getElementById('remaining-count');
const clearCompletedButton = document.getElementById('clear-completed');
const themeToggle = document.getElementById('theme-toggle');
const filterButtons = document.querySelectorAll('.filter-button');

// 所有待辦事項都放在這個陣列裡
// 每一筆的格式：{ id: '169...', text: '買牛奶', completed: false }
let todos = loadTodos();
let currentFilter = loadFilter();

const THEME_KEY = 'workshop-theme';
const colorScheme = window.matchMedia('(prefers-color-scheme: dark)');
const emptyMessages = {
  all: '還沒有任何待辦事項，新增一個吧!',
  active: '目前沒有未完成的待辦事項。',
  completed: '目前沒有已完成的待辦事項。資料還在，只是被目前篩選條件過濾掉了。',
};

function loadFilter() {
  const savedFilter = localStorage.getItem(FILTER_KEY);
  return ['all', 'active', 'completed'].includes(savedFilter) ? savedFilter : 'all';
}

// ---------- 資料存取 ----------

/** 從 localStorage 讀回待辦清單，讀不到或格式壞掉就回傳空陣列 */
function loadTodos() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    const parsed = saved ? JSON.parse(saved) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.warn('讀取待辦清單失敗，將以空清單開始。', error);
    return [];
  }
}

/** 把目前的待辦清單寫回 localStorage */
function saveTodos() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

/** 取得使用者目前使用的主題，未手動設定時跟隨作業系統 */
function getCurrentTheme() {
  const savedTheme = getSavedTheme();
  if (savedTheme) return savedTheme;

  return colorScheme.matches ? 'dark' : 'light';
}

/** 取得有效的手動主題設定，避免錯誤值覆蓋系統偏好 */
function getSavedTheme() {
  const savedTheme = localStorage.getItem(THEME_KEY);
  return savedTheme === 'light' || savedTheme === 'dark' ? savedTheme : null;
}

/** 套用主題並更新切換按鈕文字 */
function applyTheme() {
  const theme = getCurrentTheme();
  const savedTheme = getSavedTheme();

  if (savedTheme) {
    document.documentElement.dataset.theme = theme;
  } else {
    delete document.documentElement.dataset.theme;
  }

  themeToggle.textContent = theme === 'dark' ? '☀️ 淺色模式' : '🌙 深色模式';
  themeToggle.setAttribute(
    'aria-label',
    theme === 'dark' ? '切換為淺色模式' : '切換為深色模式'
  );
}

// ---------- 畫面繪製 ----------

/** 依照目前的 todos 陣列，重新畫出整份清單 */
function render() {
  list.replaceChildren();

  const visibleTodos = todos.filter((todo) => {
    if (currentFilter === 'active') return !todo.completed;
    if (currentFilter === 'completed') return todo.completed;
    return true;
  });

  visibleTodos.forEach((todo) => {
    const item = document.createElement('li');
    item.className = todo.completed ? 'todo-item completed' : 'todo-item';
    item.dataset.id = todo.id;

    // 完成勾選框
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = todo.completed;
    checkbox.setAttribute('aria-label', `標記「${todo.text}」為完成`);

    // 待辦文字
    const text = document.createElement('span');
    text.className = 'todo-text';
    text.textContent = todo.text;

    // 刪除按鈕
    const deleteButton = document.createElement('button');
    deleteButton.type = 'button';
    deleteButton.className = 'btn-delete';
    deleteButton.textContent = '✕';
    deleteButton.setAttribute('aria-label', `刪除「${todo.text}」`);

    item.append(checkbox, text, deleteButton);
    list.append(item);
  });

  // 清單空的時候顯示提示文字
  emptyState.textContent = emptyMessages[currentFilter];
  emptyState.hidden = visibleTodos.length > 0;

  // 更新未完成數量
  const remaining = todos.filter((todo) => !todo.completed).length;
  const completed = todos.filter((todo) => todo.completed).length;
  remainingCount.textContent = `未完成:${remaining} 項`;

  clearCompletedButton.hidden = completed === 0;
  clearCompletedButton.disabled = completed === 0;
  clearCompletedButton.setAttribute(
    'aria-label',
    completed === 0 ? '目前沒有已完成項目可清除' : '清除所有已完成項目'
  );
}

// ---------- 操作行為 ----------

/** 產生一組不會重複的 id（時間戳 + 隨機碼） */
function createId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

/** 新增一筆待辦 */
function addTodo(text) {
  todos.push({
    id: createId(),
    text,
    completed: false,
  });
  saveTodos();
  render();
}

/** 切換某一筆待辦的完成狀態 */
function toggleTodo(id) {
  todos = todos.map((todo) =>
    todo.id === id ? { ...todo, completed: !todo.completed } : todo
  );
  saveTodos();
  render();
}

/** 刪除某一筆待辦 */
function deleteTodo(id) {
  todos = todos.filter((todo) => todo.id !== id);
  saveTodos();
  render();
}

/** 一次刪除所有已完成事項，並在確認後更新畫面與 localStorage */
function clearCompletedTodos() {
  const completedCount = todos.filter((todo) => todo.completed).length;
  if (completedCount === 0) return;

  const confirmed = window.confirm('確定要清除所有已完成的項目嗎？');
  if (!confirmed) return;

  todos = todos.filter((todo) => !todo.completed);
  saveTodos();
  render();
}

// ---------- 事件綁定 ----------

// 送出表單 = 新增待辦
form.addEventListener('submit', (event) => {
  event.preventDefault();

  const text = input.value.trim();
  if (!text) return; // 空白內容不新增

  addTodo(text);
  input.value = '';
  input.focus();
});

// 用事件委派處理清單內的點擊（勾選完成 / 刪除）
list.addEventListener('click', (event) => {
  const item = event.target.closest('.todo-item');
  if (!item) return;

  const id = item.dataset.id;

  if (event.target.matches('input[type="checkbox"]')) {
    toggleTodo(id);
  } else if (event.target.matches('.btn-delete')) {
    deleteTodo(id);
  }
});

clearCompletedButton.addEventListener('click', clearCompletedTodos);

// 切換淺色 / 深色模式並記住使用者選擇
themeToggle.addEventListener('click', () => {
  const nextTheme = getCurrentTheme() === 'dark' ? 'light' : 'dark';
  localStorage.setItem(THEME_KEY, nextTheme);
  applyTheme();
});

// 沒有手動設定時，作業系統切換主題也同步更新畫面
colorScheme.addEventListener('change', () => {
  if (!getSavedTheme()) applyTheme();
});

// 切換清單篩選條件
filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    currentFilter = button.dataset.filter;
    localStorage.setItem(FILTER_KEY, currentFilter);
    filterButtons.forEach((filterButton) => {
      filterButton.classList.toggle('active', filterButton === button);
      filterButton.setAttribute('aria-pressed', filterButton === button);
    });
    render();
  });
});

// 頁面載入時先畫一次
applyTheme();
filterButtons.forEach((button) => {
  const isActive = button.dataset.filter === currentFilter;
  button.classList.toggle('active', isActive);
  button.setAttribute('aria-pressed', isActive);
});
render();