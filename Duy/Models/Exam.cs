using System;
using System.ComponentModel.DataAnnotations;

namespace ExamCountdown.Models
{
    public class Exam
    {
        [Key]
        public int Id { get; set; }
        
        [Required]
        public string SubjectName { get; set; }
        
        public DateTime ExamDate { get; set; }
        public TimeSpan ExamTime { get; set; }
        public string? Room { get; set; }
    }
}