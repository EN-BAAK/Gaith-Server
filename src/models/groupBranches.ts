import { DataTypes, Model, Sequelize } from "sequelize";
import { GroupBranchAttributes, GroupBranchCreationAttributes } from "../types/models";
import { ID } from "../types/variables";

export class GroupBranch extends Model<GroupBranchAttributes, GroupBranchCreationAttributes> implements GroupBranchAttributes {
  public id!: ID;
  public name!: string;

  static associate(models: any) {
    GroupBranch.hasMany(models.Branch, {
      foreignKey: "groupId",
      as: "branches",
      onDelete: "CASCADE",
      hooks: true,
    });
  }
}

export default (sequelize: Sequelize) => {
  GroupBranch.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: "groupBranches",
      timestamps: false,
    }
  );

  return GroupBranch;
};
