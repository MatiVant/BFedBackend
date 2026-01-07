import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  id: string; // UUID o identificador único

  @Index() // Índice para búsquedas por usuario
  @Column()
  userId: string; // FK a User

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number; // Monto del pago

  @Column({
    type: 'enum',
    enum: ['monthly', 'quarterly', 'annual', 'other'],
  })
  type: 'monthly' | 'quarterly' | 'annual' | 'other'; // Tipo de cuota

  @Column()
  description: string; // Descripción del pago

  @Column({
    type: 'enum',
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  })
  status: 'pending' | 'approved' | 'rejected'; // Estado del pago

  @CreateDateColumn()
  createdAt: Date; // Fecha de creación

  @Column({ type: 'timestamp', nullable: true })
  approvedAt?: Date; // Fecha de aprobación (opcional)

  @Column({ type: 'timestamp', nullable: true })
  rejectedAt?: Date; // Fecha de rechazo (opcional)

  @Column({ nullable: true })
  approvedBy?: string; // FK a User (admin que aprobó)

  @Column({ nullable: true })
  rejectedBy?: string; // FK a User (admin que rechazó)

  @Column({ nullable: true })
  rejectionReason?: string; // Razón del rechazo (opcional)

  @Column({ type: 'jsonb', nullable: true })
  file?: {
    // Comprobante adjunto (opcional)
    name: string; // Nombre del archivo
    url: string; // URL del archivo
    type: string; // MIME type
    size: number; // Tamaño en bytes
  };

  @Column({ nullable: true })
  adminNotes?: string; // Notas del administrador (opcional)

  @Column({ type: 'timestamp', nullable: true })
  reviewedAt?: Date; // Fecha de revisión (opcional)

  @Column({ nullable: true })
  reviewedBy?: string; // FK a User (admin que revisó)

  @Column({ type: 'jsonb', nullable: true })
  editHistory?: Array<{
    editedAt: string;
    editedBy: string;
    reason: string;
    previousValues?: any;
  }>; // Historial de ediciones

  @Column({ nullable: true })
  attachmentName?: string; // Nombre del archivo adjunto (legacy)

  @Column({ nullable: true })
  attachmentUrl?: string; // URL del archivo adjunto (legacy)

  @ManyToOne(() => User, (user) => user.payments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;
}
