import { Test, TestingModule } from '@nestjs/testing';
import { SupermercadoService } from './supermercado.service';
import { Repository } from 'typeorm';
import { SupermercadoEntity } from './supermercado.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';
import exp from 'constants';

describe('SupermercadoService', () => {
  let service: SupermercadoService;
  let repository: Repository<SupermercadoEntity>;
  let supermercadosList: SupermercadoEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [SupermercadoService],
    }).compile();

    service = module.get<SupermercadoService>(SupermercadoService);
    repository = module.get<Repository<SupermercadoEntity>>(getRepositoryToken(SupermercadoEntity));

    await seedDatabase();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });;

  const seedDatabase = async () => {
    repository.clear();
    supermercadosList = [];
    for(let i = 0; i < 5; i++) {
      const supermercado: SupermercadoEntity = await repository.save({
        nombre: faker.company.name(),
        latitud: faker.location.latitude(),
        longitud: faker.location.longitude(),
        paginaWeb: faker.internet.url(),
      });
      supermercadosList.push(supermercado);
    }
  };

  it('findAll debería retornar todos los supermercados', async () => {
    const supermercados: SupermercadoEntity[] = await service.findAll();
    expect(supermercados.length).toBe(supermercados.length);
    expect(supermercados).not.toBeNull();
  });

  it('findOne debería retornar un supermercado', async () => {
    const storedSupermercado: SupermercadoEntity = supermercadosList[0];
    const supermercado: SupermercadoEntity = await service.findOne(storedSupermercado.id);
    expect(supermercado).not.toBeNull();
    expect(supermercado.id).toBe(storedSupermercado.id);
    expect(supermercado.nombre).toBe(storedSupermercado.nombre);
    expect(supermercado.latitud).toBe(storedSupermercado.latitud);
    expect(supermercado.longitud).toBe(storedSupermercado.longitud);
    expect(supermercado.paginaWeb).toBe(storedSupermercado.paginaWeb);
  });

  it('findOne debería retornar un error si el supermercado no existe', async () => {
    await expect(() => service.findOne("0")).rejects.toHaveProperty("message", "El supermercado con el id dado no fue encontrado")
  });

  it('create debería crear un supermercado', async () => {
    const newSupermercado: SupermercadoEntity = {
      id: "",
      nombre: faker.string.alphanumeric({ length: { min: 10, max: 19 } }),
      latitud: faker.location.latitude(),
      longitud: faker.location.longitude(),
      paginaWeb: faker.internet.url(),
      ciudades: [],
    };
    const supermercado: SupermercadoEntity = await service.create(newSupermercado);
    expect(supermercado).not.toBeNull();
    expect(supermercado.id).not.toBeNull();
    expect(supermercado.nombre).toBe(newSupermercado.nombre);
    expect(supermercado.latitud).toBe(newSupermercado.latitud);
    expect(supermercado.longitud).toBe(newSupermercado.longitud);
    expect(supermercado.paginaWeb).toBe(newSupermercado.paginaWeb);
  });

  it('update debería actualizar un supermercado', async () => {
    const supermercadoToUpdate: SupermercadoEntity = supermercadosList[0];
    supermercadoToUpdate.nombre = faker.string.alphanumeric({ length: { min: 10, max: 19 } });
    supermercadoToUpdate.latitud = faker.location.latitude();
    const supermercadoUpdated = await service.update(supermercadoToUpdate.id, supermercadoToUpdate);
    expect(supermercadoUpdated).not.toBeNull();
    expect(supermercadoUpdated.id).toBe(supermercadoToUpdate.id);
    expect(supermercadoUpdated.nombre).toBe(supermercadoToUpdate.nombre);
    expect(supermercadoUpdated.latitud).toBe(supermercadoToUpdate.latitud);
  });

  it('update debería retornar un error si el supermercado no existe', async () => {
    const supermercadoToUpdate: SupermercadoEntity = supermercadosList[0];
    await expect(() => service.update("0", supermercadoToUpdate)).rejects.toHaveProperty("message", "El supermercado con el id dado no fue encontrado")
  });

  it('delete debería eliminar un supermercado', async () => {
    const supermercadoToDelete: SupermercadoEntity = supermercadosList[0];
    await service.delete(supermercadoToDelete.id);
    await expect(() => service.findOne(supermercadoToDelete.id)).rejects.toHaveProperty("message", "El supermercado con el id dado no fue encontrado")
  });

  it('delete debería retornar un error si el supermercado no existe', async () => {
    await expect(() => service.delete("0")).rejects.toHaveProperty("message", "El supermercado con el id dado no fue encontrado")
  });

});
