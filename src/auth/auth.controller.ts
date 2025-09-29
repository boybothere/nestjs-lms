import { Body, ConflictException, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/registerUser.dto';
import { LoginUserDto } from './dto/loginUser.dto';
import { AuthGuard } from './auth.guard';
import { UserService } from 'src/user/user.service';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly userService: UserService
    ) { }

    @Post('register')
    async register(@Body() registerUserDto: RegisterUserDto) {
        return await this.authService.registerUser(registerUserDto);
    }

    @Post('login')
    async login(@Body() loginUserDto: LoginUserDto) {
        return await this.authService.loginUser(loginUserDto);
    }

    @UseGuards(AuthGuard)
    @Get('profile')
    async getProfile(@Request() req) {
        const userId = req.user.sub;

        const user = await this.userService.getUserById(userId);
        if (!user) throw new ConflictException("User not found");
        return {
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email
        };
    }
}
