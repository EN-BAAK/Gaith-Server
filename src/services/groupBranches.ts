import ErrorHandler from "../middlewares/error";
import { GroupBranch } from "../models/groupBranches";
import { GroupBranchCreationAttributes } from "../types/models";
import { ID } from "../types/variables";

const findGroupBranchById = async (id: ID) => {
  const item = await GroupBranch.findByPk(id)
  if (!item) throw new ErrorHandler("Group Branch not found", 404)
  return item;
}

export const getAllGroupBranches = async () => {
  const groupBranch = await GroupBranch.findAll();
  return groupBranch;
};

export const getGroupBranchById = async (id: ID) => {
  const groupBranch = await findGroupBranchById(id)
  return groupBranch;
};

export const createGroupBranch = async (data: GroupBranchCreationAttributes) => {
  const groupBranch = await GroupBranch.create(data);
  return groupBranch;
};

export const updateGroupBranch = async (id: ID, data: GroupBranchCreationAttributes) => {
  const groupBranch = await findGroupBranchById(id);
  Object.assign(groupBranch, data);

  await groupBranch.save();
  return groupBranch;
};

export const deleteGroupBranch = async (id: ID) => {
  const groupBranch = await findGroupBranchById(id);
  await groupBranch.destroy();
};
