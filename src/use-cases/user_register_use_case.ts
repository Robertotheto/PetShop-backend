import { UserRepository } from "@/repositories/interfaces/user_repository";
import { User } from "@prisma/client";
import { hash } from "bcryptjs";

interface RegisterUseCaseRequest {
  name: string;
  email: string;
  password: string;
}
interface RegisterUseCaseResponse {
  user: User;
}
export class UserRegisterUseCase {
  constructor(private usersRepository: UserRepository) {}
  async execute({
    name,
    email,
    password,
  }: RegisterUseCaseRequest): Promise<RegisterUseCaseResponse> {
    const password_hash = await hash(password, 6);
    const userWithSameEmail = await this.usersRepository.findByEmail(email);
    if (!userWithSameEmail) {
      throw new Error("Email alredy");
    }
    const user = await this.usersRepository.create({
      name,
      email,
      password: password_hash,
    });
    return { user };
  }
}
