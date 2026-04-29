let examsCache = [];
let countdownTimer = null;
let lifecycleRefreshTimeout = null;
let isLoading = false;

const examListContainer = document.getElementById('examList');
const syncStatusText = document.getElementById('syncStatusText');
const lastUpdatedText = document.getElementById('lastUpdatedText');
const refreshButton = document.getElementById('refreshButton');
const modalOverlay = document.getElementById('modalOverlay');
const editExamModal = document.getElementById('editExamModal');
const saveButton = document.getElementById('saveButton');
const cancelButton = document.getElementById('cancelButton');

initializePage();

function initializePage() {
    document.addEventListener('DOMContentLoaded', () => {
        attachEventListeners();
        loadExams({ reason: 'initial' });
        startCountdownLoop();
    });
}

function attachEventListeners() {
    refreshButton.addEventListener('click', () => loadExams({ reason: 'manual' }));
    saveButton.addEventListener('click', submitEditExam);
    cancelButton.addEventListener('click', closeEditForm);
    modalOverlay.addEventListener('click', closeEditForm);

    window.addEventListener('pageshow', () => scheduleLifecycleRefresh('pageshow'));
    window.addEventListener('focus', () => scheduleLifecycleRefresh('focus'));
    document.addEventListener('visibilitychange', () => {
        if (!document.hidden) {
            scheduleLifecycleRefresh('visibilitychange');
        }
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            closeEditForm();
        }
    });
}

function scheduleLifecycleRefresh(reason) {
    updateSyncStatus(getLifecycleMessage(reason), false);

    if (lifecycleRefreshTimeout) {
        clearTimeout(lifecycleRefreshTimeout);
    }

    lifecycleRefreshTimeout = setTimeout(() => {
        refreshCountdowns();
        loadExams({ reason });
    }, 150);
}

function getLifecycleMessage(reason) {
    switch (reason) {
        case 'pageshow':
            return 'Phát hiện quay lại trang, đang đồng bộ lại countdown...';
        case 'focus':
            return 'Phát hiện quay lại cửa sổ trình duyệt, đang đồng bộ lại countdown...';
        case 'visibilitychange':
            return 'Tab vừa hoạt động trở lại, đang cập nhật countdown...';
        default:
            return 'Đang đồng bộ lại countdown...';
    }
}

async function loadExams({ reason = 'manual' } = {}) {
    if (isLoading) {
        return;
    }

    isLoading = true;
    updateSyncStatus('Đang tải dữ liệu kỳ thi...', false);

    try {
        const response = await fetch('/api/exam', { cache: 'no-store' });
        if (!response.ok) {
            throw new Error('Không thể tải dữ liệu từ máy chủ.');
        }

        const exams = await response.json();
        examsCache = normalizeAndSortExams(exams);
        renderExamList();
        refreshCountdowns();
        updateSyncStatus(getSuccessMessage(reason), true);
        updateLastUpdatedText(new Date());
    } catch (error) {
        console.error('Lỗi khi tải danh sách kỳ thi:', error);
        examListContainer.innerHTML = '<p class="error-text">Không thể kết nối đến máy chủ để tải dữ liệu.</p>';
        updateSyncStatus('Đồng bộ thất bại. Vui lòng thử lại.', false);
    } finally {
        isLoading = false;
    }
}

function normalizeAndSortExams(exams) {
    return [...exams]
        .map((exam) => ({
            ...exam,
            examDateTime: parseExamDateTime(exam.examDate, exam.examTime)
        }))
        .sort((first, second) => first.examDateTime - second.examDateTime);
}

function renderExamList() {
    examListContainer.innerHTML = '';

    if (examsCache.length === 0) {
        examListContainer.innerHTML = '<div class="empty-state">Chưa có kỳ thi nào trong hệ thống.</div>';
        return;
    }

    const fragment = document.createDocumentFragment();

    examsCache.forEach((exam) => {
        const card = createExamCard(exam);
        fragment.appendChild(card);
    });

    examListContainer.appendChild(fragment);
}

