using ExamCountdown.Data;
using ExamCountdown.Models;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Cấu hình kết nối SQLite
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddControllers();

var app = builder.Build();

// =================================================================
// ĐOẠN CODE "ÉP" BƠM DỮ LIỆU VÀO SQLITE (ĐẢM BẢO 100% THÀNH CÔNG)
// =================================================================
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    
    // Đảm bảo Database và các bảng đã được tạo
    db.Database.Migrate(); 

    // Kiểm tra: Nếu bảng Exams rỗng (chưa có dòng nào)
    if (!db.Exams.Any())
    {
        db.Exams.Add(new Exam
        {
            SubjectName = "Toán Rời Rạc",
            ExamDate = new DateTime(2026, 3, 30),
            ExamTime = new TimeSpan(8, 0, 0),
            Room = "A1-202"
        });
        
        db.SaveChanges(); // Lệnh này sẽ thực thi lệnh INSERT INTO thẳng vào file .db
        Console.WriteLine("========== ĐÃ TỰ ĐỘNG BƠM DỮ LIỆU MẪU VÀO DATABASE! ==========");
    }
}
// =================================================================

app.UseDefaultFiles();
app.UseStaticFiles();

app.MapControllers();

app.Run();