using Microsoft.AspNetCore.Mvc;

namespace Pluxy3dBE.Controllers;

/// <summary>
/// Base controller for CRUD operations with common patterns
/// </summary>
/// <typeparam name="TDto">The main DTO type</typeparam>
/// <typeparam name="TCreateDto">The create DTO type</typeparam>
/// <typeparam name="TUpdateDto">The update DTO type</typeparam>
/// <typeparam name="TKey">The primary key type</typeparam>
public abstract class BaseCrudController<TDto, TCreateDto, TUpdateDto, TKey> : BaseController
    where TDto : class
    where TCreateDto : class
    where TUpdateDto : class
{
    protected BaseCrudController(ILogger logger) : base(logger)
    {
    }

    #region Abstract Methods - Must be implemented by derived controllers

    protected abstract Task<IEnumerable<TDto>> GetAllItemsAsync();
    protected abstract Task<TDto?> GetItemByIdAsync(TKey id);
    protected abstract Task<TDto> CreateItemAsync(TCreateDto createDto);
    protected abstract Task<TDto?> UpdateItemAsync(TKey id, TUpdateDto updateDto);
    protected abstract Task<bool> DeleteItemAsync(TKey id);

    #endregion

    #region Virtual CRUD Operations - Can be overridden if needed

    /// <summary>
    /// GET: Gets all items
    /// </summary>
    [HttpGet]
    public virtual async Task<IActionResult> GetAll()
    {
        return await SafeExecuteAsync(
            async () => await GetAllItemsAsync(),
            $"Get all {typeof(TDto).Name} items"
        );
    }

    /// <summary>
    /// GET: Gets item by ID
    /// </summary>
    [HttpGet("{id}")]
    public virtual async Task<IActionResult> GetById(TKey id)
    {
        if (!ValidateRequired((nameof(id), id)))
        {
            return ValidationErrorResponse();
        }

        return await SafeExecuteAsync(
            async () =>
            {
                var item = await GetItemByIdAsync(id);
                if (item == null)
                {
                    throw new KeyNotFoundException($"{typeof(TDto).Name} with ID {id} not found");
                }
                return item;
            },
            $"Get {typeof(TDto).Name} by ID"
        );
    }

    /// <summary>
    /// POST: Creates a new item
    /// </summary>
    [HttpPost]
    public virtual async Task<IActionResult> Create([FromBody] TCreateDto createDto)
    {
        var validationResult = ValidateModelState();
        if (validationResult != null)
        {
            return validationResult;
        }

        return await SafeExecuteAsync(
            async () =>
            {
                var created = await CreateItemAsync(createDto);
                
                // Try to get the ID for the CreatedAtAction response
                var idProperty = typeof(TDto).GetProperty("Id");
                if (idProperty != null)
                {
                    var id = idProperty.GetValue(created);
                    HttpContext.Response.Headers.Location = $"{Request.Path}/{id}";
                }
                
                return created;
            },
            $"Create {typeof(TDto).Name}",
            $"{typeof(TDto).Name} created successfully"
        );
    }

    /// <summary>
    /// PUT: Updates an existing item
    /// </summary>
    [HttpPut("{id}")]
    public virtual async Task<IActionResult> Update(TKey id, [FromBody] TUpdateDto updateDto)
    {
        if (!ValidateRequired((nameof(id), id)))
        {
            return ValidationErrorResponse();
        }

        var validationResult = ValidateModelState();
        if (validationResult != null)
        {
            return validationResult;
        }

        return await SafeExecuteAsync(
            async () =>
            {
                var updated = await UpdateItemAsync(id, updateDto);
                if (updated == null)
                {
                    throw new KeyNotFoundException($"{typeof(TDto).Name} with ID {id} not found");
                }
                return updated;
            },
            $"Update {typeof(TDto).Name}",
            $"{typeof(TDto).Name} updated successfully"
        );
    }

    /// <summary>
    /// DELETE: Deletes an item
    /// </summary>
    [HttpDelete("{id}")]
    public virtual async Task<IActionResult> Delete(TKey id)
    {
        if (!ValidateRequired((nameof(id), id)))
        {
            return ValidationErrorResponse();
        }

        return await SafeExecuteAsync(
            async () =>
            {
                var deleted = await DeleteItemAsync(id);
                if (!deleted)
                {
                    throw new KeyNotFoundException($"{typeof(TDto).Name} with ID {id} not found");
                }
            },
            $"Delete {typeof(TDto).Name}",
            $"{typeof(TDto).Name} deleted successfully"
        );
    }

    #endregion

    #region Additional Helpers

    /// <summary>
    /// Handles bulk operations safely
    /// </summary>
    protected async Task<IActionResult> SafeBulkExecuteAsync<T>(
        Func<Task<T>> operation,
        string operationName,
        int expectedCount)
    {
        return await SafeExecuteAsync(
            async () =>
            {
                var result = await operation();
                _logger.LogInformation("Bulk operation {OperationName} processed {Count} items - CorrelationId: {CorrelationId}",
                    operationName, expectedCount, CorrelationId);
                return result;
            },
            operationName
        );
    }

    #endregion
}