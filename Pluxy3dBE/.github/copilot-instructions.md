<!-- Use this file to prove workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

Este proyecto es un backend en .NET 8 Web API para integrarse con un frontend Next.js. Incluye endpoints de ejemplo para productos, autenticación y carrito. Configura CORS para permitir peticiones desde el frontend.

- Respeta la arquitectura de Capas: Controlador, Servicio y Repositorio.
- Usa Entity Framework Core para la base de datos (ya está instalado y configurado con SQLite).
- Crea librerías de clases para los modelos y DTOs (ver carpetas Models y DTOs).
- Usa AutoMapper para mapear entre los modelos y DTOs (ya está instalado y configurado).
- Registra dependencias en Program.cs usando inyección de dependencias.
- Los controladores deben ser delgados y delegar la lógica a los servicios.
- Los servicios deben usar los repositorios para acceder a datos.
- Los repositorios encapsulan el acceso a la base de datos.
- Los DTOs se usan para exponer datos al frontend, nunca los modelos de dominio directamente.
- Mantén el código limpio, modular y fácil de testear.