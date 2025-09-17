namespace Pluxy3dBE.DomainContracts.Payment;

/// <summary>
/// Resultado de procesamiento de pago
/// </summary>
public class PaymentResult
{
    public bool Success { get; set; }
    public bool IsSuccess => Success;
    public string Message { get; set; } = string.Empty;
    public string? TransactionId { get; set; }
    public string? AuthorizationCode { get; set; }
    public decimal Amount { get; set; }
    public DateTime ProcessedAt { get; set; }
    public Dictionary<string, object> AdditionalData { get; set; } = new();

    public static PaymentResult Failure(string message)
    {
        return new PaymentResult
        {
            Success = false,
            Message = message,
            ProcessedAt = DateTime.UtcNow
        };
    }

    public static PaymentResult SuccessResult(string transactionId, decimal amount, string authCode = "")
    {
        return new PaymentResult
        {
            Success = true,
            Message = "Payment processed successfully",
            TransactionId = transactionId,
            AuthorizationCode = authCode,
            Amount = amount,
            ProcessedAt = DateTime.UtcNow
        };
    }
}

/// <summary>
/// Información del cliente para pagos
/// </summary>
public class CustomerInfo
{
    public Guid UserId { get; set; }
    public string Email { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
}

/// <summary>
/// Request de pago
/// </summary>
public class PaymentRequest
{
    public int VentaId { get; set; }
    public decimal Amount { get; set; }
    public string Currency { get; set; } = "ARS";
    public Dictionary<string, object> PaymentData { get; set; } = new();
    public Dictionary<string, object> PaymentDetails { get; set; } = new();
    public Guid UsuarioId { get; set; }
    public CustomerInfo? CustomerInfo { get; set; }
}

/// <summary>
/// Estrategia para procesar pagos
/// </summary>
public interface IPaymentProcessor
{
    Task<PaymentResult> ProcessPaymentAsync(PaymentRequest request);
    Task<PaymentResult> RefundPaymentAsync(string transactionId, decimal amount);
    Task<PaymentResult> GetPaymentStatusAsync(string transactionId);
    string ProcessorName { get; }
    bool IsEnabled { get; }
}

/// <summary>
/// Procesador para tarjetas de crédito
/// </summary>
public class CreditCardProcessor : IPaymentProcessor
{
    public string ProcessorName => "CreditCard";
    public bool IsEnabled => true;

    public async Task<PaymentResult> ProcessPaymentAsync(PaymentRequest request)
    {
        // Simular procesamiento de tarjeta de crédito
        await Task.Delay(1000); // Simular llamada a API externa

        var cardNumber = request.PaymentData.GetValueOrDefault("cardNumber")?.ToString();
        var cvv = request.PaymentData.GetValueOrDefault("cvv")?.ToString();

        // Validaciones básicas
        if (string.IsNullOrEmpty(cardNumber) || string.IsNullOrEmpty(cvv))
        {
            return new PaymentResult
            {
                Success = false,
                Message = "Datos de tarjeta incompletos",
                ProcessedAt = DateTime.UtcNow
            };
        }

        // Simular resultado exitoso
        return new PaymentResult
        {
            Success = true,
            Message = "Pago procesado exitosamente",
            TransactionId = Guid.NewGuid().ToString(),
            AuthorizationCode = Random.Shared.Next(100000, 999999).ToString(),
            Amount = request.Amount,
            ProcessedAt = DateTime.UtcNow
        };
    }

    public async Task<PaymentResult> RefundPaymentAsync(string transactionId, decimal amount)
    {
        await Task.Delay(500);

        return new PaymentResult
        {
            Success = true,
            Message = "Reembolso procesado",
            TransactionId = Guid.NewGuid().ToString(),
            Amount = amount,
            ProcessedAt = DateTime.UtcNow
        };
    }

    public async Task<PaymentResult> GetPaymentStatusAsync(string transactionId)
    {
        await Task.Delay(200);

        return new PaymentResult
        {
            Success = true,
            Message = "Pagado",
            TransactionId = transactionId,
            ProcessedAt = DateTime.UtcNow
        };
    }
}

/// <summary>
/// Procesador para MercadoPago
/// </summary>
public class MercadoPagoProcessor : IPaymentProcessor
{
    public string ProcessorName => "MercadoPago";
    public bool IsEnabled => true;

    public async Task<PaymentResult> ProcessPaymentAsync(PaymentRequest request)
    {
        await Task.Delay(800);

        var email = request.PaymentData.GetValueOrDefault("email")?.ToString();

        if (string.IsNullOrEmpty(email))
        {
            return new PaymentResult
            {
                Success = false,
                Message = "Email requerido para MercadoPago",
                ProcessedAt = DateTime.UtcNow
            };
        }

        return new PaymentResult
        {
            Success = true,
            Message = "Pago con MercadoPago exitoso",
            TransactionId = $"MP-{Guid.NewGuid():N}",
            Amount = request.Amount,
            ProcessedAt = DateTime.UtcNow,
            AdditionalData = new Dictionary<string, object>
            {
                { "mp_payment_id", Random.Shared.Next(10000000, 99999999) },
                { "mp_status", "approved" }
            }
        };
    }

