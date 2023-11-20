import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors/business-errors.interceptor';
import { SupermercadosCiudadesService } from './ciudades-supermercados.service';
import { SupermercadoEntity } from 'src/supermercado/supermercado.entity';

@Controller('cities')
@UseInterceptors(BusinessErrorsInterceptor)
export class CiudadesSupermercadosController {
    constructor(private readonly ciudadesSupermercadosService: SupermercadosCiudadesService) {}

    @Post(':cityId/supermarkets/:supermarketId')
    async addSupermarketToCity(@Param('cityId') cityId: string, @Param('supermarketId') supermarketId: string) {
        return await this.ciudadesSupermercadosService.addSupermarketToCity(supermarketId, cityId);
    }

    @Get(':cityId/supermarkets')
    async findSupermarketsFromCity(@Param('cityId') cityId: string) {
        return await this.ciudadesSupermercadosService.findSupermarketsFromCity(cityId);
    }

    @Get(':cityId/supermarkets/:supermarketId')
    async findSupermarketFromCity(@Param('cityId') cityId: string, @Param('supermarketId') supermarketId: string) {
        return await this.ciudadesSupermercadosService.findSupermarketFromCity(cityId, supermarketId);
    }

    @Put(':cityId/supermarkets')
    async updateSupermarketsFromCity(@Param('cityId') cityId: string, @Body()supermarkets: SupermercadoEntity[]) {
        return await this.ciudadesSupermercadosService.updateSupermarketsFromCity(cityId, supermarkets);
    }

    @Delete(':cityId/supermarkets/:supermarketId')
    @HttpCode(204)
    async deleteSupermarketFromCity(@Param('cityId') cityId: string, @Param('supermarketId') supermarketId: string) {
        return await this.ciudadesSupermercadosService.deleteSupermarketFromCity(cityId, supermarketId);
    }
}
