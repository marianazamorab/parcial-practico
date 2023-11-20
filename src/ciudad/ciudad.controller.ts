import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { CiudadService } from './ciudad.service';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors/business-errors.interceptor';
import { CiudadDto } from './ciudad.dto';
import { CiudadEntity } from './ciudad.entity';
import { plainToInstance } from 'class-transformer';

@Controller('cities')
@UseInterceptors(BusinessErrorsInterceptor)
export class CiudadController {
    constructor(private readonly ciudadService: CiudadService) {}

    @Get()
    async findAll() {
        return await this.ciudadService.findAll();
    }

    @Get(':cityId')
    async findOneById( @Param('cityId') cityId: string) {
        return await this.ciudadService.findOne(cityId);
    }

    @Post()
    async create(@Body() cityDTO: CiudadDto) {
        const ciudad: CiudadEntity = plainToInstance(CiudadEntity, cityDTO);
        return await this.ciudadService.create(ciudad);
    }

    @Put(':cityId')
    async update(@Param('cityId') cityId: string, @Body() cityDTO: CiudadDto) {
        const ciudad: CiudadEntity = plainToInstance(CiudadEntity, cityDTO);
        return await this.ciudadService.update(cityId, ciudad);
    }

    @Delete(':cityId')
    @HttpCode(204)
    async delete(@Param('cityId') cityId: string) {
        return await this.ciudadService.delete(cityId);
    }
}

