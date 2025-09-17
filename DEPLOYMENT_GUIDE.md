# 🚀 Guía de Deployments Automáticos

## 📋 Configuración Actual

Los deployments están configurados para ejecutarse **independientemente** según qué archivos se modifiquen:

### 🌐 **Frontend (Azure Static Web Apps)**
**Se despliega SOLO cuando hay cambios en:**
- `pluxy3d/**` - Cualquier archivo dentro del directorio del frontend
- `.github/workflows/azure-static-web-apps-black-rock-07326140f.yml` - Cambios en el workflow del frontend

**Target:** Azure Static Web Apps
**Tiempo estimado:** 2-3 minutos
**URL:** Tu dominio de Azure Static Web Apps

### ⚙️ **Backend (Azure App Service)**
**Se despliega SOLO cuando hay cambios en:**
- `Pluxy3dBE/**` - API principal
- `Pluxy3dBE.Domain/**` - Lógica de negocio
- `Pluxy3dBE.DomainContracts/**` - Contratos y DTOs
- `Pluxy3dBE.DalContracts/**` - Contratos de acceso a datos
- `Pluxy3dBE.Repository/**` - Repositorios y Entity Framework
- `Pluxy3dBE.Entities/**` - Entidades de la base de datos

**Target:** `pluxy3d-api-prod` en Azure App Service
**Tiempo estimado:** 3-5 minutos
**URL:** https://pluxy3d-api-prod-d9h2f3gpf8cmcqd9.eastus2-01.azurewebsites.net

## 🎯 **Ejemplos de Uso**

### Cambios Solo en Frontend
```bash
# Estos cambios SOLO disparan el deployment del frontend
git add pluxy3d/components/NewComponent.tsx
git add pluxy3d/app/page.tsx
git commit -m "Add new component"
git push origin main
# ✅ Solo se despliega el frontend
```

### Cambios Solo en Backend
```bash
# Estos cambios SOLO disparan el deployment del backend
git add Pluxy3dBE/Controllers/ProductsController.cs
git add Pluxy3dBE.Domain/Services/ProductService.cs
git commit -m "Add new product endpoint"
git push origin main
# ✅ Solo se despliega el backend
```

### Cambios Mixtos
```bash
# Estos cambios disparan AMBOS deployments
git add pluxy3d/lib/api.ts
git add Pluxy3dBE/Controllers/ProductsController.cs
git commit -m "Update API integration"
git push origin main
# ✅ Se despliegan frontend Y backend
```

### Cambios en Documentación
```bash
# Estos cambios NO disparan ningún deployment
git add README.md
git add DEPLOYMENT_GUIDE.md
git commit -m "Update documentation"
git push origin main
# ✅ No se despliega nada (ahorro de tiempo y recursos)
```

## 🛠️ **Deployment Manual**

Si necesitas hacer un deployment manual:

### Frontend
1. Ve a Actions en GitHub
2. Selecciona "Azure Static Web Apps CI/CD"
3. Click "Run workflow" → "Run workflow"

### Backend
1. Ve a Actions en GitHub
2. Selecciona "Deploy Pluxy3d Backend"
3. Click "Run workflow" → "Run workflow"

## 📊 **Monitoreo**

- **GitHub Actions:** https://github.com/omusmannoUAI/Pluxy3d/actions
- **Frontend Status:** Visible en la página de Azure Static Web Apps
- **Backend Status:** Visible en Azure App Service

## ⚡ **Ventajas de esta Configuración**

1. **Eficiencia:** Solo se despliega lo que cambió
2. **Velocidad:** Deployments más rápidos
3. **Recursos:** Menor uso de recursos de CI/CD
4. **Debugging:** Más fácil identificar problemas específicos
5. **Rollbacks:** Rollbacks independientes por servicio