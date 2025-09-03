using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Pluxy3dBE.DomainContracts.DTOs;

namespace Pluxy3dBE.Filters;

public class PagedResultHeadersFilter : IActionFilter
{
    public void OnActionExecuting(ActionExecutingContext context)
    {
        // no-op
    }

    public void OnActionExecuted(ActionExecutedContext context)
    {
        if (context.Result is ObjectResult ok && ok.Value is not null)
        {
            var type = ok.Value.GetType();
            if (IsPagedResult(type))
            {
                dynamic dyn = ok.Value;
                TrySetHeader(context, "X-Total-Count", dyn.TotalCount);
                TrySetHeader(context, "X-Page", dyn.Page);
                TrySetHeader(context, "X-Page-Size", dyn.PageSize);
            }
        }
    }

    private static bool IsPagedResult(Type type)
    {
        if (!type.IsGenericType) return false;
        return type.GetGenericTypeDefinition() == typeof(PagedResult<>);
    }

    private static void TrySetHeader(ActionExecutedContext context, string key, object? value)
    {
        if (value is null) return;
        var str = Convert.ToString(value, System.Globalization.CultureInfo.InvariantCulture);
        if (!string.IsNullOrWhiteSpace(str))
        {
            context.HttpContext.Response.Headers[key] = str;
        }
    }
}
