# Pluxy3D - E-commerce 3D Printing Platform

Este repositorio contiene dos proyectos principales:

- **Backend:** API RESTful desarrollada en .NET 8 Web API, con Entity Framework Core y SQLite. Expone endpoints para productos, autenticación, carrito y órdenes. Implementa arquitectura en capas (Controlador, Servicio, Repositorio), mapeo con AutoMapper y CORS configurado para integración con frontend Next.js.

- **Frontend:** Aplicación web desarrollada en Next.js (React + TypeScript + Tailwind CSS). Permite explorar productos, filtrar por categoría y marca, gestionar el carrito, autenticarse y realizar compras con distintos métodos de pago. El diseño es moderno, responsivo y pensado para e-commerce.

## Estructura
- `/Pluxy3dBE`: Backend .NET 8 Web API
- `/pluxy3d`: Frontend Next.js

## Características principales
- Catálogo de productos con filtros y búsqueda
- Carrito de compras y gestión de órdenes
- Autenticación de usuarios
- Integración de pagos (mockup)
- Arquitectura limpia y modular

## Requisitos
- Node.js, pnpm o npm
- .NET 8 SDK

## Ejecución rápida
1. Instala dependencias en ambos proyectos
2. Aplica migraciones y ejecuta el backend
3. Ejecuta el frontend

---

Desarrollado para la materia SAP 2025.

## Uso rápido del Backend

1. Instala las dependencias:
   ```powershell
   dotnet restore
   ```
2. Ejecuta el servidor:
   ```powershell
   dotnet run
   ```

El backend estará disponible en `http://localhost:5000` (o el puerto configurado).

## Personalización del Backend
Agrega tus modelos, controladores y servicios según las necesidades de tu frontend.
