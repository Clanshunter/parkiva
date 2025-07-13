using parkiva_api.DTOs;

namespace parkiva_api.Services.Ispark.Api
{
    public interface IIsparkService
    {
        Task<List<IsparkDto>> GetParkingsAsync();
    }
}
