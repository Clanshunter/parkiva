using System.ComponentModel.DataAnnotations;

namespace parkiva_api.DTOs.FavoriteParking
{
    public class CreateFavoriteParkingDto
    {
        [Required]
        public string UserId { get; set; }

        [Required]
        public int ParkingId { get; set; }
    }
}