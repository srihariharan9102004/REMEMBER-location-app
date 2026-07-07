// package src.main.java.remember.dto;

// public class SignupRequest {

// }
// package remember.dto;

// import lombok.Getter;
// import lombok.Setter;

// @Getter
// @Setter
// public class SignupRequest {

//     private String fullName;
//     private String email;
//     private String password;

// }
package remember.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SignupRequest {

    @NotBlank(message = "Full Name is required")
    private String fullName;

    @NotBlank(message = "Email is required")
    @Email(message = "Enter a valid email")
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 6, message = "Password must be at least 6 characters")
    private String password;

}