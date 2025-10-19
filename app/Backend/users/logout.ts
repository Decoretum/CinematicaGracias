import { client } from "../createclient";

export default async function Signout () {
    const { error } = await client.auth.signOut({ scope: 'local' })

    // Remove State Data
}