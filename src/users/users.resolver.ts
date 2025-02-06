import { Resolver, Query, Mutation, Args, Context } from "@nestjs/graphql";
import { User } from "./entities/user.entity";
import { UsersService } from "./users.service";
import { CreateAccountInput, CreateAccountOutput } from "./dtos/create-account.dto";
import { LoginInput, LoginOutput } from "./dtos/login.dto";
@Resolver(of => User)
export class UsersResolver {
    constructor(
        private readonly usersService:UsersService
    ){}

    @Query(retruns => Boolean) 
    hi() {
        return true;
    }

    @Mutation(returns=>CreateAccountOutput)
    async createAccount(@Args("input") createAccountInput:CreateAccountInput) : Promise<CreateAccountOutput> {
        try {
            return this.usersService.createAccount(createAccountInput);
        } catch(error) {
            return {
                ok : false,
                error : error,
            }
        }
    }

    @Mutation(returns => LoginOutput)
    async login(@Args('input') loginInput : LoginInput) : Promise<LoginOutput> {
      try{
        return this.usersService.login(loginInput);
      } catch(error) {
        return {
            ok: false,
            error
        }
      } 
    }

    @Query(returns=> User)
    me(
        @Context() context
    ) {
        if(!context.user) {
            return; 
        } else {
            return context.user;
        }
    }
}