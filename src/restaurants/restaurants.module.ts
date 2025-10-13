import { TypeOrmModule } from '@nestjs/typeorm';
import { RestaurantsResolver } from './restaurants.resolver';
import { Module } from '@nestjs/common';
import { Category } from './entities/category.entity';
import { Restaurant } from './entities/restaurant.entity';
import { RestaurantService } from './restaurants.service';

@Module({
  imports: [TypeOrmModule.forFeature([Restaurant, Category])],
  providers: [RestaurantsResolver, RestaurantService],
})
export class RestaurantsModule {}
