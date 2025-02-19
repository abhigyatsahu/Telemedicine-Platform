package com.project.telemedicine.repository;

import com.project.telemedicine.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends MongoRepository<User,String> {
    User findByEmail(String email);
    List<User> findByRole(String role);
}
