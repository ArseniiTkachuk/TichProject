import TestModel from "../model/Test.js";
import mongoose from "mongoose";

export const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

export const Add = async (testData) => {
  try {
    const doc = new TestModel(testData);

    const test = await doc.save();

    return test.toObject();
  } catch (error) {
    console.error("Помилка при створенні тесту:", error.message);
    throw error;
  }
};

export const GetOne = async (filter = {}, projection = "") => {
  try {
    const test = await TestModel.findOne(filter).select(projection).lean();
    return test;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Помилка при пошуку теста");
  }
};

export const GetAll = async (filter = {}, projection = "") => {
  try {
    const tests = await TestModel.find(filter).select(projection).lean();

    return tests;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Не вдалося завантажити список тестів");
  }
};
export const Update = async (id, updateData) => {
  try {
    const updatedTest = await TestModel.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    return updatedTest.toObject();
  } catch (error) {
    console.error("Database Update Error:", error);
    throw new Error("Не вдалося оновити дані теста");
  }
};

export const Remove = async (id) => {
  try {
    const deletedTest = await TestModel.findByIdAndDelete(id);

    if (!deletedTest) {
      return null;
    }

    return deletedTest.toObject();
  } catch (error) {
    console.error("Database Delete Error:", error.message);
    throw new Error("Помилка при видаленні тесту");
  }
};
