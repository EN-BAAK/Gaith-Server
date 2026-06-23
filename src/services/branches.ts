import ErrorHandler from "../middlewares/error";
import { Branch } from "../models/branches";
import { GroupBranch } from "../models/groupBranches";
import { BranchCreationAttributes } from "../types/models";
import { ID } from "../types/variables";

const findBranchById = async (id: ID, withSite = false) => {
  const item = await Branch.findByPk(id, {
    include: withSite ? [{ model: GroupBranch, as: 'groupBranch', attributes: ["name"] }] : []
  })

  if (!item) throw new ErrorHandler("Branch not found", 404)
  return item;
}

const mapBranch = (branch: any) => {
  const json = branch.toJSON()

  return {
    ...json,
    groupId: undefined,
    group: json.groupBranch.name,
    groupBranch: undefined
  }
}

const mapBranchSettings = (branch: any) => {
  const json = branch.toJSON()

  return {
    ...json,
    group: json.groupBranch.name,
    groupBranch: undefined
  }
}

export const getBranches = async () => {
  const branches = await Branch.findAll({
    include: [{ model: GroupBranch, as: "groupBranch", attributes: ["name"] }],
  });
  return branches.map((branch: any) => mapBranch(branch)
  );
};

export const getBranchById = async (id: ID) => {
  const branch = await findBranchById(id, true)
  return mapBranch(branch);
};

export const getBranchesSettings = async () => {
  const branches = await Branch.findAll({
    include: [{ model: GroupBranch, as: "groupBranch", attributes: ["name"] }],
  });

  return branches.map((branch) => mapBranchSettings(branch));
};

export const getBranchByIdSettings = async (id: ID) => {
  const branch = await findBranchById(id, true);
  return mapBranchSettings(branch);
};

export const createBranch = async (data: BranchCreationAttributes) => {
  const branch = await Branch.create(data);
  const dataBranch = await findBranchById(branch.id, true)
  return mapBranchSettings(dataBranch);
};

export const updateBranch = async (
  id: ID,
  data: Partial<BranchCreationAttributes>
) => {
  const branch = await findBranchById(id, true)

  Object.assign(branch, data);
  await branch.save();

  const dataBranch = await findBranchById(branch.id, true)
  return mapBranchSettings(dataBranch);
};

export const deleteBranch = async (id: ID) => {
  const branch = await findBranchById(id)
  return await branch.destroy();
};
