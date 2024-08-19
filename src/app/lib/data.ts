import { Product, User } from "./models";
import { connectToDB } from "./utils";

interface UserDocument extends Document {
  id: string;
  username: string;
  email: string;
  img: string;
  isAdmin: boolean;
  isActive: boolean;
  createdAt: Date;

  // Agrega aquí otras propiedades de usuario si es necesario
}

interface FetchUsersResponse {
  count: number;
  users: UserDocument[];
}

export const fetchUsers = async (
  q: string,
  page: number
): Promise<FetchUsersResponse> => {
  const regex = new RegExp(q, "i"); // case insensitive

  const ITEM_PER_PAGE = 2;

  try {
    connectToDB();
    const count = await User.find({
      username: { $regex: regex },
    }).countDocuments();
    const users = await User.find({ username: { $regex: regex } })
      .limit(ITEM_PER_PAGE)
      .skip(ITEM_PER_PAGE * (page - 1)); //que saltee los dos items anteriores
    return { count, users };
  } catch (err) {
    console.log(err);
    throw new Error("Failed to fetch users!");
  }
};

export const fetchUser = async (id: string) => {
  console.log(id);
  try {
    connectToDB();
    const user = await User.findById(id);
    return user;
  } catch (err) {
    console.log(err);
    throw new Error("Failed to fetch user!");
  }
};

interface ProductDocument extends Document {
  title: string;
  id: string;
  img: string;
  desc: string;
  price: number;
  createdAt: Date;
  stock: number;
}

interface FetchProductsResponse {
  count: number;
  products: ProductDocument[];
}

export const fetchProducts = async (
  q: string,
  page: number
): Promise<FetchProductsResponse> => {
  console.log(q);
  const regex = new RegExp(q, "i");

  const ITEM_PER_PAGE = 2;

  try {
    connectToDB();
    const count = await Product.find({
      title: { $regex: regex },
    }).countDocuments();
    const products = await Product.find({ title: { $regex: regex } })
      .limit(ITEM_PER_PAGE)
      .skip(ITEM_PER_PAGE * (page - 1));
    return { count, products };
  } catch (err) {
    console.log(err);
    throw new Error("Failed to fetch products!");
  }
};

export const fetchProduct = async (id: string) => {
  try {
    connectToDB();
    const product = await Product.findById(id);
    return product;
  } catch (err) {
    console.log(err);
    throw new Error("Failed to fetch product!");
  }
};

// DUMMY DATA

export const cards = [
  {
    id: 1,
    title: "Total Users",
    number: 10.928,
    change: 12,
  },
  {
    id: 2,
    title: "Stock",
    number: 8.236,
    change: -2,
  },
  {
    id: 3,
    title: "Revenue",
    number: 6.642,
    change: 18,
  },
];
