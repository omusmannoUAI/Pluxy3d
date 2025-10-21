using Microsoft.OpenApi.Models;
using Pluxy3dBE.DomainContracts.Services;
using Pluxy3dBE.Extensions;

var builder = WebApplication.CreateBuilder(args);

// Use the shared AddApiServices to wire DbContext, repositories and domain services
builder.Services.AddApiServices(builder.Configuration);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors("AllowFrontend");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();
