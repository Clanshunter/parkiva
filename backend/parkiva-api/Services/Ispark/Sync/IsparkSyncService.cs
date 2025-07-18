using Microsoft.EntityFrameworkCore;
using parkiva_api.Data;
using parkiva_api.Enums;
using parkiva_api.Helper;
using parkiva_api.Services.Ispark.Api;

namespace parkiva_api.Services.Ispark.Sync
{
    public class IsparkSyncService : IIsparkSyncService
    {
        private readonly AppDbContext _context;
        private readonly IIsparkService _isparkService;
        private readonly ILogger<IIsparkSyncService> _logger;
        public IsparkSyncService(AppDbContext context, IIsparkService isparkService, ILogger<IIsparkSyncService> logger)
        {
            _context = context;
            _isparkService = isparkService;
            _logger = logger;
        }

        public async Task SyncAsync()
        {
            var items = await _isparkService.GetParkingsAsync();
            var existingParkings = await _context.Parkings
                .Where(p => p.ExternalId != null && p.DataSource == ParkingDataSource.Ispark)
                .ToDictionaryAsync(p => p.ExternalId!.Value);

            foreach (var item in items)
            {
                try
                {
                    if (!existingParkings.TryGetValue(item.ParkID, out var parking))
                    {
                        parking = new Models.Parking
                        {
                            Active = true,
                            ExternalId = item.ParkID,
                            Name = item.ParkName,
                            District = item.District,
                            Latitude = item.Lat,
                            Longitude = item.Lng,
                            TotalSpaces = item.Capacity,
                            AvailableSpaces = item.EmptyCapacity,
                            OpenHours = item.WorkHours,
                            IsReservable = false,
                            PricePerHour = 0,
                            CreatedAt = DateTime.UtcNow,
                            DataSource = ParkingDataSource.Ispark,
                            LastSyncedAt = DateTime.UtcNow,
                            FreeTime = item.FreeTime,
                            ParkType = ParkTypeParser.Parse(item.ParkType.ToString())
                        };
                        _context.Parkings.Add(parking);
                    }
                    else
                    {
                        if (parking.AvailableSpaces != item.EmptyCapacity || parking.TotalSpaces != item.Capacity)
                        {
                            parking.AvailableSpaces = item.EmptyCapacity;
                            parking.TotalSpaces = item.Capacity;
                            parking.LastSyncedAt = DateTime.UtcNow;
                        }
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, $"Error syncing parking: {item.ParkID}");
                }
            }

            await _context.SaveChangesAsync();
        }


    }
}
