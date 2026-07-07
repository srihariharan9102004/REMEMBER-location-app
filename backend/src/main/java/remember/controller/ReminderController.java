// // package remember.controller;

// // public class ReminderController {

// // }
// package remember.controller;

// import org.springframework.http.HttpStatus;
// import org.springframework.http.ResponseEntity;
// import org.springframework.web.bind.annotation.*;

// import lombok.RequiredArgsConstructor;
// import remember.dto.ReminderRequest;
// import remember.service.ReminderService;

// @RestController
// @RequestMapping("/api/reminders")
// @RequiredArgsConstructor
// @CrossOrigin(origins = "*")
// public class ReminderController {

//     private final ReminderService reminderService;

//     @PostMapping
//     public ResponseEntity<String> createReminder(@RequestBody ReminderRequest request) {

//         String message = reminderService.createReminder(request);

//         return new ResponseEntity<>(message, HttpStatus.CREATED);
//     }
// }
