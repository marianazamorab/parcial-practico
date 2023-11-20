import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SupermercadoEntity } from './supermercado.entity';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/business-errors';

@Injectable()
export class SupermercadoService {
    constructor(@InjectRepository(SupermercadoEntity) private readonly supermercadoRepository: Repository<SupermercadoEntity>) { }

    async findAll(): Promise<SupermercadoEntity[]> {
        return await this.supermercadoRepository.find({ relations: ["ciudades"]});
    }

    async findOne(id: string): Promise<SupermercadoEntity> {
        const supermercado: SupermercadoEntity = await this.supermercadoRepository.findOne({ where: { id }, relations: ["ciudades"]});
        if (!supermercado) {
            throw new BusinessLogicException('El supermercado con el id dado no fue encontrado', BusinessError.NOT_FOUND);
        }

        return supermercado;
    }

    async create(supermercado: SupermercadoEntity): Promise<SupermercadoEntity> {
        if(supermercado.nombre.length < 10){
            throw new BusinessLogicException('El nombre del supermercado debe tener al menos 10 caracteres', BusinessError.PRECONDITION_FAILED);
        }
        return await this.supermercadoRepository.save(supermercado);
    }

    async update(id: string, supermercado: SupermercadoEntity): Promise<SupermercadoEntity> {
        if(supermercado.nombre.length < 10){
            throw new BusinessLogicException('El nombre del supermercado debe tener al menos 10 caracteres', BusinessError.PRECONDITION_FAILED);
        }
        const supermercadoToUpdate: SupermercadoEntity = await this.findOne(id);
        return await this.supermercadoRepository.save({ ...supermercadoToUpdate, ...supermercado });
    }

    async delete(id: string) {
        const supermercadoToDelete: SupermercadoEntity = await this.findOne(id);
        await this.supermercadoRepository.remove(supermercadoToDelete);
    }
}
