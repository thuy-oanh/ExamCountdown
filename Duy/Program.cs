using ExamCountdown.Data;
using ExamCountdown.Models;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddControllers();

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

    db.Database.EnsureCreated();

    if (!db.Exams.Any())
    {
        db.Exams.Add(new Exam
        {
            SubjectName = "Toán Rời Rạc",
            ExamDate = new DateTime(2026, 3, 30),
            ExamTime = new TimeSpan(8, 0, 0),
            Room = "A1-202"
        });

        db.SaveChanges();
    }
}

app.UseDefaultFiles();
app.UseStaticFiles();
app.MapControllers();
app.Run();
