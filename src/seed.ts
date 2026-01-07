import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AuthService } from './auth/auth.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const authService = app.get(AuthService);

  // Datos del superusuario
  const email = process.env.SUPER_USER_EMAIL || 'admin@basesfederadas.org.ar';
  const password = process.env.SUPER_USER_PASSWORD || 'admin123';
  const name = process.env.SUPER_USER_NAME || 'Administrador';

  try {
    console.log('🔧 Creando superusuario...');
    console.log(`   Email: ${email}`);

    const user = await authService.createSuperUser(email, password, name);

    console.log('✅ Superusuario creado exitosamente:');
    console.log(`   ID: ${user.id}`);
    console.log(`   Email: ${user.email}`);
    console.log(`   Nombre: ${user.name}`);
    console.log(`   Rol: ${user.role}`);
    console.log(`   Nº Socio: ${user.membershipNumber}`);
    console.log('');
    console.log('🔐 Credenciales:');
    console.log(`   Email: ${email}`);
    console.log(`   Password: ${password}`);
    console.log('');
    console.log('⚠️  Recordá cambiar la contraseña en producción!');
  } catch (error) {
    if (error.message?.includes('ya existe')) {
      console.log('ℹ️  El superusuario ya existe');
    } else {
      console.error('❌ Error creando superusuario:', error.message);
    }
  }

  await app.close();
}

bootstrap();

