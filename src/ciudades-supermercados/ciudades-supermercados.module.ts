import { Module } from '@nestjs/common';
import { SupermercadosCiudadesService } from './ciudades-supermercados.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CiudadEntity } from '../ciudad/ciudad.entity';
import { SupermercadoEntity } from '../supermercado/supermercado.entity';
import { CiudadesSupermercadosController } from './ciudades-supermercados.controller';

@Module({
  imports: [TypeOrmModule.forFeature([SupermercadoEntity, CiudadEntity])],
  providers: [SupermercadosCiudadesService],
  controllers: [CiudadesSupermercadosController]
})
export class SupermercadosCiudadesModule {}
