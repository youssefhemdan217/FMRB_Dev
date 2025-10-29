import { IUserRepository } from '../../../domain/interfaces/IUserRepository';
import { HashService } from '../../services/HashService';
import { TokenService } from '../../services/TokenService';
import { LoginDTO, AuthResponseDTO } from '../../dtos/AuthDTO';
export declare class LoginUserUseCase {
    private userRepository;
    private hashService;
    private tokenService;
    constructor(userRepository: IUserRepository, hashService: HashService, tokenService: TokenService);
    execute(data: LoginDTO): Promise<AuthResponseDTO>;
}
//# sourceMappingURL=LoginUser.d.ts.map