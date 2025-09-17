using Microsoft.EntityFrameworkCore;
using Pluxy3dBE.DomainContracts.Services;
using Pluxy3dBE.DomainContracts.DTOs;
using Pluxy3dBE.Repository.Data;
using System.Collections.Generic;

namespace Pluxy3dBE.Domain.Services;

public class ContactoService : IContactoService
{
    private readonly AppDbContextFromDb _db;
    public ContactoService(AppDbContextFromDb db) => _db = db;


    public async Task<int> CreateAsync(CreateMensajeDto dto)
    {
        var entity = new Pluxy3dBE.Entities.ConsultasContacto
        {
            Nombre = dto.Nombre,
            Email = dto.Email,
            Mensaje = dto.Mensaje,
            Fecha = DateTime.UtcNow
        };
        _db.ConsultasContactos.Add(entity);
        await _db.SaveChangesAsync();
        return entity.ConsultaId;
    }

    public async Task<IEnumerable<MensajeDto>> GetAllAsync()
    {
        return await _db.ConsultasContactos
            .AsNoTracking()
            .OrderByDescending(x => x.Fecha)
            .Select(x => new MensajeDto(
                x.ConsultaId,
                x.Nombre ?? string.Empty,
                x.Email ?? string.Empty,
                x.Mensaje ?? string.Empty,
                x.Fecha ?? DateTime.UtcNow,
                false
            ))
            .ToListAsync();
    }

    public async Task<bool> PatchReadAsync(PatchReadDto dto)
    {
        var entity = await _db.ConsultasContactos.FirstOrDefaultAsync(x => x.ConsultaId == dto.Id);
        if (entity is null) return false;
        // No Read column today; placeholder for future behavior.
        return true;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var entity = await _db.ConsultasContactos.FirstOrDefaultAsync(x => x.ConsultaId == id);
        if (entity is null) return false;
        _db.ConsultasContactos.Remove(entity);
        await _db.SaveChangesAsync();
        return true;
    }
}
