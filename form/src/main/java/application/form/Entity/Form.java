package application.form.Entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;

@Document(collection = "forms")
public class Form {
    @Id
    private String id;
    private String name;
    private String email;
    private String gender;
    private String department;
    private String hobbies;
    private String dob;

    private String fileName;
    private String fileType;
    private String fileData;

    private String remarks;


    private String userId;





    public Form() {

    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }

    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }

    public String getHobbies() { return hobbies; }
    public void setHobbies(String hobbies) { this.hobbies = hobbies; }

    public String getDob() { return dob; }
    public void setDob(String dob) { this.dob = dob; }

    public String getFileName() { return fileName; }
    public void setFileName(String fileName) { this.fileName = fileName; }

    public String getFileType() { return fileType; }
    public void setFileType(String fileType) { this.fileType = fileType; }

    public String getFileData() { return fileData; }
    public void setFileData(String fileData) { this.fileData = fileData; }


    public String getUserId() { return userId; }
    public void setUserId(String userId){ this.userId = userId; }

    public String getRemarks(){return remarks;}
    public void setRemarks(String remarks){this.remarks = remarks;}


    }


