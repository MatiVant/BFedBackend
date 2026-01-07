import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

const SALT_ROUNDS = 10;

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    // Hash password before saving
    const hashedPassword = await bcrypt.hash(createUserDto.password, SALT_ROUNDS);
    
    const user = this.usersRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });
    return await this.usersRepository.save(user);
  }

  async findAll(): Promise<Partial<User>[]> {
    // No devolver profileImage ni password en el listado (muy pesados)
    return await this.usersRepository
      .createQueryBuilder('user')
      .select([
        'user.id',
        'user.email',
        'user.name',
        'user.role',
        'user.phone',
        'user.address',
        'user.membershipNumber',
        'user.joinDate',
        'user.dni',
        'user.annualQuota',
        // profileImage excluido intencionalmente - muy pesado
      ])
      .getMany();
  }

  async findOne(id: string): Promise<User | null> {
    // Para un usuario individual, sí devolvemos la imagen
    const user = await this.usersRepository.findOne({ where: { id } });
    if (user) {
      // Nunca devolver el password
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword as User;
    }
    return null;
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.usersRepository.findOne({ where: { email } });
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User | null> {
    // If password is being updated, hash it first
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, SALT_ROUNDS);
    }
    
    await this.usersRepository.update(id, updateUserDto);
    return await this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.usersRepository.delete(id);
  }
}
