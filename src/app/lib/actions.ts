"use server";

import { revalidatePath } from "next/cache";
import { Product, User } from "./models";
import { connectToDB } from "./utils";
import { redirect } from "next/navigation";
import bcrypt from "bcrypt";
import { signIn } from "../auth";
//import { signIn } from "../page";
//import { signIn } from "../auth";
//import { authOptions } from "../auth";
//import {signIn} from "next-auth/react";

interface UserData {
  username: string;
  email: string;
  password: string;
  phone?: string;
  address?: string;
  isAdmin?: boolean;
  isActive?: boolean;
}

export const addUser = async (formData: FormData): Promise<void> => {
  //   const { username, email, password, phone, address, isAdmin, isActive } =
  //     Object.fromEntries(formData);
  //   const { username, email, password, phone, address, isAdmin, isActive } =
  //     formData;

  const data = Object.fromEntries(formData.entries()) as unknown as UserData;

  const { username, email, password, phone, address, isAdmin, isActive } = data;

  try {
    connectToDB();

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      phone,
      address,
      isAdmin,
      isActive,
    });

    await newUser.save();
  } catch (err) {
    console.log(err);
    throw new Error("Failed to create user!");
  }

  revalidatePath("/dashboard/users"); //refresh
  redirect("/dashboard/users");
};

export const updateUser = async (formData: FormData) => {
  const { id, username, email, password, phone, address, isAdmin, isActive } =
    Object.fromEntries(formData);

  try {
    connectToDB();

    const updateFields = {
      username,
      email,
      password,
      phone,
      address,
      isAdmin,
      isActive,
    };

    (Object.keys(updateFields) as Array<keyof typeof updateFields>).forEach(
      (key) => {
        if (updateFields[key] === "" || updateFields[key] === undefined) {
          delete updateFields[key];
        }
      }
    );

    await User.findByIdAndUpdate(id, updateFields);
  } catch (err) {
    console.log(err);
    throw new Error("Failed to update user!");
  }

  revalidatePath("/dashboard/users");
  redirect("/dashboard/users");
};

interface ProductData {
  title: string;
  desc: string;
  price: number;
  stock: number;
  color: string;
  size: string;
}

export const addProduct = async (formData: FormData): Promise<void> => {
  const data = Object.fromEntries(formData.entries()) as unknown as ProductData;

  //   const { title, desc, price, stock, color, size } =
  //     Object.fromEntries(formData);
  const { title, desc, price, stock, color, size } = data;

  try {
    connectToDB();

    const newProduct = new Product({
      title,
      desc,
      price,
      stock,
      color,
      size,
    });

    await newProduct.save();
  } catch (err) {
    console.log(err);
    throw new Error("Failed to create product!");
  }

  revalidatePath("/dashboard/products");
  redirect("/dashboard/products");
};

export const updateProduct = async (formData: FormData) => {
  const { id, title, desc, price, stock, color, size } =
    Object.fromEntries(formData);

  try {
    connectToDB();

    const updateFields = {
      title,
      desc,
      price,
      stock,
      color,
      size,
    };

    // Object.keys(updateFields).forEach(
    //   (key) =>
    //     (updateFields[key] === "" || undefined) && delete updateFields[key]
    // );

    (Object.keys(updateFields) as Array<keyof typeof updateFields>).forEach(
      (key) => {
        if (updateFields[key] === "" || updateFields[key] === undefined) {
          delete updateFields[key];
        }
      }
    );

    await Product.findByIdAndUpdate(id, updateFields);
  } catch (err) {
    console.log(err);
    throw new Error("Failed to update product!");
  }

  revalidatePath("/dashboard/products");
  redirect("/dashboard/products");
};

export const deleteUser = async (formData: FormData): Promise<void> => {
  const { id } = Object.fromEntries(formData);

  try {
    connectToDB();
    await User.findByIdAndDelete(id);
  } catch (err) {
    console.log(err);
    throw new Error("Failed to delete user!");
  }

  revalidatePath("/dashboard/products");
};

export const deleteProduct = async (formData: FormData): Promise<void> => {
  const { id } = Object.fromEntries(formData);

  try {
    connectToDB();
    await Product.findByIdAndDelete(id);
  } catch (err) {
    console.log(err);
    throw new Error("Failed to delete product!");
  }

  revalidatePath("/dashboard/products");
};

interface ErrorData {
  type: string;
}

export const authenticate = async (prevState: any, formData: FormData) => {
  const { username, password } = Object.fromEntries(formData);

  try {
    await signIn("credentials", { username, password });
  } catch (err: any) {
    //console.log(typeof err)
    if (err) {
     // console.log(err)
     // return "Wrong Credentials";
      // if (err.message.includes("CredentialsSignin")) {
        
      //   return "Wrong Credentials";
      // }
      if (err?.type?.includes("CredentialsSignin")) {
        return "Wrong Credentials";
       }
    }

    throw err;
  }
};
