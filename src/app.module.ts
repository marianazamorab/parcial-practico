import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SupermercadoModule } from './supermercado/supermercado.module';
import { CiudadModule } from './ciudad/ciudad.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SupermercadoEntity } from './supermercado/supermercado.entity';
import { CiudadEntity } from './ciudad/ciudad.entity';
import { SupermercadosCiudadesModule } from './ciudades-supermercados/ciudades-supermercados.module';

@Module({
  imports: [SupermercadoModule, CiudadModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
       host: 'localhost',
       port: 5432,
       username: 'postgres',
       password: 'postgres',
       database: 'parcial',
       entities: [SupermercadoEntity, CiudadEntity],
       dropSchema: true,
       synchronize: true,
       keepConnectionAlive: true
     }),
    SupermercadosCiudadesModule,],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
