import {
  IsEmail,
  IsString,
  IsEnum,
  IsOptional,
  IsNumber,
  IsDateString,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsEmail({}, { message: 'El email debe ser válido' })
  email: string; // Email único para login

  @IsString({ message: 'La contraseña debe ser un string' })
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  password: string; // Hash de contraseña

  @IsString({ message: 'El nombre debe ser un string' })
  name: string; // Nombre completo del usuario

  @IsEnum(['associate', 'admin'], {
    message: 'El rol debe ser associate o admin',
  })
  role: 'associate' | 'admin'; // Rol del usuario

  @IsOptional()
  @IsString({ message: 'El teléfono debe ser un string' })
  phone?: string; // Teléfono (opcional)

  @IsOptional()
  @IsString({ message: 'La dirección debe ser un string' })
  address?: string; // Dirección (opcional)

  @IsString({ message: 'El número de socio debe ser un string' })
  membershipNumber: string; // Número de socio único

  @IsOptional()
  @IsDateString(
    {},
    { message: 'La fecha de ingreso debe ser una fecha válida en formato ISO' },
  )
  joinDate?: string; // Fecha de ingreso (ISO 8601) - opcional, usa fecha actual si no se especifica

  @IsOptional()
  @IsString({ message: 'El DNI debe ser un string' })
  dni?: string; // DNI (opcional)

  @IsOptional()
  @IsString({ message: 'La imagen de perfil debe ser un string (URL)' })
  profileImage?: string; // URL de imagen de perfil (opcional)

  @IsOptional()
  @IsNumber({}, { message: 'La cuota anual debe ser un número' })
  annualQuota?: number; // Cuota anual objetivo (opcional)
}
