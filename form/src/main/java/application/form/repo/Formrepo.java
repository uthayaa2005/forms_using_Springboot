package application.form.repo;

import application.form.Entity.Form;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface Formrepo extends MongoRepository<Form, String> {
    List<Form> findByUserId(String userId);
}
