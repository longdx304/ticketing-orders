import { OrderCancelledEvent, Publisher, Subjects } from '@ldxtickets/common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
}
