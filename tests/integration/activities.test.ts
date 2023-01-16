import app, { init } from "@/app";
import faker from "@faker-js/faker";
import { TicketStatus } from "@prisma/client";
import httpStatus from "http-status";
import * as jwt from "jsonwebtoken";
import supertest from "supertest";
import {
  createEnrollmentWithAddress,
  createUser,
  createTicket,
  createPayment,
  createTicketTypeWithHotel,
  createTicketTypeRemote,
  createActivityDate,
  createActivityLocal,
  createActivity,
  createActivityRegister,
  createActivityWithNoCapacity,
  createActivityWithSpecificTime
} from "../factories";
import { cleanDb, generateValidToken } from "../helpers";

beforeAll(async () => {
  await init();
});

beforeEach(async () => {
  await cleanDb();
});

const server = supertest(app);

describe("GET activities/dates", () => {
  it("should respond with status 401 if no token is given", async () => {
    const response = await server.get("/activities/dates");

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if given token is not valid", async () => {
    const token = faker.lorem.word();

    const response = await server.get("/activities/dates").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if there is no session for given token", async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.get("/activities/dates").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe("when token is valid", () => {
    it("should respond with status 404 when user has no enrollment ", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
    
      const response = await server.get("/activities/dates").set("Authorization", `Bearer ${token}`);
  
      expect(response.status).toEqual(httpStatus.NOT_FOUND);
    });

    it("should respond with status 402 if user has no paid ticket", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeWithHotel();
      await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);
  
      const response = await server.get("/activities/dates").set("Authorization", `Bearer ${token}`);
  
      expect(response.status).toEqual(httpStatus.PAYMENT_REQUIRED);
    });

    it("should respond with status 403 if user has a remote ticket", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeRemote();
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      await createPayment(ticket.id, ticketType.price);

      const response = await server.get("/activities/dates").set("Authorization", `Bearer ${token}`);
    
      expect(response.status).toEqual(httpStatus.FORBIDDEN);
    });

    it("should respond with status 200 and data when user has a paid ticket with hotel", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeWithHotel();
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      await createPayment(ticket.id, ticketType.price);
      const activityDate = await createActivityDate();

      const response = await server.get("/activities/dates").set("Authorization", `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.OK);
     
      expect(response.body).toEqual([
        {
          id: activityDate.id,
          date: activityDate.date.toISOString(),
          createdAt: activityDate.createdAt.toISOString(),
          updatedAt: activityDate.updatedAt.toISOString(),
        },
      ]);
    });
  });
});

describe("GET activities/dates/:activityDateId", () => {
  it("should respond with status 401 if no token is given", async () => {
    const response = await server.get("/activities/dates/1");

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if given token is not valid", async () => {
    const token = faker.lorem.word();

    const response = await server.get("/activities/dates/1").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if there is no session for given token", async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.get("/activities/dates/1").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe("when token is valid", () => {
    it("should respond with status 404 when user has no enrollment ", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
    
      const response = await server.get("/activities/dates/1").set("Authorization", `Bearer ${token}`);
  
      expect(response.status).toEqual(httpStatus.NOT_FOUND);
    });

    it("should respond with status 402 if user has no paid ticket", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeWithHotel();
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);
      await createPayment(ticket.id, ticketType.price);
      const activityDate = await createActivityDate();
  
      const response = await server.get(`/activities/dates/${activityDate.id}`).set("Authorization", `Bearer ${token}`);
  
      expect(response.status).toEqual(httpStatus.PAYMENT_REQUIRED);
    });

    it("should respond with status 403 if user has a remote ticket", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeRemote();
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      await createPayment(ticket.id, ticketType.price);

      const response = await server.get("/activities/dates/1").set("Authorization", `Bearer ${token}`);
    
      expect(response.status).toEqual(httpStatus.FORBIDDEN);
    });

    it("should respond with status 200 and ActivityDate when user has a paid ticket with hotel", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeWithHotel();
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      await createPayment(ticket.id, ticketType.price);
      const activityDate = await createActivityDate();
      const activityLocal = await createActivityLocal();
      const activity = await createActivity(activityDate.id, activityLocal.id);

      const response = await server.get(`/activities/dates/${activityDate.id}`).set("Authorization", `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.OK);

      expect(response.body).toEqual([
        {
          id: activity.id,
          name: activity.name,
          ActivityLocal: {
            createdAt: activityLocal.createdAt.toISOString(),
            updatedAt: activityLocal.updatedAt.toISOString(),
            name: activityLocal.name,
            id: activityLocal.id,
          },
          capacity: activity.capacity,
          startAt: activity.startAt.toISOString(),
          endAt: activity.endAt.toISOString(),
          activityDateId: activityDate.id,
          activityLocalId: activityLocal.id,
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        },
      ]);
    });

    it("should respond with status 404 when no activities are found", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeWithHotel();
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      await createPayment(ticket.id, ticketType.price);
      const activityDate = await createActivityDate();

      const response = await server.get(`/activities/dates/${activityDate.id}`).set("Authorization", `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.NOT_FOUND);
    });
  });
});

describe("GET activities/registers/:activityId", () => {
  it("should respond with status 401 if no token is given", async () => {
    const response = await server.get("/activities/registers/1");

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if given token is not valid", async () => {
    const token = faker.lorem.word();

    const response = await server.get("/activities/registers/1").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if there is no session for given token", async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.get("/activities/registers/1").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe("when token is valid", () => {
    it("should respond with status 200 and data when an Actitivity Register is found", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeWithHotel();
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      await createPayment(ticket.id, ticketType.price);
      const activityDate = await createActivityDate();
      const activityLocal = await createActivityLocal();
      const activity = await createActivity(activityDate.id, activityLocal.id);
      await createActivityRegister(user.id, activity.id);

      const response = await server.get(`/activities/registers/${activity.id}`).set("Authorization", `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.OK);

      expect(response.body).toEqual(
        {
          isRegistered: true,
          registersCount: 1
        });
    });
  });
});

