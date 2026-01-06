# Solución de Problemas - Base de Datos

## Error: "no existe la relación «users»"

Este error indica que las tablas no existen en la base de datos. Aquí están las soluciones:

### ✅ **Solución 1: Verificar Variables de Entorno**

Asegúrate de que tu archivo `.env` tenga las variables correctas:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASS=tu_password_aqui
DB_NAME=bases_federadas
NODE_ENV=development
```

### ✅ **Solución 2: Crear la Base de Datos**

Si la base de datos no existe, créala:

```sql
-- Conectarse a PostgreSQL
psql -h localhost -U postgres

-- Crear la base de datos
CREATE DATABASE bases_federadas;

-- Verificar que se creó
\l
```

### ✅ **Solución 3: Configuración Temporal**

He habilitado temporalmente `synchronize: true` en `app.module.ts` para que TypeORM cree las tablas automáticamente.

**⚠️ IMPORTANTE**: Una vez que las tablas se creen, debes:

1. **Deshabilitar synchronize** para producción:

```typescript
synchronize: false,
```

2. **Usar migraciones** para cambios futuros:

```bash
npm run typeorm migration:generate -- -n InitialMigration
npm run typeorm migration:run
```

### ✅ **Solución 4: Verificar Conexión**

Para verificar que la conexión funciona:

```bash
# Probar conexión
psql -h localhost -U postgres -d bases_federadas

# Si funciona, verificar tablas
\dt
```

### 🔄 **Pasos para Solucionar**

1. **Reinicia el servidor**:

```bash
npm run start:dev
```

2. **Verifica los logs** - deberías ver:

```
[Nest] INFO [TypeOrmModule] TypeORM connection established
```

3. **Verifica las tablas**:

```sql
\dt
-- Deberías ver: users, payments
```

### 🚨 **Si el problema persiste**

1. Verifica que PostgreSQL esté corriendo
2. Verifica las credenciales en `.env`
3. Verifica que la base de datos `bases_federadas` exista
4. Revisa los logs del servidor para más detalles






