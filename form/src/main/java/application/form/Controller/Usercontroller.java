package application.form.Controller;

import application.form.Entity.User;
import application.form.Service.Userservice;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:5173")
public class Usercontroller {

    public final Userservice userservice;

    public Usercontroller(Userservice userservice) {
        this.userservice = userservice;
    }

    @PostMapping("/register")
    public String register(@RequestBody User user){
        return userservice.registeruser(user);
    }

    @PostMapping("/login")
    public String login(@RequestBody User user){
        return userservice.loginuser(user.getEmail() ,user.getPassword());
    }

}
