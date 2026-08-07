using System.ComponentModel.DataAnnotations ;

namespace TodoApi.Models
{
    public class TodoTask
    {
        public int UserId {get; set;}
        public User User {get; set;} = null! ;
        public int Id {get; set;} 
        
        [Required]
        [MaxLength(100)]
        public string Title {get; set;} = string.Empty ;

        [Required]
        [MaxLength(500)]
        public string Description {get; set;} = string.Empty ;

        public bool IsCompleted = false ;

        public DateTime CreatedAt {get; set;} = DateTime.Now ;

        public DateTime? DueDate {get; set;}

        

        
    }
}