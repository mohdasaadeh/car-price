import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

import { AppModule } from './../src/app.module';

describe('Authentication Routes (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/users/signup (POST)', async () => {
    const testEmail = 'test@test.com';

    const res = await request(app.getHttpServer())
      .post('/users/signup')
      .send({ email: testEmail, password: '123' })
      .expect(201);

    const { id, email } = res.body;

    expect(id).toBeDefined;
    expect(email).toEqual(testEmail);
    expect(res.get('Set-Cookie')).toBeDefined();
  });

  it('the whole authentication process works successfully', async () => {
    const testEmail = 'test@test.com';

    await request(app.getHttpServer())
      .post('/users/signup')
      .send({ email: testEmail, password: '123' })
      .expect(201);

    const signoutRes = await request(app.getHttpServer())
      .post('/users/signout')
      .expect(201);

    expect(signoutRes.get('Set-Cookie')).toBeDefined();

    const signinRes = await request(app.getHttpServer())
      .post('/users/signin')
      .send({ email: testEmail, password: '123' })
      .expect(201);

    const { id, email } = signinRes.body;

    expect(id).toBeDefined;
    expect(email).toEqual(testEmail);
    expect(signinRes.get('Set-Cookie')).toBeDefined();
  });
});
