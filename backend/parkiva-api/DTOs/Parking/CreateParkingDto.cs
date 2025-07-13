using parkiva_api.Enums;
using System.ComponentModel.DataAnnotations;

namespace parkiva_api.DTOs.Parking
{
    public class CreateParkingDto
    {
        [Required]
        public string Name { get; set; }

        [Required]
        public double Latitude { get; set; }

        [Required]
        public double Longitude { get; set; }

        public string District { get; set; }
        public int TotalSpaces { get; set; }
        public int FreeTime { get; set; }
        public ParkType ParkType { get; set; }
        public bool IsReservable { get; set; }
        public decimal PricePerHour { get; set; }
        public string OpenHours { get; set; }
        public bool Active { get; set; }
        public int? ExternalId { get; set; }
    }
}
