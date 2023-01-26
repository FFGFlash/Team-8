
export interface LoaderData {
    authenticated: boolean
}
export default function authLoader(): LoaderData {
    //TODO: Check with Backend if user is authenticated
    return { authenticated: false }
}
