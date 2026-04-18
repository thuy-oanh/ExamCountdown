// Load danh sách khi mở trang
document.addEventListener('DOMContentLoaded', loadExams);

/**
 * Hàm tính countdown
 */
function getCountdown(examDate, examTime) {
    try {
        const examDateTime = new Date(`${examDate}T${examTime}`);
        const now = new Date();

        if (isNaN(examDateTime)) return "Không xác định";

        const diffMs = examDateTime - now;

        if (diffMs <= 0) return "";

        const diffMinutes = Math.floor(diffMs / (1000 * 60));
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

        if (diffHours < 1) {
            return `Còn ${diffMinutes} phút`;
        }

        const days = Math.floor(diffHours / 24);
        const hours = diffHours % 24;

        return `Còn ${days} ngày ${hours} giờ`;

    } catch {
        return "Không xác định";
    }
}

/**
 * Load danh sách + render countdown
 */
async function loadExams() {
    const examListContainer = document.getElementById('examList');

    try {
        const response = await fetch('/api/Exam');
        if (!response.ok) throw new Error();

        const exams = await response.json();
        examListContainer.innerHTML = '';

        if (exams.length === 0) {
            examListContainer.innerHTML = '<p>Chưa có kỳ thi nào.</p>';
            return;
        }

        exams.forEach(exam => {
            const dateObj = new Date(exam.examDate);
            const dateDisplay = dateObj.toLocaleDateString('vi-VN');
            const timeValue = exam.examTime;
            const roomDisplay = exam.room || 'Chưa xếp';

            // countdown
            const countdown = getCountdown(exam.examDate, exam.examTime);

            const card = document.createElement('div');
            card.className = 'exam-card';

            card.innerHTML = `
                <div class="exam-info">
                    <h4>
                        <a href="detail.html?id=${exam.id}">
                            ${exam.subjectName}
                        </a>
                    </h4>
                    <p>📅 ${dateDisplay} | ⏰ ${timeValue} | 📍 ${roomDisplay}</p>
                    <p style="color:red; font-weight:bold;">
                        ${countdown || ""}
                    </p>
                </div>
            `;

            examListContainer.appendChild(card);
        });

    } catch (error) {
        examListContainer.innerHTML =
            '<p style="color:red;">Không thể tải dữ liệu</p>';
    }
}