import { jest } from '@jest/globals'; 
import { createTask, getTasks, getTask, updateTask, deleteTask } from './taskController';
import TaskModel from '../../models/tasks/TaskModel';
import httpMocks from 'node-mocks-http';

// Mock the TaskModel and other dependencies as needed
jest.mock('../../models/tasks/TaskModel.js');
jest.mock('../../models/auth/UserModel.js', () => ({}), { virtual: true });
jest.mock('../../utils/sendEmail.js', () => jest.fn(), { virtual: true });


describe('Task Controller', () => {
  let req, res;
  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    req.user = { _id: 'user123' };
    jest.clearAllMocks();
  });

  describe('createTask', () => {
    it('should create a new task and return 201', async () => {
      req.body = {
        title: 'Test Task',
        description: 'Test Desc',
        startDate: new Date(),
        dueDate: new Date(),
        priority: 'high',
        status: 'active',
        useAI: false,
        assignee: null,
      };
      TaskModel.prototype.save = jest.fn().mockResolvedValue();
      res.status = jest.fn().mockReturnValue(res);
      res.json = jest.fn();

      await createTask(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ title: 'Test Task' }));
    });

    it('should fail if title is missing', async () => {
      req.body = { description: 'desc' };
      res.status = jest.fn().mockReturnValue(res);
      res.json = jest.fn();

      await createTask(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Title is required' });
    });
  });

  describe('updateTask', () => {
    it('should update an existing task and return 200', async () => {
      req.params = { id: 'taskid' };
      req.body = { title: 'Updated', description: 'desc', useAI: false };
      const mockTask = {
        _id: 'taskid',
        user: { equals: (id) => id === req.user._id },
        save: jest.fn().mockResolvedValue(),
        ...req.body,
      };
      TaskModel.findById = jest.fn().mockResolvedValue(mockTask);
      res.status = jest.fn().mockReturnValue(res);
      res.json = jest.fn();

      await updateTask(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ title: 'Updated' }));
    });

    it('should return 404 if task not found', async () => {
      req.params = { id: 'nonexistent' };
      TaskModel.findById = jest.fn().mockResolvedValue(null);
      res.status = jest.fn().mockReturnValue(res);
      res.json = jest.fn();

      await updateTask(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe('deleteTask', () => {
    it('should delete the task and return 200', async () => {
      req.params = { id: 'taskid' };
      const mockTask = {
        _id: 'taskid',
        user: { equals: (id) => id === req.user._id },
      };
      TaskModel.findById = jest.fn().mockResolvedValue(mockTask);
      TaskModel.findByIdAndDelete = jest.fn().mockResolvedValue();
      res.status = jest.fn().mockReturnValue(res);
      res.json = jest.fn();

      await deleteTask(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Task deleted successfully' });
    });

    it('should return 404 if task does not exist', async () => {
      req.params = { id: 'notfound' };
      TaskModel.findById = jest.fn().mockResolvedValue(null);
      res.status = jest.fn().mockReturnValue(res);
      res.json = jest.fn();

      await deleteTask(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });
});