namespace Pluxy3dBE.DomainContracts.DTOs;

public class FileExportDto
{
    public required byte[] Bytes { get; init; }
    public required string ContentType { get; init; }
    public required string FileName { get; init; }
}
