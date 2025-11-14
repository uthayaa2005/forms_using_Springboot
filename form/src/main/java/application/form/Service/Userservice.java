package application.form.Service;


import application.form.Entity.User;
import application.form.repo.Userrepo;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class Userservice {

    public final Userrepo userrepo;

    private BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public Userservice(Userrepo userrepo) {
        this.userrepo = userrepo;
    }

    public String registeruser(User user){

        if(userrepo.findByEmail(user.getEmail()).isPresent()){
            return "Email already Taken";
        }

        String encodepassword = passwordEncoder.encode(user.getPassword());
        user.setPassword(encodepassword);

        userrepo.save(user);
        return "user register sucessfully";
    }

    public String loginuser(String email,String password){

        if (email.equals("admin@gmail.com") && password.equals("admin123")) {
            return "admin";
        }

        Optional<User> existinguser = userrepo.findByEmail(email);

        if(existinguser.isEmpty()){
            return "user not found";
        }
        boolean passwordmatch = passwordEncoder.matches(password,existinguser.get().getPassword());
        if(passwordmatch){
            return existinguser.get().getId();
        }else{
            return "login failed";
        }
    }

}
