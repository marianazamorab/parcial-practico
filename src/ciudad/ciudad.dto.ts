import {IsNotEmpty, IsString, IsUrl, IsNumber} from 'class-validator';
export class CiudadDto {
    @IsString()
    @IsNotEmpty()
    nombre: string;

    @IsString()
    @IsNotEmpty()
    pais: string;

    @IsNumber()
    @IsNotEmpty()
    numeroHabitantes: number;
}
