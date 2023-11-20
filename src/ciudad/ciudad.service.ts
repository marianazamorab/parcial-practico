import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CiudadEntity } from './ciudad.entity';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/business-errors';

@Injectable()
export class CiudadService {
    constructor(@InjectRepository(CiudadEntity) private readonly ciudadRepository: Repository<CiudadEntity>){}

    listaCiudades = ["Argentina", "Ecuador", "Paraguay"];

    async findAll(): Promise<CiudadEntity[]>{
        return await this.ciudadRepository.find({relations: ["supermercados"]});
    }

    async findOne(id: string): Promise<CiudadEntity>{
        const ciudad: CiudadEntity = await this.ciudadRepository.findOne({where: {id}, relations: ["supermercados"]});
        if(!ciudad){
            throw new BusinessLogicException('La ciudad con el id dado no fue encontrada', BusinessError.NOT_FOUND);
        }
        return ciudad;
    }

    async create (ciudad: CiudadEntity): Promise<CiudadEntity>{
        if(!this.listaCiudades.includes(ciudad.pais)){
            throw new BusinessLogicException('El pais no es valido', BusinessError.PRECONDITION_FAILED);
        }
    return await this.ciudadRepository.save(ciudad);
    }

    async update(id: string, ciudad: CiudadEntity): Promise<CiudadEntity>{
        if(!this.listaCiudades.includes(ciudad.pais)){
            throw new BusinessLogicException('El pais no es valido', BusinessError.PRECONDITION_FAILED);
        }
        const ciudadToUpdate: CiudadEntity = await this.findOne(id);
        return await this.ciudadRepository.save({...ciudadToUpdate, ...ciudad});
    }

    async delete (id: string){
        const ciudadToDelete: CiudadEntity = await this.findOne(id);
        await this.ciudadRepository.remove(ciudadToDelete);
    }
}
