import { IUserRepository } from '../../../domain/interfaces/IUserRepository';
import { HashService } from '../../services/HashService';
import { TokenService } from '../../services/TokenService';
import { UnauthorizedError, ValidationError } from '../../../domain/errors/DomainErrors';
import { LoginDTO, AuthResponseDTO } from '../../dtos/AuthDTO';

export class LoginUserUseCase {
  constructor(
    private userRepository: IUserRepository,
    private hashService: HashService,
    private tokenService: TokenService
  ) {}

  async execute(data: LoginDTO): Promise<AuthResponseDTO> {
    // Validate input
    if (!data.email || !data.password) {
      throw new ValidationError('Email and password are required');
    }

    // Find user
    const user = await this.userRepository.findByEmail(data.email);
    if (!user) {
      throw new UnauthorizedError('Invalid credentials');
    }

    // Check if user is active
    if (!user.isActive) {
      throw new UnauthorizedError('Account is inactive');
    }

    // Verify password
    const isPasswordValid = await this.hashService.compare(data.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedError('Invalid credentials');
    }

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

