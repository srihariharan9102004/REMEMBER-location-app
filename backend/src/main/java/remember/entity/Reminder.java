// package remember.entity;

// public class Reminder {

// }
// package remember.entity;

// import java.time.LocalDateTime;

// import jakarta.persistence.*;
// import lombok.*;

// @Entity
// @Table(name = "reminders")
// @Getter
// @Setter
// @NoArgsConstructor
// @AllArgsConstructor
// @Builder
// public class Reminder {

//     @Id
//     @GeneratedValue(strategy = GenerationType.IDENTITY)
//     private Long id;

//     @Column(nullable = false)
//     private String title;

//     private String description;

//     @Column(nullable = false)
//     private Double latitude;

//     @Column(nullable = false)
//     private Double longitude;

//     @Column(nullable = false)
//     private Integer radius;

//     private LocalDateTime createdAt;

//     @ManyToOne
//     @JoinColumn(name = "user_id")
//     private User user;
// }
