const addBtn = document.getElementById('addBtn');
const taskInput = document.getElementById('taskInput');
const deadlineInput = document.getElementById('deadlineInput');
const taskList = document.getElementById('taskList');

addBtn.addEventListener('click', addTask);

function addTask() {
  const taskText = taskInput.value.trim();
  const deadline = deadlineInput.value;

  if (!taskText) {
    alert('タスクを入力してください！');
    return;
  }

  // li要素を作成
  const li = document.createElement('li');
  const today = new Date();
  const deadlineDate = new Date(deadline);

  // 日数の差を計算
  let diffText = '';
  if (deadline) {
    const diff = Math.ceil((deadlineDate - today) / (1000 * 60 * 60 * 24));
    diffText = diff >= 0 ? `（あと${diff}日）` : `（期限切れ）`;
  }

  li.innerHTML = `
    <span>${taskText} 
      <span class="deadline">${deadline ? `期限: ${deadline} ${diffText}` : ''}</span>
    </span>
    <button class="delete-btn">削除</button>
  `;

  // 削除ボタン機能
  li.querySelector('.delete-btn').addEventListener('click', () => {
    li.remove();
  });

  // 追加して入力欄をクリア
  taskList.appendChild(li);
  taskInput.value = '';
  deadlineInput.value = '';
}
