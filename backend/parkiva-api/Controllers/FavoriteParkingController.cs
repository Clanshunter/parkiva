using Microsoft.AspNetCore.Mvc;
using parkiva_api.DTOs.FavoriteParking;
using parkiva_api.Helper;
using parkiva_api.Services.FavoriteParking;

namespace parkiva_api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FavoriteParkingController : ControllerBase
    {
        private readonly IFavoriteParkingService _service;

        public FavoriteParkingController(IFavoriteParkingService service)
        {
            _service = service;
        }

        // GET: /api/favoriteParking/user/{userId}
        [HttpGet("user/{userId}")]
        public async Task<ActionResult<ApiResponse<List<FavoriteParkingDto>>>> GetUserFavorites(string userId)
        {
            var favorites = await _service.GetUserFavoritesAsync(userId);
            return Ok(new ApiResponse<List<FavoriteParkingDto>>(favorites));
        }

        // GET: /api/favoriteParking/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<ApiResponse<FavoriteParkingDto>>> GetById(int id)
        {
            var favorite = await _service.GetByIdAsync(id);
            if (favorite == null)
                return NotFound(new ApiResponse<FavoriteParkingDto>("Favorite parking not found."));

            return Ok(new ApiResponse<FavoriteParkingDto>(favorite));
        }

        // POST: /api/favoriteParking
        [HttpPost]
        public async Task<ActionResult<ApiResponse<FavoriteParkingDto>>> Create([FromBody] CreateFavoriteParkingDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(new ApiResponse<FavoriteParkingDto>("Invalid input."));

            try
            {
                var created = await _service.CreateAsync(dto);
                return CreatedAtAction(nameof(GetById), new { id = created.Id }, new ApiResponse<FavoriteParkingDto>(created, "Parking added to favorites."));
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(new ApiResponse<FavoriteParkingDto>(ex.Message));
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new ApiResponse<FavoriteParkingDto>(ex.Message));
            }
        }

        // DELETE: /api/favoriteParking/{id}
        [HttpDelete("{id}")]
        public async Task<ActionResult<ApiResponse<object>>> Delete(int id)
        {
            var result = await _service.DeleteAsync(id);
            if (!result)
                return NotFound(new ApiResponse<object>("Favorite parking not found."));

            return Ok(new ApiResponse<object>(null, "Parking removed from favorites."));
        }

        // DELETE: /api/favoriteParking/user/{userId}/parking/{parkingId}
        [HttpDelete("user/{userId}/parking/{parkingId}")]
        public async Task<ActionResult<ApiResponse<object>>> DeleteByUserAndParking(string userId, int parkingId)
        {
            var result = await _service.DeleteByUserAndParkingAsync(userId, parkingId);
            if (!result)
                return NotFound(new ApiResponse<object>("Favorite parking not found."));

            return Ok(new ApiResponse<object>(null, "Parking removed from favorites."));
        }

        // GET: /api/favoriteParking/user/{userId}/parking/{parkingId}/check
        [HttpGet("user/{userId}/parking/{parkingId}/check")]
        public async Task<ActionResult<ApiResponse<bool>>> IsFavorite(string userId, int parkingId)
        {
            var isFavorite = await _service.IsFavoriteAsync(userId, parkingId);
            return Ok(new ApiResponse<bool>(isFavorite));
        }
    }
}