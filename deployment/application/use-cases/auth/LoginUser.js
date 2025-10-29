"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginUserUseCase = void 0;
const DomainErrors_1 = require("../../../domain/errors/DomainErrors");
class LoginUserUseCase {
    userRepository;
    hashService;
    tokenService;
    constructor(userRepository, hashService, tokenService) {
        this.userRepository = userRepository;
        this.hashService = hashService;
        this.tokenService = tokenService;
    }
    async execute(data) {
        // Validate input
        if (!data.email || !data.password) {
            throw new DomainErrors_1.ValidationError('Email and password are required');
        }
        // Find user
        const user = await this.userRepository.findByEmail(data.email);
        if (!user) {
            throw new DomainErrors_1.UnauthorizedError('Invalid credentials');
        }
        // Check if user is active
        if (!user.isActive) {
            throw new DomainErrors_1.UnauthorizedError('Account is inactive');
        }
        // Verify password
        const isPasswordValid = await this.hashService.compare(data.password, user.password);
        if (!isPasswordValid) {
            throw new DomainErrors_1.UnauthorizedError('Invalid credentials');
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
exports.LoginUserUseCase = LoginUserUseCase;
//# sourceMappingURL=LoginUser.js.map