import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ForbiddenException,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

interface AuthUser {
  id: string;
  email: string;
  role: 'associate' | 'admin';
  name: string;
}

// Configuración de multer para guardar archivos
const imageStorage = diskStorage({
  destination: join(__dirname, '..', '..', 'public', 'images'),
  filename: (req, file, callback) => {
    const uniqueName = `${uuidv4()}${extname(file.originalname)}`;
    callback(null, uniqueName);
  },
});

const imageFileFilter = (req: any, file: any, callback: any) => {
  if (!file.mimetype.match(/\/(jpg|jpeg|png|gif|webp)$/)) {
    return callback(new BadRequestException('Solo se permiten imágenes'), false);
  }
  callback(null, true);
};

@Controller('users')
@UseGuards(JwtAuthGuard) // Todos los endpoints requieren autenticación
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles('admin') // Solo admins pueden crear usuarios
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles('admin') // Solo admins pueden ver lista de usuarios
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    // Admin puede ver cualquier usuario, associate solo su propio perfil
    if (user.role !== 'admin' && user.id !== id) {
      throw new ForbiddenException('No tienes permiso para ver este usuario');
    }
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @CurrentUser() user: AuthUser,
  ) {
    // Admin puede editar cualquier usuario, associate solo su propio perfil
    if (user.role !== 'admin' && user.id !== id) {
      throw new ForbiddenException('No tienes permiso para editar este usuario');
    }
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles('admin') // Solo admins pueden eliminar usuarios
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }

  @Post(':id/upload-image')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: imageStorage,
      fileFilter: imageFileFilter,
      limits: { fileSize: 5 * 1024 * 1024 }, // 5MB máximo
    }),
  )
  async uploadProfileImage(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() user: AuthUser,
  ) {
    // Verificar permisos
    if (user.role !== 'admin' && user.id !== id) {
      throw new ForbiddenException('No tienes permiso para editar este usuario');
    }

    if (!file) {
      throw new BadRequestException('No se proporcionó ninguna imagen');
    }

    // La URL será relativa: /uploads/images/nombre-archivo.jpg
    const imageUrl = `/uploads/images/${file.filename}`;

    // Actualizar el usuario con la nueva URL de imagen
    await this.usersService.update(id, { profileImage: imageUrl });

    return { 
      profileImage: imageUrl,
      message: 'Imagen subida correctamente' 
    };
  }
}
