using parkiva_api.Enums;

namespace parkiva_api.DTOs
{
    public class IsparkDto
    {
        public int ParkID { get; set; }
        public string ParkName { get; set; }
        public double Lat { get; set; }
        public double Lng { get; set; }
        public int Capacity { get; set; }
        public int EmptyCapacity { get; set; }
        public string WorkHours { get; set; }
        public string ParkType { get; set; }
        public int FreeTime { get; set; }
        public string District { get; set; }
        public int IsOpen { get; set; }
    }
}
