import createclient from "../createclient";

export default async function Signout () {
    let client = createclient();
    const { error } = await client.auth.signOut({ scope: 'local' })

    // Remove State Data
}