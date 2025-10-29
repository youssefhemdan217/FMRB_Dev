import { IUserRepository } from '../../../domain/interfaces/IUserRepository';
import { HashService } from '../../services/HashService';
import { TokenService } from '../../services/TokenService';
import { RegisterDTO, AuthResponseDTO } from '../../dtos/AuthDTO';
export declare class RegisterUserUseCase {
    private userRepository;
    private hashService;
    private tokenService;
    constructor(userRepository: IUserRepository, hashService: HashService, tokenService: TokenService);
    execute(data: RegisterDTO): Promise<AuthResponseDTO>;
}
//# sourceMappingURL=RegisterUser.d.ts.map