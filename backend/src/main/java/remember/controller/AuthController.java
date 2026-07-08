// package remember.controller;

// public class AuthController {

// }
package remember.controller;
import remember.dto.ForgotPasswordRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import remember.dto.SignupRequest;
import remember.service.UserService;
import remember.dto.LoginRequest;
import remember.dto.LoginResponse;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
// @CrossOrigin(origins = "*")
public class AuthController {

    private final UserService userService;

    @PostMapping("/register")
    public ResponseEntity<String> register(@Valid @RequestBody SignupRequest request){

        userService.registerUser(request);

        return new ResponseEntity<>("User Registered Successfully", HttpStatus.CREATED);
    }

@PostMapping("/login")
public ResponseEntity<LoginResponse> login(
        @RequestBody LoginRequest request) {

    LoginResponse response = userService.loginUser(request);

    return ResponseEntity.ok(response);
}
@PostMapping("/forgot-password")
public ResponseEntity<String> forgotPassword(
        @RequestBody ForgotPasswordRequest request) {

    String response = userService.forgotPassword(request);

    if ("Password Updated Successfully!".equals(response)) {
        return ResponseEntity.ok(response);
    }

    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
}
}