using System;
using System.ComponentModel.DataAnnotations;

namespace ExamCountdown.Models
{
    public class ExamUpdateDto
    {
        [Required(ErrorMessage = "Tên môn không được để trống")]
        public string SubjectName { get; set; }

        [Required(ErrorMessage = "Phải chọn ngày thi")]
        public DateTime ExamDate { get; set; }

        [Required(ErrorMessage = "Phải chọn giờ thi")]
        public TimeSpan ExamTime { get; set; }

        public string? Room { get; set; } // Dấu ? cho phép giá trị null
    }
}