function createExamCard(exam) {
    const card = document.createElement('article');
    card.className = 'exam-card';
    card.dataset.examId = String(exam.id);

    const cardHeader = document.createElement('div');
    cardHeader.className = 'exam-card-header';

    const titleWrap = document.createElement('div');

    const subjectTitle = document.createElement('h3');
    subjectTitle.className = 'exam-title';
    subjectTitle.textContent = exam.subjectName;

    const meta = document.createElement('p');
    meta.className = 'exam-meta';
    meta.textContent = formatExamMeta(exam);

    titleWrap.append(subjectTitle, meta);

    const statusBadge = document.createElement('span');
    statusBadge.className = 'status-badge';
    statusBadge.dataset.role = 'status';

    cardHeader.append(titleWrap, statusBadge);

    const countdownPanel = document.createElement('div');
    countdownPanel.className = 'countdown-panel';

    countdownPanel.append(
        createCountdownItem('Ngày', 'days'),
        createCountdownItem('Giờ', 'hours'),
        createCountdownItem('Phút', 'minutes'),
        createCountdownItem('Giây', 'seconds')
    );

    const countdownText = document.createElement('p');
    countdownText.className = 'countdown-text';
    countdownText.dataset.role = 'countdown-text';

    const actions = document.createElement('div');
    actions.className = 'card-actions';

    const editButton = document.createElement('button');
    editButton.type = 'button';
    editButton.className = 'btn-edit';
    editButton.textContent = 'Chỉnh sửa';
    editButton.addEventListener('click', () => openEditForm(exam));

    actions.appendChild(editButton);

    card.append(cardHeader, countdownPanel, countdownText, actions);
    return card;
}

function createCountdownItem(label, unit) {
    const wrapper = document.createElement('div');
    wrapper.className = 'countdown-item';

    const value = document.createElement('span');
    value.className = 'countdown-value';
    value.dataset.unit = unit;
    value.textContent = '00';

    const caption = document.createElement('span');
    caption.className = 'countdown-label';
    caption.textContent = label;

    wrapper.append(value, caption);
    return wrapper;
}

function refreshCountdowns() {
    if (examsCache.length === 0) {
        return;
    }

    const now = new Date();

    examsCache.forEach((exam) => {
        const card = examListContainer.querySelector(`[data-exam-id="${exam.id}"]`);
        if (!card) {
            return;
        }

        const countdown = calculateCountdown(exam.examDateTime, now);
        updateCardCountdown(card, countdown, exam.examDateTime, now);
    });
}

function updateCardCountdown(card, countdown, examDateTime, now) {
    setCountdownValue(card, 'days', countdown.days);
    setCountdownValue(card, 'hours', countdown.hours);
    setCountdownValue(card, 'minutes', countdown.minutes);
    setCountdownValue(card, 'seconds', countdown.seconds);

    const statusElement = card.querySelector('[data-role="status"]');
    const countdownText = card.querySelector('[data-role="countdown-text"]');

    const status = buildStatus(examDateTime, now);
    statusElement.textContent = status.label;
    statusElement.className = `status-badge ${status.className}`;
    countdownText.textContent = countdown.message;
}

function setCountdownValue(card, unit, value) {
    const element = card.querySelector(`[data-unit="${unit}"]`);
    if (element) {
        element.textContent = String(value).padStart(2, '0');
    }
}

