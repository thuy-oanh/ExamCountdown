using Microsoft.EntityFrameworkCore;

namespace JiraProject.Models
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

        // Tạo một bảng trong Database có tên là "KyThis"
        public DbSet<KyThi> KyThis { get; set; }
    }
}