"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterUserUseCase = void 0;
const User_1 = require("../../../domain/entities/User");
const DomainErrors_1 = require("../../../domain/errors/DomainErrors");
class RegisterUserUseCase {
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
        if (!data.email || !data.password || !data.name) {
            throw new DomainErrors_1.ValidationError('Email, password, and name are required');
        }
        if (data.password.length < 6) {
            throw new DomainErrors_1.ValidationError('Password must be at least 6 characters');
        }
        // Check if user already exists
        const existingUser = await this.userRepository.findByEmail(data.email);
        if (existingUser) {
            throw new DomainErrors_1.ConflictError('Email already registered');
        }
        // Hash password
        const hashedPassword = await this.hashService.hash(data.password);
        // Create user
        const user = await this.userRepository.create({
            email: data.email,
            password: hashedPassword,
            name: data.name,
            role: User_1.UserRole.USER,
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
exports.RegisterUserUseCase = RegisterUserUseCase;
//# sourceMappingURL=RegisterUser.js.map