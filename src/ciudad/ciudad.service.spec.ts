import { Test, TestingModule } from '@nestjs/testing';
import { CiudadService } from './ciudad.service';
import { Repository } from 'typeorm';
import { CiudadEntity } from './ciudad.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';

describe('CiudadService', () => {
  let service: CiudadService;
  let repository: Repository<CiudadEntity>;
  let ciudadesList: CiudadEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [CiudadService],
    }).compile();

    service = module.get<CiudadService>(CiudadService);
    repository = module.get<Repository<CiudadEntity>>(getRepositoryToken(CiudadEntity));

    await seedDatabase();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });



  const seedDatabase = async () => {
    repository.clear();
    ciudadesList = [];
    for(let i = 0; i < 5; i++) {
      const ciudad: CiudadEntity = await repository.save({
        nombre: faker.location.city(),
        numeroHabitantes: faker.number.int(),
        pais: "Ecuador",
      });
      ciudadesList.push(ciudad);
    }
  }

  it('findAll debería retornar todas las ciudades', async () => {
    const ciudades: CiudadEntity[] = await service.findAll();
    expect(ciudades.length).toBe(ciudades.length);
    expect(ciudades).not.toBeNull();
  });

  it('findOne debería retornar una ciudad', async () => {
    const storedCiudad: CiudadEntity = ciudadesList[0];
    const ciudad: CiudadEntity = await service.findOne(storedCiudad.id);
    expect(ciudad).not.toBeNull();
    expect(ciudad.id).toBe(storedCiudad.id);
    expect(ciudad.nombre).toBe(storedCiudad.nombre);
    expect(ciudad.numeroHabitantes).toBe(storedCiudad.numeroHabitantes);
    expect(ciudad.pais).toBe(storedCiudad.pais);
  });

  it('findOne debería retornar un error si la ciudad no existe', async () => {
    await expect(() => service.findOne("0")).rejects.toHaveProperty("message", "La ciudad con el id dado no fue encontrada")
  });

  it('create debería crear una ciudad', async () => {
    const newCiudad: CiudadEntity = {
      id: "",
      nombre: faker.location.city(),
      numeroHabitantes: faker.number.int(),
      pais: "Argentina",
      supermercados: [],
    };
    const ciudad: CiudadEntity = await service.create(newCiudad);
    expect(ciudad).not.toBeNull();
    expect(ciudad.id).not.toBeNull();
    expect(ciudad.nombre).not.toBeNull();
    expect(ciudad.numeroHabitantes).not.toBeNull();
    expect(ciudad.pais).not.toBeNull();
  });

  it('update debería actualizar una ciudad', async () => {
    const ciudadToUpdate: CiudadEntity = ciudadesList[0];
    ciudadToUpdate.nombre = faker.location.city();
    const ciudad: CiudadEntity = await service.update(ciudadToUpdate.id, ciudadToUpdate);
    expect(ciudad).not.toBeNull();
    expect(ciudad.nombre).toBe(ciudad.nombre);
  });

  it('update debería retornar un error si la ciudad no existe', async () => {
    await expect(() => service.update("0", ciudadesList[0])).rejects.toHaveProperty("message", "La ciudad con el id dado no fue encontrada")
  });

  it('delete debería eliminar una ciudad', async () => {
    const storedCiudad: CiudadEntity = ciudadesList[0];
    await service.delete(storedCiudad.id);
    await expect(() => service.findOne(storedCiudad.id)).rejects.toHaveProperty("message", "La ciudad con el id dado no fue encontrada")
  });

  it('delete debería retornar un error si la ciudad no existe', async () => {
    await expect(() => service.delete("0")).rejects.toHaveProperty("message", "La ciudad con el id dado no fue encontrada")
  });
});