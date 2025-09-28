using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Pluxy3dBE.Controllers;

/// <summary>
/// Base controller with common functionality for all API controllers
/// </summary>
[ApiController]
[Produces("application/json")]
public abstract class BaseController : ControllerBase
{
    protected readonly ILogger _logger;

    protected BaseController(ILogger logger)
    {
        _logger = logger;
    }

    #region Context Information

    /// <summary>
    /// Gets the current user ID from claims
    /// </summary>
    protected string? CurrentUserId => User?.FindFirstValue(ClaimTypes.NameIdentifier);

    /// <summary>
    /// Gets the current user email from claims
    /// </summary>
    protected string? CurrentUserEmail => User?.FindFirstValue(ClaimTypes.Email);

    /// <summary>
    /// Gets the current user name from claims
    /// </summary>
    protected string? CurrentUserName => User?.FindFirstValue(ClaimTypes.Name);

    /// <summary>
    /// Gets the client IP address
    /// </summary>
    protected string? ClientIpAddress => HttpContext.Connection.RemoteIpAddress?.ToString();

    /// <summary>
    /// Gets the user agent from request headers
    /// </summary>
    protected string? UserAgent => Request.Headers["User-Agent"].FirstOrDefault();

    /// <summary>
    /// Gets correlation ID for request tracking
    /// </summary>
    protected string CorrelationId => HttpContext.TraceIdentifier;

    #endregion

    #region Standard Responses

    /// <summary>
    /// Returns a standardized success response
    /// </summary>
    protected IActionResult SuccessResponse<T>(T data, string? message = null)
    {
        var response = new
        {
            success = true,
            data,
            message,
            timestamp = DateTime.UtcNow,
            correlationId = CorrelationId
        };

        return Ok(response);
    }

    /// <summary>
    /// Returns a standardized error response
    /// </summary>
    protected IActionResult ErrorResponse(string message, int statusCode = 400, object? details = null)
    {
        var response = new
        {
            success = false,
            error = new
            {
                message,
                details,
                timestamp = DateTime.UtcNow,
                correlationId = CorrelationId
            }
        };

        return StatusCode(statusCode, response);
    }

    /// <summary>
    /// Returns a standardized not found response
    /// </summary>
    protected IActionResult NotFoundResponse(string resource, object? identifier = null)
    {
        var message = $"{resource} not found";
        if (identifier != null)
        {
            message += $" with identifier: {identifier}";
        }

        return ErrorResponse(message, 404);
    }

    /// <summary>
    /// Returns a standardized validation error response
    /// </summary>
    protected IActionResult ValidationErrorResponse(string? message = null)
    {
        var errors = ModelState
            .Where(x => x.Value?.Errors.Count > 0)
            .ToDictionary(
                kvp => kvp.Key,
                kvp => kvp.Value?.Errors.Select(e => e.ErrorMessage).ToArray()
            );

        return ErrorResponse(
            message ?? "Validation failed",
            400,
            new { validationErrors = errors }
        );
    }

    #endregion

    #region Safe Execution

