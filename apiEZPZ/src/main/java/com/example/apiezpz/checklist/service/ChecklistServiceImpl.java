package com.example.apiezpz.checklist.service;

import com.example.apiezpz.checklist.domain.Checklist;
import com.example.apiezpz.checklist.domain.ChecklistItem;
import com.example.apiezpz.checklist.dto.CategoryDTO;
import com.example.apiezpz.checklist.dto.ChecklistDTO;
import com.example.apiezpz.checklist.repository.ChecklistRepository;
import com.example.apiezpz.checklist.repository.ChecklistItemRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Log4j2
@Transactional  //save 자동 반영
public class ChecklistServiceImpl implements ChecklistService {
    private final ChecklistRepository checklistRepository;
    private final ModelMapper modelMapper;
    private final ChecklistItemRepository checklistItemRepository;

    @Override
    public void registerChecklist(String username, ChecklistDTO checklistDTO) {
        Checklist checklist = modelMapper.map(checklistDTO, Checklist.class);
        checklist.setUsername(username); // Token에서 가져온 username 저장
        checklistRepository.save(checklist);
    }


    @Override
    public ChecklistDTO readChecklist(Long id) {
        Optional<Checklist> result = checklistRepository.findById(id);
        Checklist checklist = result.orElseThrow(() -> new RuntimeException("해당 체크리스트 존재하지 않음"));
        ChecklistDTO checklistDTO = modelMapper.map(checklist, ChecklistDTO.class);

        // 체크리스트의 카테고리 목록을 DTO로 변환해서 추가
        List<CategoryDTO> categories = checklist.getCategories().stream()
                .map(category -> modelMapper.map(category, CategoryDTO.class))
                .collect(Collectors.toList());

        checklistDTO.setCategories(categories);
        return checklistDTO;
    }

    @Override
    public List<ChecklistDTO> list(String username) {
        List<Checklist> checklists = checklistRepository.findByUsername(username);
        return checklists.stream()
                .map(checklist -> modelMapper.map(checklist, ChecklistDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    public void removeChecklist(String username, Long id) {
        Checklist checklist = checklistRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("해당 체크리스트가 존재하지 않습니다."));
        if (!checklist.getUsername().equals(username)) {
            throw new RuntimeException("이 체크리스트를 삭제할 권한이 없습니다.");
        }
        checklistRepository.delete(checklist);
    }


    @Override
    public void modifyChecklist(String username, ChecklistDTO checklistDTO) {
        Checklist checklist = checklistRepository.findById(checklistDTO.getId())
                .orElseThrow(() -> new RuntimeException("해당 체크리스트가 존재하지 않습니다."));

        if (!checklist.getUsername().equals(username)) {
            throw new RuntimeException("이 체크리스트를 수정할 권한이 없습니다.");
        }

        checklist.setTitle(checklistDTO.getTitle());
        checklist.setDepartureDate(checklistDTO.getDepartureDate());
        checklist.setReturnDate(checklistDTO.getReturnDate());

        checklistRepository.save(checklist); // ✅ 수정된 내용 저장
    }



    @Override
    public void resetPacking(Long checklistId) {
        // 체크리스트에 속한 모든 아이템의 체크 상태를 false로 변경
        List<ChecklistItem> checklistItems = checklistItemRepository.findByChecklistId(checklistId);
        checklistItems.forEach(item -> item.setChecked(false));
        checklistItemRepository.saveAll(checklistItems);
    }
}
