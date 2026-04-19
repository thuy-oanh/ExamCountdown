// Dữ liệu mẫu (SCRUM-164)
const rawExams = [
    { id: 1, name: "Toán cao cấp", startTime: new Date(Date.now() + 5 * 60 * 60 * 1000).toISOString() }, // Còn 5h (Hiện cảnh báo)
    { id: 2, name: "Tiếng Anh B1", startTime: new Date(Date.now() + 25 * 60 * 60 * 1000).toISOString() }, // Còn 25h (Không hiện)
    { id: 3, name: "Lập trình C++", startTime: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() }, // Đã qua (Không hiện)
    { id: 4, name: "Kỹ năng mềm", startTime: new Date(Date.now() + 23 * 60 * 60 * 1000).toISOString() }  // Còn 23h (Hiện cảnh báo)
];

function displayExams() {
    const listElement = document.getElementById('exam-list');
    const now = new Date();
    const MS_IN_24H = 24 * 60 * 60 * 1000;

    rawExams.forEach(exam => {
        const startTime = new Date(exam.startTime);
        const diff = startTime - now;

        // AC1 & AC4 Logic
        const isWarning = diff > 0 && diff <= MS_IN_24H;

        const item = document.createElement('div');
        item.className = `exam-item ${isWarning ? 'highlight-warning' : ''}`;

        item.innerHTML = `
            <div>
                <strong>${exam.name}</strong><br>
                <small>Bắt đầu: ${startTime.toLocaleString()}</small>
            </div>
            ${isWarning ? '<span class="warning-icon">⚠️ Sắp thi</span>' : ''}
        `;
        listElement.appendChild(item);
    });
}

// Chạy 1 lần duy nhất (AC5: Không realtime)
displayExams();