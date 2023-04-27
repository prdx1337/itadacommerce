import {
  Table,
  Column,
  DataType,
  Model,
  PrimaryKey,
  BelongsTo,
  ForeignKey,
  AutoIncrement,
  BelongsToMany,
  HasOne,
  HasMany,
} from "sequelize-typescript";
import Product from "./Product";
import Shop from "./Shop";
import User from "./User";

@Table({ tableName: "Cart" })
export default class Cart extends Model<Cart> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: Number;

  @ForeignKey(() => User)
  @Column(DataType.INTEGER)
  user_id?: Number;

  @ForeignKey(() => Shop)
  @Column(DataType.INTEGER)
  shop_id?: Number;

  @ForeignKey(() => Product)
  @Column(DataType.INTEGER)
  product_id?: Number;

  @Column(DataType.BOOLEAN) is_active?: Boolean;

  @Column(DataType.INTEGER)
  quantity?: Number;

  @BelongsTo(() => User)
  user!: User;

  @BelongsTo(() => Product)
  product!: Product;
}