    /// <summary>
    /// Executes an async operation safely with standardized error handling
    /// </summary>
    protected async Task<IActionResult> SafeExecuteAsync<T>(
        Func<Task<T>> operation,
        string operationName,
        string? successMessage = null)
    {
        try
        {
            _logger.LogInformation("Starting {OperationName} - CorrelationId: {CorrelationId}, User: {UserId}, IP: {IP}",
                operationName, CorrelationId, CurrentUserId ?? "Anonymous", ClientIpAddress);

            var result = await operation();

            _logger.LogInformation("Completed {OperationName} successfully - CorrelationId: {CorrelationId}",
                operationName, CorrelationId);

            return SuccessResponse(result, successMessage);
        }
        catch (ArgumentException ex)
        {
            _logger.LogWarning(ex, "Validation error in {OperationName} - CorrelationId: {CorrelationId}",
                operationName, CorrelationId);
            return ErrorResponse(ex.Message, 400);
        }
        catch (UnauthorizedAccessException ex)
        {
            _logger.LogWarning(ex, "Unauthorized access in {OperationName} - CorrelationId: {CorrelationId}",
                operationName, CorrelationId);
            return ErrorResponse("Access denied", 403);
        }
        catch (KeyNotFoundException ex)
        {
            _logger.LogWarning(ex, "Resource not found in {OperationName} - CorrelationId: {CorrelationId}",
                operationName, CorrelationId);
            return ErrorResponse(ex.Message, 404);
        }
        catch (InvalidOperationException ex)
        {
            _logger.LogWarning(ex, "Business rule violation in {OperationName} - CorrelationId: {CorrelationId}",
                operationName, CorrelationId);
            return ErrorResponse(ex.Message, 422);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Unexpected error in {OperationName} - CorrelationId: {CorrelationId}",
                operationName, CorrelationId);
            return ErrorResponse("An unexpected error occurred", 500);
        }
    }

    /// <summary>
    /// Executes an async operation that returns void safely with standardized error handling
    /// </summary>
    protected async Task<IActionResult> SafeExecuteAsync(
        Func<Task> operation,
        string operationName,
        string? successMessage = null)
    {
        try
        {
            _logger.LogInformation("Starting {OperationName} - CorrelationId: {CorrelationId}, User: {UserId}, IP: {IP}",
                operationName, CorrelationId, CurrentUserId ?? "Anonymous", ClientIpAddress);

            await operation();

            _logger.LogInformation("Completed {OperationName} successfully - CorrelationId: {CorrelationId}",
                operationName, CorrelationId);

            return SuccessResponse(new { }, successMessage);
        }
        catch (ArgumentException ex)
        {
            _logger.LogWarning(ex, "Validation error in {OperationName} - CorrelationId: {CorrelationId}",
                operationName, CorrelationId);
            return ErrorResponse(ex.Message, 400);
        }
        catch (UnauthorizedAccessException ex)
        {
            _logger.LogWarning(ex, "Unauthorized access in {OperationName} - CorrelationId: {CorrelationId}",
                operationName, CorrelationId);
            return ErrorResponse("Access denied", 403);
        }
        catch (KeyNotFoundException ex)
        {
            _logger.LogWarning(ex, "Resource not found in {OperationName} - CorrelationId: {CorrelationId}",
                operationName, CorrelationId);
            return ErrorResponse(ex.Message, 404);
        }
        catch (InvalidOperationException ex)
        {
            _logger.LogWarning(ex, "Business rule violation in {OperationName} - CorrelationId: {CorrelationId}",
                operationName, CorrelationId);
            return ErrorResponse(ex.Message, 422);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Unexpected error in {OperationName} - CorrelationId: {CorrelationId}",
                operationName, CorrelationId);
            return ErrorResponse("An unexpected error occurred", 500);
        }
    }

    #endregion

    #region Validation Helpers

    /// <summary>
    /// Validates model state and returns validation error response if invalid
    /// </summary>
    protected IActionResult? ValidateModelState()
    {
        return ModelState.IsValid ? null : ValidationErrorResponse();
    }

    /// <summary>
    /// Validates that required parameters are not null or empty
    /// </summary>
    protected bool ValidateRequired(params (string name, object? value)[] parameters)
    {
        foreach (var (name, value) in parameters)
        {
            if (value is null ||
                (value is string str && string.IsNullOrWhiteSpace(str)) ||
                (value is Guid guid && guid == Guid.Empty))
            {
                ModelState.AddModelError(name, $"{name} is required");
            }
        }

        return ModelState.IsValid;
    }

    #endregion

    #region Pagination Helpers

    /// <summary>
    /// Creates a paginated response with metadata
    /// </summary>
    protected IActionResult PaginatedResponse<T>(
        IEnumerable<T> items,
        int totalCount,
        int page,
        int pageSize,
        string? message = null)
    {
        var totalPages = (int)Math.Ceiling((double)totalCount / pageSize);
        
        var response = new
        {
            success = true,
            data = new
            {
                items,
                pagination = new
                {
                    currentPage = page,
                    pageSize,
                    totalCount,
                    totalPages,
                    hasNextPage = page < totalPages,
                    hasPreviousPage = page > 1
                }
            },
            message,
            timestamp = DateTime.UtcNow,
            correlationId = CorrelationId
        };

        return Ok(response);
    }

    /// <summary>
    /// Validates and normalizes pagination parameters
    /// </summary>
    protected (int page, int pageSize) NormalizePagination(int page, int pageSize, int maxPageSize = 100)
    {
        var normalizedPage = Math.Max(1, page);
        var normalizedPageSize = Math.Clamp(pageSize, 1, maxPageSize);
        
        return (normalizedPage, normalizedPageSize);
    }

    #endregion
}