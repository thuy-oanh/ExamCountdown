using ExamCountdown.Models;
using Microsoft.EntityFrameworkCore;
using System;

namespace ExamCountdown.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

        public DbSet<Exam> Exams { get; set; }

        // ĐOẠN MỚI THÊM VÀO: Bơm dữ liệu mẫu (Seed Data)
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Exam>().HasData(
                new Exam
                {
                    Id = 1,
                    SubjectName = "Toán Rời Rạc",
                    ExamDate = new DateTime(2026, 3, 30),
                    ExamTime = new TimeSpan(8, 0, 0),
                    Room = "A1-202"
                }
            );
        }
    }
}