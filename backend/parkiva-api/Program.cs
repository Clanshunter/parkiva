using Microsoft.EntityFrameworkCore;
using parkiva_api.Data;
using parkiva_api.Services.Ispark.Api;
using parkiva_api.Services.Ispark.Sync;
using parkiva_api.Services.Parking;
using parkiva_api.Services.FavoriteParking;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Add CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:3000", "https://localhost:3000")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// Database
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));
// Ispark Services
builder.Services.AddScoped<IIsparkSyncService, IsparkSyncService>();
builder.Services.AddHttpClient<IIsparkService, IsparkService>(client =>
{
    client.BaseAddress = new Uri("https://api.ibb.gov.tr/ispark/Park");
});
builder.Services.AddScoped<IParkingService, ParkingService>();
builder.Services.AddScoped<IFavoriteParkingService, FavoriteParkingService>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors("AllowFrontend");

app.UseAuthorization();

app.MapControllers();

app.Run();
