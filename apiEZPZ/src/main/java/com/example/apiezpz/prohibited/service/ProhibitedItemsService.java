package com.example.apiezpz.prohibited.service;

import com.example.apiezpz.prohibited.domain.Prohibit;
import com.example.apiezpz.prohibited.repository.ProhibitedItemsRepository;
import org.springframework.stereotype.Service;


import java.util.List;

@Service
public class ProhibitedItemsService {

    private final ProhibitedItemsRepository repository;

    public ProhibitedItemsService(ProhibitedItemsRepository repository) {
        this.repository = repository;
    }

    public List<Prohibit> getAllItems() {
        return repository.findAll();
    }

    public List<Prohibit> getItemsByCategory(String Gubun) {
        return repository.findByGubun(Gubun);
    }
}
