using System.ComponentModel.DataAnnotations;

namespace parkiva_api.Models
{
    public class FavoriteParking
    {
        public int Id { get; set; }
        [Required]
        public required string UserId { get; set; }
        [Required]
        public int ParkingId { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public Parking Parking { get; set; }
    }
}
