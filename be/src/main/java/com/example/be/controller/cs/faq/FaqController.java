package com.example.be.controller.cs.faq;

import com.example.be.dto.cs.faq.Faq;
import com.example.be.service.cs.faq.FaqService;
import com.example.be.service.member.MemberService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/cs/faq")
public class FaqController {
    final FaqService service;
    private final MemberService memberService;

    @PostMapping("add")
    @PreAuthorize("hasAuthority('SCOPE_admin')")
    public ResponseEntity<Map<String, Object>> add(@RequestBody Faq faq,
                                                   Authentication authentication) {
        if (service.isAdmin(authentication)) {
            if (service.add(faq)) {
                return ResponseEntity.ok().body(Map.of(
                        "message", Map.of("type", "success",
                                "text", "FAQ가 저장되었습니다.")));
            } else {
                return ResponseEntity.status(500).body(Map.of(
                        "message", Map.of("type", "warning", "text", "FAQ 저장에 실패하였습니다.")));
            }
        } else {
            return ResponseEntity.status(403)
                    .body(Map.of("message", Map.of("type", "warning",
                            "text", "관리자만 FAQ를 작성할 수 있습니다.")));
        }
    }

    @GetMapping("list")
    public List<Faq> list() {
        return service.list();
    }

    @GetMapping("view/{id}")
    public Faq view(@PathVariable int id) {
        return service.view(id);
    }

    @PutMapping("update")
    @PreAuthorize("hasAuthority('SCOPE_admin')")
    public ResponseEntity<Map<String, Object>> update(@RequestBody Faq faq,
                                                      Authentication authentication) {
        if (service.isAdmin(authentication)) {
            if (service.update(faq)) {
                return ResponseEntity.ok().body(Map.of(
                        "message", Map.of("type", "success",
                                "text", "FAQ가 수정되었습니다.")));
            } else {
                return ResponseEntity.status(500).body(Map.of(
                        "message", Map.of("type", "warning", "text", "FAQ 수정에 실패하였습니다.")));
            }
        }
        return ResponseEntity.status(403)
                .body(Map.of("message", Map.of("type", "warning",
                        "text", "관리자만 FAQ를 수정할 수 있습니다.")));
    }

    @DeleteMapping("delete/{id}")
    public ResponseEntity<Map<String, Object>> delete(@PathVariable int id) {
        if (service.delete(id)) {
            return ResponseEntity.ok().body(Map.of(
                    "message", Map.of("type", "success",
                            "text", "FAQ가 삭제되었습니다.")));
        } else {
            return ResponseEntity.internalServerError().body(Map.of(
                    "message", Map.of("type", "warning",
                            "text", "FAQ가 삭제 중 문제가 발생하였습니다.")));

        }
    }
}
