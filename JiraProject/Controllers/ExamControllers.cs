using Microsoft.AspNetCore.Mvc;
using JiraProject.Models; // Kết nối với thư mục Models của nhóm
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;

namespace JiraProject.Controllers
{
    [ApiController]
    [Route("api/[controller]")] // Route mặc định: api/exam
    public class ExamController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        // Constructor: Nhận kết nối Database từ hệ thống
        public ExamController(ApplicationDbContext context)
        {
            _context = context;
        }

        // 1. LẤY DANH SÁCH TOÀN BỘ KỲ THI (Logic của Tài)
        [HttpGet]
        public async Task<IActionResult> Get()
        {
            try
            {
                var danhSach = await _context.KyThis
                                       .OrderBy(k => k.NgayThi)
                                       .ToListAsync();
                return Ok(danhSach);
            }
            catch (System.Exception ex)
            {
                return BadRequest(new { message = "Không thể lấy dữ liệu: " + ex.Message });
            }
        }

        // 2. XEM CHI TIẾT 1 KỲ THI THEO ID (Mảnh ghép của Tuấn)
        [HttpGet("{id}")]
        public async Task<IActionResult> GetExamById(int id)
        {
            var exam = await _context.KyThis.FindAsync(id);

            if (exam == null)
            {
                return NotFound(new { message = "Không tìm thấy kỳ thi này!" });
            }

            return Ok(exam);
        }

        // 3. TẠO KỲ THI MỚI (Logic của Đăng)
        [HttpPost("taomoi")]
        public async Task<IActionResult> TaoKyThi([FromBody] KyThi kyThiMoi)
        {
            if (kyThiMoi == null || string.IsNullOrEmpty(kyThiMoi.TenKyThi))
            {
                return BadRequest(new { message = "Thông tin kỳ thi không hợp lệ!" });
            }

            try
            {
                if (string.IsNullOrEmpty(kyThiMoi.TrangThai))
                {
                    kyThiMoi.TrangThai = "Chưa thi";
                }

                _context.KyThis.Add(kyThiMoi);
                await _context.SaveChangesAsync();

                return Ok(kyThiMoi);
            }
            catch (System.Exception ex)
            {
                return BadRequest(new { message = "Lỗi khi lưu vào database: " + ex.Message });
            }
        }

        // 4. CHỈNH SỬA KỲ THI (Logic của Duy + Cập nhật của Hợp)
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateExam(int id, [FromBody] KyThi request)
        {
            if (request == null) return BadRequest(new { message = "Dữ liệu không hợp lệ" });

            var exam = await _context.KyThis.FindAsync(id);
            if (exam == null)
            {
                return NotFound(new { message = "Không tìm thấy kỳ thi này." });
            }

            // Cập nhật thông tin chi tiết
            exam.TenKyThi = request.TenKyThi;
            exam.NgayThi = request.NgayThi;
            exam.PhongThi = request.PhongThi;
            
            // QUAN TRỌNG: Cập nhật loại kỳ thi để giữ màu sắc badge
            exam.LoaiKyThi = request.LoaiKyThi; 

            try
            {
                await _context.SaveChangesAsync();
                // Yêu cầu: Đổi thông báo thành "Thông tin kỳ thi đã được cập nhật"
                return Ok(new { message = "Thông tin kỳ thi đã được cập nhật" });
            }
            catch (System.Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi hệ thống: " + ex.Message });
            }
        }

        // 5. XÓA KỲ THI (Logic của Tài)
        [HttpDelete("{id}")]
        public async Task<IActionResult> XoaKyThi(int id)
        {
            var kyThi = await _context.KyThis.FindAsync(id);
            if (kyThi == null) return NotFound();

            _context.KyThis.Remove(kyThi);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Đã xóa kỳ thi thành công" });
        }
    }
}