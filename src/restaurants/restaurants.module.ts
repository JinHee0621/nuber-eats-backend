import { RestaurantsResolver } from './restaurants.resolver';
import { Module } from '@nestjs/common';

@Module({
    providers:[RestaurantsResolver]
})
export class RestaurantsModule {}
