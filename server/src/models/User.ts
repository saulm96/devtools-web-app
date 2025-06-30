import {
  Table,
  Column,
  Model,
  PrimaryKey,
  Default,
  DataType,
  IsEmail,
  BeforeSave,
  Length,
} from "sequelize-typescript";

import bcrypt from "bcrypt";

@Table({
  tableName: "users",
  timestamps: true,
  paranoid: true,
})
export class User extends Model {
  //id
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  public declare id: string;

  //email
  @IsEmail
  @Column({
    allowNull: false,
    unique: true,
    type: DataType.STRING(50),
  })
  public email!: string;

  //username
  @Length({ min: 3, max: 20 })
  @Column({
    allowNull: false,
    unique: true,
    set(value: string) {
      this.setDataValue("username", value.toLowerCase());
    },
  })
  public username!: string;

  //first name
  @Column({ allowNull: false })
  public firstName!: string;

  //last name
  @Column({ allowNull: true })
  public lastName!: string;

  //password
  @Length({ min: 8 })
  @Column({ allowNull: false })
  public password!: string;

  //HOOKS
  @BeforeSave
  static async hashPassword(user: User) {
    if (user.changed("password")) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(user.password, salt);
    }
  }

  public async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }

  public toJSON() {
    const values = { ...this.get() };
    delete values.password;
    return values;
  }
}
