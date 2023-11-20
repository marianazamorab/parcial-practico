import { CiudadEntity } from "../ciudad/ciudad.entity";
import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class SupermercadoEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    nombre: string;

    @Column('decimal')
    longitud: number;

    @Column('decimal')
    latitud: number;

    @Column()
    paginaWeb: string;

    @ManyToMany(()=> CiudadEntity, ciudad => ciudad.supermercados)
    ciudades: CiudadEntity[];
}
