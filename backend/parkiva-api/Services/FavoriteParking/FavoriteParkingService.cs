using Microsoft.EntityFrameworkCore;
using parkiva_api.Data;
using parkiva_api.DTOs.FavoriteParking;
using parkiva_api.DTOs.Parking;
using parkiva_api.Enums;
using Models = parkiva_api.Models;

namespace parkiva_api.Services.FavoriteParking
{
    public class FavoriteParkingService : IFavoriteParkingService
    {
        private readonly AppDbContext _context;

        public FavoriteParkingService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<FavoriteParkingDto>> GetUserFavoritesAsync(string userId)
        {
            var favorites = await _context.FavoriteParkings
                .Include(f => f.Parking)
                .Where(f => f.UserId == userId)
                .OrderByDescending(f => f.CreatedAt)
                .ToListAsync();

            return favorites.Select(MapToDto).ToList();
        }

        public async Task<FavoriteParkingDto?> GetByIdAsync(int id)
        {
            var favorite = await _context.FavoriteParkings
                .Include(f => f.Parking)
                .FirstOrDefaultAsync(f => f.Id == id);

            return favorite == null ? null : MapToDto(favorite);
        }

        public async Task<FavoriteParkingDto> CreateAsync(CreateFavoriteParkingDto dto)
        {
            // Check if the favorite already exists
            var existingFavorite = await _context.FavoriteParkings
                .FirstOrDefaultAsync(f => f.UserId == dto.UserId && f.ParkingId == dto.ParkingId);

            if (existingFavorite != null)
            {
                throw new InvalidOperationException("Parking is already in favorites.");
            }

            // Check if parking exists
            var parking = await _context.Parkings.FindAsync(dto.ParkingId);
            if (parking == null)
            {
                throw new ArgumentException("Parking not found.");
            }

            var favoriteParking = new Models.FavoriteParking
            {
                UserId = dto.UserId,
                ParkingId = dto.ParkingId,
                CreatedAt = DateTime.UtcNow
            };

            _context.FavoriteParkings.Add(favoriteParking);
            await _context.SaveChangesAsync();

            // Load the parking data for the response
            favoriteParking.Parking = parking;

            return MapToDto(favoriteParking);
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var favorite = await _context.FavoriteParkings.FindAsync(id);
            if (favorite == null)
                return false;

            _context.FavoriteParkings.Remove(favorite);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteByUserAndParkingAsync(string userId, int parkingId)
        {
            var favorite = await _context.FavoriteParkings
                .FirstOrDefaultAsync(f => f.UserId == userId && f.ParkingId == parkingId);

            if (favorite == null)
                return false;

            _context.FavoriteParkings.Remove(favorite);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> IsFavoriteAsync(string userId, int parkingId)
        {
            return await _context.FavoriteParkings
                .AnyAsync(f => f.UserId == userId && f.ParkingId == parkingId);
        }

        private FavoriteParkingDto MapToDto(Models.FavoriteParking f) => new()
        {
            Id = f.Id,
            UserId = f.UserId,
            ParkingId = f.ParkingId,
            CreatedAt = f.CreatedAt,
            Parking = f.Parking != null ? MapParkingToDto(f.Parking) : null
        };

        private ParkingDto MapParkingToDto(Models.Parking p) => new()
        {
            Id = p.Id,
            Name = p.Name,
            Latitude = p.Latitude,
            Longitude = p.Longitude,
            District = p.District,
            TotalSpaces = p.TotalSpaces,
            AvailableSpaces = p.AvailableSpaces,
            FreeTime = p.FreeTime,
            ParkType = p.ParkType,
            IsReservable = p.IsReservable,
            PricePerHour = p.PricePerHour,
            OpenHours = p.OpenHours,
            Active = p.Active,
            ExternalId = p.ExternalId,
            DataSource = p.DataSource,
            CreatedAt = p.CreatedAt,
            LastSyncedAt = p.LastSyncedAt
        };
    }
}