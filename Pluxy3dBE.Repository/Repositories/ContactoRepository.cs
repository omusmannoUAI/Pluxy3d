using Microsoft.EntityFrameworkCore;
using Pluxy3dBE.DalContracts;
using Pluxy3dBE.Entities;
using Pluxy3dBE.Repository.Data;
using Pluxy3dBE.Repository.Repositories;

namespace Pluxy3dBE.Repository.Repositories;

/// <summary>
/// Optimized repository for contact operations
/// Uses BaseRepository to eliminate code duplication
/// Implements contact-specific queries with performance optimization
/// </summary>
public class ContactoRepository : BaseRepository<ConsultasContacto>, IContactoRepository
{
    public ContactoRepository(AppDbContextFromDb context) : base(context)
    {
    }

    #region BaseRepository Overrides

    protected override string GetKeyPropertyName() => nameof(ConsultasContacto.ConsultaId);

    protected override IQueryable<ConsultasContacto> ApplyDefaultOrdering(IQueryable<ConsultasContacto> query)
    {
        return query.OrderByDescending(c => c.Fecha ?? DateTime.MinValue);
    }

    #endregion

    #region IContactoRepository Implementation

    public async Task<(IEnumerable<ConsultasContacto> Items, int TotalCount)> GetContactsPagedAsync(
        int page, 
        int pageSize, 
        bool? isRead = null, 
        DateTime? fromDate = null, 
        DateTime? toDate = null,
        CancellationToken cancellationToken = default)
    {
        if (page <= 0) page = 1;
        if (pageSize <= 0 || pageSize > 100) pageSize = 20;

        var query = _dbSet.AsNoTracking();

        // Apply filters
        if (fromDate.HasValue)
            query = query.Where(c => c.Fecha >= fromDate.Value);

        if (toDate.HasValue)
            query = query.Where(c => c.Fecha <= toDate.Value);

        // Note: IsRead filter would be applied here when the column exists
        // if (isRead.HasValue)
        //     query = query.Where(c => c.IsRead == isRead.Value);

        // Get total count before pagination
        var totalCount = await query.CountAsync(cancellationToken);

        // Apply pagination and ordering
        var items = await query
            .OrderByDescending(c => c.Fecha ?? DateTime.MinValue)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(cancellationToken);

        return (items, totalCount);
    }

    public async Task<IEnumerable<ConsultasContacto>> GetByEmailAsync(
        string email, 
        TimeSpan? withinTimeSpan = null,
        CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(email))
            return Enumerable.Empty<ConsultasContacto>();

        var normalizedEmail = email.Trim().ToLowerInvariant();
        var query = _dbSet.AsNoTracking()
            .Where(c => (c.Email ?? string.Empty).ToLower() == normalizedEmail);

        if (withinTimeSpan.HasValue)
        {
            var cutoffDate = DateTime.UtcNow.Subtract(withinTimeSpan.Value);
            query = query.Where(c => c.Fecha >= cutoffDate);
        }

        return await query
            .OrderByDescending(c => c.Fecha)
            .ToListAsync(cancellationToken);
    }

    public async Task<int> BulkUpdateReadStatusAsync(
        IEnumerable<int> contactIds, 
        bool isRead,
        CancellationToken cancellationToken = default)
    {
        var ids = contactIds.ToList();
        if (!ids.Any()) return 0;

        // Note: This would update the IsRead column when it exists in the schema
        // For now, this is a placeholder for future implementation
        var contacts = await _dbSet
            .Where(c => ids.Contains(c.ConsultaId))
            .ToListAsync(cancellationToken);

        // Future implementation:
        // foreach (var contact in contacts)
        // {
        //     contact.IsRead = isRead;
        //     contact.ReadAt = isRead ? DateTime.UtcNow : null;
        // }

        await _context.SaveChangesAsync(cancellationToken);
        return contacts.Count;
    }

    public async Task<ContactStatistics> GetStatisticsAsync(
        DateTime? fromDate = null, 
        DateTime? toDate = null,
        CancellationToken cancellationToken = default)
    {
        var query = _dbSet.AsNoTracking();

        if (fromDate.HasValue)
            query = query.Where(c => c.Fecha >= fromDate.Value);

        if (toDate.HasValue)
            query = query.Where(c => c.Fecha <= toDate.Value);

        var now = DateTime.UtcNow;
        var today = now.Date;
        var weekStart = today.AddDays(-(int)today.DayOfWeek);

        var totalContacts = await query.CountAsync(cancellationToken);
        var contactsToday = await query.CountAsync(c => c.Fecha >= today, cancellationToken);
        var contactsThisWeek = await query.CountAsync(c => c.Fecha >= weekStart, cancellationToken);
        
        var lastContact = await query
            .OrderByDescending(c => c.Fecha)
            .Select(c => c.Fecha)
            .FirstOrDefaultAsync(cancellationToken);

        // Calculate average contacts per day
        var daysSinceFirst = fromDate.HasValue 
            ? (now - fromDate.Value).TotalDays 
            : totalContacts > 0 
                ? (now - (await query.MinAsync(c => c.Fecha, cancellationToken) ?? now)).TotalDays 
                : 1;

        var averageContactsPerDay = daysSinceFirst > 0 ? totalContacts / (decimal)daysSinceFirst : 0;

        return new ContactStatistics
        {
            TotalContacts = totalContacts,
            UnreadContacts = totalContacts, // All unread until IsRead column is implemented
            ContactsToday = contactsToday,
            ContactsThisWeek = contactsThisWeek,
            AverageContactsPerDay = Math.Round(averageContactsPerDay, 2),
            LastContactDate = lastContact
        };
    }

    #endregion
}