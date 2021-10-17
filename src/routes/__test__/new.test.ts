import request from 'supertest';

import { app } from '../../app';
import { Order, OrderStatus } from '../../models/order';
import { Ticket } from '../../models/ticket';
import { natsWrapper } from '../../nats-wrapper';

it('returns an error if the ticket does not exist', async () => {
  const ticketId = global.createId();

  await request(app)
    .post('/api/orders')
    .set('Cookie', global.signin())
    .send({ ticketId })
    .expect(404);
});

it('returns an error if the ticket is already reserved', async () => {
  // create & save ticket
  const ticket = Ticket.build({
    title: 'concert',
    price: 20,
    id: global.createId(),
  });
  await ticket.save();

  // create & save order with associated ticket
  const order = Order.build({
    ticket,
    userId: 'asdas',
    status: OrderStatus.Created,
    expiresAt: new Date(),
  });
  await order.save();

  // make the request and expect 400
  await request(app)
    .post('/api/orders')
    .set('Cookie', global.signin())
    .send({ ticketId: ticket.id })
    .expect(400);
});

it('reserves a ticket', async () => {
  // create a ticket
  const ticket = Ticket.build({
    title: 'concert',
    price: 20,
    id: global.createId(),
  });
  await ticket.save();

  // request and expect 201
  await request(app)
    .post('/api/orders')
    .set('Cookie', global.signin())
    .send({ ticketId: ticket.id })
    .expect(201);
});

it('emits an order created event', async () => {
  // create a ticket
  const ticket = Ticket.build({
    title: 'concert',
    price: 20,
    id: global.createId(),
  });
  await ticket.save();

  // request and expect 201
  await request(app)
    .post('/api/orders')
    .set('Cookie', global.signin())
    .send({ ticketId: ticket.id })
    .expect(201);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
