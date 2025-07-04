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
import { Op } from "sequelize";
import bcrypt from "bcrypt";

export interface CreateUserData {
  email: string;
  username: string;
  firstName: string;
  lastName?: string;
  password: string;
}

@Table({
  tableName: "users",
  timestamps: true,
  paranoid: true,
})
export class User extends Model {
  // id
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  public declare id: string;

  // email
  @IsEmail
  @Column({
    allowNull: false,
    unique: true,
    type: DataType.STRING(50),
  })
  public declare email: string;

  // username
  @Length({ min: 3, max: 20 })
  @Column({
    allowNull: false,
    unique: true,
    set(value: string) {
      this.setDataValue("username", value.toLowerCase());
    },
  })
  public declare username: string;

  // first name
  @Column({ allowNull: false })
  public declare firstName: string;

  // last name
  @Column({ allowNull: true })
  public declare lastName: string;

  // password
  @Length({ min: 8 })
  @Column({ allowNull: false })
  public declare password: string;

  // Static methods
  public static async createUser(userData: CreateUserData): Promise<User> {
    try {
      if (!userData.email || !userData.username || !userData.password) {
        throw new Error("Email, username and password are required");
      }

      const existingUser = await User.findOne({
        where: {
          [Op.or]: [
            { email: userData.email },
            { username: userData.username },
          ],
        },
      });

      if (existingUser) {
        throw new Error("User with that email or username already exists");
      }

      const newUser = await User.create({
        email: userData.email,
        username: userData.username,
        firstName: userData.firstName,
        lastName: userData.lastName,
        password: userData.password,
      });
      return newUser;
    } catch (error) {
      throw error;
    }
  }

  // HOOKS
  @BeforeSave
  static async hashPassword(user: User) {
    // Check if the password has been changed or if it's a new record
    if (user.changed("password") || user.isNewRecord) {
      if (!user.password) {
        throw new Error("Password is required");
      }
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(user.password, salt);
    }
  }

  // Instance methods
  public async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }

  public toJSON() {
    const values = { ...this.get() };
    delete values.password;
    return values;
  }
}
