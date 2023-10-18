package com.example.demo;

import org.springframework.stereotype.Repository;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import javax.sql.DataSource;

@Repository
public class TaskRepository {

    private final Connection connection; // Você deve criar e configurar a conexão com o banco de dados.

    public TaskRepository(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    private final DataSource dataSource;

    public TaskRepository(Connection connection) {
        this.connection = connection;
    }

    public List<Task> findAll() {
        List<Task> tasks = new ArrayList<>();
        try (Connection connection = dataSource.getConnection();
             PreparedStatement statement = connection.prepareStatement("SELECT * FROM tbl_tasks");
             ResultSet resultSet = statement.executeQuery()) {
            while (resultSet.next()) {
                Task task = new Task();
                task.setId_task(resultSet.getLong("id_task"));
                task.setTitle(resultSet.getString("title"));
                task.setDescription(resultSet.getString("description"));
                tasks.add(task);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return tasks;
    }

    public Optional<Task> findById(Long id) {
        Task task = null;
        try (PreparedStatement statement = connection.prepareStatement("SELECT * FROM tbl_tasks WHERE id_task = ?");
        ) {
            statement.setLong(1, id);
            try (ResultSet resultSet = statement.executeQuery()) {
                if (resultSet.next()) {
                    task = new Task();
                    task.setId_task(resultSet.getLong("id_task"));
                    task.setTitle(resultSet.getString("title"));
                    task.setDescription(resultSet.getString("description"));
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return Optional.ofNullable(task);
    }

    public Task save(Task task) {
        if (task.getId_task() == null) {
            // Inserção de uma nova tarefa
            String sql = "INSERT INTO tbl_tasks (title, description) VALUES (?, ?)";
            try (PreparedStatement statement = connection.prepareStatement(sql, PreparedStatement.RETURN_GENERATED_KEYS)) {
                statement.setString(1, task.getTitle());
                statement.setString(2, task.getDescription());
                int rowsAffected = statement.executeUpdate();
                if (rowsAffected == 1) {
                    ResultSet generatedKeys = statement.getGeneratedKeys();
                    if (generatedKeys.next()) {
                        task.setId_task(generatedKeys.getLong(1));
                    }
                }
            } catch (SQLException e) {
                e.printStackTrace();
            }
        } else {
            // Atualização de uma tarefa existente
            String sql = "UPDATE tbl_tasks SET title = ?, description = ? WHERE id_task = ?";
            try (PreparedStatement statement = connection.prepareStatement(sql)) {
                statement.setString(1, task.getTitle());
                statement.setString(2, task.getDescription());
                statement.setLong(3, task.getId_task());
                statement.executeUpdate();
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }
        return task;
    }

    public boolean existsById(Long id) {
        try (PreparedStatement statement = connection.prepareStatement("SELECT 1 FROM tbl_tasks WHERE id_task = ?")) {
            statement.setLong(1, id);
            try (ResultSet resultSet = statement.executeQuery()) {
                return resultSet.next();
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return false;
    }

    public void deleteById(Long id) {
        try (PreparedStatement statement = connection.prepareStatement("DELETE FROM tbl_tasks WHERE id_task = ?")) {
            statement.setLong(1, id);
            statement.executeUpdate();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }
}
