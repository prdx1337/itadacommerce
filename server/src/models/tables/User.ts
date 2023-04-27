import {
    Table,
    Column,
    DataType,
    Model,
    PrimaryKey,
    AutoIncrement,
    HasOne,
} from "sequelize-typescript";
import Cart from "./Cart";

@Table({ tableName: "User" })
export default class User extends Model<User> {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    id!: Number;
    @Column(DataType.STRING) username?: String;
    @Column(DataType.STRING) password?: String;
    @HasOne(() => Cart)
    cart!: Cart;
}
