import {
  Table,
  Column,
  Model,
  PrimaryKey,
  Default,
  DataType,
  ForeignKey,
  BelongsTo,
  BeforeSave,
} from "sequelize-typescript";
import { User } from "./User";

export enum HarmonyTypes {
  MONOCHROMATIC = "monochromatic",
  ANALOGOUS = "analogous",
  COMPLEMENTARY = "complementary",
  TRIADIC = "triadic",
}

@Table({
  tableName: "color_palettes",
  timestamps: false,
  paranoid: false,
})
export class ColorPalette extends Model<ColorPalette> {
  //id
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  public declare id: string;

  //color palette name
  @Column({
    allowNull: false,
    unique: true,
    type: DataType.STRING(50),
  })
  public name!: string;

  //description
  @Column({
    allowNull: false,
    type: DataType.STRING(255),
  })
  public description!: string;

  //main color
  @Column({
    allowNull: false,
    type: DataType.STRING(7),
    validate: {
      isValidHex(value: string) {
        if (!/^#[0-9A-Fa-f]{6}$/.test(value)) {
          throw new Error(`Invalid hex color format: ${value}`);
        }
      },
    },
  })
  public primaryColor!: string;

  //harmony type
  @Column({
    allowNull: false,
    type: DataType.ENUM(...Object.values(HarmonyTypes)),
  })
  public harmonyType!: HarmonyTypes;

  // userId (foreign key to User)
  @ForeignKey(() => User)
  @Column({
    allowNull: false,
    type: DataType.UUID,
  })
  public userId!: string;

  // Association with User
  @BelongsTo(() => User)
  public user!: User;

  // HOOKS
  @BeforeSave
  static normalizeData(palette: ColorPalette) {
    // Normalize palette name
    if (palette.name) {
      palette.name = palette.name.trim();
    }

    // Normalize primary color to uppercase
    if (palette.primaryColor) {
      palette.primaryColor = palette.primaryColor.toUpperCase();
    }
  }
}
