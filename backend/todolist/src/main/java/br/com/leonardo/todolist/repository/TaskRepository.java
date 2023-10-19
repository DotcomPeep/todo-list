package br.com.leonardo.todolist.repository;

import br.com.leonardo.todolist.model.Task;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TaskRepository extends JpaRepository<Task, Long> {
}