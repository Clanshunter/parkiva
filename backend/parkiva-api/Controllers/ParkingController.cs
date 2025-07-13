using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using parkiva_api.DTOs.Parking;
using parkiva_api.Helper;
using parkiva_api.Models;
using parkiva_api.Services.Parking;

namespace parkiva_api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ParkingController : ControllerBase
    {
        private readonly IParkingService _service;

        public ParkingController(IParkingService service)
        {
            _service = service;
        }

        // GET: /api/parking?district=Kadikoy
        [HttpGet]
        public async Task<ActionResult<ApiResponse<List<ParkingDto>>>> GetAll([FromQuery] string? district)
        {
            var parkings = await _service.GetAllAsync(district);
            return Ok(new ApiResponse<List<ParkingDto>>(parkings));
        }

        // GET: /api/parking/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<ApiResponse<ParkingDto>>> GetById(int id)
        {
            var parking = await _service.GetByIdAsync(id);
            if (parking == null)
                return NotFound(new ApiResponse<ParkingDto>("Parking not found."));

            return Ok(new ApiResponse<ParkingDto>(parking));
        }

        // GET: /api/parking/nearby?lat=41.01&lng=28.97&radiusKm=2
        [HttpGet("nearby")]
        public async Task<ActionResult<ApiResponse<List<ParkingDto>>>> GetNearby([FromQuery] double lat, [FromQuery] double lng, [FromQuery] double radiusKm = 2)
        {
            var result = await _service.GetNearbyAsync(lat, lng, radiusKm);
            return Ok(new ApiResponse<List<ParkingDto>>(result));
        }

        // POST: /api/parking
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<ApiResponse<ParkingDto>>> Create([FromBody] CreateParkingDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(new ApiResponse<ParkingDto>("Invalid input."));

            var created = await _service.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = created.Id }, new ApiResponse<ParkingDto>(created, "Parking created."));
        }

        // PUT: /api/parking/{id}
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<ApiResponse<ParkingDto>>> Update(int id, [FromBody] CreateParkingDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(new ApiResponse<ParkingDto>("Invalid input."));

            var updated = await _service.UpdateAsync(id, dto);
            if (updated == null)
                return NotFound(new ApiResponse<ParkingDto>("Parking not found."));

            return Ok(new ApiResponse<ParkingDto>(updated, "Parking updated."));
        }

        // DELETE: /api/parking/{id}
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<ApiResponse<string>>> Delete(int id)
        {
            var deleted = await _service.DeleteAsync(id);
            if (!deleted)
                return NotFound(new ApiResponse<string>("Parking not found."));

            return Ok(new ApiResponse<string>("Parking deleted."));
        }
    }
}