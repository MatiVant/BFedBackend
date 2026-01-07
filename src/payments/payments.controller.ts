import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  ForbiddenException,
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
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

@Controller('payments')
@UseGuards(JwtAuthGuard) // Todos los endpoints requieren autenticación
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
  create(@Body() createPaymentDto: CreatePaymentDto) {
    return this.paymentsService.create(createPaymentDto);
  }

  @Get()
  findAll(@Query('userId') userId: string | undefined, @CurrentUser() user: AuthUser) {
    // Si es admin, puede ver todos los pagos o filtrar por usuario
    if (user.role === 'admin') {
      if (userId) {
        return this.paymentsService.findByUserId(userId);
      }
      return this.paymentsService.findAll();
    }
    
    // Si es associate, solo puede ver sus propios pagos
    // Ignoramos el userId del query y forzamos el suyo
    return this.paymentsService.findByUserId(user.id);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    const payment = await this.paymentsService.findOne(id);
    
    // Verificar que el usuario puede ver este pago
    if (user.role !== 'admin' && payment?.userId !== user.id) {
      throw new ForbiddenException('No tienes permiso para ver este pago');
    }
    
    return payment;
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles('admin') // Solo admins pueden editar pagos
  update(@Param('id') id: string, @Body() updatePaymentDto: UpdatePaymentDto) {
    return this.paymentsService.update(id, updatePaymentDto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles('admin') // Solo admins pueden eliminar pagos
  remove(@Param('id') id: string) {
    return this.paymentsService.remove(id);
  }
}
