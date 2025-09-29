import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { RegisterUserDto } from './dto/registerUser.dto';
import { UserService } from 'src/user/user.service';
import * as bcrypt from "bcrypt";
import { JwtService } from '@nestjs/jwt';
import { LoginUserDto } from './dto/loginUser.dto';
import { Role } from 'src/user/schemas/user.types';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService
    ) { }

    async registerUser(registerUserDto: RegisterUserDto) {
        const hash = await bcrypt.hash(registerUserDto.password, 10);
        const user = await this.userService.createUser(
            {
                ...registerUserDto,
                password: hash
            });
        const payload = { sub: user._id, role: user.role }
        const token = await this.jwtService.signAsync(payload);
        return {
            access_token: token
        };
    }

    async loginUser(loginUserDto: LoginUserDto) {
        const user = await this.userService.findByEmail(loginUserDto.email);
        if (!user) throw new UnauthorizedException("Email Id does not exist");
        const matchPassword = await bcrypt.compare(loginUserDto.password, user.password);
        if (!matchPassword) throw new ConflictException("Passwords do not match");

        const payload = { sub: user._id, role: user.role };
        const token = await this.jwtService.sign(payload);
        return {
            message: "User logged in successfully",
            access_token: token
        };
    }
}
