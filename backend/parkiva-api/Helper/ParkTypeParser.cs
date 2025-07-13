using parkiva_api.Enums;

namespace parkiva_api.Helper
{
    public static class ParkTypeParser
    {
        public static ParkType Parse(string value)
        {
            return value.Trim().ToUpperInvariant() switch
            {
                "AÇIK OTOPARK" => ParkType.AcikOtopark,
                "KAPALI OTOPARK" => ParkType.KapaliOtopark,
                "YOL ÜSTÜ" => ParkType.YolUstu,
                "KATLI OTOPARK" => ParkType.KatliOtopark,
                "TERAS OTOPARK" => ParkType.TerasOtopark,
                "ZEMİNALTI OTOPARK" => ParkType.ZeminAltiOtopark,
                "AÇIK / ZEMİN ALTI OTOPARK" => ParkType.AcikZeminAltiOtopark,
                "AÇIK / KATLI OTOPARK" => ParkType.AcikKatliOtopark,
                _ => throw new ArgumentException($"Unknown park type: {value}")
            };
        }
    }
}
