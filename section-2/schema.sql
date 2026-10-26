-- PostgreSQL schema for a real deployment.
-- Authorization (for example, ensuring assigned_to is an employee) must also
-- be checked by the application/service layer.

CREATE TABLE users (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    display_name VARCHAR(120) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'employee')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE projects (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT NOT NULL DEFAULT '',
    created_by BIGINT NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT projects_name_not_blank CHECK (length(trim(name)) > 0)
);

CREATE TABLE tasks (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    project_id BIGINT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL DEFAULT '',
    assigned_to BIGINT NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    status VARCHAR(10) NOT NULL DEFAULT 'To Do'
        CHECK (status IN ('To Do', 'Done')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT tasks_title_not_blank CHECK (length(trim(title)) > 0)
);

CREATE TABLE audit_log (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    task_id BIGINT REFERENCES tasks(id) ON DELETE SET NULL,
    user_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
    old_status VARCHAR(10) CHECK (old_status IN ('To Do', 'Done')),
    new_status VARCHAR(10) NOT NULL CHECK (new_status IN ('To Do', 'Done')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Supports the Employee task list filtered by assignee and ordered by newest.
CREATE INDEX tasks_assignee_created_idx
    ON tasks (assigned_to, created_at DESC);

-- Supports project task lists filtered by project and ordered by newest.
CREATE INDEX tasks_project_created_idx
    ON tasks (project_id, created_at DESC);

-- Supports recent audit history for one task.
CREATE INDEX audit_log_task_created_idx
    ON audit_log (task_id, created_at DESC);

-- Supports recent audit activity by an actor.
CREATE INDEX audit_log_user_created_idx
    ON audit_log (user_id, created_at DESC);
