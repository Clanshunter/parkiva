using parkiva_api.DTOs.Parking;

namespace parkiva_api.DTOs.FavoriteParking
{
    public class FavoriteParkingDto
    {
        public int Id { get; set; }
        public string UserId { get; set; }
        public int ParkingId { get; set; }
        public DateTime CreatedAt { get; set; }
        public ParkingDto? Parking { get; set; }
    }
}