import 'next-auth'
import { DefaultSession } from 'next-auth'
//we cannot write interface bec when we are importing pkg hole pkg will aware with your new datatype that's why we cannot do directly interface
//in the user model we write interface bec we know that all code is mine  but here we are overwriting the model of next-auth 
declare module 'next-auth' {
    interface User {
        _id?: string;
        isVerified?: boolean;
        isAcceptingMessages?: boolean;
        username?: string
    }
    interface Session {
        user: {
            _id?: string;
            isVerified?: boolean;
            isAcceptingMessages?: boolean;
            username?: string
        } & DefaultSession['user'] //defalut session always a key pass bec of it's not then i query and user is not avilable its direct throw a error values will discuess 
    }
}

//same user or session ke type we do it's just a 2nd method to do that stuff
declare module 'next-auth/jwt' {
    interface JWT {
        _id?: string;
        isVerified?: boolean;
        isAcceptingMessages?: boolean;
        username?: string;
    }
}





























