import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      return null;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return null;
    }

    return user;
  }

  async login(user: User) {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        phone: user.phone,
        address: user.address,
        membershipNumber: user.membershipNumber,
        joinDate: user.joinDate,
        dni: user.dni,
        profileImage: user.profileImage,
      },
      token: this.jwtService.sign(payload),
    };
  }

  async register(registerDto: RegisterDto) {
    // Verificar si el email ya existe
    const existingUser = await this.usersService.findByEmail(registerDto.email);
    if (existingUser) {
      throw new ConflictException('El email ya está registrado');
    }

    // Crear el usuario (UsersService hashea la contraseña automáticamente)
    const user = await this.usersService.create({
      ...registerDto,
      role: registerDto.role || 'associate',
    });

    // Generar token y retornar
    return this.login(user);
  }

  async getProfile(userId: string) {
    const user = await this.usersService.findOne(userId);
    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado');
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      phone: user.phone,
      address: user.address,
      membershipNumber: user.membershipNumber,
      joinDate: user.joinDate,
      dni: user.dni,
      profileImage: user.profileImage,
    };
  }

  // Método para crear un superusuario inicial
  async createSuperUser(
    email: string,
    password: string,
    name: string,
  ): Promise<User> {
    const existingUser = await this.usersService.findByEmail(email);
    if (existingUser) {
      throw new ConflictException('El superusuario ya existe');
    }

    // UsersService hashea la contraseña automáticamente
    return this.usersService.create({
      email,
      password,
      name,
      role: 'admin',
      membershipNumber: 'ADM001',
    });
  }
}