describe("GET activities/locals", () => {
  it("should respond with status 401 if no token is given", async () => {
    const response = await server.get("/activities/locals");

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if given token is not valid", async () => {
    const token = faker.lorem.word();

    const response = await server.get("/activities/locals").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if there is no session for given token", async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.get("/activities/locals").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe("when token is valid", () => {
    it("should respond with status 404 when user has no enrollment ", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
    
      const response = await server.get("/activities/locals").set("Authorization", `Bearer ${token}`);
  
      expect(response.status).toEqual(httpStatus.NOT_FOUND);
    });

    it("should respond with status 402 if user has no paid ticket", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeWithHotel();
      await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);
  
      const response = await server.get("/activities/locals").set("Authorization", `Bearer ${token}`);
  
      expect(response.status).toEqual(httpStatus.PAYMENT_REQUIRED);
    });

    it("should respond with status 403 if user has a remote ticket", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeRemote();
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      await createPayment(ticket.id, ticketType.price);

      const response = await server.get("/activities/locals").set("Authorization", `Bearer ${token}`);
    
      expect(response.status).toEqual(httpStatus.FORBIDDEN);
    });

    it("should respond with status 200 and data when user has a paid ticket with hotel", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeWithHotel();
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      await createPayment(ticket.id, ticketType.price);
      const activityLocal = await createActivityLocal();

      const response = await server.get("/activities/locals").set("Authorization", `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.OK);
     
      expect(response.body).toEqual([
        {
          createdAt: activityLocal.createdAt.toISOString(),
          updatedAt: activityLocal.updatedAt.toISOString(),
          name: activityLocal.name,
          id: activityLocal.id,
        },
      ]);
    });

    it("should respond with status 404 when no data is found", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeWithHotel();
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      await createPayment(ticket.id, ticketType.price);

      const response = await server.get("/activities/locals").set("Authorization", `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.NOT_FOUND);
    });
  });
});

describe("POST activities/", () => {
  it("should respond with status 401 if no token is given", async () => {
    const body = createValidBody();

    const response = await (await server.post("/activities"));
    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if given token is not valid", async () => {
    const token = faker.lorem.word();
    const body = createValidBody();

    const response = await (await server.post("/activities").set("Authorization", `Bearer ${token}`).send(body));

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if there is no session for given token", async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);
    const body = createValidBody();

    const response = await (await server.post("/activities").set("Authorization", `Bearer ${token}`).send(body));

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe("when token is valid", () => {
    it("should respond with status 404 when user has no enrollment ", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const body = createValidBody();

      const response = await (await server.post("/activities").set("Authorization", `Bearer ${token}`).send(body));
  
      expect(response.status).toEqual(httpStatus.NOT_FOUND);
    });

    it("should respond with status 402 if user has no paid ticket", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeWithHotel();
      await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);
      const body = createValidBody();

      const response = await (await server.post("/activities").set("Authorization", `Bearer ${token}`).send(body));
  
      expect(response.status).toEqual(httpStatus.PAYMENT_REQUIRED);
    });

    it("should respond with status 403 if user has a remote ticket", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeRemote();
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      await createPayment(ticket.id, ticketType.price);
      const body = createValidBody();

      const response = await (await server.post("/activities").set("Authorization", `Bearer ${token}`).send(body));
    
      expect(response.status).toEqual(httpStatus.FORBIDDEN);
    });

    it("should respond with status 404 if no activity is found", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeWithHotel();
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      await createPayment(ticket.id, ticketType.price);
      const body = createValidBody();

      const response = await (await server.post("/activities").set("Authorization", `Bearer ${token}`).send(body));

      expect(response.status).toEqual(httpStatus.NOT_FOUND);
    });

    it("should respond with status 403 if there's no capacity for a new register", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeWithHotel();
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      await createPayment(ticket.id, ticketType.price);
      const activityDate = await createActivityDate();
      const activityLocal = await createActivityLocal();
      const activity = await createActivityWithNoCapacity(activityDate.id, activityLocal.id);
      const body = {
        "activityId": activity.id
      };
      const response = await (await server.post("/activities").set("Authorization", `Bearer ${token}`).send(body));

      expect(response.status).toEqual(httpStatus.FORBIDDEN);
    });

    it("should respond with status 409 if there's a time conflict", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeWithHotel();
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      await createPayment(ticket.id, ticketType.price);
      const activityDate = await createActivityDate();
      const activityLocal = await createActivityLocal();
      const activity = await createActivity(activityDate.id, activityLocal.id);
      await createActivityRegister(user.id, activity.id);
      const conflictingActivity = await createActivityWithSpecificTime(activityDate.id, activityLocal.id, activity.startAt, activity.endAt);
      const body = {
        "activityId": conflictingActivity.id
      };
      
      const response = await (await server.post("/activities").set("Authorization", `Bearer ${token}`).send(body));

      expect(response.status).toEqual(httpStatus.CONFLICT);
    });
    
    it("should respond with status 201 when a register is created", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeWithHotel();
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      await createPayment(ticket.id, ticketType.price);
      const activityDate = await createActivityDate();
      const activityLocal = await createActivityLocal();
      const activity = await createActivity(activityDate.id, activityLocal.id);
     
      const body = {
        "activityId": activity.id
      };
      const response = await (await server.post("/activities").set("Authorization", `Bearer ${token}`).send(body));

      expect(response.status).toEqual(httpStatus.CREATED);
    });
  });
});

function createValidBody() {
  return {
    "activityId": 1
  };
}

