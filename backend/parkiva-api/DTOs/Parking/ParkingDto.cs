using parkiva_api.Enums;

namespace parkiva_api.DTOs.Parking
{
    public class ParkingDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public double Latitude { get; set; }
        public double Longitude { get; set; }
        public string District { get; set; }
        public int TotalSpaces { get; set; }
        public int AvailableSpaces { get; set; }
        public int FreeTime { get; set; }
        public ParkType ParkType { get; set; }
        public bool IsReservable { get; set; }
        public decimal PricePerHour { get; set; }
        public string OpenHours { get; set; }
        public bool Active { get; set; }
        public int? ExternalId { get; set; }
        public ParkingDataSource DataSource { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? LastSyncedAt { get; set; }
    }
}
