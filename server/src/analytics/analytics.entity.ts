import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm'
import { Url } from '../urls/url.entity'

@Entity()
export class Analytics {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @ManyToOne(() => Url, (url) => url.id, { onDelete: 'CASCADE' })
  url: Url

  @Column()
  clickedAt: Date

  @Column()
  ipAddress: string
}
