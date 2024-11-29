package com.example.be.dto.plan;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class Plan {
    private Integer id;
    private LocalDateTime inserted;

    private String title;
    private String description;
    private String destination;
    private String startDate;
    private String endDate;

    // 여러 일정을 저장할 plan body fields
    private List<PlanField> planFieldList;

    private LocalDateTime updated;
}
