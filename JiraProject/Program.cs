using Microsoft.EntityFrameworkCore;
using JiraProject.Models;

var builder = WebApplication.CreateBuilder(args);

// --- CẤU HÌNH DATABASE SQLITE ---
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlite("Data Source=DuLieuKyThi.db"));

// 1. Cấu hình Services
builder.Services.AddCors(options => options.AddDefaultPolicy(p => p.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod()));
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// 2. Cấu hình HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// FIX: Thêm UseDefaultFiles TRƯỚC UseStaticFiles để tự động đọc index.html
app.UseDefaultFiles();
app.UseStaticFiles();

app.UseHttpsRedirection();

// Thứ tự chuẩn cho Middleware: Cors -> Authentication -> Authorization
app.UseCors();
app.UseAuthorization();

app.MapControllers();

app.Run();