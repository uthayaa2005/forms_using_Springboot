package application.form.Service;

import application.form.Entity.Form;
import application.form.repo.Formrepo;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Base64;
import java.util.List;
import java.util.Optional;

@Service
public class Formservice {

    private final Formrepo formrepo;

    public Formservice(Formrepo formrepo) {
        this.formrepo = formrepo;
    }


    public Form saveForm(Form form) {
        return formrepo.save(form);
    }


    public List<Form> getAllForms() {
        return formrepo.findAll();
    }


    public Optional<Form> getFormById(String id) {
        return formrepo.findById(id);
    }


    public String deleteForm(String id) {
        formrepo.deleteById(id);
        return "Form deleted successfully";
    }


    public List<Form> getFormsByUser(String userId) {
        return formrepo.findByUserId(userId);
    }


    public Form updateForm(String id, String name, String email, String gender,String remarks,
                           String department, String hobbies, String dob, MultipartFile file) throws IOException {

        Form existingForm = formrepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Form not found"));

        existingForm.setName(name);
        existingForm.setEmail(email);
        existingForm.setGender(gender);
        existingForm.setDepartment(department);
        existingForm.setHobbies(hobbies);
        existingForm.setDob(dob);
        existingForm.setRemarks(remarks);


        if (file != null && !file.isEmpty()) {
            existingForm.setFileName(file.getOriginalFilename());
            existingForm.setFileType(file.getContentType());
            existingForm.setFileData(Base64.getEncoder().encodeToString(file.getBytes()));
        }

        return formrepo.save(existingForm);
    }
}
