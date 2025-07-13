using Microsoft.EntityFrameworkCore;
using parkiva_api.Data;
using parkiva_api.DTOs.Parking;
using parkiva_api.Enums;
using Models = parkiva_api.Models;

namespace parkiva_api.Services.Parking
{
    public class ParkingService : IParkingService
    {
        private readonly AppDbContext _context;

        public ParkingService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<ParkingDto>> GetAllAsync(string? district)
        {
            var query = _context.Parkings.AsQueryable();

            if (!string.IsNullOrWhiteSpace(district))
                query = query.Where(p => p.District.ToLower() == district.ToLower());

            var list = await query.OrderBy(p => p.Name).ToListAsync();
            return list.Select(MapToDto).ToList();
        }

        public async Task<ParkingDto?> GetByIdAsync(int id)
        {
            var parking = await _context.Parkings.FindAsync(id);
            return parking == null ? null : MapToDto(parking);
        }

        public async Task<List<ParkingDto>> GetNearbyAsync(double lat, double lng, double radiusKm = 2)
        {
            var parkings = await _context.Parkings.ToListAsync();

            return parkings
                .Where(p => GetDistance(lat, lng, p.Latitude, p.Longitude) <= radiusKm)
                .OrderBy(p => GetDistance(lat, lng, p.Latitude, p.Longitude))
                .Take(10)
                .Select(MapToDto)
                .ToList();
        }

        public async Task<ParkingDto> CreateAsync(CreateParkingDto dto)
        {
            var parking = new Models.Parking
            {
                Name = dto.Name,
                Latitude = dto.Latitude,
                Longitude = dto.Longitude,
                District = dto.District,
                TotalSpaces = dto.TotalSpaces,
                AvailableSpaces = dto.TotalSpaces,
                FreeTime = dto.FreeTime,
                ParkType = dto.ParkType,
                IsReservable = dto.IsReservable,
                PricePerHour = dto.PricePerHour,
                OpenHours = dto.OpenHours,
                Active = dto.Active,
                ExternalId = dto.ExternalId,
                CreatedAt = DateTime.UtcNow,
                DataSource = ParkingDataSource.Manual
            };

            _context.Parkings.Add(parking);
            await _context.SaveChangesAsync();

            return MapToDto(parking);
        }

        public async Task<ParkingDto?> UpdateAsync(int id, CreateParkingDto dto)
        {
            var parking = await _context.Parkings.FindAsync(id);
            if (parking == null)
                return null;

            parking.Name = dto.Name;
            parking.Latitude = dto.Latitude;
            parking.Longitude = dto.Longitude;
            parking.District = dto.District;
            parking.TotalSpaces = dto.TotalSpaces;
            parking.FreeTime = dto.FreeTime;
            parking.ParkType = dto.ParkType;
            parking.IsReservable = dto.IsReservable;
            parking.PricePerHour = dto.PricePerHour;
            parking.OpenHours = dto.OpenHours;
            parking.Active = dto.Active;
            parking.ExternalId = dto.ExternalId;

            await _context.SaveChangesAsync();
            return MapToDto(parking);
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var parking = await _context.Parkings.FindAsync(id);
            if (parking == null)
                return false;

            _context.Parkings.Remove(parking);
            await _context.SaveChangesAsync();
            return true;
        }

        private double GetDistance(double lat1, double lon1, double lat2, double lon2)
        {
            var R = 6371;
            var dLat = Math.PI / 180 * (lat2 - lat1);
            var dLon = Math.PI / 180 * (lon2 - lon1);

            var a = Math.Sin(dLat / 2) * Math.Sin(dLat / 2) +
                    Math.Cos(Math.PI / 180 * lat1) * Math.Cos(Math.PI / 180 * lat2) *
                    Math.Sin(dLon / 2) * Math.Sin(dLon / 2);

            var c = 2 * Math.Atan2(Math.Sqrt(a), Math.Sqrt(1 - a));
            return R * c;
        }

        private ParkingDto MapToDto(Models.Parking p) => new()
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