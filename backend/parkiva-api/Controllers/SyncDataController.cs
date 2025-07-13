using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using parkiva_api.Helper;
using parkiva_api.Services.Ispark.Sync;

namespace parkiva_api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SyncDataController : ControllerBase
    {
        private readonly IIsparkSyncService _syncService;
        private readonly ILogger<SyncDataController> _logger;

        public SyncDataController(IIsparkSyncService syncService, ILogger<SyncDataController> logger)
        {
            _syncService = syncService;
            _logger = logger;
        }
        [HttpPost("sync-ispark")]
        public async Task<ActionResult<ApiResponse<object>>> SyncIspark()
        {
            try
            {
                await _syncService.SyncAsync();
                var response = new ApiResponse<object>(
                    "Ispark data synced successfully."
                );
                return Ok(response);
            }
            catch (Exception ex)
            {
                var errorResponse = new ApiResponse<object>("An error occurred while syncing Ispark data.");
                return StatusCode(500, errorResponse);
            }
        }
    }
}
