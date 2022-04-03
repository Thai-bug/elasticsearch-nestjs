import { BaseEntity, TreeRepository } from 'typeorm';
import { EntityId } from 'typeorm/repository/EntityId';

export class BaseTreeService<
  T extends BaseEntity,
  R extends TreeRepository<T>,
> {
  protected readonly repository: R;

  constructor(repository: R) {
    this.repository = repository;
  }

  index(): Promise<T[]> {
    return this.repository.find();
  }

  create(info): T[] {
    return this.repository.create(info);
  }

  findById(id: EntityId): Promise<T> {
    return this.repository.findOne(id);
  }

  findByIds(ids: [EntityId]): Promise<T[]> {
    return this.repository.findByIds(ids);
  }

  async store(data: any): Promise<T> {
    return this.repository.save(data).catch((e) => e);
  }

  async update(id: EntityId, data: any): Promise<T> {
    await this.repository.update(id, data);
    return this.findById(id);
  }
}
