import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { Payment } from './entities/payment.entity';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private paymentsRepository: Repository<Payment>,
  ) {}

  async create(createPaymentDto: CreatePaymentDto): Promise<Payment> {
    const payment = this.paymentsRepository.create(createPaymentDto);
    return await this.paymentsRepository.save(payment);
  }

  async findAll(): Promise<Payment[]> {
    return await this.paymentsRepository.find({
      relations: ['user'],
    });
  }

  async findOne(id: string): Promise<Payment | null> {
    return await this.paymentsRepository.findOne({
      where: { id },
      relations: ['user'],
    });
  }

  async findByUserId(userId: string): Promise<Payment[]> {
    return await this.paymentsRepository.find({
      where: { userId },
      relations: ['user'],
    });
  }

  async update(
    id: string,
    updatePaymentDto: UpdatePaymentDto,
  ): Promise<Payment | null> {
    await this.paymentsRepository.update(id, updatePaymentDto);
    return await this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.paymentsRepository.delete(id);
  }

  async approve(id: string, approvedBy: string): Promise<Payment | null> {
    await this.paymentsRepository.update(id, {
      status: 'approved',
      approvedBy,
      approvedAt: new Date(),
    });
    return await this.findOne(id);
  }

  async reject(
    id: string,
    rejectedBy: string,
    rejectionReason?: string,
  ): Promise<Payment | null> {
    await this.paymentsRepository.update(id, {
      status: 'rejected',
      rejectedBy,
      rejectedAt: new Date(),
      rejectionReason,
    });
    return await this.findOne(id);
  }
}
