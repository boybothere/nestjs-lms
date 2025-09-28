import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class RegisterUserDto {

    @IsNotEmpty({ message: "First name cannot be empty" })
    @IsString({ message: "First name must be a string" })
    firstName: string;

    @IsNotEmpty({ message: "Last name cannot be empty" })
    @IsString({ message: "Last name must be a string" })
    lastName: string;

    @IsNotEmpty({ message: "Email cannot be empty" })
    @IsEmail({}, { message: "Please enter a valid email address" })
    email: string;

    @IsNotEmpty({ message: "Password cannot be empty" })
    @IsString({ message: "Password must be a string" })
    password: string;
}