import { Table, Column, Model, PrimaryKey, Default, DataType, IsEmail, Unique } from 'sequelize-typescript';

@Table({
  tableName: 'users',
  timestamps: true,
})
export class User extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  public declare id: string;

  @Column({ allowNull: false })
  public firstName!: string;

  @Unique
  @IsEmail 
  @Column({ allowNull: false })
  public email!: string;
}