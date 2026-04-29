using ExamCountdown.Models;
using Microsoft.EntityFrameworkCore;

namespace ExamCountdown.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        public DbSet<Exam> Exams { get; set; }
    }
}
