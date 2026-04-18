using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Xunit;
using ExamCountdown.Controllers;
using ExamCountdown.Data;
using ExamCountdown.Models;

namespace Tests
{
    public class ExamControllerTests
    {
        // Hàm tạo Database ảo (InMemory) để test độc lập
        private ApplicationDbContext GetInMemoryDbContext()
        {
            var options = new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;
            return new ApplicationDbContext(options);
        }

        [Fact]
        public async Task UpdateExam_TraVeLoi404_KhiIdKhongTonTai()
        {
            // Arrange: Chuẩn bị DB trống và Controller
            var context = GetInMemoryDbContext();
            var controller = new ExamController(context);
            var updateDto = new ExamUpdateDto { SubjectName = "Toán", ExamDate = DateTime.Now, ExamTime = TimeSpan.Zero };

            // Act: Gọi API cập nhật với ID = 99 (không tồn tại)
            var result = await controller.UpdateExam(99, updateDto);

            // Assert: Kiểm tra xem kết quả có đúng là 404 NotFound không
            Assert.IsType<NotFoundObjectResult>(result);
        }

        [Fact]
        public async Task UpdateExam_CapNhatThanhCong_HappyPath()
        {
            // Arrange: Tạo DB và bơm sẵn 1 record vào
            var context = GetInMemoryDbContext();
            var exam = new Exam { Id = 1, SubjectName = "Môn Cũ", ExamDate = DateTime.Now, ExamTime = TimeSpan.Zero };
            context.Exams.Add(exam);
            await context.SaveChangesAsync();

            var controller = new ExamController(context);
            
            // Dữ liệu mới gửi từ Frontend
            var updateDto = new ExamUpdateDto 
            { 
                SubjectName = "Toán Rời Rạc Mới", 
                ExamDate = new DateTime(2026, 3, 30), 
                ExamTime = new TimeSpan(8, 0, 0),
                Room = "Phòng VIP"
            };

            // Act: Gọi API cập nhật cho ID = 1
            var result = await controller.UpdateExam(1, updateDto);

            // Assert: Kiểm tra kết quả
            // 1. Phải trả về Status 200 OK
            Assert.IsType<OkObjectResult>(result);
            
            // 2. Dữ liệu trong DB thực sự đã bị thay đổi (Checklist SCRUM-113)
            var updatedExam = await context.Exams.FindAsync(1);
            Assert.Equal("Toán Rời Rạc Mới", updatedExam.SubjectName);
            Assert.Equal("Phòng VIP", updatedExam.Room);
        }
    }
}