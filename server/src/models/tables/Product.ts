import {
  Table,
  Column,
  DataType,
  Model,
  PrimaryKey,
  BelongsTo,
  ForeignKey,
  AutoIncrement,
} from "sequelize-typescript";
import Shop from "./Shop";

@Table({ tableName: "Product" })
export default class Product extends Model<Product> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: Number;

  @ForeignKey(() => Shop)
  @Column(DataType.INTEGER)
  shop_id?: Number;
  @BelongsTo(() => Shop)
  shop!: Shop;

  @Column(DataType.STRING) product_name?: String;
  @Column(DataType.FLOAT) price?: Number;
  @Column(DataType.BOOLEAN) is_active?: Boolean;
}
