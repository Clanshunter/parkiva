using parkiva_api.DTOs.Parking;

namespace parkiva_api.Services.Parking
{
    public interface IParkingService
    {
        Task<List<ParkingDto>> GetAllAsync(string? district);
        Task<ParkingDto?> GetByIdAsync(int id);
        Task<List<ParkingDto>> GetNearbyAsync(double lat, double lng, double radiusKm = 2);
        Task<ParkingDto> CreateAsync(CreateParkingDto dto);
        Task<ParkingDto?> UpdateAsync(int id, CreateParkingDto dto);
        Task<bool> DeleteAsync(int id);
    }
}
