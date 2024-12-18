package com.example.be.controller.notice;

import com.example.be.dto.notice.Notice;
import com.example.be.service.notice.NoticeService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/notice")
@RequiredArgsConstructor
public class NoticeController {

    final NoticeService service;

    @GetMapping("list")
    public Map<String, Object> list(@RequestParam(value = "page", defaultValue = "1") Integer page,
                                    @RequestParam(value = "type", defaultValue = "all") String searchType,
                                    @RequestParam(value = "keyword", defaultValue = "") String searchKeyword) {
        return service.list(page, searchType, searchKeyword);
    }

    @GetMapping("view/{id}")
    public Map<String, Object> view(@PathVariable Integer id, Authentication auth) {
        return service.view(id, auth);
    }

    @PostMapping("write")
    @PreAuthorize("hasAuthority('SCOPE_admin')")
    public ResponseEntity<Map<String, Object>> write(@RequestBody Notice notice, Authentication auth) {
        if (service.checkAdmin(auth)) {
            if (service.checkNotice(notice)) {
                service.write(notice, auth);
                return ResponseEntity.ok().body(Map.of("message", "success",
                        "text", STR."\{notice.getId()}번 공지사항 등록되었습니다"));
            } else {
                return ResponseEntity.badRequest()
                        .body(Map.of("message", Map.of("type", "warning",
                                "text", "제목이나 본문이 비어있을 수 없습니다.")));
            }
        } else {
            return ResponseEntity.status(403)
                    .body(Map.of("message", Map.of("type", "error",
                            "text", "작성 권한이 없습니다.")));
        }
    }

    @PutMapping("edit")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Map<String, Object>> edit(@RequestBody Notice notice, Authentication auth) {
        Integer id = notice.getId();
        if (service.checkRightsOfAccess(id, auth)) {
            if (service.checkNotice(notice)) {
                service.edit(notice);
                return ResponseEntity.ok().body(Map.of("message", "success",
                        "text", STR."\{notice.getId()}번 게시물이 수정되었습니다"));
            } else {
                return ResponseEntity.badRequest()
                        .body(Map.of("message", Map.of("type", "warning",
                                "text", "제목이나 본문이 비어있을 수 없습니다.")));
            }
        } else {
            return ResponseEntity.status(403)
                    .body(Map.of("message", Map.of("type", "error",
                            "text", "수정 권한이 없습니다.")));
        }
    }

    @DeleteMapping("delete/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Map<String, Object>> delete(@PathVariable Integer id, Authentication auth) {
        if (service.checkRightsOfAccess(id, auth)) {
            service.delete(id);
            return ResponseEntity.ok().body(Map.of("message", "success",
                    "text", STR."\{id}번 공지사항이 삭제되었습니다"));
        } else {
            return ResponseEntity.status(403)
                    .body(Map.of("message", Map.of("type", "error",
                            "text", "삭제 권한이 없습니다.")));
        }
    }

    @PostMapping("like/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Map<String, Object>> like(@PathVariable Integer id, Authentication auth) {
        if (service.checkMember(auth)) {
            if (service.checkLikeInNotice(id, auth)) {
                service.removeLikeInNotice(id, auth);
                return ResponseEntity.ok().body(Map.of("message", "success",
                        "text", "추천을 취소하였습니다"));
            } else {
                service.addLikeInNotice(id, auth);
                return ResponseEntity.ok().body(Map.of("message", "success",
                        "text", "게시글을 추천하였습니다"));
            }
        } else {
            return ResponseEntity.status(403)
                    .body(Map.of("message", Map.of("type", "error",
                            "text", "권한이 없습니다.")));
        }
    }
}