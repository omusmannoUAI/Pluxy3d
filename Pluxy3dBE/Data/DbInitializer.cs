using Microsoft.EntityFrameworkCore;
using Pluxy3dBE.Repository.Data;

namespace Pluxy3dBE.Data;

public static class DbInitializer
{
    public static async Task SeedAsync(IServiceProvider services, CancellationToken ct = default)
    {
        await Task.CompletedTask;
    }
}