function calculateCountdown(targetTime, now) {
    const diffMs = targetTime.getTime() - now.getTime();

    if (diffMs <= 0) {
        return {
            days: 0,
            hours: 0,
            minutes: 0,
            seconds: 0,
            message: `Kỳ thi đã qua từ ${formatRelativePast(now.getTime() - targetTime.getTime())}.`
        };
    }

    const totalSeconds = Math.floor(diffMs / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return {
        days,
        hours,
        minutes,
        seconds,
        message: `Còn ${days} ngày ${hours} giờ ${minutes} phút ${seconds} giây tới giờ thi.`
    };
}

function buildStatus(examDateTime, now) {
    const diffMs = examDateTime.getTime() - now.getTime();

    if (diffMs <= 0) {
        return { label: 'Đã qua', className: 'status-past' };
    }

    if (isSameCalendarDay(examDateTime, now)) {
        return { label: 'Hôm nay', className: 'status-today' };
    }

    if (diffMs <= 3 * 24 * 60 * 60 * 1000) {
        return { label: 'Sắp đến', className: 'status-soon' };
    }

    return { label: 'Đã lên lịch', className: 'status-upcoming' };
}

function formatExamMeta(exam) {
    const dateText = exam.examDateTime.toLocaleDateString('vi-VN');
    const timeText = normalizeTimeForDisplay(exam.examTime);
    const roomText = exam.room ? exam.room : 'Chưa xếp';
    return `📅 ${dateText} • ⏰ ${timeText} • 📍 ${roomText}`;
}

function parseExamDateTime(examDate, examTime) {
    const datePart = (examDate || '').split('T')[0];
    const [year, month, day] = datePart.split('-').map(Number);
    const timeParts = String(examTime || '00:00:00').split(':').map(Number);
    const [hours = 0, minutes = 0, seconds = 0] = timeParts;

    return new Date(year, (month || 1) - 1, day || 1, hours, minutes, seconds, 0);
}

function normalizeTimeForDisplay(timeValue) {
    const parts = String(timeValue || '00:00:00').split(':');
    return parts.length >= 2 ? `${parts[0]}:${parts[1]}` : '00:00';
}

function isSameCalendarDay(first, second) {
    return first.getFullYear() === second.getFullYear()
        && first.getMonth() === second.getMonth()
        && first.getDate() === second.getDate();
}

function formatRelativePast(diffMs) {
    const totalMinutes = Math.floor(diffMs / 60000);

    if (totalMinutes < 60) {
        return `${totalMinutes} phút`;
    }

    const totalHours = Math.floor(totalMinutes / 60);
    if (totalHours < 24) {
        return `${totalHours} giờ`;
    }

    const totalDays = Math.floor(totalHours / 24);
    return `${totalDays} ngày`;
}

function startCountdownLoop() {
    if (countdownTimer) {
        clearInterval(countdownTimer);
    }

    countdownTimer = setInterval(() => {
        refreshCountdowns();
    }, 1000);
}

function openEditForm(exam) {
    document.getElementById('editExamId').value = exam.id;
    document.getElementById('editSubjectName').value = exam.subjectName;
    document.getElementById('editExamDate').value = (exam.examDate || '').split('T')[0];
    document.getElementById('editExamTime').value = String(exam.examTime || '00:00:00').slice(0, 8);
    document.getElementById('editRoom').value = exam.room || '';

    hideError();
    editExamModal.style.display = 'block';
    modalOverlay.style.display = 'block';
}

function closeEditForm() {
    editExamModal.style.display = 'none';
    modalOverlay.style.display = 'none';
    hideError();
}

async function submitEditExam() {
    const id = document.getElementById('editExamId').value;
    const subjectName = document.getElementById('editSubjectName').value.trim();
    const examDate = document.getElementById('editExamDate').value;
    const examTime = document.getElementById('editExamTime').value;
    const room = document.getElementById('editRoom').value.trim();

    if (!subjectName) {
        return showError('Tên môn không được để trống.');
    }
    if (!examDate) {
        return showError('Phải chọn ngày thi.');
    }
    if (!examTime) {
        return showError('Phải chọn giờ thi.');
    }

    const payload = {
        subjectName,
        examDate,
        examTime,
        room
    };

    try {
        saveButton.innerText = 'Đang lưu...';
        saveButton.disabled = true;

        const response = await fetch(`/api/exam/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || 'Lỗi khi lưu dữ liệu.');
        }

        closeEditForm();
        await loadExams({ reason: 'save' });
        alert('Thông tin kỳ thi đã được cập nhật. Countdown đã được tính lại ngay lập tức.');
    } catch (error) {
        showError(error.message || 'Không thể kết nối đến máy chủ.');
    } finally {
        saveButton.innerText = 'Lưu thay đổi';
        saveButton.disabled = false;
    }
}

function updateSyncStatus(message, success) {
    syncStatusText.textContent = message;
    document.querySelector('.status-dot')?.classList.toggle('status-dot-success', success);
}

function updateLastUpdatedText(timestamp) {
    const formatted = timestamp.toLocaleString('vi-VN');
    lastUpdatedText.textContent = `Cập nhật gần nhất: ${formatted}`;
}

function getSuccessMessage(reason) {
    switch (reason) {
        case 'initial':
            return 'Đã tải dữ liệu ban đầu và khởi động countdown.';
        case 'save':
            return 'Đã lưu thay đổi và đồng bộ lại countdown thành công.';
        case 'pageshow':
        case 'focus':
        case 'visibilitychange':
            return 'Đã quay lại trang và cập nhật countdown thành công.';
        default:
            return 'Đã tải dữ liệu kỳ thi thành công.';
    }
}

function showError(message) {
    const errorElement = document.getElementById('errorMessage');
    errorElement.innerText = message;
    errorElement.style.display = 'block';
}

function hideError() {
    const errorElement = document.getElementById('errorMessage');
    errorElement.innerText = '';
    errorElement.style.display = 'none';
}
