using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ExamCountdown.Models;
using ExamCountdown.Data;
using System.Threading.Tasks;

namespace ExamCountdown.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ExamController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ExamController(ApplicationDbContext context)
        {
            _context = context;
        }

        // ==========================================
        // API LẤY DANH SÁCH TOÀN BỘ KỲ THI (MỚI THÊM)
        // Endpoint: GET /api/exam
        // ==========================================
        [HttpGet]
        public async Task<IActionResult> GetAllExams()
        {
            // Lấy toàn bộ dữ liệu từ bảng Exams trong SQLite
            var exams = await _context.Exams.ToListAsync();
            
            // Trả về Frontend dưới dạng JSON
            return Ok(exams);
        }

        // ==========================================
        // API CẬP NHẬT KỲ THI CŨ
        // Endpoint: PUT /api/exam/{id}
        // ==========================================
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateExam(int id, [FromBody] ExamUpdateDto request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var exam = await _context.Exams.FindAsync(id);

            if (exam == null)
            {
                return NotFound(new { message = "Không tìm thấy kỳ thi với ID này." });
            }

            exam.SubjectName = request.SubjectName;
            exam.ExamDate = request.ExamDate;
            exam.ExamTime = request.ExamTime;
            exam.Room = request.Room;

            try
            {
                await _context.SaveChangesAsync();
                return Ok(new { message = "Thông tin kỳ thi đã được cập nhật" });
            }
            catch (DbUpdateException)
            {
                return StatusCode(500, new { message = "Lỗi hệ thống khi lưu vào cơ sở dữ liệu." });
            }
        }
    }
}