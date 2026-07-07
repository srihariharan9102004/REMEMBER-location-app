// package remember.service;

// public class ReminderService {

// }
// package remember.service;

// import java.time.LocalDateTime;

// import org.springframework.stereotype.Service;

// import lombok.RequiredArgsConstructor;
// import remember.dto.ReminderRequest;
// import remember.entity.Reminder;
// import remember.repository.ReminderRepository;

// @Service
// @RequiredArgsConstructor
// public class ReminderService {

//     private final ReminderRepository reminderRepository;

//     public String createReminder(ReminderRequest request) {

//         Reminder reminder = Reminder.builder()
//                 .title(request.getTitle())
//                 .description(request.getDescription())
//                 .latitude(request.getLatitude())
//                 .longitude(request.getLongitude())
//                 .radius(request.getRadius())
//                 .createdAt(LocalDateTime.now())
//                 .build();

//         reminderRepository.save(reminder);

//         return "Reminder Created Successfully!";
//     }
// }