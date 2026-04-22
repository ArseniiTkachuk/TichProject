import UserModel from "../model/User.js";

export const Add = async (userData) => {
  try {
    const doc = new UserModel(userData);

    const user = await doc.save();

    return user.toObject();
  } catch (error) {
    console.error("Помилка при створенні користувача:", error.message);
    throw error;
  }
};

export const GetOne = async (filter = {}, projection = "") => {
  try {
    const user = await UserModel.findOne(filter).select(projection).lean();
    return user ? user : null;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Помилка при пошуку користувача");
  }
};

export const Update = async (id, updateData) => {
  try {
    const updatedUser = await UserModel.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    return updatedUser.toObject();
  } catch (error) {
    console.error("Database Update Error:", error);
    throw new Error("Не вдалося оновити дані користувача");
  }
};

export const Verify = async (id) => {
  try {
    const updatedUser = await UserModel.findByIdAndUpdate(
      id,
      { verified: true, $unset: { deleteAt: "" } },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!updatedUser) {
      return null;
    }

    return updatedUser.toObject();
  } catch (error) {
    console.error("Database Verification Error:", error.message);
    throw error;
  }
};
