import { UserDocument } from '../models/User';

export interface GraphQLContext {
    user?: UserDocument; //Represents the user info from the JWT
}