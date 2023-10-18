package com.example.demo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    @Autowired
    private TaskRepository taskRepository;

    @PostMapping
    public Task createTask(@RequestBody Task task) {
        return taskRepository.save(task);
    }

    @GetMapping
    public List<Task> getAllTasks() {
        return (List<Task>) taskRepository.findAll();
    }

    @GetMapping("/{id}")
    public Task getTaskById(@PathVariable Long id) {
        Optional<Task> optionalTask = taskRepository.findById(id);
        return optionalTask.orElse(null);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Task> updateTask(@PathVariable Long id, @RequestBody TaskUpdateDTO taskUpdateDTO) {
        Optional<Task> optionalTask = taskRepository.findById(id);

        if (optionalTask.isPresent()) {
            Task existingTask = optionalTask.get();

            if (taskUpdateDTO.getTitle() != null) {
                existingTask.setTitle(taskUpdateDTO.getTitle());
            }

            if (taskUpdateDTO.getDescription() != null) {
                existingTask.setDescription(taskUpdateDTO.getDescription());
            }

            Task updatedTask = taskRepository.save(existingTask);
            return ResponseEntity.ok(updatedTask);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public void deleteTask(@PathVariable Long id) {
        taskRepository.deleteById(id);
    }
}