    public async Task<PaymentResult> RefundPaymentAsync(string transactionId, decimal amount)
    {
        await Task.Delay(600);

        return new PaymentResult
        {
            Success = true,
            Message = "Reembolso MercadoPago procesado",
            TransactionId = $"MP-REF-{Guid.NewGuid():N}",
            Amount = amount,
            ProcessedAt = DateTime.UtcNow
        };
    }

    public async Task<PaymentResult> GetPaymentStatusAsync(string transactionId)
    {
        await Task.Delay(300);

        return new PaymentResult
        {
            Success = true,
            Message = "approved",
            TransactionId = transactionId,
            ProcessedAt = DateTime.UtcNow
        };
    }
}

/// <summary>
/// Procesador para transferencias bancarias
/// </summary>
public class BankTransferProcessor : IPaymentProcessor
{
    public string ProcessorName => "BankTransfer";
    public bool IsEnabled => true;

    public async Task<PaymentResult> ProcessPaymentAsync(PaymentRequest request)
    {
        await Task.Delay(1200);

        var bankAccount = request.PaymentData.GetValueOrDefault("bankAccount")?.ToString();

        if (string.IsNullOrEmpty(bankAccount))
        {
            return new PaymentResult
            {
                Success = false,
                Message = "Número de cuenta bancaria requerido",
                ProcessedAt = DateTime.UtcNow
            };
        }

        return new PaymentResult
        {
            Success = true,
            Message = "Transferencia bancaria iniciada",
            TransactionId = $"TRF-{DateTime.UtcNow:yyyyMMdd}-{Random.Shared.Next(1000, 9999)}",
            Amount = request.Amount,
            ProcessedAt = DateTime.UtcNow,
            AdditionalData = new Dictionary<string, object>
            {
                { "bank_reference", $"REF{Random.Shared.Next(100000, 999999)}" },
                { "estimated_completion", DateTime.UtcNow.AddHours(24) }
            }
        };
    }

    public async Task<PaymentResult> RefundPaymentAsync(string transactionId, decimal amount)
    {
        await Task.Delay(1000);

        return new PaymentResult
        {
            Success = true,
            Message = "Reembolso bancario iniciado",
            TransactionId = $"REF-{transactionId}",
            Amount = amount,
            ProcessedAt = DateTime.UtcNow
        };
    }

    public async Task<PaymentResult> GetPaymentStatusAsync(string transactionId)
    {
        await Task.Delay(400);

        return new PaymentResult
        {
            Success = true,
            Message = "En proceso",
            TransactionId = transactionId,
            ProcessedAt = DateTime.UtcNow
        };
    }
}

/// <summary>
/// Factory para crear procesadores de pago
/// </summary>
public interface IPaymentProcessorFactory
{
    IPaymentProcessor CreateProcessor(string processorType);
    IEnumerable<IPaymentProcessor> GetAvailableProcessors();
    IPaymentProcessor GetProcessorByMedioPagoId(int medioPagoId);
}

public class PaymentProcessorFactory : IPaymentProcessorFactory
{
    private readonly Dictionary<string, IPaymentProcessor> _processors;
    private readonly Dictionary<int, string> _medioPagoMapping;

    public PaymentProcessorFactory()
    {
        _processors = new Dictionary<string, IPaymentProcessor>
        {
            { "CreditCard", new CreditCardProcessor() },
            { "MercadoPago", new MercadoPagoProcessor() },
            { "BankTransfer", new BankTransferProcessor() }
        };

        // Mapeo de IDs de medios de pago a procesadores
        _medioPagoMapping = new Dictionary<int, string>
        {
            { 1, "CreditCard" },    // Tarjeta de Crédito
            { 2, "MercadoPago" },   // MercadoPago
            { 3, "BankTransfer" }   // Transferencia Bancaria
        };
    }

    public IPaymentProcessor CreateProcessor(string processorType)
    {
        return _processors.TryGetValue(processorType, out var processor)
            ? processor
            : throw new ArgumentException($"Procesador de pago no soportado: {processorType}");
    }

    public IEnumerable<IPaymentProcessor> GetAvailableProcessors()
    {
        return _processors.Values.Where(p => p.IsEnabled);
    }

    public IPaymentProcessor GetProcessorByMedioPagoId(int medioPagoId)
    {
        if (_medioPagoMapping.TryGetValue(medioPagoId, out var processorType))
        {
            return CreateProcessor(processorType);
        }

        throw new ArgumentException($"No hay procesador configurado para el medio de pago ID: {medioPagoId}");
    }
}
