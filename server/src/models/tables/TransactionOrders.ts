import {
  AutoIncrement,
  Column,
  DataType,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from "sequelize-typescript";
import Cart from "./Cart";
import Transaction from "./Transaction";

@Table({ tableName: "TransactionOrders" })
export default class TransactionOrders extends Model<TransactionOrders> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: Number;

  @ForeignKey(() => Transaction)
  @Column(DataType.INTEGER)
  transaction_id?: Number;

  @ForeignKey(() => Cart)
  @Column(DataType.INTEGER)
  cart_id?: Number;
}
