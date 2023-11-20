import { Test, TestingModule } from '@nestjs/testing';
import { SupermercadosCiudadesService } from './ciudades-supermercados.service';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { Repository } from 'typeorm';
import { SupermercadoEntity } from '../supermercado/supermercado.entity';
import { CiudadEntity } from '../ciudad/ciudad.entity';
import { faker } from '@faker-js/faker';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('SupermercadosCiudadesService', () => {
  let service: SupermercadosCiudadesService;
  let supermercadoRepository: Repository<SupermercadoEntity>;
  let ciudadRepository: Repository<CiudadEntity>;
  let ciudad: CiudadEntity;
  let supermercadoList: SupermercadoEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [SupermercadosCiudadesService],
    }).compile();

    service = module.get<SupermercadosCiudadesService>(SupermercadosCiudadesService);
    supermercadoRepository = module.get<Repository<SupermercadoEntity>>(getRepositoryToken(SupermercadoEntity));
    ciudadRepository = module.get<Repository<CiudadEntity>>(getRepositoryToken(CiudadEntity));

    await seedDatabase();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  const seedDatabase = async () => {
    supermercadoRepository.clear();
    ciudadRepository.clear();
    supermercadoList = [];
    for(let i = 0; i < 5; i++) {
      const supermercado: SupermercadoEntity = await supermercadoRepository.save({
        nombre: faker.company.name(),
        latitud: faker.location.latitude(),
        longitud: faker.location.longitude(),
        paginaWeb: faker.internet.url(),
      });
      supermercadoList.push(supermercado);
    }
    ciudad = await ciudadRepository.save({
      nombre: faker.location.city(),
      numeroHabitantes: faker.number.int(),
      pais: "Ecuador",
      supermercados: supermercadoList,
    });
  };

  it('addSupermarketToCity debería agregar un supermercado a una ciudad', async () => {
    const newCiudad: CiudadEntity = await ciudadRepository.save({
      nombre: faker.location.city(),
      numeroHabitantes: faker.number.int(),
      pais: "Ecuador",
      supermercados: [],
    });
    const newSupermercado: SupermercadoEntity = await supermercadoRepository.save({
      nombre: faker.company.name(),
      latitud: faker.location.latitude(),
      longitud: faker.location.longitude(),
      paginaWeb: faker.internet.url(),
    });

    const ciudadLista: CiudadEntity = await service.addSupermarketToCity(newSupermercado.id, newCiudad.id);

    expect(ciudadLista).not.toBeNull();
    expect(ciudadLista.supermercados.length).toBe(1);
    expect(ciudadLista.supermercados[0]).not.toBeNull();
    expect(ciudadLista.supermercados[0].id).toBe(newSupermercado.id);
    expect(ciudadLista.supermercados[0].nombre).toBe(newSupermercado.nombre);
  });

  it('addSupermarketToCity debería retornar un error si el supermercado no existe', async () => {
    const newCiudad: CiudadEntity = await ciudadRepository.save({
      nombre: faker.location.city(),
      numeroHabitantes: faker.number.int(),
      pais: "Ecuador",
      supermercados: [],
    });
    await expect(() => service.addSupermarketToCity("0", newCiudad.id)).rejects.toHaveProperty("message", "El supermercado con el id dado no fue encontrado");
  });

  it('addSupermarketToCity debería retornar un error si la ciudad no existe', async () => {
    await expect(() => service.addSupermarketToCity(supermercadoList[0].id, "0")).rejects.toHaveProperty("message", "La ciudad con el id dado no fue encontrada");
  });

  it('findSupermarketsFromCity debería retornar todos los supermercados de una ciudad', async () => {
    const supermercados: SupermercadoEntity[] = await service.findSupermarketsFromCity(ciudad.id);
    expect(supermercados.length).toBe(supermercadoList.length);
    expect(supermercados).not.toBeNull();
  });

  it('findSupermarketsFromCity debería retornar un error si la ciudad no existe', async () => {
    await expect(() => service.findSupermarketsFromCity("0")).rejects.toHaveProperty("message", "La ciudad con el id dado no fue encontrada");
  });

  it('findSupermarketFromCity debería retornar un supermercado de una ciudad', async () => {
    const storedSupermercado: SupermercadoEntity = supermercadoList[0];
    const supermercado: SupermercadoEntity = await service.findSupermarketFromCity(ciudad.id, storedSupermercado.id);
    expect(supermercado).not.toBeNull();
    expect(supermercado.id).toBe(storedSupermercado.id);
    expect(supermercado.nombre).toBe(storedSupermercado.nombre);
  });

  it('findSupermarketFromCity debería retornar un error si el supermercado no existe', async () => {
    await expect(() => service.findSupermarketFromCity(ciudad.id, "0")).rejects.toHaveProperty("message", "El supermercado con el id dado no fue encontrado");
  });

  it('findSupermarketFromCity debería retornar un error si la ciudad no existe', async () => {
    await expect(() => service.findSupermarketFromCity("0", supermercadoList[0].id)).rejects.toHaveProperty("message", "La ciudad con el id dado no fue encontrada");
  });

  it('findSupermarketFromCity debería retornar un error si el supermercado no está asociado a la ciudad', async () => {
    const newCiudad: CiudadEntity = await ciudadRepository.save({
      nombre: faker.location.city(),
      numeroHabitantes: faker.number.int(),
      pais: "Ecuador",
      supermercados: [],
    });
    await expect(() => service.findSupermarketFromCity(newCiudad.id, supermercadoList[0].id)).rejects.toHaveProperty("message", "el supermercado no se encuentra asociado a la ciudad");
  });

  it('updateSupermarketsFromCity debería actualizar los supermercados de una ciudad', async () => {
    const newSupermercado: SupermercadoEntity = await supermercadoRepository.save({
      nombre: faker.company.name(),
      latitud: faker.location.latitude(),
      longitud: faker.location.longitude(),
      paginaWeb: faker.internet.url(),
    });
    const newSupermercadoList: SupermercadoEntity[] = [newSupermercado];
    const ciudadLista: CiudadEntity = await service.updateSupermarketsFromCity(ciudad.id, newSupermercadoList);
    expect(ciudadLista).not.toBeNull();
    expect(ciudadLista.supermercados.length).toBe(1);
    expect(ciudadLista.supermercados[0]).not.toBeNull();
    expect(ciudadLista.supermercados[0].id).toBe(newSupermercado.id);
    expect(ciudadLista.supermercados[0].nombre).toBe(newSupermercado.nombre);
  });

  it('updateSupermarketsFromCity debería retornar un error si la ciudad no existe', async () => {
    await expect(() => service.updateSupermarketsFromCity("0", supermercadoList)).rejects.toHaveProperty("message", "La ciudad con el id dado no fue encontrada");
  });

  it('updateSupermarketsFromCity debería retornar un error si alguno de los supermercados no existe', async () => { 
    const newSupermercadoList: SupermercadoEntity[] = [...supermercadoList];
    const newSupermercado: SupermercadoEntity ={
      id: "0",
      nombre: faker.company.name(),
      latitud: faker.location.latitude(),
      longitud: faker.location.longitude(),
      paginaWeb: faker.internet.url(),
      ciudades: [],
    };
    newSupermercadoList.push(newSupermercado);
    await expect(() => service.updateSupermarketsFromCity(ciudad.id, newSupermercadoList)).rejects.toHaveProperty("message", "El supermercado con el id dado no fue encontrado");
  });

  it('deleteSupermarketFromCity debería eliminar un supermercado de una ciudad', async () => {
    const storedSupermercado: SupermercadoEntity = supermercadoList[0];
   await service.deleteSupermarketFromCity(ciudad.id, storedSupermercado.id);
   ciudad = await ciudadRepository.findOne({where: {id: ciudad.id}, relations: ["supermercados"]});
    expect(ciudad).not.toBeNull();
    expect(ciudad.supermercados.length).toBe(supermercadoList.length - 1);
    const deletedSupermercado: SupermercadoEntity = ciudad.supermercados.find(supermercado => supermercado.id == storedSupermercado.id);
    expect(deletedSupermercado).toBeUndefined();
  });

  it('deleteSupermarketFromCity debería retornar un error si el supermercado no existe', async () => {
    await expect(() => service.deleteSupermarketFromCity(ciudad.id, "0")).rejects.toHaveProperty("message", "El supermercado con el id dado no fue encontrado");
  });

  it('deleteSupermarketFromCity debería retornar un error si la ciudad no existe', async () => {  
    await expect(() => service.deleteSupermarketFromCity("0", supermercadoList[0].id)).rejects.toHaveProperty("message", "La ciudad con el id dado no fue encontrada");
  });

});
