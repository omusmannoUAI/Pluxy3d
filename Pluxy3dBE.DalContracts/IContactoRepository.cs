using Pluxy3dBE.DalContracts;
using Pluxy3dBE.Entities;

namespace Pluxy3dBE.DalContracts;

/// <summary>
/// Repository contract for contact operations
/// Extends generic repository with contact-specific queries
/// </summary>
public interface IContactoRepository : IRepository<ConsultasContacto>
{
    /// <summary>
    /// Gets contacts with pagination and filtering
    /// </summary>
    Task<(IEnumerable<ConsultasContacto> Items, int TotalCount)> GetContactsPagedAsync(
        int page, 
        int pageSize, 
        bool? isRead = null, 
        DateTime? fromDate = null, 
        DateTime? toDate = null,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets contacts by email for duplicate detection
    /// </summary>
    Task<IEnumerable<ConsultasContacto>> GetByEmailAsync(
        string email, 
        TimeSpan? withinTimeSpan = null,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Marks multiple contacts as read/unread
    /// </summary>
    Task<int> BulkUpdateReadStatusAsync(
        IEnumerable<int> contactIds, 
        bool isRead,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets contact statistics
    /// </summary>
    Task<ContactStatistics> GetStatisticsAsync(
        DateTime? fromDate = null, 
        DateTime? toDate = null,
        CancellationToken cancellationToken = default);
}

/// <summary>
/// Contact statistics DTO
/// </summary>
public class ContactStatistics
{
    public int TotalContacts { get; set; }
    public int UnreadContacts { get; set; }
    public int ContactsToday { get; set; }
    public int ContactsThisWeek { get; set; }
    public decimal AverageContactsPerDay { get; set; }
    public DateTime? LastContactDate { get; set; }
}