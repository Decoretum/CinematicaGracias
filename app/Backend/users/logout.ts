import { client } from "../createclient";

export default async function Signout () {
    await client.auth.signOut({ scope: 'local' })
    // Remove State Data
}