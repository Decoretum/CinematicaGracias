import { client } from "../createclient";

export default async function Login(username: string, password: string) {
    const { error } = await client.auth.signInWithPassword({
        email: username,
        password: password,
      })
    
    return { error };
}