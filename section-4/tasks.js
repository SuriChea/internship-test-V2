const express = require('express');
const router = express.Router();
const db = require('../db');
const { authenticate } = require('../middleware/auth');

const ALLOWED_STATUSES = ['To Do', 'Done'];
const PAGE_SIZE = 20;

function parsePositiveInteger(value, fallback) {
  if (value === undefined) return fallback;
  const parsed = Number(value);
  return Number.isSafeInteger(parsed) && parsed > 0 ? parsed : null;
}

router.get('/api/tasks', authenticate, async (req, res) => {
  const page = parsePositiveInteger(req.query.page, 1);
  const projectId = req.query.projectId === undefined
    ? null
    : parsePositiveInteger(req.query.projectId);

  if (page === null || (req.query.projectId !== undefined && projectId === null)) {
    return res.status(400).json({ message: 'Invalid page or projectId' });
  }

  const offset = (page - 1) * PAGE_SIZE;
  if (!Number.isSafeInteger(offset)) {
    return res.status(400).json({ message: 'Invalid page' });
  }

  try {
    const conditions = [];
    const params = [];

    if (projectId !== null) {
      params.push(projectId);
      conditions.push(`project_id = $${params.length}`);
    }

    if (req.user.role !== 'admin') {
      params.push(req.user.id);
      conditions.push(`assigned_to = $${params.length}`);
    }

    const whereClause = conditions.length ? ` WHERE ${conditions.join(' AND ')}` : '';
    params.push(PAGE_SIZE, offset);
    const limitParameter = params.length - 1;
    const offsetParameter = params.length;
    const sql = `
      SELECT *
      FROM tasks
      ${whereClause}
      ORDER BY created_at DESC
      LIMIT $${limitParameter}
      OFFSET $${offsetParameter}
    `;

    const result = await db.query(sql, params);
    return res.status(200).json({ tasks: result.rows, page });
  } catch (err) {
    console.error('GET /api/tasks failed:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

router.patch('/api/tasks/:id/status', authenticate, async (req, res) => {
  const taskId = parsePositiveInteger(req.params.id);
  const { status } = req.body ?? {};

  if (taskId === null) {
    return res.status(400).json({ message: 'Invalid task id' });
  }
  if (!ALLOWED_STATUSES.includes(status)) {
    return res.status(400).json({ message: 'Invalid status' });
  }

  let client;
  try {
    client = await db.connect();
    await client.query('BEGIN');

    const { rows } = await client.query(
      'SELECT * FROM tasks WHERE id = $1 FOR UPDATE',
      [taskId]
    );
    const task = rows[0];
    if (!task) {
      await client.query('ROLLBACK');
      return res.status(404).json({ message: 'Task not found' });
    }

    const isAdmin = req.user.role === 'admin';
    const isOwner = Number(task.assigned_to) === Number(req.user.id);
    if (!isAdmin && !isOwner) {
      await client.query('ROLLBACK');
      return res.status(403).json({ message: 'No permission to edit this task' });
    }

    if (!isAdmin && !(task.status === 'To Do' && status === 'Done')) {
      await client.query('ROLLBACK');
      return res.status(409).json({ message: 'Employees may only change To Do to Done' });
    }

    const { rows: updatedRows } = await client.query(
      'UPDATE tasks SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
      [status, taskId]
    );
    const updatedTask = updatedRows[0];

    if (task.status !== status) {
      await client.query(
        `INSERT INTO audit_log (task_id, user_id, old_status, new_status)
         VALUES ($1, $2, $3, $4)`,
        [taskId, req.user.id, task.status, status]
      );
    }

    await client.query('COMMIT');
    return res.status(200).json({ task: updatedTask });
  } catch (err) {
    if (client) {
      try {
        await client.query('ROLLBACK');
      } catch (rollbackError) {
        console.error('PATCH /api/tasks/:id/status rollback failed:', rollbackError);
      }
    }
    console.error('PATCH /api/tasks/:id/status failed:', err);
    return res.status(500).json({ message: 'Internal server error' });
  } finally {
    client?.release();
  }
});

router.delete('/api/tasks/:id', authenticate, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin only' });
  }

  const taskId = parsePositiveInteger(req.params.id);
  if (taskId === null) {
    return res.status(400).json({ message: 'Invalid task id' });
  }

  try {
    const result = await db.query('DELETE FROM tasks WHERE id = $1', [taskId]);
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Task not found' });
    }
    return res.status(204).end();
  } catch (err) {
    console.error('DELETE /api/tasks/:id failed:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
