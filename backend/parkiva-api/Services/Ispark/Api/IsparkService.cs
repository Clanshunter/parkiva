using parkiva_api.DTOs;
using System.Net.Http;

namespace parkiva_api.Services.Ispark.Api
{
    public class IsparkService : IIsparkService
    {
        private readonly HttpClient _httpClient;
        public IsparkService(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }
        public async Task<List<IsparkDto>> GetParkingsAsync()
        {
            var url = _httpClient.BaseAddress;
            var result = await _httpClient.GetFromJsonAsync<List<IsparkDto>>(url);
            return result ?? new List<IsparkDto>();
        }
    }
}
