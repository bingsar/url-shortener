import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, OneToMany } from 'typeorm'
import { Analytics } from '../analytics/analytics.entity'

@Entity()
export class Url {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ unique: true })
  shortUrl: string

  @Column()
  originalUrl: string

  @Column({ nullable: true })
  expiresAt?: Date

  @CreateDateColumn()
  createdAt: Date

  @Column({ default: 0 })
  clickCount: number

  @OneToMany(() => Analytics, (analytics) => analytics.url, { cascade: true })
  analytics: Analytics[]
}
