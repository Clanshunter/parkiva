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
        public IsparkSyncService(AppDbContext context, IIsparkService isparkService)
        {
            _context = context;
            _isparkService = isparkService;
        }

        public async Task SyncAsync()
        {
            var items = await _isparkService.GetParkingsAsync();

            foreach (var item in items)
            {
                var parking = await _context.Parkings
                    .FirstOrDefaultAsync(p => p.ExternalId == item.ParkID && p.DataSource == ParkingDataSource.Ispark);

                if (parking == null)
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

                    parking.AvailableSpaces = item.EmptyCapacity;
                    parking.TotalSpaces = item.Capacity;
                    parking.LastSyncedAt = DateTime.UtcNow;
                }
            }
            await _context.SaveChangesAsync();
        }

    }
}
