// "use server";

// import { getDB } from "@/db";
// import { users } from "@/db/schemas";

// import { ActionResponse } from "@/types/actions";
// import { Role } from "@/types/enums";
// import createSalt from "@/lib/utils/createSalt";
// import { hashPassword } from "@/lib/utils/hashPassword";
// import { verifyCsrfToken } from "@/lib/utils/verifyCsrfToken";
// import { eq } from "drizzle-orm";

// export async function signUp(
//   _: ActionResponse<SignUpSchema> | null,
//   formData: FormData
// ): Promise<ActionResponse<SignUpSchema>> {
//   const data = {
//     email: formData.get("email"),
//     name: formData.get("name"),
//     password: formData.get("password"),
//   } as SignUpSchema;

//   const result = await signUpSchema.safeParseAsync(data);

//   if (!result.success) {
//     return {
//       inputs: data,
//       success: false,
//       message: "Please enter correct email and password",
//       errors: result.error.flatten().fieldErrors,
//     };
//   }

//   const { email, name, password } = result.data;

//   const db = await getDB();

//   const foundUsers = await db
//     .select()
//     .from(users)
//     .where(eq(users.email, email));

//   if (foundUsers.length) {
//     return {
//       inputs: data,
//       success: false,
//       message: "User already exists",
//     };
//   }

//   const saltBytes = createSalt();

//   try {
//     const hashedPassword = await hashPassword(password, saltBytes);

//     const firstUser = await db.query.users.findFirst();

//     const createdUser = await db
//       .insert(users)
//       .values([
//         {
//           email,
//           name,
//           password: hashedPassword.hash,
//           salt: hashedPassword.salt, // Use the Base64 encoded salt string
//           role: firstUser ? Role.User : Role.Admin,
//         },
//       ])
//       .returning();

//     if (!createdUser.length) {
//       return {
//         inputs: data,
//         success: false,
//         message: "Failed to create user",
//       };
//     }

//     return {
//       inputs: data,
//       success: true,
//       message: "User created successfully",
//     };
//   } catch (error) {
//     console.error(error);
//     return {
//       inputs: data,
//       success: false,
//       message: "Failed to create user",
//     };
//   }
// }

// export async function test() {
//   const valid = await verifyCsrfToken();
//   console.log(valid);
// }
