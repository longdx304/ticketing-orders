import { Publisher, OrderCreatedEvent, Subjects } from '@ldxtickets/common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
}
