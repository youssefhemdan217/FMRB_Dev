import { IUserRepository } from '../../../domain/interfaces/IUserRepository';
import { User, UserRole } from '../../../domain/entities/User';
import { HashService } from '../../services/HashService';
import { TokenService } from '../../services/TokenService';
import { ConflictError, ValidationError } from '../../../domain/errors/DomainErrors';
import { RegisterDTO, AuthResponseDTO } from '../../dtos/AuthDTO';

export class RegisterUserUseCase {
  constructor(
    private userRepository: IUserRepository,
    private hashService: HashService,
    private tokenService: TokenService
  ) {}

  async execute(data: RegisterDTO): Promise<AuthResponseDTO> {
    // Validate input
    if (!data.email || !data.password || !data.name) {
      throw new ValidationError('Email, password, and name are required');
    }

    if (data.password.length < 6) {
      throw new ValidationError('Password must be at least 6 characters');
    }

    // Check if user already exists
    const existingUser = await this.userRepository.findByEmail(data.email);
    if (existingUser) {
      throw new ConflictError('Email already registered');
    }

    // Hash password
    const hashedPassword = await this.hashService.hash(data.password);

    // Create user
    const user: User = await this.userRepository.create({
      email: data.email,
      password: hashedPassword,
      name: data.name,
      role: UserRole.USER,
    });

    // Generate tokens
    const tokenPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = this.tokenService.generateAccessToken(tokenPayload);
    const refreshToken = this.tokenService.generateRefreshToken(tokenPayload);

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      accessToken,
      refreshToken,
    };
  }
}

