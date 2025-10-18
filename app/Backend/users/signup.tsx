import createclient from '../createclient'
import { signUpUser } from '../../Types/user/usertypes'

export default async function Signup (obj : signUpUser)
{
    let hashmap : any = {};

    // Data Validation

    const isSpecial = (password : string) => {
      let specialCount = 0;
      for (let i = 0; i <= password.length - 1; i++) {
        let char = password.at(i);
        let satisfies = 
        /[A-Z]/.test(char) === false &&
        /[a-z]/.test(char) === false &&
        /\d/.test(char) === false;
        if (satisfies === true) specialCount += 1; 
      }
      if (specialCount >= 1) return true;
      return false; 
    }

    const nameValidator = (name : string, int : number) => {
      let formattedName = name.replace(/\s+/g, '');
      return name.replace(/\s+/g, '').length >= int && /\d/.test(formattedName) === false && isSpecial(formattedName) === false;
    }


    // Username - length must be at least >= 4
    
    let usernameCondition = obj.username.trim().length >= 4 || obj.username.replace(/\s+/g, '').length > 4;
    if (!usernameCondition) {
      hashmap['result'] = 'Username\'s length must contain at least 4 characters';
      return hashmap;
    }

    // Password
    // length >= 8, 
    // one uppercase and one lowercase letter
    // at least one number
    // at least one special character, Reference: https://www.ascii-code.com/

    let length = obj.password.replace(/\s+/g, '').length >= 8;
    if (!length) {
      hashmap['result'] = 'The password must contain at least 8 characters';
      return hashmap;
    } 

    let lower = /[a-z]/.test(obj.password);
    if (!lower) {
      hashmap['result'] = 'The password must contain at least 1 lower-case characater';
      return hashmap;
    }

    let upper = /[A-Z]/.test(obj.password);
    if (!upper) {
      hashmap['result'] = 'The password must contain at least 1 upper-case character';
      return hashmap;
    }

    let numeric = /\d/.test(obj.password);
    if (!numeric) {
      hashmap['result'] = 'The password must contain at least 1 numeric character';
      return hashmap;
    }

    if (!isSpecial(obj.password)) {
      hashmap['result'] = 'Your password must contain at least 1 special character'
      return hashmap;
    }

    // First Name
    // No Numbers and Symbols
    // length >= 3

    let validFirstName = nameValidator(obj.first_name, 3);
    if (!validFirstName) {
      hashmap['result'] = 'First Name must have at least 3 characters and cannot have numbers or symbols';
      return hashmap;
    }

    // Last Name
    // Same condition as First Name

    let validLastName = nameValidator(obj.last_name, 2);
    if (!validLastName) {
      hashmap['result'] = 'Last Name must have at least 2 characters and cannot have numbers or symbols';
      return hashmap;
    }

    // Email
    // a character before and after @
    // a . after domain
    
    let charsBefore = obj.email.substring(0, obj.email.indexOf('@'));
    let charsAfter = obj.email.substring(obj.email.indexOf('@') + 1, obj.email.indexOf('.'));
    let charsAfterDot = obj.email.substring(obj.email.indexOf('.') + 1, obj.email.length);
    let dotChar = obj.email.includes('.');

    let separatorCount = (email : string) => {
      let count = 0;
      for (let i = 0; i <= email.length - 1; i++) {
        if (email[i] === '@') count ++;
      }
      return count;
    }
    let validEmail = charsBefore.length >= 1 && separatorCount(obj.email) === 1 && charsAfter.length >= 1 && dotChar === true && charsAfterDot.length >= 1;
    if (!validEmail) {
      hashmap['result'] = 'Invalid email'
      return hashmap;
    }    

    // Birthday
    // Age of user must be >= 7
    // Based on Month and Day values, age value will be reduced by 1

    let birthday = new Date(obj.birthday);
    let current = new Date();
    
    let age = current.getFullYear() - birthday.getFullYear();

    if (current.getMonth() < birthday.getMonth() 
    || (birthday.getMonth() === current.getMonth() && birthday.getDate() > current.getDate())) age--;
    
    if (age < 7) {
      hashmap['result'] = 'User must be at least 7 years of age';
      return hashmap;
    }

    
    
    // Create Auth User Entity

    const client = createclient();
    const { data } = await client.auth.signUp({
        email: obj.email,
        password: obj.password,
      })
    
    if (!data.user?.id) {
      hashmap['result'] = 'Users ID failed as of the moment. Retrying'
      return hashmap;
    }

    // Create non-Auth User Entity
    // DATE = YYYY-MM-DD in string type
    
    const { error } = await client
    .from('users')
    .insert({ id: data.user.id, first_name: obj.first_name?.trim(), last_name: obj.last_name?.trim(), sex: obj.sex, birthday: obj.birthday, username: obj.username?.trim(), password: obj.password.trim(), is_admin: obj.is_admin })
    
    hashmap['result'] = 'success';
    hashmap['metadata'] = { data, error };

    return hashmap;
}


