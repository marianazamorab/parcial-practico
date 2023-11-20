import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CiudadEntity } from '../ciudad/ciudad.entity';
import { SupermercadoEntity } from '../supermercado/supermercado.entity';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/business-errors';

@Injectable()
export class SupermercadosCiudadesService {

    constructor(
        @InjectRepository(SupermercadoEntity) private readonly supermercadoRepository: Repository<SupermercadoEntity>,

        @InjectRepository(CiudadEntity) private readonly ciudadRepository: Repository<CiudadEntity>,
    ){}

    async addSupermarketToCity(supermarketId: string, cityId: string): Promise<CiudadEntity>{
        const supermarket: SupermercadoEntity = await this.supermercadoRepository.findOne({where: {id: supermarketId}});
        if(!supermarket){
            throw new BusinessLogicException('El supermercado con el id dado no fue encontrado', BusinessError.NOT_FOUND);
        }
        const ciudad: CiudadEntity = await this.ciudadRepository.findOne({where: {id: cityId}, relations: ["supermercados"]});
        if(!ciudad){
            throw new BusinessLogicException('La ciudad con el id dado no fue encontrada', BusinessError.NOT_FOUND);
        }
        ciudad.supermercados = [...ciudad.supermercados, supermarket];
        return await this.ciudadRepository.save(ciudad);
    }

    async findSupermarketsFromCity(cityId: string): Promise<SupermercadoEntity[]>{
        const ciudad: CiudadEntity = await this.ciudadRepository.findOne({where: {id: cityId}, relations: ["supermercados"]});
        if(!ciudad){
            throw new BusinessLogicException('La ciudad con el id dado no fue encontrada', BusinessError.NOT_FOUND);
        }
        return ciudad.supermercados;
    }

    async findSupermarketFromCity(cityId: string, supermarketId: string): Promise<SupermercadoEntity>{
        const supermarket: SupermercadoEntity = await this.supermercadoRepository.findOne({where: {id: supermarketId}});
        if(!supermarket){
            throw new BusinessLogicException('El supermercado con el id dado no fue encontrado', BusinessError.NOT_FOUND);
        }
        const city: CiudadEntity = await this.ciudadRepository.findOne({where: {id: cityId}, relations: ["supermercados"]});
        if(!city){
            throw new BusinessLogicException('La ciudad con el id dado no fue encontrada', BusinessError.NOT_FOUND);
        }
       const supermercado: SupermercadoEntity = city.supermercados.find(supermarket => supermarket.id == supermarketId);
        if(!supermercado){
            throw new BusinessLogicException('el supermercado no se encuentra asociado a la ciudad', BusinessError.PRECONDITION_FAILED);
        }

        return supermercado;
    }

    async updateSupermarketsFromCity(cityId: string, supermarkets: SupermercadoEntity[]): Promise<CiudadEntity>{
        const city: CiudadEntity = await this.ciudadRepository.findOne({where: {id: cityId}, relations: ["supermercados"]});
        if(!city){
            throw new BusinessLogicException('La ciudad con el id dado no fue encontrada', BusinessError.NOT_FOUND);
        }
        for (let i= 0; i < supermarkets.length; i++){
            const supermarket: SupermercadoEntity = await this.supermercadoRepository.findOne({where: {id: supermarkets[i].id}});
            if(!supermarket){
                throw new BusinessLogicException('El supermercado con el id dado no fue encontrado', BusinessError.NOT_FOUND);
            }
        }
        city.supermercados = supermarkets;
        return await this.ciudadRepository.save(city);
    }

    async deleteSupermarketFromCity(cityId: string, supermarketId: string){
        const supermarket: SupermercadoEntity = await this.supermercadoRepository.findOne({where: {id: supermarketId}});
        if(!supermarket){
            throw new BusinessLogicException('El supermercado con el id dado no fue encontrado', BusinessError.NOT_FOUND);
        }
        const city: CiudadEntity = await this.ciudadRepository.findOne({where: {id: cityId}, relations: ["supermercados"]});
        if(!city){
            throw new BusinessLogicException('La ciudad con el id dado no fue encontrada', BusinessError.NOT_FOUND);
        }
  
        const supermercado: SupermercadoEntity = city.supermercados.find(supermarket => supermarket.id == supermarketId);
        if(!supermercado){
            throw new BusinessLogicException('el supermercado no se encuentra asociado a la ciudad', BusinessError.PRECONDITION_FAILED);
        }
        city.supermercados = city.supermercados.filter(supermarket => supermarket.id !== supermarketId);
        await this.ciudadRepository.save(city);
    }

}
