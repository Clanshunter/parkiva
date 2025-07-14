using parkiva_api.DTOs.FavoriteParking;

namespace parkiva_api.Services.FavoriteParking
{
    public interface IFavoriteParkingService
    {
        Task<List<FavoriteParkingDto>> GetUserFavoritesAsync(string userId);
        Task<FavoriteParkingDto?> GetByIdAsync(int id);
        Task<FavoriteParkingDto> CreateAsync(CreateFavoriteParkingDto dto);
        Task<bool> DeleteAsync(int id);
        Task<bool> DeleteByUserAndParkingAsync(string userId, int parkingId);
        Task<bool> IsFavoriteAsync(string userId, int parkingId);
    }
}