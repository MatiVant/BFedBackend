import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Payment } from '../../payments/entities/payment.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string; // UUID o identificador único

  @Column({ unique: true })
  email: string; // Email único para login

  @Column()
  password: string; // Hash de contraseña

  @Column()
  name: string; // Nombre completo del usuario

  @Column({
    type: 'enum',
    enum: ['associate', 'admin'],
    default: 'associate',
  })
  role: 'associate' | 'admin'; // Rol del usuario

  @Column({ nullable: true })
  phone?: string; // Teléfono (opcional)

  @Column({ nullable: true })
  address?: string; // Dirección (opcional)

  @Column({ unique: true })
  membershipNumber: string; // Número de socio único

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  joinDate: Date; // Fecha de ingreso

  @Column({ nullable: true })
  dni?: string; // DNI (opcional)

  @Column({ nullable: true })
  profileImage?: string; // URL de imagen de perfil (opcional)

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  annualQuota?: number; // Cuota anual objetivo (opcional)

  @OneToMany(() => Payment, (payment) => payment.user)
  payments: Payment[];
}
