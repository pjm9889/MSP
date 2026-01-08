// 데이터 저장소 (로컬 스토리지 사용)
let dataStore = [];

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', function() {
    loadData();
    setupEventListeners();
    updateStats();
});

// 이벤트 리스너 설정
function setupEventListeners() {
    // 폼 제출
    document.getElementById('add-form').addEventListener('submit', function(e) {
        e.preventDefault();
        addData();
    });
    
    // 검색 입력 엔터키
    document.getElementById('search-input').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            searchData();
        }
    });
}

// 섹션 전환
function showSection(sectionName) {
    // 모든 섹션 숨기기
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    
    // 모든 네비게이션 버튼 비활성화
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // 선택된 섹션 표시
    document.getElementById(sectionName + '-section').classList.add('active');
    
    // 선택된 버튼 활성화
    event.target.classList.add('active');
}

// 데이터 로드 (로컬 스토리지에서)
function loadData() {
    const stored = localStorage.getItem('appData');
    if (stored) {
        dataStore = JSON.parse(stored);
    } else {
        // 샘플 데이터
        dataStore = [
            {
                id: 1,
                name: '홍길동',
                email: 'hong@example.com',
                message: '안녕하세요! 첫 번째 데이터입니다.',
                timestamp: new Date().toISOString()
            },
            {
                id: 2,
                name: '김철수',
                email: 'kim@example.com',
                message: '두 번째 샘플 데이터입니다.',
                timestamp: new Date().toISOString()
            }
        ];
        saveData();
    }
    displayData();
    updateStats();
}

// 데이터 저장 (로컬 스토리지에)
function saveData() {
    localStorage.setItem('appData', JSON.stringify(dataStore));
    updateStats();
}

// 데이터 표시
function displayData() {
    const listContainer = document.getElementById('data-list');
    
    if (dataStore.length === 0) {
        listContainer.innerHTML = `
            <div class="empty-state">
                <h3>📭 데이터가 없습니다</h3>
                <p>새 데이터를 추가해보세요!</p>
            </div>
        `;
        return;
    }
    
    listContainer.innerHTML = dataStore.map(item => `
        <div class="data-item" data-id="${item.id}">
            <h3>${escapeHtml(item.name)}</h3>
            <p><strong>이메일:</strong> ${escapeHtml(item.email)}</p>
            <p><strong>메시지:</strong> ${escapeHtml(item.message)}</p>
            <p class="timestamp">등록: ${formatDate(item.timestamp)}</p>
            <div class="data-item-actions">
                <button class="btn-delete" onclick="deleteItem(${item.id})">🗑️ 삭제</button>
            </div>
        </div>
    `).join('');
}

// 데이터 추가
function addData() {
    const form = document.getElementById('add-form');
    const formData = new FormData(form);
    
    const newItem = {
        id: Date.now(),
        name: formData.get('name'),
        email: formData.get('email'),
        message: formData.get('message'),
        timestamp: new Date().toISOString()
    };
    
    dataStore.unshift(newItem); // 맨 앞에 추가
    saveData();
    displayData();
    form.reset();
    
    // 목록 섹션으로 이동
    showSection('list');
    document.querySelector('.nav-btn').classList.add('active');
    
    alert('✅ 데이터가 추가되었습니다!');
}

// 데이터 삭제
function deleteItem(id) {
    if (confirm('정말 삭제하시겠습니까?')) {
        dataStore = dataStore.filter(item => item.id !== id);
        saveData();
        displayData();
    }
}

// 전체 삭제
function clearData() {
    if (confirm('⚠️ 모든 데이터를 삭제하시겠습니까?')) {
        dataStore = [];
        saveData();
        displayData();
        alert('✅ 모든 데이터가 삭제되었습니다.');
    }
}

// 검색
function searchData() {
    const searchInput = document.getElementById('search-input');
    const query = searchInput.value.toLowerCase().trim();
    
    if (!query) {
        alert('검색어를 입력하세요!');
        return;
    }
    
    const results = dataStore.filter(item => 
        item.name.toLowerCase().includes(query) ||
        item.email.toLowerCase().includes(query) ||
        item.message.toLowerCase().includes(query)
    );
    
    const resultsContainer = document.getElementById('search-results');
    
    if (results.length === 0) {
        resultsContainer.innerHTML = `
            <div class="empty-state">
                <h3>🔍 검색 결과 없음</h3>
                <p>"${escapeHtml(query)}"에 대한 결과가 없습니다.</p>
            </div>
        `;
        return;
    }
    
    resultsContainer.innerHTML = results.map(item => `
        <div class="data-item" data-id="${item.id}">
            <h3>${highlightText(escapeHtml(item.name), query)}</h3>
            <p><strong>이메일:</strong> ${highlightText(escapeHtml(item.email), query)}</p>
            <p><strong>메시지:</strong> ${highlightText(escapeHtml(item.message), query)}</p>
            <p class="timestamp">등록: ${formatDate(item.timestamp)}</p>
        </div>
    `).join('');
}

// 통계 업데이트
function updateStats() {
    document.getElementById('total-count').textContent = dataStore.length;
    document.getElementById('last-update').textContent = new Date().toLocaleString('ko-KR');
}

// 날짜 포맷
function formatDate(isoString) {
    const date = new Date(isoString);
    return date.toLocaleString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// HTML 이스케이프
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// 검색어 하이라이트
function highlightText(text, query) {
    if (!query) return text;
    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
}

// 데이터 내보내기 (txt 파일로)
function exportToTxt() {
    const content = dataStore.map(item => 
        `ID: ${item.id}\n` +
        `이름: ${item.name}\n` +
        `이메일: ${item.email}\n` +
        `메시지: ${item.message}\n` +
        `등록일: ${formatDate(item.timestamp)}\n` +
        `${'-'.repeat(50)}\n`
    ).join('\n');
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `data_${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
}

// 콘솔에 데이터 출력 (디버깅용)
console.log('데이터 관리 시스템이 로드되었습니다.');
console.log('현재 데이터 수:', dataStore.length);