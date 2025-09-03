using Pluxy3dBE.DalContracts;
using Pluxy3dBE.DomainContracts.DTOs;
using Pluxy3dBE.DomainContracts.Services;
using System.Text.RegularExpressions;

namespace Pluxy3dBE.Domain.Services;

public class CategoriaService(ICategoriaRepository repo) : ICategoriaService
{
    public async Task<IEnumerable<CategoriaDto>> GetCategoriasAsync()
    {
        var list = await repo.GetSummariesAsync();
        return list.Select(c => new CategoriaDto
        {
            Id = c.Id,
            Nombre = c.Nombre ?? string.Empty,
            Descripcion = c.Descripcion,
            Count = c.Count,
            Slug = Slugify(c.Nombre ?? string.Empty)
        });
    }

    private static string Slugify(string text)
    {
        text = text.ToLowerInvariant();
        text = Regex.Replace(text, @"[^a-z0-9\u00f1\u00e1\u00e9\u00ed\u00f3\u00fa\s-]", "");
        text = Regex.Replace(text, "[\\s_-]+", "-");
        text = Regex.Replace(text, "^-+|-+$", "");
        return text;
    }
}
