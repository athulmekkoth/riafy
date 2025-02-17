import request from 'supertest';
import express from 'express';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import authRoute from '../BookingRoute.js';
import User from '../../schema/BookingSchema.js';

const app = express();
app.use(express.json());
app.use('/auth', authRoute);

process.env.JWT_SECRET = 'testsecret';

beforeAll(async () => {
  await mongoose.connect('mongodb://localhost/test_db')
});

beforeEach(async () => {
  await User.deleteMany();

         const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash('password123', salt);
  await new User({
    name: 'aswin',
    email: 'aswin@example.com',
    password: hashedPassword, 
  }).save();
});

afterAll(async () => {
  await mongoose.connection.close(); 
});

describe('POST /signup', () => {
  it('should create a new user and return status 201', async () => {
    const newUser = {
      name: 'athul',
      email: 'athul@gmail.com',
      password: 'athul@123',
    };

    const response = await request(app).post('/auth/signup').send(newUser);

    expect(response.status).toBe(201);
    expect(response.body.message).toBe('User signed up successfully');
  });

  it('should return an error if the user already exists', async () => {
    const existingUser = {
      name: 'aswin',
      email: 'aswin@example.com',
      password: 'password123',
    };

    const response = await request(app).post('/auth/signup').send(existingUser);

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('User already exists');
  });

  it('should return an error if required fields are missing', async () => {
    const response = await request(app).post('/auth/signup').send({
      email: 'test@example.com', 
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('All fields are required');
  });
});

describe('POST /login', () => {
  it('should log in a user with correct credentials', async () => {
     const isMatch = await bcrypt.compare(password, user.password);
    const response = await request(app).post('/auth/login').send({
      email: 'asswin@example.com',
      password: 'password123',
    });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Login successful');
  });

  it('should return an error if the email is not registered', async () => {
    const response = await request(app).post('/auth/login').send({
      email: 'fake@gmail.com',
      password: 'password123',
    });

    expect(response.status).toBe(400);
  
  });

  it('should return an error if the password is incorrect', async () => {
    const response = await request(app).post('/auth/login').send({
      email: 'aswin@example.com',
      password: 'wrongpassword',
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Invalid credentials');
  });
});
