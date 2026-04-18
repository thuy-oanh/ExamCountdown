using System;
using System.ComponentModel.DataAnnotations;

namespace JiraProject.Models
{
    public class KyThi
    {
        [Key] // Khai báo Id là khóa chính
        public int Id { get; set; }

        [Required(ErrorMessage = "Tên kỳ thi không được để trống")] // Ràng buộc bắt buộc
        public string? TenKyThi { get; set; }

        public DateTime NgayThi { get; set; }

        public string? TrangThai { get; set; }

        public string? PhongThi { get; set; }

        // MỚI: Thêm loại kỳ thi để hiển thị màu sắc (Giữa kỳ, Cuối kỳ, Quiz...)
        public string? LoaiKyThi { get; set; } 
    }
}