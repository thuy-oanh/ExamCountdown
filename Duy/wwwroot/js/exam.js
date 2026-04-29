// Tự động load danh sách kỳ thi khi mở trang
document.addEventListener('DOMContentLoaded', loadExams);

/**
 * Hàm gọi API GET để lấy danh sách hiển thị ra màn hình
 */
async function loadExams() {
    const examListContainer = document.getElementById('examList');
    try {
        const response = await fetch('/api/exam');
        if (!response.ok) throw new Error('Lỗi server');
        
        const exams = await response.json();
        examListContainer.innerHTML = ''; // Xóa chữ "Đang tải dữ liệu..."

        if (exams.length === 0) {
            examListContainer.innerHTML = '<p>Chưa có kỳ thi nào trong hệ thống.</p>';
            return;
        }

        exams.forEach(exam => {
            // Xử lý chuỗi ngày tháng cho đẹp
            const dateObj = new Date(exam.examDate);
            const dateDisplay = dateObj.toLocaleDateString('vi-VN'); // Hiển thị: DD/MM/YYYY
            const dateValue = exam.examDate.split('T')[0]; // Value cho input type="date": YYYY-MM-DD
            const timeValue = exam.examTime; 
            const roomDisplay = exam.room ? exam.room : 'Chưa xếp';

            const card = document.createElement('div');
            card.className = 'exam-card';
            card.innerHTML = `
                <div class="exam-info">
                    <h4>${exam.subjectName}</h4>
                    <p>📅 Ngày: ${dateDisplay} | ⏰ Giờ: ${timeValue} | 📍 Phòng: ${roomDisplay}</p>
                </div>
                <button class="btn-edit" onclick="openEditForm(${exam.id}, '${exam.subjectName}', '${dateValue}', '${timeValue}', '${exam.room || ''}')">Chỉnh sửa</button>
            `;
            examListContainer.appendChild(card);
        });
    } catch (error) {
        console.error("Lỗi khi load danh sách:", error);
        examListContainer.innerHTML = '<p style="color:red;">Không thể kết nối đến máy chủ để tải dữ liệu.</p>';
    }
}

/**
 * Hàm mở modal và đổ dữ liệu
 */
function openEditForm(id, subjectName, examDate, examTime, room) {
    document.getElementById('editExamId').value = id;
    document.getElementById('editSubjectName').value = subjectName;
    document.getElementById('editExamDate').value = examDate;
    document.getElementById('editExamTime').value = examTime;
    document.getElementById('editRoom').value = room || '';

    document.getElementById('errorMessage').style.display = 'none';
    document.getElementById('editExamModal').style.display = 'block';
    document.getElementById('modalOverlay').style.display = 'block';
}

/**
 * Hàm đóng form
 */
function closeEditForm() {
    document.getElementById('editExamModal').style.display = 'none';
    document.getElementById('modalOverlay').style.display = 'none';
}

/**
 * Hàm gửi API cập nhật
 */
async function submitEditExam() {
    const id = document.getElementById('editExamId').value;
    const subjectName = document.getElementById('editSubjectName').value.trim();
    const examDate = document.getElementById('editExamDate').value;
    const examTime = document.getElementById('editExamTime').value;
    const room = document.getElementById('editRoom').value.trim();
    
    // Validation
    if (!subjectName) return showError("Tên môn không được để trống.");
    if (!examDate) return showError("Phải chọn ngày thi.");
    if (!examTime) return showError("Phải chọn giờ thi.");

    const payload = {
        SubjectName: subjectName,
        ExamDate: examDate,
        ExamTime: examTime,
        Room: room
    };

    try {
        const saveBtn = document.querySelector('.btn-save');
        saveBtn.innerText = 'Đang lưu...';
        saveBtn.disabled = true;

        const response = await fetch(`/api/exam/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            alert("Thông tin kỳ thi đã được cập nhật");
            closeEditForm();
            // Đã đổi location.reload() thành gọi lại API để giao diện mượt hơn!
            loadExams(); 
        } else {
            const errorData = await response.json().catch(() => ({}));
            showError(errorData.message || "Lỗi khi lưu dữ liệu.");
        }
    } catch (error) {
        showError("Không thể kết nối đến máy chủ.");
    } finally {
        const saveBtn = document.querySelector('.btn-save');
        if (saveBtn) {
            saveBtn.innerText = 'Lưu thay đổi';
            saveBtn.disabled = false;
        }
    }
}

function showError(message) {
    const errorElement = document.getElementById('errorMessage');
    errorElement.innerText = message;
    errorElement.style.display = 'block';
}