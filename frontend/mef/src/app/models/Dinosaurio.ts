import { Periodo } from './Periodo';
import { Alimentacion } from './Alimentacion';
import { Subclase } from './Subclase';
import { Hueso } from './Hueso';

export class Dinosaurio {
    id : number; 
    subclase:Subclase;
    alimentacion:Alimentacion;
    periodo: Periodo;
    huesos:Hueso[];
}