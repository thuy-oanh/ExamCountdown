using Microsoft.AspNetCore.Mvc;

namespace YourProjectName.Controllers
{
    [ApiController]
    [Route("api/Exam")]
    public class ExamControllers : ControllerBase
    {
        [HttpGet]
        public IActionResult Get()
        {
            var exams = new[]
            {
                new { id = 1, subjectName = "Toán Học", examDate = "2024-06-15", examTime = "07:30", room = "Phòng A1" },
                new { id = 2, subjectName = "Tiếng Anh", examDate = "2024-06-16", examTime = "13:30", room = "Phòng B2" },
                new { id = 3, subjectName = "Ngữ Văn", examDate = "2024-06-17", examTime = "08:00", room = "Phòng C3" },
                new { id = 4, subjectName = "Vật Lý", examDate = "2024-06-18", examTime = "14:00", room = "Phòng D4" },
                new { id = 5, subjectName = "Hóa Học", examDate = "2024-06-19", examTime = "09:15", room = "Phòng E5" }
            };

            return Ok(exams);
        }
    }
}