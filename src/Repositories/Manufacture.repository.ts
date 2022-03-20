import { Manufacture } from '@Entities/Manufacture.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(Manufacture)
export class ManufactureRepository extends Repository<Manufacture> {}
