import {
  Table,
  Column,
  DataType,
  Model,
  PrimaryKey,
  AutoIncrement,
  HasMany,
} from "sequelize-typescript";
import Product from "./Product";

@Table({ tableName: "Shop" })
export default class Shop extends Model<Shop> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id?: Number;
  @Column(DataType.STRING) name?: String;
  @Column(DataType.STRING) address?: String;
  @Column(DataType.STRING) business_type?: String;
  @Column(DataType.BOOLEAN) is_active?: Boolean;
  @HasMany(() => Product)
  products?: Product[];
}
