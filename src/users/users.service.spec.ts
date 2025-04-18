import { Test } from "@nestjs/testing";
import { UsersService } from "./users.service";
import { getRepositoryToken } from "@nestjs/typeorm";
import { User } from "./entities/user.entity";
import { Verification } from "./entities/verification.entity";
import { verify } from "crypto";
import { JwtService } from "src/jwt/jwt.service";
import { MailService } from "src/mail/mail.service";
import { ObjectLiteral, Repository } from "typeorm";

const mockRepository = {
    findOne : jest.fn(),
    save : jest.fn(),
    create : jest.fn(),
}

const mockJwtService = {
    sign : jest.fn(),
    verify : jest.fn(),
}

const mockMailService = {
    sendVerificationEmail : jest.fn()
}

type mockRepository<T extends ObjectLiteral = any > = Partial<Record<keyof Repository<T>, jest.Mock>>;

describe("UserService", () => {
``
    let service:UsersService;
    let usersRepository:mockRepository<User>;

    beforeAll(async () => {
        const module = await Test.createTestingModule({
            providers : [UsersService, {
                provide: getRepositoryToken(User), useValue : mockRepository
            }, {
                provide: getRepositoryToken(Verification), useValue : mockRepository
            }, {
                provide: JwtService, useValue : mockJwtService
            }, {
                provide: MailService, useValue : mockMailService
            }],
        }).compile();
        service = module.get<UsersService>(UsersService);
        usersRepository = module.get(getRepositoryToken(User));
    })

    it('be defined', () => {
        expect(service).toBeDefined();
    })

    describe("createAccount", () => {
        it('should fail if user exists', async ()=> {
            usersRepository.findOne?.mockResolvedValue({
                id:1,
                email: 'testtestttttest'
            })
            const result = await service.createAccount({
                email: '',
                password: '',
                role: 0
            })
            expect(result).toMatchObject({ ok: false, error: "There is a user with that email already"})
        })
    })

    it.todo('login');
    it.todo('findById');
    it.todo('editProfile');
    it.todo('verifyEmail');
})