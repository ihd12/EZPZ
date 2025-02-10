package org.zerock.api01.domain;

import jakarta.persistence.*;

@Entity
@Table(name = "checklists")
public class Checklist {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String category;
    private String item;
    private Boolean isChecked = false;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
}

