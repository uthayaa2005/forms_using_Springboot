package application.form.Controller;

import application.form.Entity.Form;
import application.form.Service.Formservice;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Base64;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/forms")
@CrossOrigin(origins = "http://localhost:5173")
public class Formcontroller {

    private final Formservice formservice;

    public Formcontroller(Formservice formservice) {
        this.formservice = formservice;
    }

    // ✅ CREATE new form
    @PostMapping("/create")
    public Form createForm(
            @RequestParam("name") String name,
            @RequestParam("email") String email,
            @RequestParam("gender") String gender,
            @RequestParam("department") String department,
            @RequestParam("hobbies") String hobbies,
            @RequestParam("dob") String dob,
            @RequestParam("remarks") String remarks,
            @RequestParam(value = "file", required = false) MultipartFile file,
            @RequestParam("userId") String userId
    ) throws IOException {

        Form form = new Form();
        form.setName(name);
        form.setEmail(email);
        form.setGender(gender);
        form.setDepartment(department);
        form.setHobbies(hobbies);
        form.setDob(dob);
        form.setRemarks(remarks);
        form.setUserId(userId);

        if (file != null && !file.isEmpty()) {
            form.setFileName(file.getOriginalFilename());
            form.setFileType(file.getContentType());
            form.setFileData(Base64.getEncoder().encodeToString(file.getBytes()));
        }

        return formservice.saveForm(form);
    }

    // ✅ GET all forms
    @GetMapping("/all")
    public List<Form> getAllForms() {
        return formservice.getAllForms();
    }

    // ✅ GET all forms by a specific user
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Form>> getFormsByUser(@PathVariable String userId) {
        List<Form> forms = formservice.getFormsByUser(userId);
        return ResponseEntity.ok(forms);
    }

    // ✅ GET a specific form by ID
    @GetMapping("/{id}")
    public ResponseEntity<Form> getFormById(@PathVariable String id) {
        Optional<Form> form = formservice.getFormById(id);
        return form.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    // ✅ UPDATE form (edit)
    @PutMapping("/{id}")
    public ResponseEntity<Form> updateForm(
            @PathVariable String id,
            @RequestParam("name") String name,
            @RequestParam("email") String email,
            @RequestParam("gender") String gender,
            @RequestParam("department") String department,
            @RequestParam("hobbies") String hobbies,
            @RequestParam("dob") String dob,
            @RequestParam("remarks") String remarks,
            @RequestParam(value = "file", required = false) MultipartFile file
    ) throws IOException {

        Optional<Form> optionalForm = formservice.getFormById(id);
        if (optionalForm.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Form existingForm = optionalForm.get();

        existingForm.setName(name);
        existingForm.setEmail(email);
        existingForm.setGender(gender);
        existingForm.setDepartment(department);
        existingForm.setHobbies(hobbies);
        existingForm.setDob(dob);
        existingForm.setRemarks(remarks);

        // ✅ Only replace file if new one uploaded
        if (file != null && !file.isEmpty()) {
            existingForm.setFileName(file.getOriginalFilename());
            existingForm.setFileType(file.getContentType());
            existingForm.setFileData(Base64.getEncoder().encodeToString(file.getBytes()));
        }

        Form updatedForm = formservice.saveForm(existingForm);
        return ResponseEntity.ok(updatedForm);
    }

    // ✅ DELETE form
    @DeleteMapping("/{id}")
    public String deleteForm(@PathVariable String id) {
        return formservice.deleteForm(id);
    }
}
