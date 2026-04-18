using Microsoft.AspNetCore.Mvc;

namespace YourProjectName.Controllers
{
    [ApiController]
    [Route("api/Exams")] // [AC 3]: Route chuẩn theo yêu cầu
    public class ExamControllers : ControllerBase
    {
        [HttpGet]
        public IActionResult Get()
        {
            // [AC 1]: Bổ sung trường "time" cho mỗi đối tượng
            var exams = new[]
            {
                new { subject = "Toán Học", date = "2024-06-15", time = "07:30", room = "Phòng A1" },
                new { subject = "Tiếng Anh", date = "2024-06-16", time = "13:30", room = "Phòng B2" },
                new { subject = "Ngữ Văn", date = "2024-06-17", time = "08:00", room = "Phòng C3" },
                new { subject = "Vật Lý", date = "2024-06-18", time = "14:00", room = "Phòng D4" },
                new { subject = "Hóa Học", date = "2024-06-19", time = "09:15", room = "Phòng E5" }
            };

            // Trả về mảng dữ liệu
            return Ok(exams);

            // Để test thông báo trống, bạn có thể tạm comment dòng trên và dùng:
            // return Ok(new object[] { }); 
        }
    }
}