# Configuración de Base de Datos PostgreSQL

## Instalación de PostgreSQL

### Windows

1. Descarga PostgreSQL desde: https://www.postgresql.org/download/windows/
2. Instala PostgreSQL con las opciones por defecto
3. Durante la instalación, configura una contraseña para el usuario `postgres`

### macOS

```bash
# Con Homebrew
brew install postgresql
brew services start postgresql
```

### Linux (Ubuntu/Debian)

```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

## Configuración de la Base de Datos

1. **Conectarse a PostgreSQL:**

```bash
sudo -u postgres psql
```

2. **Crear la base de datos:**

```sql
CREATE DATABASE bases_federadas;
```

3. **Crear un usuario (opcional):**

```sql
CREATE USER bases_user WITH PASSWORD 'tu_password';
GRANT ALL PRIVILEGES ON DATABASE bases_federadas TO bases_user;
```

## Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto backend con:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASS=tu_password_aqui
DB_NAME=bases_federadas

# Application Configuration
PORT=3000
NODE_ENV=development
```

**Nota**: Los nombres de las variables han cambiado para seguir las mejores prácticas:

- `DB_USERNAME` → `DB_USER`
- `DB_PASSWORD` → `DB_PASS`

## Instalación de Dependencias

```bash
cd backend
npm install @nestjs/typeorm typeorm pg @nestjs/config
# o si usas yarn:
yarn add @nestjs/typeorm typeorm pg @nestjs/config
```

## Ejecutar el Proyecto

```bash
# Desarrollo
npm run start:dev
# o
yarn start:dev
```

## Verificación

Una vez que el servidor esté corriendo, TypeORM creará automáticamente las tablas en la base de datos. Puedes verificar esto conectándote a PostgreSQL:

```sql
\c bases_federadas
\dt
```

Deberías ver las tablas `users` y `payments` creadas.
