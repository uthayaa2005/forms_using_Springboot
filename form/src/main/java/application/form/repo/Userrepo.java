package application.form.repo;

import application.form.Entity.User;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface Userrepo extends MongoRepository <User, String >{
    Optional<User> findByEmail(String email);
}
