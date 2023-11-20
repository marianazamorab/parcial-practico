import {IsNotEmpty, IsString, IsUrl, IsNumber} from 'class-validator';

export class SupermercadoDto {

    @IsString()
    @IsNotEmpty()
    nombre: string;

    @IsNumber()
    @IsNotEmpty()
    longitud: number;

    @IsNumber()
    @IsNotEmpty()
    latitud: number;

    @IsUrl()
    @IsNotEmpty()
    paginaWeb: string;
}
