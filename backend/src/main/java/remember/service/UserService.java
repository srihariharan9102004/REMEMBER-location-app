// package src.main.java.remember.service;

// public class UserService {

// }
package remember.service;
import remember.dto.ForgotPasswordRequest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import remember.dto.LoginRequest;
import remember.dto.LoginResponse;  
import lombok.RequiredArgsConstructor;
import remember.dto.SignupRequest;
import remember.entity.User;
import remember.repository.UserRepository;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public String registerUser(SignupRequest request) {

        // Check if email already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            return "Email already exists!";
        }

        // Create new user
        User user = User.builder()
                .fullName(request.getFullName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .build();

        // Save to database
        userRepository.save(user);

        return "User registered successfully!";
    }
public LoginResponse loginUser(LoginRequest request) {

    User user = userRepository.findByEmail(request.getEmail())
            .orElse(null);

    if (user == null) {
        return new LoginResponse(
                "Email not found!",
                null,
                null
        );
    }

    if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
        return new LoginResponse(
                "Invalid Password!",
                null,
                null
        );
    }

    return new LoginResponse(
            "Login Successful!",
            user.getFullName(),
            user.getEmail()
    );
}

public String forgotPassword(ForgotPasswordRequest request) {

    User user = userRepository.findByEmail(request.getEmail())
            .orElse(null);

    if (user == null) {
        return "Email not found!";
    }

    user.setPassword(passwordEncoder.encode(request.getNewPassword()));

    userRepository.save(user);

    return "Password Updated Successfully!";
}
}