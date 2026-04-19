import React, { useState, useEffect } from 'react'
import './App.css'

function App() {
  // 1. Đọc trạng thái từ localStorage (mặc định là ON nếu chưa có)
  const [isWarningEnabled, setIsWarningEnabled] = useState(() => {
    const saved = localStorage.getItem('exam_warning_status');
    return saved !== null ? JSON.parse(saved) : true;
  });

  // 2. Lưu vào localStorage mỗi khi trạng thái thay đổi
  useEffect(() => {
    localStorage.setItem('exam_warning_status', JSON.stringify(isWarningEnabled));
  }, [isWarningEnabled]);

  return (
    <div className="app-container">
      <h1>Cài đặt Thông báo</h1>
      
      <div className="toggle-section">
        <span>Cảnh báo kỳ thi sắp diễn ra: </span>
        {/* Nút bật/tắt */}
        <button 
          className={`toggle-btn ${isWarningEnabled ? 'on' : 'off'}`}
          onClick={() => setIsWarningEnabled(!isWarningEnabled)}
        >
          {isWarningEnabled ? 'ON' : 'OFF'}
        </button>
      </div>

      <div className="status-label">
        Trạng thái hiện tại: <strong>{isWarningEnabled ? 'ĐANG BẬT' : 'ĐANG TẮT'}</strong>
      </div>

      <hr />

      {/* 3. Logic hiển thị cảnh báo (Story 5 & 9) */}
      <div className="warning-display">
        {isWarningEnabled ? (
          <div className="alert alert-warning">
            ⚠️ <strong>Cảnh báo:</strong> Bạn có một kỳ thi sắp diễn ra vào sáng mai!
          </div>
        ) : (
          <p className="hidden-msg">Cảnh báo đã bị ẩn theo yêu cầu người dùng.</p>
        )}
      </div>
    </div>
  )
}

export default App