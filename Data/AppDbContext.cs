using Microsoft.EntityFrameworkCore ;
using TodoApi.Models ;


namespace TodoApi.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
        :base (options)
        {
            
        }
        public DbSet<TodoTask> Tasks{get; set;}
        public DbSet <User> Users {get; set;}
    }
}